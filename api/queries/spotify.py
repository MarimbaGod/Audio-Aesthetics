from fastapi import HTTPException
import requests
from queries.users import UserRepository
from typing import Optional, Union
import os


def make_spotify_api_request(
    url: str,
    access_token: str,
    method: str = "GET",
    data: Optional[Union[dict, str, bytes]] = None,
    extra_headers: Optional[dict] = None,
):
    headers = {"Authorization": f"Bearer {access_token}"}
    if extra_headers:
        headers.update(extra_headers)

    if method == "GET":
        return requests.get(url, headers=headers)
    elif method == "POST":
        return requests.post(url, headers=headers, json=data)
    elif method == "PUT":
        if isinstance(data, bytes):
            return requests.put(url, headers=headers, data=data)
        else:
            return requests.put(url, headers=headers, json=data)
    elif method == "DELETE":
        return requests.delete(
            url,
            headers=headers,
        )
    else:
        raise ValueError("Invalid HTTP Method")


def refresh_spotify_access_token(
    refresh_token: str, client_id: str, client_secret: str
):
    spotify_url = "https://accounts.spotify.com/api/token"

    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": client_id,
        "client_secret": client_secret,
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(spotify_url, data=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=400, detail="Error refreshing Spotify token"
        )

    new_token_data = response.json()
    return new_token_data["access_token"]


def spotify_api_request_with_refresh(
    user_details: dict,
    url: str,
    user_repo: UserRepository,
    method="GET",
    data=None,
    extra_headers=None,
):
    access_token = user_details["spotify_access_token"]
    response = make_spotify_api_request(
        url, access_token, method, data, extra_headers
    )

    if response.status_code == 401:
        new_access_token = refresh_spotify_access_token(
            user_details["spotify_refresh_token"],
            os.getenv("SPOTIFY_CLIENT_ID"),
            os.getenv("SPOTIFY_CLIENT_SECRET"),
        )

        user_repo.update_spotify_tokens(
            user_details["id"],
            new_access_token,
            user_details["spotify_refresh_token"],
        )

        response = make_spotify_api_request(
            url, new_access_token, method, data, extra_headers
        )

    return response
