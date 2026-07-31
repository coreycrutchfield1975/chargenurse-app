import { useState } from 'react'
import type { BravoShiftDB } from '../types'
import { today, daysOnUnit, vetLabel, treatmentDueOn, esc } from '../db'

const D = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const ROLES = ['Charge RN','North Med Nurse','South Med Nurse','Center Med Nurse','Block 1','Block 2','Block 3','Float']

export function MorningReport({ db, update }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void }) {
  const [date, setDate] = useState(today())
  const [generated, setGenerated] = useState(false)

  const day = D[new Date(date+'T12:00:00').getDay()]
  const vets = db.veterans.filter(v => v.status !== 'Discharged / Archived').sort((a,b) => a.room - b.room)
  const ap = db.appointments.filter(a => a.date === date && a.status !== 'Cancelled').sort((a,b) => a.time.localeCompare(b.time))
  const s = db.staff[date] || { day:{}, night:{} }
  const due = (k: string) => vets.filter(v => (v.schedules[k as keyof typeof v.schedules]||[] as string[]).includes(day))
  const txDue = db.treatments.filter(t => treatmentDueOn(t, date))
  const txOut = txDue.filter(t => !db.treatmentCompletions[`${t.id}|${date}`])
  const tAttention = ap.filter(a => { const tr = db.travel[a.id]; return a.transport && (!tr || ['Draft','Failed'].includes(tr.status)) })
  const offUnit = vets.filter(v => ['At Appointment','Leave of Absence','Hospital'].includes(v.status))
  const newAdmits = vets.filter(v => v.admission && Math.floor((Date.now() - new Date(v.admission+'T12:00:00').getTime())/86400000) <= 1)

  const print = () => {
    const w = window.open('','_blank','width=1000,height=700')
    if (!w) return
    const css = document.querySelector('style')?.innerHTML || ''
    w.document.write(`<html><head><title>Morning Report — ${date}</title><style>${css} @page{size:landscape;margin:.3in} body{background:#fff;padding:0} .no-print{display:none}</style></head><body>${document.getElementById('report-container')?.innerHTML||''}</body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 300)
  }

  return (
    <div>
      <div className="toolbar no-print">
        <h2>Morning Report</h2>
        <input type="date" value={date} onChange={e => { setDate(e.target.value); setGenerated(false) }} />
        <button className="primary pink" onClick={() => setGenerated(true)}>Generate</button>
        <button className="secondary" onClick={print}>Print</button>
      </div>
      {generated && (
        <div id="report-container" className="printsheet">
          <h2 style={{textAlign:'center'}}>BRAVOSHIFT — CLC MORNING REPORT — {date}</h2>
          <p style={{textAlign:'center'}}><b>Census:</b> {vets.length} | <b>Appointments:</b> {ap.length} | <b>Treatments Due:</b> {txDue.length} | <b>Priority:</b> {tAttention.length+txOut.length}</p>

          <h3>Veteran Census</h3>
          <div className="scroll"><table className="usa-table">
            <thead><tr><th>Room</th><th>Name</th><th>Last 4</th><th>Spec.</th><th>Provider</th><th>Days</th><th>Meds</th><th>Diet</th><th>Isolation</th><th>Assist</th><th>Toileting</th><th>Status</th><th>Notes</th></tr></thead>
            <tbody>{vets.map(v => { const p = db.providers.find(x => x.id === v.providerId); return <tr key={v.id}><td>{v.room}</td><td>{esc(v.name)}</td><td>{esc(v.last4)}</td><td>{esc(v.specialty)}</td><td>{esc(p?.name||'')}</td><td>{daysOnUnit(v.admission)}</td><td>{esc(v.meds)}</td><td>{esc(v.diet)}</td><td>{esc(v.isolation)}</td><td>{esc(v.assist)}</td><td>{esc(v.toileting)}</td><td>{esc(v.status)}</td><td>{esc(v.notes)}</td></tr> })}</tbody>
          </table></div>

          <div className="printgrid">
            <div className="printcard"><h3>Shift Intelligence</h3>
              {tAttention.map(a => <p key={a.id}><b>HIGH:</b> Transport: {vetLabel(db,a.vetId)} — {a.time} {a.destination||a.clinic}</p>)}
              {txOut.map(t => { const v = db.veterans.find(x=>x.id===t.vetId); return <p key={t.id}><b>{t.category==='Licensed'?'HIGH':'DUE'}:</b> Room {v?.room} — {v?.name}: {t.type} ({t.shift})</p> })}
              {offUnit.map(v => <p key={v.id}><b>STATUS:</b> Room {v.room} — {v.name}: {v.status}</p>)}
              {tAttention.length===0 && txOut.length===0 && <p>No outstanding priority items.</p>}
            </div>
            <div className="printcard"><h3>Risk Review</h3>
              <p><b>New admits (24h):</b> {newAdmits.map(v=>`Room ${v.room} — ${v.name}`).join('; ')||'None'}</p>
              <p><b>Off unit:</b> {offUnit.map(v=>`Room ${v.room} — ${v.name} (${v.status})`).join('; ')||'None'}</p>
            </div>
          </div>

          <div className="printcard"><h3>Appointments</h3>
            {ap.length ? <table className="usa-table"><thead><tr><th>Time</th><th>Veteran</th><th>Destination</th><th>Pickup</th><th>Transport</th><th>Status</th></tr></thead><tbody>{ap.map(a => { const v=db.veterans.find(x=>x.id===a.vetId); const tr=db.travel[a.id]; return <tr key={a.id}><td>{a.time}</td><td>{v?.room} — {esc(v?.name||'')}</td><td>{esc(a.destination||a.clinic||'')}</td><td>{esc(a.pickup||tr?.pickup||'')}</td><td>{esc(a.transport||'')}</td><td>{esc(tr?.status||'Not Started')}</td></tr> })}</tbody></table> : <p>None</p>}
          </div>

          <div className="printgrid">
            <div className="printcard"><h3>Day Shift</h3>{ROLES.map(r => <p key={r}><b>{r}:</b> {esc(s.day[r]||'—')}</p>)}</div>
            <div className="printcard"><h3>Night Shift</h3>{ROLES.map(r => <p key={r}><b>{r}:</b> {esc(s.night[r]||'—')}</p>)}</div>
          </div>
          <div className="printgrid">
            <div className="printcard"><h3>Skin: {due('skin').map(v=>`Room ${v.room} — ${v.name}`).join(', ')||'None'}</h3></div>
            <div className="printcard"><h3>Weights: {due('weight').map(v=>`Room ${v.room} — ${v.name}`).join(', ')||'None'}</h3></div>
            <div className="printcard"><h3>Vitals: {due('vitals').map(v=>`Room ${v.room} — ${v.name}`).join(', ')||'None'}</h3></div>
            <div className="printcard"><h3>Showers: {due('shower').map(v=>`Room ${v.room} — ${v.name} (${v.showerShift})`).join(', ')||'None'}</h3></div>
          </div>
          <div className="printcard"><h3>Treatments Due</h3>
            {txDue.map(t => { const v=db.veterans.find(x=>x.id===t.vetId); const done=!!db.treatmentCompletions[`${t.id}|${date}`]; return <p key={t.id}>Room {v?.room} — {v?.name}: {t.type} ({t.category}, {t.shift}) — {done?'Completed':'Outstanding'}</p> })}
          </div>
          <div className="printcard"><h3>Shift Change Notes</h3><div style={{height:70,borderBottom:'1px solid #888'}}></div></div>
          <p><b>Day Charge RN Signature:</b> ________________ &nbsp; <b>Night Charge RN Signature:</b> ________________</p>
        </div>
      )}
    </div>
  )
}
