from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List
from ..database import get_db
from ..models import Produto
from ..auth import get_current_user
import json, re

public_router = APIRouter()
admin_router = APIRouter()

def produto_to_dict(p):
    return {
        "id": p.id, "nome": p.nome, "slug": p.slug, "descricao": p.descricao,
        "descricaoCurta": p.descricao_curta, "preco": float(p.preco) if p.preco else None,
        "sku": p.sku, "imagemPrincipal": p.imagem_principal,
        "imagens": json.loads(p.imagens) if p.imagens else [],
        "homologado": p.homologado, "condicao": p.condicao, "status": p.status,
        "destaque": p.destaque,
        "categoria": {"id": p.categoria.id, "nome": p.categoria.nome, "slug": p.categoria.slug} if p.categoria else None,
        "marca": {"id": p.marca.id, "nome": p.marca.nome, "slug": p.marca.slug} if p.marca else None,
        "criadoEm": p.criado_em.isoformat() if p.criado_em else None,
    }

def make_slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

# ====== PUBLIC ======
@public_router.get("")
async def listar(page: int = 0, size: int = 12, categoriaId: Optional[int] = None, marcaId: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    q = select(Produto).where(Produto.status == "ATIVO")
    if categoriaId: q = q.where(Produto.categoria_id == categoriaId)
    if marcaId: q = q.where(Produto.marca_id == marcaId)
    q = q.order_by(Produto.nome).offset(page * size).limit(size)
    result = await db.execute(q)
    total = (await db.execute(select(func.count(Produto.id)).where(Produto.status == "ATIVO"))).scalar() or 0
    return {"content": [produto_to_dict(p) for p in result.scalars().all()], "totalElements": total, "number": page, "size": size}

@public_router.get("/busca")
async def buscar(q: str = "", page: int = 0, size: int = 12, db: AsyncSession = Depends(get_db)):
    query = select(Produto).where(Produto.status == "ATIVO", or_(Produto.nome.ilike(f"%{q}%"), Produto.descricao.ilike(f"%{q}%"), Produto.sku.ilike(f"%{q}%")))
    result = await db.execute(query.offset(page * size).limit(size))
    return {"content": [produto_to_dict(p) for p in result.scalars().all()], "number": page}

@public_router.get("/destaques")
async def destaques(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Produto).where(Produto.destaque == True, Produto.status == "ATIVO"))
    return [produto_to_dict(p) for p in result.scalars().all()]

@public_router.get("/{slug}")
async def por_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Produto).where(Produto.slug == slug))
    p = result.scalar_one_or_none()
    if not p: raise HTTPException(404, "Produto não encontrado")
    return produto_to_dict(p)

# ====== ADMIN ======
class ProdutoRequest(BaseModel):
    nome: str
    slug: Optional[str] = None
    descricao: Optional[str] = None
    descricaoCurta: Optional[str] = None
    preco: Optional[float] = None
    sku: Optional[str] = None
    imagemPrincipal: Optional[str] = None
    imagens: Optional[List[str]] = []
    homologado: Optional[bool] = False
    condicao: Optional[str] = None
    status: Optional[str] = "ATIVO"
    destaque: Optional[bool] = False
    categoriaId: Optional[int] = None
    marcaId: Optional[int] = None

@admin_router.get("")
async def admin_listar(page: int = 0, size: int = 20, q: Optional[str] = None, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    query = select(Produto)
    if q: query = query.where(or_(Produto.nome.ilike(f"%{q}%"), Produto.sku.ilike(f"%{q}%")))
    query = query.order_by(Produto.criado_em.desc()).offset(page * size).limit(size)
    result = await db.execute(query)
    total = (await db.execute(select(func.count(Produto.id)))).scalar() or 0
    return {"content": [produto_to_dict(p) for p in result.scalars().all()], "totalElements": total, "number": page}

@admin_router.get("/{id}")
async def admin_por_id(id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    p = await db.get(Produto, id)
    if not p: raise HTTPException(404)
    return produto_to_dict(p)

@admin_router.post("")
async def admin_criar(req: ProdutoRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    p = Produto(nome=req.nome, slug=req.slug or make_slug(req.nome), descricao=req.descricao,
        descricao_curta=req.descricaoCurta, preco=req.preco, sku=req.sku,
        imagem_principal=req.imagemPrincipal, imagens=json.dumps(req.imagens or []),
        homologado=req.homologado, condicao=req.condicao, status=req.status,
        destaque=req.destaque, categoria_id=req.categoriaId, marca_id=req.marcaId)
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return produto_to_dict(p)

@admin_router.put("/{id}")
async def admin_atualizar(id: int, req: ProdutoRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    p = await db.get(Produto, id)
    if not p: raise HTTPException(404)
    p.nome = req.nome; p.slug = req.slug or make_slug(req.nome); p.descricao = req.descricao
    p.descricao_curta = req.descricaoCurta; p.preco = req.preco; p.sku = req.sku
    p.imagem_principal = req.imagemPrincipal; p.imagens = json.dumps(req.imagens or [])
    p.homologado = req.homologado; p.condicao = req.condicao; p.status = req.status
    p.destaque = req.destaque; p.categoria_id = req.categoriaId; p.marca_id = req.marcaId
    await db.commit()
    return produto_to_dict(p)

@admin_router.delete("/{id}")
async def admin_deletar(id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    p = await db.get(Produto, id)
    if not p: raise HTTPException(404)
    await db.delete(p)
    await db.commit()
    return {"message": "Produto deletado"}
