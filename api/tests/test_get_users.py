from unittest import TestCase
from fastapi import status
from fastapi.testclient import TestClient
from queries.users import UserRepository
from main import app


client = TestClient(app)


class TestUserQueries(TestCase):
    def get_all(self):
        return [
            {
                "id": 1,
                "username": "ifkylethenkyle",
                "first_name": "Kyle",
                "last_name": "Kyle",
                "email": "kyle@kyle.com",
                "img_url": "https://tinyurl.com/Dimg-url"
            },
            {
                "id": 2,
                "username": "itsnotgordon",
                "first_name": "Gordon",
                "last_name": "Ramsay",
                "email": "wonderfulman@food.com",
                "img_url": "https://tinyurl.com/Dimg-url"
            }
        ]


def test_get_all():
    app.dependency_overrides[UserRepository] = TestUserQueries
    expected = [
        {
            "id": 1,
            "username": "ifkylethenkyle",
            "first_name": "Kyle",
            "last_name": "Kyle",
            "email": "kyle@kyle.com",
            "img_url": "https://tinyurl.com/Dimg-url"
        },
        {
            "id": 2,
            "username": "itsnotgordon",
            "first_name": "Gordon",
            "last_name": "Ramsay",
            "email": "wonderfulman@food.com",
            "img_url": "https://tinyurl.com/Dimg-url"
        }
    ]

    response = client.get("/api/users/")

    app.dependency_overrides = {}

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == expected
