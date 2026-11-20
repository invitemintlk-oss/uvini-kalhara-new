// Shared guest-name logic for the admin link generator and the invitation page.

export const COUPLE = {
  groom: 'Kalhara',
  bride: 'Uvini',
} as const;

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

/**
 * Combine prefix + name for display.
 * "Dear" is a message-style option, so it adds nothing to the name itself
 * (the greeting supplies the single "Dear").
 */
export const getDisplayName = (prefix: string, name: string): string => {
  const n = name.trim().replace(/\s+/g, ' ');
  if (!n) return '';
  switch (prefix) {
    case 'Mr.':
    case 'Mrs.':
    case 'Miss':
    case 'Mr. & Mrs.':
      return `${prefix} ${n}`;
    case 'Family':
      return `${n} and Family`;
    case 'Dear':
    default:
      return n;
  }
};

/** Message greeting — always exactly one "Dear", never "Dear Dear …". */
export const getGreeting = (prefix: string, name: string): string => {
  const display = getDisplayName(prefix, name);
  return display ? `Dear ${display} ❤️` : '';
};

/** {baseURL}/{guestName}?prefix=… — name is URL-encoded so spaces/special characters are safe. */
export const buildInviteLink = (baseUrl: string, prefix: string, name: string): string => {
  const n = name.trim().replace(/\s+/g, ' ');
  if (!n) return '';
  return `${baseUrl}/${encodeURIComponent(n)}?prefix=${encodeURIComponent(prefix)}`;
};

export const buildInviteMessage = (prefix: string, name: string, link: string): string =>
  [
    getGreeting(prefix, name),
    '',
    'With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.',
    '',
    'Please view our wedding invitation and all the event details through the link below 🌐:',
    '',
    link,
    '',
    'Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.',
    '',
    'With love,',
    `❤️ ${COUPLE.groom} & ${COUPLE.bride}`,
  ].join('\n');

/** Read the guest from the current invitation URL (/{name}?prefix=… or legacy ?name=…). */
export const getGuestFromUrl = (): string => {
  const params = new URLSearchParams(window.location.search);
  const prefix = params.get('prefix') || '';
  const path = window.location.pathname.slice(1);
  let name = params.get('name') || '';
  if (path && !path.startsWith('admin')) {
    try {
      name = decodeURIComponent(path);
    } catch {
      name = path;
    }
  }
  return getDisplayName(prefix, name);
};
