from sqlalchemy.orm import Session
from sqlalchemy import text
from math import ceil
from app.jwt.auth import hash_password
from app.models.model_user import UserDB, User, UserSchema

def login(db_session: Session, email):
    return db_session.query(User).filter(User.email == email).first()

def post(db_session: Session, payload: UserSchema):
    hashed_password = hash_password(payload.senha)
    user = User(nome=payload.nome, email=payload.email, senha=hashed_password, status=payload.status, tipo=payload.tipo)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def get(db_session: Session, id: int):
    return db_session.query(User).filter(User.id == id).first()

def get_all(db_session: Session, limit: int, offset: int):
    return db_session.query(User).offset(offset).limit(limit).all()


def get_total_count(db_session: Session):
    return db_session.query(User).count()

def put(db_session: Session, user: User, nome: str, email: str, senha: str, status: str, tipo: str):
    user.nome = nome
    user.email = email
    user.senha = senha
    user.status = status
    user.tipo = tipo
    db_session.commit()
    return user

def delete(db_session: Session, id: int):
    user = db_session.query(User).filter(User.id == id).first()
    if user:
        db_session.delete(user)
        db_session.commit()
        return True
    return False

def count(db_session: Session):
    query = text("""
        SELECT tipo, status, COUNT(id) AS total_count
        FROM users
        WHERE status IN ('ativo', 'cancelado')
        GROUP BY tipo, status
    """)

    try:
        result = db_session.execute(query).fetchall()

        if result:
            print("Resultado da consulta:", result)

        # Inicializando a lista para armazenar os resultados no formato desejado
        result_list = []

        # Preenchendo a lista com os resultados
        for row in result:
            tipo = row[0]
            status = row[1]
            count = row[2]

            # Adicionando cada item no formato correto
            result_list.append({
                "tipo": tipo,
                "status": status,
                "count": count
            })

        return result_list
    
    except Exception as e:
        print(f"Erro ao executar a consulta: {e}")
        return []
