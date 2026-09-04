@echo off
REM Download-chargenurse.bat
REM Batch script to download chargenurse-app to VA S: drive
REM Run this on your VA computer to update the app on the shared drive

set REPO_OWNER=coreycrutchfield1975
set REPO_NAME=chargenurse-app
set BRANCH=main

set TARGET_FOLDER=S:\Shared\chargenurse-app
set BASE_URL=https://raw.githubusercontent.com/%REPO_OWNER%/%REPO_NAME%/%BRANCH%

echo Downloading chargenurse-app files from GitHub...
echo.

REM Create target folder if it doesn't exist
if not exist "%TARGET_FOLDER%" mkdir "%TARGET_FOLDER%"

REM List of files to download
set FILES[0]=index.html
set FILES[2]=favicon.svg

set i=0
:download_loop
if not defined FILES[%i%] goto :done

for /f "tokens=1* delims==" %%a in ('set FILES[%i%]') do set "CURRENT_FILE=%%b"
set "URL=%BASE_URL%/%CURRENT_FILE%"
set "LOCAL_PATH=%TARGET_FOLDER%\%CURRENT_FILE%"

echo Downloading: %CURRENT_FILE%
powershell -Command "Invoke-WebRequest -Uri '%URL%' -OutFile '%LOCAL_PATH%' -UseBasicParsing" >nul 2>&1

if %ERRORLEVEL% equ 0 (
    echo   Saved to: %LOCAL_PATH%
) else (
    echo   Failed to download: %CURRENT_FILE%
)

set /a i+=1
goto :download_loop

:done
echo.
echo Download complete!
echo App is now available at: %TARGET_FOLDER%\index.html
echo.
echo To update in the future, simply run this script again.
echo The app will automatically use the latest version from GitHub.
pause