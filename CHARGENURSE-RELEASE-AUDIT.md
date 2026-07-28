# ChargeNurse Release Audit Ledger

Audit baseline: Phase 18 and earlier snapshots compared with the Phase 20 visual build.

## Confirmed findings

| ID | Module | Priority | Finding | Action | Status |
|---|---|---:|---|---|---|
| SCH-001 | Scheduler | Critical | Facility address and phone information was not available in the current appointment workflow. | Restore structured facility details and reusable facility profiles. | Implemented in v6.9; browser verification pending |
| BG-001 | Appearance | Critical | Only recently saved backgrounds are reported to work reliably; several legacy selections do not behave as expected. | Inventory image sources, reproduce in browser, and correct persistence/path handling. | Open |
| AUD-001 | All modules | High | Content must be compared across historical phases to identify regressions, duplicates, and obsolete items. | Complete module-by-module old/new review. | In progress |

## Scheduler restoration delivered in v6.9

- Facility address
- Facility phone
- Facility fax
- Facility contact or department
- Directions and special instructions
- Reusable facility profiles in Settings
- Automatic prefill for configured facilities
- Ticket to Ride inclusion
- Travel Request inclusion

## Next audit targets

1. Scheduler field-by-field comparison across all available phases.
2. Morning Report content and workflow comparison.
3. Veteran Records content and historical field comparison.
4. Background manager runtime investigation.
5. Treatment Sheets and Operations Calendar comparison.

## Audit labels

- **Keep:** valuable and working as intended.
- **Improve:** useful but requires refinement.
- **Restore:** valuable historical function that disappeared or became inaccessible.
- **Retire:** duplicated, obsolete, or not useful enough to maintain.
