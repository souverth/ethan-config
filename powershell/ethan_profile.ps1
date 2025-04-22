# set PowerShell to UTF-8
[console]::InputEncoding = [console]::OutputEncoding = New-Object System.Text.UTF8Encoding

# Alias
Set-Alias ll ls
Set-Alias vim nvim
Set-Alias g git
Set-Alias grep rg
Set-Alias tig 'C:\Program Files\Gỉt\usr\bin\tig.exe'
Set-Alias less 'C:\Program Files\Gỉt\usr\bin\less.exe'
set-Alias get tldr

# Custom key binding
Set-PSReadLineKeyHandler -Key Ctrl+L -Function ClearScreen
Set-PSReadLineKeyHandler -Key Ctrl+R -Function HistorySearchBackward


# Icon-File
# Tải module Terminal-Icons nếu chưa cài đặt
if (-not (Get-Module -ListAvailable -Name 'Terminal-Icons')) {
    Install-Module -Name Terminal-Icons -Force -Scope CurrentUser
}
Import-Module -Name Terminal-Icons

# Theme
if (-not (Get-Module -Name posh-git)) {
    Import-Module posh-git
    $omp_config = Join-Path $PSScriptRoot ".\ethan.omp.json"
    oh-my-posh --init --shell pwsh --config $omp_config | Invoke-Expression
}

# PSReadLine
if (-not (Get-Module -Name PSReadLine)) {
    Import-Module PSReadLine
    Set-PSReadLineOption -EditMode Emacs
    Set-PSReadLineOption -EditMode Vi
    Set-PSReadLineOption -PredictionSource History
    Set-PSReadLineOption -PredictionViewStyle ListView
    Set-PSReadLineOption -SyntaxColors @{
        Command      = "Cyan"
        Parameter    = "Yellow"
        String       = "Green"
        Operator     = "Magenta"
   }
   Set-PSReadLineOption -HistorySaveStyle SaveAtExit
   Set-PSReadLineOption -HistoryNoDuplicates $true
   Set-PSReadLineOption -MaximumHistoryCount 1000
}

if (-not (Get-Module -Name PSFzf)) {
    Import-Module PSFzf
    Set-PsFzfOption -PSReadlineChordProvider 'Ctrl+f' -PSReadlineChordReverseHistory 'Ctrl+r'
}

# Utilities
function which ($command) {
    Get-Command -Name $command -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty Path -ErrorAction SilentlyContinue
}

# Fuck
function fuck {
    $history = Get-History
    if ($history.Count -gt 1) {
      $lastCommand = $history[-1].CommandLine
      $correctedCommand = thefuck $lastCommand

      if ($correctedCommand -is [string] -and $correctedCommand.Trim()) {
        Add-History -InputObject $correctedCommand
      }
      else {
         Write-Host "No suggestion from thefuck."
      }
    } else {
        Write-Host "No previous command found."
    }
}

# Function Custom

function mkcd { param ($dir) mkdir $dir -Force; Set-Location $dir }

function countdown {
    param([int]$seconds)
    for ($i = $seconds; $i -ge 0; $i--) {
        Write-Host "$i"
        Start-Sleep -Seconds 1
    }
    Write-Host "Time's up!"
}

function ipinfo {
    Invoke-RestMethod -Uri "https://ipinfo.io/json"
}

function openurl {
    param([string]$url)
    start $url
}