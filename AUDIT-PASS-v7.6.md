# ChargeNurse Audit Pass v7.6 — Mission Control Redundancy

## Finding AUD-011 — Duplicate navigation

Mission Control contained two extra navigation groups that repeated destinations already available in the permanent left sidebar:

- Hero links for Scheduler, Morning Report, and Veteran Records
- Quick Actions links for Scheduler, Morning Report, Veteran Records, Treatment Sheets, and RN Workstation

## Correction

Removed the duplicate module-launch links from Mission Control. The left sidebar remains the single primary navigation system.

Backup and Restore were preserved because they are not sidebar destinations. They now appear in a focused **Data Safety** panel.

## Why this is an audit correction

No capability was removed. The correction reduces duplicated controls, maintenance risk, and visual competition while preserving all unique functions.

## Verification

- Every removed destination remains reachable from the sidebar.
- Backup and Restore handlers remain wired.
- The hidden JSON import input remains present.
- Command Center JavaScript syntax and internal links were rechecked.
