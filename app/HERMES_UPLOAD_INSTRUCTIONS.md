# Hermes Upload Instructions

Repository: `coreycrutchfield1975/chargenurse-app`

## Branch
Create:

`agent/bravoshift-2-foundation`

## Safe file changes

1. Preserve the current application:
   - copy root `index.html` to `legacy/index-v1.8.html`
2. Add this entire folder as:
   - `app/`
3. Add `docs/MIGRATION_PLAN.md` from this bundle to the repository docs folder.
4. Do not delete or replace the current root `index.html` in this pull request.

## Validation

From the new `app/` directory:

```bash
npm install
npm run build
npm run dev
```

Verify:

- BravoShift header renders
- v2 dashboard renders
- navigation is visible
- responsive layout works
- browser console has no errors
- `npm run build` succeeds

## Commit

`Establish BravoShift 2.0 React foundation`

## Draft pull request title

`Establish BravoShift 2.0 React foundation`

## Pull request summary

- Preserves the working v1.8 single-file prototype
- Introduces React, TypeScript, and Vite under `/app`
- Adds typed domain models and a local storage adapter
- Adds a component-based app shell and dashboard foundation
- Documents the staged migration plan
- Does not remove or alter existing v1.8 functionality
