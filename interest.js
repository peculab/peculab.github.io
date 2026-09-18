const language = document.documentElement.lang === "zh-Hant" ? "zh" : "en";
const labels = language === "zh"
  ? { error: "None", copied: "連結已複製，可分享給老師、學校與同學。" }
  : { error: "None", copied: "Link copied. Share it with faculty, schools, and students." };

if (window.location.protocol === "file:") {
  const form = document.querySelector(".bridge-form form");
  if (form) {
    const notice = document.createElement("p");
    notice.className = "bridge-local-notice";
    const link = document.createElement("a");
    link.href = `https://peculab.github.io/${language === "zh" ? "zh/" : ""}taiwan-seattle-bridge.html#join`;
    link.textContent = language === "zh" ? "前往官網填寫合作意願 ↗" : "Open the live website to submit interest ↗";
    notice.append(language === "zh" ? "這是本機 HTML 預覽。FormSubmit 不接受從檔案直接送出的表單。" : "This is a local HTML preview. FormSubmit does not accept submissions from files.", document.createElement("br"), link);
    form.before(notice);
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').title = language === "zh" ? "請前往官網填寫" : "Please use the live website";
  }
}

function renderCounts(data) {
  const keys = ["faculty", "institutions", "students", "supporters"];
  if (!data || !keys.every((key) => Number.isSafeInteger(data[key]) && data[key] >= 0)) {
    throw new Error("Invalid Sheet counts");
  }
  const counts = keys.map((key) => data[key]);
  const total = counts.reduce((sum, value) => sum + value, 0);
  document.querySelector("[data-total]").textContent = total.toLocaleString();
  keys.forEach((key, index) => {
    const cell = document.querySelector(`[data-count="${key}"]`);
    if (cell) cell.textContent = counts[index].toLocaleString();
    const bar = document.querySelector(`[data-bar="${key}"]`);
    if (bar) bar.style.width = total ? `${Math.max(4, counts[index] / total * 100)}%` : "0%";
  });
}

function showCountError() {
  document.querySelectorAll("[data-total], [data-count]").forEach((cell) => { cell.textContent = "—"; });
  document.querySelectorAll("[data-bar]").forEach((bar) => { bar.style.width = "0%"; });
  document.querySelector("[data-count-status]").textContent = language === "zh"
    ? "暫時無法讀取 Google Sheet 人數，請稍後重新整理。"
    : "Google Sheet counts are unavailable. Please refresh later.";
}

const sheetApp = window.BRIDGE_SHEETS_WEB_APP_URL || "";
const form = document.querySelector(".bridge-form form");
if (sheetApp && window.location.protocol !== "file:") {
  if (form) {
    form.action = sheetApp;
    const languageField = document.createElement("input");
    languageField.type = "hidden";
    languageField.name = "language";
    languageField.value = language;
    form.append(languageField);
    const honey = document.createElement("input");
    honey.name = "_honey";
    honey.tabIndex = -1;
    honey.autocomplete = "off";
    honey.className = "bridge-honey";
    form.append(honey);
  }
}

// The Web App reads the private Sheet on every request and returns aggregates only.
// Never substitute a local snapshot or starting numbers for a failed live read.
function loadSheetCounts() {
  if (!sheetApp) { showCountError(); return; }
  const status = document.querySelector("[data-count-status]");
  status.textContent = language === "zh" ? "正在讀取 Google Sheet…" : "Loading Google Sheet…";
  const script = document.createElement("script");
  let finished = false;
  const finish = (data) => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    script.remove();
    try {
      renderCounts(data);
      status.textContent = "";
    } catch { showCountError(); }
    setTimeout(loadSheetCounts, 60000);
  };
  const timeout = setTimeout(() => finish(null), 15000);
  window.bridgeCount = finish;
  script.onerror = () => finish(null);
  script.onload = () => { if (!finished) finish(null); };
  script.src = `${sheetApp}${sheetApp.includes("?") ? "&" : "?"}view=counts&v=${Date.now()}`;
  document.head.append(script);
}
loadSheetCounts();

document.querySelector("[data-copy-link]")?.addEventListener("click", async () => {
  const url = `https://peculab.github.io/${language === "zh" ? "zh/" : ""}taiwan-seattle-bridge.html`;
  try {
    await navigator.clipboard.writeText(url);
    document.querySelector("[data-share-status]").textContent = labels.copied;
  } catch {
    document.querySelector("[data-share-status]").textContent = url;
  }
});
