// Run with Node.js 22+ and Chromium. Set CHROME_PATH if Chromium is not on PATH.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const project = new URL("../natea-digitimes-2026/", import.meta.url);
const output = new URL("assets/images/og-cover-v1.jpg", project);
const browser = process.env.CHROME_PATH ||
  (process.platform === "win32"
    ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
    : "chromium");
const sponsors = [
  ["NATEA Seattle", "Event Organizer", "../assets/bridge-network/natea-seattle-adapted.png", "natea"],
  ["NSF A3D3 Institute", "Co-Organizer", "assets/logos/a3d3.png", "a3d3"],
  ["DIGITIMES", "Featured Speaker Organization", "assets/logos/digitimes.svg", "digitimes"],
  ["PecuLab", "Website Hosting &amp; Digital Infrastructure", "../assets/peculab-mark-clean.png", "peculab"]
];

async function imageUrl(path) {
  const type = { ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" }[extname(path)];
  return "data:" + type + ";base64," + (await readFile(new URL(path, project))).toString("base64");
}

const portrait = await imageUrl("assets/speakers/colley-hwang.jpg");
const credits = await Promise.all(sponsors.map(async ([name, role, path, id]) => `
  <div class="credit">
    <div class="brand">
      <img class="${id}" src="${await imageUrl(path)}" alt="${name}">
      ${id === "natea" || id === "digitimes" ? "" : "<strong>" + name + "</strong>"}
    </div>
    <span>${role}</span>
  </div>`));

const cover = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Forum share image</title>
<style>
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: radial-gradient(ellipse at 78% 28%, #1a3d54, #0b172b 68%); color: #fff; font-family: "Segoe UI", Arial, sans-serif; }
.circuit { position: absolute; top: 0; right: 0; width: 520px; height: 470px; opacity: .28; background:
  repeating-linear-gradient(90deg, transparent 0 36px, #3d8799 36px 37px),
  repeating-linear-gradient(0deg, transparent 0 36px, #3d8799 36px 37px);
  mask-image: radial-gradient(ellipse at 70% 40%, black 20%, transparent 76%); }
main { position: relative; padding: 60px; height: 100%; }
.series { margin: 0; color: #82e2f1; font-size: 20px; font-weight: 750; letter-spacing: .12em; }
h1 { margin: 19px 0 13px; width: 730px; font-size: 63px; line-height: 1.03; letter-spacing: -.045em; }
.subtitle { margin: 0 0 23px; font-size: 31px; font-weight: 650; color: #e7c78a; }
.date { margin: 0 0 6px; font-size: 25px; font-weight: 780; letter-spacing: .035em; }
.region { margin: 0 0 11px; color: #eef2f7; font-size: 22px; }
.tagline { margin: 0; color: #82e2f1; font-size: 21px; font-weight: 650; }
.portrait { position: absolute; top: 60px; right: 60px; width: 332px; height: 360px; object-fit: cover; object-position: center 22%; border: 1px solid #84becb; border-radius: 12px; }
.credits { position: absolute; bottom: 60px; left: 60px; right: 60px; display: grid; grid-template-columns: 1fr 1fr 1.06fr 1.28fr; gap: 16px; padding-top: 22px; border-top: 1px solid #4b788b; }
.credit { min-width: 0; }
.brand { height: 45px; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.brand img { display: block; object-fit: contain; height: 42px; width: 44px; }
.brand .natea { width: 174px; height: 45px; object-fit: contain; object-position: left; }
.brand .digitimes { width: 154px; height: 31px; object-position: left; }
.brand strong { font-size: 20px; white-space: nowrap; }
.credit span { color: #d9e5ee; font-size: 15px; font-weight: 600; white-space: nowrap; }
</style>
<div class="circuit"></div>
<main>
  <p class="series">SEATTLE TECHNOLOGY &amp; INDUSTRY FORUM 2026</p>
  <h1>AI, Semiconductors<br>&amp; Global Supply Chains</h1>
  <p class="subtitle">A Conversation with Colley Hwang</p>
  <p class="date">DEC 12, 2026 | 10 AM–12 PM</p>
  <p class="region">Greater Seattle Area, Washington</p>
  <p class="tagline">Connecting Taiwan &amp; the United States</p>
  <img class="portrait" src="${portrait}" alt="Colley Hwang">
  <div class="credits">${credits.join("")}</div>
</main></html>`;

const temporary = await mkdtemp(join(tmpdir(), "natea-og-"));
let chrome;
let socket;
const deadline = setTimeout(() => {
  console.error("Chromium render timed out.");
  chrome?.kill();
  process.exitCode = 1;
  socket?.close();
}, 30000);

try {
  const htmlFile = join(temporary, "cover.html");
  await writeFile(htmlFile, cover);
  const flags = [
    "--headless", "--disable-gpu", "--disable-software-rasterizer", "--in-process-gpu",
    "--no-first-run", "--disable-extensions", "--remote-debugging-port=0",
    "--user-data-dir=" + join(temporary, "profile")
  ];
  if (process.argv.includes("--no-sandbox")) flags.push("--no-sandbox");
  chrome = spawn(browser, [...flags, "about:blank"], { stdio: "ignore", windowsHide: true });
  let startupError;
  chrome.once("error", (error) => { startupError = error; });
  const portFile = join(temporary, "profile", "DevToolsActivePort");
  for (let attempt = 0; !existsSync(portFile) && attempt < 100; attempt++) {
    if (startupError) throw startupError;
    if (chrome.exitCode !== null) throw new Error("Chromium exited before starting DevTools.");
    await delay(100);
  }
  const port = (await readFile(portFile, "utf8")).split(/\r?\n/)[0];
  const pages = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
  socket = new WebSocket(pages.find((page) => page.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", () => reject(new Error("Could not connect to Chromium.")), { once: true });
  });

  let id = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  };
  socket.addEventListener("close", () => {
    for (const { reject } of pending.values()) reject(new Error("Chromium disconnected."));
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  await call("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  const htmlUrl = pathToFileURL(htmlFile).href;
  await call("Page.navigate", { url: htmlUrl });
  let ready = false;
  for (let attempt = 0; !ready && attempt < 100; attempt++) {
    const { result } = await call("Runtime.evaluate", {
      expression: `location.href === ${JSON.stringify(htmlUrl)} && document.readyState === "complete" &&
        document.images.length === 5 && [...document.images].every(img => img.naturalWidth > 0) && document.fonts.status === "loaded"`,
      returnByValue: true
    });
    ready = result.value;
    if (!ready) await delay(100);
  }
  if (!ready) throw new Error("Cover images or fonts did not load.");
  const { data } = await call("Page.captureScreenshot", { format: "jpeg", quality: 91 });
  await mkdir(dirname(fileURLToPath(output)), { recursive: true });
  await writeFile(output, Buffer.from(data, "base64"));
  console.log(fileURLToPath(output));
} finally {
  clearTimeout(deadline);
  socket?.close();
  if (chrome?.pid && chrome.exitCode === null) {
    const exited = new Promise((resolve) => chrome.once("exit", resolve));
    chrome.kill();
    await Promise.race([exited, delay(1000)]);
  }
  await rm(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
}
