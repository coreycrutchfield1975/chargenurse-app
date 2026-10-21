INTERVIEW SELECTION PROCESS — CLEAN v2 (fresh look & flow)
==========================================================

FILE: Interview-Selection-Process-PRINT-THIS-FIRST-v2.html

WHAT CHANGED (latest pass)
--------------------------
1. ONE SINGLE NAVIGATION ROW — nothing hidden, no dropdowns
   The header now holds only the app title. Everything actionable lives in
   one row under it, left to right:

     Start | Instructions | Rubric & Applicants | Introduction |
     Interview Questions  |  Prepare 3 Panelist Forms |
     Import Completed Evaluation | Panel Recommendations

   Verified: 8 buttons, one row, fits without scrolling.

2. REMOVED (old-thinking tools)
   - "Print Applicant Qs" button and its printQs() function
   - "Print Matrix" button and its printMat() function
   - "Print Guide First" header button (the guide already lives on the
     Start tab and the Instructions tab)
   - the "Tools" button and its dropdown bar entirely (toggleTools removed)
   - the two guide buttons that were inside Tools

3. BACKUP & RESTORE MOVED OUT OF THE WAY
   Export, Import and Clear All Data now sit in a small, muted
   "Backup & Restore" strip at the bottom of the Start tab, instead of
   cluttering the navigation row. They are still one click away on the
   landing screen, and Clear All Data still asks for confirmation.

4. EARLIER IN THIS FILE
   - Old Recommendations tab removed completely (tab, workflow card,
     tc-rec panel, printRec, renderRecs, r-* saved fields, the old
     emailRecommendations override).
   - Duplicate navigation removed: the Start-screen numbered cards were
     replaced with a plain "Order of use" text hint, and the step-chip row
     on the Instructions tab was removed.
   - Fresh CSS shell: brand header, pill-style single-row tabs, refreshed
     panels/hero, amber accent.

WHAT WAS PRESERVED (untouched, fully working)
---------------------------------------------
- Prepare 3 Panelist Forms and Import Completed Evaluation
- Panel Recommendations summary + Print / Save PDF Summary
- The embedded 4-page Step-by-Step Guide PDF (also embedded in every
  panelist form)
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
- No dangling references to removed functions/buttons.
- Browser test: all 5 tabs switch; nav row is a single row that fits without
  scrolling; header has no stray buttons; Backup & Restore strip shows
  Export / Import / Clear All Data.
- End-to-end panelist form generation still works (182 KB self-contained HTML
  with the embedded guide PDF and correct packet JSON).
- Guide reachable from the Start tab and the Instructions tab.
- Zero console errors on a clean first run.

CAUTION (unchanged)
-------------------
Prototype for fictional/test data until approved by VA IT / HR / Privacy /
Records Management. A typed acknowledgement is not a verified electronic
signature. Official signatures must use the agency-approved process.
