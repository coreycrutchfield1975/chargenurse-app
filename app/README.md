# BravoShift 2.0 — Veteran Master Record

This package is the second production migration step for BravoShift. It builds on the React/TypeScript foundation and implements the first complete operational module.

## Working features

- Dashboard and Veteran Master Record navigation
- Add and edit Veteran records
- Required-field validation
- Exactly-four-digit Last 4 validation
- Duplicate active-room protection
- Active, off-unit, hospital, leave, and archived statuses
- Search across name, last 4, room, provider, specialty, and status
- Active, archived, and all-record filters
- Archive and restore workflow; no hard deletion
- Local-storage persistence and normalization of earlier foundation data
- Dashboard metrics driven by the same state
- Responsive VA-appropriate interface

## Safety

This remains a public development build. Do not enter real PHI or Veteran information.

## Validation

```bash
npm install
npm run build
npm run dev
```
