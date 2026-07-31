# Hermes Upload Instructions — BravoShift 2.8

Start from the branch containing BravoShift 2.7.

## Suggested Git metadata
- Branch: `agent/bravoshift-2-clinical-analytics`
- Commit: `Add Clinical Analytics and Executive Dashboard`
- PR title: `BravoShift 2.8 Clinical Analytics & Executive Dashboard`

## Upload
Replace the current app source with this package, preserving any environment-specific files Hermes has added intentionally.

## Validate
```bash
cd app
npm install
npm run build
npm run dev
```

Verify the **Executive Analytics** navigation item opens, metrics render, and **Print Executive Brief** opens the browser print dialog.
