document.addEventListener("DOMContentLoaded", () => {
  document.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().startsWith("---")) {
      node.remove();
    }
  });

  let revealObserver = null;

  const showReveal = (el) => {
    if (el) el.classList.add("visible");
  };

  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );
  }

  const registerReveal = (el) => {
    if (!el) return;
    if (revealObserver) {
      revealObserver.observe(el);
    } else {
      showReveal(el);
    }
  };

  document.querySelectorAll(".reveal").forEach(registerReveal);

  const languageButtons = document.querySelectorAll("[data-filter]");
  const generatedNotes = document.querySelector(".jekyll-generated");
  const fallbackNotes = document.querySelector(".static-fallback");

  if (generatedNotes && !generatedNotes.textContent.includes("{%")) {
    generatedNotes.hidden = false;
    generatedNotes.querySelectorAll(".reveal").forEach(showReveal);
    if (fallbackNotes) fallbackNotes.hidden = true;
  }

  if (document.documentElement.lang === "zh-Hant" && /\/zh\/about\.html$/.test(location.pathname)) {
    const linkedIn = document.querySelector('a[href="https://www.linkedin.com/in/pecutsai/"]');
    if (linkedIn && !document.querySelector('a[href="https://www.facebook.com/pecu.tsai"]')) {
      const facebook = document.createElement("a");
      facebook.className = "button button-secondary";
      facebook.href = "https://www.facebook.com/pecu.tsai";
      facebook.target = "_blank";
      facebook.rel = "noreferrer";
      facebook.textContent = "Facebook";
      linkedIn.after(facebook);
    }
  }

  if (document.documentElement.lang === "zh-Hant" && /\/zh\/case-studies\.html$/.test(location.pathname)) {
    const appliedStack = document.querySelector(".applied-stack");
    if (appliedStack && !document.querySelector("[data-case='aiot']")) {
      appliedStack.insertAdjacentHTML("afterbegin", `
        <article class="applied-case" data-case="aiot">
          <div class="case-meta"><span>應用 AI · 數位孿生 · 智慧建築</span><strong>一年期顧問合作</strong></div>
          <div><h2>AIoT 跨系統環境管理整合</h2><p class="lead">為期一年的產學顧問合作，以 AI Design 建構可實際運作的智慧建築數位孿生示範。</p><h3>營運挑戰</h3><p>專案整合感測器、攝影機、LINE、大型語言模型服務、第三方 API 與自動化任務，讓使用者能透過對話監控並控制真實住宅環境。</p><h3>已記錄成果</h3><ul><li>專題比較期間達成 <strong>47.77% 實測節電成果</strong>。</li><li>獲得 <strong>2024 智慧化居住空間創意競賽優選獎</strong>。</li><li>場域落地成果後續整理並發表為 <strong>IEEE 論文</strong>。</li></ul><div class="solution-visual-grid"><figure class="solution-visual" style="background:#fff"><img src="../assets/aiot-system-poster.jpg" alt="AIoT 跨系統環境管理專題海報，呈現數位孿生架構、節電成果與對話式控制介面" width="1440" height="2039" loading="lazy" style="aspect-ratio:auto;height:auto;object-fit:contain"><figcaption style="position:static;padding:1rem 1.3rem;background:#173f37"><span>系統實證</span><strong>數位孿生架構、實驗場域、節電成果與控制介面</strong></figcaption></figure><figure class="solution-visual" style="background:#fff"><img src="../assets/aiot-award.jpg" alt="AIoT 專題海報與 2024 智慧化居住空間創意競賽優選證書及獎座" width="1080" height="1439" loading="lazy" style="aspect-ratio:auto;height:auto;object-fit:contain"><figcaption style="position:static;padding:1rem 1.3rem;background:#173f37"><span>公開肯定</span><strong>2024 競賽優選證書與獎座</strong></figcaption></figure></div><p class="product-outcome"><strong>證明能力：</strong>從問題定義、系統整合協調、場域測試與量化證據，到研究轉譯的完整顧問路徑。這是依客戶情境完成的示範案，不是套裝銷售的標準產品。</p><p><a class="text-link" href="https://ieeexplore.ieee.org/abstract/document/11148518" target="_blank" rel="noreferrer">閱讀 IEEE 論文 →</a> · <a class="text-link" href="https://www.threads.com/@pecutsai/post/DB-ndYiTLME" target="_blank" rel="noreferrer">查看 2024 得獎紀錄 →</a></p><p class="boundary-note">競賽、學校與公司名稱僅用於說明已記錄的專案背景，不代表相關機構為 PECULAB 服務背書。</p></div>
        </article>`);
    }
  }

  if (/\/case-studies\.html$/.test(location.pathname)) {
    const isChinese = document.documentElement.lang === "zh-Hant";
    const assetRoot = isChinese ? "../assets/" : "assets/";
    const evidenceByTitle = [
      {
        match: "Jubo N-Copilot",
        file: "jubo-n-copilot-collage.png",
        alt: isChinese ? "Jubo N-Copilot 於 Healthcare+ Expo 展示、Minerva 專案發表與跨校團隊合照組成的專案歷程" : "Jubo N-Copilot project journey combining the Healthcare+ Expo demonstration, Minerva presentation, and cross-institution team",
        label: isChinese ? "從合作到公開展示" : "From collaboration to public demonstration",
        caption: isChinese ? "N-Copilot 展場實證、Minerva Civic Project 發表與跨校團隊合作。" : "N-Copilot field demonstration, Minerva Civic Project presentation, and cross-institution collaboration."
      },
      {
        match: isChinese ? "360 度績效制度" : "360-degree performance system",
        file: "hr-360-efficiency.svg",
        alt: isChinese ? "簡化 360 度績效制度導入數位工具前後的效率比較" : "Efficiency comparison before and after digital tools were added to the simplified 360-degree performance system",
        label: isChinese ? "公開論文的導入證據" : "Implementation evidence from the public paper",
        caption: isChinese ? "完整週期由 50 降至 30 個工作天；HR 處理時間由 30 降至 8 個工作天。" : "The total cycle fell from 50 to 30 working days; HR processing fell from 30 to 8 working days."
      },
      {
        match: isChinese ? "Airbnb 市場證據" : "Airbnb market evidence",
        file: "airahost-benchmark-report.png",
        alt: isChinese ? "AiraHost 範例報告的基準房源、模型信心、結構相似度與資料品質畫面" : "AiraHost sample report showing the benchmark listing, confidence, structural match, and pricing-data quality",
        label: isChinese ? "可解釋的定價依據" : "Inspectable pricing evidence",
        caption: isChinese ? "公開範例中的基準房源、信心訊號、結構相似度與資料篩選紀錄。" : "The public sample exposes its benchmark, confidence signals, structural match, and data-filtering record."
      },
      {
        match: isChinese ? "讓臨床 AI 可以被檢視" : "Making clinical AI inspectable",
        file: "clinical-wound-f1-curve.png",
        alt: isChinese ? "公開傷口分割論文中的 F1 分數與模型信心門檻曲線" : "F1 score versus confidence threshold from the public wound-segmentation paper",
        label: isChinese ? "不揭露病患影像的模型證據" : "Model evidence without patient imagery",
        caption: isChinese ? "以公開論文的 F1, 信心曲線呈現模型評估；網站不使用傷口原始照片。" : "The public paper's F1-confidence curve communicates model evaluation without publishing wound photographs on the site."
      },
      {
        match: isChinese ? "教人指揮 AI" : "Teaching people to direct AI",
        file: "education-active-learning-pca.png",
        alt: isChinese ? "公開教育研究中以 PCA 呈現五個學院學生學習表現的三維分布" : "Three-dimensional PCA distribution of student performance across five colleges from the public education study",
        label: isChinese ? "跨學院學習成效證據" : "Cross-disciplinary learning evidence",
        caption: isChinese ? "公開論文以 PCA 比較五個學院學生的作業與成果展示表現。" : "The open-access paper uses PCA to compare assignment and final-demo performance across five colleges."
      },
      {
        match: "Turning models into experiments",
        file: "finance-candlestick-patterns.png",
        alt: "Morning Star and Evening Star candlestick patterns encoded as images in the public finance paper",
        label: "From financial data to reproducible visual input",
        caption: "A figure from the public paper illustrates how candlestick patterns become image-classification inputs."
      },
      {
        match: isChinese ? "為年輕學習者設計密集 AI 實作" : "Designing intensive AI learning for young people",
        file: "junior-natea-showcase.jpg",
        alt: isChinese ? "Junior NATEA 2026 營隊 Day 5 參與者與導師在成果展示現場合影" : "Junior NATEA 2026 Day 5 participants and mentors gathered at the program showcase",
        label: isChinese ? "從密集實作到成果發表" : "From intensive practice to public showcase",
        caption: isChinese ? "Junior NATEA 2026 Day 5：參與者、導師與投影內容共同記錄五日營隊的成果展示。" : "Junior NATEA 2026 Day 5: participants, mentors, and projected work document the five-day program showcase."
      },
      {
        match: isChinese ? "讓挑戰從想法走向原型" : "Designing challenges that move from ideas to prototypes",
        file: "fih-hackathon-official.png",
        alt: isChinese ? "Future Intelligence Hub 官方網站的活動區塊，呈現 Future Solutions Challenge 與 LearnHack 2026" : "Future Intelligence Hub official events section showing the Future Solutions Challenge and LearnHack 2026",
        label: isChinese ? "官方挑戰與黑客松路徑" : "Official challenge and hackathon pathway",
        caption: isChinese ? "FIH 官方活動頁把未來情境、原型製作與一分鐘提案串成可執行的挑戰路徑。" : "FIH's official events page connects future scenarios, prototype building, and one-minute pitches into an actionable challenge pathway."
      }
    ];

    document.querySelectorAll(".applied-case").forEach((card) => {
      const heading = card.querySelector("h2");
      const evidence = heading && evidenceByTitle.find((item) => heading.textContent.includes(item.match));
      if (!evidence || card.querySelector(".case-evidence-figure")) return;
      const figure = document.createElement("figure");
      figure.className = "case-evidence-figure";
      figure.innerHTML = `<img src="${assetRoot}${evidence.file}" alt="${evidence.alt}" loading="lazy"><figcaption><span>${evidence.label}</span><strong>${evidence.caption}</strong></figcaption>`;
      const lead = card.querySelector(".lead") || card.querySelector("h2 + p");
      if (lead) lead.after(figure);
    });
  }

  // Keep the UW result charts in the page's single scrolling context.
  document.querySelectorAll(".uw-result-card iframe").forEach((frame) => {
    frame.setAttribute("scrolling", "no");
    frame.addEventListener("load", () => {
      try {
        const chartHeight = frame.contentDocument.documentElement.scrollHeight;
        if (chartHeight) frame.style.height = `${Math.max(820, chartHeight + 8)}px`;
      } catch (_) {
        // The fixed CSS height remains as a safe fallback for local file previews.
      }
    });
  });

  document.querySelectorAll(".uw-talk-rotator").forEach((rotator) => {
    const frames = [...rotator.querySelectorAll(".uw-talk-frames img")];
    if (frames.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let activeIndex = 0;
    const showRandomFrame = () => {
      let nextIndex;
      do nextIndex = Math.floor(Math.random() * frames.length); while (nextIndex === activeIndex);
      frames[activeIndex].classList.remove("is-active");
      frames[nextIndex].classList.add("is-active");
      activeIndex = nextIndex;
    };
    window.setInterval(showRandomFrame, 4500);
  });
});

