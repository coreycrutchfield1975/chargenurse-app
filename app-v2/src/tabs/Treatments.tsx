import { useState, useMemo } from 'react'
import type { BravoShiftDB, Treatment } from '../types'
import { today, activeList, treatmentDueOn, esc } from '../db'
import { Modal } from '../components/Header'

export function TreatmentsTab({ db, update }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void }) {
  const [form, setForm] = useState<Partial<Treatment> | null>(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [dueFilter, setDueFilter] = useState('')
  const date = today()

  const rows = useMemo(() => db.treatments.map(t => ({
    t, v: db.veterans.find(x => x.id === t.vetId),
    isDue: treatmentDueOn(t, date),
    done: !!db.treatmentCompletions[`${t.id}|${date}`]
  })).filter(x => {
    if (search) { const q = search.toLowerCase(); const hay = [x.v?.name, String(x.v?.room), x.v?.last4, x.t.type, x.t.instructions].join(' ').toLowerCase(); if (!hay.includes(q)) return false }
    if (catFilter && x.t.category !== catFilter) return false
    if (dueFilter === 'today' && !x.isDue) return false
    if (dueFilter === 'overdue' && (!x.isDue || x.done)) return false
    return true
  }).sort((a,b) => (+a.v?.room||999) - (+b.v?.room||999)), [db, search, catFilter, dueFilter, date])

  const due = db.treatments.filter(t => treatmentDueOn(t, date))
  const outstanding = due.filter(t => !db.treatmentCompletions[`${t.id}|${date}`])

  const save = () => {
    if (!form || !form.vetId || !form.type) { alert('Veteran and treatment are required.'); return }
    const rec: Treatment = {
      id: form.id || 'tx'+Date.now(), vetId: form.vetId, type: form.type||'',
      category: form.category||'Licensed', frequency: form.frequency||'Daily',
      start: form.start||date, end: form.end||'', shift: form.shift||'Day',
      days: form.days||[], instructions: form.instructions||'', notes: form.notes||'',
      active: form.active !== false
    }
    const idx = db.treatments.findIndex(t => t.id === rec.id)
    update(idx >= 0 ? { ...db, treatments: db.treatments.map(t => t.id===rec.id?rec:t) } : { ...db, treatments: [...db.treatments, rec] })
    setForm(null)
  }

  const toggleComplete = (id: string) => {
    const key = `${id}|${date}`
    const next = { ...db.treatmentCompletions }
    if (next[key]) delete next[key]
    else next[key] = { completedAt: new Date().toISOString() }
    update({ ...db, treatmentCompletions: next })
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Treatments</h2>
        <button className="secondary" onClick={() => { setSearch(''); setCatFilter(''); setDueFilter('') }}>Clear</button>
        <button className="primary green" onClick={() => setForm({ start: date })}>Assign Treatment</button>
      </div>
      <div className="stats">
        <div className="stat s-purple"><span>Due Today</span><b>{due.length}</b></div>
        <div className="stat s-blue"><span>Licensed</span><b>{due.filter(t=>t.category==='Licensed').length}</b></div>
        <div className="stat s-teal"><span>Non-Licensed</span><b>{due.filter(t=>t.category==='Non-Licensed').length}</b></div>
        <div className="stat s-red"><span>Overdue</span><b>{outstanding.length}</b></div>
      </div>
      <div className="panel">
        <div className="formgrid">
          <div><label>Search</label><input placeholder="Veteran, room, treatment..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div><label>Category</label><select value={catFilter} onChange={e => setCatFilter(e.target.value)}><option value="">All</option><option>Licensed</option><option>Non-Licensed</option></select></div>
          <div><label>Due</label><select value={dueFilter} onChange={e => setDueFilter(e.target.value)}><option value="">All</option><option value="today">Due Today</option><option value="overdue">Overdue</option></select></div>
        </div>
      </div>
      <div className="scroll">
        <table className="usa-table">
          <thead><tr><th>Room</th><th>Veteran</th><th>Treatment</th><th>Category</th><th>Frequency</th><th>Shift</th><th>Instructions</th><th>Today</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map(x => (
              <tr key={x.t.id} className={x.t.active?'':'archived'}>
                <td>{x.v?.room||''}</td><td>{esc(x.v?.name||'')}<br/><span className="muted">{esc(x.v?.last4||'')}</span></td>
                <td>{esc(x.t.type)}</td><td><span className={`badge ${x.t.category==='Licensed'?'failed':'confirmed'}`}>{x.t.category}</span></td>
                <td>{x.t.frequency}{x.t.days?.length ? <><br/><span className="muted">{x.t.days.join(', ')}</span></> : null}</td>
                <td>{x.t.shift}</td><td>{esc(x.t.instructions)}</td>
                <td>{x.isDue ? <button className={x.done?'secondary':'primary green'} onClick={() => toggleComplete(x.t.id)}>{x.done?'Completed':'Mark Complete'}</button> : 'Not due'}</td>
                <td><button className="secondary" onClick={() => setForm({...x.t})}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title="Assign / Edit Treatment">
        {form && (
          <div className="formgrid">
            <div className="span2"><label>Veteran *</label><select value={form.vetId||''} onChange={e => setForm({...form, vetId: e.target.value})}><option value="">Select…</option>{db.veterans.filter(v=>v.status!=='Discharged / Archived').sort((a,b)=>a.room-b.room).map(v => <option key={v.id} value={v.id}>Room {v.room} — {v.name} ({v.last4})</option>)}</select></div>
            <div><label>Treatment *</label><select value={form.type||''} onChange={e => setForm({...form, type: e.target.value})}>{activeList(db,'treatmentTypes').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Category</label><select value={form.category||'Licensed'} onChange={e => setForm({...form, category: e.target.value as 'Licensed'|'Non-Licensed'})}><option>Licensed</option><option>Non-Licensed</option></select></div>
            <div><label>Frequency</label><select value={form.frequency||'Daily'} onChange={e => setForm({...form, frequency: e.target.value as Treatment['frequency']})}><option>Daily</option><option>Weekly</option><option>As Scheduled</option><option>PRN</option></select></div>
            <div><label>Start</label><input type="date" value={form.start||''} onChange={e => setForm({...form, start: e.target.value})} /></div>
            <div><label>End</label><input type="date" value={form.end||''} onChange={e => setForm({...form, end: e.target.value})} /></div>
            <div><label>Shift</label><select value={form.shift||'Day'} onChange={e => setForm({...form, shift: e.target.value as 'Day'|'Night'|'Both'})}><option>Day</option><option>Night</option><option>Both</option></select></div>
            <div className="span4"><label>Instructions</label><textarea value={form.instructions||''} onChange={e => setForm({...form, instructions: e.target.value})} /></div>
            <div className="span4"><label>Notes</label><textarea value={form.notes||''} onChange={e => setForm({...form, notes: e.target.value})} /></div>
          </div>
        )}
        <div className="toolbar">
          <button className="primary green" onClick={save}>Save Treatment</button>
          {form?.id && <button className="secondary" onClick={() => { update({ ...db, treatments: db.treatments.map(t => t.id===form.id ? {...t, active:false} : t) }); setForm(null) }}>Archive</button>}
          <button className="secondary" onClick={() => setForm(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}
