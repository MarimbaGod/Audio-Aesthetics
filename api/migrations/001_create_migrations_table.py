steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE users (
            id SERIAL PRIMARY KEY NOT NULL,
            username VARCHAR(100) NOT NULL UNIQUE,
            hashed_password VARCHAR(200) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE users;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE groups (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(150) NOT NULL,
            created_by INT,
            img_url VARCHAR(255) DEFAULT 'https://tinyurl.com/Dimg-url',
            is_public BOOLEAN NOT NULL DEFAULT TRUE,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        );
        """,
        # Removed NOT NULL from created_by to allow on delete setnull
        # "Down" SQL statement
        """
        DROP TABLE groups
        """,
    ],
    [
        """
        CREATE TABLE memberships (
            user_id INT NOT NULL,
            group_id INT NOT NULL,
            PRIMARY KEY (user_id, group_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (group_id) REFERENCES groups(id)
        );
        """,
        """
        DROP TABLE memberships
        """,
    ],
    [
        """
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY NOT NULL,
            created_by_user_id INT NOT NULL,
            created_datetime TIMESTAMP NOT NULL,
            caption TEXT,
            FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """,
        """
        DROP TABLE posts
        """,
    ],
    [
        """
        CREATE TABLE comments (
            id SERIAL PRIMARY KEY NOT NULL,
            post_id INT NOT NULL,
            created_by_user_id INT NOT NULL,
            created_datetime TIMESTAMP NOT NULL,
            comment TEXT,
            comment_replied_to_id INT,
            FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (comment_replied_to_id) REFERENCES comments(id) ON DELETE CASCADE
        );
        """,
        """
        DROP TABLE comments
        """,
    ],
    [
        """
        CREATE TABLE following (
            follower_user_id INT NOT NULL,
            following_user_id INT NOT NULL,
            FOREIGN KEY (follower_user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (following_user_id) REFERENCES users(id),
            UNIQUE (follower_user_id, following_user_id)
        );
        """,
        """
        DROP TABLE following
        """,
    ],
    [
        """
        CREATE TABLE liked_posts (
            user_id INT NOT NULL,
            post_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (post_id) REFERENCES posts(id),
            UNIQUE (user_id, post_id)
        );
        """,
        """
        DROP TABLE liked_posts
        """,
    ],
]
