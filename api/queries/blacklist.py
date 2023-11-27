from typing import Union, List, Dict
from queries.pool import pool
from queries.memberships import Error, SuccessMessage

# from queries.users import UserOut, UserRepository
# from queries.groups import GroupsRepo, GroupOut


# class Error(BaseModel):
#     message: str


# class SuccessMessage(BaseModel):
#     message: str


class TheBlacklist:
    def add_to_blacklist(
        self, group_id: int, user_id: int, requestor_id: int
    ) -> Union[Error, SuccessMessage]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    # Check admin status of current user
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
                        return Error(
                            message="Only admins can modify the blacklist"
                        )

                    # Check if already blacklisted
                    db.execute(
                        """
                        SELECT *
                        FROM the_blacklist
                        WHERE user_id = %s
                        AND group_id = %s
                        """,
                        (user_id, group_id),
                    )
                    if db.fetchone():
                        return Error(message="User already blacklisted")

                    # Remove user from group
                    db.execute(
                        """
                        DELETE FROM memberships
                        WHERE user_id = %s
                        AND group_id = %s
                        """,
                        (user_id, group_id),
                    )

                    # Add User to the Blacklist
                    db.execute(
                        """
                        INSERT INTO the_blacklist
                        (group_id, user_id, added_by)
                        VALUES (%s, %s, %s)
                        """,
                        (group_id, user_id, requestor_id),
                    )
                    return SuccessMessage(
                        message="User added to the Blacklist"
                    )
        except Exception as e:
            print(e)
            return Error(message="failed to add name to the Blacklist")

    def remove_from_blacklist(
        self, group_id: int, user_id: int, requestor_id: int
    ) -> Union[Error, SuccessMessage]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    # same admin check
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
                        return Error(
                            message="Only admins can modify the Blacklist"
                        )

                    db.execute(
                        """
                        DELETE FROM the_blacklist
                        WHERE user_id = %s
                        AND group_id = %s
                        """,
                        (user_id, group_id),
                    )
                    return SuccessMessage(
                        message="User Removed from the Blacklist"
                    )
        except Exception as e:
            print(f"Error in remove_from_blacklist: {e}")
            return Error(message="Failed to remove from the Blacklist")

    def get_blacklist(
        self, group_id: int, requestor_id: int
    ) -> Union[Error, List[Dict]]:
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
                        return Error(
                            message="Only admins can see the Blacklist"
                        )

                    db.execute(
                        """
                        SELECT u.id, u.username
                        FROM the_blacklist bl
                        JOIN users u ON bl.user_id = u.id
                        WHERE bl.group_id = %s
                        """,
                        (group_id,),
                    )
                    blacklist = [
                        {"user_id": data[0], "username": data[1]}
                        for data in db.fetchall()
                    ]
                    return blacklist
        except Exception as e:
            print(f"Error in get_blacklist: {e}")
            return Error(message=f"Failed to find Blacklist: {str(e)}")
