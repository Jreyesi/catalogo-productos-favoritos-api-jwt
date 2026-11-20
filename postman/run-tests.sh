#!/usr/bin/env bash
set -euo pipefail

raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
env_file="$raiz/.env"

if [ ! -f "$env_file" ]; then
  echo "Falta .env. Copia .env.example a .env y ajusta los valores locales." >&2
  exit 1
fi

set -a
. "$env_file"
set +a

coleccion="$raiz/postman/Catalogo_API.postman_collection.json"
entorno="$raiz/postman/Entorno.postman_environment.json"
temp_env="$(mktemp)"
puerto_persistencia=3100
proc=""

esperar_api() {
  local puerto="$1"
  for _ in $(seq 1 30); do
    if curl -fsS "http://localhost:${puerto}/api/productos" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.3
  done
  echo "No respondio http://localhost:${puerto}/api/productos" >&2
  return 1
}

limpieza() {
  if [ -n "$proc" ] && kill -0 "$proc" 2>/dev/null; then
    kill "$proc" 2>/dev/null || true
  fi
  rm -f "$temp_env"
}
trap limpieza EXIT

esperar_api "$PORT"

args_comunes=(
  --env-var "adminEmail=$ADMIN_EMAIL"
  --env-var "adminPassword=$ADMIN_PASSWORD"
  --env-var "jwtSecret=$JWT_SECRET"
)

npx newman run "$coleccion" -e "$entorno" \
  --folder '01 - Autenticacion' \
  --folder '02 - Catalogo publico' \
  --folder '03 - Administrador' \
  --folder '04 - Favoritos y aislamiento' \
  --folder '05 - Persistencia antes del reinicio' \
  "${args_comunes[@]}" \
  --env-var "baseUrl=http://localhost:${PORT}/api" \
  --export-environment "$temp_env"

PORT="$puerto_persistencia" node "$raiz/src/server.js" &
proc=$!
esperar_api "$puerto_persistencia"

npx newman run "$coleccion" -e "$temp_env" \
  --folder '06 - Persistencia despues del reinicio' \
  "${args_comunes[@]}" \
  --env-var "baseUrl=http://localhost:${puerto_persistencia}/api"

echo "Persistencia verificada: el favorito sigue despues de reiniciar Node."
