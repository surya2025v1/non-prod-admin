from fastapi import FastAPI

app = FastAPI()

# This is a placeholder file. The actual application is in app/main.py
# Run with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

@app.get("/")
async def root():
    return {"message": "Please use 'uvicorn app.main:app' to run the actual application"} 