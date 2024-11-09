import os
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, Request, HTTPException, Query, Path, status
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.models.model_user import UserDB, UserSchema, UserSchemaLogin
from app.services import service_user as service

from app.jwt.auth_jwt import create_access_token
from app.jwt.auth import hash_password, verify_password
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt



router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(request: Request):
    # Pega o token JWT do cabeçalho Authorization
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token não fornecido")
    
    # Remove o prefixo "Bearer " do token, se presente
    if token.startswith("Bearer "):
        token = token[7:]  # Remove o "Bearer " e fica com o token apenas
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token mal formatado")

    try:
        # Decodifica o token e valida
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")  # "sub" é o id do usuário no payload
        print(payload)
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id  # Retorna o id do usuário (ou outros dados, se necessário)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
# Rota de Login
@router.post("/login")
def login(*, db: Session = Depends(get_db), payload: UserSchemaLogin):
    user = service.login(db, payload.email)
    if not user or not verify_password(payload.senha, user.senha):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


# Exemplo de rota protegida
@router.get("/users/me", response_model=UserDB)
def read_users_me(current_user: UserDB = Depends(get_current_user)):
    return current_user

@router.post("/", response_model=UserDB, status_code=201)
def create_user(*, db: Session = Depends(get_db), payload: UserSchema, current_user: UserDB = Depends(get_current_user)):
    user = service.post(db_session=db, payload=payload)
    return user


@router.get("/{id}/", response_model=UserDB)
def read_user(
    *, db: Session = Depends(get_db), id: int = Path(..., gt=0),
    current_user: UserDB = Depends(get_current_user)
):
    user = service.get(db_session=db, id=id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    return user


# Modificado para retornar dados paginados
@router.get("/", response_model=Dict[str, Any])
def read_all_users(
    db: Session = Depends(get_db),
    limit: Optional[int] = Query(10, ge=1, le=100),  # Limite entre 1 e 100 registros por página
    offset: Optional[int] = Query(0, ge=0), 
    current_user: UserDB = Depends(get_current_user)
):
    users_paginados = service.get_all(db_session=db, limit=limit, offset=offset)
    total_items = service.get_total_count(db_session=db)

    # Calcula o número total de páginas
    total_pages = (total_items + limit - 1) // limit
    current_page = (offset // limit) + 1

    return {
        "total_items": total_items,
        "total_pages": total_pages,
        "current_page": current_page,
        "users": users_paginados
    }


@router.put("/{id}/", response_model=UserDB)
def update_user(
    *, db: Session = Depends(get_db), id: int = Path(..., gt=0), payload: UserSchema, 
    current_user: UserDB = Depends(get_current_user)
):
    user = service.get(db_session=db, id=id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    
    hashed_password = hash_password(payload.senha)
    user = service.put(
        db_session=db, user=user, nome=payload.nome, email=payload.email, senha=hashed_password, status=payload.status, tipo=payload.tipo
    )
    return user


@router.delete("/{id}/", status_code=204)
def delete_user(*, db: Session = Depends(get_db), id: int = Path(..., gt=0), current_user: UserDB = Depends(get_current_user)):
    user = service.get(db_session=db, id=id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    
    service.delete(db_session=db, id=id)
    return {"detail": "user deleted successfully"}

# Rota para visualizar estatísticas de usuários
@router.get("/user-stats")
def user_stats(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    # Chama a função de contagem
    stats = service.count(db_session=db)
    # Verifica se a consulta retornou resultados
    if stats:
        print("Resultado da consulta:", stats)
    else:
        print("Nenhum resultado encontrado!")

    # Retorna o formato correto
    return [{"tipo": s["tipo"], "status": s["status"], "count": s["count"]} for s in stats]
