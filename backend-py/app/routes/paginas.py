from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import Pagina
from ..auth import get_current_user

public_router = APIRouter()
admin_router = APIRouter()

def pag_to_dict(p):
    return {"id": p.id, "titulo": p.titulo, "slug": p.slug, "conteudo": p.conteudo, "metaTitle": p.meta_title, "metaDescription": p.meta_description, "imagemDestaque": p.imagem_destaque, "criadoEm": p.criado_em.isoformat() if p.criado_em else None}

@public_router.get("/{slug}")
async def por_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Pagina).where(Pagina.slug == slug))
    p = result.scalar_one_or_none()
    if not p: raise HTTPException(404)
    return pag_to_dict(p)

class PaginaRequest(BaseModel):
    titulo: str; slug: str; conteudo: Optional[str] = None; metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None; imagemDestaque: Optional[str] = None

@admin_router.get("")
async def admin_listar(db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    result = await db.execute(select(Pagina))
    return [pag_to_dict(p) for p in result.scalars().all()]

@admin_router.post("")
async def admin_criar(req: PaginaRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    p = Pagina(titulo=req.titulo, slug=req.slug, conteudo=req.conteudo, meta_title=req.metaTitle, meta_description=req.metaDescription, imagem_destaque=req.imagemDestaque)
    db.add(p); await db.commit(); await db.refresh(p); return pag_to_dict(p)

@admin_router.put("/{id}")
async def admin_atualizar(id: int, req: PaginaRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    p = await db.get(Pagina, id)
    if not p: raise HTTPException(404)
    p.titulo=req.titulo; p.slug=req.slug; p.conteudo=req.conteudo; p.meta_title=req.metaTitle; p.meta_description=req.metaDescription; p.imagem_destaque=req.imagemDestaque
    await db.commit(); return pag_to_dict(p)

@admin_router.delete("/{id}")
async def admin_deletar(id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    p = await db.get(Pagina, id)
    if not p: raise HTTPException(404)
    await db.delete(p); await db.commit(); return {"message": "Página deletada"}
