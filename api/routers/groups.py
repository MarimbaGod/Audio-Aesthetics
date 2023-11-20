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


router = APIRouter()


@router.get("/api/groups/", response_model=Union[Error, List[GroupOut]])
def get_all_groups(repo: GroupsRepo = Depends()):
    return repo.get_all()


@router.post("/api/groups", response_model=Union[GroupOut, Error])
async def create_group(
    group_data: GroupIn,
    user_repo: UserRepository = Depends(),
    group_repo: GroupsRepo = Depends(),
):
    return group_repo.create_group(group_data, user_repo)
