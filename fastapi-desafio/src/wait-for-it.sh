#!/usr/bin/env bash
# wait-for-it.sh

# Fonte: https://github.com/vishnubob/wait-for-it

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

# Espera até que o serviço esteja pronto
until nc -z "$host" "$port"; do
  echo "Aguardando $host:$port..."
  sleep 1
done

echo "$host:$port está pronto! Executando o comando..."
exec $cmd