// Open Challenge discovery path: homepage awareness → project context → a small GitHub task.
(() => {
  const path = location.pathname.replace(/\\/g, "/");
  const isChinese = document.documentElement.lang === "zh-Hant";
  const isHome = (/(?:^|\/)index\.html$/.test(path) || /\/(?:zh\/)?$/.test(path))
    && !/workshop|field-notes|open-challenges/.test(path);
  const isBridge = /\/taiwan-seattle-bridge\.html$/.test(path);
  if (!isHome && !isBridge) return;

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `${isChinese ? "../" : ""}open-challenge.css?v=20261028`;
  document.head.append(css);

  const landing = isChinese
    ? "open-challenges/ownership-code-pilot.html"
    : "open-challenges/ownership-code-pilot.html";
  const landingFromBridge = isChinese
    ? "open-challenges/ownership-code-pilot.html"
    : "open-challenges/ownership-code-pilot.html";
  const goodFirstIssues = "https://github.com/peculab/ownership-code-pilot/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22";
  const repository = "https://github.com/peculab/ownership-code-pilot";

  const nav = document.querySelector(".site-nav-links");
  if (nav && !nav.querySelector("[data-open-challenge-nav]")) {
    const navLink = document.createElement("a");
    navLink.href = landing;
    navLink.dataset.openChallengeNav = "";
    navLink.textContent = isChinese ? "開源挑戰" : "Open Challenge";
    nav.insertBefore(navLink, nav.querySelector(".language-switch") || null);
  }

  if (isHome && !document.querySelector(".oc-home-promo")) {
    const hero = document.querySelector(".personal-hero");
    const promo = document.createElement("section");
    promo.className = "oc-home-promo";
    promo.setAttribute("aria-labelledby", "open-challenge-home-title");
    promo.innerHTML = isChinese ? `
      <div class="container oc-home-grid"><div><p class="eyebrow">OPEN CHALLENGE · 邀請貢獻者</p><h2 id="open-challenge-home-title">AI 能準備有用的回答，也知道何時該交給真人嗎？</h2><p class="lead">一起建立有來源、可審閱的開源 AI 流程。真實情境由 Ownership Code 提出，通用成果開放所有人依授權取用。</p><div class="oc-badges"><span>Open Source</span><span>合成資料可用</span><span>BYOK</span><span>人工審閱</span></div></div><div><p>研究、UX、評量、工程與文件都有可以立即開始的小任務。不需要企業帳密或私人社群資料。</p><div class="bridge-actions"><a class="button button-primary" href="${landing}">60 秒了解題目</a><a class="button button-secondary" href="${goodFirstIssues}" target="_blank" rel="noopener">選一張入門任務 ↗</a><a class="text-link" href="${repository}" target="_blank" rel="noopener">查看 GitHub ↗</a></div></div></div>` : `
      <div class="container oc-home-grid"><div><p class="eyebrow">OPEN CHALLENGE · CONTRIBUTORS WANTED</p><h2 id="open-challenge-home-title">Can AI prepare a useful answer—and know when a human should take over?</h2><p class="lead">Help build a source-grounded, human-reviewed open-source AI workflow. Ownership Code contributed the first real scenario; the reusable work stays open to everyone under its license.</p><div class="oc-badges"><span>Open source</span><span>Synthetic data ready</span><span>BYOK</span><span>Human review</span></div></div><div><p>Research, UX, evaluation, engineering, and documentation each have a small task that can begin without company credentials or private community data.</p><div class="bridge-actions"><a class="button button-primary" href="${landing}">Understand it in 60 seconds</a><a class="button button-secondary" href="${goodFirstIssues}" target="_blank" rel="noopener">Choose a starter task ↗</a><a class="text-link" href="${repository}" target="_blank" rel="noopener">View GitHub ↗</a></div></div></div>`;
    hero?.after(promo);
  }

  if (isBridge) {
    const pilot = document.querySelector("#pilot");
    if (!pilot) return;
    const eyebrow = pilot.querySelector(":scope > .container > .eyebrow");
    const heading = pilot.querySelector(":scope > .container > h2");
    const lead = pilot.querySelector(".bridge-pilot-header .lead");
    const status = pilot.querySelector(".bridge-status");
    if (eyebrow) eyebrow.textContent = isChinese ? "首期示範 · 開源專案已公開" : "FIRST PILOT · OPEN-SOURCE PROJECT";
    if (heading) heading.textContent = isChinese ? "Open Challenge：人工審閱的 AI 客戶問題流程" : "Open Challenge: Human-Reviewed AI for Customer Questions";
    if (lead) lead.textContent = isChinese
      ? "Ownership Code 提供第一個真實企業情境；PecuLab 將它轉成公開的開源挑戰。企業可以取用成果，貢獻者與其他組織也能重用通用核心。"
      : "Ownership Code contributed the first real business scenario; PecuLab reframed it as a public open-source challenge. The company may use the result, while contributors and other organizations can reuse the core.";
    if (status) status.textContent = isChinese ? "Open source · 5 張公開任務可認領" : "Open source · 5 public tasks ready";

    const brief = pilot.querySelector(".pilot-brief");
    if (brief) brief.innerHTML = isChinese ? `
      <div><dt>Challenge</dt><dd>AI 能否整理客戶問題、找到核准來源並準備草稿，同時知道何時應交給真人？</dd></div><div><dt>Open-source scope</dt><dd>通用流程、schema、mock、評量方法及合成案例採 Apache-2.0 開放。</dd></div><div><dt>Contributors needed</dt><dd>研究、UX、AI 評量、工程、安全與文件；可以先完成一項 1–4 小時的小任務。</dd></div><div><dt>Company contribution</dt><dd>Ownership Code 提供第一個情境與領域回饋，不獨占開源核心，也不取得貢獻者的聘僱或股權關係。</dd></div><div><dt>Evidence of success</dt><dd>相關性、來源支持、不確定性、安全接手、可重現性及 Token／成本都需留下紀錄。</dd></div><div><dt>Current status</dt><dd>題目、安全邊界、合成資料與 5 張公開 Issue 已發布；正在邀請第一批貢獻者。</dd></div>` : `
      <div><dt>Challenge</dt><dd>Can AI organize customer questions, retrieve approved evidence, prepare a draft, and know when a person should take over?</dd></div><div><dt>Open-source scope</dt><dd>The reusable workflow, schemas, mock path, evaluation methods, and synthetic scenarios are available under Apache-2.0.</dd></div><div><dt>Contributors needed</dt><dd>Research, UX, AI evaluation, engineering, safety, and documentation. Begin with one focused 1–4 hour task.</dd></div><div><dt>Company contribution</dt><dd>Ownership Code contributed the first scenario and domain feedback; it does not exclusively own the core or create employment or equity rights.</dd></div><div><dt>Evidence of success</dt><dd>Record relevance, source support, uncertainty, safe handoff, reproducibility, and Token or cost assumptions.</dd></div><div><dt>Current status</dt><dd>The challenge, safety boundaries, synthetic data, and five public Issues are live. First contributors are invited.</dd></div>`;

    const progress = pilot.querySelector(".pilot-progress");
    if (progress) progress.innerHTML = isChinese
      ? '<span class="is-complete">✓ 題目已界定</span><span class="is-complete">✓ Repository 已公開</span><span class="is-current">◉ 邀請貢獻者</span><span>○ Baseline 與公開評量</span>'
      : '<span class="is-complete">✓ Challenge framed</span><span class="is-complete">✓ Repository open</span><span class="is-current">◉ Contributors wanted</span><span>○ Baseline & public evaluation</span>';

    pilot.querySelector(".bridge-pilot-more")?.remove();
    const actions = pilot.querySelector(":scope > .container > .bridge-actions");
    if (actions) actions.innerHTML = isChinese
      ? `<a class="button button-primary" href="${landingFromBridge}">完整了解題目 →</a><a class="button button-secondary" href="${goodFirstIssues}" target="_blank" rel="noopener">選一張入門任務 ↗</a><a class="text-link" href="${repository}" target="_blank" rel="noopener">追蹤 GitHub 進度 ↗</a>`
      : `<a class="button button-primary" href="${landingFromBridge}">Explore the full challenge →</a><a class="button button-secondary" href="${goodFirstIssues}" target="_blank" rel="noopener">Choose a starter task ↗</a><a class="text-link" href="${repository}" target="_blank" rel="noopener">Follow progress on GitHub ↗</a>`;

    if (!pilot.querySelector(".bridge-open-source-callout")) {
      const callout = document.createElement("aside");
      callout.className = "bridge-open-source-callout";
      callout.innerHTML = isChinese
        ? `<p class="eyebrow">為什麼值得參與</p><h3>不是替一家企業免費交付，而是共同建立任何組織都能重用的方法。</h3><p>所有人都能看到題目、做法、Pull Request、評量與限制。每個部署者自行提供模型帳號並負擔 Token；私人資料不進入公開 Repository。</p><div class="oc-badges"><span>公開署名</span><span>合成資料</span><span>人工審閱</span><span>不自動對外聯繫</span></div>`
        : `<p class="eyebrow">WHY CONTRIBUTE</p><h3>This is not a free exclusive deliverable. It is a reusable method built in public.</h3><p>Anyone can inspect the challenge, Pull Requests, evaluation, and limitations. Each deployer supplies its own model account and Token budget; private data stays out of the public repository.</p><div class="oc-badges"><span>Public credit</span><span>Synthetic data</span><span>Human review</span><span>No automatic outreach</span></div>`;
      actions?.before(callout);
    }
  }
})();
