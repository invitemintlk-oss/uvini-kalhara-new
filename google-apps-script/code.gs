/**
 * Uvini & Kalhara wedding — RSVP + Wishes backend.
 *
 * SETUP (one time, by the sheet owner):
 *  1. Open the spreadsheet → Extensions → Apps Script.
 *  2. Replace everything in Code.gs with this file and click Save.
 *  3. Deploy → New deployment → type "Web app"
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     → Deploy → authorise → copy the Web app URL (ends with /exec).
 *  4. Put that URL in src/googleSheets.ts (GOOGLE_SCRIPT_URL) or VITE_GOOGLE_SCRIPT_URL.
 *
 * After editing this script later: Deploy → Manage deployments → edit → Version: New version.
 */

const SPREADSHEET_ID = '1PT-JWaQA4NvrWyoptVF08bnHarBEmIlgNskdjoE-8mc';

const SHEETS = {
  rsvp: {
    name: 'RSVP',
    headers: ['Timestamp', 'Name', 'Attending', 'Guests', 'Message', 'Submitted At (ISO)'],
    row: (p) => [new Date(), clean(p.name, 100), clean(p.status, 20), clean(p.guestCount, 3), clean(p.message, 500), clean(p.submittedAt, 40)],
  },
  wishes: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Wish', 'Submitted At (ISO)'],
    row: (p) => [new Date(), clean(p.name, 100), clean(p.wish, 1000), clean(p.submittedAt, 40)],
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const key = String((e && e.parameter && e.parameter.sheet) || '').toLowerCase();
    const cfg = SHEETS[key];
    if (!cfg) return json({ ok: false, error: 'Invalid sheet. Use rsvp or wishes.' });

    const payload = JSON.parse((e.parameter && e.parameter.payload) || '{}');
    if (!clean(payload.name, 100)) return json({ ok: false, error: 'Name is required.' });
    if (key === 'wishes' && !clean(payload.wish, 1000)) return json({ ok: false, error: 'Wish is required.' });

    const sheet = getSheet(cfg);
    sheet.appendRow(cfg.row(payload));
    return json({ ok: true, sheet: cfg.name });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/** GET ?action=wishes → latest wishes (newest first) for the wall on the website. */
function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || '').toLowerCase();

  if (action === 'wishes') {
    const sheet = getSheet(SHEETS.wishes);
    const last = sheet.getLastRow();
    if (last < 2) return json({ ok: true, wishes: [] });
    const count = Math.min(last - 1, 300);
    const rows = sheet.getRange(last - count + 1, 1, count, 3).getValues();
    const wishes = rows
      .filter((r) => r[1] && r[2])
      .map((r) => ({
        name: String(r[1]),
        message: String(r[2]),
        createdAt: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      }))
      .reverse();
    return json({ ok: true, wishes: wishes });
  }

  return json({ ok: true, service: 'uvini-kalhara-wedding', time: new Date().toISOString() });
}

function getSheet(cfg) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(cfg.name) || ss.insertSheet(cfg.name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(cfg.headers);
    sheet.getRange(1, 1, 1, cfg.headers.length).setFontWeight('bold').setBackground('#dbeaf7');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Trim, cap length, and neutralise spreadsheet formula injection (=, +, -, @). */
function clean(value, max) {
  if (value === null || value === undefined) return '';
  let s = String(value).trim().slice(0, max || 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
