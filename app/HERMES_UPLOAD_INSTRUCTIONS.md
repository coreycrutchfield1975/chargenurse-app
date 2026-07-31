# Hermes Upload Instructions

Repository: `coreycrutchfield1975/chargenurse-app`

Branch: `agent/bravoshift-2-transportation`

Commit: `Add Transportation workflow and Ticket to Ride`

## Upload
1. Start from the branch containing the Appointments & Calendar package.
2. Copy this package into the repository's `/app` directory, replacing matching migration files.
3. Preserve the legacy v1.8 application at `legacy/index-v1.8.html`.
4. Do not place real PHI in test data, screenshots, commits, or pull-request descriptions.

## Validate
```bash
cd app
npm install
npm run build
npm run dev
```

Test creating and editing requests, filtering status, linking appointments, and printing Ticket to Ride.

## Pull request title
`BravoShift 2.4: Transportation and Ticket to Ride`
