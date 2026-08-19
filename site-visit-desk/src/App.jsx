import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header/Header.jsx';
import RequestForm from './components/RequestForm/RequestForm.jsx';
import Queue from './components/Queue/Queue.jsx';
import RequestDetailsModal from './components/Modal/RequestDetailsModal.jsx';
import ToastHost from './components/Toast/ToastHost.jsx';
//import AnalyticsPanel from './components/Analytics/AnalyticsPanel.jsx';
import { fetchRequests } from './api/mockApi.js';
import { useToasts } from './hooks/useToasts.js';
import styles from './App.module.css';

export default function App() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(null); // { request, triggerElement }

  const { toasts, addToast, dismiss } = useToasts();

  const loadRequests = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchRequests()
      .then((data) => setRequests(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleCreated = (created) => {
    // Immutable prepend — never mutate the source array (3.1 / automatic deductions).
    setRequests((prev) => [created, ...prev]);
  };

  const handleAdvanceStatus = (id, nextStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
  };

  const handleDelete = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    if (details?.request?.id === id) setDetails(null);
  };

  const openCount = requests.filter((r) => r.status !== 'Closed').length;
  const urgentCount = requests.filter((r) => r.severity === 'Critical' && r.status !== 'Closed').length;

  return (
    <div className={styles.app}>
      <Header openCount={openCount} urgentCount={urgentCount} />

      <main className={styles.layout}>
        <div className={styles.formColumn}>
          <RequestForm onCreated={handleCreated} addToast={addToast} />
        </div>

        <div className={styles.queueColumn}>
          <Queue
            requests={requests}
            loading={loading}
            error={error}
            onRetry={loadRequests}
            onOpenDetails={(request, triggerElement) => setDetails({ request, triggerElement })}
            onAdvanceStatus={handleAdvanceStatus}
            onDelete={handleDelete}
            addToast={addToast}
          />
          {!loading && !error && <AnalyticsPanel requests={requests} />}
        </div>
      </main>

      {details && (
        <RequestDetailsModal
          request={details.request}
          triggerElement={details.triggerElement}
          onClose={() => setDetails(null)}
        />
      )}

      <ToastHost toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
