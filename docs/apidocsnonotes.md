# APIs

## Tokens And Login

### Get Token, Login, and Logout

**Methods**: `POST`, `GET`, `DELETE`

**Path**: `/token`

**Input**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Output for `POST`**:

```json
{
  "access_token": "string",
  "token_type": "Bearer"
}
```

**Output for `GET`**:

```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "account": {
    "id": int,
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "img_url": "url"
  }
}
```

**Output for `DELETE`**:

```json
true or false
```

## Root

**Method**: `GET`

**Path**: `/`

**Input**: None

**Output**:

```json
{
  "message": "You hit the root path!"
}
```

</details>

## Users

### Signup and All Users

**Methods**: `GET`, `POST`

**Paths**: `/users/` for `GET`, `/users` for `POST`

**Input**: None for `GET`, the following for `POST`:

```json
{
  "username": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "img_url": "url"
}
```

Output:

```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "account": {
    "id": 0,
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "img_url": "url"
  }
}
```

### Individual Users

**Methods**: `GET`, `PUT`, `DELETE`

**Path**: `api/users/{user_id}`

**Input**: None for `GET` or `DELETE`, and the following for `PUT`:

```json
{
  "username": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "img_url": "url"
}
```

Output for `GET`:

```json
{
  "id": 0,
  "username": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "img_url": "url"
}
```

Output for `PUT`:

```json
{
  "username": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "img_url": "string"
}
```

Output for `DELETE`:

```json
true or false
```

### User Details

**Methods**: `GET`

**Path**: `api/user/details`

**Input**: None

**Output**:

```json
{
  "id": 0,
  "username": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "img_url": "string",
  "spotify_access_token": null,
  "spotify_refresh_token": null,
  "spotify_device_id": null
}
```

## Following

### Follow/Unfollow User

**Methods**: `POST` for both

**Paths**: `api/users/follow/{following_id}` and `api/users/unfollow/{following_id}`, respectively

**Input**: None

**Output** for following:

```json
{
  "message": "Followed :D"
}
```

**Output** for unfollowing:

```json
{
  "message": "Unfollowed the loser"
}
```

### View Followers for User

**Methods**: `GET`

**Path**: `api/users/{user_id}/followers`

**Input**: None

**Output**:

```json
[
  {
    "id": int,
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "img_url": "string"
  }
]
```

### View User's Followers

**Methods**: `GET`

**Path**: `api/users/{user_id}/following`

**Input**: None

**Output**:

```json
[
  {
    "id": int,
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "img_url": "string"
  }
]
```

### Check if following a User

**Methods**: `GET`

**Path**: `api/users/following/{following_id}`

**Input**: None

**Output**:

```json
true or false
```

## Groups

### Get All Groups or Create Group

**Methods**: `GET`, `POST`

**Paths**: `/api/groups/` for `GET`, `/api/groups` for `POST`

**Input**: None for `GET`, the following for `POST`:

```json
{
  "name": "string",
  "created_by": "string",
  "img_url": "string",
  "is_public": true
}
```

**Output** for `GET`:

```json
[
  {
    "id": 0,
    "name": "string",
    "created_by": "string",
    "img_url": "string",
    "is_public": true,
    "members": []
  }
]
```

**Output** for `POST`:

```json
{
  "name": "string",
  "created_by": "string",
  "img_url": "string",
  "is_public": true
}
```

### Group Details, Edit, and Delete

**Methods**: `GET`, `PUT`, `DELETE`

**Paths**: `/api/groups/{group_id}`

**Input**: None for `GET` or `DELETE`, the following for `PUT`:

```json
{
  "name": "string",
  "created_by": "string",
  "img_url": "string",
  "is_public": true
}
```

**Output** for `GET` and `PUT`:

```json
{
  "id": 0,
  "name": "string",
  "created_by": "string",
  "img_url": "string",
  "is_public": true,
  "members": [
    {
      "user_id": 0,
      "username": "string",
      "is_admin": true
    }
  ]
}
```

**Output** for `DELETE`:

```json
true or false
```

### Add User to Group

**Methods**: `POST`

**Paths**: `/api/groups/{group_id}/memberships`

