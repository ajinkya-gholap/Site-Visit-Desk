import { useRef, useEffect } from 'react';
import { cx } from '../../utils/cx.js';
import styles from './RequestForm.module.css';

const MAX_LEN = 300;
const MAX_ROWS = 8;

export default function NotesTextarea({ value, onChange, onBlur }) {
  const ref = useRef(null);

  // Auto-grow the textarea height as content is added, capped at ~8 rows.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * MAX_ROWS;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [value]);

  const handleChange = (e) => {
    if (e.target.value.length > MAX_LEN) return; // block typing past the limit
    onChange(e);
  };

  const counterState = value.length >= MAX_LEN ? 'max' : value.length > 250 ? 'warn' : 'ok';

  return (
    <div>
      <textarea
        ref={ref}
        id="notes"
        name="notes"
        rows={3}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        maxLength={MAX_LEN}
        placeholder="Any extra context for the assigned engineer…"
        className={styles.textarea}
      />
      <p
        className={cx(
          styles.counter,
          counterState === 'warn' && styles['counter--warn'],
          counterState === 'max' && styles['counter--max']
        )}
      >
        {value.length} / {MAX_LEN}
      </p>
    </div>
  );
}
