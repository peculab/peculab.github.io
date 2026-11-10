import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
const output = path.resolve(process.argv[2] || '_site');
const source = path.resolve('_shorts');
const editions = [];
for (const name of await readdir(source)) {
  if (!name.endsWith('.md')) continue;
  const text = await readFile(path.join(source, name), 'utf8');
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
  const data = Object.fromEntries(front.split(/\r?\n/).filter(Boolean).map((line) => {
    const index = line.indexOf(':');
    const value = line.slice(index + 1).trim();
    let parsed;
    try { parsed = JSON.parse(value); } catch { parsed = value; }
    return [line.slice(0, index), parsed];
  }));
  if (data.published === false) continue;
  editions.push(data);
}
assert.ok(editions.length > 0, 'No published Short Notes sources.');
let checkedLinks = 0;
const pagePaths = ['/shorts/index.html', '/zh/shorts/index.html'];
const topics = JSON.parse(await readFile('_data/short_topics.json', 'utf8'));
for (const topic of topics) for (const prefix of ['', '/zh']) pagePaths.push(`${prefix}/shorts/topics/${topic.id}.html`);
for (const note of editions) {
  assert.ok(note.permalink, 'Each published edition must have an explicit permalink.');
  pagePaths.push(note.permalink);
  const paired = editions.find((other) => other.translation_key === note.translation_key && other.lang !== note.lang);
  assert.ok(paired, `Missing translation pair: ${note.permalink}`);
  assert.equal(note.date, paired.date);
}
for (const url of pagePaths) {
  const file = path.join(output, url.slice(1));
  const html = await readFile(file, 'utf8');
  assert.ok(!html.includes('本機檢視稿'), `Private review banner in public page: ${url}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+noindex/i.test(html), `Public page is noindexed: ${url}`);
  assert.ok(!/\{%|\{\{/.test(html), `Unrendered Liquid: ${url}`);
  assert.ok(html.includes('hreflang="zh-Hant"') && html.includes('hreflang="en"'));
  const isChinese = url.startsWith('/zh/') || editions.some((note) => note.permalink === url && note.lang === 'zh-Hant');
  const lang = isChinese ? 'zh-Hant' : 'en';
  if (url.endsWith('/index.html')) assert.equal((html.match(/data-short-card/g) || []).length, editions.filter((note) => note.lang === lang).length);
  if (url.includes('/topics/')) {
    const topic = path.basename(url, '.html');
    assert.equal((html.match(/class="short-card"/g) || []).length, editions.filter((note) => note.lang === lang && note.topics.includes(topic)).length);
  }
  if (editions.some((note) => note.permalink === url)) {
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema.inLanguage, lang);
    assert.ok(html.includes('class="article-language-switch"'));
    assert.ok(!html.includes('facebook.com/dyi/'));
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let target = match[1].replaceAll('&amp;', '&');
    if (/^(#|mailto:|data:)/.test(target)) continue;
    if (/^https?:/.test(target)) {
      const absolute = new URL(target);
      if (absolute.origin !== 'https://peculab.github.io') continue;
      target = absolute.pathname;
    }
    const resolved = target.startsWith('/') ? path.join(output, target.slice(1).split(/[?#]/)[0]) : path.resolve(path.dirname(file), target.split(/[?#]/)[0]);
    await access(resolved).catch(() => { throw new Error(`Broken built link ${url} → ${target}`); });
    checkedLinks++;
  }
}
for (const [name, lang] of [['feed.xml', 'zh-Hant'], ['feed-en.xml', 'en']]) {
  const feed = await readFile(path.join(output, 'shorts', name), 'utf8');
  assert.equal((feed.match(/<item>/g) || []).length, Math.min(50, editions.filter((note) => note.lang === lang).length));
}
const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
for (const note of editions) assert.ok(sitemap.includes(note.permalink), `Article missing from sitemap: ${note.permalink}`);
for (const folder of ['.facebook-import', '.local-artifacts']) {
  let exists = false;
  try { await access(path.join(output, folder)); exists = true; } catch {}
  assert.equal(exists, false, `Private folder in built output: ${folder}`);
}
console.log(JSON.stringify({ verified: true, publishedEditions: editions.length, bilingualStories: editions.length / 2, checkedPages: pagePaths.length, checkedLinks, sitemap: true, privateArchivesExcluded: true }));
