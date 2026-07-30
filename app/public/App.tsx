import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { Dashboard } from './features/dashboard/Dashboard';
import { loadState, saveState } from './lib/storage';
import type { BravoShiftState } from './types/domain';

export default function App() {
  const [state] = useState<BravoShiftState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppShell>
      <Dashboard state={state} />
    </AppShell>
  );
}
