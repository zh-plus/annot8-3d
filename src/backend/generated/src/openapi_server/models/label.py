from pydantic import BaseModel
from typing import List

class Label(BaseModel):
    name: str
    color: str