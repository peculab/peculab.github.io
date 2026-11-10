import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recordsFromHtml } from './facebook-html.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = {
  profile: { label: 'Facebook · Pecu Tsai', url: 'https://www.facebook.com/pecu.tsai/' },
  page: { label: 'Facebook · PecuLab LLC', url: 'https://www.facebook.com/PecuLabLLC' },
};

// Some Meta exports encode UTF-8 bytes as Latin-1 JSON characters.
export function repairText(text) {
  if (!text || [...text].some((char) => char.codePointAt(0) > 255)) return text;
  const decoded = new TextDecoder('utf-8', { fatal: true });
  try { return decoded.decode(Uint8Array.from([...text], (char) => char.charCodeAt(0))); }
  catch { return text; }
}

export function recordsFrom(value) {
  if (Array.isArray(value)) return value;
  for (const key of ['posts', 'your_posts', 'status_updates', 'wall_posts', 'posts_v2']) {
    if (Array.isArray(value?.[key])) return value[key];
  }
  throw new Error('Unsupported export shape: expected a posts array or posts/your_posts/status_updates/wall_posts/posts_v2.');
}

const escapeText = (text) => text.replace(/[&<>"{}]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '{': '&#123;', '}': '&#125;' })[char]);
function localDate(date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
function permalink(record) {
  const candidate = record.post_url || record.permalink_url || record.url;
  if (typeof candidate !== 'string') return null;
  try {
    const url = new URL(candidate);
    if (url.protocol === 'https:' && /(^|\.)facebook\.com$/.test(url.hostname)) return url.href;
  } catch {}
  return null;
}

export function convertRecord(record, { source, since, until }) {
  const timestamp = Number(record.timestamp ?? record.creation_timestamp);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return { skip: 'invalid_date' };
  const date = new Date(timestamp * 1000);
  if (Number.isNaN(date.getTime())) return { skip: 'invalid_date' };
  const day = localDate(date);
  if (day < since || day > until) return { skip: 'outside_range' };
  // Only explicit post text; do not mistake activity titles, comments or friends' text for authored posts.
  const chunks = (Array.isArray(record.data) ? record.data : []).map((item) => item.post).filter((value) => typeof value === 'string');
  if (!chunks.length && typeof record.post === 'string') chunks.push(record.post);
  const text = repairText(chunks.join('\n\n')).replace(/\r\n?/g, '\n').trim();
  if (!text) return { skip: 'no_post_text' };
  const digest = createHash('sha256').update(`${source}\n${timestamp}\n${text}`).digest('hex').slice(0, 16);
  const id = `${day}-${source}-${digest}`;
  const title = [...text.split('\n').find((line) => line.trim()).trim()];
  const heading = title.slice(0, 56).join('') + (title.length > 56 ? '…' : '');
  const front = {
    title: heading, date: date.toISOString(), lang: /[\u3400-\u9fff]/u.test(text) ? 'zh-Hant' : 'en',
    source, source_label: sources[source].label, source_profile: sources[source].url,
    ...(permalink(record) ? { source_url: permalink(record) } : {}),
    import_id: digest, excerpt: [...text.replace(/\s+/g, ' ')].slice(0, 155).join(''),
  };
  const body = text.split(/\n{2,}/).map((paragraph) => `<p>${escapeText(paragraph).replace(/\n/g, '<br>\n')}</p>`).join('\n\n');
  const markdown = '---\n' + Object.entries(front).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n') + '\n---\n\n' + body + '\n';
  return { id, markdown };
}

async function filesFrom(input) {
  const stat = await import('node:fs/promises').then((fs) => fs.stat(input));
  if (stat.isFile()) {
    if (!/\.(json|html)$/i.test(input)) throw new Error('Choose a JSON/HTML posts file or an extracted export folder.');
    return [input];
  }
  const result = [];
  for (const entry of await readdir(input, { withFileTypes: true })) {
    const target = path.join(input, entry.name);
    if (entry.isDirectory()) result.push(...await filesFrom(target));
    else if (/^(?:your_posts(?:__\d+|__check_ins__photos_and_videos)?|posts|status_updates|wall_posts)(?:_\d+)?\.(json|html)$/i.test(entry.name)) result.push(target);
  }
  return result.sort();
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || !args.length) {
    console.log('node scripts/import-facebook.mjs --input <posts.json-or-html-or-folder> --source profile|page --since YYYY-MM-DD --until YYYY-MM-DD [--publish]\nDefault: stage privately in .facebook-import/<source>/. --publish writes reviewed posts to _shorts/. Existing files are never overwritten.');
    return;
  }
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    if (key === '--publish') options.publish = true;
    else if (['--input', '--source', '--since', '--until'].includes(key) && args[index + 1] && !args[index + 1].startsWith('--')) options[key.slice(2)] = args[++index];
    else throw new Error(`Unknown option or missing value: ${key}`);
  }
  if (!options.input || !sources[options.source]) throw new Error('--input and --source profile|page are required.');
  const today = localDate(new Date());
  options.until ??= today;
  options.since ??= `${Number(options.until.slice(0, 4)) - 3}${options.until.slice(4)}`;
  for (const key of ['since', 'until']) {
    const value = options[key];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw new Error(`Invalid ${key} date: ${value}`);
  }
  if (options.since > options.until) throw new Error('--since must precede --until.');
  const files = await filesFrom(path.resolve(options.input));
  if (!files.length) throw new Error('No recognized posts JSON files found. Pass an individual posts JSON file if its name differs.');
  // Parse every input before writing anything, so malformed exports cannot produce a partial import.
  const records = [];
  const htmlExports = [];
  for (const file of files) {
    const content = (await readFile(file, 'utf8')).replace(/^\uFEFF/, '');
    if (/\.html$/i.test(file)) {
      const parsed = recordsFromHtml(content);
      if (parsed.issues.length) throw new Error(`HTML export contains ${parsed.issues.length} unrecognized dates; refusing partial conversion.`);
      htmlExports.push({ file: path.basename(file), generatedAt: parsed.generatedAt, displayOffset: parsed.displayOffset });
      records.push(...parsed.records);
    } else records.push(...recordsFrom(JSON.parse(content)));
  }
  const converted = records.map((record) => convertRecord(record, options));
  const destination = options.publish ? path.join(root, '_shorts') : path.join(root, '.facebook-import', options.source);
  await mkdir(destination, { recursive: true });
  const report = { source: options.source, since: options.since, until: options.until, files: files.length, records: records.length, written: 0, existing: 0, skipped: {} };
  for (const post of converted) {
    if (post.skip) { report.skipped[post.skip] = (report.skipped[post.skip] || 0) + 1; continue; }
    // A new export never replaces an edited article, or stages an already published one.
    try { await access(path.join(root, '_shorts', `${post.id}.md`)); report.existing++; continue; } catch {}
    try { await writeFile(path.join(destination, `${post.id}.md`), post.markdown, { encoding: 'utf8', flag: 'wx' }); report.written++; }
    catch (error) { if (error.code === 'EEXIST') report.existing++; else throw error; }
  }
  const reportFolder = path.join(root, '.facebook-import', options.source);
  await mkdir(reportFolder, { recursive: true });
  if (htmlExports.length) {
    report.htmlExports = htmlExports;
    const dated = records.filter((record) => record.timestamp).map((record) => localDate(new Date(record.timestamp * 1000))).sort();
    report.archiveDateRange = { first: dated[0], last: dated.at(-1) };
    const review = records.map((record, index) => {
      const post = converted[index];
      return { id: post.id ?? null, date: record.timestamp ? localDate(new Date(record.timestamp * 1000)) : null, status: post.skip ?? 'staged', title: record.data?.[0]?.post?.split('\n')[0] ?? null, mediaCount: record.export_media?.length ?? 0 };
    });
    await writeFile(path.join(reportFolder, 'review.json'), JSON.stringify(review, null, 2) + '\n');
  }
  await writeFile(path.join(reportFolder, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ ...report, destination, published: !!options.publish }, null, 2));
  if (!options.publish) console.log('Staged locally. Review these files before copying selected Markdown files to _shorts/.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
