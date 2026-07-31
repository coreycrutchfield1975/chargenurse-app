import { useState } from 'react'
import type { BravoShiftDB } from '../types'
import { today, esc } from '../db'
import { Modal } from '../components/Header'

const ROLES = ['Charge RN','North Med Nurse','South Med Nurse','Center Med Nurse','Block 1','Block 2','Block 3','Float']

export function StaffTab({ db, update }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(today())
  const [form, setForm] = useState<Record<string,{day:Record<string,string>;night:Record<string,string>}>>({...db.staff})

  const load = (d: string) => {
    setDate(d)
    setForm({...db.staff, [d]: db.staff[d] || {day:{},night:{}}})
  }

  const save = () => {
    update({ ...db, staff: { ...db.staff, [date]: form[date] || {day:{},night:{}} } })
    setOpen(false)
  }

  const cd = form[date] || {day:{},night:{}}
  const x = db.staff[today()] || {day:{},night:{}}

  return (
    <div>
      <div className="toolbar">
        <h2>Staff Assignments</h2>
        <button className="primary teal" onClick={() => { load(date); setOpen(true) }}>Enter / Edit Assignments</button>
      </div>
      <div className="grid">
        <div className="panel"><h3>Day Shift</h3>{ROLES.map(r => <p key={r}><b>{r}:</b> {esc(x.day[r]||'—')}</p>)}</div>
        <div className="panel"><h3>Night Shift</h3>{ROLES.map(r => <p key={r}><b>{r}:</b> {esc(x.night[r]||'—')}</p>)}</div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Shift Assignments">
        <div><label>Date</label><input type="date" value={date} onChange={e => load(e.target.value)} /></div>
        <div className="grid">
          <div className="panel"><h3>Day Shift</h3>{ROLES.map((r,i) => <div key={i}><label>{r}</label><input value={cd.day[r]||''} onChange={e => setForm(f => ({...f, [date]: {...cd, day:{...cd.day, [r]: e.target.value}}}))} /></div>)}</div>
          <div className="panel"><h3>Night Shift</h3>{ROLES.map((r,i) => <div key={i}><label>{r}</label><input value={cd.night[r]||''} onChange={e => setForm(f => ({...f, [date]: {...cd, night:{...cd.night, [r]: e.target.value}}}))} /></div>)}</div>
        </div>
        <div className="toolbar">
          <button className="primary teal" onClick={save}>Save Assignments</button>
          <button className="secondary" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}
