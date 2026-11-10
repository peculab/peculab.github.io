// Parser for the section/div export structure verified in Meta's July 2026 HTML archive.
// No scripts, links, or instructions in the archive are executed.
export function decodeEntities(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (whole, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? whole;
    const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  });
}

function tree(html) {
  const root = { tag: 'root', attrs: {}, children: [] };
  const stack = [root];
  for (const match of html.matchAll(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>|[^<]+|</gi)) {
    const token = match[0];
    if (token.startsWith('<!--')) continue;
    if (!/^<\/?[a-z]/i.test(token)) { stack.at(-1).children.push(decodeEntities(token)); continue; }
    if (token.startsWith('</')) {
      const tag = token.match(/^<\/([^\s>]+)/)[1].toLowerCase();
      for (let index = stack.length - 1; index > 0; index--) {
        if (stack[index].tag === tag) { stack.length = index; break; }
      }
      continue;
    }
    const tag = token.match(/^<([^\s/>]+)/)[1].toLowerCase();
    const attrs = {};
    for (const attribute of token.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[attribute[1]] = decodeEntities(attribute[2] ?? attribute[3]);
    const node = { tag, attrs, children: [] };
    stack.at(-1).children.push(node);
    if (!/\/>$/.test(token) && !['br', 'img', 'meta', 'link', 'input', 'hr', 'source', 'wbr'].includes(tag)) stack.push(node);
  }
  return root;
}
function findAll(node, predicate) {
  if (typeof node === 'string') return [];
  return [...(predicate(node) ? [node] : []), ...node.children.flatMap((child) => findAll(child, predicate))];
}
const hasClass = (node, name) => (node.attrs.class || '').split(/\s+/).includes(name);
function textOf(node) {
  if (typeof node === 'string') return node;
  if (node.tag === 'br') return '\n';
  if (['script', 'style', 'img'].includes(node.tag)) return '';
  return node.children.map(textOf).join('');
}

export function parseExportDate(value, offset) {
  const match = value.trim().match(/^(\d{1,2}) 月 (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (上午|下午)$/);
  if (!match) return null;
  const [, month, day, year, hour, minute, second, period] = match;
  const hh = Number(hour) % 12 + (period === '下午' ? 12 : 0);
  const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${String(hh).padStart(2, '0')}:${minute}:${second}${offset}`;
  const timestamp = Date.parse(iso) / 1000;
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function recordsFromHtml(html) {
  const generatedAt = html.match(/<time\b[^>]*datetime="([^"]+)"/)?.[1];
  const offset = html.slice(0, html.indexOf('<main')).match(/UTC([+-]\d{2}:\d{2})/)?.[1];
  if (!generatedAt || !offset) throw new Error('Unrecognized HTML export header or missing display timezone.');
  const sections = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)];
  if (!sections.length) throw new Error('No HTML export record sections found.');
  const records = [];
  const issues = [];
  for (const [index, match] of sections.entries()) {
    const node = tree(match[0]);
    const heading = findAll(node, (item) => item.tag === 'h2').map(textOf).join('');
    const footer = findAll(node, (item) => item.tag === 'footer')[0];
    const displayedDate = footer ? textOf(footer).trim() : '';
    const timestamp = parseExportDate(displayedDate, offset);
    if (timestamp === null) issues.push({ index, reason: 'unrecognized_date', displayedDate });
    // Actual authored post text is the first simple div inside a _2pin block.
    // Media preview wrappers contain nested divs and are deliberately excluded.
    const candidates = findAll(node, (item) => hasClass(item, '_2pin')).flatMap((block) => {
      const first = block.children.find((child) => typeof child !== 'string');
      if (!first || first.tag !== 'div') return [];
      if (findAll(first, (child) => ['div', 'table', 'video'].includes(child.tag)).length > 1) return [];
      const text = textOf(first).replace(/\r\n?/g, '\n').replace(/\n[ \t]+/g, '\n').trim();
      return !text || /^已在 .+更新$/.test(text) ? [] : [text];
    });
    const text = [...new Set(candidates)].join('\n\n');
    // Export links contain opaque, account-specific DYI tokens, not stable public permalinks.
    const links = findAll(node, (item) => item.tag === 'a').map((item) => item.attrs.href).filter(Boolean);
    const url = links.find((href) => /^https:\/\/(?:www\.)?facebook\.com\/(?:[^/?]+\/posts\/|permalink\.php|story\.php)/.test(href));
    const media = findAll(node, (item) => item.tag === 'img' || item.tag === 'video').map((item) => item.attrs.src).filter(Boolean);
    records.push({ timestamp, data: text ? [{ post: text }] : [], ...(url ? { post_url: url } : {}), export_record: index, export_heading: heading, export_displayed_date: displayedDate, export_media: media });
  }
  return { records, generatedAt, displayOffset: offset, issues };
}
