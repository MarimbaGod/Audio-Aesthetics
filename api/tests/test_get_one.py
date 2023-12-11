from unittest import TestCase
from fastapi import status
from fastapi.testclient import TestClient
from queries.users import UserRepository
from main import app

client = TestClient(app)


class TestUserQueries(TestCase):
    def get_one(self, user_id: int):
        return {
            "id": user_id,
            "username": "testuser",
            "first_name": "Test",
            "last_name": "User",
            "email": "test@example.com",
            "img_url": "https://example.com/image.jpg",
        }


def test_get_one():
    # Arrange
    app.dependency_overrides[UserRepository] = TestUserQueries

    # Define a user ID to retrieve
    user_id_to_retrieve = 1

    # Act
    response = client.get(f"/api/users/{user_id_to_retrieve}")

    # Assert the response status code and user data
    assert response.status_code == status.HTTP_200_OK

    expected_user = {
        "id": 1,
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "img_url": "https://example.com/image.jpg",
    }

    assert response.json() == expected_user

    app.dependency_overrides = {}
