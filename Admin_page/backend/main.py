from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

app = FastAPI()

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/v1/login")
async def login(request: LoginRequest):
    # Placeholder logic for login validation
    if request.username == "admin" and request.password == "admin":
        return {"status": "success", "message": "Login successful"}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password") 