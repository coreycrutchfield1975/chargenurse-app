INTERVIEW SELECTION PROCESS — STEP-BY-STEP GUIDE (source + build)
=================================================================

The 4-page guide that appears under "Print This First" is EMBEDDED inside the
app as base64 (script tag id="ip-guide-pdf"). The same guide is injected into
every generated panelist form, so updating this one file updates both places.

FILES
-----
  Interview-Selection-Process-GUIDE-source.html   editable source (HTML + CSS)
  Interview-Selection-Process-GUIDE.pdf           rendered 4-page PDF

HOW TO CHANGE THE GUIDE
-----------------------
1. Edit Interview-Selection-Process-GUIDE-source.html
2. Re-render to PDF:
     chromium --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
       --virtual-time-budget=3000 \
       --print-to-pdf=Interview-Selection-Process-GUIDE.pdf \
       file:///path/to/Interview-Selection-Process-GUIDE-source.html
3. Base64-encode the PDF (single line) and paste it as the content of:
     <script type="application/octet-stream" id="ip-guide-pdf"> ...HERE... </script>
   inside Interview-Selection-Process-PRINT-THIS-FIRST-v2.html

NOTES
-----
- Chromium is used, not WeasyPrint: Chrome's PDF output is roughly half the
  size (170 KB vs 297 KB) and the guide is embedded in every emailed panelist
  form, so size matters.
- Chrome does NOT support @page margin boxes, so the running header and the
  page-number footer are ordinary elements (.pg-head / .pg-foot) inside each
  .page container. Page numbers are literal ("Page 1".."Page 4").
- Use solid colors, not CSS gradients — gradient fills rasterize and inflate
  the PDF.
- Each .page is a fixed 8.5in x 10.96in box with overflow:hidden. If you add a
  lot of text, check the render for clipping (content is silently cut off).

CURRENT GUIDE CONTENT (4 pages)
-------------------------------
  Page 1  Process at a glance + Supervisor | Build the Position Rubric (1-4)
  Page 2  Supervisor | PBI Questions (5-6) + Prepare Outlook Packets (7-9)
          + "Save a backup as you go" note (Backup & Restore -> Export)
  Page 3  Panelist | Open, Score, and Recommend (1-7)
  Page 4  Panelist | Save, Sign, Return (8-10) + Supervisor | Close Out
          (10-11) + Final File Checklist + Important notice

REVISION HISTORY OF THE GUIDE
-----------------------------
- Step 07 now reads "Select Prepare 3 Panelist Forms in the top navigation
  row." (was: "Navigate Tools -> Prepare 3 Panelist Forms")
- Step 10 now reads "select Import Completed Evaluation in the top navigation
  row" (was: "Tools -> Import Completed Evaluation")
  Both changed because the Tools menu was removed.
- Added the "Save a backup as you go" note covering Backup & Restore -> Export.
