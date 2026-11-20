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
$tempEnv = Join-Path ([IO.Path]::GetTempPath()) ('catalogo-newman-' + [guid]::NewGuid().ToString() + '.json')
$puertoPersistencia = 3100
$proc = $null
$codigo = 0

function Esperar-Api {
  param([string]$Puerto)
  $url = "http://localhost:$Puerto/api/productos"
  for ($i = 0; $i -lt 30; $i++) {
    try {
      $respuesta = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
      if ($respuesta.StatusCode -eq 200) { return }
    } catch {
    }
    Start-Sleep -Milliseconds 300
  }
  throw "No respondio $url"
}

try {
  Esperar-Api -Puerto $env:PORT

  $argsComunes = @(
    '--env-var', "adminEmail=$env:ADMIN_EMAIL",
    '--env-var', "adminPassword=$env:ADMIN_PASSWORD",
    '--env-var', "jwtSecret=$env:JWT_SECRET"
  )

  $fasesAntes = @(
    '--folder', '01 - Autenticacion',
    '--folder', '02 - Catalogo publico',
    '--folder', '03 - Administrador',
    '--folder', '04 - Favoritos y aislamiento',
    '--folder', '05 - Persistencia antes del reinicio'
  )

  & npx newman run $coleccion -e $entorno @fasesAntes @argsComunes --env-var "baseUrl=http://localhost:$env:PORT/api" --export-environment $tempEnv
  if ($LASTEXITCODE -ne 0) { throw 'Fallo la fase anterior al reinicio.' }

  $puertoOriginal = $env:PORT
  $env:PORT = "$puertoPersistencia"
  $proc = Start-Process -FilePath node -ArgumentList 'src/server.js' -WorkingDirectory $raiz -PassThru -WindowStyle Hidden
  $env:PORT = $puertoOriginal
  Esperar-Api -Puerto $puertoPersistencia

  & npx newman run $coleccion -e $tempEnv --folder '06 - Persistencia despues del reinicio' @argsComunes --env-var "baseUrl=http://localhost:$puertoPersistencia/api"
  if ($LASTEXITCODE -ne 0) { throw 'Fallo la fase posterior al reinicio.' }

  'Persistencia verificada: el favorito sigue despues de reiniciar Node.'
} catch {
  Write-Error $_.Exception.Message
  $codigo = 1
} finally {
  if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force }
  if (Test-Path -LiteralPath $tempEnv) { Remove-Item -LiteralPath $tempEnv -Force }
}

exit $codigo
