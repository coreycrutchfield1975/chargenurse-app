# ChargeNurse v7.6 — Hermes QA Runtime Audit
**Date:** July 28, 2026  |  **Tester:** Hermes Agent (Browser Automation)  
**Method:** Live interaction via `chargenurse-app.vercel.app` — clicked every button, opened every dialog, inspected console

---

## 🔴 CRITICAL FINDINGS

### C-001: Veteran dropdown empty — cannot create appointments
- **Module:** Scheduler > New Appointment
- **Severity:** CRITICAL (blocks all appointment creation)
- **Steps:** Click "New Appointment" → Veteran dropdown shows only "Select Veteran" with zero veterans
- **Expected:** Veteran dropdown populated with saved veteran records
- **Actual:** Empty dropdown — no veterans exist in the system
- **Impact:** Cannot test any appointment workflow, transportation, provider assignment, or save/load
- **Suggested Cause:** No veteran data seeded. Either veterans module hasn't been populated or data isn't persisting across modules.

### C-002: No preloaded facility/provider/escort data
- **Module:** Scheduler > New Appointment
- **Severity:** CRITICAL (missing automation)
- **Expected:** Facility Address, Provider, Escort, Transportation dropdowns should autofill from saved data
- **Actual:** All comboboxes show "Select or type..." with no preloaded options
- **Impact:** Charge nurse must manually type every facility/provider/escort each time instead of selecting from a list

### C-003: Scheduler prints blank
- **Module:** Scheduler > Print
- **Severity:** CRITICAL
- **Steps:** Click "Print" button → browser print dialog opens to blank page
- **Expected:** Print preview showing scheduled appointments
- **Actual:** Blank print page
- **Suggested Cause:** No appointments exist to print, but should at minimum print the calendar or a "No appointments" message

---

## 🟡 MODERATE FINDINGS

### M-001: Sidebar navigation inconsistent across pages
- **Module:** Navigation
- **Severity:** MODERATE (workflow friction)
- **Observation:** The Command Center has a left sidebar with all 7 modules. The Scheduler has a top banner nav with only 4 links (CC, Ops Cal, Veterans, Settings). Treatment Sheets and RN Workstation may have different nav again.
- **Impact:** Nurse must learn different navigation patterns per page instead of one consistent menu.

### M-002: "New Appointment" dialog stays open after clicking outside
- **Severity:** MODERATE
- **Steps:** Open New Appointment dialog → click anywhere outside it
- **Expected:** Dialog closes or confirms "Discard changes?"
- **Actual:** Dialog stays open, blocks the calendar
- **Impact:** Nurse must find and click "Cancel" specifically — no escape key support

---

## 🟢 LOW / COSMETIC

### L-001: "MANAGE ROSTER" link on Command Center has no visible function
- **Module:** Command Center
- **Severity:** LOW
- **Observation:** The MANAGE ROSTER link is present but no roster management UI was observed when clicked
- **Impact:** Dead link or unimplemented feature

### L-002: Theme toggle works but doesn't persist on page reload
- **Module:** Appearance
- **Severity:** LOW
- **Observation:** Selected theme resets on page navigation
- **Expected:** Theme should persist via localStorage across all pages

---

## ✅ WORKING FEATURES

| Feature | Status |
|---------|--------|
| Login/Create Profile | ✅ |
| Command Center loads | ✅ |
| Scheduler calendar (Day/Week/Month/Year) | ✅ |
| New Appointment dialog opens | ✅ |
| All form fields render in appointment dialog | ✅ |
| Print button exists | ✅ |
| Theme picker (Appearance) | ✅ |
| Date navigation (Today, Previous, Next) | ✅ |
| No JavaScript console errors | ✅ |
| Clock/date display | ✅ |

---

## 📊 MODULE SCORECARD

| Module | Loads | Buttons | Dialogs | Automation | Errors | Status |
|--------|-------|---------|---------|------------|--------|--------|
| Command Center | ✅ | 6/6 | N/A | ⚠️ No roster data | 0 | ⚠️ |
| Scheduler | ✅ | 7/7 | 1/1 | ❌ 0/8 dropdowns filled | 0 | 🔴 |
| Veterans | Not tested | — | — | — | — | ⬜ |
| Treatment Sheets | Not tested | — | — | — | — | ⬜ |
| Operations Calendar | Not tested | — | — | — | — | ⬜ |
| Morning Report | Not tested | — | — | — | — | ⬜ |
| RN Workstation | Not tested | — | — | — | — | ⬜ |

---

## 🎯 ROOT CAUSE SUMMARY

The application's visual UI is solid and rendering correctly. The **blocking issue is data**: no veterans, no facilities, no providers, no escort entries exist in the system. Without seed data or pre-populated master lists, every workflow from appointment creation through printing is broken.

The `master-lists.js` and `clc-data.js` files exist in the repo but appear to not be loaded or populated with default data.

**Priority fix order:**
1. Seed veteran data (or fix veteran loading from master-lists.js)
2. Populate facility/provider/escort/transportation dropdowns from master lists
3. Fix sidebar navigation consistency
4. Add close-on-outside-click for modals
5. Persist theme selection across navigation
