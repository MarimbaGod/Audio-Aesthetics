from pydantic import BaseModel
from typing import Union, List, Optional
from queries.pool import pool
from datetime import datetime


class Error(BaseModel):
    message: str


class PostIn(BaseModel):
    created_datetime: datetime
    caption: str
    created_by: int
    img_url: Optional[str]
    song_or_playlist: Optional[str]


class PostOut(BaseModel):
    id: int
    created_datetime: datetime
    caption: str
    created_by: int
    img_url: Optional[str]
    song_or_playlist: Optional[str]


class PostRepository:
    def get_all(self) -> Union[Error, List[PostOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            posts.id AS post_id,
                            posts.created_datetime,
                            posts.caption,
                            posts.created_by,
                            posts_media.img_url,
                            posts_media.song_or_playlist
                        FROM
                            posts
                        LEFT JOIN
                            posts_media ON posts.id = posts_media.post_id;
                        """
                    )
                    result = db.fetchall()
                    return [
                        self.record_to_post_out(record) for record in result
                    ]
        except Exception:
            return {"message": "Error could not get posts"}

    def create(self, post: PostIn) -> PostOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        WITH inserted_post AS (
                            INSERT INTO posts
                                (created_datetime, caption, created_by)
                            VALUES
                                (%s, %s, %s)
                            RETURNING id
                        )
                        INSERT INTO posts_media
                            (post_id, img_url, song_or_playlist)
                        VALUES
                            ((SELECT id FROM inserted_post), %s, %s)
                        RETURNING post_id;
                        """,
                        [
                            post.created_datetime,
                            post.caption,
                            post.created_by,
                            post.img_url,
                            post.song_or_playlist
                        ],
                    )
                    post_id = result.fetchone()[0]
                    return self.user_in_to_out(post_id, post)
        except Exception:
            return {"message": "Create did not work try different credentials"}

    def get_post(self, id: int) -> PostOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            p.id,
                            p.created_datetime,
                            p.caption,
                            p.created_by,
                            pm.img_url,
                            pm.song_or_playlist
                        FROM posts p
                        LEFT JOIN posts_media pm
                        ON p.id = pm.post_id
                        WHERE p.id = %s;
                        """,
                        [id],
                    )
                    record = db.fetchone()
                    if record is None:
                        return None
                    return self.record_to_post_out(record)
        except Exception:
            return {"message": "Couldn't get the post"}

    def get_posts_by_following(
        self, user_id: int
    ) -> Union[Error, List[PostOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            p.id,
                            p.created_datetime,
                            p.caption,
                            p.created_by,
                            pm.img_url,
                            pm.song_or_playlist
                        FROM
                            posts p
                        INNER JOIN
                            user_follows uf ON
                            p.created_by = uf.following_user_id
                        LEFT JOIN
                            posts_media pm ON
                            p.id = pm.post_id
                        WHERE
                            uf.follower_user_id = %s
                        """,
                        [user_id],
                    )
                    result = db.fetchall()
                    print(result)
                    return [
                        self.record_to_post_out(record) for record in result
                    ]
        except Exception:
            return {"message": "Failing to get following's posts"}

    def get_posts_by_user(self, user_id: int) -> Union[Error, List[PostOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            p.id,
                            p.created_datetime,
                            p.caption,
                            p.created_by,
                            pm.img_url,
                            pm.song_or_playlist
                        FROM posts p
                        LEFT JOIN
                            posts_media pm ON
                            p.id = pm.post_id
                        WHERE p.created_by = %s;
                        """,
                        (user_id,),
                    )
                    results = db.fetchall()
                    return [
                        self.record_to_post_out(record) for record in results
                    ]
        except Exception as e:
            print(e)
            return {"message": "Aw heck, Error"}

    def delete(self, id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM posts
                        WHERE id = %s
                        """,
                        [id],
                    )
                    return True
        except Exception:
            return False

    def like_post(
        self, user_id: int, post_id: int
    ) -> Union[Error, List[PostOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT 1
                        FROM liked_posts
                        WHERE user_id = %s
                        AND post_id = %s
                        """,
                        [user_id, post_id],
                    )
                    if db.fetchone():
                        return {"message": "Sorry SuperFan, can't double like"}
                    db.execute(
                        """
                        INSERT INTO liked_posts(user_id, post_id, active)
                        VALUES (%s, %s, TRUE)
                        ON CONFLICT (user_id, post_id)
                        DO UPDATE SET active = TRUE;
                        """,
                        [user_id, post_id],
                    )
                    return {"message": "Liked :D"}

        except Exception:
            return {"message": "Error could not like post"}

    def unlike_post(
        self, user_id: int, post_id: int
    ) -> Union[Error, List[PostOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE liked_posts
                        SET active = FALSE
                        WHERE user_id = %s
                        AND post_id = %s
                        """,
                        [user_id, post_id],
                    )
                    return {"message": "Unliked the lame post >:D"}

        except Exception:
            return {"message": "SOL"}

    def user_in_to_out(self, id: int, post: PostIn):
        old_data = post.dict()
        return PostOut(id=id, **old_data)

    def record_to_post_out(self, record):
        return PostOut(
            id=record[0],
            created_datetime=record[1],
            caption=record[2],
            created_by=record[3],
            img_url=record[4],
            song_or_playlist=record[5],
        )
