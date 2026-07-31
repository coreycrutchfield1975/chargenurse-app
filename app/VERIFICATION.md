# Verification

- Exactly 9 navigation tabs are declared in `src/App.tsx`.
- All 12 v1.8 managed-list categories are defined in `src/store/db.ts`.
- Veteran fields use specialties, medication methods, diets, isolation, assist, mobility, fall risk and toileting lists.
- Appointment form uses appointment reasons and transportation modes.
- Treatment form uses treatment types.
- Managed-list archive/restore immediately changes active dropdown options.
- localStorage key remains `cn-spectrum-db`.
- No fetch, axios, Supabase, .NET, API URL, or database client appears in `src`.
