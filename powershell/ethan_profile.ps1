# ===== UTF-8 Encoding =====
[Console]::InputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding

# ===== Aliases =====
Set-Alias ll ls
Set-Alias vim nvim
Set-Alias g git
Set-Alias grep rg
Set-Alias get tldr
Set-Alias tig 'C:\Program Files\Git\usr\bin\tig.exe'
Set-Alias less 'C:\Program Files\Git\usr\bin\less.exe'
Set-Alias ff ffconvert
Set-Alias dl download-fast
Set-Alias jq jql
Set-Alias cat Get-Content

# ===== PSReadLine Key Bindings =====
$bindings = @(
    @{ Key = 'Ctrl+L'; Function = 'ClearScreen' },
    @{ Key = 'Ctrl+R'; Function = 'HistorySearchBackward' }
)
foreach ($b in $bindings) {
    Set-PSReadLineKeyHandler -Key $b.Key -Function $b.Function
}

# ===== Terminal-Icons =====
if (-not (Get-Module Terminal-Icons -ListAvailable)) {
    Install-Module Terminal-Icons -Force -Scope CurrentUser
}
Import-Module Terminal-Icons -ErrorAction SilentlyContinue

# ===== posh-git =====
if (-not (Get-Module posh-git -ListAvailable)) {
    Install-Module posh-git -Force -Scope CurrentUser
}
Import-Module posh-git -ErrorAction SilentlyContinue

# ===== oh-my-posh =====
if (Get-Command oh-my-posh -ErrorAction SilentlyContinue) {
    oh-my-posh init pwsh --config "https://raw.githubusercontent.com/souverth/ethan-config/main/powershell/ethan.omp.json" | Invoke-Expression
} else {
    Write-Warning "oh-my-posh chua duoc cai hoac khong co trong PATH."
}

# ===== PSReadLine =====
if (-not (Get-Module PSReadLine -ListAvailable)) {
    Install-Module PSReadLine -Scope CurrentUser -Force
}
Import-Module PSReadLine -ErrorAction SilentlyContinue

Set-PSReadLineOption -EditMode Emacs
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -HistorySaveStyle SaveAtExit
Set-PSReadLineOption -MaximumHistoryCount 1000

# ===== PSFzf =====
if (Get-Command fzf -ErrorAction SilentlyContinue) {
    if (-not (Get-Module PSFzf -ListAvailable)) {
        Install-Module PSFzf -Scope CurrentUser -Force
    }
    Import-Module PSFzf -ErrorAction SilentlyContinue
    Set-PsFzfOption -PSReadlineChordProvider 'Ctrl+f' -PSReadlineChordReverseHistory 'Ctrl+r'
} else {
    Write-Warning "fzf.exe chua co trong PATH — bo qua PSFzf."
}

# ===== Utility Functions =====
function which ($command) {
    Get-Command -Name $command -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Path
}

function mkcd {
    param ($dir)
    mkdir $dir -Force | Out-Null
    Set-Location $dir
}

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
    Start-Process $url
}

function fuck {
    if (-not (Get-Command thefuck -ErrorAction SilentlyContinue)) {
        if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
            Write-Warning "Thieu scoop va thefuck. Cai scoop truoc bang: iex '& {$(irm get.scoop.sh)}'"
            return
        }

        Write-Host "Dang cai thefuck bang scoop..."
        scoop install thefuck
        return
    }

    $history = Get-History
    if ($history.Count -gt 1) {
        $lastCommand = $history[-1].CommandLine
        $correctedCommand = thefuck $lastCommand
        if ($correctedCommand -is [string] -and $correctedCommand.Trim()) {
            Add-History -InputObject $correctedCommand
        } else {
            Write-Host "Khong co goi y tu thefuck."
        }
    } else {
        Write-Host "Khong tim thay lenh truoc do."
    }
}


