from sqlalchemy import select
from .database import async_session
from .models import Usuario, Categoria, Configuracao
from .auth import hash_password

async def seed_data():
    async with async_session() as db:
        # Admin user
        result = await db.execute(select(Usuario).where(Usuario.email == "admin@cavokavionics.com.br"))
        if not result.scalar_one_or_none():
            db.add(Usuario(nome="Administrador", email="admin@cavokavionics.com.br", senha=hash_password("cavok2026"), role="ADMIN"))

        # Admin aeronaves
        result = await db.execute(select(Usuario).where(Usuario.email == "aeronaves@cavokavionics.com.br"))
        if not result.scalar_one_or_none():
            db.add(Usuario(nome="Admin Aeronaves", email="aeronaves@cavokavionics.com.br", senha=hash_password("cavok2026"), role="AERONAVES"))

        # Configurações
        configs = [
            ("telefone", "(19) 98329-6170", "text"),
            ("email", "orcamento@cavokavionics.com.br", "text"),
            ("whatsapp", "5519983296170", "text"),
            ("site_nome", "Cavok Avionics", "text"),
            ("site_descricao", "Venda de Aviônicos e Aeronaves", "text"),
            ("endereco", "", "text"),
            ("instagram", "", "text"),
            ("facebook", "", "text"),
            ("hero_titulo", "Aviônicos e Aeronaves com Qualidade e Procedência", "text"),
            ("hero_subtitulo", "Venda de aviônicos novos e usados, aeronaves selecionadas. Atendimento personalizado para pilotos e oficinas.", "text"),
            ("sobre_titulo", "Sobre a Cavok Avionics", "text"),
            ("sobre_texto", "Atuamos com venda de aviônicos e aeronaves, oferecendo produtos de qualidade com procedência garantida.", "textarea"),
            ("contato_titulo", "Entre em Contato", "text"),
            ("contato_texto", "Estamos prontos para atender você", "text"),
            ("logo_avionicos", "", "image"),
            ("logo_aeronaves", "", "image"),
            ("aeronaves_hero_titulo", "Encontre sua próxima aeronave", "text"),
            ("aeronaves_hero_subtitulo", "Aeronaves selecionadas com procedência garantida", "text"),
            ("aeronaves_hero_imagem", "", "image"),
        ]
        for chave, valor, tipo in configs:
            r = await db.execute(select(Configuracao).where(Configuracao.chave == chave))
            if not r.scalar_one_or_none():
                db.add(Configuracao(chave=chave, valor=valor, tipo=tipo))

        # Categorias de Produtos
        cat_produtos = [
            ("PFD", "pfd", 1), ("Piloto Automático", "piloto-automatico", 2),
            ("Monitoramento de Motor", "monitoramento-de-motor", 3), ("GPS/Nav/Com", "gps-nav-com", 4),
            ("Transponder/ADS-B", "transponder-ads-b", 5), ("EFIS", "efis", 6),
            ("GPS", "gps", 7), ("Ângulo de Ataque/Pitot", "angulo-de-ataque-pitot", 8),
            ("Antenas", "antenas", 9), ("Bateria de Backup", "bateria-de-backup", 10),
            ("Carregador USB", "carregador-usb", 11), ("Nav/Com", "nav-com", 12),
            ("Painel de Áudio", "painel-de-audio", 13), ("Unidades de Interface", "unidades-de-interface", 14),
            ("Kits de Instalação", "kits-de-instalacao", 15),
        ]
        for nome, slug, ordem in cat_produtos:
            r = await db.execute(select(Categoria).where(Categoria.slug == slug))
            if not r.scalar_one_or_none():
                db.add(Categoria(nome=nome, slug=slug, ordem=ordem, tipo="PRODUTO"))

        # Categorias de Aeronaves
        cat_aeronaves = [
            ("Monomotor Pistão", "monomotor-pistao", 1), ("Monomotor Turboélice", "monomotor-turboelice", 2),
            ("Bimotor Pistão", "bimotor-pistao", 3), ("Bimotor Turboélice", "bimotor-turboelice", 4),
            ("Jato", "jato", 5), ("Helicópteros", "helicopteros", 6),
        ]
        for nome, slug, ordem in cat_aeronaves:
            r = await db.execute(select(Categoria).where(Categoria.slug == slug))
            if not r.scalar_one_or_none():
                db.add(Categoria(nome=nome, slug=slug, ordem=ordem, tipo="AERONAVE"))

        await db.commit()
