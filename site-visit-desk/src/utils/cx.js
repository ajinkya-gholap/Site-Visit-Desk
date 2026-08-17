// Tiny className combiner: cx('card', isOpen && 'card--open', { 'card--dim': dim })
// Accepts strings, falsy values (ignored), and objects of { className: boolean }.
export function cx(...args) {
  const classes = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (arg[key]) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}
