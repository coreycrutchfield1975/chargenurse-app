import { useMemo, useState } from 'react';
import type { Veteran } from '../../types/domain';
import { VeteranForm } from './VeteranForm';

interface VeteranMasterRecordProps {
  veterans: Veteran[];
  onSave: (veteran: Veteran) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

type RecordFilter = 'active' | 'archived' | 'all';

function daysOnUnit(admissionDate: string): number | '—' {
  if (!admissionDate) return '—';
  const admission = new Date(`${admissionDate}T12:00:00`);
  const today = new Date();
  const milliseconds = today.setHours(12, 0, 0, 0) - admission.getTime();
  return Math.max(0, Math.floor(milliseconds / 86_400_000));
}

export function VeteranMasterRecord({ veterans, onSave, onArchive, onRestore }: VeteranMasterRecordProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<RecordFilter>('active');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const editingVeteran = veterans.find((veteran) => veteran.id === editingId);
  const filteredVeterans = useMemo(() => {
    const query = search.trim().toLowerCase();
    return veterans
      .filter((veteran) => {
        const archived = veteran.status === 'Discharged / Archived';
        if (filter === 'active' && archived) return false;
        if (filter === 'archived' && !archived) return false;
        if (!query) return true;
        return [veteran.name, veteran.last4, veteran.room, veteran.provider, veteran.specialty, veteran.status]
          .some((value) => value.toLowerCase().includes(query));
      })
      .sort((a, b) => a.room.localeCompare(b.room, undefined, { numeric: true }));
  }, [filter, search, veterans]);

  function beginAdd() {
    setEditingId(null);
    setFormOpen(true);
  }

  function beginEdit(id: string) {
    setEditingId(id);
    setFormOpen(true);
  }

  function save(veteran: Veteran) {
    onSave(veteran);
    setEditingId(null);
    setFormOpen(false);
  }

  if (formOpen) {
    return <VeteranForm veteran={editingVeteran} veterans={veterans} onSave={save} onCancel={() => setFormOpen(false)} />;
  }

  const activeCount = veterans.filter((veteran) => veteran.status !== 'Discharged / Archived').length;
  const archivedCount = veterans.length - activeCount;

  return (
    <section>
      <div className="page-heading">
        <div>
          <h1>Veteran Master Record</h1>
          <p>One authoritative record per Veteran. Records are archived rather than deleted.</p>
        </div>
        <button className="primary-button" type="button" onClick={beginAdd}>Add Veteran</button>
      </div>

      <div className="summary-strip" aria-label="Veteran record summary">
        <span><strong>{activeCount}</strong> active</span>
        <span><strong>{archivedCount}</strong> archived</span>
        <span><strong>{veterans.length}</strong> total records</span>
      </div>

      <div className="filter-panel">
        <label className="search-field">
          Search Veteran records
          <input placeholder="Name, last 4, room, provider, specialty..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          Record view
          <select value={filter} onChange={(e) => setFilter(e.target.value as RecordFilter)}>
            <option value="active">Active records</option>
            <option value="archived">Archived records</option>
            <option value="all">All records</option>
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table className="record-table">
          <thead>
            <tr><th>Room</th><th>Veteran</th><th>Status</th><th>Provider / Specialty</th><th>Days on unit</th><th>Safety / mobility</th><th>Care details</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredVeterans.map((veteran) => {
              const archived = veteran.status === 'Discharged / Archived';
              return (
                <tr key={veteran.id} className={archived ? 'archived-row' : ''}>
                  <td><strong>{veteran.room}</strong></td>
                  <td><strong>{veteran.name}</strong><small>Last 4: {veteran.last4}</small></td>
                  <td><span className={`status-badge status-${veteran.status.toLowerCase().replaceAll(' ', '-').replaceAll('/', '-')}`}>{veteran.status}</span></td>
                  <td>{veteran.provider || '—'}<small>{veteran.specialty || 'No specialty entered'}</small></td>
                  <td>{daysOnUnit(veteran.admissionDate)}</td>
                  <td>{veteran.mobility || '—'}<small>Fall risk: {veteran.fallRisk || 'Not entered'} · Code: {veteran.codeStatus || 'Not entered'}</small></td>
                  <td>{veteran.diet || 'No diet entered'}<small>{[veteran.medicationMethod, veteran.isolation, veteran.assistLevel, veteran.toileting].filter(Boolean).join(' · ') || 'No additional care details'}</small></td>
                  <td>
                    <div className="table-actions">
                      <button type="button" onClick={() => beginEdit(veteran.id)}>Edit</button>
                      {archived ? (
                        <button type="button" onClick={() => onRestore(veteran.id)}>Restore</button>
                      ) : (
                        <button className="danger-link" type="button" onClick={() => onArchive(veteran.id)}>Archive</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filteredVeterans.length && (
              <tr><td colSpan={8} className="empty-state">No Veteran records match the current view.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
