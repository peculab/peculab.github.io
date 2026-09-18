const SPREADSHEET_ID = '1YmxclrZO1zCZH2TyIhbqFHmnOqGDSD-1ZE6dos43TyQ';
const REGISTRATIONS_TAB = '意願登記';
const COUNTS_TAB = '人數總覽';
const NOTIFY_EMAIL = 'peculab.ai@gmail.com';
const ROLE_ROWS = { faculty: 2, institution: 3, student: 4, supporter: 5 };

function doPost(e) {
  const p = e.parameter || {};
  const role = String(p.role || '');
  const email = String(p.email || '').trim().toLowerCase();
  const name = String(p.name || '').trim();
  const organization = String(p.organization_location || '').trim();
  const interest = String(p.interest || '').trim();
  const language = p.language === 'en' ? 'en' : 'zh';
  if (p._honey || !ROLE_ROWS[role] || !email.includes('@') || !name || !organization || !interest || p.contact_consent !== 'yes') {
    return responsePage_(false, language);
  }

  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  let counted = false;
  try {
    const tabs = ensureBridge_(book);
    const entries = tabs.entries;
    const counts = tabs.counts;
    const last = entries.getLastRow();
    const prior = last > 1 ? entries.getRange(2, 4, last - 1, 7).getValues() : [];
    const alreadyCounted = prior.some(row => String(row[0]).trim().toLowerCase() === email && row[6] === 'yes');
    const isTest = ['test', '測試'].includes(interest.toLowerCase());
    counted = !alreadyCounted && !isTest;
    entries.appendRow([new Date(), role, safeCell_(name), safeCell_(email), safeCell_(organization), safeCell_(interest),
      safeCell_(String(p.timing_resources || '')), 'yes', isTest ? 'test' : 'genuine', counted ? 'yes' : 'no']);
    if (counted) {
      const cell = counts.getRange(ROLE_ROWS[role], 4);
      cell.setValue(Number(cell.getValue()) + 1);
    }
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  try {
    MailApp.sendEmail(NOTIFY_EMAIL, '台灣西雅圖學生共創｜新意願登記',
      ['role: ' + role, 'name: ' + name, 'email: ' + email,
       'organization: ' + organization, 'interest: ' + interest,
       'counted: ' + (counted ? 'yes' : 'no')].join('\n'));
  } catch (err) {
    // The private Sheet is the source of truth even if mail delivery is unavailable.
    console.error('Notification failed: ' + err);
  }
  return responsePage_(true, language);
}

function doGet(e) {
  if ((e.parameter || {}).view !== 'counts') return ContentService.createTextOutput('Not found');
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(COUNTS_TAB);
  if (!sheet) throw new Error('Missing counts sheet; run setupBridge first.');
  const values = sheet.getRange(2, 1, 4, 5).getValues();
  const totals = { faculty: 0, institutions: 0, students: 0, supporters: 0 };
  const mapping = { faculty: 'faculty', institution: 'institutions', student: 'students', supporter: 'supporters' };
  values.forEach(row => { if (mapping[row[0]]) totals[mapping[row[0]]] = Number(row[4]) || 0; });
  totals.updated = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  // Only these aggregate numbers are public. Never return individual Sheet rows.
  return ContentService.createTextOutput('window.bridgeCount(' + JSON.stringify(totals) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function setupBridge() {
  ensureBridge_(SpreadsheetApp.openById(SPREADSHEET_ID));
}

function ensureBridge_(book) {
  let entries = book.getSheetByName(REGISTRATIONS_TAB);
  if (!entries) {
    entries = book.insertSheet(REGISTRATIONS_TAB);
    entries.getRange(1, 1, 1, 10).setValues([['送出時間', '角色', '姓名', 'Email', '學校／機構與所在地',
      '參與意願', '時間與資源', '聯繫同意', '測試／正式', '計入累計']]);
    entries.setFrozenRows(1);
  }
  let counts = book.getSheetByName(COUNTS_TAB);
  if (!counts) {
    counts = book.insertSheet(COUNTS_TAB);
    counts.getRange(1, 1, 5, 5).setValues([
      ['role', '分類', '推估起點', '新增正式登記', '累計'],
      ['faculty', '開課老師', 2, 0, '=C2+D2'],
      ['institution', '支持單位', 1, 0, '=C3+D3'],
      ['student', '學生', 6, 0, '=C4+D4'],
      ['supporter', '擴散支持者', 3, 0, '=C5+D5']
    ]);
    counts.setFrozenRows(1);
  }
  return { entries: entries, counts: counts };
}

function responsePage_(success, language) {
  const zh = language === 'zh';
  const title = success ? (zh ? '意願已送出' : 'Interest submitted') : (zh ? '表單資料不完整' : 'Incomplete form');
  const home = zh ? 'https://peculab.github.io/zh/taiwan-seattle-bridge.html' : 'https://peculab.github.io/taiwan-seattle-bridge.html';
  const link = zh ? '返回台美學生共創頁' : 'Back to the student bridge';
  return HtmlService.createHtmlOutput('<meta name="viewport" content="width=device-width,initial-scale=1"><main style="max-width:600px;margin:12vh auto;font:18px system-ui;padding:25px"><h1>' + title + '</h1><p><a href="' + home + '" target="_top">' + link + '</a></p></main>');
}

function safeCell_(value) {
  const text = String(value || '').slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
