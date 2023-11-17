from fastapi import APIRouter, Depends, Response, Request, status, HTTPException
from queries.users import (
    UserIn,
    UserOut,
    UserRepository,
    Error,
    # UserQueries,
)
from jwtdown_fastapi.authentication import Token

from pydantic import BaseModel
from authenticator import authenticator
from typing import Union, List

# from db import BookQueries as BookQ # our database queries

class UserForm(BaseModel):
    username: str
    password: str

class UserToken(Token):
    account: UserOut

class HttpError(BaseModel):
    detail: str


router = APIRouter()

# @router.get("/api/protected", response_model = bool)


@router.get("/api/users/", response_model=Union[Error, List[UserOut]])
def user_details(repo: UserRepository = Depends()):
    return repo.get_all()


@router.get("/token", response_model=UserToken | None)
async def get_token(
    request: Request,
    account: UserOut = Depends(authenticator.try_get_current_account_data)
) -> UserToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }


@router.post("/api/users", response_model=UserToken | HttpError)
async def create_user(
    info: UserIn,
    request: Request,
    response: Response,
    repo: UserRepository = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = repo.create(info, hashed_password)
    except DuplicateUserError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create a user with those credentials",
        )
    form = UserForm(username=info.username, password=info.password)
    token = await authenticator.login(response, request, form, repo)
    return UserToken(account=account, **token.dict())
