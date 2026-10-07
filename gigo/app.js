(() => {
  'use strict';
  const root = document.documentElement;
  const buttons = document.querySelectorAll('[data-language]');
  function setLanguage(lang) {
    lang = lang === 'en' ? 'en' : 'zh-Hant';
    root.lang = lang;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.language === lang)));
    document.title = document.body.dataset[lang === 'en' ? 'titleEn' : 'titleZh'];
    try { localStorage.setItem('gigo-language', lang); } catch (_) {}
    const url = new URL(location.href);
    url.searchParams.set('lang', lang === 'en' ? 'en' : 'zh');
    try { history.replaceState(null, '', url); } catch (_) {}
  }
  buttons.forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.language)));
  let saved;
  try { saved = localStorage.getItem('gigo-language'); } catch (_) {}
  const requested = new URLSearchParams(location.search).get('lang');
  setLanguage(requested === 'en' ? 'en' : requested === 'zh' ? 'zh-Hant' : saved || 'zh-Hant');
})();
