# Hermes Upload Instructions — BravoShift 2.9

1. Start from the branch that contains BravoShift 2.8 Clinical Analytics.
2. Create branch: `agent/bravoshift-2-notifications`
3. Replace the current app source with this package, preserving any environment-specific configuration that is not represented here.
4. Run:
   ```bash
   npm install
   npm run build
   npm run dev
   ```
5. Validate:
   - Communication Hub appears in navigation.
   - Alerts can be created and moved through Read, Acknowledged, Completed, and Escalated states.
   - Messages, broadcasts, and reminders persist after refresh.
   - Overdue reminders update the dashboard count.
   - Print Communication Report opens a clean print view.
6. Commit: `Add Notifications and Communication Hub`
7. PR title: `BravoShift 2.9 Notifications & Communication Hub`

Do not use real PHI during development or testing.
