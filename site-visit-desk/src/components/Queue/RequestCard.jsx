import { cx } from '../../utils/cx.js';
import styles from './Queue.module.css';

const SEVERITY_CLASS = {
  Low: styles['badge--low'],
  Medium: styles['badge--medium'],
  High: styles['badge--high'],
  Critical: styles['badge--critical'],
};

const STATUS_CLASS = {
  Open: styles['status--open'],
  'In Progress': styles['status--progress'],
  Closed: styles['status--closed'],
};

const isOverdue = (request) => {
  if (request.status === 'Closed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(request.visitDate + 'T00:00:00') < today;
};

export default function RequestCard({ request, onOpenDetails, onAdvanceStatus, onDelete, onCopyId }) {
  const overdue = isOverdue(request);

  // Right tool per case (3.7): a small lookup map picks the action label/handler
  // by status instead of a chain of ternaries.
  const actionByStatus = {
    Open: { label: 'Assign', next: 'In Progress' },
    'In Progress': { label: 'Close', next: 'Closed' },
    Closed: null,
  };
  const action = actionByStatus[request.status];

  return (
    <li className={cx(styles.card, overdue && styles['card--overdue'], request.status === 'Closed' && styles['card--dim'])}>
      <div className={styles.cardHeader}>
        <button
          type="button"
          className={styles.cardTitleBtn}
          onClick={(e) => onOpenDetails(request, e.currentTarget)}
        >
          {request.siteName}
        </button>
        <span className={cx(styles.badge, SEVERITY_CLASS[request.severity])}>{request.severity}</span>
      </div>

      <p className={styles.cardMeta}>
        {request.siteCode} · {request.category} · requested by {request.requesterName}
      </p>

      <div className={styles.cardFooter}>
        <span className={cx(styles.status, STATUS_CLASS[request.status])}>{request.status}</span>
        {overdue && (
          <span className={styles.overdueFlag}>
            ⚠ Overdue
          </span>
        )}
        <span className={styles.visitDate}>Visit: {request.visitDate}</span>
      </div>

      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={(e) => onCopyId(request.id, e)}
        >
          Copy request ID
        </button>

        {action ? (
          <button type="button" className={styles.actionBtn} onClick={() => onAdvanceStatus(request.id, action.next)}>
            {action.label}
          </button>
        ) : (
          <span className={styles.noAction}>No action</span>
        )}

        <button type="button" className={styles.deleteBtn} onClick={() => onDelete(request.id)} aria-label={`Delete request for ${request.siteName}`}>
          Delete
        </button>
      </div>
    </li>
  );
}
