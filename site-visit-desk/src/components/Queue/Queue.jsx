import { useMemo, useState } from 'react';
import QueueToolbar from './QueueToolbar.jsx';
import RequestList from './RequestList.jsx';
import { QueueSkeleton, QueueError, QueueEmpty, QueueNoMatch } from './QueueStates.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import styles from './Queue.module.css';

const SEVERITY_RANK = { Low: 0, Medium: 1, High: 2, Critical: 3 };

export default function Queue({ requests, loading, error, onRetry, onOpenDetails, onAdvanceStatus, onDelete, addToast }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [sort, setSort] = useState('date-asc');

  // Search is debounced ~300ms so filtering doesn't run on every keystroke (3.6).
  const debouncedSearch = useDebouncedValue(search, 300);

  // Filtering, searching and sorting are derived during render — not stored as a
  // second duplicate array in state (3.8).
  const visibleRequests = useMemo(() => {
    let result = requests;

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (r) => r.siteName.toLowerCase().includes(q) || r.requesterName.toLowerCase().includes(q)
      );
    }
    if (status) result = result.filter((r) => r.status === status);
    if (severity) result = result.filter((r) => r.severity === severity);

    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sort === 'date-asc') return a.visitDate.localeCompare(b.visitDate);
      if (sort === 'date-desc') return b.visitDate.localeCompare(a.visitDate);
      if (sort === 'severity-desc') return SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
      if (sort === 'severity-asc') return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      return 0;
    });
    return sorted;
  }, [requests, debouncedSearch, status, severity, sort]);

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setSeverity('');
  };

  const handleCopyId = (id, e) => {
    navigator.clipboard?.writeText(id).catch(() => {});
    const rect = e.currentTarget.getBoundingClientRect();
    addToast(`Copied ${id} to clipboard`, 'info', { x: rect.left, y: rect.top });
  };

  const hasFiltersApplied = Boolean(search || status || severity);

  const renderBody = () => {
    if (loading) return <QueueSkeleton />;
    if (error) return <QueueError onRetry={onRetry} />;
    if (requests.length === 0) return <QueueEmpty />;
    if (visibleRequests.length === 0) return <QueueNoMatch onClear={clearFilters} />;
    return (
      <RequestList
        requests={visibleRequests}
        onOpenDetails={onOpenDetails}
        onAdvanceStatus={onAdvanceStatus}
        onDelete={onDelete}
        onCopyId={handleCopyId}
      />
    );
  };

  return (
    <section className={styles.queue} aria-label="Request queue">
      <QueueToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        severity={severity}
        onSeverityChange={setSeverity}
        sort={sort}
        onSortChange={setSort}
      />
      {!loading && !error && (
        <p className={styles.resultCount}>
          {visibleRequests.length} of {requests.length} request{requests.length === 1 ? '' : 's'}
          {hasFiltersApplied ? ' matching filters' : ''}
        </p>
      )}
      {renderBody()}
    </section>
  );
}
