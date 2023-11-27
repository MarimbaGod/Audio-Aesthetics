from pydantic import BaseModel
from typing import Union, List, Optional
from queries.pool import pool
from queries.users import UserRepository


class Error(BaseModel):
    message: str


class MemberIn(BaseModel):
    user_id: int
    is_admin: bool


class MemberOut(BaseModel):
    user_id: int
    username: str
    is_admin: bool


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
    members: Optional[List[MemberOut]] = None


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
                            created_by=group[2],  # displays username, not id
                            img_url=group[3],
                            is_public=group[4],
                            members=[],  # Members not included in g-list
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
                        (user_id, group_id, is_admin)
                        VALUES (%s, %s, TRUE);
                        """,
                        (user_id, new_group[0]),
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

                    if not group[4]:  # if group is not public
                        db.execute(
                            """
                            SELECT is_admin
                            FROM memberships
                            WHERE user_id = %s
                            AND group_id = %s
                            """,
                            (user_id, group_id),
                        )
                        membership = db.fetchone()
                        if not membership:
                            return Error(message="This group is too exclusive")

                    # fetch member details
                    db.execute(
                        """
                        SELECT users.id, users.username, memberships.is_admin
                        FROM memberships
                        JOIN users ON memberships.user_id = users.id
                        WHERE memberships.group_id = %s
                        """,
                        (group_id,),
                    )
                    members_list = [
                        MemberOut(
                            user_id=data[0], username=data[1], is_admin=data[2]
                        )
                        for data in db.fetchall()
                    ]

                    return GroupOut(
                        id=group[0],
                        name=group[1],
                        created_by=group[2],
                        img_url=group[3],
                        is_public=group[4],
                        members=members_list,
                    )

        except Exception as e:
            print(e)
            return Error(message=f"Error getting group details: {e}")
            # print(e)
            # return Error(message="Error Getting details")

    def delete(self, group_id: int, requestor_id: int) -> Union[Error, bool]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT created_by
                        FROM groups
                        WHERE id = %s
                        """,
                        (group_id,),
                    )
                    group = db.fetchone()

                    if not group:
                        return Error(message="Group not found")

                    if group[0] != requestor_id:
                        # Check if requestor is admin
                        db.execute(
                            """
                            SELECT is_admin
                            FROM memberships
                            WHERE user_id = %s
                            AND group_id = %s
                            """,
                            (requestor_id, group_id),
                        )
                        membership = db.fetchone()

                        if not membership or not membership[0]:
                            return Error(
                                message="Unauthorized to delete group"
                            )

                    # Delete the thing
                    db.execute(
                        """
                        DELETE
                        FROM memberships
                        WHERE group_id = %s
                        """,
                        [
                            group_id,
                        ],
                    )

                    db.execute(
                        """
                        DELETE
                        FROM groups
                        WHERE id = %s

                        """,
                        [
                            group_id,
                        ],
                    )
                    return True
        except Exception as e:
            print(f"Error in deleting grou: {e}")
            return Error(message="Failed to delete group")

    def update(
            self, group_edit: GroupIn, group_id: int, requester_id: int
    ) -> GroupOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT created_by
                        FROM groups
                        WHERE id = %s
                        """,
                        (group_id,),
                    )
                    group = db.fetchone()

                    if not group:
                        return Error(message="Group not found")

                    if group[0] != requester_id:

                        db.execute(
                            """
                            SELECT is_admin
                            FROM memberships
                            WHERE user_id = %s
                            AND group_id = %s
                            """,
                            (requester_id, group_id),
                        )
                        membership = db.fetchone()

                        if not membership or not membership[0]:
                            return Error(
                                message=("Unauthorized to update group "
                                         "must be creator or admin to update")
                            )

                    db.execute(
                        """
                        UPDATE groups
                        SET name = %s
                            , img_url = %s
                            , is_public = %s
                        WHERE id = %s
                        RETURNING *;
                        """,
                        [
                            group_edit.name,
                            group_edit.img_url,
                            group_edit.is_public,
                            group_id,
                        ],
                    )
                    updated = db.fetchone()

                    return GroupOut(
                        id=updated[0],
                        name=updated[1],
                        created_by=updated[2],
                        img_url=updated[3],
                        is_public=updated[4],
                    )
        except Exception as e:
            print(f"Error in updating group: {e}")
            return Error(message="Failed to update group")
