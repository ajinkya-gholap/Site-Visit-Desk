import { useState } from 'react';
import FormField from './FormField.jsx';
import ServicesCheckboxGroup from './ServicesCheckboxGroup.jsx';
import RadioGroup from './RadioGroup.jsx';
import NotesTextarea from './NotesTextarea.jsx';
import { CATEGORIES, SEVERITIES, CONTACT_METHODS, EXTRA_TEAMS, SERVICES, initialFormState } from '../../data/constants.js';
import { engineersByCategory, citiesInOrder, engineers } from '../../data/engineers.js';
import { validateRequestForm } from '../../utils/validate.js';
import { createRequest } from '../../api/mockApi.js';
import { cx } from '../../utils/cx.js';
import styles from './RequestForm.module.css';

export default function RequestForm({ onCreated, addToast }) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  // One shared handler for text, email, date, select, textarea and the single
  // checkbox — driven by e.target.name and e.target.type (3.1).
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setForm((prev) => {
      const next = { ...prev, [name]: nextValue };

      // Changing category invalidates a previously selected engineer that is
      // no longer certified for it (3.3).
      if (name === 'category') {
        const stillValid = engineersByCategory(value).some((eng) => eng.id === prev.engineer);
        if (!stillValid) next.engineer = '';
      }

      // Leaving Critical severity clears the escalation contact + its error (3.5).
      if (name === 'severity' && value !== 'Critical') {
        next.escalationContact = '';
      }

      return next;
    });
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleServiceToggle = (service) => {
    setForm((prev) => {
      const has = prev.services.includes(service);
      return {
        ...prev,
        services: has ? prev.services.filter((s) => s !== service) : [...prev.services, service],
      };
    });
  };

  const handleServiceToggleAll = (shouldSelectAll) => {
    setForm((prev) => ({
      ...prev,
      services: shouldSelectAll ? [...SERVICES] : [],
    }));
  };

  const handleMultiSelect = (e) => {
    const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, notifyTeams: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRequestForm(form);
    setErrors(validationErrors);
    setTouched(
      Object.keys(initialFormState).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(validationErrors).length > 0) {
      addToast('Please fix the highlighted fields.', 'error');
      return;
    }

    setSaving(true);
    try {
      const created = await createRequest(form);
      onCreated(created);
      setForm(initialFormState);
      setErrors({});
      setTouched({});
      addToast(`Request ${created.id} raised for ${created.siteName}.`, 'success');
    } catch {
      addToast('Could not save the request. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const availableEngineers = form.category ? engineersByCategory(form.category) : engineers;
  const engineersByCity = citiesInOrder
    .map((city) => ({ city, list: availableEngineers.filter((e) => e.city === city) }))
    .filter((group) => group.list.length > 0);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>New site visit request</h2>

      <FormField label="Requester name" htmlFor="requesterName" required error={errors.requesterName} touched={touched.requesterName}>
        <input
          type="text"
          id="requesterName"
          name="requesterName"
          value={form.requesterName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cx(styles.input, errors.requesterName && touched.requesterName && styles['input--error'])}
        />
      </FormField>

      <FormField label="Contact email" htmlFor="contactEmail" required error={errors.contactEmail} touched={touched.contactEmail}>
        <input
          type="email"
          id="contactEmail"
          name="contactEmail"
          value={form.contactEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cx(styles.input, errors.contactEmail && touched.contactEmail && styles['input--error'])}
        />
      </FormField>

      <div className={styles.row}>
        <FormField label="Site name" htmlFor="siteName" required error={errors.siteName} touched={touched.siteName}>
          <input
            type="text"
            id="siteName"
            name="siteName"
            value={form.siteName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cx(styles.input, errors.siteName && touched.siteName && styles['input--error'])}
          />
        </FormField>

        <FormField
          label="Site code"
          htmlFor="siteCode"
          required
          hint="Format: CMT-####"
          error={errors.siteCode}
          touched={touched.siteCode}
        >
          <input
            type="text"
            id="siteCode"
            name="siteCode"
            placeholder="CMT-1042"
            value={form.siteCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cx(styles.input, errors.siteCode && touched.siteCode && styles['input--error'])}
          />
        </FormField>
      </div>

      <FormField label="Visit date" htmlFor="visitDate" required error={errors.visitDate} touched={touched.visitDate}>
        <input
          type="date"
          id="visitDate"
          name="visitDate"
          value={form.visitDate}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cx(styles.input, errors.visitDate && touched.visitDate && styles['input--error'])}
        />
      </FormField>

      <div className={styles.row}>
        <FormField label="Category" htmlFor="category" required error={errors.category} touched={touched.category}>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cx(styles.input, errors.category && touched.category && styles['input--error'])}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Assigned engineer"
          htmlFor="engineer"
          required
          hint={!form.category ? 'Pick a category to narrow this list' : undefined}
          error={errors.engineer}
          touched={touched.engineer}
        >
          <select
            id="engineer"
            name="engineer"
            value={form.engineer}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cx(styles.input, errors.engineer && touched.engineer && styles['input--error'])}
          >
            <option value="" disabled>
              Select an engineer
            </option>
            {engineersByCity.map((group) => (
              <optgroup key={group.city} label={group.city}>
                {group.list.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </FormField>
      </div>

      <ServicesCheckboxGroup
        selected={form.services}
        onToggle={handleServiceToggle}
        onToggleAll={handleServiceToggleAll}
      />
      {errors.services && touched.services && (
        <p className={styles.errorText} role="alert">
          {errors.services}
        </p>
      )}

      <RadioGroup
        legend="Severity"
        name="severity"
        options={SEVERITIES}
        value={form.severity}
        onChange={handleChange}
        required
      />
      {errors.severity && touched.severity && (
        <p className={styles.errorText} role="alert">
          {errors.severity}
        </p>
      )}

      {form.severity === 'Critical' && (
        <FormField
          label="Escalation contact number"
          htmlFor="escalationContact"
          required
          error={errors.escalationContact}
          touched={touched.escalationContact}
        >
          <input
            type="tel"
            id="escalationContact"
            name="escalationContact"
            placeholder="+91 90000 00000"
            value={form.escalationContact}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cx(
              styles.input,
              errors.escalationContact && touched.escalationContact && styles['input--error']
            )}
          />
        </FormField>
      )}

      <RadioGroup
        legend="Preferred contact"
        name="preferredContact"
        options={CONTACT_METHODS}
        value={form.preferredContact}
        onChange={handleChange}
        required
      />
      {errors.preferredContact && touched.preferredContact && (
        <p className={styles.errorText} role="alert">
          {errors.preferredContact}
        </p>
      )}

      <FormField label="Notify additional teams" htmlFor="notifyTeams" hint="Ctrl/Cmd-click to select more than one">
        <select
          id="notifyTeams"
          name="notifyTeams"
          multiple
          value={form.notifyTeams}
          onChange={handleMultiSelect}
          className={cx(styles.input, styles.multiSelect)}
        >
          {EXTRA_TEAMS.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </FormField>

      <div className={styles.checkboxRow}>
        <input
          type="checkbox"
          id="accessApproved"
          name="accessApproved"
          checked={form.accessApproved}
          onChange={handleChange}
        />
        <label htmlFor="accessApproved">Site access approved</label>
      </div>

      <FormField label="Notes" htmlFor="notes" hint="Optional, up to 300 characters" error={errors.notes} touched={touched.notes}>
        <NotesTextarea value={form.notes} onChange={handleChange} onBlur={handleBlur} />
      </FormField>

      <button type="submit" className={styles.submit} disabled={saving}>
        {saving ? 'Saving…' : 'Raise request'}
      </button>
    </form>
  );
}
