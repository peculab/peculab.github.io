"""Generate static, score-specific pages and preview images for social crawlers."""
from pathlib import Path
from html import escape
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent / 'share'
BASE = 'https://peculab.github.io/gigo/math/share'
FONT = 'C:/Windows/Fonts/arialbd.ttf'
ROOT.mkdir(exist_ok=True)

for score in range(0, 281, 10):
    directory = ROOT / str(score)
    directory.mkdir(exist_ok=True)
    image = Image.new('RGB', (1200, 630), '#fff8ef')
    d = ImageDraw.Draw(image)
    d.rounded_rectangle((35, 35, 1165, 595), radius=50, fill='#eee6ff')
    d.ellipse((925, 75, 1090, 240), fill='#ffc965')
    d.ellipse((95, 405, 175, 485), fill='#ffb8a7')
    d.text((95, 85), 'LITTLE STAR MATH ADVENTURE', font=ImageFont.truetype(FONT, 34), fill='#7155ad')
    d.text((92, 190), f'{score} / 280', font=ImageFont.truetype(FONT, 150), fill='#6950ac')
    d.text((100, 400), 'Can you complete the adventure?', font=ImageFont.truetype(FONT, 42), fill='#493c65')
    d.text((100, 480), 'PLAY & EXPLORE  |  PECULAB', font=ImageFont.truetype(FONT, 27), fill='#8b7aa4')
    image.save(directory / 'card.png', optimize=True)
    title = f'{score} / 280 points! 小星星數學探險 | Little Star Math Adventure'
    desc = '一起數一數、想一想！Join the math adventure and discover your score.'
    canonical = f'{BASE}/{score}/'
    html = f'''<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}</title><meta name="description" content="{escape(desc)}">
<meta property="og:type" content="website"><meta property="og:title" content="{escape(title)}"><meta property="og:description" content="{escape(desc)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{canonical}card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{escape(title)}"><meta name="twitter:image" content="{canonical}card.png"><link rel="stylesheet" href="../../style.css"></head>
<body><header><a href="../../">✦ PecuLab</a></header><main><section class="card result-hero"><p class="tag">✨ LITTLE STAR MATH ADVENTURE</p><div class="result-star">★</div><h1>一起來挑戰！<br>Ready for an adventure?</h1><p>這次探險得到 / This adventure scored</p><div class="score"><strong>{score}</strong><span> / 280 points</span></div><p>跟著小星星數一數、想一想！<br>Count, think and discover your own score!</p><a class="primary" style="display:inline-block;text-decoration:none" href="../../">我也要玩 / Let's play →</a><p class="small">趣味練習，分數不是能力或年級判定。<br>A playful activity; scores do not determine ability or grade level.</p></section></main></body></html>'''
    (directory / 'index.html').write_text(html, encoding='utf-8')
