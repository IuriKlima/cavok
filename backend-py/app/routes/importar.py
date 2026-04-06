from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Produto, Aeronave, Categoria, Marca
from ..auth import get_current_user
import xml.etree.ElementTree as ET
import re, json

router = APIRouter()

@router.post("/xml")
async def importar_xml(file: UploadFile = File(...), db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    content = await file.read()
    try:
        root = ET.fromstring(content)
    except ET.ParseError as e:
        raise HTTPException(400, f"XML inválido: {e}")

    channel = root.find("channel")
    if channel is None:
        raise HTTPException(400, "XML inválido: canal não encontrado")

    ns = {
        "wp": "http://wordpress.org/export/1.2/",
        "content": "http://purl.org/rss/1.0/modules/content/",
        "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    }

    # Passo 1: Mapear todos os attachments (imagens) por post_id
    attachments = {}  # post_id -> url
    for item in channel.findall("item"):
        post_type_el = item.find("wp:post_type", ns)
        if post_type_el is not None and post_type_el.text == "attachment":
            post_id_el = item.find("wp:post_id", ns)
            if post_id_el is not None and post_id_el.text:
                url = item.findtext("guid", "")
                if url:
                    attachments[post_id_el.text] = url

    # Passo 2: Mapear gallery images (post_id -> [urls])
    # WooCommerce usa _product_image_gallery com IDs separados por vírgula

    produtos_importados = 0
    aeronaves_importadas = 0
    imagens_encontradas = len(attachments)
    erros = []

    for item in channel.findall("item"):
        post_type_el = item.find("wp:post_type", ns)
        status_el = item.find("wp:status", ns)
        post_type = post_type_el.text if post_type_el is not None else ""
        status = status_el.text if status_el is not None else ""

        if post_type == "product" and status == "publish":
            try:
                await importar_produto(item, ns, db, attachments)
                produtos_importados += 1
            except Exception as e:
                title = item.findtext("title", "?")
                erros.append(f"Produto '{title}': {e}")

        elif post_type == "aeronave" and status == "publish":
            try:
                await importar_aeronave(item, ns, db, attachments)
                aeronaves_importadas += 1
            except Exception as e:
                title = item.findtext("title", "?")
                erros.append(f"Aeronave '{title}': {e}")

    await db.commit()
    return {
        "produtosImportados": produtos_importados,
        "aeronavesImportadas": aeronaves_importadas,
        "imagensEncontradas": imagens_encontradas,
        "erros": erros,
    }


async def importar_produto(item, ns, db, attachments):
    nome = item.findtext("title", "")
    slug_el = item.find("wp:post_name", ns)
    slug = slug_el.text if slug_el is not None and slug_el.text else re.sub(r'[^a-z0-9]+', '-', nome.lower()).strip('-')

    # Se já existe, atualiza a imagem
    result = await db.execute(select(Produto).where(Produto.slug == slug))
    existing = result.scalar_one_or_none()

    descricao = item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded", "")
    descricao_curta = item.findtext("{http://wordpress.org/export/1.2/excerpt/}encoded", "")

    metas = get_post_metas(item, ns)
    preco_str = metas.get("_price") or metas.get("_regular_price")
    preco = float(preco_str) if preco_str and preco_str.strip() else None
    sku = metas.get("_sku", "")

    # Imagem principal via _thumbnail_id
    thumbnail_id = metas.get("_thumbnail_id", "")
    imagem_principal = attachments.get(thumbnail_id, "")

    # Galeria de imagens via _product_image_gallery
    gallery_ids_str = metas.get("_product_image_gallery", "")
    imagens = []
    if gallery_ids_str:
        for gid in gallery_ids_str.split(","):
            gid = gid.strip()
            if gid and gid in attachments:
                imagens.append(attachments[gid])

    # Também extrair imagens do conteúdo HTML
    if descricao:
        img_urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', descricao)
        for url in img_urls:
            if url not in imagens and url != imagem_principal:
                imagens.append(url)

    cat_name = get_term(item, "product_cat")
    categoria = None
    if cat_name:
        cat_slug = re.sub(r'[^a-z0-9]+', '-', cat_name.lower()).strip('-')
        result = await db.execute(select(Categoria).where(Categoria.slug == cat_slug))
        categoria = result.scalar_one_or_none()

    marca_name = get_term(item, "marca")
    marca = None
    if marca_name:
        marca_slug = re.sub(r'[^a-z0-9]+', '-', marca_name.lower()).strip('-')
        result = await db.execute(select(Marca).where(Marca.slug == marca_slug))
        marca = result.scalar_one_or_none()
        if not marca:
            marca = Marca(nome=marca_name, slug=marca_slug)
            db.add(marca)
            await db.flush()

    homol = get_term(item, "homologado")
    homologado = bool(homol and "homologado" in homol.lower() and "não" not in homol.lower())
    condicao = get_term(item, "condicao")

    if existing:
        # Atualizar imagens do produto existente
        existing.imagem_principal = imagem_principal or existing.imagem_principal
        existing.imagens = json.dumps(imagens) if imagens else existing.imagens
        if descricao:
            existing.descricao = descricao
        if preco:
            existing.preco = preco
    else:
        p = Produto(nome=nome, slug=slug, descricao=descricao, descricao_curta=descricao_curta,
            preco=preco, sku=sku, homologado=homologado, condicao=condicao,
            imagem_principal=imagem_principal, imagens=json.dumps(imagens) if imagens else None,
            categoria_id=categoria.id if categoria else None, marca_id=marca.id if marca else None,
            status="ATIVO")
        db.add(p)


async def importar_aeronave(item, ns, db, attachments):
    nome = item.findtext("title", "")
    slug_el = item.find("wp:post_name", ns)
    slug = slug_el.text if slug_el is not None and slug_el.text else re.sub(r'[^a-z0-9]+', '-', nome.lower()).strip('-')

    result = await db.execute(select(Aeronave).where(Aeronave.slug == slug))
    existing = result.scalar_one_or_none()

    descricao = item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded", "")
    metas = get_post_metas(item, ns)

    # Imagem principal
    thumbnail_id = metas.get("_thumbnail_id", "")
    imagem_principal = attachments.get(thumbnail_id, "")

    # Galeria
    gallery_str = metas.get("_product_image_gallery", "") or metas.get("aeronave_gallery", "")
    imagens = []
    if gallery_str:
        for gid in gallery_str.split(","):
            gid = gid.strip()
            if gid and gid in attachments:
                imagens.append(attachments[gid])

    # Imagens do conteúdo
    if descricao:
        img_urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', descricao)
        for url in img_urls:
            if url not in imagens and url != imagem_principal:
                imagens.append(url)

    cat_name = get_term(item, "gategoria-da-aeronave")
    categoria = None
    if cat_name:
        cat_slug = re.sub(r'[^a-z0-9]+', '-', cat_name.lower()).strip('-')
        result = await db.execute(select(Categoria).where(Categoria.slug == cat_slug))
        categoria = result.scalar_one_or_none()

    if existing:
        existing.imagem_principal = imagem_principal or existing.imagem_principal
        existing.imagens = json.dumps(imagens) if imagens else existing.imagens
        if descricao:
            existing.descricao = descricao
    else:
        a = Aeronave(nome=nome, slug=slug, descricao=descricao,
            imagem_principal=imagem_principal, imagens=json.dumps(imagens) if imagens else None,
            assentos=metas.get("Assentos"), horas_celula=metas.get("Horas totais de célula"),
            ano_fabricacao=metas.get("Ano de fabricação"), especificacoes=metas.get("especificacoes"),
            categoria_id=categoria.id if categoria else None, status="DISPONIVEL")
        db.add(a)


def get_post_metas(item, ns):
    metas = {}
    for meta in item.findall("wp:postmeta", ns):
        key = meta.findtext("wp:meta_key", "", ns)
        value = meta.findtext("wp:meta_value", "", ns)
        if key and value:
            metas[key] = value
    return metas


def get_term(item, taxonomy):
    for cat in item.findall("category"):
        if cat.get("domain") == taxonomy:
            return cat.text
    return None
