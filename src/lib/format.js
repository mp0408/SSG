const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const longDateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDate = (iso, { long = false } = {}) =>
  iso ? (long ? longDateFormatter : dateFormatter).format(new Date(`${iso}T00:00:00`)) : '';

export const initials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '·';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

export const firstName = (name = '') => name.trim().split(/\s+/)[0] ?? '';

/** Indian mobile number → "+91 98765 43210" */
export const formatPhone = (mobile = '') => {
  const digits = mobile.replace(/\D/g, '').slice(-10);
  return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : mobile;
};

export const pad2 = (n) => String(n).padStart(2, '0');
