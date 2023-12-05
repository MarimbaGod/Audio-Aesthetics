from fastapi import HTTPException, APIRouter, Depends, status
from authenticator import authenticator
import requests
from pydantic import BaseModel
import os
from queries.users import UserRepository
from queries.spotify import (
    make_spotify_api_request,
    refresh_spotify_access_token,
)

router = APIRouter()

# class SpotifyPlaylistOut(BaseModel):


class TokenRequest(BaseModel):
    code: str


# class RefreshRequest(BaseModel):
#     refresh_token: str


@router.post("/spotify/token")
async def get_spotify_token(
    token_request: TokenRequest,
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
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

    token_data = response.json()

    user_repo.update_spotify_tokens(
        user_id=current_user["id"],
        spotify_access=token_data["access_token"],
        spotify_refresh=token_data.get("refresh_token"),
    )

    current_user["spotify_access_token"] = token_data["access_token"]
    current_user["spotify_refresh_token"] = token_data.get("refresh_token")

    return token_data


@router.post("/spotify/refresh")
async def refresh_spotify_token(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    # FOR TESTING
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details:
        raise HTTPException(status_code=404, detail="User not found")
    spotify_refresh_token = user_details.get("spotify_refresh_token")
    if not spotify_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No Spotify refresh token available",
        )
    # Retrieve Stored refresh token
    stored_refresh_token = user_details["spotify_refresh_token"]
    # spotify_url = "https://accounts.spotify.com/api/token"
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

    new_access_token = refresh_spotify_access_token(
        stored_refresh_token, client_id, client_secret
    )

    # Update stored access token and refresh if provided
    user_repo.update_spotify_tokens(
        user_id=current_user["id"],
        spotify_access=new_access_token,
        spotify_refresh=stored_refresh_token,
    )
    return {"access_token": new_access_token}


@router.get("/spotify/playlists")
async def get_spotify_playlists(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    spotify_access_token = user_details["spotify_access_token"]

    response = make_spotify_api_request(
        "https://api.spotify.com/v1/me/playlists", spotify_access_token
    )

    if response.status_code == 401:  # Token may be expired
        client_id = os.getenv("SPOTIFY_CLIENT_ID")
        client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        spotify_refresh_token = user_details["spotify_refresh_token"]
        # spotify_refresh_token = current_user['spotify_refresh_token']

        new_access_token = refresh_spotify_access_token(
            spotify_refresh_token, client_id, client_secret
        )

        user_repo.update_spotify_tokens(
            current_user["id"], new_access_token, spotify_refresh_token
        )
        # Retry with new access token
        response = make_spotify_api_request(
            "https://api.spotify.com/v1/me/playlists", new_access_token
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error fetching Spotify Playlists",
        )

    return response.json()


@router.get("/spotify/user/profile")
async def get_spotify_user_profile(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized >:("
        )

    spotify_access_token = user_details["spotify_access_token"]

    url = "https://api.spotify.com/v1/me"
    response = make_spotify_api_request(url, spotify_access_token)

    # Token may be expired
    if response.status_code == 401:
        new_access_token = refresh_spotify_access_token(
            user_details["spotify_refresh_token"],
            os.getenv("SPOTIFY_CLIENT_ID"),
            os.getenv("SPOTIFY_CLIENT_SECRET")
        )

        user_repo.update_spotify_tokens(
            current_user["id"],
            new_access_token,
            user_details["spotify_refresh_token"]
        )

        response = make_spotify_api_request(url, new_access_token)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error fetching Spotify user Profile :(",
        )

    return response.json()


@router.get("/spotify/playlist/{playlist_id}")
async def get_playlist_details(
    playlist_id: str,
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ew, You're not authorized? *Cringes in Python*",
        )

    spotify_access_token = user_details["spotify_access_token"]

    url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    response = make_spotify_api_request(url, spotify_access_token)

    if response.status_code == 401:
        new_access_token = refresh_spotify_access_token(
            user_details["spotify_refresh_token"],
            os.getenv("SPOTIFY_CLIENT_ID"),
            os.getenv("SPOTIFY_CLIENT_SECRET")
        )

        user_repo.update_spotify_tokens(
            current_user["id"],
            new_access_token,
            user_details["spotify_refresh_token"]
        )

        # Retry call with new token
        response = make_spotify_api_request(url, new_access_token)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error fetching playlist details from Spotify",
        )

    return response.json()


@router.get("/spotify/search")
async def search_spotify(
    query: str,
    type: str = "track,album,artist,playlist",
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized >:("
        )

    spotify_access_token = user_details["spotify_access_token"]

    url = f"https://api.spotify.com/v1/search?q={query}&type={type}"
    response = make_spotify_api_request(url, spotify_access_token)

    if response.status_code == 401:
        new_access_token = refresh_spotify_access_token(
            user_details["spotify_refresh_token"],
            os.getenv("SPOTIFY_CLIENT_ID"),
            os.getenv("SPOTIFY_CLIENT_SECRET")
        )

        user_repo.update_spotify_tokens(
            current_user["id"],
            new_access_token,
            user_details["spotify_refresh_token"]
        )

        # Retry call with new token
        response = make_spotify_api_request(url, new_access_token)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error searching on Spotify",
        )

    return response.json()
