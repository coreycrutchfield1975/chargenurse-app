INTERVIEW SELECTION PROCESS — CLEAN v2 (fresh look & flow)
==========================================================

FILE: Interview-Selection-Process-PRINT-THIS-FIRST-v2.html

LATEST PASS — THE "PRINT THIS FIRST" GUIDE PDF WAS UPDATED
----------------------------------------------------------
The embedded 4-page Step-by-Step Guide is the app's user manual, so it was
brought in line with the revised app:

- Step 07 (supervisor) now reads "Select Prepare 3 Panelist Forms in the top
  navigation row." It previously said "Navigate Tools -> Prepare 3 Panelist
  Forms", but the Tools menu no longer exists.
- Step 10 (supervisor close-out) now reads "select Import Completed Evaluation
  in the top navigation row" for the same reason.
- Added a "Save a backup as you go" note describing Backup & Restore -> Export
  on the Start tab (the only backup, since there is no shared drive/server).

Because the panelist forms get the guide injected from the same source, this
one update flows into every generated panelist form automatically.
Guide source + rebuild instructions: see Interview-Selection-Process-GUIDE-README.txt

ONE SINGLE NAVIGATION ROW — nothing hidden, no dropdowns
--------------------------------------------------------
The header holds only the app title. Everything actionable is in one row:

  Start | Instructions | Rubric & Applicants | Introduction |
  Interview Questions  |  Prepare 3 Panelist Forms |
  Import Completed Evaluation | Panel Recommendations

Verified: 8 buttons, one row, fits without scrolling.

REMOVED (old-thinking tools)
----------------------------
- "Print Applicant Qs" button and its printQs() function
- "Print Matrix" button and its printMat() function
- "Print Guide First" header button (guide already on Start + Instructions)
- the "Tools" button and its dropdown bar entirely (toggleTools removed)
- the two guide buttons that lived inside Tools

BACKUP & RESTORE — moved out of the way
---------------------------------------
Export, Import and Clear All Data sit in a small muted "Backup & Restore"
strip at the bottom of the Start tab. Clear All Data still asks for
confirmation.

EARLIER IN THIS FILE
--------------------
- Old Recommendations tab removed completely (tab, workflow card, tc-rec
  panel, printRec, renderRecs, r-* saved fields, the old emailRecommendations
  override).
- Duplicate navigation removed: the Start-screen numbered cards became a plain
  "Order of use" text hint, and the step-chip row on the Instructions tab was
  removed. Exactly one navigation row per screen.
- Fresh CSS shell: brand header, pill-style single-row tabs, refreshed
  panels/hero, amber accent.

WHAT WAS PRESERVED (untouched, fully working)
---------------------------------------------
- Prepare 3 Panelist Forms and Import Completed Evaluation
- Panel Recommendations summary + Print / Save PDF Summary
- The embedded 4-page Step-by-Step Guide PDF (also embedded in each form)
- The Outlook email flow (Prepare Outlook Email / Prepare Outlook Return Email)
- The Print / Save as PDF flow
- PBI question bank (276 questions, 8 categories) + library sync
- Rubric builder, position profiles, applicant scoring, matrix
- Auto-save to this computer (localStorage)
- First-use "Print Your Instructions First" dialog
- Export / Import / Clear All Data (now on the Start tab)

VERIFICATION DONE
-----------------
- All 5 inline JavaScript blocks pass a syntax check.
- No dangling references to any removed function or button.
- Browser test: all 5 tabs switch; nav row is a single row that fits without
  scrolling; header has no stray buttons; Backup & Restore strip present.
- Guide PDF: 4 pages, Letter, correct footers, no clipping; opens from Start
  and from Instructions.
- End-to-end panelist form generation: 248 KB self-contained HTML carrying the
  updated guide and correct packet JSON; no template placeholders left over.
- Zero console errors on a clean first run.

CAUTION (unchanged)
-------------------
Prototype for fictional/test data until approved by VA IT / HR / Privacy /
Records Management. A typed acknowledgement is not a verified electronic
signature. Official signatures must use the agency-approved process.
