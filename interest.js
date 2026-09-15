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
  const counts = keys.map((key) => Number.isInteger(data[key]) && data[key] >= 0 ? data[key] : 0);
  const total = counts.reduce((sum, value) => sum + value, 0);
  document.querySelector("[data-total]").textContent = total.toLocaleString();
  keys.forEach((key, index) => {
    const cell = document.querySelector(`[data-count="${key}"]`);
    if (cell) cell.textContent = counts[index].toLocaleString();
    const bar = document.querySelector(`[data-bar="${key}"]`);
    if (bar) bar.style.width = total ? `${Math.max(4, counts[index] / total * 100)}%` : "0%";
  });
}

function loadCountFile() {
  fetch(language === "zh" ? "../interest-counts.json" : "interest-counts.json", { cache: "no-store" })
    .then((response) => { if (!response.ok) throw new Error("Count unavailable"); return response.json(); })
    .then(renderCounts)
    .catch(() => { /* Keep the visible starting numbers when offline. */ });
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
  let received = false;
  window.bridgeCount = (data) => { received = true; renderCounts(data); };
  const script = document.createElement("script");
  script.src = `${sheetApp}${sheetApp.includes("?") ? "&" : "?"}view=counts&v=${Date.now()}`;
  script.onerror = loadCountFile;
  document.head.append(script);
  setTimeout(() => { if (!received) loadCountFile(); }, 7000);
} else {
  loadCountFile();
}

document.querySelector("[data-copy-link]")?.addEventListener("click", async () => {
  const url = `https://peculab.github.io/${language === "zh" ? "zh/" : ""}taiwan-seattle-bridge.html`;
  try {
    await navigator.clipboard.writeText(url);
    document.querySelector("[data-share-status]").textContent = labels.copied;
  } catch {
    document.querySelector("[data-share-status]").textContent = url;
  }
});
