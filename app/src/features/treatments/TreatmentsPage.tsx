import { useMemo, useState, type ReactNode } from 'react';
import type { Treatment, TreatmentCompletion, Veteran, ManagedLists } from '../../types/domain';
import { TreatmentForm } from './TreatmentForm';
import { completionFor, countDueByCategory, expectedShifts, isOverdue, localDateKey, treatmentDueOn, treatmentScheduleLabel } from './treatmentSelectors';

interface Props {
  veterans: Veteran[];
  treatments: Treatment[];
  completions: TreatmentCompletion[];
  onSave: (treatment: Treatment) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleComplete: (treatment: Treatment, date: string, shift: 'Day' | 'Night', completedBy: string) => void;
  lists: ManagedLists;
}

type StatusFilter = 'All' | 'Active' | 'Due Today' | 'Overdue' | 'Completed Today' | 'Archived' | 'PRN';

export function TreatmentsPage({ veterans, treatments, completions, onSave, onArchive, onRestore, onToggleComplete, lists }: Props) {
  const [editing, setEditing] = useState<Treatment | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | Treatment['category']>('All');
  const [shift, setShift] = useState<'All' | Treatment['shift']>('All');
  const [status, setStatus] = useState<StatusFilter>('All');
  const [selectedDate, setSelectedDate] = useState(localDateKey());
  const [completedBy, setCompletedBy] = useState('');
  const veteranMap = useMemo(()=>new Map(veterans.map(v=>[v.id,v])),[veterans]);
  const rows = useMemo(()=>treatments.map(t=>({ treatment:t, veteran:veteranMap.get(t.veteranId), due:treatmentDueOn(t,selectedDate), overdue:isOverdue(t,completions,selectedDate), shifts:expectedShifts(t) })).filter(row=>{
    const hay=[row.veteran?.name,row.veteran?.room,row.veteran?.last4,row.treatment.name,row.treatment.instructions].join(' ').toLowerCase();
    const allComplete=row.shifts.every(s=>completionFor(completions,row.treatment.id,selectedDate,s));
    const statusMatch=status==='All'||(status==='Active'&&row.treatment.active)||(status==='Archived'&&!row.treatment.active)||(status==='Due Today'&&row.due)||(status==='Overdue'&&row.overdue)||(status==='Completed Today'&&row.due&&allComplete)||(status==='PRN'&&row.treatment.frequency==='PRN');
    return (!search||hay.includes(search.toLowerCase()))&&(category==='All'||row.treatment.category===category)&&(shift==='All'||row.treatment.shift===shift)&&statusMatch;
  }).sort((a,b)=>(a.veteran?.room||'999').localeCompare(b.veteran?.room||'999',undefined,{numeric:true})),[treatments,completions,selectedDate,search,category,shift,status,veteranMap]);
  const due=treatments.filter(t=>treatmentDueOn(t,selectedDate));
  const overdue=due.filter(t=>isOverdue(t,completions,selectedDate)).length;
  function open(item?:Treatment){setEditing(item);setShowForm(true)}
  if(showForm) return <TreatmentsPageWrapper><TreatmentForm veterans={veterans} treatment={editing} onCancel={()=>{setShowForm(false);setEditing(undefined)}} onSave={item=>{onSave(item);setShowForm(false);setEditing(undefined)}} lists={lists} /></TreatmentsPageWrapper>;
  return <TreatmentsPageWrapper>
    <div className="page-heading"><div><h1>Treatments</h1><p>Daily treatment tracking, schedule management, completion, and overdue follow-up.</p></div><button className="primary-button" onClick={()=>open()}>Assign Treatment</button></div>
    <div className="treatment-metrics">
      <article><span>Due</span><strong>{due.length}</strong><small>{selectedDate}</small></article>
      <article><span>Licensed</span><strong>{countDueByCategory(treatments,selectedDate,'Licensed')}</strong><small>Due on selected date</small></article>
      <article><span>Non-Licensed</span><strong>{countDueByCategory(treatments,selectedDate,'Non-Licensed')}</strong><small>Due on selected date</small></article>
      <article className={overdue?'metric-alert':''}><span>Overdue</span><strong>{overdue}</strong><small>Needs follow-up</small></article>
    </div>
    <section className="treatment-controls">
      <label>Work Date<input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} /></label>
      <label>Search<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Veteran, room, treatment..." /></label>
      <label>Category<select value={category} onChange={e=>setCategory(e.target.value as typeof category)}><option>All</option><option>Licensed</option><option>Non-Licensed</option></select></label>
      <label>Shift<select value={shift} onChange={e=>setShift(e.target.value as typeof shift)}><option>All</option><option>Day</option><option>Night</option><option>Both</option></select></label>
      <label>Status<select value={status} onChange={e=>setStatus(e.target.value as StatusFilter)}>{['All','Active','Due Today','Overdue','Completed Today','Archived','PRN'].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Completed By<input value={completedBy} onChange={e=>setCompletedBy(e.target.value)} placeholder="Initials or staff name" /></label>
    </section>
    <div className="table-wrap"><table className="record-table treatment-table"><thead><tr><th>Room / Veteran</th><th>Treatment</th><th>Category</th><th>Schedule</th><th>Shift</th><th>Dates</th><th>Instructions</th><th>{selectedDate}</th><th>Actions</th></tr></thead><tbody>
      {rows.map(({treatment,veteran,due,overdue,shifts})=><tr key={treatment.id} className={!treatment.active?'archived-row':overdue?'overdue-row':''}>
        <td><strong>{veteran?.room||'—'} — {veteran?.name||'Missing Veteran'}</strong><small>{veteran?.last4?`Last 4: ${veteran.last4}`:''}</small></td>
        <td><strong>{treatment.name}</strong>{treatment.notes&&<small>{treatment.notes}</small>}</td>
        <td><span className={`status-badge ${treatment.category==='Licensed'?'licensed-badge':'nonlicensed-badge'}`}>{treatment.category}</span></td>
        <td>{treatmentScheduleLabel(treatment)}</td><td>{treatment.shift}</td><td>{treatment.startDate||'—'}<small>{treatment.endDate?`through ${treatment.endDate}`:'No end date'}</small></td><td>{treatment.instructions||'—'}</td>
        <td>{!treatment.active?<span>Archived</span>:treatment.frequency==='PRN'?<span className="status-badge">PRN</span>:!due?<span>Not due</span>:<div className="completion-buttons">{shifts.map(s=>{const done=completionFor(completions,treatment.id,selectedDate,s);return <button key={s} className={done?'complete-button':'primary-button compact-button'} onClick={()=>onToggleComplete(treatment,selectedDate,s,completedBy)}>{done?`✓ ${s} Complete`:`Mark ${s} Complete`}</button>})}{overdue&&<span className="overdue-label">OVERDUE</span>}</div>}</td>
        <td><div className="table-actions"><button onClick={()=>open(treatment)}>Edit</button>{treatment.active?<button className="danger-link" onClick={()=>onArchive(treatment.id)}>Archive</button>:<button onClick={()=>onRestore(treatment.id)}>Restore</button>}</div></td>
      </tr>)}
      {!rows.length&&<tr><td colSpan={9} className="empty-state">No treatments match the selected filters.</td></tr>}
    </tbody></table></div>
  </TreatmentsPageWrapper>;
}

function TreatmentsPageWrapper({children}:{children:ReactNode}){return <section className="treatments-page">{children}</section>}
