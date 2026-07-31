import { useEffect, useMemo, useState } from 'react';
import type { ScheduledDay, Treatment, Veteran, ManagedLists } from '../../types/domain';
import { localDateKey } from './treatmentSelectors';

interface Props {
  veterans: Veteran[];
  treatment?: Treatment;
  onSave: (treatment: Treatment) => void;
  onCancel: () => void;
  lists: ManagedLists;
}

const DAYS: ScheduledDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function blankTreatment(): Treatment {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), veteranId: '', name: '', category: 'Licensed', frequency: 'Daily', shift: 'Day', startDate: localDateKey(), endDate: '', scheduledDays: [], instructions: '', notes: '', active: true, createdAt: now, updatedAt: now };
}

export function TreatmentForm({ veterans, treatment, onSave, onCancel, lists }: Props) {
  const [draft, setDraft] = useState<Treatment>(() => treatment ? { ...treatment } : blankTreatment());
  const [error, setError] = useState('');
  useEffect(() => setDraft(treatment ? { ...treatment } : blankTreatment()), [treatment]);
  const activeVeterans = useMemo(() => veterans.filter(v => v.status !== 'Discharged / Archived'), [veterans]);
  const needsDays = draft.frequency === 'Weekly' || draft.frequency === 'As Scheduled';
  function set<K extends keyof Treatment>(key: K, value: Treatment[K]) { setDraft(current => ({ ...current, [key]: value })); }
  function toggleDay(day: ScheduledDay) { set('scheduledDays', draft.scheduledDays.includes(day) ? draft.scheduledDays.filter(item => item !== day) : [...draft.scheduledDays, day]); }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.veteranId || !draft.name.trim()) return setError('Veteran and treatment name are required.');
    if (draft.endDate && draft.endDate < draft.startDate) return setError('End date cannot be before start date.');
    if (needsDays && draft.scheduledDays.length === 0) return setError('Select at least one scheduled day.');
    onSave({ ...draft, name: draft.name.trim(), instructions: draft.instructions.trim(), notes: draft.notes.trim(), updatedAt: new Date().toISOString() });
  }
  return <form className="record-form treatment-form" onSubmit={submit}>
    <div className="form-header"><div><h2>{treatment ? 'Edit Treatment' : 'Assign Treatment'}</h2><p>Schedule licensed and non-licensed treatment work.</p></div><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button></div>
    {error && <div className="form-alert">{error}</div>}
    <div className="form-grid">
      <label>Veteran *<select value={draft.veteranId} onChange={e=>set('veteranId',e.target.value)}><option value="">Select Veteran</option>{activeVeterans.map(v=><option key={v.id} value={v.id}>Room {v.room} — {v.name}</option>)}</select></label>
      <label>Treatment *<select value={draft.name} onChange={e=>set('name',e.target.value)}><option value="">Select…</option>{lists.treatmentTypes.map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Category<select value={draft.category} onChange={e=>set('category',e.target.value as Treatment['category'])}><option>Licensed</option><option>Non-Licensed</option></select></label>
      <label>Frequency<select value={draft.frequency} onChange={e=>set('frequency',e.target.value as Treatment['frequency'])}><option>Daily</option><option>Weekly</option><option>As Scheduled</option><option>PRN</option></select></label>
      <label>Shift Assignment<select value={draft.shift} onChange={e=>set('shift',e.target.value as Treatment['shift'])}><option>Day</option><option>Night</option><option>Both</option></select></label>
      <label>Start Date<input type="date" value={draft.startDate} onChange={e=>set('startDate',e.target.value)} /></label>
      <label>End Date<input type="date" value={draft.endDate} onChange={e=>set('endDate',e.target.value)} /></label>
      <div className="full-width"><span className="field-label">Scheduled Days {needsDays ? '*' : ''}</span><div className="day-selector">{DAYS.map(day=><label key={day} className={draft.scheduledDays.includes(day)?'selected':''}><input type="checkbox" checked={draft.scheduledDays.includes(day)} disabled={!needsDays} onChange={()=>toggleDay(day)} />{day.slice(0,3)}</label>)}</div></div>
      <label className="full-width">Instructions<textarea rows={3} value={draft.instructions} onChange={e=>set('instructions',e.target.value)} placeholder="Technique, supplies, parameters, notification instructions..." /></label>
      <label className="full-width">Notes<textarea rows={2} value={draft.notes} onChange={e=>set('notes',e.target.value)} /></label>
    </div>
    <div className="form-actions"><button className="primary-button" type="submit">Save Treatment</button></div>
  </form>;
}
