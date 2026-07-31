import { useState, useMemo } from 'react'
import type { BravoShiftDB } from '../types'
import { today, esc } from '../db'
import { Modal } from '../components/Header'

export function TransportTab({ db, update }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void }) {
  const [search, setSearch] = useState('')
  const [stFilter, setStFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const relevant = useMemo(() => db.appointments
    .filter(a => a.status !== 'Cancelled' && a.status !== 'Completed' && a.date >= today())
    .map(a => ({ a, tr: db.travel[a.id], v: db.veterans.find(x => x.id === a.vetId), p: db.providers.find(x => x.id === a.providerId) })), [db])

  const needs = relevant.filter(x => x.a.transport && !x.tr)
  const action = relevant.filter(x => ['Draft','Failed'].includes(x.tr?.status||''))
  const confirmed = relevant.filter(x => x.tr?.status === 'Confirmed')

  const filtered = useMemo(() => {
    let rows = [...relevant]
    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(x => [x.v?.name,x.v?.last4,String(x.v?.room),x.a.destination,x.p?.facility,x.a.escort,x.tr?.escort,x.a.transport,x.tr?.mode,x.tr?.reference].join(' ').toLowerCase().includes(q))
    }
    const effective = (x: typeof rows[0]) => x.tr?.status || 'Needs Request'
    if (stFilter) rows = rows.filter(x => effective(x) === stFilter)
    if (dateFilter) rows = rows.filter(x => x.a.date === dateFilter)
    return rows.sort((x,y) => (x.a.date+(x.tr?.pickup||x.a.pickup||x.a.time)).localeCompare(y.a.date+(y.tr?.pickup||y.a.pickup||y.a.time)))
  }, [relevant, search, stFilter, dateFilter])

  return (
    <div>
      <div className="toolbar"><h2>Transportation & Travel Requests</h2><button className="primary orange" onClick={() => {}}>Create Travel Request</button></div>
      <div className="stats">
        <div className="stat s-purple"><span>Needs Request</span><b>{needs.length}</b></div>
        <div className="stat s-blue"><span>Draft / Failed</span><b>{action.length}</b></div>
        <div className="stat s-teal"><span>Confirmed</span><b>{confirmed.length}</b></div>
        <div className="stat s-red"><span>Today Pickups</span><b>{relevant.filter(x=>x.a.date===today()&&(x.tr?.status==='Confirmed'||x.a.transport)).length}</b></div>
      </div>
      <div className="panel">
        <div className="formgrid">
          <div><label>Search</label><input placeholder="Veteran, room, destination..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div><label>Status</label><select value={stFilter} onChange={e => setStFilter(e.target.value)}><option value="">All</option><option>Needs Request</option><option>Draft</option><option>Confirmed</option><option>Failed</option><option>Cancelled</option></select></div>
          <div><label>Date</label><input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} /></div>
        </div>
      </div>
      <div className="scroll">
        <table className="usa-table">
          <thead><tr><th>Date</th><th>Pickup</th><th>Veteran</th><th>Destination</th><th>Mode</th><th>Status</th><th>Reference</th></tr></thead>
          <tbody>
            {filtered.map(x => {
              const st = x.tr?.status || 'Needs Request'
              return (
                <tr key={x.a.id}>
                  <td>{x.a.date}<br/><span className="muted">Appt {x.a.time}</span></td>
                  <td>{esc(x.tr?.pickup||x.a.pickup||'')}</td>
                  <td>{x.v?.room||''} — {esc(x.v?.name||'')}<br/><span className="muted">{esc(x.v?.last4||'')}</span></td>
                  <td>{esc(x.tr?.destination||x.a.destination||x.p?.facility||'')}</td>
                  <td>{esc(x.tr?.mode||x.a.transport||'')}</td>
                  <td><span className={`badge ${st.toLowerCase().replace(/\s/g,'')}`}>{st}</span></td>
                  <td>{esc(x.tr?.reference||'')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
