import styles from './RequestForm.module.css';

export default function RadioGroup({ legend, name, options, value, onChange, required }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        {legend} {required && <span className={styles.required}>*</span>}
      </legend>
      <div className={styles.radioRow}>
        {options.map((option) => {
          const id = `${name}-${option.replace(/\s+/g, '-').toLowerCase()}`;
          return (
            <div className={styles.checkboxRow} key={option}>
              <input
                type="radio"
                id={id}
                name={name}
                value={option}
                checked={value === option}
                onChange={onChange}
              />
              <label htmlFor={id}>{option}</label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
