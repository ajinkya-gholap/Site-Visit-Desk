import { STATUSES, SEVERITIES } from '../../data/constants.js';
import styles from './Queue.module.css';

export default function QueueToolbar({ search, onSearchChange, status, onStatusChange, severity, onSeverityChange, sort, onSortChange }) {
  return (
    <div className={styles.toolbar}>
      <input
        type="search"
        className={styles.search}
        placeholder="Search site or requester…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search requests by site name or requester"
      />

      <select
        className={styles.select}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={severity}
        onChange={(e) => onSeverityChange(e.target.value)}
        aria-label="Filter by severity"
      >
        <option value="">All severities</option>
        {SEVERITIES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort requests"
      >
        <option value="date-asc">Date ↑ (soonest first)</option>
        <option value="date-desc">Date ↓ (latest first)</option>
        <option value="severity-desc">Severity (high → low)</option>
        <option value="severity-asc">Severity (low → high)</option>
      </select>
    </div>
  );
}
