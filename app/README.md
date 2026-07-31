# BravoShift 2.10 — Administration & Reporting

A static React + TypeScript module that preserves BravoShift's browser-only architecture. It uses `localStorage` for operational data and JSON files for portable backup and restore.

## Included

- Data integrity checker
- Required-field and orphaned-reference detection
- Duplicate detection across Veterans, appointments, travel, staffing, and notifications
- Archived Veteran record manager
- Full JSON backup download
- JSON restore with replace or merge mode
- Automatic pre-restore snapshots
- Local version history (latest 20 snapshots)
- Downloadable administrative report
- Browser storage-size monitoring
- No backend, API, Supabase, .NET, or database dependencies

## Important limitation

Browser storage is device- and browser-specific. Clearing site data, changing browsers, using private browsing, or device failure can remove local records. Download regular JSON backups and store them only in an approved secure location.

## Run

```bash
npm install
npm run build
npm run dev
```
