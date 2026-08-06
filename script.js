document.addEventListener("DOMContentLoaded", () => {
  document.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().startsWith("---")) {
      node.remove();
    }
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

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
        caption: isChinese ? "以公開論文的 F1—信心曲線呈現模型評估；網站不使用傷口原始照片。" : "The public paper's F1–confidence curve communicates model evaluation without publishing wound photographs on the site."
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
