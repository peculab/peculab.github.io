// Keep old shared links useful after the overview was shortened.
if (/taiwan-seattle-bridge\.html$/.test(location.pathname)) {
  const aliases = { '#people': 'bridge-network.html#people', '#community': '#join', '#roles': '#join', '#why': '#mission', '#model': '#pilot', '#future': 'bridge-exchange-plan.html' };
  if (aliases[location.hash]) location.replace(aliases[location.hash]);
}
