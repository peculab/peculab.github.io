const questions = BANK.map(([c,en,i,q,qe,a,correct,unit,ae]) => ({c,en,i,q,qe,a,correct,unit,ae}));
const $ = id => document.getElementById(id); let current=0, selected=null, responses=[];
const show = id => { ['welcome','quiz','result'].forEach(x => $(x).classList.toggle('hidden', x!==id)); window.scrollTo(0,0); };
function render(){const q=questions[current]; selected=null; $('next').disabled=true; $('progress-text').textContent=`第 ${current+1} / ${questions.length} 題`; $('progress-bar').style.width=`${current/questions.length*100}%`; $('question-icon').textContent=q.i; $('category').textContent=q.c; $('question-title').textContent=q.q; $('question-help').textContent=q.h || '選一個你覺得對的答案'; $('answers').replaceChildren(); q.a.forEach((answer,index)=>{const b=document.createElement('button'); b.type='button'; b.className='answer'; b.textContent=answer; b.setAttribute('aria-pressed','false'); b.onclick=()=>{selected=index; document.querySelectorAll('.answer').forEach((el,i)=>{el.classList.toggle('selected',i===index); el.setAttribute('aria-pressed',String(i===index));}); $('next').disabled=false;}; $('answers').append(b);}); $('next').textContent=current===questions.length-1?'看看我的結果 ✨':'下一題 →';}
function finish(){const correct=responses.filter((a,i)=>a===questions[i].correct).length; $('score').textContent=correct*10; $('result-message').textContent=`答對 ${correct} / ${questions.length} 題，謝謝你認真探索！`; $('breakdown').replaceChildren(); ['數數與比較','加減與故事','進階挑戰'].forEach((label,i)=>{const ranges=[[0,3],[3,8],[8,12]][i]; const n=responses.slice(...ranges).filter((a,j)=>a===questions[ranges[0]+j].correct).length; const el=document.createElement('div'); el.textContent=`${label} ${n} / ${ranges[1]-ranges[0]}`; $('breakdown').append(el);}); show('result');}
const url='https://peculab.github.io/gigo/math/'; const shareText=()=>`我完成了小星星數學探險，獲得 ${$('score').textContent} / 280 分！一起來玩吧 ✨\n${url}`;
$('start').onclick=()=>{current=0;responses=[];render();show('quiz');}; $('next').onclick=()=>{if(selected===null)return; responses.push(selected); current++; if(current===questions.length)finish();else render();}; $('restart').onclick=()=>show('welcome');
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(shareText());$('share-status').textContent='已複製結果和測驗連結！';}catch(e){$('share-status').textContent='無法自動複製，請手動複製：'+shareText();}};
$('share').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'小星星數學探險',text:`我獲得 ${$('score').textContent} / 280 分！一起來玩吧 ✨`,url});}catch(e){if(e.name!=='AbortError') $('share-status').textContent='分享沒有完成，請試試複製結果。';}}else $('copy').click();};
$('facebook').onclick=()=>{window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url),'_blank','noopener,noreferrer'); $('share-status').textContent='Facebook 會分享測驗連結；若想附上分數，請先複製結果再貼到貼文中。';};
$('contact-form').addEventListener('submit', () => {
  $('form-score').value = $('score').textContent + ' / 280';
  $('contact-form').elements._next.value = 'https://peculab.github.io/gigo/math/thanks.html?lang=' + lang;
});

