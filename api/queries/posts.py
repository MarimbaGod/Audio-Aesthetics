from pydantic import BaseModel
from typing import Union, List, Optional
from queries.pool import pool
from datetime import datetime, date


class Error(BaseModel):
    message: str


class PostIn(BaseModel):
    created_datetime: datetime
    caption: str
    created_by: int


class PostOut(BaseModel):
    id: int
    created_datetime: date
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
                        INSERT INTO posts
                            (created_datetime,
                            caption,
                            created_by)
                        VALUES
                            (%s, %s, %s)
                        RETURNING id;
                        """,
                        [post.created_datetime, post.caption, post.created_by],
                    )
                    id = result.fetchone()[0]
                    return self.user_in_to_out(id, post)
        except Exception:
            return {"message": "Create did not work try different credentials"}

    def get_post(self, id: int) -> PostOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT
                        id,
                        created_datetime,
                        caption,
                        created_by
                        FROM posts
                        WHERE id = %s
                        """,
                        [id],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_post_out(record)
        except Exception:
            return {"message": "Couldn't get the post"}

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
