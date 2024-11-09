# src/alembic/versions/001_create_admin_user.py

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text
from datetime import datetime
from passlib.hash import bcrypt

# ID único da revisão e informações
revision = '001_create_admin_user'
down_revision = None  # Defina como a migração inicial ou ajuste conforme necessário
branch_labels = None
depends_on = None

def upgrade():
    # Criação do usuário administrador
    conn = op.get_bind()
    hashed_password = bcrypt.hash("admin123")  # Substitua por uma senha segura

    # Insere o usuário admin no banco
    conn.execute(
        text(
            """
            INSERT INTO users (nome, email, senha, status, tipo, created_date)
            VALUES (:nome, :email, :senha,  :status, :tipo, :created_date)
            """
        ),
        {
            "nome": "admin",
            "email": "admin@example.com",
            "senha": hashed_password,
            "status": "ativo",
            "tipo": "admin",
            "created_date": datetime.utcnow(),
        }
    )

def downgrade():
    # Remove o usuário admin em caso de rollback
    conn = op.get_bind()
    conn.execute(text("DELETE FROM users WHERE nome = 'admin'"))
