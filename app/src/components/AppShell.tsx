import type { ReactNode } from 'react';

export type AppPage = 'dashboard' | 'veterans';

interface AppShellProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  children: ReactNode;
}

const navItems: Array<{ label: string; page?: AppPage }> = [
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'Veterans', page: 'veterans' },
  { label: 'Appointments' },
  { label: 'Calendar' },
  { label: 'Transport' },
  { label: 'Treatments' },
  { label: 'Staff Assignments' },
  { label: 'Morning Report' },
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
        <div className="version-badge">v2.0 Veteran Master Record</div>
      </header>

      <div className="phi-warning">
        Do not enter real Veteran information or PHI in this public development build.
      </div>

      <nav className="top-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = item.page === activePage;
          return (
            <button
              key={item.label}
              className={active ? 'active' : ''}
              type="button"
              disabled={!item.page}
              title={!item.page ? 'Scheduled for a later migration package' : undefined}
              onClick={() => item.page && onNavigate(item.page)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <main>{children}</main>
    </div>
  );
}
