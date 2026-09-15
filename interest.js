const language = document.documentElement.lang === "zh-Hant" ? "zh" : "en";
const labels = language === "zh"
  ? { error: "目前無法讀取最新的正式登記數。", copied: "連結已複製，可分享給老師、學校與同學。" }
  : { error: "Actual registration count is unavailable right now.", copied: "Link copied. Share it with faculty, schools, and students." };

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

fetch(language === "zh" ? "../interest-counts.json" : "interest-counts.json", { cache: "no-store" })
  .then((response) => { if (!response.ok) throw new Error("Count unavailable"); return response.json(); })
  .then((data) => {
    const keys = ["faculty", "institutions", "students", "supporters"];
    const estimate = data.starting_estimate || {};
    const counts = keys.map((key) => Number.isInteger(estimate[key]) && estimate[key] >= 0 ? estimate[key] : 0);
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
    const registered = keys.reduce((sum, key) => sum + (Number.isInteger(data[key]) && data[key] >= 0 ? data[key] : 0), 0);
    const actual = document.querySelector("[data-actual-registrations]");
    if (actual) actual.textContent = registered
      ? (language === "zh" ? `${registered.toLocaleString()} 筆` : registered.toLocaleString())
      : (language === "zh" ? "尚在累積" : "Starting to accumulate");
  })
  .catch(() => { document.querySelector("[data-count-status]").textContent = labels.error; });

document.querySelector("[data-copy-link]")?.addEventListener("click", async () => {
  const url = `https://peculab.github.io/${language === "zh" ? "zh/" : ""}taiwan-seattle-bridge.html`;
  try {
    await navigator.clipboard.writeText(url);
    document.querySelector("[data-share-status]").textContent = labels.copied;
  } catch {
    document.querySelector("[data-share-status]").textContent = url;
  }
});
