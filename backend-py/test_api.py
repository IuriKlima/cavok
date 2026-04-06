import urllib.request
import json

base = "http://127.0.0.1:8080"

def get(url):
    req = urllib.request.Request(base + url)
    res = urllib.request.urlopen(req)
    return json.loads(res.read())

def post(url, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(base + url, data=json.dumps(data).encode(), headers=headers)
    res = urllib.request.urlopen(req)
    return json.loads(res.read())

print("=== Test 1: API Docs ===")
try:
    req = urllib.request.Request(base + "/docs")
    res = urllib.request.urlopen(req)
    print(f"  Docs OK (status {res.status})")
except Exception as e:
    print(f"  Docs: {e}")

print("\n=== Test 2: Categorias ===")
try:
    data = get("/api/categorias")
    print(f"  {len(data)} categorias carregadas")
    for c in data[:3]:
        print(f"    - {c['nome']} ({c['tipo']})")
except Exception as e:
    print(f"  Error: {e}")

print("\n=== Test 3: Login ===")
try:
    result = post("/api/admin/auth/login", {"email": "admin@cavokavionics.com.br", "senha": "cavok2026"})
    token = result["token"]
    print(f"  Login OK! Token: {token[:30]}...")
    print(f"  User: {result['nome']} ({result['role']})")
except Exception as e:
    print(f"  Error: {e}")
    token = None

if token:
    print("\n=== Test 4: Dashboard ===")
    try:
        req = urllib.request.Request(base + "/api/admin/dashboard", headers={"Authorization": f"Bearer {token}"})
        res = urllib.request.urlopen(req)
        dashboard = json.loads(res.read())
        print(f"  Dashboard: {dashboard}")
    except Exception as e:
        print(f"  Error: {e}")

    print("\n=== Test 5: Produtos ===")
    try:
        data = get("/api/produtos")
        print(f"  {data['totalElements']} produtos no banco")
    except Exception as e:
        print(f"  Error: {e}")

print("\n✅ Testes concluídos!")
