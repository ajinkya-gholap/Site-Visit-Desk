import { cx } from '../../utils/cx.js';
import styles from './RequestForm.module.css';


export default function FormField({ label, htmlFor, error, touched, hint, required, children }) {
  const showError = Boolean(error) && Boolean(touched);
  return (
    <div className={cx(styles.field, showError && styles['field--error'])}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !showError && <p className={styles.hint}>{hint}</p>}
      {showError && (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
