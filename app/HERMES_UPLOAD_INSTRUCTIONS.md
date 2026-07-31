# Hermes Upload Instructions — BravoShift 2.11 Treatments

Start from the branch containing BravoShift 2.10 Administration & Reporting. Replace the application files with this package or copy the treatment feature changes into the current branch.

## Git

- Branch: `agent/bravoshift-2-treatments`
- Commit: `Add React Treatments module`
- PR title: `BravoShift 2.11 Treatments`

## Validate

```bash
cd app
npm install
npm run build
npm run dev
```

Confirm:
1. Treatments appears in navigation.
2. Create licensed and non-licensed treatments.
3. Daily, Weekly, As Scheduled, and PRN schedules persist after reload.
4. Day/Night/Both completions can be marked and undone.
5. Overdue status appears based on selected work date and shift cutoff.
6. Treatments archive and restore.
7. Administration JSON export/restore includes `treatments` and `treatmentCompletions`.
8. No network, backend, API, database, Supabase, or .NET dependency is introduced.
