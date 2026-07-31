import { useMemo, useState } from 'react';
import type { Appointment, Veteran } from '../../types/domain';

interface Props { appointments: Appointment[]; veterans: Veteran[]; onEdit: (appointment: Appointment) => void; }

function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; }
function isoDate(date: Date) { return `${monthKey(date)}-${String(date.getDate()).padStart(2, '0')}`; }

export function CalendarPage({ appointments, veterans, onEdit }: Props) {
  const [cursor, setCursor] = useState(() => new Date());
  const veteranMap = useMemo(() => new Map(veterans.map((v) => [v.id, v])), [veterans]);
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = new Date(first);
  gridStart.setDate(1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, index) => { const value = new Date(gridStart); value.setDate(gridStart.getDate() + index); return value; });
  const byDate = useMemo(() => appointments.reduce<Record<string, Appointment[]>>((map, appointment) => { (map[appointment.date] ??= []).push(appointment); return map; }, {}), [appointments]);

  function moveMonth(delta: number) { setCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1)); }

  return <section>
    <div className="page-heading"><div><h1>Appointment Calendar</h1><p>Monthly operational view linked to the Veteran Master Record.</p></div></div>
    <div className="calendar-toolbar"><button className="secondary-button" onClick={() => moveMonth(-1)}>Previous</button><strong>{cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong><button className="secondary-button" onClick={() => moveMonth(1)}>Next</button><button className="secondary-button" onClick={() => setCursor(new Date())}>Today</button></div>
    <div className="calendar-grid calendar-head">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => <div key={day}>{day}</div>)}</div>
    <div className="calendar-grid">
      {days.map((day) => { const key = isoDate(day); const events = (byDate[key] ?? []).sort((a,b) => a.time.localeCompare(b.time)); const muted = monthKey(day) !== monthKey(cursor); return <div className={`calendar-day ${muted ? 'muted-calendar-day' : ''}`} key={key}><strong>{day.getDate()}</strong>{events.map((appointment) => { const veteran = veteranMap.get(appointment.veteranId); return <button type="button" className="calendar-event" key={appointment.id} onClick={() => onEdit(appointment)}><span>{appointment.time} · Rm {veteran?.room ?? '—'}</span><small>{veteran?.name ?? 'Unknown'} — {appointment.destination}</small></button>; })}</div>; })}
    </div>
  </section>;
}
