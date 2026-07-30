import type { BravoShiftState } from '../types/domain';

const STORAGE_KEY = 'bravoshift.v2.state';

export const emptyState: BravoShiftState = {
  veterans: [],
  appointments: [],
  treatments: [],
  shiftAssignments: [],
};

export function loadState(): BravoShiftState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<BravoShiftState>;
    return {
      veterans: parsed.veterans ?? [],
      appointments: parsed.appointments ?? [],
      treatments: parsed.treatments ?? [],
      shiftAssignments: parsed.shiftAssignments ?? [],
    };
  } catch {
    return emptyState;
  }
}

export function saveState(state: BravoShiftState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
