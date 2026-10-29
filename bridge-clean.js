// Keep old shared links useful after the overview was shortened.
if (/taiwan-seattle-bridge\.html$/.test(location.pathname)) {
  const aliases = { '#people': 'bridge-network.html#people', '#community': '#join', '#roles': '#join', '#why': '#mission', '#model': '#pilot', '#future': 'bridge-exchange-plan.html' };
  if (aliases[location.hash]) location.replace(aliases[location.hash]);
}

// A profile link opens its group before scrolling to the selected person.
function revealProfile() {
  if (!/bridge-network\.html$/.test(location.pathname) || !location.hash) return;
  const person = document.getElementById(location.hash.slice(1));
  if (!person) return;
  if (person.tagName === 'DETAILS') person.open = true;
  for (let parent = person.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
  requestAnimationFrame(() => person.scrollIntoView({ block: 'start' }));
}
revealProfile();
window.addEventListener('hashchange', revealProfile);
