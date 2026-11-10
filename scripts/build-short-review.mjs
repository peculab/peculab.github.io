// Local review renderer for the real Liquid layouts. This does not replace a Jekyll build.
import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtime = createRequire(path.join(root, '.local-artifacts/shorts-preview-runtime/package.json'));
const { Liquid } = runtime('liquidjs');
const MarkdownIt = runtime('markdown-it');
const YAML = runtime('yaml');
const markdown = new MarkdownIt({ html: true, linkify: true });
const destination = path.join(root, '.facebook-import/website-preview');
const engine = new Liquid({ root: [path.join(root, '_includes'), path.join(root, '_layouts')], extname: '.html', dynamicPartials: false });
const escape = (text) => String(text ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const routes = new Set(['/shorts/index.html', '/zh/shorts/index.html', '/shorts/feed.xml', '/shorts/feed-en.xml']);
const topics = JSON.parse(await readFile(path.join(root, '_data/short_topics.json'), 'utf8'));
for (const topic of topics) for (const prefix of ['', '/zh']) routes.add(`${prefix}/shorts/topics/${topic.id}.html`);
async function parseSource(file) {
  const raw = await readFile(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing front matter: ${file}`);
  return { data: YAML.parse(match[1]), body: match[2] };
}
const shorts = [];
for (const file of await readdir(path.join(root, '.facebook-import/curated/_shorts'))) {
  if (!file.endsWith('.md')) continue;
  const { data, body } = await parseSource(path.join(root, '.facebook-import/curated/_shorts', file));
  const url = `/shorts/${file.replace(/\.md$/, '.html')}`;
  routes.add(url);
  shorts.push({ author: 'Yun-Cheng (Pecu) Tsai', ...data, layout: 'short', published: true, url, content: markdown.render(body) });
}
const site = { ...YAML.parse(await readFile(path.join(root, '_config.yml'), 'utf8')), review_mode: true, time: new Date().toISOString(), data: { short_topics: topics }, shorts };
engine.registerFilter('relative_url', function (value) {
  const target = String(value ?? '');
  if (/^(https?:|#)/.test(target)) return target;
  const page = this.context.get(['page']);
  if (!routes.has(target) && !target.startsWith('/assets/') && !['/styles.css', '/site-navigation.css'].includes(target)) return site.url + target;
  return path.posix.relative(path.posix.dirname(page.url), target) || path.posix.basename(target);
});
engine.registerFilter('absolute_url', (value) => /^https?:/.test(String(value)) ? value : site.url + value);
engine.registerFilter('escape', escape);
engine.registerFilter('xml_escape', escape);
engine.registerFilter('jsonify', (value) => JSON.stringify(value));
engine.registerFilter('normalize_whitespace', (value) => String(value ?? '').replace(/\s+/g, ' ').trim());
engine.registerFilter('date_to_xmlschema', (value) => new Date(value).toISOString());
engine.registerFilter('date_to_rfc822', (value) => new Date(value).toUTCString());
engine.registerFilter('date', (value, format) => {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (name) => parts.find((item) => item.type === name).value;
  return format.replaceAll('%Y', get('year')).replaceAll('%m', get('month')).replaceAll('%d', get('day'));
});
engine.registerFilter('where_exp', (values, name, expression) => {
  if (expression !== `${name}.published != false`) throw new Error(`Unsupported local where_exp: ${expression}`);
  return values.filter((value) => value.published !== false);
});
engine.registerFilter('group_by_exp', (values, name, expression) => {
  if (expression !== `${name}.date | date: "%Y"`) throw new Error(`Unsupported local group_by_exp: ${expression}`);
  const groups = new Map();
  for (const value of values) { const year = value.date.slice(0, 4); if (!groups.has(year)) groups.set(year, []); groups.get(year).push(value); }
  return [...groups].map(([name, items]) => ({ name, items, size: items.length }));
});
async function emit(url, html) {
  const file = path.join(destination, url.slice(1));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
}
for (const topic of topics) {
  for (const [lang, prefix] of [['zh-Hant', '/zh'], ['en', '']]) {
    const url = `${prefix}/shorts/topics/${topic.id}.html`;
    const title = lang === 'en' ? topic.label_en : topic.label_zh;
    const description = lang === 'en' ? topic.intro_en : topic.intro_zh;
    const source = `---\nlayout: short-topic\ntitle: ${JSON.stringify(title)}\nlang: ${lang}\ntopic: ${topic.id}\ndescription: ${JSON.stringify(description)}\n---\n`;
    await mkdir(path.dirname(path.join(root, url.slice(1))), { recursive: true });
    await writeFile(path.join(root, url.slice(1)), source);
    const page = { layout: 'short-topic', url, lang, topic: topic.id, title, description };
    await emit(url, await engine.renderFile('short-topic', { site, page }));
  }
}
for (const url of ['/shorts/index.html', '/zh/shorts/index.html']) {
  const { data } = await parseSource(path.join(root, url.slice(1)));
  await emit(url, await engine.renderFile('shorts-index', { site, page: { ...data, url } }));
}
for (const page of shorts) await emit(page.url, await engine.renderFile('short', { site, page, content: page.content }));
for (const url of ['/shorts/feed.xml', '/shorts/feed-en.xml']) {
  const feed = await parseSource(path.join(root, url.slice(1)));
  await emit(url, await engine.parseAndRender(feed.body, { site, page: { ...feed.data, url } }));
}
await emit('/index.html', '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Pecu 短文本機檢視</title><meta http-equiv="refresh" content="0;url=zh/shorts/index.html"><a href="zh/shorts/index.html">開啟本機檢視稿</a></html>');
for (const relative of ['styles.css', 'site-navigation.css', 'assets/shorts.css', 'assets/shorts.js', 'assets/peculab-mark-clean.png', 'assets/peculab-mark.png']) {
  await mkdir(path.dirname(path.join(destination, relative)), { recursive: true });
  await copyFile(path.join(root, relative), path.join(destination, relative));
}
await writeFile(path.join(destination, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await writeFile(path.join(destination, 'review-manifest.json'), JSON.stringify({ renderer: 'LiquidJS local review; Jekyll build still required', publication: 'not-approved', articles: new Set(shorts.map((note) => note.translation_key)).size, editions: shorts.length, languages: ['zh-Hant', 'en'], topics: topics.length, routes: [...routes] }, null, 2));
console.log(JSON.stringify({ destination, articles: new Set(shorts.map((note) => note.translation_key)).size, editions: shorts.length, topicPages: topics.length * 2, renderedRoutes: routes.size, published: false }));
