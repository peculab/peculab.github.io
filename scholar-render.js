document.addEventListener("DOMContentLoaded", () => {
  const data = window.scholarData;

  if (!data) return;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("citations-count", data.stats.citations);
  setText("hindex-count", data.stats.hIndex);
  setText("i10-count", data.stats.i10Index);
  setText("teaching-credits-count", data.stats.teachingCredits);

  const featuredMeta = document.getElementById("featured-meta");
  if (featuredMeta) {
    featuredMeta.textContent =
      `${data.featuredPublication.venue} • ${data.featuredPublication.year} • ${data.featuredPublication.citations} citations`;
  }

  const publicationGrid = document.getElementById("publication-grid");
  if (publicationGrid) {
    publicationGrid.innerHTML = data.publications
      .map((pub, index) => {
        let delayClass = "";
        if (index % 3 === 1) delayClass = " delay-1";
        if (index % 3 === 2) delayClass = " delay-2";

        return `
          <article class="card publication-card reveal${delayClass}">
            <span class="pub-count">${pub.citations} citations</span>
            <h3>${pub.title}</h3>
            <p class="meta">${pub.venue}</p>
          </article>
        `;
      })
      .join("");
  }
});