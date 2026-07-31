export function Header() {
  return (
    <header className="app-header">
      <h1>BRAVOSHIFT</h1>
      <div className="brandline">Nurse CommandPost Center</div>
      <div className="sub">React v2 · Libertyville CLC test data · local browser storage</div>
    </header>
  )
}

export function Nav({ active, onChange }: { active: string; onChange: (t: any) => void }) {
  const tabs: [string,string][] = [
    ['dashboard','Dashboard'],['veterans','Veterans'],['appointments','Appointments'],
    ['calendar','Calendar'],['transport','Transport'],['treatments','Treatments'],
    ['staff','Staff Assignments'],['morning-report','Morning Report'],['managed-lists','Managed Lists']
  ]
  return (
    <nav className="app-nav">
      {tabs.map(([id,label]) => (
        <button key={id} className={active===id?'active':''} onClick={() => onChange(id)}>{label}</button>
      ))}
    </nav>
  )
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {title && <div className="modal-header"><h2>{title}</h2><button onClick={onClose}>Close</button></div>}
        {children}
      </div>
    </div>
  )
}
