import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv.includes('--publish')) throw new Error('Publication requires --publish after the owner authorizes the selected bilingual articles.');
const report = JSON.parse(await readFile(path.join(root, '.facebook-import/curated/report.json'), 'utf8'));
const prepared = [];
for (const article of report.articles) {
  for (const name of [article.file, article.englishFile]) {
    if (!/^\d{4}-\d{2}-\d{2}-profile-[a-f0-9]{16}(?:-en)?\.md$/.test(name)) throw new Error(`Unexpected approved filename: ${name}`);
    const draft = await readFile(path.join(root, '.facebook-import/curated/_shorts', name), 'utf8');
    if (!draft.includes('published: false') || !draft.includes('review_status: "pending-owner-review"')) throw new Error(`Draft is not in review state: ${name}`);
    const url = '/shorts/' + name.replace(/\.md$/, '.html');
    const content = draft.replace(/^published: false$/m, 'published: true').replace(/^review_status: "pending-owner-review"$/m, 'review_status: "owner-approved"').replace(/^---\n/, `---\npermalink: ${JSON.stringify(url)}\n`);
    const target = path.join(root, '_shorts', name);
    let existing;
    try { existing = await readFile(target, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (existing !== undefined && existing !== content) throw new Error(`Published article differs; refusing to overwrite edits: ${name}`);
    prepared.push({ name, target, content, existing: existing !== undefined });
  }
}
await mkdir(path.join(root, '_shorts'), { recursive: true });
for (const item of prepared) if (!item.existing) await writeFile(item.target, item.content, { flag: 'wx' });
const publication = { approval: 'Owner explicitly requested GitHub push and public release in conversation', stories: report.total, editions: prepared.length, files: prepared.map((item) => item.name) };
await writeFile(path.join(root, '.facebook-import/curated/publication.json'), JSON.stringify(publication, null, 2));
console.log(JSON.stringify({ preparedForPublication: prepared.length, newlyWritten: prepared.filter((item) => !item.existing).length, privateArchiveIncluded: false }));
