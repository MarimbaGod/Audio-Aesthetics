from fastapi import HTTPException, APIRouter, Depends, status
from authenticator import authenticator
from typing import Optional, List
import requests
from pydantic import BaseModel
import os
from queries.users import UserRepository
from queries.spotify import (
    refresh_spotify_access_token,
    spotify_api_request_with_refresh,
)

router = APIRouter()


class TokenRequest(BaseModel):
    code: str


class SpotifyDeviceIdUpdate(BaseModel):
    device_id: str


class UpdatePlaylistDetails(BaseModel):
    name: Optional[str] = None
    public: Optional[bool] = None
    description: Optional[str] = None


class PlaylistDetails(BaseModel):
    name: str
    public: bool
    description: str


class AddTracks(BaseModel):
    uris: List[str]


class RemoveTracks(BaseModel):
    uris: List[str]


@router.post("/spotify/token")
async def get_spotify_token(
    token_request: TokenRequest,
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    spotify_url = "https://accounts.spotify.com/api/token"
    redirect_uri = "https://team-tunity.gitlab.io/audio-aesthetics/spotifyauth"
    # client_id = os.getenv("SPOTIFY_CLIENT_ID")
    # client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    client_id = "4d6c7eae97cd480fb1088393ebd8f107"
    client_secret = "6f54d43f0d354899bb3c6fbfa44982e8"

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
        error_info = response.json()
        print("Spotify error response:", error_info)
        # raise HTTPException(
        #     status_code=response.status_code,
        #     detail=f"Spotify error:
        # {error_info.get('error_description',
        # 'Unknown error')}",
        # )

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
    url = "https://api.spotify.com/v1/me/playlists"

    response = spotify_api_request_with_refresh(user_details, url, user_repo)
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

    url = "https://api.spotify.com/v1/me"
    response = spotify_api_request_with_refresh(user_details, url, user_repo)

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

    url = f"https://api.spotify.com/v1/playlists/{playlist_id}"

    response = spotify_api_request_with_refresh(user_details, url, user_repo)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error fetching playlist details from Spotify",
        )

    return response.json()


@router.put("/spotify/playlists/{playlist_id}")
async def update_playlist_details(
    playlist_id: str,
    playlist_data: UpdatePlaylistDetails,
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ew, You're not authorized? *Cringes in Python*",
        )

    url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    response = spotify_api_request_with_refresh(
        user_details,
        url,
        user_repo,
        method="PUT",
        data=playlist_data.dict(exclude_none=True),
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error updating playlist details",
        )
    return {"detail": "Playlist details updated successfully"}


@router.get("/spotify/search/track")
async def search_spotify_track(
    query: str,
    type: str = "track",
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized >:("
        )

    url = f"https://api.spotify.com/v1/search?q={query}&type={type}"
    response = spotify_api_request_with_refresh(user_details, url, user_repo)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error searching on Spotify",
        )
    return response.json()["tracks"]["items"][0]["uri"]


@router.get("/spotify/search")
async def search_spotify(
    query: str,
    type: str = "track",
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized >:("
        )

    url = f"https://api.spotify.com/v1/search?q={query}&type={type}"
    response = spotify_api_request_with_refresh(user_details, url, user_repo)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error searching on Spotify",
        )
    return response.json()


@router.get("/spotify/track/{track_id}/features")
async def get_track_features(
    track_id: str,
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorzied Access",
        )

    url = f"https://api.spotify.com/v1/audio-features/{track_id}"

    response = spotify_api_request_with_refresh(user_details, url, user_repo)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error Fetching track audio features from Spotify",
        )

    audio_features = response.json()
    return {
        "tempo": audio_features.get("tempo"),
        "valence": audio_features.get("valence"),
        "instrumentalness": audio_features.get("instrumentalness"),
    }


@router.get("/spotify/playlist/{playlist_id}/tracks")
async def get_playlist_tracks(
    playlist_id: str,
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access",
        )

    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    response = spotify_api_request_with_refresh(user_details, url, user_repo)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error fetching playlist tracks from Spotify",
        )

    tracks_data = response.json()
    tracks = []
    for item in tracks_data.get("items", []):
        track = item.get("track", {})
        track_info = {
            "id": track.get("id"),
            "title": track.get("name"),
            "artist": ", ".join(
                artist["name"] for artist in track.get("artists", [])
            ),
            "album": track.get("album", {}).get("name"),
        }
        tracks.append(track_info)

    return tracks


@router.get("/spotify/current-playback")
async def get_current_playback(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access",
        )
    url = "https://api.spotify.com/v1/me/player"
    response = spotify_api_request_with_refresh(user_details, url, user_repo)
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error fetching current playback",
        )

    return response.json()


@router.get("/spotify/devices")
async def get_user_devices(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access",
        )
    url = "https://api.spotify.com/v1/me/player/devices"
    response = spotify_api_request_with_refresh(user_details, url, user_repo)
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error fetching devices",
        )

    return response.json()


@router.post("/spotify/update-device")
async def update_spotify_device(
    device_data: SpotifyDeviceIdUpdate,
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_id = current_user["id"]
    user_repo.update_spotify_device_id(user_id, device_data.device_id)

    return {"detail": "Spotify device ID updated successfully"}


@router.put("/spotify/play")
async def start_resume_playback(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access",
        )
    device_id = user_details.get("spotify_device_id")
    if not device_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No Device Stored for User",
        )

    url = f"https://api.spotify.com/v1/me/player/play?device_id={device_id}"
    response = spotify_api_request_with_refresh(
        user_details, url, user_repo, method="PUT"
    )
    if response.status_code != 204:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error starting/resuming playback",
        )

    return {"detail": "Playback started/resumed"}


@router.put("/spotify/pause")
async def pause_playback(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access",
        )

    device_id = user_details.get("spotify_device_id")
    if not device_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No Device Stored for User",
        )

    url = f"https://api.spotify.com/v1/me/player/pause?device_id={device_id}"
    response = spotify_api_request_with_refresh(
        user_details, url, user_repo, method="PUT"
    )
    if response.status_code != 204:
        raise HTTPException(
            status_code=response.status_code, detail="Error pausing playback"
        )

    return {"detail": "Playback paused"}


@router.post("/spotify/next")
async def next_track(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access",
        )

    device_id = user_details.get("spotify_device_id")
    if not device_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No Device Stored for User",
        )
    url = f"https://api.spotify.com/v1/me/player/next?device_id={device_id}"
    response = spotify_api_request_with_refresh(
        user_details, url, user_repo, method="POST"
    )
    if response.status_code != 204:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error skipping to next track",
        )

    return {"detail": "Skipped to next Track"}


@router.post("/spotify/previous")
async def previous_track(
    current_user: dict = Depends(authenticator.get_current_account_data),
    user_repo: UserRepository = Depends(),
):
    user_details = user_repo.get_user_details(current_user["id"])
    if not user_details or "spotify_access_token" not in user_details:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access",
        )

    device_id = user_details.get("spotify_device_id")
    if not device_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No Device Stored for User",
        )
    url = (
        f"https://api.spotify.com/v1/me/player/previous?device_id={device_id}"
    )

    response = spotify_api_request_with_refresh(
        user_details, url, user_repo, method="POST"
    )
    if response.status_code != 204:
        raise HTTPException(
            status_code=response.status_code,
            detail="Error skipping to previous track",
        )

    return {"detail": "Skipped to previous track"}
