import type { BravoShiftState } from '../../types/domain';
import { selectDashboardMetrics } from './dashboardSelectors';

interface DashboardProps {
  state: BravoShiftState;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function Dashboard({ state }: DashboardProps) {
  const metrics = selectDashboardMetrics(state, todayIso());
  const cards = [
    ['Active Veterans', metrics.activeVeterans],
    ["Today's Appointments", metrics.appointmentsToday],
    ['Treatments Due', metrics.treatmentsDue],
    ['Priority Actions', metrics.priorityActions],
    ['Off Unit', metrics.offUnit],
    ['New Admissions', metrics.newAdmissions],
    ['Transport Follow-up', metrics.transportFollowUp],
    ['Completed Treatments', metrics.completedTreatments],
  ] as const;

  return (
    <section>
      <div className="greeting-card">
        <strong>Morning Brief Ready. Welcome to BravoShift.</strong>
        <span>Your command post is ready for review.</span>
      </div>

      <div className="metric-grid">
        {cards.map(([label, value]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="action-row">
        <button type="button">Add Veteran</button>
        <button type="button">Add Appointment</button>
        <button type="button">Assign Treatment</button>
        <button type="button">Shift Assignment</button>
        <button type="button">Morning Report</button>
      </div>

      <div className="panel-grid">
        <article className="panel">
          <h2>Priority Action Board</h2>
          <p>No production data is connected yet.</p>
        </article>
        <article className="panel">
          <h2>Today's Schedule</h2>
          <p>Appointments will appear here after migration.</p>
        </article>
        <article className="panel">
          <h2>Treatments Due Today</h2>
          <p>Treatment workflow will be migrated in a dedicated PR.</p>
        </article>
        <article className="panel">
          <h2>Unit Status</h2>
          <p>Veteran and shift status will appear here.</p>
        </article>
      </div>
    </section>
  );
}
