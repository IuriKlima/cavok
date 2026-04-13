from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List
from ..database import get_db
from ..models import Aeronave
from ..auth import get_current_user
import json, re

public_router = APIRouter()
admin_router = APIRouter()

def aeronave_to_dict(a):
    return {
        "id": a.id, "nome": a.nome, "slug": a.slug, "descricao": a.descricao,
        "assentos": a.assentos, "horasCelula": a.horas_celula, "anoFabricacao": a.ano_fabricacao,
        "especificacoes": a.especificacoes, "preco": float(a.preco) if a.preco else None,
        "imagemPrincipal": a.imagem_principal, "imagens": json.loads(a.imagens) if a.imagens else [],
        "status": a.status, "destaque": a.destaque,
        "categoria": {"id": a.categoria.id, "nome": a.categoria.nome} if a.categoria else None,
        "criadoEm": a.criado_em.isoformat() if a.criado_em else None,
    }

@public_router.get("")
async def listar(page: int = 0, size: int = 12, categoriaId: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    q = select(Aeronave).where(Aeronave.status != "INATIVA")
    if categoriaId: q = q.where(Aeronave.categoria_id == categoriaId)
    result = await db.execute(q.order_by(Aeronave.criado_em.desc()).offset(page * size).limit(size))
    total = (await db.execute(select(func.count(Aeronave.id)).where(Aeronave.status != "INATIVA"))).scalar() or 0
    return {"content": [aeronave_to_dict(a) for a in result.scalars().all()], "totalElements": total}

@public_router.get("/destaques")
async def destaques(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Aeronave).where(Aeronave.destaque == True))
    return [aeronave_to_dict(a) for a in result.scalars().all()]

@public_router.get("/{slug}")
async def por_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Aeronave).where(Aeronave.slug == slug))
    a = result.scalar_one_or_none()
    if not a: raise HTTPException(404)
    return aeronave_to_dict(a)

@public_router.get("/{slug}/relacionados")
async def relacionados(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Aeronave).where(Aeronave.slug == slug))
    a = result.scalar_one_or_none()
    if not a: return []
    if not a.categoria_id: return []
    q = select(Aeronave).where(Aeronave.categoria_id == a.categoria_id, Aeronave.id != a.id, Aeronave.status != "INATIVA").limit(4)
    result = await db.execute(q)
    return [aeronave_to_dict(r) for r in result.scalars().all()]

class AeronaveRequest(BaseModel):
    nome: str; slug: Optional[str] = None; descricao: Optional[str] = None
    assentos: Optional[str] = None; horasCelula: Optional[str] = None; anoFabricacao: Optional[str] = None
    especificacoes: Optional[str] = None; preco: Optional[float] = None
    imagemPrincipal: Optional[str] = None; imagens: Optional[List[str]] = []
    status: Optional[str] = "DISPONIVEL"; destaque: Optional[bool] = False; categoriaId: Optional[int] = None

@admin_router.get("")
async def admin_listar(page: int = 0, size: int = 20, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    result = await db.execute(select(Aeronave).order_by(Aeronave.criado_em.desc()).offset(page*size).limit(size))
    total = (await db.execute(select(func.count(Aeronave.id)))).scalar() or 0
    return {"content": [aeronave_to_dict(a) for a in result.scalars().all()], "totalElements": total}

@admin_router.post("")
async def admin_criar(req: AeronaveRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    a = Aeronave(nome=req.nome, slug=req.slug or re.sub(r'[^a-z0-9]+','-',req.nome.lower()).strip('-'),
        descricao=req.descricao, assentos=req.assentos, horas_celula=req.horasCelula,
        ano_fabricacao=req.anoFabricacao, especificacoes=req.especificacoes, preco=req.preco,
        imagem_principal=req.imagemPrincipal, imagens=json.dumps(req.imagens or []),
        status=req.status, destaque=req.destaque, categoria_id=req.categoriaId)
    db.add(a); await db.commit(); await db.refresh(a); return aeronave_to_dict(a)

@admin_router.put("/{id}")
async def admin_atualizar(id: int, req: AeronaveRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    a = await db.get(Aeronave, id)
    if not a: raise HTTPException(404)
    a.nome=req.nome; a.slug=req.slug or a.slug; a.descricao=req.descricao; a.assentos=req.assentos
    a.horas_celula=req.horasCelula; a.ano_fabricacao=req.anoFabricacao; a.especificacoes=req.especificacoes
    a.preco=req.preco; a.imagem_principal=req.imagemPrincipal; a.imagens=json.dumps(req.imagens or [])
    a.status=req.status; a.destaque=req.destaque; a.categoria_id=req.categoriaId
    await db.commit(); return aeronave_to_dict(a)

@admin_router.delete("/{id}")
async def admin_deletar(id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    a = await db.get(Aeronave, id)
    if not a: raise HTTPException(404)
    await db.delete(a); await db.commit(); return {"message": "Aeronave deletada"}
