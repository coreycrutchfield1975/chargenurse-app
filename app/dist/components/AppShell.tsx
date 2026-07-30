import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  'Dashboard',
  'Veterans',
  'Appointments',
  'Calendar',
  'Transport',
  'Treatments',
  'Staff Assignments',
  'Morning Report',
  'Managed Lists',
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>BRAVOSHIFT</h1>
          <p>Nurse CommandPost Center</p>
          <span>Caring for those on Libertyville CLC</span>
        </div>
        <div className="version-badge">v2.0 Foundation</div>
      </header>

      <div className="phi-warning">
        Do not enter real Veteran information or PHI in this public development build.
      </div>

      <nav className="top-nav" aria-label="Primary navigation">
        {navItems.map((item, index) => (
          <button key={item} className={index === 0 ? 'active' : ''} type="button">
            {item}
          </button>
        ))}
      </nav>

      <main>{children}</main>
    </div>
  );
}
