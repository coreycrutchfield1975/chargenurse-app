import type { BravoShiftState } from '../../types/domain';

export type TrendPoint = { label: string; value: number };
export type ExecutiveAnalytics = {
  census: number;
  hospitalCount: number;
  highFallRisk: number;
  isolationCount: number;
  appointmentCompletionRate: number;
  transportSuccessRate: number;
  treatmentCompletionRate: number;
  staffingFillRate: number;
  documentationRate: number;
  qualityScore: number;
  riskLevel: 'Stable' | 'Watch' | 'High Risk';
  alerts: string[];
  appointmentTrend: TrendPoint[];
  transportTrend: TrendPoint[];
  staffingTrend: TrendPoint[];
};

const pct = (done: number, total: number) => total === 0 ? 100 : Math.round((done / total) * 100);
const dayKey = (date: Date) => date.toISOString().slice(0, 10);

export function buildExecutiveAnalytics(state: BravoShiftState): ExecutiveAnalytics {
  const activeVeterans = state.veterans.filter((v) => v.status !== 'Discharged / Archived');
  const completedAppointments = state.appointments.filter((a) => a.status === 'Completed').length;
  const completedTransports = state.travelRequests.filter((t) => t.status === 'Completed').length;
  const failedTransports = state.travelRequests.filter((t) => t.status === 'Failed').length;
  const completedTreatments = state.treatments.filter((t) => Boolean(t.completedAt)).length;
  const staffed = state.staffAssignmentRecords.filter((s) => !['Called Off'].includes(s.status)).length;
  const expectedStaff = Math.max(state.staffAssignmentRecords.length, 1);
  const documented = state.morningReportNotes.filter((n) => n.text.trim().length > 0).length;

  const appointmentCompletionRate = pct(completedAppointments, state.appointments.length);
  const transportSuccessRate = pct(completedTransports, completedTransports + failedTransports);
  const treatmentCompletionRate = pct(completedTreatments, state.treatments.length);
  const staffingFillRate = pct(staffed, expectedStaff);
  const documentationRate = pct(documented, Math.max(state.morningReportNotes.length, 1));

  const qualityScore = Math.round(
    appointmentCompletionRate * .2 +
    transportSuccessRate * .2 +
    treatmentCompletionRate * .25 +
    staffingFillRate * .2 +
    documentationRate * .15
  );

  const alerts: string[] = [];
  const highFallRisk = activeVeterans.filter((v) => v.fallRisk === 'High').length;
  const isolationCount = activeVeterans.filter((v) => v.isolation.trim()).length;
  const hospitalCount = activeVeterans.filter((v) => v.status === 'Hospital').length;
  const calledOff = state.staffAssignmentRecords.filter((s) => s.status === 'Called Off').length;
  if (highFallRisk) alerts.push(`${highFallRisk} Veteran${highFallRisk === 1 ? '' : 's'} currently marked high fall risk.`);
  if (isolationCount) alerts.push(`${isolationCount} active isolation precaution${isolationCount === 1 ? '' : 's'} require monitoring.`);
  if (hospitalCount) alerts.push(`${hospitalCount} Veteran${hospitalCount === 1 ? '' : 's'} currently hospitalized.`);
  if (failedTransports) alerts.push(`${failedTransports} failed transport request${failedTransports === 1 ? '' : 's'} need review.`);
  if (calledOff) alerts.push(`${calledOff} staff call-off${calledOff === 1 ? '' : 's'} may affect coverage.`);
  if (treatmentCompletionRate < 90) alerts.push(`Treatment completion is ${treatmentCompletionRate}%, below the 90% target.`);
  if (!alerts.length) alerts.push('No high-priority operational quality alerts detected.');

  const days = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - index)); return d;
  });
  const appointmentTrend = days.map((d) => ({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), value: state.appointments.filter((a) => a.date === dayKey(d)).length }));
  const transportTrend = days.map((d) => ({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), value: state.travelRequests.filter((t) => t.createdAt.slice(0, 10) === dayKey(d)).length }));
  const staffingTrend = days.map((d) => ({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), value: state.staffAssignmentRecords.filter((s) => s.assignmentDate === dayKey(d) && s.status !== 'Called Off').length }));

  return {
    census: activeVeterans.length,
    hospitalCount,
    highFallRisk,
    isolationCount,
    appointmentCompletionRate,
    transportSuccessRate,
    treatmentCompletionRate,
    staffingFillRate,
    documentationRate,
    qualityScore,
    riskLevel: qualityScore >= 90 ? 'Stable' : qualityScore >= 75 ? 'Watch' : 'High Risk',
    alerts,
    appointmentTrend,
    transportTrend,
    staffingTrend,
  };
}
