import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeEntities, parseExportDate, recordsFromHtml } from './facebook-html.mjs';

const wrap = (content) => `<html><header>由 User 於 <time datetime="2026-07-09T20:38Z">UTC-07:00</time> 產生</header><main>${content}</main></html>`;
const section = (body, heading = 'User 更新了她的近況。') => `<section class="_a6-g"><h2>${heading}</h2><div class="_a6-p">${body}</div><footer><a href="https://www.facebook.com/dyi/l/?l=PRIVATE"><div>7 月 08, 2026 10:03:04 下午</div></a></footer></section>`;

test('reads actual HTML export structure, preserving text, entities and line breaks', () => {
  const parsed = recordsFromHtml(wrap(section('<div class="_2pin"><div>教育 &amp; AI<br />第二行 &#x1F600; &#064; &lt;code&gt;</div><div>已在 7 月 09, 2026 1:00:00 上午更新</div></div>')));
  assert.equal(parsed.records[0].data[0].post, '教育 & AI\n第二行 😀 @ <code>');
  assert.equal(parsed.records[0].timestamp, Date.parse('2026-07-08T22:03:04-07:00') / 1000);
  assert.equal(parsed.records[0].post_url, undefined);
  assert.equal(parsed.generatedAt, '2026-07-09T20:38Z');
  assert.equal(parsed.issues.length, 0);
});
test('keeps authored text once, excludes media captions, labels and update metadata', () => {
  const body = '<div class="_2pin"><div><div><img src="photo.jpg"><div>相片</div><div class="_3-95">舊相片說明</div></div></div></div><div class="_2pin"><div>真正的發文</div><div>已在 7 月 09, 2026 1:00:00 上午更新</div></div><div class="_2pin"><div>真正的發文</div></div>';
  const parsed = recordsFromHtml(wrap(section(body)));
  assert.deepEqual(parsed.records[0].data, [{ post: '真正的發文' }]);
  assert.deepEqual(parsed.records[0].export_media, ['photo.jpg']);
});
test('does not attribute shared-memory captions or system headings as new authored text', () => {
  const body = '<div class="_2pin"><div><div>2 年前</div><div>2022 的舊文章</div></div></div><div class="_2pin"><div>已在 7 月 09, 2026 1:00:00 上午更新</div></div>';
  const parsed = recordsFromHtml(wrap(section(body, 'User 分享了 1 則動態回顧。')));
  assert.deepEqual(parsed.records[0].data, []);
});
test('dates use the explicit archive display offset and handle midnight/noon', () => {
  assert.equal(parseExportDate('1 月 02, 2024 12:00:00 上午', '-07:00'), Date.parse('2024-01-02T00:00:00-07:00') / 1000);
  assert.equal(parseExportDate('7 月 08, 2026 12:00:00 下午', '-07:00'), Date.parse('2026-07-08T12:00:00-07:00') / 1000);
  assert.equal(parseExportDate('Unknown format', '-07:00'), null);
});
test('unknown HTML formats fail visibly; entities are decoded only once', () => {
  assert.throws(() => recordsFromHtml('<html></html>'), /Unrecognized/);
  assert.equal(decodeEntities('&amp;lt; &#039; &#x1f600;'), "&lt; ' 😀");
});
