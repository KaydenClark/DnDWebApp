param(
    [switch]$NoOpen
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiPath = Join-Path $root 'dndAPI'
$clientPath = Join-Path $root 'dndclient'
$clientUrl = 'http://localhost:5173'

function Test-RequiredPath {
    param(
        [string]$Path,
        [string]$Name
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "$Name was not found at: $Path"
    }
}

function Test-TcpPort {
    param(
        [string]$HostName,
        [int]$Port
    )

    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connection = $client.BeginConnect($HostName, $Port, $null, $null)
        if (-not $connection.AsyncWaitHandle.WaitOne(250)) {
            return $false
        }

        $client.EndConnect($connection)
        return $true
    }
    catch {
        return $false
    }
    finally {
        $client.Close()
    }
}

function Start-DevWindow {
    param(
        [string]$Title,
        [string]$WorkingDirectory,
        [string]$Command
    )

    $escapedPath = $WorkingDirectory.Replace("'", "''")
    $escapedTitle = $Title.Replace("'", "''")
    $windowCommand = "[Console]::Title = '$escapedTitle'; Set-Location -LiteralPath '$escapedPath'; $Command"
    $encodedCommand = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($windowCommand))

    Start-Process powershell.exe -ArgumentList @(
        '-NoExit',
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-EncodedCommand',
        $encodedCommand
    )
}

function Wait-ForPort {
    param(
        [string]$Name,
        [int]$Port,
        [int]$TimeoutSeconds = 30
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-TcpPort -HostName '127.0.0.1' -Port $Port) {
            return $true
        }

        Start-Sleep -Milliseconds 500
    }

    Write-Warning "$Name did not respond on port $Port within $TimeoutSeconds seconds."
    return $false
}

Test-RequiredPath -Path $apiPath -Name 'API project'
Test-RequiredPath -Path $clientPath -Name 'Client project'
Test-RequiredPath -Path (Join-Path $apiPath 'package.json') -Name 'API package.json'
Test-RequiredPath -Path (Join-Path $clientPath 'package.json') -Name 'Client package.json'

if (Test-TcpPort -HostName '127.0.0.1' -Port 5000) {
    Write-Host 'API already appears to be running on port 5000.'
}
else {
    Write-Host 'Starting API on port 5000...'
    Start-DevWindow -Title 'DnD API' -WorkingDirectory $apiPath -Command '$env:PORT = "5000"; npm.cmd start'
}

if (Test-TcpPort -HostName '127.0.0.1' -Port 5173) {
    Write-Host 'Client already appears to be running on port 5173.'
}
else {
    Write-Host 'Starting client on port 5173...'
    Start-DevWindow -Title 'DnD Client' -WorkingDirectory $clientPath -Command 'npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort'
}

Wait-ForPort -Name 'API' -Port 5000 | Out-Null
Wait-ForPort -Name 'Client' -Port 5173 | Out-Null

if (-not $NoOpen) {
    Write-Host "Opening $clientUrl ..."
    Start-Process $clientUrl
}

Write-Host 'Done. Close the API and client terminal windows when you want to stop the app.'
