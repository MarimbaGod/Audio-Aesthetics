from pydantic import BaseModel
from typing import Union, List, Optional
from queries.pool import pool


class Error(BaseModel):
    message: str


class UserIn(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    email: str


class UserOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str


class UserOutWithSpotify(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    spotify_access_token: Optional[str]
    spotify_refresh_token: Optional[str]


class UserOutWithPassword(UserOut):
    hashed_password: str


class DuplicateUserError(ValueError):
    pass


class UserRepository:
    def get_all(self) -> Union[Error, List[UserOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT *
                        FROM users
                        ORDER BY username;
                        """
                    )
                    result = []
                    for user in db:
                        user = UserOut(
                            id=user[0],
                            username=user[1],
                            first_name=user[3],
                            last_name=user[4],
                            email=user[5],
                        )
                        result.append(user)
                    return result
        except Exception as e:
            print(e)
            return {"message:" "Could not get all users"}

    def create(
        self, user: UserIn, hashed_password: str
    ) -> UserOutWithPassword:
        try:
            print("USER", user)
            print("HASHED", hashed_password)
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO users
                            (username,
                            hashed_password,
                            first_name,
                            last_name,
                            email)
                        VALUES
                            (%s, %s, %s, %s, %s)
                        RETURNING *;
                        """,
                        [
                            user.username,
                            hashed_password,
                            user.first_name,
                            user.last_name,
                            user.email,
                        ],
                    )
                    print("insert worked?")
                    id = result.fetchone()[0]
                    print("ID GOTTEN", id)
                    return UserOutWithPassword(
                        id=id,
                        username=user.username,
                        hashed_password=hashed_password,
                        first_name=user.first_name,
                        last_name=user.last_name,
                        email=user.email,
                    )
        except Exception:
            return {"message": "Could not create a user"}

    def get_user_id_by_username(self, username: str) -> int:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """SELECT id
                        FROM users
                        WHERE username = %s""",
                        (username,),
                    )
                    user = db.fetchone()
                    return user[0] if user else None
        except Exception as e:
            print(e)
            return None

    def get_user(self, username: str) -> UserOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM users
                    WHERE username = %s
                    """,
                    [
                        username,
                    ],
                )
                user = result.fetchone()

                return UserOutWithPassword(
                    id=user[0],
                    username=user[1],
                    hashed_password=user[2],
                    first_name=user[3],
                    last_name=user[4],
                    email=user[5],
                )

    def get_user_details(self, user_id: int) -> UserOutWithSpotify:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT id,
                    username, first_name,
                    last_name, email,
                    spotify_access_token,
                    spotify_refresh_token
                    FROM users
                    WHERE id = %s
                    """,
                    [user_id],
                )
                user = result.fetchone()
                if user:
                    return {
                        "id": user[0],
                        "username": user[1],
                        "first_name": user[2],
                        "last_name": user[3],
                        "email": user[4],
                        "spotify_access_token": user[5],
                        "spotify_refresh_token": user[6]
                    }
                else:
                    return None

    def get_one(self, user_id: int) -> UserOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM users
                    WHERE id = %s
                    """,
                    [
                        user_id,
                    ],
                )
                user = result.fetchone()

                return UserOut(
                    id=user[0],
                    username=user[1],
                    first_name=user[3],
                    last_name=user[4],
                    email=user[5],
                )

    def delete(self, user_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    DELETE
                    FROM users
                    WHERE id = %s
                    """,
                    [
                        user_id,
                    ],
                )
                return True

    def update(
        self, user_edit: UserIn, user_id: int, hashed_password: str
    ) -> UserOut:
        try:
            # print("USER", user)
            # print("HASHED", hashed_password)
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                            UPDATE users
                            SET username = %s
                                , hashed_password = %s
                                , first_name = %s
                                , last_name = %s
                                , email = %s
                            WHERE id = %s
                            RETURNING *;
                            """,
                        [
                            user_edit.username,
                            hashed_password,
                            user_edit.first_name,
                            user_edit.last_name,
                            user_edit.email,
                            user_id,
                        ],
                    )
                    # print("insert worked?")
                    updated = db.fetchone()
                    # print("ID GOTTEN", id)
                    return UserOut(
                        id=updated[0],
                        username=updated[1],
                        first_name=updated[3],
                        last_name=updated[4],
                        email=updated[5],
                    )
        except Exception:
            return {"message": "Could not update"}

    def update_spotify_tokens(
        self, user_id: int, spotify_access: str, spotify_refresh: str
    ):
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE users
                        SET spotify_access_token = %s,
                            spotify_refresh_token = %s
                        WHERE id = %s;
                        """,
                        [spotify_access, spotify_refresh, user_id]
                    )
                    conn.commit()
        except Exception as e:
            print("Error updating Spotify Tokens", e)
