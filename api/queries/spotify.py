from fastapi import HTTPException
import requests
# from users.queries import UserRepository


def make_spotify_api_request(url: str, access_token: str):
    headers = {"Authorization": f"Bearer {access_token}"}
    return requests.get(url, headers=headers)


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


# def spotify_api_request_with_refresh(
#     user_details: dict,
#     url: str,
#     user_repo: UserRepository
# ):
#     access_token = user_details["spotify_access_token"]
#     response = make_spotify_api_request(url, access_token)

#     if response.status_code == 401:
#         new_access_token = refresh_spotify_access_token(
#             user_details["spotify_refresh_token"],
#             os.getenv("SPOTIFY_CLIENT_ID"),
#             os.getenv("SPOTIFY_CLIENT_SECRET")
#         )

#         user_repo.update_spotify_tokens(
#             current_user["id"]
#         )
#         response =
