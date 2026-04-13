from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models import Configuracao
from ..auth import get_current_user

public_router = APIRouter()
admin_router = APIRouter()

@public_router.get("")
async def listar(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Configuracao))
    return {c.chave: (c.valor or "") for c in result.scalars().all()}

class ConfigItem(BaseModel):
    chave: str
    valor: Optional[str] = ""
    tipo: Optional[str] = "text"

@admin_router.get("")
async def admin_listar(db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    result = await db.execute(select(Configuracao).order_by(Configuracao.id))
    return [{"id": c.id, "chave": c.chave, "valor": c.valor or "", "tipo": c.tipo or "text"} for c in result.scalars().all()]

@admin_router.put("")
async def admin_atualizar(items: List[ConfigItem], db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    for item in items:
        result = await db.execute(select(Configuracao).where(Configuracao.chave == item.chave))
        c = result.scalar_one_or_none()
        if c:
            c.valor = item.valor or ""
            c.tipo = item.tipo or c.tipo or "text"
        else:
            db.add(Configuracao(chave=item.chave, valor=item.valor or "", tipo=item.tipo or "text"))
    await db.commit()
    # Return updated list
    result = await db.execute(select(Configuracao).order_by(Configuracao.id))
    return [{"id": c.id, "chave": c.chave, "valor": c.valor or "", "tipo": c.tipo or "text"} for c in result.scalars().all()]
