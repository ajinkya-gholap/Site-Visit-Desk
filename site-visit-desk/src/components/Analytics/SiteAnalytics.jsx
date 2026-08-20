import { useMemo } from 'react';
import styles from './Analytics.module.css';

export default function SiteAnalytics({ requests }) {
  const byCategory = useMemo(() => countBy(requests, 'category'), [requests]);
  const bySeverity = useMemo(() => countBy(requests, 'severity'), [requests]);
  const maxCategoryCount = Math.max(1, ...Object.values(byCategory));

  return (
    <div className={styles.panel}>
      <h3 className={styles.panelTitle}>Requests by category</h3>
      <div className={styles.barChart}>
        {Object.entries(byCategory).map(([category, count]) => (
          <div className={styles.barRow} key={category}>
            <span className={styles.barLabel}>{category}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                // Genuinely dynamic value (data-driven width) — the one
                // legitimate inline style in this component (3.9).
                style={{ width: `${(count / maxCategoryCount) * 100}%` }}
              />
            </div>
            <span className={styles.barValue}>{count}</span>
          </div>
        ))}
      </div>

      <h3 className={styles.panelTitle}>Severity split</h3>
      <div className={styles.severitySplit}>
        {Object.entries(bySeverity).map(([severity, count]) => (
          <div key={severity} className={styles.severityChip}>
            <span className={styles.severityDot} data-severity={severity} />
            {severity}: {count}
          </div>
        ))}
      </div>
    </div>
  );
}

function countBy(requests, key) {
  return requests.reduce((acc, r) => {
    acc[r[key]] = (acc[r[key]] || 0) + 1;
    return acc;
  }, {});
}
