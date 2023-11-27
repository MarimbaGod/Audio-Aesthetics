from fastapi import APIRouter, Depends, HTTPException, status
from queries.blacklist import TheBlacklist
from queries.memberships import Error
from typing import Union, List, Dict
from authenticator import authenticator

router = APIRouter()


@router.post(
    "/api/groups/{group_id}/blacklist", response_model=Union[List[Dict], Error]
)
async def get_blacklist(
    group_id: int,
    current_user: dict = Depends(authenticator.get_current_account_data),
    blacklist_repo: TheBlacklist = Depends(),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authenticated",
        )

    requestor_id = current_user.get("id")
    if not requestor_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid User"
        )
    return blacklist_repo.get_blacklist(group_id, requestor_id)


@router.post("/api/groups/{group_id}/blacklist/add")
async def add_user_to_blacklist(
    group_id: int,
    user_id: int,
    current_user: dict = Depends(authenticator.get_current_account_data),
    blacklist_repo: TheBlacklist = Depends(),
):
    # Auth Check in query methods
    requestor_id = current_user.get("id")
    if not requestor_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid User"
        )

    result = blacklist_repo.add_to_blacklist(group_id, user_id, requestor_id)
    return result


@router.delete("/api/groups/{group_id}/blacklist/remove")
async def remove_user_from_blacklist(
    group_id: int,
    user_id: int,
    current_user: dict = Depends(authenticator.get_current_account_data),
    blacklist_repo: TheBlacklist = Depends(),
):
    requestor_id = current_user.get("id")
    if not requestor_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid User"
        )

    result = blacklist_repo.remove_from_blacklist(
        group_id, user_id, requestor_id
    )
    return result