function ytdl {
    param (
        [Parameter(Mandatory = $true, Position = 0)]
        [string]$url,

        [ValidateSet("best", "mp3", "opus", "audio", "sub", "720p", "4k")]
        [string]$mode = "best"
    )

    if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
        Write-Host "Scoop chua co, dang tien hanh cai dat..."
        Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        irm get.scoop.sh | iex
        return
    }

    if (-not (Get-Command yt-dlp -ErrorAction SilentlyContinue)) {
        Write-Host "Dang cai yt-dlp bang scoop..."
        scoop install yt-dlp
        return
    }

    switch ($mode) {
        "best" { yt-dlp $url }
        "mp3" { yt-dlp -x --audio-format mp3 --audio-quality 0 $url }
        "opus" { yt-dlp -x --audio-format opus --audio-quality 0 $url }
        "audio" { yt-dlp -x --audio-format best --audio-quality 0 $url }
        "sub" { yt-dlp --write-subs --sub-lang vi --embed-subs $url }
        "720p" { yt-dlp -f "bestvideo[height<=720]+bestaudio" --merge-output-format mp4 $url }
        "4k" { yt-dlp -f "bestvideo[height<=2160]+bestaudio" --merge-output-format mp4 $url }
    }
}

function ffconvert {
    param (
        [Parameter(Mandatory = $true)] [string]$input,
        [Parameter(Mandatory = $true)] [string]$output
    )

    if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
        if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
            Write-Warning "Thieu scoop va ffmpeg. Cai scoop truoc: iex '& {$(irm get.scoop.sh)}'"
            return
        }
        Write-Host "Dang cai ffmpeg bang scoop..."
        scoop install ffmpeg
    }

    ffmpeg -i $input -c:v libx264 -crf 23 -preset veryfast -c:a aac -b:a 192k $output
}

function download-fast {
    param (
        [Parameter(Mandatory = $true)] [string]$url,
        [string]$output = ""
    )

    if (-not (Get-Command aria2c -ErrorAction SilentlyContinue)) {
        if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
            Write-Warning "Thieu scoop va aria2. Cai scoop truoc: iex '& {$(irm get.scoop.sh)}'"
            return
        }
        Write-Host "Dang cai aria2 bang scoop..."
        scoop install aria2
    }

    $args = @("--max-connection-per-server=16", "--split=16", "--min-split-size=1M", "--continue=true")
    if ($output -ne "") {
        aria2c @args -o $output $url
    } else {
        aria2c @args $url
    }
}

function gallery {
    param (
        [Parameter(Mandatory = $true)] [string]$url
    )

    if (-not (Get-Command gallery-dl -ErrorAction SilentlyContinue)) {
        if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
            Write-Warning "Thieu scoop va gallery-dl. Cai scoop truoc: iex '& {$(irm get.scoop.sh)}'"
            return
        }
        Write-Host "Dang cai gallery-dl bang scoop..."
        scoop install gallery-dl
    }

    gallery-dl $url
}

function json-pretty {
    param ([Parameter(ValueFromPipeline = $true)] [string]$json)
    $json | jq
}

function json-select {
    param (
        [Parameter(Mandatory = $true)][string]$filter,
        [Parameter(ValueFromPipeline = $true)][string]$json
    )
    $json | jq $filter
}

function jql {
    param (
        [Parameter(Mandatory = $true)]
        [string]$filter,

        [Parameter(ValueFromPipeline = $true)]
        [string]$json
    )

    if (-not (Get-Command jq -ErrorAction SilentlyContinue)) {
        if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
            Write-Warning "Thieu jq va scoop. Cai scoop truoc: iex '& {$(irm get.scoop.sh)}'"
            return
        }

        Write-Host "Dang cai jq bang scoop..."
        scoop install jq
    }

    if ($json) {
        $json | jq $filter
    } else {
        jq $filter
    }
}


function ytmp3 { param($url) ytdl -mode mp3 $url }
function ytopus { param($url) ytdl -mode opus $url }
function yt4k { param($url) ytdl -mode 4k $url }