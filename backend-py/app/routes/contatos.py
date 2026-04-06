from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from ..database import get_db
from ..models import Contato
from ..auth import get_current_user

public_router = APIRouter()
admin_router = APIRouter()

class ContatoRequest(BaseModel):
    nome: str; email: str; telefone: str = None; mensagem: str
    produtoId: int = None; aeronaveId: int = None; tipo: str = "CONTATO"

@public_router.post("")
async def enviar(req: ContatoRequest, db: AsyncSession = Depends(get_db)):
    c = Contato(nome=req.nome, email=req.email, telefone=req.telefone, mensagem=req.mensagem, produto_id=req.produtoId, aeronave_id=req.aeronaveId, tipo=req.tipo.upper())
    db.add(c); await db.commit()
    return {"message": "Mensagem enviada com sucesso!"}

@admin_router.get("")
async def admin_listar(page: int = 0, size: int = 20, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    result = await db.execute(select(Contato).order_by(Contato.criado_em.desc()).offset(page*size).limit(size))
    return {"content": [{"id":c.id,"nome":c.nome,"email":c.email,"telefone":c.telefone,"mensagem":c.mensagem,"tipo":c.tipo,"lido":c.lido,"criadoEm":c.criado_em.isoformat() if c.criado_em else None} for c in result.scalars().all()]}

@admin_router.put("/{id}/lido")
async def marcar_lido(id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    c = await db.get(Contato, id)
    if not c: raise HTTPException(404)
    c.lido = True; await db.commit(); return {"message": "Marcado como lido"}

@admin_router.delete("/{id}")
async def deletar(id: int, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    c = await db.get(Contato, id)
    if not c: raise HTTPException(404)
    await db.delete(c); await db.commit(); return {"message": "Contato deletado"}
