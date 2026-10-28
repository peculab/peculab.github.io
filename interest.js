const language = document.documentElement.lang === "zh-Hant" ? "zh" : "en";
const labels = language === "zh"
  ? { copied: "\u9023\u7d50\u5df2\u8907\u88fd\uff0c\u53ef\u5206\u4eab\u7d66\u4f01\u696d\u3001\u5b78\u6821\u3001\u5c08\u696d\u4eba\u58eb\u8207\u793e\u7fa4\u3002" }
  : { copied: "Link copied. Share it with companies, educators, professionals, and communities." };

if (window.location.protocol === "file:") {
  const localForm = document.querySelector(".bridge-form form");
  if (localForm) {
    const notice = document.createElement("p");
    notice.className = "bridge-local-notice";
    const link = document.createElement("a");
    link.href = `https://peculab.github.io/${language === "zh" ? "zh/" : ""}taiwan-seattle-bridge.html#join`;
    link.textContent = language === "zh" ? "\u958b\u555f\u7dda\u4e0a\u8868\u55ae \u2197" : "Open the online form \u2197";
    notice.append(language === "zh" ? "\u82e5\u8981\u5f9e\u6b64\u9810\u89bd\u767b\u8a18\u610f\u9858\uff0c\u8acb\u958b\u555f\u7dda\u4e0a\u8868\u55ae\u3002" : "To submit your interest from this preview, open the online form.", document.createElement("br"), link);
    localForm.before(notice);
    localForm.querySelector('button[type="submit"]').disabled = true;
    localForm.querySelector('button[type="submit"]').title = language === "zh" ? "\u8acb\u524d\u5f80\u5b98\u7db2\u586b\u5beb" : "Please use the live website";
  }
}

function renderCounts(data) {
  const keys = ["faculty", "institutions", "students", "supporters"];
  if (!data || !keys.every((key) => Number.isSafeInteger(data[key]) && data[key] >= 0)) throw new Error("Invalid Sheet counts");
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
  document.querySelectorAll("[data-total], [data-count]").forEach((cell) => { cell.textContent = "\u2026"; });
  document.querySelectorAll("[data-bar]").forEach((bar) => { bar.style.width = "0%"; });
  document.querySelector("[data-count-status]").textContent = language === "zh"
    ? "\u66ab\u6642\u7121\u6cd5\u8b80\u53d6 Google Sheet \u4eba\u6578\uff0c\u8acb\u7a0d\u5f8c\u91cd\u65b0\u6574\u7406\u3002"
    : "Google Sheet counts are unavailable. Please refresh later.";
}

const sheetApp = window.BRIDGE_SHEETS_WEB_APP_URL || "";
const form = document.querySelector(".bridge-form form");
const roleBoxes = form ? [...form.querySelectorAll('[name="participation_roles"]')] : [];
const roleOrder = [];

function selectedRoles() {
  return [...roleOrder.filter((box) => box.checked), ...roleBoxes.filter((box) => box.checked && !roleOrder.includes(box))];
}

function syncRoles() {
  const selected = selectedRoles();
  if (form && roleBoxes.length) {
    form.elements.role.value = selected[0]?.dataset.roleBucket || "";
    roleBoxes[0].setCustomValidity(selected.length ? "" : (language === "zh" ? "\u8acb\u81f3\u5c11\u9078\u64c7\u4e00\u7a2e\u53c3\u8207\u89d2\u8272\u3002" : "Please select at least one role."));
  }
}

roleBoxes.forEach((box) => box.addEventListener("change", () => {
  const index = roleOrder.indexOf(box);
  if (box.checked && index < 0) roleOrder.push(box);
  if (!box.checked && index >= 0) roleOrder.splice(index, 1);
  syncRoles();
}));
if (form?.elements.timezone && !form.elements.timezone.value) {
  try { form.elements.timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch {}
}
syncRoles();
form?.addEventListener("reset", () => { roleOrder.length = 0; setTimeout(syncRoles, 0); });
form?.addEventListener("formdata", (event) => {
  if (!roleBoxes.length) return;
  const selected = selectedRoles();
  event.formData.set("role", selected[0]?.dataset.roleBucket || "");
  const roles = selected.map((box) => `${box.value}: ${box.parentElement.textContent.trim()}`).join(" | ");
  const interest = String(event.formData.get("interest") || "");
  if (!["test", "\u6e2c\u8a66"].includes(interest.trim().toLowerCase())) event.formData.set("interest", `[Participation roles: ${roles}]\n${interest}`);
  event.formData.set("timing_resources", [
    `Participation roles: ${roles}`,
    `City / region: ${event.formData.get("city") || ""}`,
    `Time zone: ${event.formData.get("timezone") || ""}`,
    `Available time: ${event.formData.get("availability") || ""}`,
    `Resources: ${event.formData.get("resources") || ""}`,
    `Community invitation requested: ${form.elements.community_invitation?.checked ? "yes" : "no"}`
  ].join("\n"));
});

const roleAliases = { faculty: "educator", institution: "educator", ambassador: "community" };
document.querySelectorAll("[data-join-role]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!form) return;
    const role = roleAliases[link.dataset.joinRole] || link.dataset.joinRole;
    const box = roleBoxes.find((item) => item.value === role);
    if (box) { box.checked = true; box.dispatchEvent(new Event("change")); }
    if (link.hasAttribute("data-request-community")) form.elements.community_invitation.checked = true;
    if (link.dataset.joinWork) {
      const field = form.elements.interest;
      const prefix = language === "zh" ? "\u60f3\u8a0e\u8ad6\u7684\u5de5\u4f5c" : "Role to discuss";
      if (!field.value.includes(link.dataset.joinWork)) field.value = [field.value, `${prefix}: ${link.dataset.joinWork}`].filter(Boolean).join("\n");
    }
    box?.focus({ preventScroll: true });
  });
});

function revealProfileAnchor() {
  if (!location.hash) return;
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  for (let parent = target?.parentElement; parent; parent = parent.parentElement) if (parent.tagName === "DETAILS") parent.open = true;
}
window.addEventListener("hashchange", revealProfileAnchor);
revealProfileAnchor();

function loadSheetCounts() {
  if (!sheetApp) { showCountError(); return; }
  const status = document.querySelector("[data-count-status]");
  status.textContent = language === "zh" ? "\u6b63\u5728\u8b80\u53d6 Google Sheet\u2026" : "Loading Google Sheet\u2026";
  const script = document.createElement("script");
  let finished = false;
  const finish = (data) => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    script.remove();
    try { renderCounts(data); status.textContent = ""; } catch { showCountError(); }
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
