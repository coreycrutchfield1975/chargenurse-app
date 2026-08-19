# BravoShift 14-Day Treatment Sheet Update

## Summary of Changes
The treatment print layout has been completely redesigned to support:
- **14-day flexible range** instead of 31 days
- **Separate instructions box** (expandable in print)
- **Three shift rows**: Day, PRN, Night - each with 14 boxes for initials
- **Patient header**: Veteran, Room, Last 4; Month, Category (Licensed/Non-Licensed)
- **No printed date** (optional)
- **Running 2-week sheet** concept - pick any start day 1-18

## New Features
1. **Start Day selector (1-18)** in treatment modal
2. **Instructions in separate box** (not combined with days grid)
3. **Shift rows with 14 boxes** each (Day, PRN, Night)
4. **Category-specific colors**: Purple for Licensed, Green for Non-Licensed
5. **Print-optimized layout** with proper page breaks

## How to Use
1. Open the app (`chargenurse-14day-treatment.html`)
2. Go to **Treatments** tab
3. Click **Assign Treatment**
4. Select Veteran, Month, Category
5. **Choose Start Day (1-18)** - this determines the day numbering for boxes
6. Add sections with:
   - Frequency (Daily/Weekly/As Scheduled/PRN)
   - Order Start/End dates
   - Instructions
7. Click **Print Treatment** to generate the new 14-day sheet

## Print Preview
The printed sheet includes:
- Patient header grid (Veteran, Room, Last 4, Month, Category)
- Instructions box for each section
- Order dates
- Three shift rows (Day, PRN, Night) with 14 numbered boxes
- Boxes are numbered according to your selected Start Day

## Data Compatibility
- Existing treatments will still work (shift='Day', days=[])
- New treatments include `startDay` field (1-18)
- All existing save/archive/export functionality preserved

## Files
- `chargenurse-14day-treatment.html` - Updated app with new treatment print
- `chargenurse-standalone.html` - Same as above (backup/alternate name)

## For VA Drive
Save `chargenurse-14day-treatment.html` to your S: drive. The app is completely self-contained (no external dependencies, no GitHub connection required).

## Notes
- Daily frequency treatments show as due every day (regardless of days array)
- Weekly/As Scheduled frequencies check days array (empty by default)
- PRN treatments don't show in due list (by design)
- All existing data is preserved in localStorage