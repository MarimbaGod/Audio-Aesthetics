from unittest import TestCase
from fastapi import status
from fastapi.testclient import TestClient
from queries.posts import PostRepository
from main import app


client = TestClient(app)


class TestPostQueries(TestCase):
    def get_post(self, id):
        return {
            "id": 1,
            "created_datetime": "2023-12-06T21:21:21.210000",
            "caption": "captionyeet",
            "created_by": 1,
            "img_url": "",
            "song_or_playlist": "FE!N",
        }


def test_get_post():
    app.dependency_overrides[PostRepository] = TestPostQueries
    expected = {
        "id": 1,
        "created_datetime": "2023-12-06T21:21:21.210000",
        "caption": "captionyeet",
        "created_by": 1,
        "img_url": "",
        "song_or_playlist": "FE!N",
    }

    post_id = 1
    response = client.get(f"/api/posts/{post_id}")

    app.dependency_overrides = {}

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == expected
