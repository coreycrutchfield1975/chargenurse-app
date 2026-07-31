# Hermes Upload Instructions — BravoShift 2.10

## Branch

`agent/bravoshift-2-administration-reporting`

## Commit

`Add client-side Administration and Reporting module`

## PR title

`BravoShift 2.10 Administration & Reporting`

## Base

Start from the branch containing BravoShift 2.9 Communication Hub. Replace the current application files with this package or copy the changed files.

## Architecture constraint

Do not add Supabase, .NET, Node APIs, server routes, cloud databases, or other backend dependencies. This module must remain a static client-side application using browser `localStorage` and user-initiated JSON import/export only.

## Validation

```bash
cd app
npm install
npm run build
npm run dev
```

Verify:

1. Administration appears in navigation.
2. Integrity checker loads and reports findings.
3. JSON backup downloads successfully.
4. Replace and merge restore modes accept a BravoShift backup.
5. A local snapshot is created before restore.
6. Archived Veterans can be restored.
7. Permanent deletion is blocked while linked records exist.
8. Refreshing the browser preserves application data and version history.
