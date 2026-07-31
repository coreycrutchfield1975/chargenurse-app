import type { BravoShiftState } from '../../types/domain';

export const BACKUP_FORMAT = 'bravoshift-local-backup';
export const BACKUP_SCHEMA_VERSION = 1;
export const HISTORY_KEY = 'bravoshift.v2.version-history';
export const MAX_HISTORY = 20;

export type IntegritySeverity = 'Error' | 'Warning' | 'Info';
export type IntegrityCategory = 'Identity' | 'Required data' | 'Relationship' | 'Date/time' | 'Archive' | 'Storage';

export interface IntegrityIssue {
  id: string;
  severity: IntegritySeverity;
  category: IntegrityCategory;
  collection: keyof BravoShiftState | 'application';
  recordId?: string;
  message: string;
  recommendation: string;
}

export interface DuplicateGroup {
  id: string;
  collection: keyof BravoShiftState;
  reason: string;
  recordIds: string[];
  label: string;
}

export interface BackupEnvelope {
  format: typeof BACKUP_FORMAT;
  schemaVersion: number;
  appVersion: string;
  exportedAt: string;
  recordCounts: Record<string, number>;
  state: BravoShiftState;
}

export interface VersionSnapshot {
  id: string;
  createdAt: string;
  reason: string;
  appVersion: string;
  recordCount: number;
  state: BravoShiftState;
}

const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
const issueId = () => crypto.randomUUID();

export function countRecords(state: BravoShiftState): number {
  return Object.values(state).reduce((sum, value) => sum + (Array.isArray(value) ? value.length : 0), 0);
}

export function recordCounts(state: BravoShiftState): Record<string, number> {
  return Object.fromEntries(Object.entries(state).map(([key, value]) => [key, Array.isArray(value) ? value.length : 0]));
}

export function createBackup(state: BravoShiftState, appVersion = '2.10'): BackupEnvelope {
  return {
    format: BACKUP_FORMAT,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appVersion,
    exportedAt: new Date().toISOString(),
    recordCounts: recordCounts(state),
    state,
  };
}

