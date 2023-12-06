from unittest import TestCase
from fastapi import status
from fastapi.testclient import TestClient
from queries.posts import PostRepository
from main import app


client = TestClient(app)


class TestPostQueries(TestCase):
    def get_all(self):
        return [
            {
                "id": 1,
                "created_datetime": "2023-12-04T22:35:42.241000",
                "caption": "just random stuff",
                "created_by": 3,
                "img_url": "",
                "song_or_playlist": "FE!N"

            },
            {
                "id": 2,
                "created_datetime": "2023-12-04T22:39:39.307000",
                "caption": "Team 7 best team ",
                "created_by": 3,
                "img_url": "https://source.unsplash.com/random?music",
                "song_or_playlist": "Blue Bird"
            }
        ]


def test_get_all():
    app.dependency_overrides[PostRepository] = TestPostQueries
    expected = [
        {
            "id": 1,
            "created_datetime": "2023-12-04T22:35:42.241000",
            "caption": "just random stuff",
            "created_by": 3,
            "img_url": "",
            "song_or_playlist": "FE!N"

        },
        {
            "id": 2,
            "created_datetime": "2023-12-04T22:39:39.307000",
            "caption": "Team 7 best team ",
            "created_by": 3,
            "img_url": "https://source.unsplash.com/random?music",
            "song_or_playlist": "Blue Bird"
        }
    ]

    response = client.get("/api/posts/")

    app.dependency_overrides = {}

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == expected
