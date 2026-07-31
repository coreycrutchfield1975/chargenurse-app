# Hermes Upload Instructions — BravoShift 2.7

## Source branch
Start from the branch that contains BravoShift 2.6 Morning Report Intelligence.

## Recommended Git metadata
- Branch: `agent/bravoshift-2-shift-intelligence`
- Commit: `Add Shift Intelligence Engine`
- PR title: `BravoShift 2.7 Shift Intelligence Engine`

## Upload procedure
1. Copy this package into the repository's `app` directory, replacing the prior app contents.
2. Preserve repository-level files outside `app` unless they conflict with the existing project structure.
3. Run:

```bash
cd app
npm install
npm run build
npm run dev
```

4. Verify navigation to **Shift Intelligence**.
5. Test Day, Evening, and Night forecasts.
6. Create a staff call-off and confirm the staffing risk changes.
7. Remove charge-nurse coverage and confirm a critical warning appears.
8. Add pending/failed transport records and confirm the transport-risk metric changes.
9. Confirm the print view hides navigation and controls.

## Important
The risk model is transparent, deterministic decision support. It must not be described as a clinical AI diagnosis or as a substitute for charge-nurse judgment.
