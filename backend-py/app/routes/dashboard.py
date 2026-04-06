from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Produto, Aeronave, Categoria, Contato
from ..auth import get_current_user

router = APIRouter()

@router.get("")
async def stats(db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    total_produtos = (await db.execute(select(func.count(Produto.id)).where(Produto.status == "ATIVO"))).scalar() or 0
    total_aeronaves = (await db.execute(select(func.count(Aeronave.id)).where(Aeronave.status != "INATIVA"))).scalar() or 0
    total_categorias = (await db.execute(select(func.count(Categoria.id)))).scalar() or 0
    contatos_nao_lidos = (await db.execute(select(func.count(Contato.id)).where(Contato.lido == False))).scalar() or 0
    return {
        "totalProdutos": total_produtos,
        "totalAeronaves": total_aeronaves,
        "totalCategorias": total_categorias,
        "contatosNaoLidos": contatos_nao_lidos,
    }