// Language switching keeps the current question and selected answer intact.
const englishQuestions = BANK.map(row => [row[1], row[4]]);
const staticText = [
 ['header a span','小小探索家','Little explorers'],
 ['#welcome .tag','✦ 給 4–8 歲小探險家','✦ For little explorers ages 4–8'],
 ['#welcome .intro','跟著小星星踏上數字冒險，數一數、想一想，看看你收集了幾顆星！','Join Little Star on a number adventure. Count, think, and see how many points you collect!'],
 ['.chips span:nth-child(1)','✏️ 12 道小任務','✏️ 28 little challenges'],
 ['.chips span:nth-child(2)','⏰ 約 5–10 分鐘','⏰ About 5–10 minutes'],
 ['.chips span:nth-child(3)','💛 不限時間','💛 Take your time'],
 ['#start','出發探險 →','Start the adventure →'],
 ['#welcome .small','邀請家長陪伴讀題，讓孩子自己想一想。','Parents can help read the questions while children think for themselves.'],
 ['#quiz .tag','⭐ 數學探險中','⭐ Math adventure'],
 ['#result .result-hero .tag','🎉 探險完成！','🎉 Adventure complete!'],
 ['#result .result-hero h2','你完成了數學探險！','You finished your math adventure!'],
 ['#result .result-hero .muted','每一次思考，都是了不起的一步。','Every time you think, you take a wonderful step.'],
 ['.score span','積分 / 280','points / 280'],
 ['.result-hero > .small','每題 10 分。這是趣味練習的答題結果，不是標準化測驗，也不能單憑分數判定孩子的能力或年級程度。題目參考一年級評量主題，部分題目對年幼孩子可能較有挑戰；建議觀察孩子如何思考。','Each question is worth 10 points. This is a playful practice activity, not a standardized assessment; a score alone cannot determine a child’s ability or grade level. Some first-grade topics may be challenging for younger children. Watch how your child thinks, too.'],
 ['#share','分享探險結果 ↗','Share your result ↗'], ['#facebook','分享到 Facebook','Share on Facebook'], ['#copy','複製結果','Copy result'],
 ['.contact .tag','💌 給家長的悄悄話','💌 A note for parents'], ['.contact h2','想和我們聊聊嗎？','Would you like to talk?'],
 ['.contact > div > p:nth-of-type(2)','留下聯絡方式，與 PecuLab 分享這次探險結果，聊聊孩子的學習興趣。','Share your contact details and result with PecuLab to talk about your child’s learning interests.'],
 ['.contact > div > p.small','送出後，表單服務會將資料與分數寄給 PecuLab，以便回覆您的詢問。分享按鈕不會包含聯絡資料。','When submitted, the form service sends your details and score to PecuLab so we can respond. Sharing buttons do not include contact details.'],
 ['#restart','↻ 再玩一次','↻ Play again'], ['.retry a','回到 PecuLab 課程','Back to PecuLab programs'],
 ['#contact-form button','送出資料與結果 →','Send details and result →']
];
let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
const zhQuestions = questions.map(q => ({...q, a:[...q.a]}));
function translate() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
  document.title = lang === 'en' ? 'Little Star Math Adventure | PecuLab' : '小星星數學探險｜PecuLab';
  $('language').textContent = lang === 'en' ? '中文' : 'English';
  staticText.forEach(([selector, zh, en]) => { document.querySelector(selector).textContent = lang === 'en' ? en : zh; });
  document.querySelector('#welcome h1').innerHTML = lang === 'en' ? 'Ready to explore?<br><em>Let’s play math!</em>' : '準備好了嗎？<br><em>一起玩數學！</em>';
  const labels = document.querySelectorAll('#contact-form label');
  const labelText = lang === 'en' ? ['Parent or guardian name ', 'Parent email ', 'Child’s nickname ', 'Child’s age ', 'Anything else? (optional) ', ' I am a parent or guardian and agree to share these details and the score so PecuLab can respond.'] : ['家長稱呼 ', '家長電子郵件 ', '孩子暱稱 ', '孩子年齡 ', '想告訴我們的事（選填） ', ' 我是家長或監護人，同意提供以上資料與分數，以便 PecuLab 回覆。'];
  labels.forEach((label, i) => { const input = label.querySelector('input,select,textarea'); label.replaceChildren(); if (i === 5) label.append(input, document.createTextNode(labelText[i])); else label.append(document.createTextNode(labelText[i]), input); });
  labels[2].querySelector('input').placeholder = lang === 'en' ? 'A nickname is fine' : '可使用暱稱';
  labels[3].querySelector('option').textContent = lang === 'en' ? 'Choose an age' : '請選擇';
  $('contact-form').elements._subject.value = 'Little Star Math Adventure - new result';
  questions.forEach((q,i) => { q.c = lang === 'en' ? englishQuestions[i][0] : zhQuestions[i].c; q.q = lang === 'en' ? englishQuestions[i][1] : zhQuestions[i].q; q.a = lang === 'en' && q.ae ? [...q.ae] : [...zhQuestions[i].a]; });
  if (!$('quiz').classList.contains('hidden')) { const previous = selected; render(); if (previous !== null) $('answers').children[previous].click(); }
  if (!$('result').classList.contains('hidden')) finish();
  $('share-status').textContent = '';
}
$('language').onclick = () => { lang = lang === 'en' ? 'zh' : 'en'; translate(); };
const originalRender = render;
render = function() { originalRender(); if (lang === 'en') { $('progress-text').textContent = `Question ${current + 1} / ${questions.length}`; if (!questions[current].h) $('question-help').textContent = 'Choose the answer you think is right'; $('next').textContent = current === questions.length - 1 ? 'See my result ✨' : 'Next →'; } };
const originalFinish = finish;
finish = function() { originalFinish(); const n = responses.filter((a,i) => a === questions[i].correct).length; if (lang === 'en') $('result-message').textContent = `${n} / ${questions.length} correct. Thanks for exploring!`; $('breakdown').replaceChildren(); for (let unit=1; unit<=8; unit++) { const indexes = questions.map((q,i) => q.unit === unit ? i : -1).filter(i => i >= 0); const correct = indexes.filter(i => responses[i] === questions[i].correct).length; const el=document.createElement('div'); el.textContent = (lang === 'en' ? 'Unit ' : '\u55ae\u5143 ') + unit + ': ' + correct + ' / ' + indexes.length; $('breakdown').append(el); } }; 
$('copy').onclick = async () => { const text = lang === 'en' ? `I scored ${$('score').textContent} / 280 on Little Star Math Adventure! ✨\n${url}?lang=en` : `我完成了小星星數學探險，獲得 ${$('score').textContent} / 280 分！一起來玩吧 ✨\n${url}`; try { await navigator.clipboard.writeText(text); $('share-status').textContent = lang === 'en' ? 'Result and link copied!' : '已複製結果和測驗連結！'; } catch { $('share-status').textContent = (lang === 'en' ? 'Please copy manually: ' : '請手動複製：') + text; } };
$('share').onclick = async () => { if (!navigator.share) return $('copy').click(); try { await navigator.share({title: lang === 'en' ? 'Little Star Math Adventure' : '小星星數學探險', text: lang === 'en' ? `I scored ${$('score').textContent} / 280!` : `我獲得 ${$('score').textContent} / 280 分！`, url: lang === 'en' ? url + '?lang=en' : url}); } catch (e) { if (e.name !== 'AbortError') $('share-status').textContent = lang === 'en' ? 'Sharing failed. Try copying the result.' : '分享沒有完成，請試試複製結果。'; } };
$('facebook').onclick = () => { window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(lang === 'en' ? url + '?lang=en' : url), '_blank', 'noopener,noreferrer'); $('share-status').textContent = lang === 'en' ? 'Facebook shares the game link. To include your score, copy and paste it into your post.' : 'Facebook 會分享測驗連結；若想附上分數，請先複製結果再貼到貼文中。'; };
translate();

