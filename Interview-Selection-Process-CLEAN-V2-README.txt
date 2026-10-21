INTERVIEW SELECTION PROCESS — CLEAN v2 (fresh look & flow)
==========================================================

FILE: Interview-Selection-Process-PRINT-THIS-FIRST-v2.html
Original kept intact: Interview-Selection-Process-PRINT-THIS-FIRST.html

WHAT CHANGED
------------
1. OLD RECOMMENDATIONS TAB — REMOVED COMPLETELY
   The separate "Recommendations" tab is gone, along with all of its dead
   code: the tab button, the workflow card, the tc-rec panel, the printRec()
   function, the renderRecs() function, the r-* form-field save/load state,
   the "Print Recs" header button, and the old emailRecommendations override.
   Panel recommendations now live only under Tools > Panel Recommendations,
   which has its own Print / Save PDF Summary button.

2. NAVIGATION CLEANED UP — 3 AREAS, ONE CONSISTENT ORDER OF USE
   - Tab bar: Start | Instructions | Rubric & Applicants | Introduction |
     Interview Questions   (5 tabs, one clean row, no wrapping or scrolling)
   - Workflow cards (Start screen): 1 Review Instructions -> 2 Build Rubric &
     Add Applicants -> 3 Read Introduction -> 4 Conduct Interviews
   - Step indicator: same 4 steps
   All three areas now match, in the order you actually use them.

3. FRESH LOOK (CSS only — behaviour unchanged)
   - New header with brand mark and subtitle
   - Tools bar restyled as clean grouped buttons with separators
   - Tabs restyled as a single-row pill/segmented control
   - Workflow cards restyled (amber accent, 4 across, lift on hover)
   - Panels, hero, status cards and step chips refreshed
   - Amber accent throughout to match the "Print This First" emphasis

4. TABS IN ONE ROW
   Confirmed: 5 tabs render on a single row and fit without horizontal scroll.

WHAT WAS PRESERVED (untouched, fully working)
---------------------------------------------
- Prepare 3 Panelist Forms  (was "Export Panel Packet")
- Import Completed Evaluation (was "Import Panelist Scores")
- Panel Recommendations summary + Print / Save PDF Summary
- The embedded 4-page Step-by-Step Guide PDF (travels inside every panelist
  form too — verified present, ~160K of embedded PDF data)
- The Outlook email flow (Prepare Outlook Email / Prepare Outlook Return Email)
- The Print / Save as PDF flow
- PBI question bank (276 questions, 8 categories) + library sync
- Rubric builder, position profiles, applicant scoring, matrix, print outputs
- Auto-save to this computer (localStorage)
- First-use "Print Your Instructions First" dialog

VERIFICATION DONE
-----------------
- All 5 inline JavaScript blocks pass a syntax check.
- No dangling references remain to the removed Recommendations code.
- Browser test: all 5 tabs switch, Tools bar toggles, step indicator renders,
  tc-rec confirmed gone.
- End-to-end panelist form test: generated a 182 KB self-contained HTML form
  with the embedded guide PDF, correct packet JSON (2 applicants, 3 questions,
  panelist identity), the completion/save controls and the Outlook return
  button. All template placeholders correctly replaced.
- Guide PDF opens correctly; Panel Recommendations summary opens correctly.
- Clean first-run with empty storage produces zero console errors.

HOW TO USE
----------
- Test this copy first; do not overwrite your working version until you have
  clicked through the panelist email -> sign -> import loop once.
- To publish: upload this file to GitHub (Add file > Upload files).
- The file works offline; the guide PDF is embedded, so nothing else needs
  hosting.

CAUTION (unchanged from before)
-------------------------------
Prototype for fictional/test data until approved by VA IT / HR / Privacy /
Records Management. A typed acknowledgement is not a verified electronic
signature. Official signatures must use the agency-approved process.
