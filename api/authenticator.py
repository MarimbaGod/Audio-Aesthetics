import os
from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from queries.users import UserRepository, UserOut, UserIn, UserOutWithPassword


class MyAuthenticator(Authenticator):
    async def get_account_data(
        self,
        username: str,
        users: UserRepository,
    ):
        return users.get_user(username)

    def get_account_getter(
        self,
        users: UserRepository = Depends(),
    ):
        return users

    def get_hashed_password(self, user: UserOutWithPassword):
        # Return encrypted password from userout with password object
        return user.hashed_password

    def get_account_data_for_cookie(self, user: UserIn):
        # Return the username for the data for the cookie
        # Return TWO values from this method
        return user.username, UserOut(**user.dict())


authenticator = MyAuthenticator(os.environ["SIGNING_KEY"])
