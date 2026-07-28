# Phase 30 — RN Consolidation Pass 2

- Removed the embedded 30-patient demo roster from `charge-rn.html`.
- RN Workstation now starts exclusively from the shared `CLCData` Veteran roster.
- Replaced per-patient repeated saves with one bulk shared-data transaction.
- Added shared bulk resident update and archive-all APIs.
- Changed Clear All so it archives the shared active roster instead of restoring duplicate sample patients.
- Retained one-time legacy RN localStorage migration for existing users.
