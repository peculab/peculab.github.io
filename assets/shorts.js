(() => {
  const form = document.querySelector('[data-short-filters]');
  if (!form) return;
  const search = form.querySelector('[data-short-search]');
  const source = form.querySelector('[data-short-source]');
  const year = form.querySelector('[data-short-year]');
  const topic = form.querySelector('[data-short-topic]');
  const cards = [...document.querySelectorAll('[data-short-card]')];
  const normalize = (value) => value.normalize('NFKC').toLocaleLowerCase();
  const texts = cards.map((card) => normalize(card.textContent + card.querySelector('template').content.textContent));
  const update = () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach((card, index) => {
      const match = (!source.value || card.dataset.source === source.value)
        && (!year.value || card.dataset.year === year.value)
        && (!topic.value || (card.dataset.topics || '').split(' ').includes(topic.value))
        && terms.every((term) => texts[index].includes(term));
      card.hidden = !match;
      if (match) count++;
    });
    document.querySelector('[data-short-count]').textContent = document.documentElement.lang.startsWith('zh')
      ? `${count} / ${cards.length} 篇短文` : `${count} / ${cards.length} notes`;
    document.querySelector('[data-short-empty]').hidden = count > 0;
  };
  form.hidden = false;
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('reset', () => setTimeout(update, 0));
})();
