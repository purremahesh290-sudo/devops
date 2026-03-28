"""Auth router - signup and login. MSc Cloud DevOpsSec - Construction Progress Tracker"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserRole
from app.schemas import SignupRequest, LoginRequest, AuthResponse, MessageResponse
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=MessageResponse, status_code=201)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    db.add(User(username=req.username, email=req.email, password_hash=hash_password(req.password), role=UserRole.WORKER))
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(data={"sub": user.username, "role": user.role.value})
    return {"token": token, "username": user.username, "role": user.role.value}
