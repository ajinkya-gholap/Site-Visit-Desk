const SITE_CODE_RE = /^CMT-\d{4}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns an errors object keyed by field name. A field with no error is omitted.
export function validateRequestForm(form) {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!form.requesterName.trim() || form.requesterName.trim().length < 3) {
    errors.requesterName = 'Requester name is required (min 3 characters).';
  }

  if (!form.contactEmail.trim()) {
    errors.contactEmail = 'Contact email is required.';
  } else if (!EMAIL_RE.test(form.contactEmail.trim())) {
    errors.contactEmail = 'Enter a valid email address.';
  }

  if (!form.siteName.trim()) {
    errors.siteName = 'Site name is required.';
  }

  if (!form.siteCode.trim()) {
    errors.siteCode = 'Site code is required.';
  } else if (!SITE_CODE_RE.test(form.siteCode.trim())) {
    errors.siteCode = 'Format must be CMT-#### (e.g. CMT-1042).';
  }

  if (!form.visitDate) {
    errors.visitDate = 'Visit date is required.';
  } else {
    const picked = new Date(form.visitDate + 'T00:00:00');
    if (picked < today) {
      errors.visitDate = 'Visit date cannot be in the past.';
    }
  }

  if (!form.category) {
    errors.category = 'Select a category.';
  }

  if (!form.engineer) {
    errors.engineer = 'Select an assigned engineer.';
  }

  if (!form.services || form.services.length === 0) {
    errors.services = 'Select at least one affected service.';
  }

  if (!form.severity) {
    errors.severity = 'Select a severity level.';
  }

  if (form.severity === 'Critical' && !form.escalationContact.trim()) {
    errors.escalationContact = 'Escalation contact number is required for Critical severity.';
  }

  if (!form.preferredContact) {
    errors.preferredContact = 'Select a preferred contact method.';
  }

  if (form.notes && form.notes.length > 300) {
    errors.notes = 'Notes cannot exceed 300 characters.';
  }

  return errors;
}
