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
import { loadState, saveState } from './lib/storage';
import type { Appointment, BravoShiftState, MorningReportNote, NotificationRecord, ShiftBroadcast, StaffAssignmentRecord, StaffMessage, TaskReminder, TravelRequest, Veteran } from './types/domain';

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
  function upsertTravelRequest(request: TravelRequest) { setState((current) => ({ ...current, travelRequests: current.travelRequests.some((item) => item.id === request.id) ? current.travelRequests.map((item) => item.id === request.id ? request : item) : [...current.travelRequests, request] })); }
  function upsertStaffAssignment(record: StaffAssignmentRecord) { setState((current) => ({ ...current, staffAssignmentRecords: current.staffAssignmentRecords.some((item) => item.id === record.id) ? current.staffAssignmentRecords.map((item) => item.id === record.id ? record : item) : [...current.staffAssignmentRecords, record] })); }
  function removeStaffAssignment(id: string) { setState((current) => ({ ...current, staffAssignmentRecords: current.staffAssignmentRecords.filter((item) => item.id !== id) })); }
  function upsertMorningNote(note: MorningReportNote) { setState((current) => ({ ...current, morningReportNotes: current.morningReportNotes.some((item) => item.id === note.id) ? current.morningReportNotes.map((item) => item.id === note.id ? note : item) : [...current.morningReportNotes, note] })); }
  function removeMorningNote(id: string) { setState((current) => ({ ...current, morningReportNotes: current.morningReportNotes.filter((item) => item.id !== id) })); }
  function upsertNotification(item: NotificationRecord) { setState(current => ({...current, notifications: current.notifications.some(x=>x.id===item.id)?current.notifications.map(x=>x.id===item.id?item:x):[...current.notifications,item]})); }
  function upsertMessage(item: StaffMessage) { setState(current => ({...current, messages: current.messages.some(x=>x.id===item.id)?current.messages.map(x=>x.id===item.id?item:x):[...current.messages,item]})); }
  function upsertBroadcast(item: ShiftBroadcast) { setState(current => ({...current, broadcasts: current.broadcasts.some(x=>x.id===item.id)?current.broadcasts.map(x=>x.id===item.id?item:x):[...current.broadcasts,item]})); }
  function upsertReminder(item: TaskReminder) { setState(current => ({...current, reminders: current.reminders.some(x=>x.id===item.id)?current.reminders.map(x=>x.id===item.id?item:x):[...current.reminders,item]})); }
  function upsertAppointment(appointment: Appointment) { setState((current) => ({ ...current, appointments: current.appointments.some((item) => item.id === appointment.id) ? current.appointments.map((item) => item.id === appointment.id ? appointment : item) : [...current.appointments, appointment] })); setCalendarEdit(undefined); }

  let content;
  if (activePage === 'dashboard') content = <Dashboard state={state} onAddVeteran={() => setActivePage('veterans')} />;
  else if (activePage === 'veterans') content = <VeteranMasterRecord veterans={state.veterans} onSave={upsertVeteran} onArchive={archiveVeteran} onRestore={restoreVeteran} />;
  else if (activePage === 'appointments') content = <AppointmentsPage veterans={state.veterans} appointments={state.appointments} onSave={upsertAppointment} initialEdit={calendarEdit} />;
  else if (activePage === 'calendar') content = <CalendarPage veterans={state.veterans} appointments={state.appointments} onEdit={(appointment) => { setCalendarEdit(appointment); setActivePage('appointments'); }} />;
  else if (activePage === 'transport') content = <TransportPage veterans={state.veterans} appointments={state.appointments} travelRequests={state.travelRequests} onSave={upsertTravelRequest} />;
  else if (activePage === 'staff') content = <StaffAssignmentsPage veterans={state.veterans} assignments={state.staffAssignmentRecords} onSave={upsertStaffAssignment} onRemove={removeStaffAssignment} />;
  else if (activePage === 'morning-report') content = <MorningReportPage state={state} notes={state.morningReportNotes} onSaveNote={upsertMorningNote} onRemoveNote={removeMorningNote} />;
  else if (activePage === 'shift-intelligence') content = <ShiftIntelligencePage state={state} />;
  else if (activePage === 'analytics') content = <ExecutiveAnalyticsPage state={state} />;
  else content = <CommunicationHubPage veterans={state.veterans} notifications={state.notifications} messages={state.messages} broadcasts={state.broadcasts} reminders={state.reminders} onSaveNotification={upsertNotification} onSaveMessage={upsertMessage} onSaveBroadcast={upsertBroadcast} onSaveReminder={upsertReminder} />;

  return <AppShell activePage={activePage} onNavigate={(page) => { setCalendarEdit(undefined); setActivePage(page); }}>{content}</AppShell>;
}
