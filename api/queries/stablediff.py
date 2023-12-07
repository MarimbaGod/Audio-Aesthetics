from pydantic import BaseModel
from typing import List, Optional


class StableDiffusionPrompt(BaseModel):
    track_titles: List[str]
    user_input: Optional[str] = None
    style_guide: Optional[str] = None
    upscale: bool = False
    model: str = "ae-sdxl-v1"
    width: int = 512
    height: int = 512
    negative_prompt: Optional[str] = None
    num_inference_steps: Optional[int] = 25
    guidance_scale: Optional[float] = 7


class AdvancedStableDiffusionPrompt(BaseModel):
    track_titles: list
    user_input: str
    style_guide: str
    upscale: bool = False
    model_id: str = "ae-sdxl-v1"  # Default model
    negative_prompt: str = ""
    num_inference_steps: int = 30
    guidance_scale: float = 7.5
    width: int = 512
    height: int = 512
