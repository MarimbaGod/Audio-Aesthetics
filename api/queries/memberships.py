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
                        SELECT is_public
                        FROM groups
                        WHERE id = %s
                        """,
                        (group_id,),
                    )
                    group = db.fetchone()
                    if group is None:
                        return Error(message="Group not found")

                    is_public = group[0]

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

                    # Check if the requestor is an Admin
                    # and if the group is public
                    if not is_public and (
                        membership is None or not membership[0]
                    ):
                        return Error(message="Only an admin can add users")

                    # Check to see if the user_id to be added
                    # is already a member of group_id
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

    def remove_member(
        self, group_id: int, user_id_to_remove: int, requestor_id: int
    ) -> Union[Error, SuccessMessage]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT is_admin
                        FROM memberships
                        WHERE user_id = %s
                        AND group_id = %s
                        """,
                        (requestor_id, group_id),
                    )
                    admin_status = db.fetchone()
                    if not admin_status or not admin_status[0]:
                        return Error(message="Only admins can remove members")

                    # Delete membership
                    db.execute(
                        """
                        DELETE FROM memberships
                        WHERE user_id = %s
                        AND group_id = %s
                        """,
                        (user_id_to_remove, group_id),
                    )
                    return SuccessMessage(
                        message="Member Banished to Shadow Realm"
                    )
        except Exception as e:
            print(e)
            return Error(message="Couldn't exorcise curse")
