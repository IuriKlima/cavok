import urllib.request
import json

BASE = "http://127.0.0.1:8080"

# Check products with images
req = urllib.request.Request(f"{BASE}/api/produtos?size=5")
res = urllib.request.urlopen(req)
data = json.loads(res.read())

print("== Produtos com imagens ==")
for p in data["content"][:10]:
    img = p.get("imagemPrincipal", "")
    n_imgs = len(p.get("imagens", []))
    status = "COM IMAGEM" if img else "SEM IMAGEM"
    print(f"  [{status}] {p['nome']}")
    if img:
        print(f"    -> {img[:80]}")
    if n_imgs > 0:
        print(f"    + {n_imgs} imagens extras")

# Check aeronaves
req = urllib.request.Request(f"{BASE}/api/aeronaves?size=10")
res = urllib.request.urlopen(req)
data = json.loads(res.read())

print(f"\n== Aeronaves com imagens ==")
for a in data["content"]:
    img = a.get("imagemPrincipal", "")
    status = "COM IMAGEM" if img else "SEM IMAGEM"
    print(f"  [{status}] {a['nome']}")
    if img:
        print(f"    -> {img[:80]}")

# Count totals
req = urllib.request.Request(f"{BASE}/api/produtos?size=200")
res = urllib.request.urlopen(req)
data = json.loads(res.read())
with_img = sum(1 for p in data["content"] if p.get("imagemPrincipal"))
print(f"\n== Resumo ==")
print(f"  Produtos com imagem: {with_img}/{len(data['content'])}")
