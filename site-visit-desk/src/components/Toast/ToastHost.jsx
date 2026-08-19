import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.js';
import styles from './ToastHost.module.css';

// Independent portal into #toast-root, separate from the modal's #modal-root (3.11).
export default function ToastHost({ toasts, onDismiss }) {
  const target = document.getElementById('toast-root');
  if (!target) return null;

  return createPortal(
    <div className={styles.stack} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={cx(styles.toast, styles[`toast--${toast.variant}`])}>
          <span>{toast.message}</span>
          <button
            type="button"
            className={styles.close}
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    target
  );
}
