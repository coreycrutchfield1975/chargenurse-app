# ChargeNurse Phase 30 — RN Shared Veteran Data

- Charge RN now loads its roster from `CLCData.residents()` instead of maintaining a separate Veteran database.
- RN clinical fields are preserved on the shared Veteran record in `clc-data.js`.
- Existing `va-rn-workstation` data migrates once when the shared roster is empty.
- RN settings remain separate, but the duplicate RN roster storage is removed after successful migration/save.
- Removing a Veteran from Charge RN now archives the shared record instead of deleting clinical history.
- Scheduler appointments are summarized automatically in the RN Veteran view.
- Charge RN refreshes when shared data changes in another page.
