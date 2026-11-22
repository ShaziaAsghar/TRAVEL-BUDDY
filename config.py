import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-development-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///travel_buddy.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