export function downloadJson(value: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function parseBackup(text: string): BackupEnvelope {
  const value = JSON.parse(text) as Partial<BackupEnvelope> & { state?: unknown };
  if (value.format !== BACKUP_FORMAT) throw new Error('This is not a recognized BravoShift backup file.');
  if (!value.state || typeof value.state !== 'object') throw new Error('The backup file does not contain application state.');
  if (typeof value.schemaVersion !== 'number' || value.schemaVersion > BACKUP_SCHEMA_VERSION) {
    throw new Error('This backup was created by a newer unsupported schema version.');
  }
  return value as BackupEnvelope;
}

export function loadHistory(): VersionSnapshot[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: VersionSnapshot[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function addSnapshot(state: BravoShiftState, reason: string, appVersion = '2.10'): VersionSnapshot[] {
  const snapshot: VersionSnapshot = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    reason: reason.trim() || 'Manual snapshot',
    appVersion,
    recordCount: countRecords(state),
    state: structuredClone(state),
  };
  const next = [snapshot, ...loadHistory()].slice(0, MAX_HISTORY);
  saveHistory(next);
  return next;
}

export function removeSnapshot(id: string): VersionSnapshot[] {
  const next = loadHistory().filter((item) => item.id !== id);
  saveHistory(next);
  return next;
}

function duplicateIds<T extends { id: string }>(collection: keyof BravoShiftState, rows: T[]): DuplicateGroup[] {
  const groups = new Map<string, string[]>();
  rows.forEach((row) => groups.set(row.id, [...(groups.get(row.id) ?? []), row.id]));
  return [...groups.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([id, ids]) => ({ id: crypto.randomUUID(), collection, reason: 'Duplicate record ID', recordIds: ids, label: id }));
}

function groupDuplicates<T extends { id: string }>(
  collection: keyof BravoShiftState,
  rows: T[],
  keyFor: (row: T) => string,
  labelFor: (row: T) => string,
  reason: string,
): DuplicateGroup[] {
  const groups = new Map<string, T[]>();
  rows.forEach((row) => {
    const key = keyFor(row);
    if (key) groups.set(key, [...(groups.get(key) ?? []), row]);
  });
  return [...groups.values()]
    .filter((items) => items.length > 1)
    .map((items) => ({
      id: crypto.randomUUID(),
      collection,
      reason,
      recordIds: items.map((item) => item.id),
      label: labelFor(items[0]),
    }));
}

export function findDuplicates(state: BravoShiftState): DuplicateGroup[] {
  const allIdGroups: DuplicateGroup[] = [];
  const idCollections: Array<keyof BravoShiftState> = [
    'veterans', 'appointments', 'treatments', 'treatmentCompletions', 'travelRequests', 'staffAssignmentRecords',
    'morningReportNotes', 'notifications', 'messages', 'broadcasts', 'reminders',
  ];
  idCollections.forEach((key) => {
    allIdGroups.push(...duplicateIds(key, state[key] as Array<{ id: string }>));
  });

  return [
    ...allIdGroups,
    ...groupDuplicates('veterans', state.veterans, (v) => `${normalize(v.name)}|${normalize(v.last4)}|${normalize(v.room)}`, (v) => `${v.name} · Room ${v.room}`, 'Same name, last four, and room'),
    ...groupDuplicates('appointments', state.appointments, (a) => `${a.veteranId}|${a.date}|${a.time}|${normalize(a.destination)}|${normalize(a.reason)}`, (a) => `${a.date} ${a.time} · ${a.reason}`, 'Same Veteran, date, time, destination, and reason'),
    ...groupDuplicates('travelRequests', state.travelRequests, (t) => `${t.veteranId}|${t.appointmentId}|${t.pickupTime}|${normalize(t.transportMode)}`, (t) => `${t.pickupTime} · ${t.transportMode}`, 'Same Veteran, appointment, pickup, and transport mode'),
    ...groupDuplicates('staffAssignmentRecords', state.staffAssignmentRecords, (s) => `${normalize(s.staffName)}|${s.assignmentDate}|${s.shift}|${normalize(s.zone)}`, (s) => `${s.staffName} · ${s.assignmentDate} ${s.shift}`, 'Same staff member, date, shift, and zone'),
    ...groupDuplicates('notifications', state.notifications, (n) => `${normalize(n.title)}|${normalize(n.details)}|${n.veteranId ?? ''}|${n.createdAt.slice(0, 16)}`, (n) => n.title, 'Matching notification content and creation minute'),
  ];
}

export function runIntegrityCheck(state: BravoShiftState): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const veteranIds = new Set(state.veterans.map((v) => v.id));
  const appointmentIds = new Set(state.appointments.map((a) => a.id));
  const activeVeteranIds = new Set(state.veterans.filter((v) => v.status !== 'Discharged / Archived').map((v) => v.id));

  const push = (issue: Omit<IntegrityIssue, 'id'>) => issues.push({ id: issueId(), ...issue });

  state.veterans.forEach((v) => {
    if (!v.name.trim()) push({ severity: 'Error', category: 'Required data', collection: 'veterans', recordId: v.id, message: 'Veteran record is missing a name.', recommendation: 'Enter a display name before operational use.' });
    if (!v.room.trim() && v.status === 'Active') push({ severity: 'Warning', category: 'Required data', collection: 'veterans', recordId: v.id, message: `${v.name || 'Veteran'} is active without a room.`, recommendation: 'Assign a room or update the Veteran status.' });
    if (v.status === 'Discharged / Archived' && !v.archivedAt) push({ severity: 'Warning', category: 'Archive', collection: 'veterans', recordId: v.id, message: `${v.name || 'Archived Veteran'} has no archive timestamp.`, recommendation: 'Restore and archive the record again to set the timestamp.' });
    if (v.archivedAt && v.status !== 'Discharged / Archived') push({ severity: 'Warning', category: 'Archive', collection: 'veterans', recordId: v.id, message: `${v.name || 'Veteran'} has an archive timestamp but is not archived.`, recommendation: 'Clear the archive date or change the status.' });
    if (v.createdAt && v.updatedAt && new Date(v.updatedAt) < new Date(v.createdAt)) push({ severity: 'Warning', category: 'Date/time', collection: 'veterans', recordId: v.id, message: `${v.name || 'Veteran'} was updated before it was created.`, recommendation: 'Review imported timestamps.' });
  });

  state.appointments.forEach((a) => {
    if (!veteranIds.has(a.veteranId)) push({ severity: 'Error', category: 'Relationship', collection: 'appointments', recordId: a.id, message: `Appointment ${a.date || a.id} references a missing Veteran.`, recommendation: 'Relink the appointment or remove the orphaned record.' });
    if (!a.date || !a.time) push({ severity: 'Warning', category: 'Required data', collection: 'appointments', recordId: a.id, message: 'Appointment is missing a date or time.', recommendation: 'Complete scheduling information.' });
    if (a.veteranId && !activeVeteranIds.has(a.veteranId) && a.status === 'Upcoming') push({ severity: 'Warning', category: 'Archive', collection: 'appointments', recordId: a.id, message: 'Upcoming appointment is linked to an archived or inactive Veteran.', recommendation: 'Cancel, complete, or relink the appointment.' });
  });

  state.travelRequests.forEach((t) => {
    if (!veteranIds.has(t.veteranId)) push({ severity: 'Error', category: 'Relationship', collection: 'travelRequests', recordId: t.id, message: 'Travel request references a missing Veteran.', recommendation: 'Relink or remove the travel request.' });
    if (t.appointmentId && !appointmentIds.has(t.appointmentId)) push({ severity: 'Error', category: 'Relationship', collection: 'travelRequests', recordId: t.id, message: 'Travel request references a missing appointment.', recommendation: 'Relink or clear the appointment reference.' });
    if (t.escortRequired && !t.escortName.trim()) push({ severity: 'Warning', category: 'Required data', collection: 'travelRequests', recordId: t.id, message: 'Escort is required but no escort is named.', recommendation: 'Assign an escort before departure.' });
    if (t.oxygenRequired && !t.oxygenDetails.trim()) push({ severity: 'Warning', category: 'Required data', collection: 'travelRequests', recordId: t.id, message: 'Oxygen is required but details are missing.', recommendation: 'Document oxygen equipment and flow requirements.' });
  });

  state.treatments.forEach((t) => {
    if (!veteranIds.has(t.veteranId)) push({ severity: 'Error', category: 'Relationship', collection: 'treatments', recordId: t.id, message: `Treatment “${t.name || t.id}” references a missing Veteran.`, recommendation: 'Relink or archive the treatment.' });
    if (!t.name.trim()) push({ severity: 'Warning', category: 'Required data', collection: 'treatments', recordId: t.id, message: 'Treatment has no name.', recommendation: 'Add the treatment description.' });
  });

  state.staffAssignmentRecords.forEach((s) => {
    s.veteranIds.forEach((id) => {
      if (!veteranIds.has(id)) push({ severity: 'Error', category: 'Relationship', collection: 'staffAssignmentRecords', recordId: s.id, message: `${s.staffName || 'Staff assignment'} references a missing Veteran.`, recommendation: 'Remove the missing Veteran from the assignment.' });
    });
    if (!s.staffName.trim()) push({ severity: 'Warning', category: 'Required data', collection: 'staffAssignmentRecords', recordId: s.id, message: 'Staff assignment is missing a staff name.', recommendation: 'Enter the assigned staff member.' });
  });

  [...state.notifications, ...state.messages, ...state.reminders].forEach((row) => {
    if (row.veteranId && !veteranIds.has(row.veteranId)) push({ severity: 'Warning', category: 'Relationship', collection: 'application', recordId: row.id, message: 'Communication item references a missing Veteran.', recommendation: 'Relink the communication item or clear its Veteran reference.' });
  });

  const duplicateGroups = findDuplicates(state);
  duplicateGroups.forEach((group) => push({ severity: 'Warning', category: 'Identity', collection: group.collection, message: `${group.reason}: ${group.label} (${group.recordIds.length} records).`, recommendation: 'Review the duplicate group before deleting or merging records.' }));

  try {
    const bytes = new Blob([JSON.stringify(state)]).size;
    if (bytes > 4_000_000) push({ severity: 'Warning', category: 'Storage', collection: 'application', message: `Application data uses approximately ${(bytes / 1_000_000).toFixed(2)} MB.`, recommendation: 'Export a backup and archive unnecessary records; browser storage limits vary.' });
  } catch {
    push({ severity: 'Error', category: 'Storage', collection: 'application', message: 'Application data could not be serialized.', recommendation: 'Export individual records and remove non-JSON values.' });
  }

  if (issues.length === 0) push({ severity: 'Info', category: 'Storage', collection: 'application', message: 'No integrity problems were detected.', recommendation: 'Continue regular JSON backups.' });
  return issues;
}

export function mergeStates(current: BravoShiftState, incoming: BravoShiftState): BravoShiftState {
  const mergeById = <T extends { id: string }>(existing: T[], added: T[]): T[] => {
    const map = new Map(existing.map((item) => [item.id, item]));
    added.forEach((item) => map.set(item.id, item));
    return [...map.values()];
  };
  return {
    veterans: mergeById(current.veterans, incoming.veterans ?? []),
    appointments: mergeById(current.appointments, incoming.appointments ?? []),
    treatments: mergeById(current.treatments, incoming.treatments ?? []),
    treatmentCompletions: mergeById(current.treatmentCompletions, incoming.treatmentCompletions ?? []),
    travelRequests: mergeById(current.travelRequests, incoming.travelRequests ?? []),
    shiftAssignments: [...(incoming.shiftAssignments ?? current.shiftAssignments)],
    staffAssignmentRecords: mergeById(current.staffAssignmentRecords, incoming.staffAssignmentRecords ?? []),
    morningReportNotes: mergeById(current.morningReportNotes, incoming.morningReportNotes ?? []),
    notifications: mergeById(current.notifications, incoming.notifications ?? []),
    messages: mergeById(current.messages, incoming.messages ?? []),
    broadcasts: mergeById(current.broadcasts, incoming.broadcasts ?? []),
    reminders: mergeById(current.reminders, incoming.reminders ?? []),
  };
}
