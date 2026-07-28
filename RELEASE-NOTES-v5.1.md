# ChargeNurse v5.1 — Command Center / Scheduler Separation

## Completed
- Command Center appointment and transportation views are now read-only.
- Appointment creation, editing, deletion, and status changes live only in Scheduler.
- Alert Center items deep-link directly to the matching Scheduler appointment.
- Upcoming appointment rows deep-link directly to the matching Scheduler appointment.
- Scheduler accepts `?appointment=<id>` and `?date=YYYY-MM-DD`.
- External CLC Scheduler site is no longer required.
- Existing Veteran, appointment, census, task, alert, and backup data remain in the same browser storage.

## Architecture
- Command Center answers: **What needs attention today?**
- Scheduler answers: **Create, edit, coordinate, and complete appointments.**
