document.addEventListener("DOMContentLoaded", () => {
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

  const scholarData = {
    stats: {
      citations: 631,
      hIndex: 13,
      i10Index: 16,
      teachingCredits: 37,
    },

    featuredPublication: {
      venue: "Financial Innovation",
      year: 2020,
      citations: 154,
    },

    publications: [
      {
        title:
          "Text mining analysis of teaching evaluation questionnaires for the selection of outstanding teaching faculty members",
        venue: "IEEE Access • 2018",
        citations: 73,
      },
      {
        title:
          "Empowering Learner-Centered Instruction: Integrating ChatGPT Python API and Tinker Learning for Enhanced Creativity and Problem-Solving Skills",
        venue: "ICITL • 2023",
        citations: 52,
      },
      {
        title:
          "Empowering students through active learning in educational big data analytics",
        venue: "Smart Learning Environments • 2024",
        citations: 39,
      },
      {
        title: "Predict forex trend via convolutional neural networks",
        venue: "Journal of Intelligent Systems • 2019",
        citations: 35,
      },
      {
        title:
          "Learner-Centered Analysis in Educational Metaverse Environments",
        venue: "Journal of Metaverse • 2023",
        citations: 16,
      },
      {
        title:
          "Enhancing Python Learning through Retrieval-Augmented Generation",
        venue: "ICITL • 2024",
        citations: 10,
      },
    ],
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("citations-count", scholarData.stats.citations);
  setText("hindex-count", scholarData.stats.hIndex);
  setText("i10-count", scholarData.stats.i10Index);
  setText("teaching-credits-count", scholarData.stats.teachingCredits);

  const featuredMeta = document.getElementById("featured-meta");
  if (featuredMeta) {
    featuredMeta.textContent =
      `${scholarData.featuredPublication.venue} • ` +
      `${scholarData.featuredPublication.year} • ` +
      `${scholarData.featuredPublication.citations} citations`;
  }

  const publicationGrid = document.getElementById("publication-grid");
  if (publicationGrid) {
    publicationGrid.innerHTML = "";

    scholarData.publications.forEach((pub, index) => {
      const article = document.createElement("article");
      article.className = "card publication-card reveal";

      if (index % 3 === 1) article.classList.add("delay-1");
      if (index % 3 === 2) article.classList.add("delay-2");

      article.innerHTML = `
        <span class="pub-count">${pub.citations} citations</span>
        <h3>${pub.title}</h3>
        <p class="meta">${pub.venue}</p>
      `;

      publicationGrid.appendChild(article);
      registerReveal(article);
    });
  }
});