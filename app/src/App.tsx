import { useEffect, useState } from 'react';
import { AppShell, type AppPage } from './components/AppShell';
import { Dashboard } from './features/dashboard/Dashboard';
import { VeteranMasterRecord } from './features/veterans/VeteranMasterRecord';
import { loadState, saveState } from './lib/storage';
import type { BravoShiftState, Veteran } from './types/domain';

export default function App() {
  const [state, setState] = useState<BravoShiftState>(() => loadState());
  const [activePage, setActivePage] = useState<AppPage>('dashboard');

  useEffect(() => {
    saveState(state);
  }, [state]);

  function upsertVeteran(veteran: Veteran) {
    setState((current) => {
      const exists = current.veterans.some((item) => item.id === veteran.id);
      return {
        ...current,
        veterans: exists
          ? current.veterans.map((item) => (item.id === veteran.id ? veteran : item))
          : [...current.veterans, veteran],
      };
    });
  }

  function archiveVeteran(id: string) {
    const timestamp = new Date().toISOString();
    setState((current) => ({
      ...current,
      veterans: current.veterans.map((veteran) =>
        veteran.id === id
          ? {
              ...veteran,
              status: 'Discharged / Archived',
              archivedAt: timestamp,
              updatedAt: timestamp,
            }
          : veteran,
      ),
    }));
  }

  function restoreVeteran(id: string) {
    const timestamp = new Date().toISOString();
    setState((current) => ({
      ...current,
      veterans: current.veterans.map((veteran) =>
        veteran.id === id
          ? {
              ...veteran,
              status: 'Active',
              archivedAt: undefined,
              updatedAt: timestamp,
            }
          : veteran,
      ),
    }));
  }

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'dashboard' ? (
        <Dashboard state={state} onAddVeteran={() => setActivePage('veterans')} />
      ) : (
        <VeteranMasterRecord
          veterans={state.veterans}
          onSave={upsertVeteran}
          onArchive={archiveVeteran}
          onRestore={restoreVeteran}
        />
      )}
    </AppShell>
  );
}
