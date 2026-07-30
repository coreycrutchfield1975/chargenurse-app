# Hermes Upload Instructions — BravoShift Veteran Master Record

Repository: `coreycrutchfield1975/chargenurse-app`

## Branch

Create or switch to:

```bash
git checkout main
git pull origin main
git checkout -b agent/bravoshift-2-veteran-master-record
```

## Placement

This ZIP contains the complete `/app` replacement for the prior BravoShift 2.0 foundation package.

1. Preserve the existing working legacy application at `/legacy/index-v1.8.html`.
2. Replace the repository `/app` directory with the contents of this package.
3. Do not replace the root legacy `index.html` yet.

Recommended extraction workflow:

```bash
rm -rf app
mkdir app
# Extract all package contents into app/
cd app
npm install
npm run build
```

## Required manual verification

1. Dashboard loads.
2. Veterans tab opens.
3. Add a fictional Veteran with a four-digit Last 4.
4. Refresh and confirm the record persists.
5. Attempt to assign the same room to a second active Veteran; save must be blocked.
6. Edit the record and confirm changes persist.
7. Archive the record and confirm it leaves the Active view.
8. Switch to Archived and restore it.
9. Confirm the dashboard Active Veterans metric updates.

## Commit

```bash
git add app
git commit -m "Add BravoShift Veteran Master Record"
git push -u origin agent/bravoshift-2-veteran-master-record
```

Open a draft PR into `main` titled:

`Add BravoShift Veteran Master Record`

PR summary:

- Implements the first complete BravoShift 2.0 workflow module.
- Adds typed Veteran records, validation, search, filtering, archive/restore, and persistence.
- Keeps the legacy v1.8 application available during migration.
