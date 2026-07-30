import type { BravoShiftState } from '../../types/domain';

export function selectDashboardMetrics(state: BravoShiftState, date: string) {
  const activeVeterans = state.veterans.filter(
    (veteran) => veteran.status !== 'Discharged / Archived',
  );
  const appointmentsToday = state.appointments.filter(
    (appointment) => appointment.date === date && appointment.status !== 'Cancelled',
  );
  const treatmentsDue = state.treatments.filter(
    (treatment) =>
      treatment.active && treatment.dueDate === date && !treatment.completedAt,
  );
  const completedTreatments = state.treatments.filter(
    (treatment) => treatment.dueDate === date && Boolean(treatment.completedAt),
  );
  const offUnit = activeVeterans.filter((veteran) =>
    ['At Appointment', 'Leave of Absence', 'Hospital'].includes(veteran.status),
  );

  return {
    activeVeterans: activeVeterans.length,
    appointmentsToday: appointmentsToday.length,
    treatmentsDue: treatmentsDue.length,
    priorityActions: treatmentsDue.length,
    offUnit: offUnit.length,
    newAdmissions: activeVeterans.filter((veteran) => veteran.admissionDate === date).length,
    transportFollowUp: appointmentsToday.filter(
      (appointment) => appointment.transport && !appointment.pickupTime,
    ).length,
    completedTreatments: completedTreatments.length,
  };
}
