import os
import sys
from sqlalchemy import create_engine, pool
from logging.config import fileConfig
from alembic import context

# Adiciona o diretório `src` ao PYTHONPATH
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Importa a base e os modelos
from app.database.db import Base
from app.models.model_user import User

# Carrega as configurações do arquivo alembic.ini
config = context.config

# Configura a URL do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL")
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Configuração do logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Define a metadata dos modelos
target_metadata = Base.metadata

def run_migrations_offline():
    """Executa as migrações no modo 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Executa as migrações no modo 'online'."""
    connectable = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
