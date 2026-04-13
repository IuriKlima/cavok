from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import Slide
from ..auth import get_current_user

public_router = APIRouter()
admin_router = APIRouter()

def slide_to_dict(s):
    return {
        "id": s.id, "titulo": s.titulo, "subtitulo": s.subtitulo,
        "imagemUrl": s.imagem_url, "link": s.link, "textoBotao": s.texto_botao,
        "ordem": s.ordem, "ativo": s.ativo,
        "criadoEm": s.criado_em.isoformat() if s.criado_em else None,
    }

# ====== PUBLIC ======
@public_router.get("")
async def listar_ativos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Slide).where(Slide.ativo == True).order_by(Slide.ordem))
    return [slide_to_dict(s) for s in result.scalars().all()]

# ====== ADMIN ======
class SlideRequest(BaseModel):
    titulo: Optional[str] = ""
    subtitulo: Optional[str] = ""
    imagemUrl: Optional[str] = ""
    link: Optional[str] = ""
    textoBotao: Optional[str] = ""
    ordem: Optional[int] = 0
    ativo: Optional[bool] = True

@admin_router.get("")
async def admin_listar(db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    result = await db.execute(select(Slide).order_by(Slide.ordem))
    return [slide_to_dict(s) for s in result.scalars().all()]

@admin_router.post("")
async def admin_criar(req: SlideRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    s = Slide(titulo=req.titulo, subtitulo=req.subtitulo, imagem_url=req.imagemUrl,
              link=req.link, texto_botao=req.textoBotao, ordem=req.ordem, ativo=req.ativo)
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return slide_to_dict(s)

@admin_router.put("/{id}")
async def admin_atualizar(id: int, req: SlideRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    s = await db.get(Slide, id)
    if not s: raise HTTPException(404, "Slide não encontrado")
    s.titulo = req.titulo; s.subtitulo = req.subtitulo; s.imagem_url = req.imagemUrl
    s.link = req.link; s.texto_botao = req.textoBotao; s.ordem = req.ordem; s.ativo = req.ativo
    await db.commit()
    await db.refresh(s)
    return slide_to_dict(s)

@admin_router.delete("/{id}")
async def admin_deletar(id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    s = await db.get(Slide, id)
    if not s: raise HTTPException(404, "Slide não encontrado")
    await db.delete(s)
    await db.commit()
    return {"message": "Slide deletado"}
