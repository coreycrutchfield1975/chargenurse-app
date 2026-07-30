import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { FallRisk, Veteran, VeteranStatus } from '../../types/domain';

interface VeteranFormProps {
  veteran?: Veteran;
  veterans: Veteran[];
  onSave: (veteran: Veteran) => void;
  onCancel: () => void;
}

type VeteranDraft = Omit<Veteran, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt'>;

const emptyDraft: VeteranDraft = {
  name: '',
  last4: '',
  room: '',
  status: 'Active',
  admissionDate: '',
  provider: '',
  specialty: '',
  codeStatus: '',
  mobility: '',
  fallRisk: '',
  medicationMethod: '',
  diet: '',
  isolation: '',
  assistLevel: '',
  toileting: '',
  notes: '',
};

function draftFromVeteran(veteran?: Veteran): VeteranDraft {
  if (!veteran) return emptyDraft;
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, archivedAt: _archivedAt, ...draft } = veteran;
  return draft;
}

export function VeteranForm({ veteran, veterans, onSave, onCancel }: VeteranFormProps) {
  const [draft, setDraft] = useState<VeteranDraft>(() => draftFromVeteran(veteran));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setDraft(draftFromVeteran(veteran));
    setSubmitted(false);
  }, [veteran]);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = 'Veteran name is required.';
    if (!/^\d{4}$/.test(draft.last4)) next.last4 = 'Last 4 must contain exactly four digits.';
    if (!draft.room.trim()) next.room = 'Room is required.';
    if (!draft.admissionDate) next.admissionDate = 'Admission date is required.';

    const roomConflict = veterans.some(
      (item) =>
        item.id !== veteran?.id &&
        item.status !== 'Discharged / Archived' &&
        item.room.trim().toLowerCase() === draft.room.trim().toLowerCase(),
    );
    if (roomConflict) next.room = 'This room is already assigned to an active Veteran.';
    return next;
  }, [draft, veteran?.id, veterans]);

  function update<K extends keyof VeteranDraft>(key: K, value: VeteranDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;

    const now = new Date().toISOString();
    onSave({
      ...draft,
      name: draft.name.trim(),
      last4: draft.last4.trim(),
      room: draft.room.trim(),
      provider: draft.provider.trim(),
      specialty: draft.specialty.trim(),
      codeStatus: draft.codeStatus.trim(),
      mobility: draft.mobility.trim(),
      medicationMethod: draft.medicationMethod.trim(),
      diet: draft.diet.trim(),
      isolation: draft.isolation.trim(),
      assistLevel: draft.assistLevel.trim(),
      toileting: draft.toileting.trim(),
      notes: draft.notes.trim(),
      id: veteran?.id ?? crypto.randomUUID(),
      createdAt: veteran?.createdAt ?? now,
      updatedAt: now,
      archivedAt: veteran?.archivedAt,
    });
  }

  const errorFor = (field: string) => submitted ? errors[field] : undefined;

  return (
    <form className="record-form" onSubmit={submit} noValidate>
      <div className="form-header">
        <div>
          <h2>{veteran ? 'Edit Veteran Master Record' : 'Add Veteran Master Record'}</h2>
          <p>Fields marked required must be completed before saving.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>
      </div>

      {submitted && Object.keys(errors).length > 0 && (
        <div className="form-alert" role="alert">Correct the highlighted fields before saving.</div>
      )}

      <div className="form-grid">
        <label>
          Veteran name <span aria-hidden="true">*</span>
          <input value={draft.name} onChange={(e) => update('name', e.target.value)} aria-invalid={Boolean(errorFor('name'))} />
          {errorFor('name') && <small className="field-error">{errorFor('name')}</small>}
        </label>
        <label>
          Last 4 <span aria-hidden="true">*</span>
          <input inputMode="numeric" maxLength={4} value={draft.last4} onChange={(e) => update('last4', e.target.value.replace(/\D/g, '').slice(0, 4))} aria-invalid={Boolean(errorFor('last4'))} />
          {errorFor('last4') && <small className="field-error">{errorFor('last4')}</small>}
        </label>
        <label>
          Room <span aria-hidden="true">*</span>
          <input value={draft.room} onChange={(e) => update('room', e.target.value)} aria-invalid={Boolean(errorFor('room'))} />
          {errorFor('room') && <small className="field-error">{errorFor('room')}</small>}
        </label>
        <label>
          Admission date <span aria-hidden="true">*</span>
          <input type="date" value={draft.admissionDate} onChange={(e) => update('admissionDate', e.target.value)} aria-invalid={Boolean(errorFor('admissionDate'))} />
          {errorFor('admissionDate') && <small className="field-error">{errorFor('admissionDate')}</small>}
        </label>

        <label>
          Record status
          <select value={draft.status} onChange={(e) => update('status', e.target.value as VeteranStatus)}>
            <option>Active</option><option>At Appointment</option><option>Leave of Absence</option><option>Hospital</option><option>Discharged / Archived</option>
          </select>
        </label>
        <label>Provider<input value={draft.provider} onChange={(e) => update('provider', e.target.value)} /></label>
        <label>Specialty<input value={draft.specialty} onChange={(e) => update('specialty', e.target.value)} /></label>
        <label>Code status<input value={draft.codeStatus} onChange={(e) => update('codeStatus', e.target.value)} /></label>

        <label>Mobility<input value={draft.mobility} onChange={(e) => update('mobility', e.target.value)} /></label>
        <label>
          Fall risk
          <select value={draft.fallRisk} onChange={(e) => update('fallRisk', e.target.value as FallRisk)}>
            <option value="">Not entered</option><option>Low</option><option>Moderate</option><option>High</option>
          </select>
        </label>
        <label>Medication method<input value={draft.medicationMethod} onChange={(e) => update('medicationMethod', e.target.value)} /></label>
        <label>Diet<input value={draft.diet} onChange={(e) => update('diet', e.target.value)} /></label>

        <label>Isolation<input value={draft.isolation} onChange={(e) => update('isolation', e.target.value)} /></label>
        <label>Assist level<input value={draft.assistLevel} onChange={(e) => update('assistLevel', e.target.value)} /></label>
        <label>Toileting<input value={draft.toileting} onChange={(e) => update('toileting', e.target.value)} /></label>
        <label className="full-width">Clinical/shift notes<textarea value={draft.notes} onChange={(e) => update('notes', e.target.value)} rows={4} /></label>
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">Save Veteran Record</button>
        <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
