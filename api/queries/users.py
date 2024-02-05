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
    img_url: Optional[str] = "https://tinyurl.com/Dimg-url"


class UserOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    img_url: Optional[str] = "https://tinyurl.com/Dimg-url"


class UserOutWithSpotify(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    img_url: Optional[str] = "https://tinyurl.com/Dimg-url"
    spotify_access_token: Optional[str]
    spotify_refresh_token: Optional[str]
    spotify_device_id: Optional[str] = None


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
                            img_url=user[6],
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
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO users
                            (username,
                            hashed_password,
                            first_name,
                            last_name,
                            email,
                            img_url)
                        VALUES
                            (%s, %s, %s, %s, %s, %s)
                        RETURNING *;
                        """,
                        [
                            user.username,
                            hashed_password,
                            user.first_name,
                            user.last_name,
                            user.email,
                            user.img_url,
                        ],
                    )
                    id = result.fetchone()[0]
                    return UserOutWithPassword(
                        id=id,
                        username=user.username,
                        hashed_password=hashed_password,
                        first_name=user.first_name,
                        last_name=user.last_name,
                        email=user.email,
                        img_url=user.img_url,
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
                    img_url=user[6],
                )

    def follow_user(
        self, follower_id: int, following_id: int
    ) -> Union[Error, dict]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    # Check if following
                    db.execute(
                        """
                        SELECT active
                        FROM user_follows
                        WHERE follower_user_id = %s
                        AND following_user_id = %s
                        """,
                        [follower_id, following_id],
                    )
                    result = db.fetchone()
                    if result and result[0]:
                        return {
                            "message": "Sorry SuperFan, can't double follow"
                        }

                    db.execute(
                        """
                        INSERT INTO user_follows
                        (follower_user_id, following_user_id, active)
                        VALUES (%s, %s, TRUE)
                        ON CONFLICT (follower_user_id, following_user_id)
                        DO UPDATE SET active = TRUE;
                        """,
                        [follower_id, following_id],
                    )
                    return {"message": "Followed :D"}
        except Exception as e:
            return {"message": f"Error: {str(e)}"}

    def unfollow_user(
        self, follower_id: int, following_id: int
    ) -> Union[Error, dict]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE user_follows
                        SET active = FALSE
                        WHERE follower_user_id = %s
                        AND following_user_id = %s;
                        """,
                        [follower_id, following_id],
                    )
                    return {"message": "Unfollowed the loser"}
        except Exception as e:
            return {"message": f"Error: {str(e)}"}

    def get_user_details(self, user_id: int) -> UserOutWithSpotify:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT id,
                    username, first_name,
                    last_name, email, img_url,
                    spotify_access_token,
                    spotify_refresh_token,
                    spotify_device_id
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
                        "img_url": user[5],
                        "spotify_access_token": user[6],
                        "spotify_refresh_token": user[7],
                        "spotify_device_id": user[8],
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
                    img_url=user[6],
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
                                , img_url = %s
                            WHERE id = %s
                            RETURNING *;
                            """,
                        [
                            user_edit.username,
                            hashed_password,
                            user_edit.first_name,
                            user_edit.last_name,
                            user_edit.email,
                            user_edit.img_url,
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
                        img_url=updated[6],
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
                        [spotify_access, spotify_refresh, user_id],
                    )
                    conn.commit()
        except Exception as e:
            print("Error updating Spotify Tokens", e)

    def get_followers(self, user_id: int) -> Union[Error, List[UserOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT u.id,
                            u.username,
                            u.first_name,
                            u.last_name,
                            u.email,
                            u.img_url
                        FROM users u
                        INNER JOIN user_follows uf
                        ON uf.follower_user_id = u.id
                        WHERE uf.following_user_id = %s
                        AND uf.active = TRUE;
                        """,
                        (user_id,),
                    )
                    followers = db.fetchall()
                    return [
                        UserOut(
                            id=follower[0],
                            username=follower[1],
                            first_name=follower[2],
                            last_name=follower[3],
                            email=follower[4],
                            img_url=follower[5],
                        )
                        for follower in followers
                    ]
        except Exception as e:
            print(e)
            return {"message": "Failed to get Followers"}

    def get_following(self, user_id: int) -> Union[Error, List[UserOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT u.id,
                            u.username,
                            u.first_name,
                            u.last_name,
                            u.email,
                            u.img_url
                        FROM users u
                        INNER JOIN user_follows uf
                        ON uf.following_user_id = u.id
                        WHERE uf.follower_user_id = %s
                        AND uf.active = TRUE;
                        """,
                        (user_id,),
                    )
                    following = db.fetchall()
                    return [
                        UserOut(
                            id=user[0],
                            username=user[1],
                            first_name=user[2],
                            last_name=user[3],
                            email=user[4],
                            img_url=user[5],
                        )
                        for user in following
                    ]
        except Exception as e:
            print(e)
            return {"message": "Failed to get followed users"}

    def check_following(
        self, follower_user_id: int, following_user_id: int
    ) -> Union[Error, List[UserOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT COUNT(*)
                        FROM user_follows
                        WHERE follower_user_id = %s
                        AND following_user_id = %s
                        AND active = TRUE;
                        """,
                        [follower_user_id, following_user_id],
                    )
                    result = db.fetchone()
                    if result and result[0] > 0:
                        return True
                    return False

        except Exception as e:
            print(f"Error checking if the user is following: {e}")
            return False

    def update_spotify_device_id(
        self, user_id: int, spotify_device_id: str
    ):
        try:
            with pool.connetion() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE users
                        SET spotify_device_id = %s
                        WHERE id = %s
                        """,
                        [spotify_device_id, user_id]
                    )
                    conn.commit()
        except Exception as e:
            print("Error updating Spotify Device ID", e)
