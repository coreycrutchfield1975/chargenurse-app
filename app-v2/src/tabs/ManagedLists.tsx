import { useState } from 'react'
import type { BravoShiftDB } from '../types'
import { LIST_LABELS, activeList, esc } from '../db'

export function ManagedLists({ db, update }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void }) {
  const [sel, setSel] = useState<string>(Object.keys(LIST_LABELS)[0])
  const [val, setVal] = useState('')
  const items = db.managedLists[sel] || []

  const add = () => {
    const v = val.trim()
    if (!v) return
    if (items.some(x => x.value.toLowerCase() === v.toLowerCase() && x.active)) {
      alert('That value already exists.'); return
    }
    const archived = items.find(x => x.value.toLowerCase() === v.toLowerCase() && !x.active)
    if (archived) {
      update({ ...db, managedLists: { ...db.managedLists, [sel]: items.map(x => x.id === archived.id ? { ...x, active: true } : x) } })
    } else {
      update({ ...db, managedLists: { ...db.managedLists, [sel]: [...items, { id: sel+'-'+Date.now(), value: v, active: true }] } })
    }
    setVal('')
  }

  const toggle = (id: string) => {
    update({ ...db, managedLists: { ...db.managedLists, [sel]: items.map(x => x.id === id ? { ...x, active: !x.active } : x) } })
  }

  return (
    <div>
      <div className="toolbar"><h2>Managed Lists</h2></div>
      <div className="grid">
        <div className="panel">
          <h3>Clinical & Workflow Lists</h3>
          <p className="muted">Add values once — they appear in all dropdowns across BravoShift.</p>
          <div className="formgrid">
            <div className="span2">
              <label>List</label>
              <select value={sel} onChange={e => setSel(e.target.value)}>
                {Object.entries(LIST_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="span2">
              <label>New Value</label>
              <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key==='Enter' && (e.preventDefault(), add())} placeholder="Enter a new list value" />
            </div>
            <div className="span4"><button className="primary" onClick={add}>Add Value</button></div>
          </div>
          <h4>{LIST_LABELS[sel]}</h4>
          <table className="usa-table">
            <thead><tr><th>Value</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {items.map(x => (
                <tr key={x.id} className={x.active?'':'archived'}>
                  <td>{esc(x.value)}</td>
                  <td><span className={`badge ${x.active?'confirmed':'cancelled'}`}>{x.active?'Active':'Archived'}</span></td>
                  <td><button className="secondary" onClick={() => toggle(x.id)}>{x.active?'Archive':'Restore'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3>Providers / Clinics</h3>
          <ProviderManager db={db} update={update} />
        </div>
      </div>
    </div>
  )
}

function ProviderManager({ db, update }: { db: BravoShiftDB; update: (db: BravoShiftDB) => void }) {
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [facility, setFacility] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')

  const addProvider = () => {
    if (!name.trim()) return
    update({ ...db, providers: [...db.providers, { id:'p'+Date.now(), name:name.trim(), specialty:specialty.trim(), facility:facility.trim(), city:city.trim(), phone:phone.trim(), active:true }] })
    setName(''); setSpecialty(''); setFacility(''); setCity(''); setPhone('')
  }

  const toggleProv = (id: string) => {
    update({ ...db, providers: db.providers.map(p => p.id===id ? {...p, active:!p.active} : p) })
  }

  return (
    <div>
      <div className="formgrid">
        <div className="span2"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} list="specData" /></div>
        <div><label>Specialty</label><input value={specialty} onChange={e => setSpecialty(e.target.value)} list="specData" /></div>
        <div><label>Facility</label><input value={facility} onChange={e => setFacility(e.target.value)} list="facData" /></div>
        <div><label>City</label><input value={city} onChange={e => setCity(e.target.value)} /></div>
        <div><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
        <div><label>&nbsp;</label><button className="primary" onClick={addProvider}>Add Provider</button></div>
      </div>
      <datalist id="specData">{activeList(db,'specialties').map(s => <option key={s} value={s} />)}</datalist>
      <datalist id="facData">{activeList(db,'facilities').map(s => <option key={s} value={s} />)}</datalist>
      <table className="usa-table">
        <thead><tr><th>Name</th><th>Specialty</th><th>Facility</th><th>City</th><th>Phone</th><th>Status</th></tr></thead>
        <tbody>
          {db.providers.map(p => (
            <tr key={p.id} className={p.active?'':'archived'}>
              <td>{esc(p.name)}</td><td>{esc(p.specialty)}</td><td>{esc(p.facility)}</td><td>{esc(p.city)}</td><td>{esc(p.phone)}</td>
              <td><span className={`badge ${p.active?'confirmed':'cancelled'}`}>{p.active?'Active':'Archived'}</span> <button className="secondary" onClick={() => toggleProv(p.id)}>{p.active?'Archive':'Restore'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
