from fastapi import APIRouter, Depends
from queries.users import (
    # UsersIn,
    UsersOut,
    UserRepository,
    Error,
    # UserQueries,
)
from typing import Union, List

# from db import BookQueries as BookQ # our database queries


router = APIRouter()

# @router.get("/api/users/", response_model=UsersOut)
# def user_details(queries: UserQueries = Depends()):
#     return {
#         "users": queries.get_all_users()
#     }


@router.get("/api/users/", response_model=Union[Error, List[UsersOut]])
def user_details(repo: UserRepository = Depends()):
    return repo.get_all()
