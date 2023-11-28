from pydantic import BaseModel
from typing import Union, List, Optional
from queries.pool import pool


class Error(BaseModel):
    message: str


class PlaylistIn(BaseModel):
    name: str
    img_url: Optional[str] = "https://tinyurl.com/Dimg-url"
    is_public: bool = True
    songs: Optional[str]


class PlaylistOut(BaseModel):
    id: int
    name: str
    img_url: Optional[str] = "https://tinyurl.com/Dimg-url"
    is_public: bool = True
    songs: Optional[str]


class PlaylistRespository:
    def get_all_playlists(
        self, user_id: int
    ) -> Union[Exception, List[PlaylistOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT *
                        FROM playlists
                        WHERE user_id = %s
                        ORDER BY name;
                        """,
                        (user_id,),
                    )
                    playlists = []
                    for playlist in result:
                        playlist = PlaylistOut(
                            id=playlist[0],
                            name=playlist[1],
                            created_by=playlist[2],
                            img_url=playlist[3],
                            is_public=playlist[4],
                        )
                        playlists.append(playlist)
                    return playlists
        except Exception as e:
            print(e)
            return {"message": "Could not get all playlists"}
