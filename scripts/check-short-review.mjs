import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preview = path.join(root, '.facebook-import/website-preview');
const report = JSON.parse(await readFile(path.join(root, '.facebook-import/curated/report.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(preview, 'review-manifest.json'), 'utf8'));
let links = 0;
let articles = 0;
let chineseEditions = 0;
let englishEditions = 0;
let topicPages = 0;
for (const url of manifest.routes.filter((url) => url.endsWith('.html'))) {
  const file = path.join(preview, url.slice(1));
  const html = await readFile(file, 'utf8');
  assert.ok(!/\{%|\{\{/.test(html), `Unrendered Liquid: ${url}`);
  assert.ok(html.includes('noindex, nofollow'), `Missing private-review metadata: ${url}`);
  assert.ok(html.includes('本機檢視稿'), `Missing review banner: ${url}`);
  assert.ok(!html.includes('undefined'), `Undefined content: ${url}`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const link = match[1].replace(/&amp;/g, '&');
    if (/^(https?:|#|data:|mailto:)/.test(link)) continue;
    const target = path.resolve(path.dirname(file), link.split(/[?#]/)[0]);
    assert.ok(target.startsWith(preview + path.sep), `Review link escaped preview: ${link}`);
    await stat(target).catch(() => { throw new Error(`Broken local link ${url} → ${link}`); });
    links++;
  }
  if (url.includes('/topics/')) {
    const topic = path.basename(url, '.html');
    const expected = report.articles.filter((article) => article.topic === topic).length;
    assert.equal((html.match(/class="short-card"/g) || []).length, expected, `Topic count: ${url}`);
    assert.equal((html.match(/<article><h2>/g) || []).length, 3, `Question count: ${url}`);
    topicPages++;
  } else if (url.endsWith('/index.html')) {
    assert.equal((html.match(/data-short-card/g) || []).length, 20, `Article index count: ${url}`);
    assert.ok(html.includes(url.startsWith('/zh/') ? '把想法留下來。' : 'Thoughts worth keeping.'), `Language mismatch: ${url}`);
  } else {
    const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    const data = JSON.parse(schema);
    assert.equal(data['@type'], 'BlogPosting');
    assert.ok(data.headline);
    assert.ok(data.datePublished);
    const english = data.inLanguage === 'en';
    assert.ok(html.includes(english ? 'Editorial reading guide' : '閱讀導引 · 編輯摘要'));
    assert.ok(html.includes(english ? 'English translation' : '原始貼文'));
    assert.ok(html.includes('class="article-language-switch"'), `Missing language switch: ${url}`);
    assert.ok(html.includes('hreflang="zh-Hant"') && html.includes('hreflang="en"'), `Missing language alternatives: ${url}`);
    if (english) { englishEditions++; assert.ok(html.includes('Read the Chinese original')); }
    else chineseEditions++;
    assert.ok(!html.includes('facebook.com/dyi/'), 'Account-specific export URL must not be published.');
    articles++;
  }
}
assert.equal(articles, 40);
assert.equal(chineseEditions, 20);
assert.equal(englishEditions, 20);
assert.equal(topicPages, 6);
const publicPosts = (await readdir(path.join(root, '_shorts'))).filter((name) => name.endsWith('.md'));
let publication;
try { publication = JSON.parse(await readFile(path.join(root, '.facebook-import/curated/publication.json'), 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const approved = new Set(publication?.files ?? []);
assert.ok(publicPosts.every((name) => approved.has(name)), 'Unapproved Facebook articles must remain outside public source.');
if (publication) assert.equal(publicPosts.length, approved.size);
for (const note of report.articles) {
  const original = await readFile(path.join(root, '.facebook-import/profile', note.file), 'utf8');
  const edited = await readFile(path.join(root, '.facebook-import/curated/_shorts', note.file), 'utf8');
  const body = (text) => text.slice(text.indexOf('\n---\n') + 5);
  assert.equal(body(original), body(edited), `Original text changed: ${note.file}`);
  assert.ok(edited.includes('published: false'));
  const english = await readFile(path.join(root, '.facebook-import/curated/_shorts', note.englishFile), 'utf8');
  assert.ok(english.includes('published: false'));
  assert.ok(edited.includes(`translation_key: "${note.translationKey}"`));
  assert.ok(english.includes(`translation_key: "${note.translationKey}"`));
  const chinesePage = await readFile(path.join(preview, 'shorts', note.file.replace(/\.md$/, '.html')), 'utf8');
  const englishPage = await readFile(path.join(preview, 'shorts', note.englishFile.replace(/\.md$/, '.html')), 'utf8');
  assert.ok(chinesePage.includes(`href="${note.englishFile.replace(/\.md$/, '.html')}" lang="en"`));
  assert.ok(englishPage.includes(`href="${note.file.replace(/\.md$/, '.html')}" lang="zh-Hant"`));
}
const sourceNotes = (await readFile(path.join(root, '.facebook-import/deliverables/pecu-short-notes-review/notes.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse);
let translatedUrls = 0;
for (const note of report.articles) {
  const source = sourceNotes.find((item) => item.file === note.file);
  const id = source.import_id;
  const translation = await readFile(path.join(root, '.facebook-import/curated/translations', `${id}.en.md`), 'utf8');
  for (const match of source.text.matchAll(/https?:\/\/[^\s<>]+/g)) { assert.ok(translation.includes(match[0]), `Source URL missing from translation: ${id} ${match[0]}`); translatedUrls++; }
  assert.ok(translation.length > source.text.length * 0.8, `Translation unexpectedly short: ${id}`);
  assert.ok(!/\bTODO\b|\bTBD\b|\[translate\]/i.test(translation), `Translation placeholder: ${id}`);
}
for (const [name, english] of [['feed.xml', false], ['feed-en.xml', true]]) {
  const feed = await readFile(path.join(preview, 'shorts', name), 'utf8');
  assert.equal((feed.match(/<item>/g) || []).length, 20);
  assert.equal((feed.match(/<link>[^<]*-en\.html<\/link>/g) || []).length, english ? 20 : 0);
}
console.log(JSON.stringify({ verified: true, stories: 20, chineseEditions, englishEditions, topicPages, checkedLocalLinks: links, translatedUrlsPreserved: translatedUrls, originalBodiesPreserved: 20, approvedPublicEditions: publicPosts.length, unapprovedPublicArticles: publicPosts.filter((name) => !approved.has(name)).length, browserVisualQA: 'not available', jekyllBuild: 'not available; LiquidJS review render only' }));
