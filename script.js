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
});
