# CLC Command Center v4.1

## Scope
This release intentionally adds only the Calendar Center and workflow automation requested after v4.0.

## Calendar Center
- Monthly calendar with previous, next, today, and date-jump controls.
- Displays appointments and recurring showers, vitals, weights, skin assessments, and labs.
- Selected-day agenda with direct access to appointment/transportation records.
- Printable monthly calendar agenda.
- New appointments return directly to the Calendar Center.

## Workflow Automation
- Automatically initializes the transportation workflow for appointments requiring transportation.
- Automatically sets appointment preparation due dates one day before appointments.
- Creates persistent preparation reminders.
- Activates resident schedules and profile-validation workflow when a new resident is admitted.
- Refreshes recurring daily work once per calendar day.
- Includes visible automation controls and an audit-style action log.
- All automation remains local to the browser and uses the existing Command Center data store.

## Deployment
Replace the existing repository files with the contents of this folder. No data migration is required; the v4.1 loader extends existing v4.0 local data in place.
