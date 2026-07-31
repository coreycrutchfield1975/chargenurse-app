import { useEffect, useState } from 'react';
import { AppShell, type AppPage } from './components/AppShell';
import { AppointmentsPage } from './features/appointments/AppointmentsPage';
import { CalendarPage } from './features/appointments/CalendarPage';
import { Dashboard } from './features/dashboard/Dashboard';
import { TransportPage } from './features/transport/TransportPage';
import { VeteranMasterRecord } from './features/veterans/VeteranMasterRecord';
import { loadState, saveState } from './lib/storage';
import type { Appointment, BravoShiftState, TravelRequest, Veteran } from './types/domain';

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
  function upsertAppointment(appointment: Appointment) { setState((current) => ({ ...current, appointments: current.appointments.some((item) => item.id === appointment.id) ? current.appointments.map((item) => item.id === appointment.id ? appointment : item) : [...current.appointments, appointment] })); setCalendarEdit(undefined); }

  let content;
  if (activePage === 'dashboard') content = <Dashboard state={state} onAddVeteran={() => setActivePage('veterans')} />;
  else if (activePage === 'veterans') content = <VeteranMasterRecord veterans={state.veterans} onSave={upsertVeteran} onArchive={archiveVeteran} onRestore={restoreVeteran} />;
  else if (activePage === 'appointments') content = <AppointmentsPage veterans={state.veterans} appointments={state.appointments} onSave={upsertAppointment} initialEdit={calendarEdit} />;
  else if (activePage === 'calendar') content = <CalendarPage veterans={state.veterans} appointments={state.appointments} onEdit={(appointment) => { setCalendarEdit(appointment); setActivePage('appointments'); }} />;
  else content = <TransportPage veterans={state.veterans} appointments={state.appointments} travelRequests={state.travelRequests} onSave={upsertTravelRequest} />;

  return <AppShell activePage={activePage} onNavigate={(page) => { setCalendarEdit(undefined); setActivePage(page); }}>{content}</AppShell>;
}
