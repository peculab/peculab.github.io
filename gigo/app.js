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
    calculate();
  }
  buttons.forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.language)));
  const form = document.querySelector('#cost-form');
  const money = n => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
  function calculate() {
    if (!form) return;
    const en = root.lang === 'en';
    const read = id => Number(document.getElementById(id).value);
    const mode = document.getElementById('mode').value;
    document.querySelectorAll('[data-mode]').forEach(el => {
      el.hidden = el.dataset.mode !== mode;
      el.querySelectorAll('input').forEach(input => input.disabled = el.hidden);
    });
    if (!form.checkValidity()) {
      document.getElementById('result-content').hidden = true;
      document.getElementById('invalid-input').hidden = false;
      return;
    }
    document.getElementById('result-content').hidden = false;
    document.getElementById('invalid-input').hidden = true;
    const n = read('students'), fee = read('fee'), weeks = read('weeks');
    const share = mode === 'city' ? read('share') / 100 : read('processing') / 100;
    const rental = mode === 'rental' ? read('rent') * read('hours') : 0;
    const equipment = read('equipment') / read('life');
    const otherFixed = read('teacher') + read('assistant') + read('overhead') + rental;
    const fixed = otherFixed + equipment;
    const price = fee / weeks;
    const gross = n * price;
    const contribution = price * (1-share) - read('variable');
    const profit = n * contribution - fixed;
    const breakEven = contribution > 0 ? Math.ceil((fixed - 1e-9) / contribution) : null;
    const values = {gross:money(gross), deduction:money(gross*share), variableTotal:money(n*read('variable')), fixed:money(fixed), profit:money(profit), termProfit:money(profit*weeks), breakEven:breakEven === null ? (en?'Not possible':'無法損益兩平') : `${breakEven} ${en?'students':'人'}`, cash:money((n*contribution-otherFixed)*weeks-read('equipment'))};
    Object.entries(values).forEach(([id,value]) => document.getElementById(id).textContent = value);
    document.getElementById('profit').classList.toggle('warning', profit < 0);
    document.getElementById('deduction-label').textContent = en ? (mode === 'city' ? 'City share / class' : 'Payment fee / class') : (mode === 'city' ? '市府分潤／堂' : '金流費／堂');
    document.getElementById('model-note').textContent = en ? (mode === 'city' ? 'Scenario: the city share includes the room and registration; no separate rental or payment fee. Contract not confirmed.' : 'Scenario: independent rental with payment fees; no city revenue share. The published NKCC room requires at least 2 weekday hours. Business use and availability must be confirmed.') : (mode === 'city' ? '情境假設：分潤已包含場地與報名服務，不另計場租及金流費；尚未確認合約。' : '情境假設：自行租場並負擔金流費，不計市府分潤。NKCC 公開場租平日至少 2 小時；開班用途與檔期仍須確認。');
    const status = breakEven === null || breakEven > 12 ? (en?'This cost structure exceeds the recommended 12-student ceiling. Renegotiate the venue or price; do not enlarge the pilot to cover costs.':'此成本結構超過建議的 12 人上限。應調整場地或價格，不宜為了攤成本擴大試辦班。') : profit < 0 ? (en?'Below break-even at this enrollment.':'目前人數尚未損益兩平。') : (en?'Positive operating balance after the entered staff pay and equipment allocation. This is not guaranteed take-home profit.':'扣除輸入的師資報酬與設備攤提後，營運餘額為正；不代表保證實領利潤。');
    document.getElementById('status').textContent = n > 12 ? (en ? 'This enrollment exceeds the recommended 12-learner pilot ceiling. The financial result does not establish teaching feasibility.' : '目前人數超過試辦建議的 12 人上限；財務結果不代表教學配置可行。') : status;
    const rows = [6,8,10,12].map(count => `<tr${count===n?' class="highlight"':''}><td>${count}</td><td>${money(count*price)}</td><td>${money(count*contribution-fixed)}</td><td>${money((count*contribution-fixed)*weeks)}</td></tr>`);
    document.getElementById('scenario-rows').innerHTML = rows.join('');
    document.querySelectorAll('[data-mode]').forEach(el => el.hidden = el.dataset.mode !== mode);
  }
  if (form) {
    form.addEventListener('input', calculate);
    form.addEventListener('change', calculate);
    form.addEventListener('submit', e => e.preventDefault());
    form.addEventListener('reset', () => setTimeout(calculate, 0));
  }
  let saved;
  try { saved = localStorage.getItem('gigo-language'); } catch (_) {}
  const requested = new URLSearchParams(location.search).get('lang');
  setLanguage(requested === 'en' ? 'en' : requested === 'zh' ? 'zh-Hant' : saved || 'zh-Hant');
})();
