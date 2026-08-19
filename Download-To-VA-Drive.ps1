<# 
Download-To-VA-Drive.ps1
PowerShell script to download the latest chargenurse-app to VA S: drive
Run this on your VA computer to update the app on the shared drive
#>

$ErrorActionPreference = "Stop"

# GitHub repository info
$repoOwner = "coreycrutchfield1975"
$repoName = "chargenurse-app"
$branch = "main"

# Base URLs
$rawBase = "https://raw.githubusercontent.com/$repoOwner/$repoName/$branch"
$githubBase = "https://github.com/$repoOwner/$repoName"

# Target folder on S: drive (adjust as needed)
$targetFolder = "S:\Shared\chargenurse-app"

# Create target folder if it doesn't exist
if (-not (Test-Path $targetFolder)) {
    Write-Host "Creating folder: $targetFolder" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
}

# List of essential files to download
$files = @(
    "index.html",
    "morning-report.html",
    "legacy/bravoshift-v1.8-final.html",
    "favicon.svg"
)

Write-Host "Downloading chargenurse-app files from GitHub..." -ForegroundColor Cyan
Write-Host "Repository: $githubBase" -ForegroundColor Gray
Write-Host "Target: $targetFolder" -ForegroundColor Gray
Write-Host ""

foreach ($file in $files) {
    $url = "$rawBase/$file"
    $localPath = Join-Path $targetFolder $file
    
    # Create subdirectory if needed
    $dir = Split-Path $localPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    try {
        Write-Host "Downloading: $file" -ForegroundColor Gray
        Invoke-WebRequest -Uri $url -OutFile $localPath -UseBasicParsing
        Write-Host "  ✓ Saved to: $localPath" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Download complete!" -ForegroundColor Cyan
Write-Host "App is now available at: $targetFolder\index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "To update in the future, simply run this script again." -ForegroundColor Gray
Write-Host "The app will automatically use the latest version from GitHub." -ForegroundColor Gray