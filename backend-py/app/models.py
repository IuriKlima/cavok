from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Numeric, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum

# ====== Enums ======
class TipoCategoria(str, enum.Enum):
    PRODUTO = "PRODUTO"
    AERONAVE = "AERONAVE"

class StatusProduto(str, enum.Enum):
    ATIVO = "ATIVO"
    INATIVO = "INATIVO"
    RASCUNHO = "RASCUNHO"

class StatusAeronave(str, enum.Enum):
    DISPONIVEL = "DISPONIVEL"
    VENDIDA = "VENDIDA"
    RESERVADA = "RESERVADA"
    INATIVA = "INATIVA"

class TipoContato(str, enum.Enum):
    CONTATO = "CONTATO"
    COTACAO = "COTACAO"

class Role(str, enum.Enum):
    ADMIN = "ADMIN"
    AERONAVES = "AERONAVES"
    EDITOR = "EDITOR"

# ====== Models ======
class Categoria(Base):
    __tablename__ = "categorias"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    descricao = Column(String(1000))
    imagem_url = Column(String(500))
    tipo = Column(String(20), nullable=False, default=TipoCategoria.PRODUTO)
    ordem = Column(Integer, default=0)
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Marca(Base):
    __tablename__ = "marcas"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    logo_url = Column(String(500))
    criado_em = Column(DateTime, default=datetime.utcnow)

class Produto(Base):
    __tablename__ = "produtos"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, nullable=False)
    descricao = Column(Text)
    descricao_curta = Column(Text)
    preco = Column(Numeric(12, 2))
    sku = Column(String(100))
    imagem_principal = Column(String(500))
    imagens = Column(Text, default="[]")  # JSON array
    homologado = Column(Boolean, default=False)
    condicao = Column(String(50))
    status = Column(String(20), default=StatusProduto.ATIVO)
    destaque = Column(Boolean, default=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    marca_id = Column(Integer, ForeignKey("marcas.id"))
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    categoria = relationship("Categoria", lazy="joined")
    marca = relationship("Marca", lazy="joined")

class Aeronave(Base):
    __tablename__ = "aeronaves"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, nullable=False)
    descricao = Column(Text)
    assentos = Column(String(50))
    horas_celula = Column(String(100))
    ano_fabricacao = Column(String(20))
    especificacoes = Column(Text)
    preco = Column(Numeric(12, 2))
    imagem_principal = Column(String(500))
    imagens = Column(Text, default="[]")
    status = Column(String(20), default=StatusAeronave.DISPONIVEL)
    destaque = Column(Boolean, default=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    categoria = relationship("Categoria", lazy="joined")

class Pagina(Base):
    __tablename__ = "paginas"
    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, nullable=False)
    conteudo = Column(Text)
    meta_title = Column(String(500))
    meta_description = Column(String(500))
    imagem_destaque = Column(String(500))
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Contato(Base):
    __tablename__ = "contatos"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    telefone = Column(String(50))
    mensagem = Column(Text, nullable=False)
    produto_id = Column(Integer)
    aeronave_id = Column(Integer)
    tipo = Column(String(20), default=TipoContato.CONTATO)
    lido = Column(Boolean, default=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

class Configuracao(Base):
    __tablename__ = "configuracoes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    chave = Column(String(100), unique=True, nullable=False)
    valor = Column(Text)
    tipo = Column(String(50))

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    senha = Column(String(200), nullable=False)
    role = Column(String(20), default=Role.ADMIN)
    criado_em = Column(DateTime, default=datetime.utcnow)
