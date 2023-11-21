from fastapi import APIRouter, Depends
from queries.groups import (
    GroupIn,
    GroupOut,
    GroupsRepo,
    # MembershipsIn,
    # MembershipsOut,
    Error,
)
from queries.users import UserRepository
from typing import Union, List
from authenticator import authenticator


router = APIRouter()


@router.get("/api/groups/", response_model=Union[Error, List[GroupOut]])
def get_all_groups(repo: GroupsRepo = Depends()):
    return repo.get_all()


@router.post("/api/groups", response_model=Union[GroupOut, Error])
async def create_group(
    group_data: GroupIn,
    account_data: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
    group_repo: GroupsRepo = Depends(),
):
    if not account_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    username = account_data.get("username")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User Data"
        )

    return group_repo.create_group(group_data, user_repo)
