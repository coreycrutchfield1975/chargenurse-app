import { useState, useMemo } from 'react'
import type { BravoShiftDB, Appointment } from '../types'
import { today, activeList, vetLabel, esc, daysOnUnit } from '../db'
import { Modal } from '../components/Header'

export function AppointmentsTab({ db, update }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void }) {
  const [form, setForm] = useState<Partial<Appointment> | null>(null)
  const [search, setSearch] = useState('')
  const [stFilter, setStFilter] = useState('')
  const [fromFilter, setFromFilter] = useState('')
  const [toFilter, setToFilter] = useState('')

  const filtered = useMemo(() => {
    let rows = [...db.appointments]
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(a => {
        const v = db.veterans.find(x => x.id === a.vetId)
        const p = db.providers.find(x => x.id === a.providerId)
        const hay = [v?.name,v?.last4,String(v?.room),p?.name,p?.specialty,p?.facility,a.clinic,a.destination,a.reason,a.escort,a.transport].join(' ').toLowerCase()
        return hay.includes(q)
      })
    }
    if (stFilter) rows = rows.filter(a => a.status === stFilter)
    if (fromFilter) rows = rows.filter(a => a.date >= fromFilter)
    if (toFilter) rows = rows.filter(a => a.date <= toFilter)
    return rows.sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time))
  }, [db, search, stFilter, fromFilter, toFilter])

  const save = () => {
    if (!form || !form.vetId || !form.providerId || !form.date || !form.time) {
      alert('Veteran, provider, date, and time are required.'); return
    }
    const rec: Appointment = {
      id: form.id || 'a'+Date.now(),
      vetId: form.vetId, providerId: form.providerId,
      date: form.date, time: form.time, clinic: form.clinic || '',
      reason: form.reason || 'Consult', destination: form.destination || '',
      pickup: form.pickup || '', transport: form.transport || '', escort: form.escort || '',
      status: form.status || 'Upcoming', notes: form.notes || '',
      createdAt: form.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString()
    }
    const idx = db.appointments.findIndex(a => a.id === rec.id)
    update(idx >= 0 ? { ...db, appointments: db.appointments.map(a => a.id===rec.id?rec:a) } : { ...db, appointments: [...db.appointments, rec] })
    setForm(null)
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Appointments & Search</h2>
        <button className="secondary" onClick={() => { setSearch(''); setStFilter(''); setFromFilter(''); setToFilter('') }}>Clear Filters</button>
        <button className="primary" onClick={() => setForm({ date: today(), time: '', status: 'Upcoming' })}>Add Appointment</button>
      </div>
      <div className="panel">
        <div className="formgrid">
          <div><label>Search</label><input placeholder="Veteran, room, provider, clinic..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div><label>Status</label><select value={stFilter} onChange={e => setStFilter(e.target.value)}><option value="">All</option><option>Upcoming</option><option>In Progress</option><option>Completed</option><option>Cancelled</option><option>No Show</option></select></div>
          <div><label>From</label><input type="date" value={fromFilter} onChange={e => setFromFilter(e.target.value)} /></div>
          <div><label>To</label><input type="date" value={toFilter} onChange={e => setToFilter(e.target.value)} /></div>
        </div>
      </div>
      <div className="scroll">
        <table className="usa-table">
          <thead><tr><th>Date</th><th>Time</th><th>Pickup</th><th>Room</th><th>Veteran</th><th>Provider</th><th>Reason</th><th>Location</th><th>Transport</th><th>Travel</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(a => {
              const v = db.veterans.find(x => x.id === a.vetId)
              const p = db.providers.find(x => x.id === a.providerId)
              const tr = db.travel[a.id]
              return (
                <tr key={a.id} className={a.status==='Cancelled'?'archived':''}>
                  <td>{a.date}</td><td>{esc(a.time)}</td><td>{esc(a.pickup)}</td>
                  <td>{v?.room||''}</td><td>{esc(v?.name||'')}<br/><span className="muted">{esc(v?.last4||'')}</span></td>
                  <td>{esc(p?.name||'')}<br/><span className="muted">{esc(a.clinic||p?.specialty||'')}</span></td>
                  <td>{esc(a.reason)}</td><td>{esc(a.destination||p?.facility||'')}</td>
                  <td>{esc(a.transport)}</td>
                  <td>{tr ? <span className={`badge ${tr.status.toLowerCase()}`}>{tr.status}</span> : <span className="muted">Not created</span>}</td>
                  <td><span className={`badge ${a.status.toLowerCase().replace(/\s/g,'')}`}>{a.status}</span></td>
                  <td>
                    <button className="secondary" onClick={() => setForm({...a})}>Edit</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title="Add / Edit Appointment">
        {form && (
          <div className="formgrid">
            <div className="span2"><label>Veteran *</label><select value={form.vetId||''} onChange={e => setForm({...form, vetId: e.target.value})}><option value="">Select…</option>{db.veterans.filter(v=>v.status!=='Discharged / Archived').sort((a,b)=>a.room-b.room).map(v => <option key={v.id} value={v.id}>Room {v.room} — {v.name} ({v.last4})</option>)}</select></div>
            <div className="span2"><label>Provider *</label><select value={form.providerId||''} onChange={e => { const p = db.providers.find(x=>x.id===e.target.value); setForm({...form, providerId:e.target.value, destination: p ? [p.facility,p.city].filter(Boolean).join(', ') : (form.destination||'') }) }}><option value="">Select…</option>{db.providers.filter(p=>p.active).map(p => <option key={p.id} value={p.id}>{p.name} — {p.specialty}</option>)}</select></div>
            <div><label>Date *</label><input type="date" value={form.date||''} onChange={e => setForm({...form, date: e.target.value})} /></div>
            <div><label>Time *</label><input type="time" value={form.time||''} onChange={e => setForm({...form, time: e.target.value})} /></div>
            <div><label>Clinic</label><input value={form.clinic||''} onChange={e => setForm({...form, clinic: e.target.value})} /></div>
            <div><label>Reason</label><select value={form.reason||'Consult'} onChange={e => setForm({...form, reason: e.target.value})}>{activeList(db,'appointmentReasons').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Destination</label><input value={form.destination||''} onChange={e => setForm({...form, destination: e.target.value})} /></div>
            <div><label>Pickup</label><input type="time" value={form.pickup||''} onChange={e => setForm({...form, pickup: e.target.value})} /></div>
            <div><label>Transport</label><select value={form.transport||''} onChange={e => setForm({...form, transport: e.target.value})}><option value=""></option>{activeList(db,'transportationModes').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Escort</label><input value={form.escort||''} onChange={e => setForm({...form, escort: e.target.value})} /></div>
            <div><label>Status</label><select value={form.status||'Upcoming'} onChange={e => setForm({...form, status: e.target.value as Appointment['status']})}><option>Upcoming</option><option>In Progress</option><option>Completed</option><option>Cancelled</option><option>No Show</option></select></div>
            <div className="span2"><label>Notes</label><textarea value={form.notes||''} onChange={e => setForm({...form, notes: e.target.value})} /></div>
          </div>
        )}
        <div className="toolbar">
          <button className="primary" onClick={save}>Save Appointment</button>
          <button className="secondary" onClick={() => setForm(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}
