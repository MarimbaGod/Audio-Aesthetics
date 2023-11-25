from pydantic import BaseModel
from typing import Union
from queries.pool import pool


class Error(BaseModel):
    message: str


class SuccessMessage(BaseModel):
    message: str


class MembershipIn(BaseModel):
    user_id: int
    group_id: int


class MembershipOut(BaseModel):
    id: int
    user_id: int
    group_id: int


class MembershipsRepo:
    def add_user_to_group(
        self, user_id: int, group_id: int, requestor_id: int
    ) -> Union[Error, SuccessMessage]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT created_by, is_public
                        FROM groups
                        WHERE id = %s
                        """,
                        (group_id,),
                    )
                    group = db.fetchone()
                    if group is None:
                        return Error(message="Group not found")

                    if not group[1] and group[0] != requestor_id:
                        return Error(message="Only Owner can add users")

                    db.execute(
                        """
                        SELECT *
                        FROM memberships
                        WHERE user_id = %s
                        AND group_id = %s
                        """,
                        (user_id, group_id),
                    )
                    if db.fetchone():
                        return Error(message="User is already a member")

                    db.execute(
                        """
                        INSERT INTO memberships
                        (user_id, group_id)
                        VALUES (%s, %s)
                        """,
                        (user_id, group_id),
                    )
                    return SuccessMessage(message="Welcome to the group")
        except Exception as e:
            print(e)
            return Error(message="Failed to join group")
