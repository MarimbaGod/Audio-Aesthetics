from fastapi import (
    APIRouter,
    Depends,
    Response,
    Request,
    status,
    HTTPException,
)
from queries.users import (
    UserIn,
    UserOut,
    UserRepository,
    Error,
    DuplicateUserError,
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
def get_all_users(repo: UserRepository = Depends()):
    return repo.get_all()


@router.get("/token", response_model=UserToken | None)
async def get_token(
    request: Request,
    account: UserOut = Depends(authenticator.try_get_current_account_data),
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


# @router.get("/api/users/{user_id}", response_model=UserOut | HttpError)
# async def get_one_user(
#     user_id: int,
#     response: Response,
#     repo: UserRepository = Depends(),
# ) -> UserOut:
#     user = repo.get_one(user_id)
#     if user is None:
#         response.status_code = 404
#         return {"detail": "404 USER NOT FOUND"}
#     return user


@router.get("/api/users/{user_id}", response_model=UserOut | HttpError)
async def get_user_data(
    user_id: int,
    repo: UserRepository = Depends(),
    user_data: dict = Depends(authenticator.get_current_account_data),
):
    if user_id == user_data["id"]:
        user = repo.get_one(user_id)
        if user:
            return user
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized Access",
        )


@router.delete("/api/users/{user_id}", response_model=bool | HttpError)
async def delete(
    user_id: int,
    repo: UserRepository = Depends(),
    user_data: dict = Depends(authenticator.get_current_account_data),
) -> bool | None:
    if user_id == user_data["id"]:
        print("Deleted user")
        return repo.delete(user_id)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized Access",
        )


@router.put("/api/users/{user_id}", response_model=UserOut | HttpError)
async def update_user(
    user_id: int,
    user_edit: UserIn,
    repo: UserRepository = Depends(),
    user_data: dict = Depends(authenticator.get_current_account_data),
) -> UserOut:
    if user_id == user_data["id"]:
        hashed_password = authenticator.hash_password(user_edit.password)
        return repo.update(user_edit, user_id, hashed_password)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized Access",
        )


@router.get("/api/user/details")
async def get_user_details(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends()
):
    user_details = user_repo.get_user_details(current_user["id"])

    # Directly set token values
    user_details["spotify_access_token"] = user_details.get(
        "spotify_access_token", "Token not available"
    )
    user_details["spotify_refresh_token"] = user_details.get(
        "spotify_refresh_token", "Token not available"
    )
    # spotify_access_token = user_details.get("spotify_access_token")
    # if spotify_access_token:
    #     user_details["spotify_access_token"] = spotify_access_token
    # else:
    #     user_details["spotify_access_token"] = "Token not available"

    return user_details
