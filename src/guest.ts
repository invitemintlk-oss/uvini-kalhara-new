// Shared guest-name logic for the admin link generator and the invitation page.

export const COUPLE = {
  groom: 'Kalhara',
  bride: 'Uvini',
} as const;

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

/**
 * URL-safe codes for each prefix. Links must not END with "." (as "?prefix=Mr." did):
 * WhatsApp and other chat apps treat a trailing full stop as punctuation and drop it,
 * so the site received "Mr" and showed the name without its prefix.
 */
const PREFIX_CODES: Record<Prefix, string> = {
  'Mr.': 'mr',
  'Mrs.': 'mrs',
  Miss: 'miss',
  'Mr. & Mrs.': 'mrmrs',
  Family: 'family',
  Dear: 'dear',
};

/**
 * Turn whatever arrives in the URL into a known prefix, tolerating case, missing dots,
 * spaces and "&": "mr", "Mr", "Mr.", "MR." → "Mr."; "mrmrs", "Mr & Mrs", "Mr. & Mrs" → "Mr. & Mrs.".
 */
export const normalizePrefix = (raw: string): Prefix | '' => {
  const key = raw.toLowerCase().replace(/[^a-z]/g, '');
  switch (key) {
    case 'mr':
      return 'Mr.';
    case 'mrs':
      return 'Mrs.';
    case 'miss':
    case 'ms':
      return 'Miss';
    case 'mrmrs':
    case 'mrandmrs':
      return 'Mr. & Mrs.';
    case 'family':
      return 'Family';
    case 'dear':
      return 'Dear';
    default:
      return '';
  }
};

/**
 * Combine prefix + name for display.
 * "Dear" is a message-style option, so it adds nothing to the name itself
 * (the greeting supplies the single "Dear").
 */
export const getDisplayName = (prefix: string, name: string): string => {
  const n = name.trim().replace(/\s+/g, ' ');
  if (!n) return '';
  switch (normalizePrefix(prefix)) {
    case 'Mr.':
    case 'Mrs.':
    case 'Miss':
    case 'Mr. & Mrs.':
      return `${normalizePrefix(prefix)} ${n}`;
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

/**
 * {baseURL}/{guestName}?p={code} — name is URL-encoded so spaces/special characters are safe,
 * and the prefix code never ends in "." so chat apps can't truncate it.
 */
export const buildInviteLink = (baseUrl: string, prefix: string, name: string): string => {
  const n = name.trim().replace(/\s+/g, ' ');
  if (!n) return '';
  const p = normalizePrefix(prefix);
  const code = p ? PREFIX_CODES[p] : '';
  return `${baseUrl}/${encodeURIComponent(n)}${code ? `?p=${code}` : ''}`;
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

/** Read the guest from the invitation URL: /{name}?p=mr (new), /{name}?prefix=Mr. (older links), or ?name=…. */
export const getGuestFromUrl = (): string => {
  const params = new URLSearchParams(window.location.search);
  const prefix = params.get('p') || params.get('prefix') || '';
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
