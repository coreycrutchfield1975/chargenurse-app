import { useEffect, useState } from 'react';
import { AppShell, type AppPage } from './components/AppShell';
import { AppointmentsPage } from './features/appointments/AppointmentsPage';
import { CalendarPage } from './features/appointments/CalendarPage';
import { Dashboard } from './features/dashboard/Dashboard';
import { TransportPage } from './features/transport/TransportPage';
import { StaffAssignmentsPage } from './features/staff/StaffAssignmentsPage';
import { VeteranMasterRecord } from './features/veterans/VeteranMasterRecord';
import { MorningReportPage } from './features/morning-report/MorningReportPage';
import { ShiftIntelligencePage } from './features/shift-intelligence/ShiftIntelligencePage';
import { ExecutiveAnalyticsPage } from './features/analytics/ExecutiveAnalyticsPage';
import { CommunicationHubPage } from './features/communications/CommunicationHubPage';
import { TreatmentsPage } from './features/treatments/TreatmentsPage';
import { AdministrationReportingPage } from './features/admin/AdministrationReportingPage';
import { loadState, saveState } from './lib/storage';
import type { Appointment, BravoShiftState, MorningReportNote, NotificationRecord, ShiftBroadcast, StaffAssignmentRecord, StaffMessage, TaskReminder, Treatment, TreatmentCompletion, TravelRequest, Veteran } from './types/domain';

