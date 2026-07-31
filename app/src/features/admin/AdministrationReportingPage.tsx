import { useMemo, useRef, useState } from 'react';
import type { BravoShiftState } from '../../types/domain';
import {
  addSnapshot,
  countRecords,
  createBackup,
  downloadJson,
  findDuplicates,
  loadHistory,
  mergeStates,
  parseBackup,
  removeSnapshot,
  runIntegrityCheck,
  type VersionSnapshot,
} from './adminTools';

type Tab = 'overview' | 'integrity' | 'duplicates' | 'archives' | 'backup' | 'history';

interface Props {
  state: BravoShiftState;
  onReplaceState: (state: BravoShiftState) => void;
  onRestoreVeteran: (id: string) => void;
  onDeleteVeteran: (id: string) => void;
}

const formatDate = (value?: string) => value ? new Date(value).toLocaleString() : '—';
const fileDate = () => new Date().toISOString().replace(/[:.]/g, '-');

export function AdministrationReportingPage({ state, onReplaceState, onRestoreVeteran, onDeleteVeteran }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [history, setHistory] = useState<VersionSnapshot[]>(() => loadHistory());
  const [message, setMessage] = useState('');
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [snapshotReason, setSnapshotReason] = useState('Before administrative changes');
  const fileInput = useRef<HTMLInputElement>(null);
  const issues = useMemo(() => runIntegrityCheck(state), [state]);
  const duplicates = useMemo(() => findDuplicates(state), [state]);
  const archived = useMemo(() => state.veterans.filter((v) => v.status === 'Discharged / Archived'), [state.veterans]);
  const bytes = useMemo(() => new Blob([JSON.stringify(state)]).size, [state]);
  const errorCount = issues.filter((i) => i.severity === 'Error').length;
  const warningCount = issues.filter((i) => i.severity === 'Warning').length;

  function exportBackup() {
    downloadJson(createBackup(state), `bravoshift-backup-${fileDate()}.json`);
    setMessage('JSON backup downloaded. Store it in an approved secure location.');
  }

  function exportReport() {
    downloadJson({ generatedAt: new Date().toISOString(), recordCount: countRecords(state), integrityIssues: issues, duplicateGroups: duplicates }, `bravoshift-admin-report-${fileDate()}.json`);
    setMessage('Administration report downloaded.');
  }

  async function importBackup(file?: File) {
    if (!file) return;
    try {
      const envelope = parseBackup(await file.text());
      const next = restoreMode === 'merge' ? mergeStates(state, envelope.state) : envelope.state;
      const snapshot = addSnapshot(state, `Automatic snapshot before ${restoreMode} restore`);
      setHistory(snapshot);
      onReplaceState(next);
      setMessage(`${restoreMode === 'merge' ? 'Merged' : 'Restored'} backup from ${formatDate(envelope.exportedAt)} successfully.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Backup import failed.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function createSnapshot() {
    setHistory(addSnapshot(state, snapshotReason));
    setMessage('Local version snapshot created.');
  }

  function restoreSnapshot(snapshot: VersionSnapshot) {
    setHistory(addSnapshot(state, `Automatic snapshot before restoring ${snapshot.createdAt}`));
    onReplaceState(structuredClone(snapshot.state));
    setMessage(`Restored local snapshot from ${formatDate(snapshot.createdAt)}.`);
  }

  function permanentlyDeleteVeteran(id: string, name: string) {
    const linked = state.appointments.some((a) => a.veteranId === id) || state.travelRequests.some((t) => t.veteranId === id) || state.treatments.some((t) => t.veteranId === id);
    if (linked) {
      setMessage(`${name} still has linked clinical or operational records. Remove or relink them before permanent deletion.`);
      return;
    }
    if (!window.confirm(`Permanently delete archived record for ${name}? This cannot be undone unless you restore a backup.`)) return;
    setHistory(addSnapshot(state, `Before permanently deleting archived Veteran ${name}`));
    onDeleteVeteran(id);
    setMessage(`${name} was permanently deleted after a version snapshot was created.`);
  }

  return (
    <section className="feature-page admin-page">
      <div className="page-heading">
        <div><p className="eyebrow">Local administration</p><h2>Administration & Reporting</h2><p>Browser-only data maintenance, backup, archive management, and integrity reporting.</p></div>
        <div className="action-row no-print"><button type="button" className="secondary-button" onClick={exportReport}>Download Admin Report</button><button type="button" className="primary-button" onClick={exportBackup}>Download Full Backup</button></div>
      </div>

      <div className="local-only-banner"><strong>Static client-side architecture</strong><span>No server, API, .NET, Supabase, or database dependency. Data remains in this browser unless exported by the user.</span></div>
      {message && <div className="admin-message" role="status">{message}<button type="button" onClick={() => setMessage('')} aria-label="Dismiss">×</button></div>}

      <div className="metric-grid admin-metrics">
        <article className="metric-card"><span>Total records</span><strong>{countRecords(state)}</strong><small>{(bytes / 1024).toFixed(1)} KB local data</small></article>
        <article className="metric-card"><span>Integrity errors</span><strong>{errorCount}</strong><small>Require review</small></article>
        <article className="metric-card"><span>Warnings</span><strong>{warningCount}</strong><small>Potential cleanup</small></article>
        <article className="metric-card"><span>Duplicate groups</span><strong>{duplicates.length}</strong><small>Not automatically deleted</small></article>
        <article className="metric-card"><span>Archived Veterans</span><strong>{archived.length}</strong><small>Restorable records</small></article>
        <article className="metric-card"><span>Version snapshots</span><strong>{history.length}</strong><small>Stored in this browser</small></article>
      </div>

      <div className="admin-tabs no-print">
        {(['overview','integrity','duplicates','archives','backup','history'] as Tab[]).map((item) => <button type="button" key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item === 'backup' ? 'Backup / Restore' : item[0].toUpperCase() + item.slice(1)}</button>)}
      </div>

      {tab === 'overview' && <div className="panel-grid">
        <article className="panel"><h3>Data inventory</h3><div className="inventory-grid">{Object.entries(state).map(([key, rows]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><strong>{Array.isArray(rows) ? rows.length : 0}</strong></div>)}</div></article>
        <article className="panel"><h3>Administrative readiness</h3><ul className="readiness-list"><li className={errorCount ? 'risk' : 'good'}><b>{errorCount ? 'Action required' : 'Integrity clear'}</b><span>{errorCount} errors found</span></li><li className={duplicates.length ? 'watch' : 'good'}><b>{duplicates.length ? 'Duplicate review' : 'No duplicates'}</b><span>{duplicates.length} groups found</span></li><li className={history.length ? 'good' : 'watch'}><b>{history.length ? 'Version history active' : 'No snapshots'}</b><span>{history.length} local snapshots</span></li></ul></article>
        <article className="panel"><h3>Recommended routine</h3><ol><li>Run the integrity checker before major changes.</li><li>Create a local version snapshot.</li><li>Download a full JSON backup.</li><li>Store the file only in an approved secure location.</li><li>Test restore using non-production data.</li></ol></article>
        <article className="panel"><h3>Architecture boundary</h3><p>This package intentionally maintains the v1.8 browser-only pattern. A production backend, identity platform, shared storage, or VA infrastructure integration is outside this module and requires a separate approval decision.</p></article>
      </div>}

      {tab === 'integrity' && <article className="panel admin-table-panel"><div className="panel-title-row"><div><h3>Data integrity checker</h3><p>Checks required values, relationships, dates, archive consistency, duplicates, and browser-storage size.</p></div><button type="button" className="secondary-button" onClick={exportReport}>Export Results</button></div><div className="table-wrap"><table className="record-table"><thead><tr><th>Severity</th><th>Category</th><th>Collection</th><th>Finding</th><th>Recommended action</th></tr></thead><tbody>{issues.map((issue) => <tr key={issue.id}><td><span className={`status-pill severity-${issue.severity.toLowerCase()}`}>{issue.severity}</span></td><td>{issue.category}</td><td>{issue.collection}</td><td>{issue.message}</td><td>{issue.recommendation}</td></tr>)}</tbody></table></div></article>}

      {tab === 'duplicates' && <article className="panel"><h3>Duplicate detection</h3><p>Potential duplicates are listed for human review. BravoShift never merges or deletes them automatically.</p>{duplicates.length === 0 ? <p className="empty-state">No duplicate groups detected.</p> : <div className="duplicate-list">{duplicates.map((group) => <div className="duplicate-card" key={group.id}><div><span>{group.collection}</span><b>{group.reason}</b></div><h4>{group.label}</h4><p>{group.recordIds.length} matching records</p><code>{group.recordIds.join(', ')}</code></div>)}</div>}</article>}

      {tab === 'archives' && <article className="panel admin-table-panel"><h3>Archived record manager</h3><p>Restore discharged/archived Veterans or permanently delete records only when no operational records remain linked.</p><div className="table-wrap"><table className="record-table"><thead><tr><th>Veteran</th><th>Room</th><th>Archived</th><th>Linked records</th><th>Actions</th></tr></thead><tbody>{archived.length === 0 ? <tr><td colSpan={5}>No archived Veteran records.</td></tr> : archived.map((v) => { const links = state.appointments.filter((a) => a.veteranId === v.id).length + state.travelRequests.filter((t) => t.veteranId === v.id).length + state.treatments.filter((t) => t.veteranId === v.id).length; return <tr key={v.id}><td><b>{v.name}</b><small>{v.last4 ? `Last 4: ${v.last4}` : ''}</small></td><td>{v.room || '—'}</td><td>{formatDate(v.archivedAt)}</td><td>{links}</td><td><div className="compact-actions"><button type="button" className="secondary-button" onClick={() => onRestoreVeteran(v.id)}>Restore</button><button type="button" className="danger-outline" onClick={() => permanentlyDeleteVeteran(v.id, v.name)}>Delete permanently</button></div></td></tr>; })}</tbody></table></div></article>}

      {tab === 'backup' && <div className="panel-grid">
        <article className="panel"><h3>Download backup</h3><p>Creates one portable JSON file containing all BravoShift localStorage application data and version metadata.</p><button type="button" className="primary-button" onClick={exportBackup}>Download JSON Backup</button><p className="fine-print">The backup is not encrypted by BravoShift. Handle it according to facility policy.</p></article>
        <article className="panel"><h3>Restore or merge backup</h3><label>Import mode<select value={restoreMode} onChange={(e) => setRestoreMode(e.target.value as 'replace' | 'merge')}><option value="replace">Replace all current data</option><option value="merge">Merge by record ID</option></select></label><input ref={fileInput} type="file" accept="application/json,.json" onChange={(e) => importBackup(e.target.files?.[0])} /><p className="fine-print">A version snapshot is created automatically before import. Replace mode overwrites the current application state.</p></article>
        <article className="panel"><h3>Backup contents</h3><div className="inventory-grid">{Object.entries(state).map(([key, rows]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><strong>{Array.isArray(rows) ? rows.length : 0}</strong></div>)}</div></article>
        <article className="panel"><h3>Restore safeguards</h3><ul><li>Requires the BravoShift backup format identifier.</li><li>Rejects unsupported newer schema versions.</li><li>Creates a pre-restore local snapshot.</li><li>Normalizes restored records through the existing storage loader after save/reload.</li></ul></article>
      </div>}

      {tab === 'history' && <div className="panel-grid history-layout"><article className="panel"><h3>Create version snapshot</h3><label>Reason<input value={snapshotReason} onChange={(e) => setSnapshotReason(e.target.value)} /></label><button type="button" className="primary-button" onClick={createSnapshot}>Create Local Snapshot</button><p className="fine-print">The newest {20} snapshots are kept in this browser. Downloaded backups remain the safer portable recovery method.</p></article><article className="panel history-list-panel"><h3>Version history</h3>{history.length === 0 ? <p className="empty-state">No local snapshots yet.</p> : <div className="history-list">{history.map((snapshot) => <div className="history-card" key={snapshot.id}><div><b>{snapshot.reason}</b><span>{formatDate(snapshot.createdAt)} · v{snapshot.appVersion} · {snapshot.recordCount} records</span></div><div className="compact-actions"><button type="button" className="secondary-button" onClick={() => restoreSnapshot(snapshot)}>Restore</button><button type="button" className="danger-outline" onClick={() => setHistory(removeSnapshot(snapshot.id))}>Remove</button></div></div>)}</div>}</article></div>}
    </section>
  );
}
