type SheetName = 'rsvp' | 'wishes';

type SheetPayload = Record<string, string | number>;

/**
 * Web-app URL of google-apps-script/code.gs deployed from the Uvini & Kalhara sheet
 * (https://docs.google.com/spreadsheets/d/1PT-JWaQA4NvrWyoptVF08bnHarBEmIlgNskdjoE-8mc).
 * Paste the deployment URL (ends with /exec) below, or set VITE_GOOGLE_SCRIPT_URL.
 */
const GOOGLE_SCRIPT_URL: string =
  'https://script.google.com/macros/s/AKfycbzygD1EABYe6bRzhlseYNOIuV-zf14lCFvKEN8Hz_wnl7CuakPYVoMuMcVK1yREVqr4/exec';

export const isSheetConnected = () => GOOGLE_SCRIPT_URL.length > 0;

export async function submitToGoogleSheet(sheet: SheetName, payload: SheetPayload): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error('Google Sheet is not connected yet (missing GOOGLE_SCRIPT_URL).');
  }

  const body = new URLSearchParams();
  body.append('sheet', sheet);
  body.append('payload', JSON.stringify(payload));

  // Apps Script web apps don't return CORS headers for POST; no-cors still delivers the request.
  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: body.toString(),
  });
}

export interface SheetWish {
  name: string;
  message: string;
  createdAt: string;
}

/** Read the wishes wall from the sheet (GET is CORS-readable for Apps Script web apps). */
export async function fetchWishes(): Promise<SheetWish[]> {
  if (!GOOGLE_SCRIPT_URL) return [];
  const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=wishes&t=${Date.now()}`);
  const data = await res.json();
  return Array.isArray(data?.wishes) ? data.wishes : [];
}
