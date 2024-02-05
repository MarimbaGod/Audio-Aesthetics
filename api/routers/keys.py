# from fastapi import HTTPException, APIRouter, Depends
# import os
# from queries.users import UserRepository


# from dotenv import load_dotenv

# load_dotenv()
# router = APIRouter()


# @router.post("/store-openai-key")
# async def store_openai_key(
#     openai_api_key: str,
#     user_repo: UserRepository = Depends(UserRepository),
# ):
#     """
#     Store the user's OpenAI API key in the database.
#     """
#     user_id = 1
