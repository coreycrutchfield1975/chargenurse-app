# Migration Plan — Transportation

This package extends the React/TypeScript migration without altering the archived v1.8 prototype.

## Data additions
`BravoShiftState.travelRequests` stores normalized travel records linked by `veteranId` and optional `appointmentId`.

## Workflow
Draft → Pending → Confirmed → En Route → At Destination → Awaiting Return → Completed.
Failed and Cancelled remain visible for audit-oriented prototype history.

## Next integration
- Synchronize transport state changes with Veteran off-unit status.
- Add treatment-conflict alerts.
- Feed missed/late returns into Morning Report Intelligence.
- Replace local storage with Supabase after authentication and authorization are established.
