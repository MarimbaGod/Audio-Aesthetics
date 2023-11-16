# ./api/queries/accounts.py
import os
from psycopg_pool import ConnectionPool
pool = ConnectionPool(conninfo=os.environ.get("DATABASE_URL"))