// Speech is initiated by a tap, as required by many mobile browsers.
const readButton = document.createElement('button');
readButton.type = 'button';
readButton.className = 'secondary read-button';
const speechStatus = document.createElement('p');
speechStatus.className = 'small';
speechStatus.setAttribute('role', 'status');
$('question-title').after(readButton, speechStatus);
function stopReading() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
function updateReadButton() { readButton.textContent = lang === 'en' ? '🔊 Read question aloud' : '🔊 朗讀題目'; speechStatus.textContent = ''; }
readButton.addEventListener('click', () => {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    speechStatus.textContent = lang === 'en' ? 'Reading aloud is not supported in this browser.' : '這個瀏覽器不支援朗讀功能。';
    return;
  }
  stopReading();
  const target = lang === 'en' ? 'en' : 'zh';
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase() === (target === 'zh' ? 'zh-tw' : 'en-us')) || voices.find(v => v.lang.toLowerCase().startsWith(target));
  if (voices.length && !voice) {
    speechStatus.textContent = lang === 'en' ? 'No English voice is available on this device.' : '這個裝置沒有可用的中文語音。';
    return;
  }
  const q = questions[current];
  const utterance = new SpeechSynthesisUtterance(q.q + (q.h ? (lang === 'en' ? ' Three apples.' : ' 三顆蘋果。') : '') + ' ' + q.a.join(lang === 'en' ? ', or ' : '，'));
  utterance.lang = lang === 'en' ? 'en-US' : 'zh-TW';
  if (voice) utterance.voice = voice;
  utterance.rate = 0.85;
  utterance.onerror = () => { speechStatus.textContent = lang === 'en' ? 'Could not read aloud. Check your device’s speech settings.' : '無法朗讀，請檢查裝置的語音設定。'; };
  speechStatus.textContent = '';
  window.speechSynthesis.speak(utterance);
});
for (const id of ['next', 'restart', 'language']) $(id).addEventListener('click', () => { stopReading(); updateReadButton(); });
updateReadButton();

