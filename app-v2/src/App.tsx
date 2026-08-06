import { useState, useCallback } from 'react'
import type { BravoShiftDB, Appointment } from './types'
import { load, save } from './db'
import { Dashboard } from './tabs/Dashboard'
import { VeteransTab } from './tabs/Veterans'
import { AppointmentsTab } from './tabs/Appointments'
import { CalendarTab } from './tabs/Calendar'
import { TransportTab } from './tabs/Transport'
import { TreatmentsTab } from './tabs/Treatments'
import { StaffTab } from './tabs/Staff'
import { MorningReport } from './tabs/MorningReport'
import { ManagedLists } from './tabs/ManagedLists'
import { Header } from './components/Header'

import './index.css'

type Tab = 'dashboard'|'veterans'|'appointments'|'calendar'|'transport'|'treatments'|'staff'|'morning-report'|'managed-lists'

export default function App() {
  const [db, setDB] = useState<BravoShiftDB>(() => load())
  const [tab, setTab] = useState<Tab>('dashboard')

  const persist = useCallback((next: BravoShiftDB) => { setDB(next); save(next) }, [])

  return (
    <>
      <Header />
      <Nav active={tab} onChange={(t: string) => setTab(t as Tab)} />

      <main className="main-content">
        {tab === 'dashboard' && <Dashboard db={db} />}
        {tab === 'veterans' && <VeteransTab db={db} update={persist} />}
        {tab === 'appointments' && <AppointmentsTab db={db} update={persist} />}
        {tab === 'calendar' && <CalendarTab db={db} update={persist} onEditAppt={(a: Appointment) => { /* prefill */ setTab('appointments') }} />}
        {tab === 'transport' && <TransportTab db={db} update={persist} />}
        {tab === 'treatments' && <TreatmentsTab db={db} update={persist} />}
        {tab === 'staff' && <StaffTab db={db} update={persist} />}
        {tab === 'morning-report' && <MorningReport db={db} update={persist} />}
        {tab === 'managed-lists' && <ManagedLists db={db} update={persist} />}
      </main>
    </>
  )
}
