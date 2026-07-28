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


## v5.3 shared Veteran roster

Open `veterans.html` to manage the shared Veteran database. Records contain operational fields only; no photographs, primary nurse assignment, or AI integration are included.


## v5.4 Operations Calendar

`operations-calendar.html` is a read-only coordination view. It shows showers, weights, and vitals from schedules already entered during admission, along with scheduled appointments. It does not add assignments or duplicate documentation.


## v5.5 Print and Connection Cleanup
Shared print support was added across the connected operational pages. Morning Report was intentionally preserved without content changes.


## v5.6 Protected Scheduler Workflow

Appointments requiring transportation now open a Travel Request email draft before saving. Ticket to Ride and all existing transportation statuses remain intact. Appointments that do not require transportation can bypass the request without cancelling the appointment.


## v5.7 Morning Report Integration

Morning Report now reads its daily appointment and transportation information directly from Scheduler through the shared data layer. The report remains complete and printable, while duplicate appointment editing has been removed from Morning Report.


## v5.8 Connected Command Center

The Command Center now uses the same Veteran, schedule, appointment, Ticket to Ride, and Travel Request data as the rest of ChargeNurse. Duplicate Veteran editing and the extra Skin/Lab categories were removed from this operational screen.
