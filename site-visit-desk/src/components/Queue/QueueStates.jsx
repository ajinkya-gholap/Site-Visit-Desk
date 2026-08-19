import styles from './Queue.module.css';

export function QueueSkeleton() {
  return (
    <ul className={styles.list} aria-busy="true" aria-label="Loading requests">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonLine} style={{ width: '55%' }} />
          <div className={styles.skeletonLine} style={{ width: '80%' }} />
          <div className={styles.skeletonLine} style={{ width: '40%' }} />
        </li>
      ))}
    </ul>
  );
}

export function QueueError({ onRetry }) {
  return (
    <div className={styles.stateBox}>
      <p className={styles.stateIcon} aria-hidden="true">⚠</p>
      <h3 className={styles.stateTitle}>Couldn't load the queue</h3>
      <p className={styles.stateText}>There was a network error while loading requests.</p>
      <button type="button" className={styles.retryBtn} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function QueueEmpty() {
  return (
    <div className={styles.stateBox}>
      <p className={styles.stateIcon} aria-hidden="true">🗂</p>
      <h3 className={styles.stateTitle}>No requests yet</h3>
      <p className={styles.stateText}>Raise a new site visit request using the form to get started.</p>
    </div>
  );
}

export function QueueNoMatch({ onClear }) {
  return (
    <div className={styles.stateBox}>
      <p className={styles.stateIcon} aria-hidden="true">🔍</p>
      <h3 className={styles.stateTitle}>No requests match your filters</h3>
      <p className={styles.stateText}>Try clearing the search or filters below.</p>
      <button type="button" className={styles.retryBtn} onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
