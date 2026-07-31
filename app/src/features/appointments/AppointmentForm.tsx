import { useMemo, useState } from 'react';
import type { Appointment, AppointmentStatus, TravelRequestStatus, Veteran, ManagedLists } from '../../types/domain';

interface AppointmentFormProps {
  appointment?: Appointment;
  veterans: Veteran[];
  appointments: Appointment[];
  onSave: (appointment: Appointment) => void;
  onCancel: () => void;
  lists: ManagedLists;
}

type Errors = Partial<Record<'veteranId' | 'date' | 'time' | 'destination' | 'duplicate', string>>;

function newAppointment(): Appointment {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    veteranId: '',
    date: '',
    time: '',
    pickupTime: '',
    reason: '',
    specialty: '',
    destination: '',
    provider: '',
    transport: '',
    travelStatus: 'Not Created',
    status: 'Upcoming',
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function AppointmentForm({ appointment, veterans, appointments, onSave, onCancel, lists }: AppointmentFormProps) {
  const [draft, setDraft] = useState<Appointment>(() => appointment ?? newAppointment());
  const [errors, setErrors] = useState<Errors>({});
  const activeVeterans = useMemo(
    () => veterans.filter((veteran) => veteran.status !== 'Discharged / Archived').sort((a, b) => a.room.localeCompare(b.room)),
    [veterans],
  );

  function update<K extends keyof Appointment>(key: K, value: Appointment[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!draft.veteranId) nextErrors.veteranId = 'Select a Veteran.';
    if (!draft.date) nextErrors.date = 'Appointment date is required.';
    if (!draft.time) nextErrors.time = 'Appointment time is required.';
    if (!draft.destination.trim()) nextErrors.destination = 'Destination or clinic is required.';

    const duplicate = appointments.some(
      (item) =>
        item.id !== draft.id &&
        item.veteranId === draft.veteranId &&
        item.date === draft.date &&
        item.time === draft.time &&
        item.status !== 'Cancelled',
    );
    if (duplicate) nextErrors.duplicate = 'This Veteran already has an active appointment at the same date and time.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...draft, updatedAt: new Date().toISOString() });
  }

  return (
    <form className="record-form" onSubmit={submit} noValidate>
      <div className="form-header">
        <div>
          <h2>{appointment ? 'Edit Appointment' : 'Schedule Appointment'}</h2>
          <p>Connect the appointment to a single Veteran Master Record.</p>
        </div>
      </div>

      {errors.duplicate && <div className="form-alert">{errors.duplicate}</div>}

      <div className="form-grid">
        <label className="full-width">
          Veteran
          <select value={draft.veteranId} onChange={(e) => update('veteranId', e.target.value)} aria-invalid={Boolean(errors.veteranId)}>
            <option value="">Select a Veteran</option>
            {activeVeterans.map((veteran) => <option key={veteran.id} value={veteran.id}>Room {veteran.room} — {veteran.name} ({veteran.last4})</option>)}
          </select>
          {errors.veteranId && <span className="field-error">{errors.veteranId}</span>}
        </label>
        <label>Date<input type="date" value={draft.date} onChange={(e) => update('date', e.target.value)} aria-invalid={Boolean(errors.date)} />{errors.date && <span className="field-error">{errors.date}</span>}</label>
        <label>Appointment Time<input type="time" value={draft.time} onChange={(e) => update('time', e.target.value)} aria-invalid={Boolean(errors.time)} />{errors.time && <span className="field-error">{errors.time}</span>}</label>
        <label>Pickup Time<input type="time" value={draft.pickupTime} onChange={(e) => update('pickupTime', e.target.value)} /></label>
        <label>Status<select value={draft.status} onChange={(e) => update('status', e.target.value as AppointmentStatus)}><option>Upcoming</option><option>In Progress</option><option>Completed</option><option>Cancelled</option><option>No Show</option></select></label>
        <label>Reason<select value={draft.reason} onChange={(e)=>update('reason',e.target.value)}><option value="">Select…</option>{lists.appointmentReasons.map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Specialty<select value={draft.specialty} onChange={(e)=>update('specialty',e.target.value)}><option value="">Select…</option>{lists.specialties.map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Provider<input value={draft.provider} onChange={(e) => update('provider', e.target.value)} /></label>
        <label>Destination / Clinic<select value={draft.destination} onChange={(e)=>update('destination',e.target.value)} aria-invalid={Boolean(errors.destination)}><option value="">Select…</option>{lists.facilities.map(v=><option key={v}>{v}</option>)}</select>{errors.destination&&<span className="field-error">{errors.destination}</span>}</label>
        <label>Transportation<select value={draft.transport} onChange={(e)=>update('transport',e.target.value)}><option value="">Select…</option>{lists.transportationModes.map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Travel Request<select value={draft.travelStatus} onChange={(e) => update('travelStatus', e.target.value as TravelRequestStatus)}><option>Not Created</option><option>Draft</option><option>Confirmed</option><option>Failed</option><option>Cancelled</option></select></label>
        <label className="full-width">Notes<textarea value={draft.notes} onChange={(e) => update('notes', e.target.value)} rows={3} /></label>
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">Save Appointment</button>
        <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
