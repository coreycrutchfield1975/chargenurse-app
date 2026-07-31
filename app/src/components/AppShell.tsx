import type { ReactNode } from 'react';

export type AppPage = 'dashboard' | 'veterans' | 'appointments' | 'calendar' | 'transport' | 'staff' | 'morning-report' | 'shift-intelligence';

interface AppShellProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  children: ReactNode;
}

const navItems: Array<{ label: string; page?: AppPage }> = [
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'Veterans', page: 'veterans' },
  { label: 'Appointments', page: 'appointments' },
  { label: 'Calendar', page: 'calendar' },
  { label: 'Transport', page: 'transport' },
  { label: 'Treatments' },
  { label: 'Staff Assignments', page: 'staff' },
  { label: 'Morning Report', page: 'morning-report' },
  { label: 'Shift Intelligence', page: 'shift-intelligence' },
  { label: 'Managed Lists' },
];

export function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>BRAVOSHIFT</h1>
          <p>Nurse CommandPost Center</p>
          <span>Caring for those on Libertyville CLC</span>
        </div>
        <div className="version-badge">v2.7 Shift Intelligence Engine</div>
      </header>

      <div className="phi-warning">
        Do not enter real Veteran information or PHI in this public development build.
      </div>

      <nav className="top-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={item.page === activePage ? 'active' : ''}
            type="button"
            disabled={!item.page}
            title={!item.page ? 'Scheduled for a later migration package' : undefined}
            onClick={() => item.page && onNavigate(item.page)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main>{children}</main>
    </div>
  );
}
