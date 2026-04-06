from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from ..database import get_db
from ..models import Usuario
from ..auth import verify_password, create_token

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    senha: str

@router.post("/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Usuario).where(Usuario.email == req.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.senha, user.senha):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    token = create_token(user.email, user.role)
    return {"token": token, "nome": user.nome, "email": user.email, "role": user.role}
