from fastapi import HTTPException, APIRouter
import requests
from pydantic import BaseModel
import os


router = APIRouter()


class TokenRequest(BaseModel):
    code: str


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/spotify/token")
async def get_spotify_token(token_request: TokenRequest):
    spotify_url = "https://accounts.spotify.com/api/token"
    redirect_uri = "http://localhost:3000"
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

    payload = {
        "grant_type": "authorization_code",
        "code": token_request.code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret,
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(spotify_url, data=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=400, detail="Error fetching Spotify token"
        )

    return response.json()


@router.post("/spotify/refresh")
async def refresh_spotify_token(refresh_request: RefreshRequest):
    spotify_url = "https://accounts.spotify.com/api/token"
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_request.refresh_token,
        "client_id": client_id,
        "client_secret": client_secret,
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(spotify_url, data=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=400, detail="Error refreshing Spotify token"
        )

    return response.json()
