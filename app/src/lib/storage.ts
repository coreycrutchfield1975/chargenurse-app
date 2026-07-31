import type { Appointment, BravoShiftState, Veteran } from '../types/domain';

const STORAGE_KEY = 'bravoshift.v2.state';

export const emptyState: BravoShiftState = {
  veterans: [],
  appointments: [],
  treatments: [],
  shiftAssignments: [],
};

function normalizeVeteran(value: Partial<Veteran>): Veteran {
  const now = new Date().toISOString();
  return {
    id: value.id ?? crypto.randomUUID(),
    name: value.name ?? '',
    last4: value.last4 ?? '',
    room: value.room ?? '',
    status: value.status ?? 'Active',
    admissionDate: value.admissionDate ?? '',
    provider: value.provider ?? '',
    specialty: value.specialty ?? '',
    codeStatus: value.codeStatus ?? '',
    mobility: value.mobility ?? '',
    fallRisk: value.fallRisk ?? '',
    medicationMethod: value.medicationMethod ?? '',
    diet: value.diet ?? '',
    isolation: value.isolation ?? '',
    assistLevel: value.assistLevel ?? '',
    toileting: value.toileting ?? '',
    notes: value.notes ?? '',
    createdAt: value.createdAt ?? now,
    updatedAt: value.updatedAt ?? now,
    archivedAt: value.archivedAt,
  };
}

function normalizeAppointment(value: Partial<Appointment>): Appointment {
  const now = new Date().toISOString();
  return {
    id: value.id ?? crypto.randomUUID(),
    veteranId: value.veteranId ?? '',
    date: value.date ?? '',
    time: value.time ?? '',
    pickupTime: value.pickupTime ?? '',
    reason: value.reason ?? '',
    specialty: value.specialty ?? '',
    destination: value.destination ?? '',
    provider: value.provider ?? '',
    transport: value.transport ?? '',
    travelStatus: value.travelStatus ?? 'Not Created',
    status: value.status ?? 'Upcoming',
    notes: value.notes ?? '',
    createdAt: value.createdAt ?? now,
    updatedAt: value.updatedAt ?? now,
  };
}

export function loadState(): BravoShiftState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<BravoShiftState>;
    return {
      veterans: (parsed.veterans ?? []).map(normalizeVeteran),
      appointments: (parsed.appointments ?? []).map(normalizeAppointment),
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
