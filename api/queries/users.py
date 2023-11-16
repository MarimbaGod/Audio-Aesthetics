from pydantic import BaseModel
from typing import Union, List
from queries.pool import pool


class Error(BaseModel):
    message: str


class UsersIn(BaseModel):
    username: str
    hashed_password: str
    first_name: str
    last_name: str
    email: str


class UsersOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str


# class UserQueries:
#     def get_all_users(self):
#         try:
#             with pool.connection() as conn:
#                 with conn.cursor() as db:
#                     result = db.execute(
#                         """
#                         SELECT *
#                         FROM users
#                         WHERE uuid = %s
#                         """,
#                         [uuid],
#                     )

#                     record = result.fetchone()
#                     if record is None:
#                         return None
#                     return UserOut(
#                         uuid=record[0],
#                         username=record[1],
#                         role=record[2],
#                         img_url=record[3],
#                         display_name=record[4],
#                         description=record[5],
#                         hours=record[6],
#                         location=record[7]
#                     )
#         except Exception as e:
#             print(e)


class UserRepository:
    def get_all(self) -> Union[Error, List[UsersOut]]:
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
                    for record in db:
                        user = UsersOut(
                            id=record[0],
                            username=record[1],
                            first_name=record[2],
                            last_name=record[3],
                            email=record[4],
                        )
                        result.append(user)
                    return result
        except Exception as e:
            print(e)
            return {"message:" "Couldnot get all users"}


#     def create(self, vacation: VacationIn) -> VacationOut:
#         #connect the database
#         with pool.connection() as conn:
#             #get a cursor (something to run SQL with)
#             with conn.cursor() as db:
#                 #Run our INSERT statement
#                 result = db.execute(
#                     """
#                     INSERT INTO vacations
#                         (name, from_date, to_date, thoughts)
#                     VALUES
#                         (%s, %s, %s, %s)
#                     RETURNING id;
#                     """,
#                     [
#                         vacation.name,
#                         vacation.from_date,
#                         vacation.to_date,
#                         vacation.thoughts
#                     ]
#                 )
#                 id = result.fetchone()[0]
#                 #Return new data
#                 old_data = vacation.dict()
#                 return {"message": "error!"}
#                 return VacationOut(id=id, **old_data)
