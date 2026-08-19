import RequestCard from './RequestCard.jsx';
import styles from './Queue.module.css';

export default function RequestList({ requests, onOpenDetails, onAdvanceStatus, onDelete, onCopyId }) {
  return (
    <ul className={styles.list}>
      {requests.map((request) => (
        // Stable key = request id, never the array index (3.8).
        <RequestCard
          key={request.id}
          request={request}
          onOpenDetails={onOpenDetails}
          onAdvanceStatus={onAdvanceStatus}
          onDelete={onDelete}
          onCopyId={onCopyId}
        />
      ))}
    </ul>
  );
}
