from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Marca

public_router = APIRouter()

@public_router.get("")
async def listar(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Marca))
    return [{"id": m.id, "nome": m.nome, "slug": m.slug, "logoUrl": m.logo_url} for m in result.scalars().all()]
