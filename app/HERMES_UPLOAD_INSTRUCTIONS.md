# Hermes Upload Instructions — BravoShift 2.6

Repository: `coreycrutchfield1975/chargenurse-app`

1. Start from the branch containing Module 2.5 Staff Assignments.
2. Create branch: `agent/bravoshift-2-morning-report`
3. Replace the repository `/app` directory with the contents of this package.
4. Preserve `legacy/index-v1.8.html` and all historical files.
5. Run:
   ```bash
   cd app
   npm install
   npm run build
   npm run dev
   ```
6. Verify:
   - Morning Report navigation opens.
   - Date and shift filters update report values.
   - Handoff notes persist after refresh.
   - Critical and urgent notes affect readiness.
   - Missing charge nurse and uncovered Veterans create priorities.
   - Print view hides navigation and controls.
7. Commit: `Add Morning Report Intelligence`
8. Open a draft PR into `main` titled: `BravoShift 2.6 Morning Report Intelligence`

Do not claim successful validation unless both build and browser checks pass.
