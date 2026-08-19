# Chargenurse App - VA Drive Sharing Instructions

## Quick Start (Easiest Methods)

### Option 1: Download ZIP from GitHub
1. Go to: https://github.com/coreycrutchfield1975/chargenurse-app
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your S: drive
5. Open `index.html` in any web browser

### Option 2: Use Raw GitHub URL (Single File)
1. Open browser to: https://raw.githubusercontent.com/coreycrutchfield1975/chargenurse-app/main/index.html
2. Right-click → "Save Page As"
3. Save as `index.html` to S: drive
4. Repeat for `morning-report.html` if needed

### Option 3: Use Download Scripts (Automatic)
Run one of these scripts on your VA Windows computer:

#### PowerShell Script (Recommended)
1. Save `Download-To-VA-Drive.ps1` to your desktop
2. Right-click → "Run with PowerShell"
3. If blocked, run PowerShell as admin and type: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
4. The script downloads all files to `S:\Shared\chargenurse-app`

#### Batch File (Fallback)
1. Save `Download-chargenurse.bat` to your desktop
2. Double-click to run
3. May require admin privileges for first run

## Direct URLs for Sharing

### Main App
- **GitHub Repository**: https://github.com/coreycrutchfield1975/chargenurse-app
- **Raw index.html**: https://raw.githubusercontent.com/coreycrutchfield1975/chargenurse-app/main/index.html
- **Live Deployment**: https://chargenurse-app.vercel.app (always up-to-date)

### Morning Report
- **Raw morning-report.html**: https://raw.githubusercontent.com/coreycrutchfield1975/chargenurse-app/main/morning-report.html

## How the App Works

The chargenurse-app is a **single-page application** that:
- Runs entirely in the browser (no server needed)
- Saves data to localStorage (per computer)
- Works offline after first load
- Can be opened directly from S: drive (`file:///S:/path/index.html`)

## Updating the App

When you make changes in GitHub:
1. Push changes to `main` branch
2. Wait 1 minute for Vercel auto-deploy
3. Run the download script again on VA computers
4. Or manually download updated files

## Troubleshooting

**"Script execution is disabled"** (PowerShell):
- Run PowerShell as Administrator
- Type: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
- Answer "Y" to confirm

**Files won't open from S: drive**:
- Ensure users have read/write permissions to the folder
- Try opening with different browsers (Chrome, Edge, Firefox)
- Check if "blocked content" warnings appear (click "Allow")

**Data not saving**:
- The app uses browser localStorage
- Each computer saves its own data
- For shared data, consider setting up a simple database

## For Advanced Users

### Git Clone (if Git is installed)
```
cd S:\Shared\
git clone https://github.com/coreycrutchfield1975/chargenurse-app.git
cd chargenurse-app
git pull  # to update later
```

### Set up Auto-Update (Scheduled Task)
1. Create a scheduled task to run the download script daily
2. Or create a shortcut nurses can click to "Check for Updates"

## Support
For issues or feature requests:
- Open an Issue on GitHub
- Or contact Corey Crutchfield

---
*Last updated: $(date)*