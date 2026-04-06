from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import Categoria
from ..auth import get_current_user

public_router = APIRouter()
admin_router = APIRouter()

def cat_to_dict(c):
    return {"id": c.id, "nome": c.nome, "slug": c.slug, "descricao": c.descricao, "imagemUrl": c.imagem_url, "tipo": c.tipo, "ordem": c.ordem}

@public_router.get("")
async def listar(tipo: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    q = select(Categoria)
    if tipo: q = q.where(Categoria.tipo == tipo.upper())
    q = q.order_by(Categoria.ordem)
    result = await db.execute(q)
    return [cat_to_dict(c) for c in result.scalars().all()]

class CategoriaRequest(BaseModel):
    nome: str; slug: str; descricao: Optional[str] = None; imagemUrl: Optional[str] = None
    tipo: str; ordem: Optional[int] = 0

@admin_router.get("")
async def admin_listar(tipo: Optional[str] = None, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    q = select(Categoria)
    if tipo: q = q.where(Categoria.tipo == tipo.upper())
    result = await db.execute(q.order_by(Categoria.ordem))
    return [cat_to_dict(c) for c in result.scalars().all()]

@admin_router.post("")
async def admin_criar(req: CategoriaRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    c = Categoria(nome=req.nome, slug=req.slug, descricao=req.descricao, imagem_url=req.imagemUrl, tipo=req.tipo.upper(), ordem=req.ordem)
    db.add(c); await db.commit(); await db.refresh(c); return cat_to_dict(c)

@admin_router.put("/{id}")
async def admin_atualizar(id: int, req: CategoriaRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    c = await db.get(Categoria, id)
    if not c: raise HTTPException(404)
    c.nome=req.nome; c.slug=req.slug; c.descricao=req.descricao; c.imagem_url=req.imagemUrl; c.tipo=req.tipo.upper(); c.ordem=req.ordem
    await db.commit(); return cat_to_dict(c)

@admin_router.delete("/{id}")
async def admin_deletar(id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    c = await db.get(Categoria, id)
    if not c: raise HTTPException(404)
    await db.delete(c); await db.commit(); return {"message": "Categoria deletada"}
