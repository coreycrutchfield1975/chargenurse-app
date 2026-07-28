# ChargeNurse v6.2 — Optional Provider Defaults

Phase 14 adds optional provider profiles without hard-coding provider details.

## Settings
Each Provider can now have optional defaults for:
- Clinic
- Facility / Destination
- Phone
- Fax

McCain and Cook remain the default provider names. Their profile fields begin blank and can be maintained in Settings.

## Scheduler behavior
When a Provider is selected:
- Clinic fills only if the Clinic field is blank.
- Facility / Destination fills only if the destination field is blank.
- Phone and fax display as a reference beneath the Provider field.
- Existing typed information is never overwritten.

Provider entry remains flexible. Staff may still type an unlisted Provider.

## Preserved
- Editable shared master lists
- Day, Week, Month, and Year calendar views
- Travel Request email safeguard
- Ticket to Ride workflow
- Transportation status tracking
- Existing Veteran and appointment records