**Input/Instructions**: The user_id must be added as a query. This can be done in the FastAPI `/docs` backend, in the "Query" section of your API access program of choice, or manually added to the end of the URL with the format `?user_id={user_id}`. **_YOU CANNOT ADD IT TO THE BODY VIA JSON, IT WILL NOT WORK._**

**Output**:

```json
{
  "message": "Welcome to the group"
}
```

### Give or Remove Admin Privileges to User in Group

**Methods**: `POST`, `DELETE`

**Paths**: `/api/groups/{group_id}/memberships/{user_id}`

**Input**: None

**Output** for `POST`:

```json
{
  "message": "User has Leveled Up to Admin!"
}
```

**Output** for `DELETE`:

```json
{
  "message": "Member Banished to Shadow Realm"
}
```

### Get All Users on Blacklist

**Methods**: `POST`

**Paths**: `/api/groups/{group_id}/blacklist`

**Input**: None

```json
[
  {
    "user_id": 0,
    "username": "string"
  }
]
```

### Add/Remove Users from Blacklist

**Methods**: `POST`, `DELETE`

**Paths**: `/api/groups/{group_id}/blacklist/add` for `POST`, `/api/groups/{group_id}/blacklist/REMOVE` for `DELETE`

**Input**: None

**Output** for `POST`:

```json
{
  "message": "User added to the Blacklist"
}
```

**Output** for `DELETE`:

```json
{
  "message": "User Removed from the Blacklist"
}
```

## Posts

### Add/Remove Users from Blacklist

**Methods**: `GET`, `POST`

**Paths**: `/api/posts/` for `GET`, `/api/posts` for `POST`

**Input**: None for `GET`, the following for `POST`:

```json
{
  "created_datetime": "datetime",
  "caption": "string",
  "created_by": 0,
  "img_url": "string",
  "song_or_playlist": "string"
}
```

**Output** for `GET`:

```json
[
  {
    "id": 0,
    "created_datetime": "datetime in ISO format",
    "caption": "string",
    "created_by": 0,
    "img_url": "string",
    "song_or_playlist": "string"
  }
]
```

**Output** for `POST`:

```json
{
  "id": 0,
  "created_datetime": "datetime in ISO format",
  "caption": "string",
  "created_by": 0,
  "img_url": "string",
  "song_or_playlist": "string"
}
```

### Get or Delete Specific Post

**Methods**: `GET`, `DELETE`

**Paths**: `/api/posts/{post_id}`

**Input**: None

**Output** for `GET`:

```json
{
  "id": 0,
  "created_datetime": "datetime in ISO format",
  "caption": "string",
  "created_by": 0,
  "img_url": "string",
  "song_or_playlist": "string"
}
```

**Output** for `DELETE`:

```json
true or false
```

### Get Posts by User

**Methods**: `GET`

**Paths**: `/api/users/{user_id}/posts`

**Input**: None

**Output**:

```json
[
  {
    "id": 0,
    "created_datetime": "datetime in ISO format",
    "caption": "string",
    "created_by": 0,
    "img_url": "string",
    "song_or_playlist": "string"
  }
]
```

### Get Homepage Post

**Methods**: `GET`

**Paths**: `/api/homepage/`

**Input**: None

**Output**:

```json
[
  {
    "id": 0,
    "created_datetime": "datetime in ISO format",
    "caption": "string",
    "created_by": 0,
    "img_url": "string",
    "song_or_playlist": "string"
  }
]
```

### Like/Unlike Post

**Methods**: `POST`,

**Paths**: `/api/groups/{post_id}/like` for Like, `/api/groups/{post_id}/unlike` for Unlike

**Input**: None

**Output** for Like:

```json
{
  "message": "Liked :D"
}
```

**Output** for Unlike:

```json
{
  "message": "Unliked the lame post >:D"
}
```

### Check if You Liked a Post

**Methods**: `GET`

**Paths**: `/api/posts/{post_id}/check_like`

**Input**: None

**Output**:

```json
true or false
```

### Check All Posts You've Liked

**Methods**: `GET`

**Paths**: `/api/post`

**Input**: None

**Output**:

```json
[
  {
    "id": 0,
    "created_datetime": "datetime in ISO format",
    "caption": "string",
    "created_by": 0,
    "img_url": "string",
    "song_or_playlist": "string"
  }
]
```
