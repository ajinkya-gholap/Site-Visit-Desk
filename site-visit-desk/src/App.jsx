import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header/Header.jsx';
import RequestForm from './components/RequestForm/RequestForm.jsx';
import Queue from './components/Queue/Queue.jsx';
import { fetchRequests } from './api/mockApi.js';
import { useTheme } from './hooks/useTheme.js';
import styles from './App.module.css';

// Day 2 deliverable: submitting the form prepends a real card to the queue.
// The details modal, toast portal and analytics panel land on Day 3 —
// for now, "opening details" and toasts just log to the console.
export default function App() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleRequests, setVisibleRequests] = useState([]);
  const { theme, toggleTheme } = useTheme();

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

  const addToast = (message) => {
    console.log('[toast]', message);
  };

  const handleCreated = (created) => {
    // Immutable prepend — never mutate the source array.
    setRequests((prev) => [created, ...prev]);
  };

  const handleAdvanceStatus = (id, nextStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
  };

  const handleDelete = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOpenDetails = (request) => {
    console.log('Open details for (modal arrives Day 3):', request);
  };

  // Reported by Queue so the header reflects whatever cards are actually on
  // screen (after search/status/severity filters), not the full raw queue.
  const handleVisibleChange = useCallback((visible) => {
    setVisibleRequests(visible);
  }, []);

  const openCount = visibleRequests.filter((r) => r.status !== 'Closed').length;
  const urgentCount = visibleRequests.filter((r) => r.severity === 'Critical' && r.status !== 'Closed').length;

  return (
    <div className={styles.app}>
      <Header
        openCount={openCount}
        urgentCount={urgentCount}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

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
            onOpenDetails={handleOpenDetails}
            onAdvanceStatus={handleAdvanceStatus}
            onDelete={handleDelete}
            addToast={addToast}
            onVisibleChange={handleVisibleChange}
          />
        </div>
      </main>
    </div>
  );
}
