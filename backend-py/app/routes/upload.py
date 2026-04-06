from fastapi import APIRouter, Depends, UploadFile, File
from ..auth import get_current_user
import os, uuid
from PIL import Image
from io import BytesIO

router = APIRouter()

UPLOAD_DIR = "uploads"

def convert_to_webp(file_bytes: bytes, quality: int = 85) -> bytes:
    """Converte qualquer imagem para WebP."""
    try:
        img = Image.open(BytesIO(file_bytes))
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
        # Redimensionar se muito grande (max 1920px)
        max_size = 1920
        if img.width > max_size or img.height > max_size:
            img.thumbnail((max_size, max_size), Image.LANCZOS)
        output = BytesIO()
        img.save(output, format='WEBP', quality=quality, method=4)
        return output.getvalue()
    except Exception:
        return file_bytes  # Se falhar, retorna original

@router.post("")
async def upload_files(files: list[UploadFile] = File(...), user=Depends(get_current_user)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    urls = []
    for file in files:
        content = await file.read()
        original_name = os.path.splitext(file.filename or "image.jpg")[0]
        
        # Converter para WebP
        webp_content = convert_to_webp(content)
        filename = f"{uuid.uuid4()}.webp"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(webp_content)
        
        urls.append(f"/uploads/{filename}")
    
    return {"urls": urls, "message": f"{len(urls)} arquivo(s) convertido(s) para WebP"}
