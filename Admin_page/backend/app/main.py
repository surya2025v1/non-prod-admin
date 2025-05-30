from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.login import router as login_router
from app.api.v1.website import router as website_router
from app.core.config import settings

app = FastAPI()

# CORS setup: allow origins from config (currently ["*"], change in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router, prefix="/api/v1")
app.include_router(website_router, prefix="/api/v1") 