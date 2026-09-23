(() => {
  'use strict';
  const data = window.PECU_NETWORK;
  const zh = document.documentElement.lang === 'zh-Hant';
  const t = (en, cn) => zh ? cn : en;
  const names = {'Company':'公司／機構','Country':'組織所在地','Level':'職級','Theme':'交集主題','United States':'美國','Taiwan':'台灣','China':'中國','Singapore':'新加坡','Executive / director':'高階主管／總監','Faculty / research':'教研人員','Founder / C-suite':'創辦人／企業高管','Manager / lead':'經理／團隊主管','Professional / specialist':'專業工作者','Student / early career':'學生／職涯起步','AI & intelligent systems':'AI 與智慧系統','Learning & talent development':'學習與人才培育','Product, venture & industry':'產品、創業與產業','Research to practice':'研究轉實作','Responsible innovation & public value':'負責任創新與公共價值','National Taiwan University':'國立臺灣大學','National Yang Ming Chiao Tung University':'國立陽明交通大學','University of Washington':'華盛頓大學','谷歌':'Google（原始標籤：谷歌）'};
  const label = n => zh ? (names[n.label] || n.label) : n.label;
  const category = c => zh ? names[c] : (c === 'Country' ? 'Organization location' : c);
  const colors = {Company:'#4A76B8',Country:'#2D9292',Level:'#D58B32',Theme:'#7560C8'};
  const $ = id => document.getElementById(id);
  if (!data) { $('network-status').textContent = t('Network data could not load. Please reload.','網絡資料載入失敗，請重新整理。'); return; }
  const nodes = data.nodes.map((n,i) => ({...n,x:450+280*Math.cos(i*2.399),y:310+220*Math.sin(i*2.399)}));
  const byId = new Map(nodes.map(n=>[n.id,n]));
  // Fixed deterministic force layout; filters preserve the same visual geography.
  for(let step=0;step<450;step++) {
    const forces = nodes.map(()=>({x:0,y:0}));
    nodes.forEach((a,i)=>nodes.forEach((b,j)=>{if(i>=j)return;const dx=a.x-b.x,dy=a.y-b.y,d2=Math.max(100,dx*dx+dy*dy),f=2100/d2;forces[i].x+=dx*f;forces[i].y+=dy*f;forces[j].x-=dx*f;forces[j].y-=dy*f;}));
    data.edges.forEach(e=>{const a=byId.get(e.source),b=byId.get(e.target),i=nodes.indexOf(a),j=nodes.indexOf(b),dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,f=(d-100)*.006*(1+Math.log1p(e.weight)/3);forces[i].x+=dx/d*f;forces[i].y+=dy/d*f;forces[j].x-=dx/d*f;forces[j].y-=dy/d*f;});
    nodes.forEach((n,i)=>{n.x+=Math.max(-5,Math.min(5,forces[i].x+(450-n.x)*.009));n.y+=Math.max(-5,Math.min(5,forces[i].y+(310-n.y)*.009));});
  }
  const xs=nodes.map(n=>n.x),ys=nodes.map(n=>n.y),xmin=Math.min(...xs),ymin=Math.min(...ys);
  nodes.forEach(n=>{n.x=85+(n.x-xmin)/(Math.max(...xs)-xmin)*690;n.y=65+(n.y-ymin)/(Math.max(...ys)-ymin)*480;});
  const svg=$('network-svg'), ns='http://www.w3.org/2000/svg';
  const el=(name,attrs,parent)=>{const e=document.createElementNS(ns,name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));parent.appendChild(e);return e;};
  const world=el('g',{},svg),lines=el('g',{},world),dots=el('g',{},world);
  let selected=null, visibleNodes=[],visibleEdges=[],scale=1,pan={x:0,y:0};
  const transform=()=>world.setAttribute('transform',`translate(${pan.x} ${pan.y}) scale(${scale})`);
  function zoom(factor){const next=Math.max(.65,Math.min(3.5,scale*factor)),ratio=next/scale;pan.x=450-(450-pan.x)*ratio;pan.y=310-(310-pan.y)*ratio;scale=next;transform();}
  $('zoom-in').onclick=()=>zoom(1.2);$('zoom-out').onclick=()=>zoom(1/1.2);
  svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1);},{passive:false});
  let drag=null;
  svg.addEventListener('pointerdown',e=>{if(e.target.closest('.network-node'))return;drag={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};svg.setPointerCapture(e.pointerId);});
  svg.addEventListener('pointermove',e=>{if(!drag)return;const factor=900/svg.getBoundingClientRect().width;pan={x:drag.px+(e.clientX-drag.x)*factor,y:drag.py+(e.clientY-drag.y)*factor};transform();});
  const release=()=>{drag=null;};svg.addEventListener('pointerup',release);svg.addEventListener('pointercancel',release);
  function detail(){
    const box=$('network-detail');box.replaceChildren();
    const add=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;box.appendChild(e);return e;};
    if(!selected){add('p',t('EXPLORE A CONNECTION','探索連結'));add('h3',t('Where different worlds meet.','不同領域，在此交會。'));add('p',t('Select a node to see its reach and shared attributes. Larger circles represent more first-degree connections; thicker lines indicate stronger associations.','點選節點，查看涵蓋人數與共同屬性。圓圈越大代表一階連結人數越多；線條越粗代表關聯越強。'));add('p',t('Use the table below for a keyboard-friendly view. Filters affect the graph and table, while node metrics describe the original 56-edge network.','也可使用下方表格操作。篩選同步影響圖表與表格；節點指標維持原始 56 條連線網絡的數值。'));return;}
    const n=byId.get(selected);add('p',category(n.category));add('h3',label(n));
    const dl=add('dl','');[[t('Connections','連結人數'),`${n.frequency} / ${data.total}`],[t('Share of snapshot','占快照比例'),`${(100*n.frequency/data.total).toFixed(1)}%`],[t('Weighted strength','加權強度'),n.strength.toFixed(1)],[t('Betweenness (raw)','中介中心性（原始值）'),n.betweenness.toFixed(0)]].forEach(([k,v])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;dl.append(dt,dd);});
    add('p',t('Shared attributes in this view','目前視圖中的共同屬性'));
    const ul=add('ul',''),related=visibleEdges.filter(e=>e.source===selected||e.target===selected).sort((a,b)=>b.weight-a.weight);
    if(!related.length)add('p',t('No edges match the current filters.','目前篩選下沒有符合的連線。'));
    related.forEach(e=>{const other=byId.get(e.source===selected?e.target:e.source),li=document.createElement('li'),button=document.createElement('button'),small=document.createElement('span');button.textContent=label(other);small.textContent=t(`${e.support} shared · association ${e.weight.toFixed(1)}`,`${e.support} 人共現 · 關聯強度 ${e.weight.toFixed(1)}`);button.appendChild(small);button.onclick=()=>choose(other.id);li.appendChild(button);ul.appendChild(li);});
  }
  function choose(id){selected=id;render();}
  function render(){
    const query=$('network-search').value.trim().toLocaleLowerCase(),kind=$('network-category').value,min=Number($('network-support').value);
    $('support-value').textContent=min;
    visibleNodes=nodes.filter(n=>(!kind||n.category===kind)&&(!query||`${n.label} ${label(n)}`.toLocaleLowerCase().includes(query)));
    const ids=new Set(visibleNodes.map(n=>n.id));visibleEdges=data.edges.filter(e=>ids.has(e.source)&&ids.has(e.target)&&e.support>=min);
    if(!ids.has(selected))selected=null;
    const neighbors=new Set([selected]);visibleEdges.forEach(e=>{if(e.source===selected)neighbors.add(e.target);if(e.target===selected)neighbors.add(e.source);});
    lines.replaceChildren();dots.replaceChildren();
    visibleEdges.forEach(e=>{const a=byId.get(e.source),b=byId.get(e.target),active=!selected||e.source===selected||e.target===selected;const line=el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:active?'#81958a':'#d9dfda','stroke-width':.7+e.weight/65,opacity:active?.65:.2},lines);el('title',{},line).textContent=`${label(a)} ↔ ${label(b)}: ${e.support} ${t('shared connections','人共現')}`;});
    const labelBoxes=[];
    visibleNodes.forEach(n=>{const active=!selected||neighbors.has(n.id),g=el('g',{class:'network-node','data-id':n.id,transform:`translate(${n.x} ${n.y})`,tabindex:'0',role:'button','aria-label':`${label(n)}, ${n.frequency} ${t('connections','位連結')}`,'aria-pressed':String(selected===n.id),opacity:active?1:.2},dots),r=8+Math.sqrt(n.frequency)*.85;el('circle',{r,fill:colors[n.category],...(selected===n.id?{stroke:'#213e2e','stroke-width':4}:{})},g);el('title',{},g).textContent=`${label(n)} · ${n.frequency}`;
      if($('network-labels').checked||selected===n.id||n.category==='Theme'||n.category==='Country'){
        const width=Array.from(label(n)).reduce((sum,c)=>sum+(/[^\x00-\x7F]/.test(c)?12:6.3),0),left=n.x+r+5+width>885,x=left?-r-5:r+5;
        let y=4,box;
        for(const offset of [4,-20,26,-42,48,-64,70]){
          y=offset;box={x:n.x+x-(left?width:0),y:n.y+y-12,w:width,h:16};
          if(!labelBoxes.some(b=>box.x<b.x+b.w&&box.x+box.w>b.x&&box.y<b.y+b.h&&box.y+box.h>b.y))break;
        }
        labelBoxes.push(box);el('text',{x,y,'text-anchor':left?'end':'start'},g).textContent=label(n);
      }
      g.onclick=()=>choose(n.id);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(n.id);dots.querySelector(`[data-id="${n.id}"]`).focus();}};
    });
    $('network-status').textContent=visibleNodes.length?t(`${visibleNodes.length} attributes · ${visibleEdges.length} associations`,`${visibleNodes.length} 個屬性 · ${visibleEdges.length} 條關聯`):t('No matching attributes. Clear search or reset filters.','沒有符合的屬性，請清除搜尋或重設篩選。');
    const tbody=$('network-table-body');tbody.replaceChildren();
    [...visibleNodes].sort((a,b)=>b.strength-a.strength).forEach(n=>{const tr=document.createElement('tr'),td=document.createElement('td'),button=document.createElement('button');button.textContent=label(n);button.onclick=()=>{choose(n.id);$('network-detail').scrollIntoView({behavior:'smooth',block:'nearest'});};td.appendChild(button);tr.appendChild(td);[category(n.category),n.frequency,n.strength.toFixed(1),n.betweenness.toFixed(0)].forEach(v=>{const cell=document.createElement('td');cell.textContent=v;tr.appendChild(cell);});tbody.appendChild(tr);});
    detail();
  }
  ['network-search','network-category','network-support','network-labels'].forEach(id=>$(id).addEventListener('input',render));
  $('network-reset').onclick=()=>{$('network-search').value='';$('network-category').value='';$('network-support').value=4;$('network-labels').checked=false;selected=null;scale=1;pan={x:0,y:0};transform();render();};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){selected=null;render();}});
  render();
})();
