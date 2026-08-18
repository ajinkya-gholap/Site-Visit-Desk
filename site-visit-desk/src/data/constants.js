export const CATEGORIES = ['Networking', 'CCTV', 'SCADA', 'PA System', 'Fire & Safety'];

export const SERVICES = [
  'Core Network',
  'CCTV Feed',
  'SCADA Link',
  'PA / Announcement',
  'Access Control',
  'Fire Panel',
];

export const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export const CONTACT_METHODS = ['Phone', 'Email', 'WhatsApp'];

export const STATUSES = ['Open', 'In Progress', 'Closed'];

export const EXTRA_TEAMS = [
  'NOC',
  'Field Ops',
  'Customer Success',
  'Security',
  'Vendor Liaison',
];

export const initialFormState = {
  requesterName: '',
  contactEmail: '',
  siteName: '',
  siteCode: '',
  visitDate: '',
  category: '',
  engineer: '',
  services: [],
  severity: '',
  escalationContact: '',
  preferredContact: '',
  accessApproved: false,
  notes: '',
  notifyTeams: [],
};
