# app.py or main.py

from fastapi import FastAPI
from routes import ehrRoutes

app = FastAPI()
app.include_router(ehrRoutes.router)
