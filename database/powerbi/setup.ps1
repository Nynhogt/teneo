[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Password,
    [string]$Database = "teneo_development",
    [string]$User = "teneo"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker CLI nao encontrado. Abra o Docker Desktop e tente novamente."
}

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$composeFile = Join-Path $projectRoot "docker-compose.yml"
$sqlFile = Join-Path $PSScriptRoot "setup.sql"

if (-not (Test-Path -LiteralPath $composeFile)) {
    throw "docker-compose.yml nao encontrado em $projectRoot"
}

if (-not (Test-Path -LiteralPath $sqlFile)) {
    throw "setup.sql nao encontrado em $PSScriptRoot"
}

Get-Content -Raw -Encoding UTF8 -LiteralPath $sqlFile | docker compose -f $composeFile exec -T db psql `
    --set ON_ERROR_STOP=1 `
    --username $User `
    --dbname $Database `
    --set powerbi_password="$Password"

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao configurar o usuario do Power BI (codigo $LASTEXITCODE)."
}

Write-Host "Usuario 'powerbi_reader' configurado no banco '$Database'."
Write-Host "Power BI: servidor localhost:5432 | banco $Database | usuario powerbi_reader"
