# ChargeNurse Phase 30 RN8

- Added shared `CLCData.patchResident` and `patchResidents` APIs.
- Charge RN now saves only RN-owned clinical fields instead of rewriting entire Veteran records.
- Prevents concurrent Scheduler, Command Center, and Hermes updates from being overwritten by RN saves.
- Legacy RN roster migration now merges missing Veterans once, then permanently removes `va-rn-workstation`.
- Removed obsolete password-cleanup logic tied to the retired RN storage key.
