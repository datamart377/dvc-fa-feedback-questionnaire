/**
 * Stakeholder Feedback Questionnaire — Office of the DVC (F&A), Quarter One
 * Google Apps Script web app that serves an online form and records every
 * submission as one row in a Google Sheet.
 *
 * The form (Index.html) and this server code live in the same Apps Script
 * project. When someone submits, google.script.run calls submitForm() below,
 * which appends a row to the sheet named in SHEET_NAME.
 */

// ---- Configuration -------------------------------------------------------

// The tab (sheet) inside the bound spreadsheet where responses are stored.
var SHEET_NAME = 'Responses';

// The page title shown in the browser tab.
var PAGE_TITLE = 'Stakeholder Feedback Questionnaire — Q1';

// Column order. This is the single source of truth for both the header row
// and each response row, so the two can never drift apart.
// Each entry: [key sent by the form, human-readable column header].
var FIELDS = [
  ['timestamp',        'Timestamp'],
  // Section A — Respondent information
  ['unit',             'Unit/Office'],
  ['designation',      'Designation/Role'],
  ['name',             'Name (optional)'],
  ['frequency',        'Frequency of engagement'],
  ['channel',          'Main channel of engagement'],
  ['channelOther',     'Channel — other (specify)'],
  // Section B — Performance rating (1–5, or N/A)
  ['b1',  'B1 Responsiveness'],
  ['b2',  'B2 Accessibility'],
  ['b3',  'B3 Communication — clarity'],
  ['b4',  'B4 Communication — timely updates'],
  ['b5',  'B5 Coordination'],
  ['b6',  'B6 Decision follow-up'],
  ['b7',  'B7 Management reporting — timeliness'],
  ['b8',  'B8 Management reporting — accuracy'],
  ['b9',  'B9 Service consistency'],
  ['b10', 'B10 Records management'],
  ['b11', 'B11 Stakeholder engagement'],
  ['b12', 'B12 Overall performance'],
  // Section C — Experience and service-delivery feedback
  ['c1', 'C1 Services/support received'],
  ['c2', 'C2 Handled particularly well (example)'],
  ['c3', 'C3 Avoidable delay / repeated follow-up'],
  ['c4', 'C4 Clarity, consistency, timeliness of feedback'],
  ['c5', 'C5 Effectiveness communicating Management decisions'],
  // Section D — Process and coordination improvements
  ['d6',        'D6 Process to simplify/clarify/digitise'],
  ['d7',        'D7 Coordination gap to address'],
  ['d8Start',   'D8 Start doing'],
  ['d8Stop',    'D8 Stop doing'],
  ['d8Continue','D8 Continue doing'],
  // Section E — Priority action for Quarter Two
  ['e9',            'E9 Highest-priority improvement'],
  ['actionAction',  'Action — suggested action'],
  ['actionOffice',  'Action — responsible office(s)'],
  ['actionDate',    'Action — suggested completion date'],
  ['actionEvidence','Action — evidence of completion'],
  // Section F — Overall assessment
  ['f10', 'F10 Overall satisfaction'],
  ['f11', 'F11 Additional comments/recommendations']
];

// ---- Web app entry point -------------------------------------------------

function doGet() {
  // If this project also holds the "Index" HTML file, serve the form (the
  // all-in-Apps-Script setup). If it doesn't (backend-only, form on GitHub
  // Pages), return a small confirmation so visiting the URL isn't an error.
  try {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle(PAGE_TITLE)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (e) {
    return ContentService.createTextOutput(
      'Questionnaire endpoint is active. Please use the online form to submit.');
  }
}

// ---- Submission handlers -------------------------------------------------

/**
 * Called from a browser fetch() POST (e.g. the GitHub Pages / standalone HTML
 * version). The request body is the JSON payload keyed by the field keys in
 * FIELDS. Returns a JSON result. Google Apps Script adds an
 * Access-Control-Allow-Origin: * header to this response, so it can be read
 * cross-origin from GitHub Pages.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet_();
    var row = FIELDS.map(function (f) {
      var key = f[0];
      if (key === 'timestamp') {
        return Utilities.formatDate(new Date(), Session.getScriptTimeZone(),
          'yyyy-MM-dd HH:mm:ss');
      }
      var v = data[key];
      return (v === undefined || v === null) ? '' : v;
    });
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Called from the client via google.script.run.
 * @param {Object} data  keyed by the field keys in FIELDS.
 * @return {Object} { ok: true } on success; throws on failure so the client
 *                  error handler fires.
 */
function submitForm(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // avoid two submissions racing on the same rows
  try {
    var sheet = getOrCreateSheet_();
    var row = FIELDS.map(function (f) {
      var key = f[0];
      if (key === 'timestamp') {
        // Recorded in the spreadsheet's timezone.
        return Utilities.formatDate(new Date(), Session.getScriptTimeZone(),
          'yyyy-MM-dd HH:mm:ss');
      }
      var v = data[key];
      return (v === undefined || v === null) ? '' : v;
    });
    sheet.appendRow(row);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Returns the Responses sheet, creating it (with a header row and light
 * formatting) the first time it is needed.
 */
function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    var headers = FIELDS.map(function (f) { return f[1]; });
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold').setBackground('#1b1712')
      .setFontColor('#f2b600');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ---- One-time helper (optional) ------------------------------------------

/**
 * Run this once from the editor if you want the header row created before the
 * first real submission. Not required — the header is also created on the
 * first submission.
 */
function setupSheet() {
  getOrCreateSheet_();
}
