from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    user = User(
        name=data.name.strip(),
        email=data.email.lower().strip(),
        password_hash=get_password_hash(data.password),
        shop_name=data.shop_name.strip() if data.shop_name else "Renuka Chai Centre"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower().strip()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.post("/demo-login", response_model=Token)
def demo_login(db: Session = Depends(get_db)):
    """One-click instant login as default shop owner with pre-loaded sample data"""
    email = "owner@renukachai.com"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name="Renuka Admin",
            email=email,
            password_hash=get_password_hash("renuka123"),
            shop_name="Renuka Chai Centre"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
