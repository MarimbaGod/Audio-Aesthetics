from fastapi import (
    APIRouter,
    Depends,
    status,
    HTTPException,
)


from queries.posts import (
    PostIn,
    PostOut,
    PostRepository,
    Error,
)

from pydantic import BaseModel
from authenticator import authenticator
from typing import Union, List

# from db import BookQueries as BookQ # our database queries


class HttpError(BaseModel):
    detail: str


router = APIRouter()


# Get all posts
@router.get("/api/posts/", response_model=Union[Error, List[PostOut]])
def get_all_posts(repo: PostRepository = Depends()):
    return repo.get_all()


# Create post endpoint framework for now
@router.post("/api/posts", response_model=Union[PostOut, Error])
async def create_post(
    post_data: PostIn,
    account_data: dict = Depends(authenticator.get_current_account_data),
    post_repo: PostRepository = Depends(),
):
    if not account_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    account_id = account_data.get("id")
    if post_data.created_by == account_id:
        return post_repo.create(post_data)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User Data",
        )


# View specific post
@router.get("/api/posts/{post_id}", response_model=Union[PostOut, Error])
async def get_specific_post(
    post_id: int,
    post_repo: PostRepository = Depends(),
):
    return post_repo.get_post(post_id)


@router.delete("/api/posts/{post_id}", response_model=Union[bool, Error])
async def delete_post(
    post_id: int,
    post_repo: PostRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
) -> Union[bool, Error]:
    requestor_id = account_data.get("id")
    if not requestor_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User",
        )

    # Will be true or ERROR
    # if result is an instance of Error, this logs the error
    post = post_repo.get_post(post_id)
    account_id = account_data.get("id")

    if post.created_by == account_id:
        return post_repo.delete(post_id)

    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized to delete this post",
        )
