# ChargeNurse Functional Automation Audit — v7.5

## Scope
Scheduler destination/provider dropdown behavior and automatic profile population.

## Finding AUD-010 — Facility profile automation

**Status:** Resolved in this build.

The Scheduler contained the facility profile fields and lookup data, but the runtime behavior had two functional weaknesses:

1. Selecting a destination from the browser suggestion list depended only on the `change` event, which may not run until the field loses focus.
2. Facility defaults filled only empty fields. Changing from one facility to another could leave the previous facility's address, phone, fax, contact, or directions in the appointment.

## Correction

- Added immediate exact-match handling on both `input` and `change` events.
- Selecting a saved facility now replaces the facility-dependent fields with that facility's saved profile.
- Selecting a saved provider now fills its clinic, facility, phone, and fax.
- When a provider supplies a facility, the linked facility profile also populates automatically.
- Free-text destinations and providers remain permitted.

## Dropdown inventory verified in Scheduler

- Veteran
- Facility / Destination
- Clinic
- Provider
- Escort
- Transportation
- Appointment Reason

The Facility, Clinic, Provider, Escort, Transportation, and Appointment Reason controls use editable browser dropdown lists populated from Settings/master lists.

## Required manual browser verification

1. In Settings, select or create a facility and save address, phone, fax, contact, and directions.
2. Open Scheduler > New Appointment.
3. Select that facility from Location / Destination.
4. Confirm all five facility fields populate immediately.
5. Select a different saved facility and confirm all five fields change to the second facility's details.
6. Configure a provider with a facility and contact defaults, then select the provider and confirm both provider and facility fields populate.
