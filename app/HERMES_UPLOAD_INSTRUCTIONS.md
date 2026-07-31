# Hermes Upload Instructions

Repository: `coreycrutchfield1975/chargenurse-app`

## Branch
`agent/bravoshift-2-staff-assignments`

## Commit
`Add Staff Assignments and shift coverage`

## Procedure
1. Start from the branch containing Transportation & Ticket to Ride.
2. Preserve `legacy/index-v1.8.html` and all existing repository history.
3. Replace the current `/app` contents with the contents of this package.
4. Run:
   ```bash
   cd app
   npm install
   npm run build
   npm run dev
   ```
5. Confirm Veterans, Appointments, Calendar, Transport, and Staff Assignments all open.
6. Test adding, editing, filtering, and removing staff assignments.
7. Confirm uncovered-Veteran and missing-charge-nurse warnings update immediately.
8. Commit and open a draft pull request into `main`.

Do not add real Veteran data or PHI.
