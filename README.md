# CLC Command Center v4.1

A local-browser nursing operations application for the VA Community Living Center workflow.

## Start here
Open `index.html`, enter the site passcode once, and continue to the Command Center.

## Core modules
- Due Today nursing work
- Shift Briefing
- Shift Handoff
- Resident Manager and admission setup
- Transportation workflow and alerts
- Room View
- Shift Assignment Board
- Morning Report sync
- RN Workstation
- Treatment Sheets
- Print Center
- Local backup and restore

## Data handling
Operational data remains in the approved workstation browser storage. Use the Command Center backup function to transfer data through approved processes.


## Version 4.1 additions
Calendar Center and local workflow automation are included. See `RELEASE-NOTES-v4.1.md`.


## Custom Backgrounds
Use **Command Center → Appearance**. Users may select a built-in image, upload a personal image that stays in browser local storage, or reference an image placed in `backgrounds/custom/`. Do not use images containing PHI.


## ChargeNurse v5 Phase 2
- Added internal `scheduler.html`
- Added shared `clc-data.js`
- Scheduler and Command Center use the same local Veteran/appointment storage
- Removed external clcscheduler.vercel.app references
