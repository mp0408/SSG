import { firstName } from './format';

const intl = (mobile = '') => {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

export const telHref = (mobile) => `tel:+${intl(mobile)}`;

export const whatsappHref = (mobile, name) => {
  const text = `Hi ${firstName(name)}, I found you on the SSG Premier League players network and would like to connect.`;
  return `https://wa.me/${intl(mobile)}?text=${encodeURIComponent(text)}`;
};

export const instagramHandle = (url = '') => url.match(/instagram\.com\/([^/?#]+)/)?.[1] ?? '';

/** Downloads a .vcf so the contact can be saved in one tap (opens the native contact sheet on iOS/Android). */
export function downloadVCard({ name, mobile, occupation, organisation, note, url }) {
  const escape = (value = '') => value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const parts = name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts.at(-1) : '';
  const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escape(last)};${escape(first)};;;`,
    `FN:${escape(name)}`,
    mobile && `TEL;TYPE=CELL:+${intl(mobile)}`,
    organisation && `ORG:${escape(organisation)}`,
    occupation && `TITLE:${escape(occupation)}`,
    url && `URL:${url}`,
    note && `NOTE:${escape(note)}`,
    'END:VCARD',
  ].filter(Boolean);

  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), {
    href,
    download: `${name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')}.vcf`,
  });
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

/** Native share sheet where available, otherwise copies the link. Resolves to 'shared' | 'copied' | 'dismissed'. */
export async function shareLink({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'dismissed';
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'dismissed';
  }
}
