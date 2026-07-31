import { useState } from 'react'
import type { BravoShiftDB, Appointment } from '../types'
import { esc } from '../db'

const D = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function localDS(d: Date) {
  const x = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return x.toISOString().slice(0, 10)
}

export function CalendarTab({ db, update, onEditAppt }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void; onEditAppt: (a: Appointment) => void }) {
  const [cal, setCal] = useState(new Date())
  const [view, setView] = useState<'month'|'week'|'day'|'year'>('month')
  const y = cal.getFullYear()
  const m = cal.getMonth()

  const navigate = (n: number) => {
    const d = new Date(cal)
    if (view === 'year') d.setFullYear(d.getFullYear() + n)
    else if (view === 'month') d.setMonth(d.getMonth() + n)
    else d.setDate(d.getDate() + n * (view === 'week' ? 7 : 1))
    setCal(d)
  }

  if (view === 'day') {
    const ds = localDS(cal)
    const apps = db.appointments.filter(a => a.date === ds && a.status !== 'Cancelled').sort((a,b) => a.time.localeCompare(b.time))
    return (
      <div>
        <div className="toolbar">
          <h2>Appointment Calendar</h2>
          <div className="calendar-controls">
            <button className="secondary" onClick={() => navigate(-1)}>◀</button>
            <button className="secondary" onClick={() => setCal(new Date())}>Today</button>
            <button className="secondary" onClick={() => navigate(1)}>▶</button>
            <strong>{cal.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric', year:'numeric'})}</strong>
            <button className={`secondary ${view==='day'?'primary':''}`} onClick={()=>setView('day')}>Day</button>
            <button className={`secondary ${view==='week'?'primary':''}`} onClick={()=>setView('week')}>Week</button>
            <button className={`secondary ${view==='month'?'primary':''}`} onClick={()=>setView('month')}>Month</button>
            <button className={`secondary ${view==='year'?'primary':''}`} onClick={()=>setView('year')}>Year</button>
          </div>
        </div>
        {apps.length ? apps.map(a => {
          const v = db.veterans.find(x => x.id === a.vetId)
          return <div key={a.id} className="card" style={{cursor:'pointer'}} onClick={() => onEditAppt(a)}><b>{a.time} — {esc(v?.name||'')}</b><div>{esc(a.clinic||a.destination||'')}</div></div>
        }) : <div className="card">No appointments.</div>}
      </div>
    )
  }

  if (view === 'week') {
    const d = new Date(cal); d.setDate(d.getDate() - d.getDay())
    return (
      <div>
        <div className="toolbar">
          <h2>Appointment Calendar</h2>
          <div className="calendar-controls">
            <button className="secondary" onClick={() => navigate(-1)}>◀</button>
            <button className="secondary" onClick={() => setCal(new Date())}>Today</button>
            <button className="secondary" onClick={() => navigate(1)}>▶</button>
            <strong>{cal.toLocaleDateString(undefined, {month:'long', year:'numeric'})}</strong>
            <button className={`secondary ${view==='day'?'primary':''}`} onClick={()=>setView('day')}>Day</button>
            <button className={`secondary ${view==='week'?'primary':''}`} onClick={()=>setView('week')}>Week</button>
            <button className={`secondary ${view==='month'?'primary':''}`} onClick={()=>setView('month')}>Month</button>
            <button className={`secondary ${view==='year'?'primary':''}`} onClick={()=>setView('year')}>Year</button>
          </div>
        </div>
        <div className="week">
          {Array.from({length:7}, (_,i) => {
            const x = new Date(d); x.setDate(d.getDate()+i)
            const ds = localDS(x)
            const apps = db.appointments.filter(a => a.date===ds && a.status!=='Cancelled').sort((a,b)=>a.time.localeCompare(b.time))
            return (
              <div key={i} className="weekcol">
                <h4>{x.toLocaleDateString(undefined, {weekday:'short',month:'short',day:'numeric'})}</h4>
                {apps.map(a => <div key={a.id} className="event" onClick={() => onEditAppt(a)}>{a.time} {esc(db.veterans.find(x=>x.id===a.vetId)?.name||'')}</div>)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (view === 'year') {
    return (
      <div>
        <div className="toolbar">
          <h2>Appointment Calendar</h2>
          <div className="calendar-controls">
            <button className="secondary" onClick={() => navigate(-1)}>◀</button>
            <button className="secondary" onClick={() => setCal(new Date())}>Today</button>
            <button className="secondary" onClick={() => navigate(1)}>▶</button>
            <strong>{y}</strong>
            <button className={`secondary ${view==='day'?'primary':''}`} onClick={()=>setView('day')}>Day</button>
            <button className={`secondary ${view==='week'?'primary':''}`} onClick={()=>setView('week')}>Week</button>
            <button className={`secondary ${view==='month'?'primary':''}`} onClick={()=>setView('month')}>Month</button>
            <button className={`secondary ${view==='year'?'primary':''}`} onClick={()=>setView('year')}>Year</button>
          </div>
        </div>
        <div className="year">
          {Array.from({length:12}, (_,i) => {
            const c = db.appointments.filter(a => new Date(a.date+'T12:00:00').getFullYear()===y && new Date(a.date+'T12:00:00').getMonth()===i && a.status!=='Cancelled').length
            return <button key={i} className="monthmini" onClick={() => { setCal(new Date(y,i,1)); setView('month') }}><b>{new Date(y,i,1).toLocaleDateString(undefined,{month:'long'})}</b><span className="apptcount">{c}</span><div>appointments</div></button>
          })}
        </div>
      </div>
    )
  }

  // Month view
  const first = new Date(y,m,1)
  const start = new Date(y,m,1-first.getDay())
  return (
    <div>
      <div className="toolbar">
        <h2>Appointment Calendar</h2>
        <div className="calendar-controls">
          <button className="secondary" onClick={() => navigate(-1)}>◀</button>
          <button className="secondary" onClick={() => setCal(new Date())}>Today</button>
          <button className="secondary" onClick={() => navigate(1)}>▶</button>
          <strong>{cal.toLocaleDateString(undefined, {month:'long', year:'numeric'})}</strong>
          <button className={`secondary ${view==='day'?'primary':''}`} onClick={()=>setView('day')}>Day</button>
          <button className={`secondary ${view==='week'?'primary':''}`} onClick={()=>setView('week')}>Week</button>
          <button className={`secondary ${view==='month'?'primary':''}`} onClick={()=>setView('month')}>Month</button>
          <button className={`secondary ${view==='year'?'primary':''}`} onClick={()=>setView('year')}>Year</button>
        </div>
      </div>
      <div className="calendar">
        {D.map(d => <div key={d} className="dayhead">{d}</div>)}
        {Array.from({length:42}, (_,i) => {
          const d = new Date(start); d.setDate(start.getDate()+i)
          const ds = localDS(d)
          const apps = db.appointments.filter(a => a.date===ds && a.status!=='Cancelled').sort((a,b)=>a.time.localeCompare(b.time))
          const muted = d.getMonth() !== m ? ' mutedday' : ''
          return (
            <div key={i} className={`calday${muted}`} onDoubleClick={() => onEditAppt({id:'',vetId:'',providerId:'',date:ds,time:'',clinic:'',reason:'Consult',destination:'',pickup:'',transport:'',escort:'',status:'Upcoming',notes:'',createdAt:'',updatedAt:''})}>
              <div className="date-num">{d.getDate()}</div>
              {apps.slice(0,4).map(a => <div key={a.id} className="event" onClick={() => onEditAppt(a)}>{a.time}</div>)}
              {apps.length > 4 && <div className="muted">+{apps.length-4} more</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
