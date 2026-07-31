import type { Appointment, BravoShiftState, NotificationRecord, ShiftBroadcast, StaffAssignmentRecord, StaffMessage, TaskReminder, TravelRequest, Veteran } from '../types/domain';

const STORAGE_KEY = 'bravoshift.v2.state';

export const emptyState: BravoShiftState = {
  veterans: [],
  appointments: [],
  treatments: [],
  travelRequests: [],
  shiftAssignments: [],
  staffAssignmentRecords: [],
  morningReportNotes: [],
  notifications: [],
  messages: [],
  broadcasts: [],
  reminders: [],
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


function normalizeTravelRequest(value: Partial<TravelRequest>): TravelRequest {
  const now = new Date().toISOString();
  return {
    id: value.id ?? crypto.randomUUID(), veteranId: value.veteranId ?? '', appointmentId: value.appointmentId ?? '',
    status: value.status ?? 'Draft', transportMode: value.transportMode ?? 'VA Transport', mobilityMode: value.mobilityMode ?? 'Ambulatory',
    pickupTime: value.pickupTime ?? '', estimatedReturn: value.estimatedReturn ?? '', returnPickupTime: value.returnPickupTime ?? '',
    driver: value.driver ?? '', escortRequired: value.escortRequired ?? false, escortName: value.escortName ?? '',
    oxygenRequired: value.oxygenRequired ?? false, oxygenDetails: value.oxygenDetails ?? '', destinationContact: value.destinationContact ?? '',
    sendingNurse: value.sendingNurse ?? '', receivingStaff: value.receivingStaff ?? '', returnedToUnitBy: value.returnedToUnitBy ?? '',
    notes: value.notes ?? '', createdAt: value.createdAt ?? now, updatedAt: value.updatedAt ?? now,
  };
}

function normalizeStaffAssignment(value: Partial<StaffAssignmentRecord>): StaffAssignmentRecord {
  const now = new Date().toISOString();
  return {
    id: value.id ?? crypto.randomUUID(), staffName: value.staffName ?? '', role: value.role ?? 'CNA',
    shift: value.shift ?? 'Day', assignmentDate: value.assignmentDate ?? '', status: value.status ?? 'Scheduled',
    zone: value.zone ?? '', veteranIds: value.veteranIds ?? [], treatmentCategories: value.treatmentCategories ?? [],
    isChargeNurse: value.isChargeNurse ?? false, startTime: value.startTime ?? '', endTime: value.endTime ?? '',
    phoneExtension: value.phoneExtension ?? '', notes: value.notes ?? '', createdAt: value.createdAt ?? now, updatedAt: value.updatedAt ?? now,
  };
}


function normalizeNotification(value: Partial<NotificationRecord>): NotificationRecord {
  const now = new Date().toISOString();
  return { id: value.id ?? crypto.randomUUID(), title: value.title ?? '', details: value.details ?? '', category: value.category ?? 'Administrative', priority: value.priority ?? 'Routine', status: value.status ?? 'Unread', veteranId: value.veteranId, assignedTo: value.assignedTo ?? '', source: value.source ?? 'Manual', escalationLevel: value.escalationLevel ?? 0, createdAt: value.createdAt ?? now, updatedAt: value.updatedAt ?? now, dueAt: value.dueAt };
}
function normalizeMessage(value: Partial<StaffMessage>): StaffMessage {
  return { id: value.id ?? crypto.randomUUID(), from: value.from ?? '', to: value.to ?? '', subject: value.subject ?? '', body: value.body ?? '', priority: value.priority ?? 'Routine', veteranId: value.veteranId, read: value.read ?? false, createdAt: value.createdAt ?? new Date().toISOString() };
}
function normalizeBroadcast(value: Partial<ShiftBroadcast>): ShiftBroadcast {
  return { id: value.id ?? crypto.randomUUID(), title: value.title ?? '', message: value.message ?? '', shift: value.shift ?? 'All', priority: value.priority ?? 'Routine', active: value.active ?? true, expiresAt: value.expiresAt, createdAt: value.createdAt ?? new Date().toISOString() };
}
function normalizeReminder(value: Partial<TaskReminder>): TaskReminder {
  return { id: value.id ?? crypto.randomUUID(), title: value.title ?? '', assignedTo: value.assignedTo ?? '', dueAt: value.dueAt ?? '', veteranId: value.veteranId, category: value.category ?? 'Administrative', completed: value.completed ?? false, createdAt: value.createdAt ?? new Date().toISOString() };
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
      travelRequests: (parsed.travelRequests ?? []).map(normalizeTravelRequest),
      shiftAssignments: parsed.shiftAssignments ?? [],
      staffAssignmentRecords: (parsed.staffAssignmentRecords ?? []).map(normalizeStaffAssignment),
      morningReportNotes: parsed.morningReportNotes ?? [],
      notifications: (parsed.notifications ?? []).map(normalizeNotification),
      messages: (parsed.messages ?? []).map(normalizeMessage),
      broadcasts: (parsed.broadcasts ?? []).map(normalizeBroadcast),
      reminders: (parsed.reminders ?? []).map(normalizeReminder),
    };
  } catch {
    return emptyState;
  }
}

export function saveState(state: BravoShiftState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
