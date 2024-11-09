from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database.db import Base


# SQLAlchemy Model


class User(Base):

    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    senha = Column(String)
    status = Column(String, default="ativo")  # Ex: 'ativo', 'cancelado'
    tipo = Column(String, default="cliente")  # Ex: 'Admin' ,'Comuns'
    created_date = Column(DateTime, default=func.now(), nullable=False)

    def __init__(self, nome, email, senha, status, tipo):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.status = status
        self.tipo = tipo


# Pydantic Model

class UserSchema(BaseModel):
    nome: str = Field(..., min_length=3, max_length=100)
    email: str = Field(..., min_length=3, max_length=100)
    senha: str = Field(..., min_length=3, max_length=500)
    status: str = Field(..., min_length=3, max_length=10)
    tipo: str = Field(..., min_length=3, max_length=15)

class UserSchemaLogin(BaseModel):
    email: str = Field(..., min_length=3, max_length=100)
    senha: str = Field(..., min_length=3, max_length=100)

class UserDB(UserSchema):
    id: int

    class Config:
        orm_mode = True
