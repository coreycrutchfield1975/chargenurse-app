import { useMemo, useState } from 'react';
import type { BravoShiftState, MorningReportNote } from '../../types/domain';

type Props = {
  state: BravoShiftState;
  notes: MorningReportNote[];
  onSaveNote: (note: MorningReportNote) => void;
  onRemoveNote: (id: string) => void;
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const activeTransport = new Set(['Pending', 'Confirmed', 'En Route', 'At Destination', 'Awaiting Return']);

function pct(value: number) { return Math.max(0, Math.min(100, Math.round(value))); }

export function MorningReportPage({ state, notes, onSaveNote, onRemoveNote }: Props) {
  const [reportDate, setReportDate] = useState(todayKey());
  const [shift, setShift] = useState<'Day' | 'Evening' | 'Night'>('Day');
  const [category, setCategory] = useState<MorningReportNote['category']>('Clinical');
  const [priority, setPriority] = useState<MorningReportNote['priority']>('Routine');
  const [text, setText] = useState('');

  const report = useMemo(() => {
    const activeVeterans = state.veterans.filter(v => v.status !== 'Discharged / Archived');
    const appointments = state.appointments.filter(a => a.date === reportDate && !['Cancelled', 'No Show'].includes(a.status));
    const transports = state.travelRequests.filter(t => {
      const appt = state.appointments.find(a => a.id === t.appointmentId);
      return appt?.date === reportDate || activeTransport.has(t.status);
    });
    const staff = state.staffAssignmentRecords.filter(s => s.assignmentDate === reportDate && s.shift === shift);
    const presentStaff = staff.filter(s => !['Called Off', 'Completed'].includes(s.status));
    const callOffs = staff.filter(s => s.status === 'Called Off');
    const hasCharge = presentStaff.some(s => s.isChargeNurse || s.role === 'Charge Nurse');
    const covered = new Set(presentStaff.flatMap(s => s.veteranIds));
    const uncovered = activeVeterans.filter(v => !covered.has(v.id));
    const pendingTransport = transports.filter(t => ['Draft', 'Pending', 'Failed'].includes(t.status));
    const offUnit = state.veterans.filter(v => ['At Appointment', 'Hospital', 'Leave of Absence'].includes(v.status));
    const dueTreatments = state.treatments.filter(t => t.active && t.dueDate === reportDate && !t.completedAt);
    const completedTreatments = state.treatments.filter(t => t.dueDate === reportDate && Boolean(t.completedAt));
    const reportNotes = notes.filter(n => n.reportDate === reportDate && n.shift === shift);
    const criticalNotes = reportNotes.filter(n => n.priority === 'Critical');
    const urgentNotes = reportNotes.filter(n => n.priority === 'Urgent');

    const staffingScore = pct(100 - callOffs.length * 18 - uncovered.length * 5 - (hasCharge ? 0 : 30));
    const transportScore = pct(100 - pendingTransport.length * 15);
    const clinicalScore = pct(100 - dueTreatments.length * 6 - criticalNotes.length * 20 - urgentNotes.length * 8);
    const documentationScore = pct(reportNotes.length ? 100 : 75);
    const readiness = pct((staffingScore + transportScore + clinicalScore + documentationScore) / 4);

    const priorities: string[] = [];
    if (!hasCharge) priorities.push('No charge nurse is assigned for this shift.');
    if (uncovered.length) priorities.push(`${uncovered.length} active Veteran${uncovered.length === 1 ? '' : 's'} lack a staff assignment.`);
    if (pendingTransport.length) priorities.push(`${pendingTransport.length} transportation request${pendingTransport.length === 1 ? '' : 's'} require follow-up.`);
    if (dueTreatments.length) priorities.push(`${dueTreatments.length} treatment${dueTreatments.length === 1 ? '' : 's'} remain due.`);
    if (criticalNotes.length) priorities.push(`${criticalNotes.length} critical handoff note${criticalNotes.length === 1 ? '' : 's'} require immediate review.`);
    if (!priorities.length) priorities.push('No immediate operational exceptions identified.');

    return { activeVeterans, appointments, transports, staff, presentStaff, callOffs, hasCharge, uncovered, pendingTransport, offUnit, dueTreatments, completedTreatments, reportNotes, criticalNotes, urgentNotes, staffingScore, transportScore, clinicalScore, documentationScore, readiness, priorities };
  }, [state, notes, reportDate, shift]);

  function addNote() {
    if (!text.trim()) return;
    const now = new Date().toISOString();
    onSaveNote({ id: crypto.randomUUID(), reportDate, shift, category, priority, text: text.trim(), createdAt: now, updatedAt: now });
    setText('');
  }

  return <section className="feature-page morning-report">
    <div className="page-heading no-print">
      <div><p className="eyebrow">Module 2.6</p><h2>Morning Report Intelligence</h2><p>Automated operational briefing assembled from the current BravoShift record.</p></div>
      <button className="primary" onClick={() => window.print()}>Print Report</button>
    </div>

    <div className="report-controls no-print">
      <label>Report date<input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} /></label>
      <label>Shift<select value={shift} onChange={e => setShift(e.target.value as typeof shift)}><option>Day</option><option>Evening</option><option>Night</option></select></label>
    </div>

    <article className="report-sheet">
      <header className="report-title"><div><strong>BRAVOSHIFT</strong><h2>{shift} Shift Morning Report</h2><p>{new Date(`${reportDate}T12:00:00`).toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p></div><div className={`readiness-score score-${report.readiness >= 85 ? 'good' : report.readiness >= 65 ? 'watch' : 'risk'}`}><span>Readiness</span><b>{report.readiness}%</b></div></header>

      <div className="report-metrics">
        <div><span>Active Census</span><b>{report.activeVeterans.length}</b></div><div><span>Appointments</span><b>{report.appointments.length}</b></div><div><span>Off Unit</span><b>{report.offUnit.length}</b></div><div><span>Staff Present</span><b>{report.presentStaff.length}</b></div><div><span>Call-Offs</span><b>{report.callOffs.length}</b></div><div><span>Transport Follow-up</span><b>{report.pendingTransport.length}</b></div>
      </div>

      <section className="report-section"><h3>Executive Summary</h3><p className="executive-summary">{report.readiness >= 85 ? 'Unit operations are ready with limited exceptions.' : report.readiness >= 65 ? 'Unit operations require targeted follow-up before peak workload.' : 'Immediate charge-nurse review is recommended before shift operations continue.'}</p><ul>{report.priorities.map(item => <li key={item}>{item}</li>)}</ul></section>

      <div className="report-grid">
        <section className="report-section"><h3>Clinical &amp; Census</h3><dl><div><dt>Treatments due</dt><dd>{report.dueTreatments.length}</dd></div><div><dt>Treatments completed</dt><dd>{report.completedTreatments.length}</dd></div><div><dt>Critical notes</dt><dd>{report.criticalNotes.length}</dd></div><div><dt>Urgent notes</dt><dd>{report.urgentNotes.length}</dd></div></dl></section>
        <section className="report-section"><h3>Staffing &amp; Coverage</h3><dl><div><dt>Charge nurse</dt><dd>{report.hasCharge ? 'Assigned' : 'Missing'}</dd></div><div><dt>Uncovered Veterans</dt><dd>{report.uncovered.length}</dd></div><div><dt>Scheduled staff</dt><dd>{report.staff.length}</dd></div><div><dt>Call-offs</dt><dd>{report.callOffs.length}</dd></div></dl></section>
        <section className="report-section"><h3>Appointments &amp; Transport</h3>{report.appointments.length ? <ul>{report.appointments.map(a => { const v=state.veterans.find(x=>x.id===a.veteranId); return <li key={a.id}><b>{a.time}</b> — {v?.room || '—'} {v?.name || 'Unknown'} · {a.destination || a.reason}</li>; })}</ul> : <p className="muted">No active appointments scheduled.</p>}</section>
        <section className="report-section"><h3>Readiness Components</h3><dl><div><dt>Clinical</dt><dd>{report.clinicalScore}%</dd></div><div><dt>Staffing</dt><dd>{report.staffingScore}%</dd></div><div><dt>Transportation</dt><dd>{report.transportScore}%</dd></div><div><dt>Documentation</dt><dd>{report.documentationScore}%</dd></div></dl></section>
      </div>

      <section className="report-section"><h3>Shift Handoff Notes</h3>{report.reportNotes.length ? <div className="handoff-list">{report.reportNotes.map(note => <article key={note.id} className={`handoff-note priority-${note.priority.toLowerCase()}`}><div><b>{note.category}</b><span>{note.priority}</span></div><p>{note.text}</p><button className="link-button no-print" onClick={() => onRemoveNote(note.id)}>Remove</button></article>)}</div> : <p className="muted">No handoff notes have been entered for this report.</p>}</section>

      <footer className="report-signatures"><span>Outgoing Charge Nurse: ____________________</span><span>Incoming Charge Nurse: ____________________</span><span>Review Time: __________</span></footer>
    </article>

    <section className="panel note-composer no-print"><h3>Add Shift Handoff Note</h3><div className="form-grid"><label>Category<select value={category} onChange={e=>setCategory(e.target.value as MorningReportNote['category'])}><option>Clinical</option><option>Staffing</option><option>Transport</option><option>Appointment</option><option>Family / Provider</option><option>Operations</option></select></label><label>Priority<select value={priority} onChange={e=>setPriority(e.target.value as MorningReportNote['priority'])}><option>Routine</option><option>Urgent</option><option>Critical</option></select></label><label className="span-2">Note<textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Enter a concrete item for the incoming shift..." /></label></div><button className="primary" onClick={addNote}>Add to Report</button></section>
  </section>;
}
