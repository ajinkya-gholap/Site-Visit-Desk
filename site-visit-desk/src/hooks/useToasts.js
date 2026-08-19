import { useCallback, useEffect, useRef, useState } from 'react';

let toastSeq = 0;

// Owns the toast queue: adding a toast schedules its auto-dismiss (4s) and
// every pending timer is tracked so it can be cleared on unmount (3.11).
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message, variant = 'success', anchor = null) => {
      const id = `toast-${++toastSeq}`;
      setToasts((prev) => [...prev, { id, message, variant, anchor }]);
      const timer = setTimeout(() => dismiss(id), 4000);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach((t) => clearTimeout(t));
      timersMap.clear();
    };
  }, []);

  return { toasts, addToast, dismiss };
}
