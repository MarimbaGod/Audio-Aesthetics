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
