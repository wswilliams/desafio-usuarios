from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import user
from app.models.model_user import Base
from app.database.db import engine

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API com JWT",
    description="API protegida com JWT",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "Authentication",
            "description": "Autenticação com token JWT"
        }
    ])

# Configurações de CORS
origins = [
    "http://localhost:4200",  # URL do frontend Angular durante desenvolvimento
    "http://0.0.0.0:3001"
]

# Adiciona o middleware para permitir CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite apenas essas origens
    allow_credentials=True,  # Permite envio de credenciais (como cookies)
    allow_methods=["*"],  # Permite todos os métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# Inclui as rotas da API
app.include_router(user.router, prefix="/users", tags=["users"])

