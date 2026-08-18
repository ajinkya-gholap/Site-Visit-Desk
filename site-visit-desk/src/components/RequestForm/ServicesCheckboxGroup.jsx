import { useEffect, useRef } from 'react';
import { SERVICES } from '../../data/constants.js';
import styles from './RequestForm.module.css';

export default function ServicesCheckboxGroup({ selected, onToggle, onToggleAll }) {
  const selectAllRef = useRef(null);
  const allChecked = selected.length === SERVICES.length;
  const noneChecked = selected.length === 0;

  // Indeterminate state can only be set imperatively via the DOM node — this is
  // the one legitimate ref usage in the app (3.4).
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = !allChecked && !noneChecked;
    }
  }, [allChecked, noneChecked]);

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        Affected services <span className={styles.required}>*</span>
      </legend>
      <div className={styles.checkboxRow}>
        <input
          ref={selectAllRef}
          type="checkbox"
          id="services-select-all"
          checked={allChecked}
          onChange={() => onToggleAll(!allChecked)}
        />
        <label htmlFor="services-select-all" className={styles.checkboxLabelStrong}>
          Select all
        </label>
      </div>
      <div className={styles.checkboxGrid}>
        {SERVICES.map((service) => {
          const id = `service-${service.replace(/\s+/g, '-').toLowerCase()}`;
          return (
            <div className={styles.checkboxRow} key={service}>
              <input
                type="checkbox"
                id={id}
                name="services"
                value={service}
                checked={selected.includes(service)}
                onChange={() => onToggle(service)}
              />
              <label htmlFor={id}>{service}</label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
