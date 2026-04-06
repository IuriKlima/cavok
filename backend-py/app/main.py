from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import os, time, json

from .database import engine, Base, get_db
from .models import *
from .routes import auth, produtos, aeronaves, categorias, marcas, paginas, contatos, configuracoes, upload, importar, dashboard
from .seed import seed_data

# In-memory cache for public data
_cache = {}
CACHE_TTL = 60  # seconds

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_data()
    yield

app = FastAPI(
    title="Cavok Avionics API",
    description="API para o site Cavok Avionics",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas públicas
app.include_router(produtos.public_router, prefix="/api/produtos", tags=["Produtos"])
app.include_router(aeronaves.public_router, prefix="/api/aeronaves", tags=["Aeronaves"])
app.include_router(categorias.public_router, prefix="/api/categorias", tags=["Categorias"])
app.include_router(marcas.public_router, prefix="/api/marcas", tags=["Marcas"])
app.include_router(paginas.public_router, prefix="/api/paginas", tags=["Páginas"])
app.include_router(configuracoes.public_router, prefix="/api/configuracoes", tags=["Configurações"])
app.include_router(contatos.public_router, prefix="/api/contato", tags=["Contato"])

# Rotas admin
app.include_router(auth.router, prefix="/api/admin/auth", tags=["Auth"])
app.include_router(dashboard.router, prefix="/api/admin/dashboard", tags=["Dashboard"])
app.include_router(produtos.admin_router, prefix="/api/admin/produtos", tags=["Admin Produtos"])
app.include_router(aeronaves.admin_router, prefix="/api/admin/aeronaves", tags=["Admin Aeronaves"])
app.include_router(categorias.admin_router, prefix="/api/admin/categorias", tags=["Admin Categorias"])
app.include_router(paginas.admin_router, prefix="/api/admin/paginas", tags=["Admin Páginas"])
app.include_router(configuracoes.admin_router, prefix="/api/admin/configuracoes", tags=["Admin Configurações"])
app.include_router(contatos.admin_router, prefix="/api/admin/contatos", tags=["Admin Contatos"])
app.include_router(upload.router, prefix="/api/admin/upload", tags=["Upload"])
app.include_router(importar.router, prefix="/api/admin/import", tags=["Import"])

# Endpoint combinado - 1 chamada ao invés de 4
@app.get("/api/site-data", tags=["Site"])
async def site_data(db: AsyncSession = Depends(get_db)):
    now = time.time()
    if "site_data" in _cache and now - _cache["site_data"]["ts"] < CACHE_TTL:
        return JSONResponse(content=_cache["site_data"]["data"], headers={"Cache-Control": "public, max-age=60"})
    
    cats_result = await db.execute(select(Categoria).order_by(Categoria.ordem))
    cats = [{"id": c.id, "nome": c.nome, "slug": c.slug, "tipo": c.tipo, "ordem": c.ordem} for c in cats_result.scalars().all()]
    
    conf_result = await db.execute(select(Configuracao))
    conf = {c.chave: (c.valor or "") for c in conf_result.scalars().all()}
    
    data = {
        "categorias": cats,
        "categoriasProduto": [c for c in cats if c["tipo"] == "PRODUTO"],
        "categoriasAeronave": [c for c in cats if c["tipo"] == "AERONAVE"],
        "config": conf,
    }
    _cache["site_data"] = {"data": data, "ts": now}
    return JSONResponse(content=data, headers={"Cache-Control": "public, max-age=60"})

# Servir uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
