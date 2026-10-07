"""Build the two dependency-free bilingual pages: python build_site.py."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parent
GUIDE = 'https://www.kirklandwa.gov/files/sharedassets/public/v/1/parks-amp-comm-services/recreation/rec-guide/2026-fall-2027-winter-recreation-guide_youth.pdf'
RENTAL = 'https://www.kirklandwa.gov/files/sharedassets/public/v/1/parks-amp-comm-services/pdfs/finalized-rental-guide-5.26.26.pdf'
KIT = 'https://thamesandkosmos.com/products/kids-first-coding-robotics-classroom-bundle-10-pack'
PROPOSAL = 'https://www.kirklandwa.gov/files/sharedassets/public/v/1/parks-amp-comm-services/recreation/recreation-program-proposal.pdf'

def bi(zh, en):
    return f'<span lang="zh-Hant">{zh}</span><span lang="en">{en}</span>'

def p(zh, en, cls=''):
    return f'<p class="{cls}">{bi(zh,en)}</p>'

def heading(zh, en, level=2):
    return f'<h{level}>{bi(zh,en)}</h{level}>'

def link(url, zh, en, cls=''):
    return f'<a class="{cls}" href="{escape(url, quote=True)}">{bi(zh,en)}</a>'

def shell(content, planning=False):
    title_zh = '開班與合作規劃｜PecuLab 文化邏輯探索課' if planning else '文化邏輯探索課｜PecuLab K–2 課後共學'
    title_en = 'Program & Partnership Planning | PecuLab' if planning else 'Little Thinkers: Stories, Maps & Robots | PecuLab'
    return f'''<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f8f6ef"><meta name="description" content="PecuLab K–2 文化邏輯探索課：每週三 50 分鐘，以故事、地圖與實體機器人練習思考。Screen-free stories, maps and robotics. Kirkland pilot proposal.">
<title>{title_zh}</title><link rel="stylesheet" href="styles.css"></head>
<body data-title-zh="{title_zh}" data-title-en="{title_en}">
<a class="skip" href="#main">{bi('跳至內容','Skip to content')}</a>
<header><div class="container header-inner"><a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>PECULAB <span style="font-weight:400;letter-spacing:0;font-size:12px">little thinkers</span></a>
<nav aria-label="Main navigation">{link('index.html#curriculum','全年課程','The learning year','nav-link')}{link('index.html#pilot','試辦資訊','The pilot','nav-link')}{link('planning.html','開班規劃','Planning','nav-extra')}
<div class="lang-switch" role="group" aria-label="Language / 語言"><button type="button" data-language="zh-Hant" aria-pressed="true">中文</button><button type="button" data-language="en" aria-pressed="false">EN</button></div></nav></div></header>
<main id="main">{content}</main>
<footer><div class="container footer-inner"><div>© 2026 PecuLab LLC · Kirkland, Washington<br>{bi('課程提案 · 場地、日期與費用待確認','Program proposal · Venue, dates and fees pending confirmation')}</div><div>{link('index.html','課程介紹','Course overview')} · {link('planning.html','定價與開班試算','Pricing & class planner')} · {link('../index.html','PecuLab 首頁','PecuLab home')}</div></div></footer>
<noscript><div class="container nojs">本頁中文內容可直接閱讀；中英文切換需要 JavaScript。Enable JavaScript to switch languages.</div></noscript><script src="app.js"></script></body></html>'''

# Original learning sequence; not a reproduction of the kit's 30-lesson manual.
# Each week lists a mission and observable evidence of learning.
modules = [
 ('01', '秋季上 · 試辦 6 堂', 'Early fall · 6-session pilot', '故事裡的第一條路', 'A story, a robot, a first route',
  '從「先做什麼」開始，練習方向、順序、輪流與除錯。', 'Start with what comes first: direction, sequencing, turn-taking and debugging.', [
  ('我的機器人朋友','Meet my robot friend','以身體扮演機器人，排出 3 張動作卡；能分辨想法與明確指令。','Act as a robot and arrange three action cards; distinguish an idea from a precise instruction.'),
  ('幫角色找到家','Help a character get home','在地圖排出 3–5 個步驟，執行前先指出預期終點。','Plan a 3–5-step route and point to the predicted destination before running it.'),
  ('我的社區小地圖','Map my neighborhood','畫出家、圖書館與公園；說出一段包含轉彎的路線。','Draw a home, library and park; explain a route that includes a turn.'),
  ('故事便當送到了','Deliver a story lunch','用紙製食物圖卡設計兩站配送；能把任務分成兩小段。','Use paper food pictures for a two-stop delivery; split the task into two smaller parts.'),
  ('走錯了，再試一次','A wrong turn, another try','找出教師預設的一張錯卡，只改一個地方再測試。','Find one deliberately misplaced card; change one thing and test again.'),
  ('我的第一場小分享','My first mini showcase','和夥伴展示原創路線，說出「我改了什麼、為什麼」。','Present an original route with a partner and explain one change and its reason.')]),
 ('02','秋季下 · 6 堂','Late fall · 6 sessions','節慶與重複的節奏','Celebrations & repeating patterns',
  '把重複的動作找出來，讓迴圈變成摸得到的節奏。','Find repeated actions and make loops tangible through rhythm.',[
  ('圖案接龍','Pattern parade','以顏色與拍手找出 AB／AAB 規律；預測下一個動作。','Use colors and claps to find AB/AAB patterns and predict the next action.'),
  ('機器人跳舞','Robot dance','先排重複的動作，再以簡單迴圈取代；執行並比較。','Build repeated actions, replace them with a simple loop, then compare the runs.'),
  ('燈光小路','A path of lights','用紙燈籠地圖重複移動與停頓；指出迴圈的範圍。','Repeat moves and pauses on a paper lantern map; identify the loop body.'),
  ('冬日郵差','Winter mail carrier','將相同的送信動作重複 2–3 次；每次輪換操作角色。','Repeat a delivery action two or three times, switching partner roles each run.'),
  ('找出多走的一步','One step too many','比較重複次數不同的兩個程式；修正過頭的路徑。','Compare two repeat counts and fix a route that overshoots.'),
  ('我們的節慶遊行','Our celebration parade','自選家庭或想像中的慶祝方式，展示一個有迴圈的路線。','Choose a family or imaginary celebration and demonstrate a route with a loop.')]),
 ('03','冬季 · 6 堂','Winter · 6 sessions','地圖裡的小小設計師','Designers of small worlds',
  '練習拆解任務、規劃多站路線，尊重每個人的故事。','Break tasks apart, plan multiple stops and make room for different stories.',[
  ('出發前的計畫','Plan before we go','畫出起點、目的地與障礙；用手指預演後再排卡。','Draw a start, goal and obstacle; trace the plan before coding.'),
  ('市場採買任務','A market mission','選擇三張物品圖卡，把採買路線拆成三段。','Choose three item cards and divide a shopping route into three parts.'),
  ('拜訪朋友','Visit a friend','比較兩條都能抵達的路，說出自己的選擇理由。','Compare two successful routes and explain a preference.'),
  ('我的家庭小傳統','A tradition from home','以自選的家庭活動編排故事順序，讓機器人演出其中一段。','Sequence a chosen family activity and let the robot act out one part.'),
  ('任務交接站','Pass the plan','交換地圖與指令，觀察同伴能否依自己的說明完成。','Exchange maps and instructions; observe whether a partner can follow them.'),
  ('社區故事地圖展','Neighborhood map exhibit','完成三站任務，展示規劃圖與修正後的卡片順序。','Complete a three-stop mission and show the plan alongside the revised sequence.')]),
 ('04','春季上 · 6 堂','Early spring · 6 sessions','觀察、測試、一起修正','Observe, test & improve',
  '從看見結果到找出原因，逐步加入簡單規則。','Move from observing results to finding causes, with simple rules along the way.',[
  ('小小測試員','Little testers','在紀錄卡上畫出預測與實際結果；找出第一個不同。','Draw predicted and actual results; identify the first difference.'),
  ('公園裡的岔路','A fork in the park','用角色扮演練習「如果有障礙，就改道」；口述規則。','Role-play “if the path is blocked, take another route” and explain the rule.'),
  ('看見訊號再出發','A signal to start','以紙製訊號練習等待與觸發；區分先後與開始條件。','Use paper signals to practice waiting and triggering; distinguish sequence from a start condition.'),
  ('一次改一個地方','Change one thing','針對失敗路徑提出猜想，只改一張卡並記下結果。','Suggest a reason for failure, change one card and record the result.'),
  ('我說，你來測','You test my idea','夥伴測試彼此的方案，用「我觀察到」描述結果。','Test a partner’s plan and describe the outcome using “I noticed…”.'),
  ('春日救援任務','Spring rescue mission','完成繞過障礙的任務，展示至少一次測試與修正。','Complete an obstacle detour and show at least one test and revision.')]),
 ('05','春季下 · 6 堂','Late spring · 6 sessions','把想法變成作品','An idea becomes a project',
  '以可重用的步驟與數量表徵，完成自己的文化故事。','Use reusable steps and number representations in an original cultural story.',[
  ('給動作取名字','Name an action','為一小段常用步驟命名，先用紙卡重用同一段指令。','Name a short routine and reuse it with paper cards.'),
  ('機器人的計數袋','A robot’s counting bag','用代幣記錄已送達的物品數，說出數字代表什麼。','Use tokens to track deliveries and explain what the number represents.'),
  ('我的故事提案','Pitch my story','畫出角色、目標與三段情節；提出一個能測試的成功條件。','Draw a character, goal and three story parts; define a testable success condition.'),
  ('搭建與第一次測試','Build & test once','用教具與紙製場景搭建，保留初版程式的紀錄。','Build with the kit and paper scenery; record the first program version.'),
  ('讓作品更清楚','Make the story clearer','依同伴回饋改進路線或說明，指出修改前後的差異。','Use peer feedback to improve a route or explanation and show what changed.'),
  ('小小故事發表會','Little storytellers’ showcase','向家長或同班夥伴示範，說明目標、測試與一次修正。','Demonstrate to families or classmates and explain the goal, tests and one revision.')]),
 ('06','暑期延伸 · 6 堂','Summer · 6 optional sessions','帶著好奇心去旅行','Travel with curiosity',
  '用新的故事重訪核心能力，暑期仍維持每週 50 分鐘。','Revisit core skills through new stories, still meeting for 50 minutes each week.',[
  ('行李整理演算法','Pack with a plan','排列出遊準備步驟，交換後檢查有沒有遺漏。','Sequence trip preparations and check a partner’s plan for missing steps.'),
  ('城市探險家','City explorer','選擇真實或想像城市，在新地圖規劃一條路。','Choose a real or imagined city and plan a route on a new map.'),
  ('跨海小郵差','Mail across the sea','把長途故事分段，使用重複步驟完成配送。','Split a long-distance story into parts and reuse steps for delivery.'),
  ('朋友設計的迷宮','A friend’s maze','先預測、再測試同伴設計的迷宮；提出一項改善。','Predict and test a partner-designed maze, then suggest an improvement.'),
  ('一起創造新世界','Build a world together','共同訂定目標並分工，每個孩子負責一段程式與一次測試。','Agree on a goal and share roles; each child contributes a sequence and a test.'),
  ('我的思考旅行冊','My thinking journal','比較早期與現在的作品，說出自己學會的一種解題方法。','Compare early and recent work and describe one problem-solving strategy learned.')])
]

def curriculum():
    html = '<div class="curriculum">'
    week = 0
    for number, period_zh, period_en, name_zh, name_en, desc_zh, desc_en, lessons in modules:
        html += f'<details class="module"><summary><div class="module-head"><span class="tag">{bi(period_zh,period_en)}</span><span class="expand" aria-hidden="true">+</span></div>{heading(number+" / "+name_zh,number+" / "+name_en,3)}{p(desc_zh,desc_en,"module-desc")}</summary><ol class="lesson-list">'
        for zh,en,out_zh,out_en in lessons:
            week += 1
            html += f'<li><span class="week">{week:02}</span><div><strong>{bi(zh,en)}</strong>{p(out_zh,out_en)}</div></li>'
        html += '</ol></details>'
    return html + '</div>'

art = '<figure class="kit-hero"><div class="board-top"><span>MEET SAMMY</span><span>KIDS FIRST</span></div><img src="assets/sammy-robot.jpg" width="1000" height="1000" fetchpriority="high" alt="Sammy 機器人 / Sammy robot from Kids First Coding &amp; Robotics"><figcaption><strong>Kids First Coding &amp; Robotics</strong>'+p('孩子的第一位程式小夥伴。','A first coding companion for little thinkers.')+link(KIT,'教材照片來源：Thames &amp; Kosmos ↗','Product photo: Thames &amp; Kosmos ↗','small')+'</figcaption></figure>'

materials = '<section class="section materials-section" id="materials"><div class="container"><div class="section-top"><div>'+p('OUR CLASSROOM KIT','OUR CLASSROOM KIT','eyebrow')+heading('摸得到的程式，<br>看得見的想法。','Code they can touch.<br>Ideas they can see.')+'</div>'+p('課堂使用 Kids First Coding &amp; Robotics。孩子以實體指令卡安排步驟，搭配地圖與積木模型，讓機器人執行自己的計畫。','Our classroom kit is Kids First Coding &amp; Robotics. Children arrange physical command cards and use maps and building pieces to bring their plans to life.')+'</div><div class="kit-gallery"><figure><a href="assets/classroom-bundle.jpg"><img src="assets/classroom-bundle.jpg" width="1000" height="1000" loading="lazy" decoding="async" alt="Kids First Coding &amp; Robotics 十套教室組包裝 / Classroom Bundle 10-Pack packaging"></a><figcaption>'+heading('10 套教室組','Classroom Bundle 10-Pack',3)+p('每位學生自備一套，教材歸學生所有並於每次上課攜帶。可自行購買；班上湊滿 10 位需要購買教材的同學，即可協調 10 套組團購。','Each student owns and brings one complete kit to every class. Families may purchase independently, or coordinate a ten-pack group order when ten classmates need a kit.')+'</figcaption></figure><figure><a href="assets/classroom-contents.jpg"><img src="assets/classroom-contents.jpg" width="1200" height="1200" loading="lazy" decoding="async" alt="積木、齒輪、地圖與實體指令卡 / Building pieces, gears, map tiles and physical command cards"></a><figcaption>'+heading('積木 × 地圖 × 指令卡','Building pieces, maps &amp; code cards',3)+p('先排出想法，再讓機器人試走。從順序、轉彎與重複開始，練習觀察、修正與分享。','Arrange an idea, then let the robot try it. Begin with sequences, turns and repetition, practicing observation, revision and sharing.')+'</figcaption></figure></div>'+p('產品照片來源：Thames &amp; Kosmos 官方產品頁。點選照片可查看大圖。','Product photos: the official Thames &amp; Kosmos product page. Select a photo to view it at full size.','small')+link(KIT,'查看官方教材介紹 ↗','Explore the official classroom kit ↗','inline-link')+'</div></section>'

overview = '<div class="container"><section class="hero"><div>'
overview += f'<div class="pill"><span class="dot"></span>{bi("K–2 社區課後共學 · 試辦提案","K–2 community enrichment · Pilot proposal")}</div>'
overview += heading('小小的步驟，<br>讓<em>想法動起來。</em>','Little steps.<br><em>Big discoveries.</em>',1)
overview += p('文化邏輯探索課','Stories, Maps & Robots','eyebrow')
overview += p('一個故事、一張地圖、一個機器人。孩子和夥伴一起排出步驟、試試看、改一改，把腦中的想像變成看得見的行動。','A story, a map and a little robot. Children plan a path with a partner, try it, make a change and watch their ideas come to life.','lead')
overview += '<div class="actions">'+link('#pilot','看看 6 週試辦 →','Explore the 6-week pilot →','button')+link('#curriculum','探索一年的學習','Explore the learning year','button secondary')+'</div>'
overview += p('預計於 North Kirkland Community Center 開課；日期與場地尚待確認。','Proposed at North Kirkland Community Center. Dates and venue arrangements are not yet confirmed.','small')+'</div>'+art+'</section><div class="facts">'
for strong_zh,strong_en,sub_zh,sub_en in [('K–2','K–2','幼兒園至二年級 · 約 5–8 歲','Kindergarten–Grade 2 · Approx. ages 5–8'),('每週三','Wednesdays','下午時段 · 確切時間待公告','Afternoons · Exact time to be announced'),('50 分鐘','50 minutes','故事、動手做、測試與分享','Stories, building, testing & sharing'),('目標 10 人','10 learners','小班試辦 · 每人自備一套教材','Pilot target · Each learner brings a kit')]:
    overview += f'<div class="fact"><strong>{bi(strong_zh,strong_en)}</strong><span>{bi(sub_zh,sub_en)}</span></div>'
overview += '</div></div><section class="section"><div class="container"><div class="section-top"><div>'+p('A LITTLE SPACE TO THINK','A LITTLE SPACE TO THINK','eyebrow')+heading('給孩子一段，<br>親手思考的時間。','Room to wonder.<br>Time to think.')+'</div>'+p('從孩子自己的故事出發，練習在 AI 時代同樣重要的能力：組織想法、理解結果、和別人一起解決問題。','Start with a child’s own story and practice skills that matter in an AI-filled world: organizing ideas, understanding outcomes and solving problems together.')+'</div><div class="three">'
for n,zh,en,dz,de in [('01','想清楚，再出發','Make a plan','把「我想要」拆成一小步、一小步。以圖像卡與實體地圖學習，不需要閱讀程式碼。','Turn “I want to…” into small, clear steps. Use picture cards and physical maps, with no written code to read.'),('02','試錯，也是一種發現','Learn from a wrong turn','預測機器人會走到哪裡，再觀察結果。走錯了，就找出原因，改一張卡再試。','Predict where the robot will go, then observe. If it takes a wrong turn, find a reason, change a card and try again.'),('03','我的故事，你也能懂','Share a story','從家庭、社區與文化故事取材，練習輪流、聆聽，說出「我為什麼這樣設計」。','Bring family, neighborhood and cultural stories into play. Take turns, listen and explain a design choice.')]:
    overview += f'<article class="feature"><span class="num">{n} /</span>{heading(zh,en,3)}{p(dz,de)}</article>'
overview += '</div></div></section><section class="section green-section"><div class="container">'+p('50 MINUTES, ONE SMALL ADVENTURE','50 MINUTES, ONE SMALL ADVENTURE','eyebrow')+heading('一堂課，剛剛好的探索。','One class. A whole little adventure.')+p('每個孩子操作自己的教材，也和夥伴交換想法、互相觀察測試結果。','Each child works with their own kit and exchanges ideas and test observations with a partner.','muted')+'<div class="rhythm">'
for time,zh,en,dz,de in [('5′','故事開場','A story begins','認識今天的角色與任務。','Meet a character and a challenge.'),('8′','身體想一想','Think with movement','走一走、排圖卡、做預測。','Move, arrange pictures and predict.'),('22′','動手做與測試','Build & test','各自排卡與執行，和夥伴交流。','Code and test with individual kits; compare ideas with a partner.'),('10′','修改與分享','Revise & share','改一個地方，說明發現。','Change one thing and explain the discovery.'),('5′','收拾與回顧','Reset & reflect','零件歸位，帶走一個好問題。','Sort the pieces and take a good question home.')]:
    overview += f'<article><strong>{time}</strong>{heading(zh,en,3)}{p(dz,de)}</article>'
overview += '</div></div></section><section class="section" id="curriculum"><div class="container"><div class="section-top"><div>'+p('THE LEARNING YEAR','THE LEARNING YEAR','eyebrow')+heading('六個篇章，<br>陪想法慢慢長大。','Six chapters.<br>A year of growing ideas.')+'</div>'+p('全年 36 堂：學年 30 堂＋暑期延伸 6 堂。每梯次 6 堂，先從第一梯試辦開始，再依孩子的投入與學習情況續開。','36 sessions across the year: 30 during the school year plus 6 optional summer sessions. Enroll by six-session block, beginning with the pilot.')+'</div>'+curriculum()
overview += p('季節為完整年度配置範例；若試辦較晚開始，全部順延，不是已核定行事曆。第一梯的 6 堂已包含在 36 堂內；每週三一次，假期與場館休館日不排課。正式日期將依學校行事曆、場地與家庭接送時間排定。暑期另行報名，非全天營隊。','Seasons illustrate a full-year sequence, not a confirmed calendar. A later pilot start shifts the sequence forward. The six pilot sessions are included in the 36-session total. Classes meet once each Wednesday, with breaks for holidays and facility closures. Dates will be set around school calendars, room availability and family travel time. Summer is a separate weekly course, not a day camp.','note')
overview += '<div class="three block-heading">'
for zh,en,dz,de in [('K：從看圖與操作開始','Kindergarten: see & try','用 3–5 張卡、短路徑、手指預演與口語說明；協助孩子準備自己的底座，讓時間留給思考。','Use 3–5 cards, short routes, finger tracing and oral explanations. Help each child prepare their own robot base.'),('1–2 年級：多想一步','Grades 1–2: add a challenge','增加多站路線、簡單迴圈與設計紀錄。熟悉核心任務後，再選擇條件、函式或數量的延伸。','Add multiple stops, simple loops and design notes. Offer conditions, routines and number extensions after core tasks are secure.'),('每 6 堂，看得見成長','Notice growth every six weeks','保留一張路線圖、一份卡片紀錄與孩子的一句解釋；觀察規劃、測試、修正、合作與表達。','Keep a route map, a card sequence and a child’s explanation. Observe planning, testing, revising, teamwork and communication.')]:
    overview += '<article class="feature">'+heading(zh,en,3)+p(dz,de)+'</article>'
overview += '</div>'+p('課程使用 Kids First Coding & Robotics 為教材規劃基礎，加入 PecuLab 原創故事與文化任務；不是逐堂照搬原廠教案。條件與函式先以角色扮演、紙卡理解，再依教具版本與準備度延伸；不要求所有 K–2 學生掌握進階語法。','The plan uses Kids First Coding & Robotics with original PecuLab stories and cultural tasks; it does not reproduce the manufacturer’s lesson sequence. Conditions and routines begin with role-play and paper cards, with kit extensions matched to the version and learner readiness. Advanced syntax is not a requirement.','small')+'</div></section>'
overview += '<section class="section" id="pilot" style="background:#eeeee4"><div class="container split"><div>'+p('START SMALL, LEARN TOGETHER','START SMALL, LEARN TOGETHER','eyebrow')+heading('先用六次相遇，<br>開始第一段旅程。','Begin with six<br>small adventures.')+p('第一梯聚焦順序、方向、合作與除錯。孩子不需要有機器人或程式經驗，也不需要一次承諾一整年。','The first block focuses on sequencing, direction, collaboration and debugging. No robotics or coding experience is needed, and families do not need to commit to a full year.','lead')+'<ul class="checklist">'
for zh,en in [('建議 8 人起班，目標 10 人；以實際合作成本確認最低人數。','Suggested minimum 8, target 10; final minimum depends on agreed costs.'),('規劃 1 位主教＋1 位助教，每位學生自備一套教材。','Plan for one lead instructor and one assistant; each learner brings their own kit.'),('建議學費含教學與課堂基本耗材，不含教材購置費；教材可帶回家繼續探索。','Proposed tuition covers instruction and basic class supplies, not the kit purchase. Students take their kits home to keep exploring.'),('網站提供中英文資訊；授課語言與中文支援方式將於開班前確認。','Course information is bilingual; teaching language and Mandarin support will be confirmed before enrollment.')]:
    overview += '<li>'+bi(zh,en)+'</li>'
overview += '</ul></div><div class="price-card">'+p('建議試辦費用 · 美元','PROPOSED PILOT TUITION · USD','eyebrow')+'<div class="price">$180 <small>'+bi('／6 堂','/ 6 sessions')+'</small></div>'+p('每堂 50 分鐘 · 每堂 US$30 · 教材另購','50 minutes per session · US$30 per session · Kit purchased separately')+p('此為與社區中心洽談用的建議價，尚未開放付款或正式報名。若由市府辦理，居民／非居民價與任何適用稅費將依最終核定內容公告。','This is a proposed price for discussion with the community center. Payment and enrollment are not open. If city-operated, resident/nonresident rates and any applicable taxes will be published after approval.')+link('#contact','了解試辦進度 →','Pilot details & inquiries →','button')+p('6 堂為一梯；後續梯次依試辦結果調整。','Six sessions per block; later blocks may change based on pilot feedback.','small')+'</div></div></section>'
overview += '<section class="section"><div class="container split"><div>'+p('GOOD QUESTIONS','GOOD QUESTIONS','eyebrow')+heading('家長可能想知道的事。','A few things families may wonder.')+'</div><div class="faq">'
for zh,en,dz,de in [('孩子需要帶平板或電腦嗎？','Does my child need a screen?','不需要。主要使用實體指令卡、地圖、機器人與紙筆，讓孩子親手安排與觀察。','No. Children primarily use physical command cards, maps, robots, paper and pencils.'),('這是 AI 操作課嗎？','Is this an AI tools class?','課程著重思考的基礎：先預測、再測試，辨認錯誤並說明自己的選擇。不需要孩子使用生成式 AI 帳號。','The focus is foundational thinking: predict, test, identify an error and explain a choice. Children do not need generative AI accounts.'),('文化主題需要特定背景嗎？','Do families need a particular cultural background?','不需要。孩子可分享自己的家庭故事，也可選擇想像情境；不以單一節慶或文化經驗作為先備條件。','No. Children may share a family story or choose an imaginary setting. No particular cultural or holiday knowledge is assumed.'),('有接送或延長照顧嗎？','Is transport or extended care included?','目前規劃為單次 50 分鐘課程，家庭自行接送。確切報到、接回時間與照顧安排會在正式招生時公告。','The plan is a 50-minute enrichment class with family-arranged transport. Check-in, pickup and care arrangements will be published with enrollment details.'),('缺課、取消或停課怎麼辦？','What happens if a class is missed or canceled?','正式報名前會公告最低開班人數、退費、缺課與補課規則。若由市府承辦，將明確連結適用的市府規定。','Minimum enrollment, withdrawal, missed-class and makeup terms will be published before registration. City-run enrollment will link to the applicable city policy.')]:
    overview += '<details><summary>'+bi(zh,en)+'</summary>'+p(dz,de)+'</details>'
overview += '</div></div></section><section class="section" id="contact"><div class="container contact"><div>'+p('MEET IN THE NEIGHBORHOOD','MEET IN THE NEIGHBORHOOD','eyebrow')+heading('在社區裡，<br>一起把第一班做起來。','A small learning community,<br>close to home.')+p('目前為規劃中的試辦。歡迎透過 PecuLab 詢問課程；確定合作方式、場地與日期後，才會公布正式報名連結。','This pilot is in planning. Contact PecuLab about the course; an enrollment link will be published after the venue, partnership and dates are confirmed.')+'<div class="actions">'+link('https://www.facebook.com/PecuLabLLC','前往 PecuLab 詢問','Contact PecuLab on Facebook','button')+'</div></div><div><address><strong>North Kirkland Community Center</strong><br>12421 103rd Avenue NE<br>Kirkland, WA 98034</address>'+p('預計上課地點 · 尚未完成場地確認','Proposed location · Venue not yet confirmed','small')+link('https://www.google.com/maps/search/?api=1&query=North+Kirkland+Community+Center','查看地圖 ↗','View map ↗','inline-link')+p('本頁為 PecuLab 課程提案，非市府已核定課程公告。','This is a PecuLab proposal, not an approved City of Kirkland course listing.','small')+'</div></div></section>'

planner = '<div class="container"><section class="section"><p class="eyebrow">PROGRAM DESIGN / PARTNERSHIP</p><h1><span lang="zh-Hant">以完整的教學設計，規劃適合孩子的班級。</span><span lang="en">Plan a class around how children learn.</span></h1><p class="lead"><span lang="zh-Hant">以故事、文化任務與實體教具，引導孩子練習邏輯、測試、修正與表達。依場地、對象與教學支援共同規劃，方案依需求議價。</span><span lang="en">Stories, cultural challenges, and physical kits help children practice logic, testing, revision, and explanation. Scope and pricing are agreed around the venue, learners, and teaching support.</span></p></section><section class="section"><p class="eyebrow">01 / GROUP & STAFFING</p><h2><span lang="zh-Hant">人數與師資配置</span><span lang="en">Group size and teaching support</span></h2><p><span lang="zh-Hant">建議以 10 人試辦，兩人一組，安排一位主教與一位助教。</span><span lang="en">Start with a pilot of ten learners working in pairs, supported by a lead instructor and an assistant.</span></p><p><span lang="zh-Hant">單一教師帶班建議先以 6–8 人為限；若孩子需要更多協助，調整人數與支援。這是教學建議，並非法定師生比。</span><span lang="en">For a solo instructor, start with six to eight learners. Adjust group size and support to learner needs; these are teaching recommendations, not statutory ratios.</span></p></section><section class="section"><p class="eyebrow">02 / LEARNING EXPERIENCE</p><h2><span lang="zh-Hant">課程與可觀察成果</span><span lang="en">Learning experience and evidence</span></h2><p><span lang="zh-Hant">每梯規劃六堂、每堂 50 分鐘，保留動手操作、測試、修正與分享時間。</span><span lang="en">Plan six 50-minute sessions with time to build, test, revise, and share.</span></p><p><span lang="zh-Hant">透過孩子的作品、解題過程與口頭說明，記錄邏輯推理、合作與表達的進展。</span><span lang="en">Use creations, problem-solving steps, and explanations to document progress in reasoning, collaboration, and communication.</span></p></section><section class="section"><p class="eyebrow">03 / VENUE & MATERIALS</p><h2><span lang="zh-Hant">場地與教材準備</span><span lang="en">Venue and materials</span></h2><p><span lang="zh-Hant">十人班規劃五組操作教具與至少一套備用，並確認桌面、測試空間與接送動線。</span><span lang="en">For ten learners, plan five working kits and at least one spare, with suitable tables, testing space, and pickup arrangements.</span></p><p><span lang="zh-Hant">與合作場館確認布置、教學、收拾時間、設備與雙方責任。場地與日期尚待確認。</span><span lang="en">Confirm setup, teaching, cleanup, equipment, and responsibilities with the venue. Venue and dates remain to be confirmed.</span></p></section><section class="section"><p class="eyebrow">04 / PARTNERSHIP</p><h2><span lang="zh-Hant">從需求開始，共同確認合作方案</span><span lang="en">Agree on a plan around your needs</span></h2><p><span lang="zh-Hant">合作前確認對象、班級人數、授課語言、場地、教材與教學支援，依需求議價。</span><span lang="en">Before delivery, agree on the audience, group size, language, venue, materials, and teaching support. Pricing is negotiated for the engagement.</span></p><p><span lang="zh-Hant">試辦後檢視出席、每人操作機會、修正與表達、家庭回饋，再決定後續課程。</span><span lang="en">Review attendance, hands-on participation, revision and explanation, and family feedback before planning subsequent cohorts.</span></p></section><section class="section"><a class="button" href="../book.html"><span lang="zh-Hant">洽談課程合作</span><span lang="en">Discuss a program partnership</span></a></section></div>'

videos = '<section class="section" id="demos"><div class="container"><div class="section-top"><div>'+p('SEE IT IN ACTION','SEE IT IN ACTION','eyebrow')+heading('看看機器人，<br>怎麼讓指令動起來。','See the robot<br>bring instructions to life.')+'</div>'+p('從指令卡到地圖，看看這套教材的實際操作。點選播放即可觀看，也可以切換全螢幕。','Watch the kit in action with physical command cards and a map. Select play to watch, or switch to full screen.')+'</div><div class="demo-grid">'
for number, title_zh, title_en, duration in [('01','指令卡操作示範','Command card demonstration','0:07'),('02','地圖行走示範','Robot on the map','1:09')]:
    videos += f'<article class="demo-card"><video controls playsinline preload="metadata" width="1280" height="720" poster="assets/demo-{number}-poster.jpg" aria-labelledby="demo-title-{number}"><source src="ref/coding-robotics-demo-{number}.mp4" type="video/mp4">'+bi('您的瀏覽器不支援內嵌影片，請使用下方連結開啟。','Your browser does not support embedded video. Use the link below to open it.')+f'</video><div class="demo-caption"><div class="module-head"><h3 id="demo-title-{number}">'+bi(title_zh,title_en)+f'</h3><span class="tag">{duration}</span></div>'+link(f'ref/coding-robotics-demo-{number}.mp4','另開影片 ↗','Open video ↗','inline-link')+'</div></article>'
videos += '</div></div></section>'
overview = overview.replace('<section class="section" id="curriculum">', materials + videos + '<section class="section" id="curriculum">')

def public_copy(html):
    replacements = {'支付的是清楚的決策、證據與交接成果。': '將 AI 機會轉化為可驗證的證據與明確下一步。', '最終報價依工作範圍固定，不是無上限購買顧問時間。': '依需求議價，並以明確的範圍、里程碑與驗收方式規劃合作。', 'Final proposals are fixed to scope, not an open-ended block of consulting hours.': 'Pricing is agreed to fit the scope, milestones, and acceptance criteria.', '獨立購買其中一個階段': '獨立啟動其中一個階段', '客戶為何願意付費': '合作價值', '你購買的不是 AI 工具，而是一條通往成果的設計路徑。': '從專業方法到實際成果，讓 AI 應用有清楚的路徑。', 'Why clients pay': 'Why work with PECULAB', 'Why people pay': 'Why work with PECULAB', '重新提出人力配置報價': '重新規劃人力配置', '報名或付款以前，先把範圍說清楚。': '報名前，先確認學習目標與合作範圍。', '日期、最低開班人數、工具、付款與退費規則': '日期、最低開班人數、工具與參與條件', '工具、付款與取消規則': '工具與參與條件', 'dates, minimum enrollment, tools, payment terms, and cancellation rules': 'dates, minimum enrollment, tools, and participation terms', 'insurance, technology access, payment terms, and cancellation policies': 'insurance, technology access, and participation policies', '課程提案 · 場地、日期與費用待確認': '課程提案 · 場地與日期待確認 · 依需求議價', 'Program proposal · Venue, dates and fees pending confirmation': 'Program proposal · Venue and dates to be confirmed · Pricing by agreement', '定價與開班試算': '開班與合作規劃', 'Pricing & class planner': 'Program & partnership planning', '建議試辦費用 · 美元': '合作方式', 'PROPOSED PILOT TUITION · USD': 'PARTNERSHIP', '試辦費用將於開班前公告': '依需求議價', 'Tuition announced before enrollment.': 'Pricing by agreement.', '試辦費用尚待確認，目前尚未開放付款或正式報名。若由市府辦理，居民／非居民價與任何適用稅費將依最終核定內容公告。': '依班級人數、師資配置、場地與教材需求共同規劃，合作條件確認後開放報名。', '課堂共用教具與基本耗材納入試辦費用，不需購買教材也能上課；家庭可另行參加團購，購買同款教材帶回家。': '課堂提供共用教具與基本耗材，家庭也可依居家延伸學習需要選擇教材。'}
    for old, new in replacements.items():
        html = html.replace(old, new)
    return html

(ROOT/'index.html').write_text(public_copy(shell(overview)),encoding='utf-8')
(ROOT/'planning.html').write_text(public_copy(shell(planner,True)),encoding='utf-8')
print('Built index.html and planning.html; 36 original lesson plans in both languages.')
