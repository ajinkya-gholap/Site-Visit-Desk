import { lazy, Suspense, useState } from 'react';
import AnalyticsSkeleton from './AnalyticsSkeleton.jsx';
import AnalyticsErrorBoundary from './AnalyticsErrorBoundary.jsx';
import styles from './Analytics.module.css';

// Artificial 1.5s delay on top of the dynamic import so the Suspense fallback
// is actually observable during review/demo — this delay is deliberate (3.10).
const SiteAnalytics = lazy(() =>
  Promise.all([
    import('./SiteAnalytics.jsx'),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]).then(([module]) => module)
);

export default function AnalyticsPanel({ requests }) {
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {open ? 'Hide analytics' : 'Show analytics'}
      </button>

      {open && (
        <AnalyticsErrorBoundary>
          <Suspense fallback={<AnalyticsSkeleton />}>
            <SiteAnalytics requests={requests} />
          </Suspense>
        </AnalyticsErrorBoundary>
      )}
    </section>
  );
}
