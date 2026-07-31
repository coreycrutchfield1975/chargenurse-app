# Hermes Upload Instructions

Repository: `coreycrutchfield1975/chargenurse-app`

## Branch

`agent/bravoshift-2-appointments-calendar`

## Safe upload process

1. Start from the branch containing the Veteran Master Record package.
2. Replace the `/app` directory with this package's contents, or copy all package files into `/app`.
3. Do not replace the legacy root `index.html`.
4. Run:

```bash
cd app
npm install
npm run build
```

5. Verify:
   - Veterans remain visible after refresh.
   - An appointment can be scheduled for an active Veteran.
   - Required fields block invalid saves.
   - A duplicate Veteran/date/time appointment is blocked.
   - Appointment filters work.
   - Calendar events open the appointment workflow.
   - Data persists after browser refresh.
6. Commit:

`Add BravoShift appointments and calendar`

7. Open a pull request targeting the prior BravoShift 2.0 branch, or `main` if the earlier package was already merged.
