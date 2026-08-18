import styles from './Header.module.css';

export default function Header({ openCount, urgentCount, theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img className={styles.mark} src="/download.webp" alt="Site Visit Desk logo" />
        <div>
          <h1 className={styles.title}>Site Visit Desk</h1>
          <p className={styles.subtitle}>Commtel Networks · field coordination</p>
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.counts}>
          <span className={styles.count}>{openCount} open</span>
          <span className={styles.dot} aria-hidden="true">
            |
          </span>
          <span className={styles.countUrgent}>{urgentCount} urgent</span>
        </div>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={onToggleTheme}
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <span className={styles.themeToggleIcon} aria-hidden="true"></span>
          <span className={styles.themeToggleThumb} aria-hidden="true" />
          <img
            className={styles.themeToggleIcon}
            src="/icons8-dark-mode-50.png"
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}
