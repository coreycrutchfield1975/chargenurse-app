# BravoShift 2.0 Migration Plan

## Purpose
This foundation is intended to be added alongside the current working `index.html`. It must not replace or delete the v1.8 prototype yet.

## Recommended repository layout

- `/legacy/index-v1.8.html` — preserved current application
- `/app/` — this React + TypeScript foundation
- `/docs/` — architecture and migration documentation

## Pull request scope

1. Copy the current root `index.html` to `legacy/index-v1.8.html`.
2. Copy this package into `app/`.
3. Add a root README that explains how to run the legacy and v2 applications.
4. Do not remove the current root app until feature parity is verified.

## Migration sequence

1. Veteran Master Record
2. Managed Lists
3. Appointments and Calendar
4. Transportation
5. Ticket to Ride
6. Treatments
7. Staff Assignments
8. Morning Report
9. Administration and Reporting
10. Supabase authentication, RLS, audit logging, and realtime

## Safety rules

- Use fictional data only until the application is deployed in an approved environment.
- Never store PHI in a public repository, browser demo, issue, pull request, or test fixture.
- Preserve archive-over-delete behavior.
- Keep the Veteran Master Record as the single source of truth.
- Add audit events before production use.
