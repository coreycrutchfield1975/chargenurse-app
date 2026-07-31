import { } from 'react'
import type { BravoShiftDB } from '../types'
import { today, treatmentDueOn } from '../db'

export function Dashboard({ db }: { db: BravoShiftDB }) {
  const date = today()
  const active = db.veterans.filter(v => v.status !== 'Discharged / Archived')
  const todayAppts = db.appointments.filter(a => a.date === date && a.status !== 'Cancelled')
  const due = db.treatments.filter(t => t.active !== false && treatmentDueOn(t, date))
  const outstanding = due.filter(t => !db.treatmentCompletions[`${t.id}|${date}`])
  const offUnit = active.filter(v => ['At Appointment','Leave of Absence','Hospital'].includes(v.status))
  const tFollow = db.appointments.filter(a => db.travel[a.id] && ['Draft','Failed'].includes(db.travel[a.id].status))
  const cutoff = Date.now() - 24*60*60*1000
  const newAdmits = active.filter(v => v.admission && new Date(v.admission+'T12:00:00').getTime() >= cutoff)

  const alerts: { title: string; message: string; level: string }[] = []
  outstanding.forEach(t => {
    const v = db.veterans.find(x => x.id === t.vetId)
    alerts.push({ title: t.category==='Licensed'?'Licensed Treatment Due':'Treatment Due', message: `Room ${v?.room||''} — ${v?.name||''}: ${t.type} (${t.shift})`, level: t.category==='Licensed'?'critical':'warning' })
  })
  offUnit.forEach(v => alerts.push({ title:'Veteran Off Unit', message: `Room ${v.room} — ${v.name}: ${v.status}`, level:'info' }))
  newAdmits.forEach(v => alerts.push({ title:'New Admission', message: `Room ${v.room} — ${v.name}`, level:'info' }))

  const x = db.staff[date] || { day:{}, night:{} }
  const ROLES = ['Charge RN','North Med Nurse','South Med Nurse','Center Med Nurse','Block 1','Block 2','Block 3','Float']

  return (
    <div>
      <div className="greeting">
        <strong>{dateShiftGreeting()}</strong>
        <span>Your command post is ready for review.</span>
      </div>
      <div className="stats">
        <div className="stat s-purple"><span>Active Veterans</span><b>{active.length}</b></div>
        <div className="stat s-blue"><span>Today's Appointments</span><b>{todayAppts.length}</b></div>
        <div className="stat s-teal"><span>Treatments Due</span><b>{outstanding.length}</b></div>
        <div className="stat s-red"><span>Priority Actions</span><b>{alerts.length}</b></div>
        <div className="stat s-purple"><span>Off Unit</span><b>{offUnit.length}</b></div>
        <div className="stat s-blue"><span>New Admits 24h</span><b>{newAdmits.length}</b></div>
        <div className="stat s-teal"><span>Transport Follow-up</span><b>{tFollow.length}</b></div>
        <div className="stat s-red"><span>Done Treatments</span><b>{due.length - outstanding.length}</b></div>
      </div>
      <div className="grid">
        <div className="panel">
          <h2>Priority Action Board</h2>
          {alerts.length ? alerts.slice(0,10).map((a,i) => (
            <div key={i} className={`alert ${a.level==='critical'?'alert-critical':a.level==='warning'?'alert-warning':''}`}>
              <b>{a.title}</b><div>{a.message}</div>
            </div>
          )) : <div className="card"><b>Operational Readiness: Green</b><div>No priority follow-up identified.</div></div>}
        </div>
        <div className="panel">
          <h2>Today's Schedule</h2>
          {todayAppts.length ? todayAppts.sort((a,b) => a.time.localeCompare(b.time)).map(a => {
            const v = db.veterans.find(x => x.id === a.vetId)
            const tr = db.travel[a.id]
            return (
              <div key={a.id} className="card">
                <b>{a.time} — Room {v?.room||''} {v?.name||''}</b>
                <div>{a.clinic || a.destination || ''}</div>
                <span className="muted">Pickup {a.pickup||'Not set'} · {a.transport||'N/A'} · Travel {tr?.status||'Not created'}</span>
              </div>
            )
          }) : <div className="card">No appointments today.</div>}
        </div>
      </div>
      <div className="grid">
        <div className="panel">
          <h2>Treatments Due Today</h2>
          {outstanding.length ? outstanding.slice(0,10).map(t => {
            const v = db.veterans.find(x => x.id === t.vetId)
            return <div key={t.id} className="card"><b>Room {v?.room||''} — {v?.name||''}</b><div>{t.type} · {t.category} · {t.shift}</div></div>
          }) : <div className="card">No outstanding treatments due.</div>}
        </div>
        <div className="panel">
          <h2>Unit Status</h2>
          <div className="card"><b>Veterans off unit</b><div>{offUnit.length ? offUnit.map(v => `Room ${v.room} — ${v.name} (${v.status})`).join(', ') : 'None'}</div></div>
          <div className="card"><b>Admissions within 24 hours</b><div>{newAdmits.length ? newAdmits.map(v => `Room ${v.room} — ${v.name}`).join(', ') : 'None'}</div></div>
          <div className="card"><b>Shift assignments</b><div>Day: {ROLES.filter(r => (x.day[r]||'').trim()).length}/{ROLES.length} | Night: {ROLES.filter(r => (x.night[r]||'').trim()).length}/{ROLES.length}</div></div>
        </div>
      </div>
    </div>
  )
}

function dateShiftGreeting(): string {
  const h = new Date().getHours()
  if (h >= 7 && h < 15) return 'Morning Brief Ready. Welcome to BravoShift.'
  if (h >= 15 && h < 23) return 'Afternoon Operations — unit ready for review.'
  return 'Night Watch Active. BravoShift standing by.'
}
