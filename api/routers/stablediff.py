from fastapi import FastAPI, HTTPException, Request, APIRouter
import requests
import os
from queries.stablediff import StableDiffusionPrompt

api_key = os.getenv("STABLE_DIFFUSION_API_KEY")

router = APIRouter()


@router.post("/generate-image")
async def generate_image(
    request: StableDiffusionPrompt
):
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="API key not found"
        )
    combined_prompt = ', '.join(request.track_titles)
    if request.user_input:
        combined_prompt += f", {request.user_input}"
    if request.style_guide:
        combined_prompt += f", {request.style_guide}"

    width, height = request.width, request.height
    if request.upscale:
        width *= 2
        height *= 2

    url = "https://stablediffusionapi.com/api/v3/text2img"
    headers = {"Content-Type": "application/json"}
    payload = {
        "key": api_key,
        "prompt": combined_prompt,
        "width": width,
        "height": height,
        "model": request.model if request.model else 'default_model'
        # Any other parameters, upscaler?
    }

    response = requests.post(
        url, json=payload, headers=headers
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail="Error calling Stable Diffusion"
        )

    return response.json()
