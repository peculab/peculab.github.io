// Inject after the page scripts in a local browser preview. No external dependencies.
(() => {
  const results=[];
  const assert=(condition,name)=>{results.push({name,passed:!!condition});};
  const $=id=>document.getElementById(id);
  const input=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new Event('input'));};
  const count=()=>document.querySelectorAll('.network-node').length;
  assert(count()===28,'Initial 28 nodes');
  assert(document.querySelectorAll('#network-svg line').length===56,'Initial 56 edges');
  document.querySelector('.network-node[data-id="n26"]').dispatchEvent(new MouseEvent('click'));
  assert($('network-detail').textContent.includes('240 / 1072'),'Node selection and frequency');
  assert($('network-detail').querySelectorAll('li button').length>0,'Navigable neighbors');
  $('network-detail').querySelector('li button').click();
  assert(document.querySelector('.network-node[aria-pressed="true"]')!==null,'Neighbor navigation');
  input('network-category','Theme');assert(count()===5,'Theme filter');
  input('network-search','zzzz');assert(count()===0,'Empty search');
  assert(document.querySelectorAll('#network-table-body tr').length===0,'Table follows filter');
  $('network-reset').click();input('network-search','Microsoft');assert(count()===1,'Company search');
  $('network-reset').click();input('network-support',138);assert(document.querySelectorAll('#network-svg line').length===1,'Support threshold');
  $('zoom-in').click();assert($('network-svg').firstElementChild.getAttribute('transform').includes('1.2'),'Zoom');
  $('network-reset').click();assert(count()===28&&$('network-svg').firstElementChild.getAttribute('transform').includes('scale(1)'),'Reset');
  const keyboardNode=document.querySelector('.network-node');keyboardNode.focus();keyboardNode.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}));
  assert(document.activeElement.classList.contains('network-node'),'Keyboard focus retained');
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));
  assert(!document.querySelector('.network-node[aria-pressed="true"]'),'Escape clears selection');
  assert(document.documentElement.scrollWidth<=window.innerWidth,'No horizontal page overflow');
  const report=document.createElement('pre');report.id='browser-check-results';report.textContent=JSON.stringify(results);document.body.appendChild(report);
})();
