$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $raiz '.env'

if (-not (Test-Path -LiteralPath $envFile)) {
  throw 'Falta .env. Copia .env.example a .env y ajusta los valores locales.'
}

Get-Content -LiteralPath $envFile | ForEach-Object {
  if ($_ -match '^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$') {
    $nombre = $Matches[1]
    $valor = $Matches[2]
    if (-not (Test-Path -Path "Env:$nombre")) {
      Set-Item -Path "Env:$nombre" -Value $valor
    }
  }
}

$coleccion = Join-Path $PSScriptRoot 'Catalogo_API.postman_collection.json'
$entorno = Join-Path $PSScriptRoot 'Entorno.postman_environment.json'

& npx newman run $coleccion -e $entorno --env-var "baseUrl=http://localhost:$env:PORT/api" --env-var "adminEmail=$env:ADMIN_EMAIL" --env-var "adminPassword=$env:ADMIN_PASSWORD" --env-var "jwtSecret=$env:JWT_SECRET"

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
