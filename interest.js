const language = document.documentElement.lang === "zh-Hant" ? "zh" : "en";
const backend = window.BRIDGE_BACKEND || {};
const liveMode = Boolean(backend.url && backend.turnstileSiteKey);
const labels = language === "zh"
  ? { error: "目前無法讀取最新人數，顯示上次公開快照。", copied: "連結已複製，可分享給老師、學校與同學。",
      verifying: "請先完成送出前的驗證。", saving: "正在記錄意願…", failed: "意願尚未儲存，請稍後重試或直接寄信給 PECULAB。" }
  : { error: "Live count is unavailable; showing the last public snapshot.", copied: "Link copied. Share it with faculty, schools, and students.",
      verifying: "Please complete the verification before sending.", saving: "Recording your interest…",
      failed: "Interest was not saved. Please retry or email PECULAB directly." };

function showCounts(data) {
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
  const date = document.querySelector("[data-updated]");
  if (date) date.textContent = data.updated || "";
}

async function refreshCounts() {
  try {
    const source = liveMode ? `${backend.url.replace(/\/$/, "")}/counts` : (language === "zh" ? "../interest-counts.json" : "interest-counts.json");
    const response = await fetch(source, { cache: "no-store" });
    if (!response.ok) throw new Error("Count unavailable");
    showCounts(await response.json());
  } catch {
    document.querySelector("[data-count-status]").textContent = labels.error;
    if (liveMode) {
      try {
        const snapshot = await fetch(language === "zh" ? "../interest-counts.json" : "interest-counts.json", { cache: "no-store" });
        if (snapshot.ok) showCounts(await snapshot.json());
      } catch { /* Keep the visible zero state. */ }
    }
  }
}

const form = document.querySelector(".bridge-form form");
if (window.location.protocol === "file:" && form) {
  const notice = document.createElement("p");
  notice.className = "bridge-local-notice";
  const link = document.createElement("a");
  link.href = `https://peculab.github.io/${language === "zh" ? "zh/" : ""}taiwan-seattle-bridge.html#join`;
  link.textContent = language === "zh" ? "前往官網填寫合作意願 ↗" : "Open the live website to submit interest ↗";
  notice.append(language === "zh" ? "這是本機 HTML 預覽。表單不能從檔案直接送出。" : "This is a local HTML preview. The form cannot be submitted from a file.", document.createElement("br"), link);
  form.before(notice);
  form.querySelector('button[type="submit"]').disabled = true;
} else if (liveMode && form) {
  const widget = document.createElement("div");
  widget.className = "cf-turnstile";
  widget.dataset.sitekey = backend.turnstileSiteKey;
  const submit = form.querySelector('button[type="submit"]');
  submit.before(widget);
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.className = "bridge-submit-status";
  submit.after(status);
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;
  document.head.append(script);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const token = fields.get("cf-turnstile-response");
    if (!token) { status.textContent = labels.verifying; return; }
    submit.disabled = true;
    status.textContent = labels.saving;
    const data = Object.fromEntries(fields.entries());
    data.turnstileToken = token;
    try {
      const response = await fetch(`${backend.url.replace(/\/$/, "")}/interest`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Save failed");
      const result = await response.json();
      if (!result.recorded) throw new Error("Save failed");
      showCounts(result.counts);
      form.submit(); // Continue to the existing FormSubmit email path after the private file is saved.
    } catch {
      status.textContent = labels.failed;
      submit.disabled = false;
      window.turnstile?.reset();
    }
  });
}

refreshCounts();
document.querySelector("[data-copy-link]")?.addEventListener("click", async () => {
  const url = `https://peculab.github.io/${language === "zh" ? "zh/" : ""}taiwan-seattle-bridge.html`;
  try {
    await navigator.clipboard.writeText(url);
    document.querySelector("[data-share-status]").textContent = labels.copied;
  } catch {
    document.querySelector("[data-share-status]").textContent = url;
  }
});
