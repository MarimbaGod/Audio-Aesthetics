from fastapi import APIRouter, Depends, HTTPException, status
from queries.memberships import (
    MembershipsRepo,
    Error,
    SuccessMessage,
)
from typing import Union
from authenticator import authenticator

router = APIRouter()


@router.post(
    "/api/groups/{group_id}/memberships",
    response_model=Union[SuccessMessage, Error],
)
async def add_user_to_group(
    group_id: int,
    user_id: int,
    current_user: dict = Depends(authenticator.get_current_account_data),
    memberships_repo: MembershipsRepo = Depends(),
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
    return memberships_repo.add_user_to_group(user_id, group_id, requestor_id)


@router.delete(
    "/api/groups/{group_id}/memberships/{user_id}",
    response_model=Union[SuccessMessage, Error],
)
async def remove_member_from_group(
    group_id: int,
    user_id: int,
    current_user: dict = Depends(authenticator.get_current_account_data),
    memberships_repo: MembershipsRepo = Depends(),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    requestor_id = current_user.get("id")
    if not requestor_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user"
        )

    return memberships_repo.remove_member(group_id, user_id, requestor_id)


@router.post(
    "/api/groups/{group_id}/memberships/{user_id}",
    response_model=Union[SuccessMessage, Error],
)
async def make_admin(
    group_id: int,
    user_id_to_promote: int,
    current_user: dict = Depends(authenticator.get_current_account_data),
    memberships_repo: MembershipsRepo = Depends(),
):
    try:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not Authenticated",
            )

        requestor_id = current_user.get("id")
        if not requestor_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid User",
            )

        # Use the existing make_admin method to make the specified
        # user an admin
        result = memberships_repo.make_admin(
            group_id, user_id_to_promote, requestor_id
        )

        if isinstance(result, SuccessMessage):
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.message,
            )

    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to make user an admin",
        )


@router.delete(
    "/api/groups/{group_id}/memberships/{user_id}",
    response_model=Union[SuccessMessage, Error],
)
async def remove_admin(
    group_id: int,
    user_id_to_demote: int,
    current_user: dict = Depends(authenticator.get_current_account_data),
    memberships_repo: MembershipsRepo = Depends(),
):
    try:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not Authenticated",
            )

        requestor_id = current_user.get("id")
        if not requestor_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid User",
            )

        # Use the existing remove_admin method to make the specified
        # user an admin
        result = memberships_repo.remove_admin(
            group_id, user_id_to_demote, requestor_id
        )

        if isinstance(result, SuccessMessage):
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.message,
            )

    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to demote user",
        )
