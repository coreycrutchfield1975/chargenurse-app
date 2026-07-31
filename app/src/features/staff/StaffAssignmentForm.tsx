import { useMemo, useState } from 'react';
import type { StaffAssignmentRecord, StaffRole, StaffShift, Veteran } from '../../types/domain';

interface Props { veterans: Veteran[]; initial?: StaffAssignmentRecord; onSave: (record: StaffAssignmentRecord) => void; onCancel: () => void; }
const roles: StaffRole[] = ['Charge Nurse','RN','LPN','CNA','Unit Clerk','Other'];
const shifts: StaffShift[] = ['Day','Evening','Night'];

export function StaffAssignmentForm({ veterans, initial, onSave, onCancel }: Props) {
  const today = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState<StaffAssignmentRecord>(() => initial ?? {
    id: crypto.randomUUID(), staffName:'', role:'CNA', shift:'Day', assignmentDate:today, status:'Scheduled', zone:'', veteranIds:[], treatmentCategories:['Non-licensed'], isChargeNurse:false, startTime:'07:00', endTime:'15:30', phoneExtension:'', notes:'', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()
  });
  const activeVeterans = useMemo(() => veterans.filter(v => v.status !== 'Discharged / Archived'), [veterans]);
  const [error, setError] = useState('');
  const update = <K extends keyof StaffAssignmentRecord>(key:K,value:StaffAssignmentRecord[K]) => setForm(v => ({...v,[key]:value}));
  const toggleVeteran = (id:string) => update('veteranIds', form.veteranIds.includes(id) ? form.veteranIds.filter(v=>v!==id) : [...form.veteranIds,id]);
  function submit(e:React.FormEvent){ e.preventDefault(); if(!form.staffName.trim() || !form.assignmentDate){ setError('Staff name and assignment date are required.'); return; } if(form.isChargeNurse && form.role !== 'Charge Nurse' && form.role !== 'RN'){ setError('Charge nurse coverage must be assigned to an RN or Charge Nurse role.'); return; } onSave({...form,updatedAt:new Date().toISOString()}); }
  return <form className="panel staff-form" onSubmit={submit}>
    <div className="section-heading"><div><p className="eyebrow">Shift coverage</p><h2>{initial?'Edit assignment':'Add staff assignment'}</h2></div><button type="button" className="secondary" onClick={onCancel}>Cancel</button></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="form-grid">
      <label>Staff name<input value={form.staffName} onChange={e=>update('staffName',e.target.value)} /></label>
      <label>Role<select value={form.role} onChange={e=>update('role',e.target.value as StaffRole)}>{roles.map(r=><option key={r}>{r}</option>)}</select></label>
      <label>Shift<select value={form.shift} onChange={e=>update('shift',e.target.value as StaffShift)}>{shifts.map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Date<input type="date" value={form.assignmentDate} onChange={e=>update('assignmentDate',e.target.value)} /></label>
      <label>Status<select value={form.status} onChange={e=>update('status',e.target.value as StaffAssignmentRecord['status'])}>{['Scheduled','Present','Break','Off Unit','Called Off','Completed'].map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Zone / hall<input value={form.zone} onChange={e=>update('zone',e.target.value)} placeholder="North Hall, Rooms 101–110" /></label>
      <label>Start<input type="time" value={form.startTime} onChange={e=>update('startTime',e.target.value)} /></label>
      <label>End<input type="time" value={form.endTime} onChange={e=>update('endTime',e.target.value)} /></label>
      <label>Extension<input value={form.phoneExtension} onChange={e=>update('phoneExtension',e.target.value)} /></label>
      <label className="check-label"><input type="checkbox" checked={form.isChargeNurse} onChange={e=>update('isChargeNurse',e.target.checked)} /> Charge nurse coverage</label>
    </div>
    <fieldset><legend>Veteran assignment</legend><div className="assignment-picker">{activeVeterans.length===0?<p className="muted">Add active Veterans before assigning coverage.</p>:activeVeterans.map(v=><label key={v.id} className={form.veteranIds.includes(v.id)?'selected':''}><input type="checkbox" checked={form.veteranIds.includes(v.id)} onChange={()=>toggleVeteran(v.id)} /><span><b>{v.room}</b> {v.name}</span></label>)}</div></fieldset>
    <fieldset><legend>Treatment responsibility</legend><div className="inline-options">{(['Licensed','Non-licensed'] as const).map(c=><label key={c}><input type="checkbox" checked={form.treatmentCategories.includes(c)} onChange={e=>update('treatmentCategories',e.target.checked?[...form.treatmentCategories,c]:form.treatmentCategories.filter(x=>x!==c))} /> {c}</label>)}</div></fieldset>
    <label>Handoff notes<textarea value={form.notes} onChange={e=>update('notes',e.target.value)} /></label>
    <div className="form-actions"><button className="primary" type="submit">Save assignment</button></div>
  </form>;
}
