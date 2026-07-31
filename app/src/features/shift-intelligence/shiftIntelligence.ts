import type { BravoShiftState, StaffShift } from '../../types/domain';

export type IntelligenceSeverity = 'Info' | 'Watch' | 'High' | 'Critical';

export interface ShiftRisk {
  id: string;
  severity: IntelligenceSeverity;
  category: 'Staffing' | 'Treatments' | 'Transport' | 'Appointments' | 'Coverage' | 'Documentation';
  title: string;
  detail: string;
  recommendedAction: string;
  dueBy?: string;
}

export interface ShiftForecast {
  readinessScore: number;
  workloadScore: number;
  staffingScore: number;
  completionForecast: number;
  predictedBottlenecks: number;
  uncoveredVeterans: number;
  overdueTreatments: number;
  atRiskTransports: number;
  risks: ShiftRisk[];
  recommendations: string[];
}

const severityWeight: Record<IntelligenceSeverity, number> = { Info: 2, Watch: 6, High: 12, Critical: 20 };

function sameDay(value: string | undefined, date: string): boolean {
  return Boolean(value && value.slice(0, 10) === date);
}

function activeVeterans(state: BravoShiftState) {
  return state.veterans.filter((v) => v.status !== 'Discharged / Archived');
}

export function buildShiftForecast(state: BravoShiftState, date: string, shift: StaffShift): ShiftForecast {
  const veterans = activeVeterans(state);
  const assignments = state.staffAssignmentRecords.filter((a) => a.assignmentDate === date && a.shift === shift);
  const availableAssignments = assignments.filter((a) => !['Called Off', 'Completed'].includes(a.status));
  const assignedVeteranIds = new Set(availableAssignments.flatMap((a) => a.veteranIds));
  const uncoveredVeterans = veterans.filter((v) => !assignedVeteranIds.has(v.id));
  const chargeNurse = availableAssignments.some((a) => a.isChargeNurse || a.role === 'Charge Nurse');
  const callOffs = assignments.filter((a) => a.status === 'Called Off');

  const dueTreatments = state.treatments.filter((t) => t.active && sameDay(t.dueDate, date) && (t.shift === shift || t.shift === 'Any'));
  const overdueTreatments = dueTreatments.filter((t) => !t.completedAt);
  const licensedDue = overdueTreatments.filter((t) => t.category === 'Licensed');
  const licensedCoverage = availableAssignments.some((a) => ['RN', 'LPN', 'Charge Nurse'].includes(a.role));

  const appointments = state.appointments.filter((a) => a.date === date && !['Completed', 'Cancelled', 'No Show'].includes(a.status));
  const appointmentIds = new Set(appointments.map((a) => a.id));
  const transports = state.travelRequests.filter((t) => appointmentIds.has(t.appointmentId));
  const atRiskTransports = transports.filter((t) => ['Draft', 'Pending', 'Failed'].includes(t.status));
  const missingTransport = appointments.filter((a) => a.travelStatus !== 'Not Created' && !transports.some((t) => t.appointmentId === a.id));

  const risks: ShiftRisk[] = [];
  if (!chargeNurse) risks.push({ id: 'charge', severity: 'Critical', category: 'Staffing', title: 'No charge nurse assigned', detail: `${shift} shift has no active charge nurse assignment.`, recommendedAction: 'Assign an RN/LPN charge nurse before shift start.' });
  if (uncoveredVeterans.length) risks.push({ id: 'coverage', severity: uncoveredVeterans.length > 4 ? 'Critical' : 'High', category: 'Coverage', title: `${uncoveredVeterans.length} Veterans uncovered`, detail: uncoveredVeterans.slice(0, 6).map((v) => `${v.room || 'No room'} ${v.name}`).join(', '), recommendedAction: 'Redistribute Veterans across available staff and confirm acceptance.' });
  if (callOffs.length) risks.push({ id: 'calloffs', severity: callOffs.length > 1 ? 'High' : 'Watch', category: 'Staffing', title: `${callOffs.length} staff call-off${callOffs.length === 1 ? '' : 's'}`, detail: callOffs.map((a) => `${a.staffName} (${a.role})`).join(', '), recommendedAction: 'Activate coverage plan and rebalance assignments.' });
  if (licensedDue.length && !licensedCoverage) risks.push({ id: 'licensed', severity: 'Critical', category: 'Treatments', title: 'Licensed treatments without licensed coverage', detail: `${licensedDue.length} licensed treatment(s) remain due.`, recommendedAction: 'Assign an RN or LPN immediately.' });
  if (overdueTreatments.length) risks.push({ id: 'treatments', severity: overdueTreatments.length > 6 ? 'High' : 'Watch', category: 'Treatments', title: `${overdueTreatments.length} treatments pending`, detail: `${licensedDue.length} licensed and ${overdueTreatments.length - licensedDue.length} non-licensed treatments remain.`, recommendedAction: 'Sequence time-sensitive treatments first and assign owners.' });
  if (atRiskTransports.length || missingTransport.length) risks.push({ id: 'transport', severity: atRiskTransports.some((t) => t.status === 'Failed') ? 'High' : 'Watch', category: 'Transport', title: `${atRiskTransports.length + missingTransport.length} transport item(s) at risk`, detail: 'One or more appointment transports are pending, failed, draft, or missing.', recommendedAction: 'Confirm pickup, Ticket to Ride, escort, oxygen, and return plan.' });
  if (appointments.length > Math.max(1, availableAssignments.length * 2)) risks.push({ id: 'appointments', severity: 'Watch', category: 'Appointments', title: 'Appointment congestion forecast', detail: `${appointments.length} active appointments compete with ${availableAssignments.length} active staff assignments.`, recommendedAction: 'Pre-stage paperwork and stagger escorts where possible.' });

  const totalPenalty = risks.reduce((sum, risk) => sum + severityWeight[risk.severity], 0);
  const staffingScore = Math.max(0, 100 - (!chargeNurse ? 35 : 0) - uncoveredVeterans.length * 6 - callOffs.length * 10);
  const workloadRaw = veterans.length + overdueTreatments.length * 1.5 + appointments.length * 2 + atRiskTransports.length * 2;
  const capacity = Math.max(1, availableAssignments.length * 8);
  const workloadScore = Math.min(100, Math.round((workloadRaw / capacity) * 100));
  const completionForecast = Math.max(10, Math.min(100, Math.round(100 - workloadScore * .35 - totalPenalty * .45 + staffingScore * .3)));
  const readinessScore = Math.max(0, Math.min(100, Math.round((staffingScore * .45) + ((100 - workloadScore) * .25) + (completionForecast * .3))));

  const recommendations = risks.slice().sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]).map((risk) => risk.recommendedAction);
  if (!recommendations.length) recommendations.push('Maintain current assignments and reassess at mid-shift.');

  return {
    readinessScore,
    workloadScore,
    staffingScore,
    completionForecast,
    predictedBottlenecks: risks.filter((r) => ['High', 'Critical'].includes(r.severity)).length,
    uncoveredVeterans: uncoveredVeterans.length,
    overdueTreatments: overdueTreatments.length,
    atRiskTransports: atRiskTransports.length + missingTransport.length,
    risks,
    recommendations: [...new Set(recommendations)].slice(0, 6),
  };
}
