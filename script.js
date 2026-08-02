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
    const proofBand = document.querySelector(".proof-band");
    if (proofBand && !document.querySelector(".proof-story-section")) {
      proofBand.insertAdjacentHTML("afterend", `
        <section class="section proof-story-section">
          <div class="container proof-story">
            <div>
              <p class="eyebrow">一年期顧問合作</p>
              <h2>AIoT 跨系統環境管理整合</h2>
              <p class="section-intro">在這項為期一年的產學顧問合作中，我協助以 AI Design 建構可實際運作的智慧建築數位孿生示範，整合感測器、攝影機、LINE、大型語言模型服務、第三方 API 與自動化任務，讓使用者能透過對話監控並控制真實住宅環境。</p>
              <div class="proof-story-metrics"><div><strong>47.77%</strong><span>專題紀錄比較期間的實測節電成果</span></div><div><strong>2024</strong><span>智慧化居住空間創意競賽優選獎</span></div><div><strong>研究發表</strong><span>落地成果後續整理並發表為 IEEE 論文</span></div></div>
            </div>
            <aside class="proof-story-links">
              <p class="label-chip">應用 AI · 數位孿生 · 智慧建築</p>
              <h3>顧問能力示範，而非套裝商模</h3>
              <p>這項工作呈現完整的顧問路徑：定義營運問題、協調系統整合、進入真實場域測試、記錄可衡量成果，再把實作知識轉化為研究。它目前仍是依客戶情境完成的示範案，而不是可直接複製銷售的標準產品。</p>
              <a class="button button-primary" href="https://ieeexplore.ieee.org/abstract/document/11148518" target="_blank" rel="noreferrer">閱讀 IEEE 論文</a>
              <a class="text-link" href="https://www.threads.com/@pecutsai/post/DB-ndYiTLME" target="_blank" rel="noreferrer">查看 2024 得獎紀錄 →</a>
            </aside>
          </div>
          <p class="container boundary-note proof-story-note">競賽、學校與公司名稱僅用於說明已記錄的專案背景，不代表相關機構為 PECULAB 服務背書。</p>
        </section>`);
    }
  }
});
