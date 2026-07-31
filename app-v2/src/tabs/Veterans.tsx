import { useState } from 'react'
import type { BravoShiftDB, Veteran } from '../types'
import { daysOnUnit, activeList, esc } from '../db'
import { Modal } from '../components/Header'

const D = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function empty(db: BravoShiftDB): Veteran {
  return {
    id:'', room:0, name:'', last4:'', status:'Active', codeStatus:'',
    specialty: activeList(db,'specialties')[0]||'LTC', providerId:'',
    admission:'', meds: activeList(db,'medicationMethods')[0]||'Whole',
    diet: activeList(db,'diets')[0]||'Regular',
    isolation: activeList(db,'isolationTypes')[0]||'Standard',
    assist: activeList(db,'assistLevels')[0]||'Independent',
    mobility: activeList(db,'mobilityOptions')[0]||'Ambulatory',
    fallRisk: activeList(db,'fallRiskLevels')[0]||'Standard',
    toileting: activeList(db,'toiletingOptions')[0]||'Continent',
    notes:'', schedules:{skin:[],weight:[],vitals:[],shower:[]}, showerShift:'Day'
  }
}

export function VeteransTab({ db, update }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void }) {
  const [form, setForm] = useState<Veteran | null>(null)
  const active = db.veterans.filter(v => v.status !== 'Discharged / Archived')
  const all = [...db.veterans].sort((a,b) => a.room - b.room)

  const save = () => {
    if (!form || !form.room || !form.name || !/^\d{4}$/.test(form.last4)) {
      alert('Room, name, and a four-digit Last 4 are required.'); return
    }
    if (db.veterans.some(v => v.id !== form.id && v.room === form.room && v.status !== 'Discharged / Archived')) {
      alert('That room is already assigned to an active Veteran.'); return
    }
    const rec = { ...form, id: form.id || 'v'+Date.now() }
    const idx = db.veterans.findIndex(v => v.id === rec.id)
    const next = idx >= 0
      ? { ...db, veterans: db.veterans.map(v => v.id === rec.id ? rec : v) }
      : { ...db, veterans: [...db.veterans, rec] }
    update(next); setForm(null)
  }

  const field = (k: keyof Veteran) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(f => f ? { ...f, [k]: e.target.value } : null)

  const dayToggle = (schedule: string, day: string) => {
    if (!form) return
    const arr = form.schedules[schedule as keyof typeof form.schedules] || []
    const next = arr.includes(day) ? arr.filter(d => d !== day) : [...arr, day]
    setForm({ ...form, schedules: { ...form.schedules, [schedule]: next } })
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Veteran Roster</h2>
        <button className="primary purple" onClick={() => setForm(empty(db))}>Add Veteran</button>
      </div>
      <div className="scroll">
        <table className="usa-table">
          <thead>
            <tr>
              <th>Room</th><th>Name</th><th>Last 4</th><th>Status</th><th>Specialty</th>
              <th>Provider</th><th>Days</th><th>Code</th><th>Meds</th><th>Diet</th>
              <th>Isolation</th><th>Assist</th><th>Mobility</th><th>Fall Risk</th>
              <th>Toileting</th><th>Notes</th><th></th>
            </tr>
          </thead>
          <tbody>
            {all.map(v => {
              const p = db.providers.find(x => x.id === v.providerId)
              return (
                <tr key={v.id} className={v.status==='Discharged / Archived'?'archived':''}>
                  <td>{v.room}</td><td>{esc(v.name)}</td><td>{esc(v.last4)}</td>
                  <td>{esc(v.status)}</td><td>{esc(v.specialty)}</td>
                  <td>{esc(p?.name||'')}</td><td>{daysOnUnit(v.admission)}</td>
                  <td>{esc(v.codeStatus)}</td><td>{esc(v.meds)}</td>
                  <td>{esc(v.diet)}</td><td>{esc(v.isolation)}</td>
                  <td>{esc(v.assist)}</td><td>{esc(v.mobility)}</td>
                  <td>{esc(v.fallRisk)}</td><td>{esc(v.toileting)}</td>
                  <td className="notes-cell">{esc(v.notes)}</td>
                  <td><button className="secondary" onClick={() => setForm({...v})}>Edit</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title="Add / Edit Veteran">
        {form && (
          <div className="formgrid">
            <div><label>Room *</label><input type="number" value={form.room||''} onChange={e => setForm({...form, room: +e.target.value})} /></div>
            <div className="span2"><label>Name *</label><input value={form.name} onChange={field('name')} /></div>
            <div><label>Last 4 *</label><input maxLength={4} value={form.last4} onChange={field('last4')} /></div>
            <div><label>Specialty</label><select value={form.specialty} onChange={field('specialty')}>{activeList(db,'specialties').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Provider</label><select value={form.providerId} onChange={field('providerId')}><option value="">Select…</option>{db.providers.filter(p=>p.active).map(p => <option key={p.id} value={p.id}>{p.name} — {p.specialty}</option>)}</select></div>
            <div><label>Admission</label><input type="date" value={form.admission} onChange={field('admission')} /></div>
            <div><label>Days on Unit</label><input disabled value={daysOnUnit(form.admission)} /></div>
            <div><label>Status</label><select value={form.status} onChange={field('status')}><option>Active</option><option>At Appointment</option><option>Leave of Absence</option><option>Hospital</option><option>Discharged / Archived</option></select></div>
            <div><label>Code Status</label><select value={form.codeStatus} onChange={field('codeStatus')}><option value=""></option><option>Full Code</option><option>DNR</option><option>DNAR</option><option>Comfort Measures</option><option>See Current Orders</option></select></div>
            <div><label>Meds</label><select value={form.meds} onChange={field('meds')}>{activeList(db,'medicationMethods').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Diet</label><select value={form.diet} onChange={field('diet')}>{activeList(db,'diets').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Isolation</label><select value={form.isolation} onChange={field('isolation')}>{activeList(db,'isolationTypes').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Assist</label><select value={form.assist} onChange={field('assist')}>{activeList(db,'assistLevels').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Mobility</label><select value={form.mobility} onChange={field('mobility')}>{activeList(db,'mobilityOptions').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Fall Risk</label><select value={form.fallRisk} onChange={field('fallRisk')}>{activeList(db,'fallRiskLevels').map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label>Toileting</label><select value={form.toileting} onChange={field('toileting')}>{activeList(db,'toiletingOptions').map(s => <option key={s}>{s}</option>)}</select></div>
            <div className="span4"><label>Notes</label><textarea value={form.notes} onChange={field('notes')} /></div>
            <fieldset className="span2"><legend>Skin Assessment Days</legend><div className="days">{D.slice(1).concat(D[0]).map(d => <label key={d}><input type="checkbox" checked={(form.schedules.skin||[]).includes(d)} onChange={() => dayToggle('skin',d)} /> {d}</label>)}</div></fieldset>
            <fieldset className="span2"><legend>Weight Days</legend><div className="days">{D.slice(1).concat(D[0]).map(d => <label key={d}><input type="checkbox" checked={(form.schedules.weight||[]).includes(d)} onChange={() => dayToggle('weight',d)} /> {d}</label>)}</div></fieldset>
            <fieldset className="span2"><legend>Vitals Days</legend><div className="days">{D.slice(1).concat(D[0]).map(d => <label key={d}><input type="checkbox" checked={(form.schedules.vitals||[]).includes(d)} onChange={() => dayToggle('vitals',d)} /> {d}</label>)}</div></fieldset>
            <fieldset className="span2"><legend>Shower Days & Shift</legend><div className="days">{D.slice(1).concat(D[0]).map(d => <label key={d}><input type="checkbox" checked={(form.schedules.shower||[]).includes(d)} onChange={() => dayToggle('shower',d)} /> {d}</label>)}</div><div className="inline"><label><input type="radio" name="ss" value="Day" checked={form.showerShift==='Day'} onChange={() => setForm({...form,showerShift:'Day'})} /> Day</label><label><input type="radio" name="ss" value="Night" checked={form.showerShift==='Night'} onChange={() => setForm({...form,showerShift:'Night'})} /> Night</label></div></fieldset>
          </div>
        )}
        <div className="toolbar">
          <button className="primary purple" onClick={save}>Save Veteran</button>
          <button className="secondary" onClick={() => setForm(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}
