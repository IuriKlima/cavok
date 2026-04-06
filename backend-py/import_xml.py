import urllib.request
import json
import os
import sys

BASE = "http://127.0.0.1:8080"
XML_PATH = r"C:\Users\laris\Desktop\cavok\cavokavionicsvendadeavinicoseaeronaves.WordPress.2026-03-27.xml"

# 1. Login
print("== Login ==")
login_data = json.dumps({"email": "admin@cavokavionics.com.br", "senha": "cavok2026"}).encode()
req = urllib.request.Request(f"{BASE}/api/admin/auth/login", data=login_data, headers={"Content-Type": "application/json"})
res = urllib.request.urlopen(req)
token = json.loads(res.read())["token"]
print(f"   Token obtido!")

# 2. Upload XML via multipart
print("\n== Importando XML ==")
print(f"   Arquivo: {XML_PATH}")
file_size = os.path.getsize(XML_PATH)
print(f"   Tamanho: {file_size / 1024:.0f} KB")

boundary = "----CavokImportBoundary2026"
with open(XML_PATH, "rb") as f:
    file_content = f.read()

body = (
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="file"; filename="wordpress-export.xml"\r\n'
    f"Content-Type: application/xml\r\n\r\n"
).encode("utf-8") + file_content + f"\r\n--{boundary}--\r\n".encode("utf-8")

req = urllib.request.Request(
    f"{BASE}/api/admin/import/xml",
    data=body,
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": f"multipart/form-data; boundary={boundary}",
    },
)

try:
    res = urllib.request.urlopen(req, timeout=120)
    result = json.loads(res.read())
    print(f"\n   Produtos importados: {result.get('produtosImportados', 0)}")
    print(f"   Aeronaves importadas: {result.get('aeronavesImportadas', 0)}")
    print(f"   Imagens encontradas: {result.get('imagensEncontradas', 0)}")
    if result.get("erros"):
        print(f"\n   Erros ({len(result['erros'])}):")
        for e in result["erros"][:10]:
            print(f"     - {e}")
except urllib.error.HTTPError as e:
    error_body = e.read().decode()
    print(f"   ERRO {e.code}: {error_body}")
    sys.exit(1)

# 3. Verificar dados importados
print("\n== Verificando dados ==")
req = urllib.request.Request(f"{BASE}/api/produtos?size=5", headers={"Authorization": f"Bearer {token}"})
res = urllib.request.urlopen(req)
data = json.loads(res.read())
print(f"   Total de produtos no banco: {data['totalElements']}")
for p in data["content"][:5]:
    cat = p.get("categoria", {})
    cat_name = cat.get("nome", "Sem cat.") if cat else "Sem cat."
    print(f"     - {p['nome']} [{cat_name}]")

req = urllib.request.Request(f"{BASE}/api/aeronaves?size=5")
res = urllib.request.urlopen(req)
data = json.loads(res.read())
print(f"\n   Total de aeronaves no banco: {data['totalElements']}")
for a in data["content"][:5]:
    print(f"     - {a['nome']}")

# 4. Dashboard final
req = urllib.request.Request(f"{BASE}/api/admin/dashboard", headers={"Authorization": f"Bearer {token}"})
res = urllib.request.urlopen(req)
dashboard = json.loads(res.read())
print(f"\n== Dashboard Final ==")
print(f"   Produtos: {dashboard['totalProdutos']}")
print(f"   Aeronaves: {dashboard['totalAeronaves']}")
print(f"   Categorias: {dashboard['totalCategorias']}")

print("\n>> Importacao concluida com sucesso!")
