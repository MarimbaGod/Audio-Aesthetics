from pydantic import BaseModel
from typing import Union, List, Optional
from queries.pool import pool
from queries.users import UserRepository


class Error(BaseModel):
    message: str


class GroupIn(BaseModel):
    name: str
    created_by: str
    img_url: Optional[str] = "https://tinyurl.com/Dimg-url"
    is_public: bool = True


class GroupOut(BaseModel):
    id: int
    name: str
    created_by: str
    img_url: Optional[str] = "https://tinyurl.com/Dimg-url"
    is_public: bool


class DuplicateGroupError(ValueError):
    pass


class MembershipsIn(BaseModel):
    user_id: int
    group_id: int


class MembershipsOut(BaseModel):
    id: int
    user_id: int
    group_id: int


class GroupsRepo:
    def get_all(self) -> Union[Error, List[GroupOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT groups.id,
                            groups.name,
                            users.username,
                            groups.img_url,
                            groups.is_public
                        FROM groups
                        JOIN users ON groups.created_by = users.id
                        ORDER BY groups.name;
                        """
                    )
                    result = []
                    for group in db:
                        group_data = GroupOut(
                            id=group[0],
                            name=group[1],
                            created_by=group[2],
                            img_url=group[3],
                            is_public=group[4],
                        )
                        result.append(group_data)
                    return result
        except Exception as e:
            print(e)
            return {"message:" "Failed to get all Groups"}

    def create_group(
        self, group_data: GroupIn, user_repo: UserRepository
    ) -> Union[Error, GroupOut]:
        user_id = user_repo.get_user_id_by_username(group_data.created_by)

        if user_id is None:
            return Error(message="User Not Found")

        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        INSERT INTO groups
                            (name,
                            created_by,
                            img_url,
                            is_public)
                        VALUES
                            (%s, %s, %s, %s)
                        RETURNING id, name, created_by, img_url, is_public;
                        """,
                        (
                            group_data.name,
                            user_id,
                            group_data.img_url,
                            group_data.is_public,
                        ),
                    )

                    new_group = db.fetchone()

                    db.execute(
                        """
                        INSERT INTO memberships
                        (user_id, group_id)
                        VALUES (%s, %s);
                        """,
                        (user_id, new_group[0])
                    )

                    return GroupOut(
                        id=new_group[0],
                        name=new_group[1],
                        created_by=group_data.created_by,
                        img_url=new_group[3],
                        is_public=new_group[4],
                    )
        except Exception as e:
            print(e)
            return Error(message="Failed to create Group")

    def get_group_details(
        self, group_id: int, user_id: int
    ) -> Union[Error, GroupOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT id,
                        name,
                        created_by,
                        img_url,
                        is_public
                        FROM groups
                        WHERE id = %s
                        """,
                        (group_id,),
                    )
                    group = db.fetchone()

                    if group[4]:
                        return GroupOut(
                            id=group[0],
                            name=group[1],
                            created_by=group[2],
                            img_url=group[3],
                            is_public=group[4],
                        )

                    db.execute(
                        """
                        SELECT *
                        FROM memberships
                        WHERE user_id = %s
                        AND group_id = %s
                        """,
                        (user_id, group_id),
                    )
                    membership = db.fetchone()

                    if membership:
                        return GroupOut(
                            id=group[0],
                            name=group[1],
                            created_by=group[2],
                            img_url=group[3],
                            is_public=group[4],
                        )
                    else:
                        return Error(message="This group is too exclusive")
        except Exception as e:
            print(e)
            return Error(message="Error Getting details")
