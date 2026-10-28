# BravoShift and the Interview Selection Process — setting up at the VA

Two tools, each a single HTML file that runs in Microsoft Edge on a VA computer:

| File | What it is |
|------|------------|
| `index.html` | **BravoShift**, the charge-nurse command center |
| `Interview-Selection-Process.html` | The panel interview and scoring tool, with all 276 PBI questions built in |

Older versions of the interview tool are in `archive/` for reference only. Do not use them.

## Where the files go

**Keep the working copies on the S: drive**, for example `S:\Shared\chargenurse-app\`.
Open them from there in Edge (double-click, or drag into an Edge window).

**SharePoint is for handing out copies, not running them.** SharePoint Online does
not open HTML files in the browser; clicking one downloads it. Put the current
files in a document library so people can find the latest version, but run them
from the S: drive. Do not put BravoShift's shared data file in a OneDrive-synced
SharePoint folder: several computers write it every few seconds, and OneDrive sync
creates conflicting copies.

## BravoShift: the shared file

BravoShift keeps the unit's information in `bravoshift-data.json` in one folder on the
S: drive (for example `S:\Shared\chargenurse-app\data\`). Everyone must connect to
the **same** folder.

1. Open BravoShift. A **Connect to the unit's shared file** screen appears.
2. Select **Connect to S: drive** and choose the shared data folder.
3. When Edge asks, select **Edit files** / **Allow**.
4. The header shows **Saved to S: drive · time**. Green means your changes are reaching everyone.

If the header turns red (**Not saving to S: drive**), select it and reconnect. Edge
sometimes asks again after it restarts; that is one click, and the folder is remembered.

Changes from every computer are combined: the newest edit of each item wins, deletions
stay deleted, and a computer that was offline adds its work when it reconnects.

The screen locks after 10 minutes without use to hide Veteran information.

## Interview Selection Process: auto-save

The supervisor's rubric, applicants and scores save on the computer automatically.
To keep them safe if the computer or browser is reset, and to continue on another
computer:

1. On the **Start** tab, under Backup & Restore, select **Auto-save to a folder…**
2. Choose a folder only the hiring supervisor (and HR) can open.
3. From then on every change is also saved there as `interview-data.json`. On another
   computer, choose the same folder to pick up where you left off.

The tool does not connect to the internet; the full question bank is inside the file.

## Updating

Run `Download-To-VA-Drive.ps1` (or `Download-chargenurse.bat`) to fetch the latest
`index.html` and `Interview-Selection-Process.html` from GitHub into the S: drive folder.
Everyone gets the update the next time they open or refresh the page.
