# ChargeNurse Phase 30 RN9

- Removed the duplicate RN Workstation payload from new Command Center backups.
- Added centralized `CLCData.importLegacyRN()` migration support.
- Legacy backups now merge RN patient records into shared Veteran records instead of recreating `va-rn-workstation`.
- Charge RN now uses the shared migration API and deletes the obsolete legacy storage key after migration.
- Advanced shared data schema to `7.3-phase30-rn9`.
