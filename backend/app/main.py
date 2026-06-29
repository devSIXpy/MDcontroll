import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.finances import router as finances_router
from app.api.tasks import router as tasks_router
from app.api.ideas import router as ideas_router
from app.api.dashboard import router as dashboard_router

load_dotenv()

app = FastAPI(title="MD API")

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


app.include_router(finances_router)
app.include_router(tasks_router)
app.include_router(ideas_router)
app.include_router(dashboard_router)
