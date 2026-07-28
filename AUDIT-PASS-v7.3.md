# ChargeNurse Release Audit — Pass v7.3

Date: July 28, 2026
Build: Phase 25
Scope: Regression verification against Phase 21 and historical phase folders

## Findings

### Verified code changes since Phase 21
Only two application files differ from the Phase 21 baseline:

1. `charge-rn.html`
   - Removed navigation HTML and a script tag that had been accidentally inserted inside a JavaScript print-document string.
   - This was a confirmed parse-breaking regression.
   - No data structure or clinical workflow changed.

2. `appearance.js`
   - Added normalization for legacy saved background paths and known historical filenames.
   - Existing appearance storage keys and settings remain compatible.
   - No user data is deleted or rewritten beyond correcting the stored background source path.

### Structural verification
- No duplicate HTML IDs found in core modules.
- No missing packaged script, stylesheet, image, or internal-page references found.
- All standalone JavaScript files pass `node --check`.
- All inline JavaScript blocks in core HTML pages pass `node --check`.
- Phase 24 contains no application file missing from the Phase 21 baseline.

## Regression disposition

| Area | Status | Evidence / disposition |
|---|---|---|
| RN Workstation script parsing | Fixed | Invalid injected markup removed from print builder. |
| Scheduler facility fields | Preserved | Present in current Scheduler data entry and print workflows. |
| Legacy background selection | Compatibility patch present | Stored path normalization added without changing settings schema. |
| Morning Report | No structural regression identified | Current file and storage keys preserved. Browser workflow validation remains required. |
| Veteran Records | No structural regression identified | Current file and shared data references preserved. Browser workflow validation remains required. |
| Treatment Sheets | No structural regression identified | Current file and storage workflow preserved. Browser workflow validation remains required. |
| Operations Calendar | No structural regression identified | Internal references resolve. Browser workflow validation remains required. |
| Settings | No structural regression identified | Facility, provider, and appearance controls remain packaged. |

## Items requiring browser or user validation

The automation environment blocked local browser navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore the following remain manual validation items:

- Background selection appears immediately and remains after browser restart.
- Legacy background selections migrate correctly on a workstation with existing local storage.
- Create, save, reopen, edit, print, and delete workflows in each module.
- Print preview pagination and margins on the presentation computer.
- Cross-module refresh after updating a Veteran or appointment.

## Changes in Phase 25

No application code was changed in this pass. Phase 25 adds updated audit documentation and a focused browser validation checklist only.
