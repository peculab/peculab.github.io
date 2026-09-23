"""Browser checks: run with Python + playwright; uses installed Microsoft Edge."""
from pathlib import Path
from tempfile import gettempdir
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
errors = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='msedge', headless=True)
        page = browser.new_page(viewport={'width':1440, 'height':1000}, device_scale_factor=1)
        page.on('pageerror', lambda e: errors.append(str(e)))
        for filename in ['index.html', 'planning.html']:
            page.goto(f'{base}/{filename}?lang=zh', wait_until='networkidle')
            assert page.locator('h1').count() == 1
            ids = page.locator('[id]').evaluate_all('(els)=>els.map(e=>e.id)')
            assert len(ids) == len(set(ids)), 'duplicate IDs'
            for href in page.locator('a[href^="#"]').evaluate_all('(els)=>els.map(e=>e.getAttribute("href"))'):
                assert page.locator(href).count(), href
            if filename == 'index.html':
                for photo in page.locator('img').all():
                    photo.scroll_into_view_if_needed()
                    photo.evaluate('(e)=>e.decode()')
                    assert photo.evaluate('(e)=>e.naturalWidth > 0'), 'product photo failed to load'
                assert page.locator('.module').count() == 6
                assert page.locator('.lesson-list li').count() == 36
                for module in page.locator('.module').all():
                    module.evaluate('(e)=>e.open=true')
                assert page.locator('.lesson-list li:visible').count() == 36
                page.locator('.module').evaluate_all('(els)=>els.forEach((e,i)=>e.open=i===0)')
            for language in ['en','zh-Hant']:
                page.locator(f'[data-language="{language}"]').click()
                assert page.locator('html').get_attribute('lang') == language
                other = 'zh-Hant' if language == 'en' else 'en'
                assert page.locator(f'span[lang="{other}"]:visible').count() == 0
                for width in [1440, 390, 320]:
                    page.set_viewport_size({'width':width,'height':950})
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'overflow {filename} {width} {language}'
            page.set_viewport_size({'width':1440,'height':1000})
            page.screenshot(path=str(Path(gettempdir())/f'gigo-{filename}-desktop.png'), full_page=True)
            page.set_viewport_size({'width':390,'height':844})
            page.screenshot(path=str(Path(gettempdir())/f'gigo-{filename}-mobile.png'), full_page=True)
        page.goto(f'{base}/planning.html?lang=en', wait_until='networkidle')
        assert page.locator('#profit').inner_text() == '$40.00'
        assert page.locator('#termProfit').inner_text() == '$240.00'
        assert page.locator('#cash').inner_text() == '-$640.00'
        assert page.locator('#breakEven').inner_text() == '8 students'
        assert not page.locator('#rent').is_visible()
        page.locator('#students').fill('8')
        assert page.locator('#profit').inner_text() == '$4.00'
        page.locator('#fee').fill('168')
        assert page.locator('#profit').inner_text() == '-$7.20'
        page.locator('button[type=reset]').click()
        page.wait_for_timeout(50)
        page.locator('#mode').select_option('rental')
        assert page.locator('#profit').inner_text() == '-$129.00'
        assert page.locator('#breakEven').inner_text() == '15 students'
        assert not page.locator('#share').is_visible()
        page.locator('#rent').fill('150')
        assert page.locator('#profit').inner_text() == '-$179.00'
        page.locator('#hours').fill('0')
        assert page.locator('#invalid-input').is_visible()
        page.locator('#mode').select_option('city')
        assert page.locator('#result-content').is_visible()
        page.locator('#share').fill('100')
        assert page.locator('#breakEven').inner_text() == 'Not possible'
        page.locator('#weeks').fill('0')
        assert page.locator('#invalid-input').is_visible()
        page.locator('button[type=reset]').click()
        page.wait_for_timeout(50)
        assert page.locator('#profit').inner_text() == '$40.00'
        page.locator('[data-language="zh-Hant"]').click()
        page.goto(f'{base}/index.html', wait_until='networkidle')
        assert page.locator('html').get_attribute('lang') == 'zh-Hant'
        assert not errors, errors
        browser.close()
finally:
    server.shutdown()
    server.server_close()
print('PASS: 36 lessons; bilingual toggle; desktop/mobile/320px layouts; calculator modes, break-even, cash, invalid input and reset; no JS errors.')
print(f'Screenshots: {gettempdir()}\\gigo-*.png')