export default function App() {
  const [state, setState] = useState<BravoShiftState>(() => loadState());
  const [activePage, setActivePage] = useState<AppPage>('dashboard');
  const [calendarEdit, setCalendarEdit] = useState<Appointment | undefined>();

  useEffect(() => { saveState(state); }, [state]);

  function upsertVeteran(veteran: Veteran) {
    setState((current) => ({ ...current, veterans: current.veterans.some((item) => item.id === veteran.id) ? current.veterans.map((item) => item.id === veteran.id ? veteran : item) : [...current.veterans, veteran] }));
  }
  function archiveVeteran(id: string) { const timestamp = new Date().toISOString(); setState((current) => ({ ...current, veterans: current.veterans.map((veteran) => veteran.id === id ? { ...veteran, status: 'Discharged / Archived', archivedAt: timestamp, updatedAt: timestamp } : veteran) })); }
  function restoreVeteran(id: string) { const timestamp = new Date().toISOString(); setState((current) => ({ ...current, veterans: current.veterans.map((veteran) => veteran.id === id ? { ...veteran, status: 'Active', archivedAt: undefined, updatedAt: timestamp } : veteran) })); }
  function upsertTreatment(treatment: Treatment) { setState(current => ({ ...current, treatments: current.treatments.some(item => item.id === treatment.id) ? current.treatments.map(item => item.id === treatment.id ? treatment : item) : [...current.treatments, treatment] })); }
  function archiveTreatment(id: string) { const now = new Date().toISOString(); setState(current => ({ ...current, treatments: current.treatments.map(item => item.id === id ? { ...item, active: false, archivedAt: now, updatedAt: now } : item) })); }
  function restoreTreatment(id: string) { const now = new Date().toISOString(); setState(current => ({ ...current, treatments: current.treatments.map(item => item.id === id ? { ...item, active: true, archivedAt: undefined, updatedAt: now } : item) })); }
  function toggleTreatmentComplete(treatment: Treatment, date: string, shift: 'Day' | 'Night', completedBy: string) { setState(current => { const existing = current.treatmentCompletions.find(item => item.treatmentId === treatment.id && item.completionDate === date && item.shift === shift); if (existing) return { ...current, treatmentCompletions: current.treatmentCompletions.filter(item => item.id !== existing.id) }; const completion: TreatmentCompletion = { id: crypto.randomUUID(), treatmentId: treatment.id, completionDate: date, shift, completedAt: new Date().toISOString(), completedBy: completedBy.trim() }; return { ...current, treatmentCompletions: [...current.treatmentCompletions, completion] }; }); }
  function upsertTravelRequest(request: TravelRequest) { setState((current) => ({ ...current, travelRequests: current.travelRequests.some((item) => item.id === request.id) ? current.travelRequests.map((item) => item.id === request.id ? request : item) : [...current.travelRequests, request] })); }
  function upsertStaffAssignment(record: StaffAssignmentRecord) { setState((current) => ({ ...current, staffAssignmentRecords: current.staffAssignmentRecords.some((item) => item.id === record.id) ? current.staffAssignmentRecords.map((item) => item.id === record.id ? record : item) : [...current.staffAssignmentRecords, record] })); }
  function removeStaffAssignment(id: string) { setState((current) => ({ ...current, staffAssignmentRecords: current.staffAssignmentRecords.filter((item) => item.id !== id) })); }
  function upsertMorningNote(note: MorningReportNote) { setState((current) => ({ ...current, morningReportNotes: current.morningReportNotes.some((item) => item.id === note.id) ? current.morningReportNotes.map((item) => item.id === note.id ? note : item) : [...current.morningReportNotes, note] })); }
  function removeMorningNote(id: string) { setState((current) => ({ ...current, morningReportNotes: current.morningReportNotes.filter((item) => item.id !== id) })); }
  function upsertNotification(item: NotificationRecord) { setState(current => ({...current, notifications: current.notifications.some(x=>x.id===item.id)?current.notifications.map(x=>x.id===item.id?item:x):[...current.notifications,item]})); }
  function upsertMessage(item: StaffMessage) { setState(current => ({...current, messages: current.messages.some(x=>x.id===item.id)?current.messages.map(x=>x.id===item.id?item:x):[...current.messages,item]})); }
  function upsertBroadcast(item: ShiftBroadcast) { setState(current => ({...current, broadcasts: current.broadcasts.some(x=>x.id===item.id)?current.broadcasts.map(x=>x.id===item.id?item:x):[...current.broadcasts,item]})); }
  function upsertReminder(item: TaskReminder) { setState(current => ({...current, reminders: current.reminders.some(x=>x.id===item.id)?current.reminders.map(x=>x.id===item.id?item:x):[...current.reminders,item]})); }
  function replaceState(nextState: BravoShiftState) { setState(nextState); }
  function deleteVeteranPermanently(id: string) { setState((current) => ({ ...current, veterans: current.veterans.filter((veteran) => veteran.id !== id) })); }
  function upsertAppointment(appointment: Appointment) { setState((current) => ({ ...current, appointments: current.appointments.some((item) => item.id === appointment.id) ? current.appointments.map((item) => item.id === appointment.id ? appointment : item) : [...current.appointments, appointment] })); setCalendarEdit(undefined); }

  let content;
  if (activePage === 'dashboard') content = <Dashboard state={state} onAddVeteran={() => setActivePage('veterans')} />;
  else if (activePage === 'veterans') content = <VeteranMasterRecord veterans={state.veterans} onSave={upsertVeteran} onArchive={archiveVeteran} onRestore={restoreVeteran} />;
  else if (activePage === 'appointments') content = <AppointmentsPage veterans={state.veterans} appointments={state.appointments} onSave={upsertAppointment} initialEdit={calendarEdit} />;
  else if (activePage === 'calendar') content = <CalendarPage veterans={state.veterans} appointments={state.appointments} onEdit={(appointment) => { setCalendarEdit(appointment); setActivePage('appointments'); }} />;
  else if (activePage === 'treatments') content = <TreatmentsPage veterans={state.veterans} treatments={state.treatments} completions={state.treatmentCompletions} onSave={upsertTreatment} onArchive={archiveTreatment} onRestore={restoreTreatment} onToggleComplete={toggleTreatmentComplete} />;
  else if (activePage === 'transport') content = <TransportPage veterans={state.veterans} appointments={state.appointments} travelRequests={state.travelRequests} onSave={upsertTravelRequest} />;
  else if (activePage === 'staff') content = <StaffAssignmentsPage veterans={state.veterans} assignments={state.staffAssignmentRecords} onSave={upsertStaffAssignment} onRemove={removeStaffAssignment} />;
  else if (activePage === 'morning-report') content = <MorningReportPage state={state} notes={state.morningReportNotes} onSaveNote={upsertMorningNote} onRemoveNote={removeMorningNote} />;
  else if (activePage === 'shift-intelligence') content = <ShiftIntelligencePage state={state} />;
  else if (activePage === 'analytics') content = <ExecutiveAnalyticsPage state={state} />;
  else if (activePage === 'communications') content = <CommunicationHubPage veterans={state.veterans} notifications={state.notifications} messages={state.messages} broadcasts={state.broadcasts} reminders={state.reminders} onSaveNotification={upsertNotification} onSaveMessage={upsertMessage} onSaveBroadcast={upsertBroadcast} onSaveReminder={upsertReminder} />;
  else content = <AdministrationReportingPage state={state} onReplaceState={replaceState} onRestoreVeteran={restoreVeteran} onDeleteVeteran={deleteVeteranPermanently} />;

  return <AppShell activePage={activePage} onNavigate={(page) => { setCalendarEdit(undefined); setActivePage(page); }}>{content}</AppShell>;
}
