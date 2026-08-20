import styles from './Analytics.module.css';

export default function AnalyticsSkeleton() {
  return (
    <div className={styles.panel} aria-busy="true" aria-label="Loading analytics">
      <div className={styles.skeletonTitle} />
      {Array.from({ length: 4 }).map((_, i) => (
        <div className={styles.skeletonBar} key={i} />
      ))}
    </div>
  );
}
