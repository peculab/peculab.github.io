// Opening and keyboard activation work natively, including without JavaScript.
document.querySelectorAll('.site-navigation').forEach((menu) => {
  const toggle = menu.querySelector('summary');
  const close = (restoreFocus = false) => {
    if (!menu.open) return;
    menu.open = false;
    if (restoreFocus) toggle.focus();
  };
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      close(true);
      event.preventDefault();
    }
  });
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target)) close(menu.contains(document.activeElement));
  });
  document.addEventListener('focusin', (event) => {
    if (!menu.contains(event.target)) close();
  });
  menu.querySelectorAll('a').forEach((link) => {
    if (/\/taiwan-seattle-bridge\.html$/.test(new URL(link.href, location.href).pathname)) {
      link.textContent = document.documentElement.lang === 'zh-Hant'
        ? 'AI 實作合作'
        : 'AI Collaboration Bridge';
    }
    link.addEventListener('click', () => close(true));
    if (new URL(link.href, location.href).pathname === location.pathname && !link.hash) {
      link.setAttribute('aria-current', 'page');
    }
  });
});
