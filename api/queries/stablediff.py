from pydantic import BaseModel
from typing import List, Optional


class StableDiffusionPrompt(BaseModel):
    track_titles: List[str]
    user_input: Optional[str] = None
    style_guide: Optional[str] = None
    upscale: bool = False
    model: str = ''
    width: int = 512
    height: int = 512