const unitNames = [
  ['加減與資料','Addition, subtraction & data'], ['故事題','Story problems'],
  ['20 以內加減','Within 20'], ['99 以內數字','Numbers to 99'],
  ['100 以內加法','Addition within 100'], ['長度測量','Length measurement'],
  ['圖形與時間','Geometry & time'], ['綜合應用','Putting it together']
];
const bankRender = render;
render = function() { bankRender(); const q = questions[current]; $('category').textContent = (lang === 'en' ? `UNIT ${q.unit} · ${unitNames[q.unit-1][1]} · CONCEPT: ` : `單元 ${q.unit} · ${unitNames[q.unit-1][0]} · 測驗觀念：`) + q.c; };
const bankFinish = finish;
finish = function() { bankFinish(); [...$('breakdown').children].forEach((el,i) => { el.textContent = el.textContent.replace(':', ` · ${unitNames[i][lang === 'en' ? 1 : 0]}:`); }); };
const observations = document.createElement('div');
observations.className = 'card';
observations.id = 'observations';
document.querySelector('.contact').before(observations);
function updateObservations() {
  observations.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = lang === 'en' ? 'For parents: observe the thinking' : '給家長：一起觀察思考過程';
  const intro = document.createElement('p');
  intro.textContent = lang === 'en' ? 'The questions check concepts. The following hands-on activities and explanations need a parent’s observation; they are not included in the score.' : '選擇題檢視數學觀念；以下動手操作與解釋需要家長觀察，不計入積分。';
  const list = document.createElement('ul');
  const items = lang === 'en' ? [
    'Ask your child to explain 4 + 3, 8 + 5, 15 − 7 or 17 − 9, using objects or drawings if helpful.',
    'Ask for two ways to show 52 with tens and ones, and show 110 with tens and ones.',
    'Line up two real pencils at one end and compare; measure a book using equal-length blocks placed end to end.',
    'Draw a triangle and explain its sides; draw a rectangle and divide it into four equal parts; show 3:30 on an analog clock.'
  ] : [
    '請孩子說明 4 + 3、8 + 5、15 − 7 或 17 − 9 的想法；也可以用物品或畫圖。',
    '請孩子用十和個位，以兩種方式表示 52，並用十和個位表示 110。',
    '將兩枝真實鉛筆的一端對齊比較長度；再用等長積木首尾相接測量一本書。',
    '畫三角形並說明邊的特徵；畫長方形並分成四個相等部分；在指針時鐘上表示 3:30。'
  ];
  items.forEach(text => { const li=document.createElement('li'); li.textContent=text; list.append(li); });
  const stages = document.createElement('p');
  stages.textContent = lang === 'en' ? 'Observe each skill separately: Exploring = needs examples and guidance; Practicing = uses objects, pictures or some help; Independent = solves familiar tasks and explains; Applying = uses the skill in a new situation or finds another solution. A score alone does not determine a stage.' : '請分別觀察每項能力：探索＝需要示範與引導；練習＝使用物品、圖片或部分協助；獨立＝能解決熟悉題目並說明；應用＝能在新情境運用或找到另一種解法。不能只用分數判定階段。';
  observations.append(heading,intro,list,stages);
}
const bankTranslate = translate;
translate = function() { bankTranslate(); document.querySelector('.chips span:nth-child(1)').textContent = lang === 'en' ? '✏️ 28 little challenges' : '✏️ 28 道小任務'; document.querySelector('.chips span:nth-child(2)').textContent = lang === 'en' ? '⏰ About 20–30 minutes' : '⏰ 約 20–30 分鐘'; updateObservations(); };
translate();
