import { useMemo, useState } from 'react';
import type { Appointment, AppointmentStatus, ManagedLists, TravelRequestStatus, Veteran } from '../../types/domain';
import { AppointmentForm } from './AppointmentForm';

interface Props {
  veterans: Veteran[];
  appointments: Appointment[];
  onSave: (appointment: Appointment) => void;
  initialEdit?: Appointment;
  lists: ManagedLists;
}

export function AppointmentsPage({ veterans, appointments, onSave, initialEdit, lists }: Props) {
  const [editing, setEditing] = useState<Appointment | null | undefined>(initialEdit);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | ''>('');
  const [travel, setTravel] = useState<TravelRequestStatus | ''>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const veteranMap = useMemo(() => new Map(veterans.map((veteran) => [veteran.id, veteran])), [veterans]);
  const rows = useMemo(() => appointments.filter((appointment) => {
    const veteran = veteranMap.get(appointment.veteranId);
    const haystack = `${veteran?.name ?? ''} ${veteran?.last4 ?? ''} ${veteran?.room ?? ''} ${appointment.provider} ${appointment.destination} ${appointment.specialty}`.toLowerCase();
    return (!search || haystack.includes(search.toLowerCase())) &&
      (!status || appointment.status === status) &&
      (!travel || appointment.travelStatus === travel) &&
      (!from || appointment.date >= from) &&
      (!to || appointment.date <= to);
  }).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)), [appointments, from, search, status, to, travel, veteranMap]);

  if (editing !== undefined) {
    return <AppointmentForm appointment={editing ?? undefined} veterans={veterans} appointments={appointments} onSave={(value) => { onSave(value); setEditing(undefined); }} onCancel={() => setEditing(undefined)} lists={lists} />;
  }

  const today = new Date().toISOString().slice(0, 10);
  return (
    <section>
      <div className="page-heading">
        <div><h1>Appointments</h1><p>Schedule, find, update, and track every Veteran appointment.</p></div>
        <button className="primary-button" type="button" onClick={() => setEditing(null)}>Schedule Appointment</button>
      </div>
      <div className="summary-strip">
        <span><strong>{appointments.filter((a) => a.date === today && a.status !== 'Cancelled').length}</strong> today</span>
        <span><strong>{appointments.filter((a) => a.status === 'Upcoming').length}</strong> upcoming</span>
        <span><strong>{appointments.filter((a) => a.travelStatus === 'Draft' || a.travelStatus === 'Failed').length}</strong> travel follow-ups</span>
      </div>
      <div className="appointment-filters">
        <label>Search<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Veteran, room, provider, clinic..." /></label>
        <label>Status<select value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus | '')}><option value="">All</option><option>Upcoming</option><option>In Progress</option><option>Completed</option><option>Cancelled</option><option>No Show</option></select></label>
        <label>Travel Request<select value={travel} onChange={(e) => setTravel(e.target.value as TravelRequestStatus | '')}><option value="">All</option><option>Not Created</option><option>Draft</option><option>Confirmed</option><option>Failed</option><option>Cancelled</option></select></label>
        <label>From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button className="secondary-button filter-clear" type="button" onClick={() => { setSearch(''); setStatus(''); setTravel(''); setFrom(''); setTo(''); }}>Clear Filters</button>
      </div>
      <div className="table-wrap"><table className="record-table appointment-table"><thead><tr><th>Date / Time</th><th>Veteran</th><th>Destination</th><th>Provider</th><th>Transportation</th><th>Status</th><th>Travel</th><th></th></tr></thead><tbody>
        {rows.length ? rows.map((appointment) => { const veteran = veteranMap.get(appointment.veteranId); return <tr key={appointment.id}><td><strong>{appointment.date}</strong><small>{appointment.time}{appointment.pickupTime ? ` · Pickup ${appointment.pickupTime}` : ''}</small></td><td>Room {veteran?.room ?? '—'}<small>{veteran?.name ?? 'Unknown Veteran'} · {veteran?.last4 ?? ''}</small></td><td>{appointment.destination}<small>{appointment.reason || appointment.specialty}</small></td><td>{appointment.provider || '—'}</td><td>{appointment.transport || 'Not set'}</td><td><span className={`status-badge appointment-${appointment.status.toLowerCase().replaceAll(' ', '-')}`}>{appointment.status}</span></td><td><span className={`status-badge travel-${appointment.travelStatus.toLowerCase().replaceAll(' ', '-')}`}>{appointment.travelStatus}</span></td><td><button className="secondary-button compact-button" type="button" onClick={() => setEditing(appointment)}>Edit</button></td></tr>; }) : <tr><td className="empty-state" colSpan={8}>No appointments match the current filters.</td></tr>}
      </tbody></table></div>
    </section>
  );
}
