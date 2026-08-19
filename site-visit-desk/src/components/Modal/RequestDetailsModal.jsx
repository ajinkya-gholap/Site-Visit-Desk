import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './RequestDetailsModal.module.css';

export default function RequestDetailsModal({ request, onClose, triggerElement }) {
  const dialogRef = useRef(null);
  const headingId = 'request-details-heading';

  // Escape closes the modal; listener added on mount and removed on unmount (3.6/3.11).
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll while open, move focus into the dialog, and restore focus
  // to the button that opened it when the modal unmounts (3.11).
  useEffect(() => {
    document.body.classList.add('modal-open');
    dialogRef.current?.focus();
    return () => {
      document.body.classList.remove('modal-open');
      triggerElement?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const target = document.getElementById('modal-root');
  if (!target || !request) return null;

  // Clicking the backdrop closes the modal; clicking inside it must not, so we
  // stop propagation on the dialog panel itself rather than checking e.target
  // on the backdrop — this keeps the close logic in one place (the backdrop's
  // own onClick) and avoids any nested-element edge cases.
  const stopPropagation = (e) => e.stopPropagation();

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        ref={dialogRef}
        tabIndex={-1}
        onClick={stopPropagation}
      >
        <div className={styles.dialogHeader}>
          <h2 id={headingId} className={styles.dialogTitle}>
            {request.siteName}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close details">
            ×
          </button>
        </div>

        <dl className={styles.detailGrid}>
          <Detail label="Request ID" value={request.id} />
          <Detail label="Site code" value={request.siteCode} />
          <Detail label="Category" value={request.category} />
          <Detail label="Severity" value={request.severity} />
          <Detail label="Status" value={request.status} />
          <Detail label="Visit date" value={request.visitDate} />
          <Detail label="Requester" value={request.requesterName} />
          <Detail label="Contact email" value={request.contactEmail} />
          <Detail label="Preferred contact" value={request.preferredContact} />
          <Detail label="Access approved" value={request.accessApproved ? 'Yes' : 'No'} />
          <Detail label="Affected services" value={request.services.join(', ')} full />
          {request.notifyTeams?.length > 0 && (
            <Detail label="Notify teams" value={request.notifyTeams.join(', ')} full />
          )}
          {request.escalationContact && (
            <Detail label="Escalation contact" value={request.escalationContact} full />
          )}
          {request.notes && <Detail label="Notes" value={request.notes} full />}
        </dl>
      </div>
    </div>,
    target
  );
}

function Detail({ label, value, full }) {
  return (
    <div className={full ? styles.detailFull : styles.detailItem}>
      <dt className={styles.detailLabel}>{label}</dt>
      <dd className={styles.detailValue}>{value}</dd>
    </div>
  );
}
