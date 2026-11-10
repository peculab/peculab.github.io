import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const selection = JSON.parse(await readFile(path.join(root, '.facebook-import/curated/selection.json'), 'utf8'));
const sourceNotes = (await readFile(path.join(root, '.facebook-import/deliverables/pecu-short-notes-review/notes.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse);
const inventory = JSON.parse(await readFile(path.join(root, '.facebook-import/profile/review.json'), 'utf8'));
const translations = JSON.parse(await readFile(path.join(root, '.facebook-import/curated/translations/en.json'), 'utf8'));
const output = path.join(root, '.facebook-import/curated/_shorts');
await mkdir(output, { recursive: true });
const report = [];
const topics = new Set(JSON.parse(await readFile(path.join(root, '_data/short_topics.json'), 'utf8')).map((topic) => topic.id));
const escapeText = (text) => text.replace(/[&<>"{}]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '{': '&#123;', '}': '&#125;' })[char]);
if (new Set(selection.map((entry) => entry.id)).size !== selection.length) throw new Error('Duplicate selected IDs.');
for (const item of selection) {
  const source = sourceNotes.find((note) => note.import_id === item.id);
  if (!source || !topics.has(item.topic) || !item.title || !item.summary || !item.question) throw new Error(`Invalid selection: ${item.id}`);
  const raw = await readFile(path.join(root, '.facebook-import/profile', source.file), 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const metadata = Object.fromEntries(match[1].split('\n').map((line) => { const split = line.indexOf(':'); return [line.slice(0, split), JSON.parse(line.slice(split + 1).trim())]; }));
  const body = match[2];
  const englishFile = source.file.replace(/\.md$/, '-en.md');
  const chineseUrl = '/shorts/' + source.file.replace(/\.md$/, '.html');
  const englishUrl = '/shorts/' + englishFile.replace(/\.md$/, '.html');
  const edited = {
    ...metadata, title: item.title, original_title: source.text.split('\n')[0], excerpt: item.summary,
    editorial_summary: item.summary, reader_question: item.question, primary_topic: item.topic,
    topics: [item.topic], published: false, review_status: 'pending-owner-review',
    translation_key: `facebook-${item.id}`, alternate_zh: chineseUrl, alternate_en: englishUrl,
    original_media_count: inventory.find((record) => record.id === source.file.replace(/\.md$/, ''))?.mediaCount ?? 0,
    archive_notice: item.notice ?? '本文依原始日期保留 Facebook 當時的文字。編輯標題與摘要另行提供，原文未改寫；舊活動與技術資訊不代表目前安排。',
  };
  await writeFile(path.join(output, source.file), '---\n' + Object.entries(edited).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n') + '\n---\n' + body);
  const written = await readFile(path.join(output, source.file), 'utf8');
  if (written.slice(written.indexOf('\n---\n') + 5) !== body) throw new Error(`Original body changed: ${source.file}`);
  const translation = translations[item.id];
  const englishText = (await readFile(path.join(root, '.facebook-import/curated/translations', `${item.id}.en.md`), 'utf8')).trim();
  if (!translation?.title || !translation?.summary || !translation?.question || englishText.length < 200) throw new Error(`Missing English edition: ${item.id}`);
  const englishBody = englishText.split(/\n{2,}/).map((paragraph) => `<p>${escapeText(paragraph).replace(/\n/g, '<br>\n')}</p>`).join('\n\n') + '\n';
  const english = {
    ...edited, title: translation.title, lang: 'en', original_title: englishText.split('\n')[0],
    excerpt: translation.summary, editorial_summary: translation.summary, reader_question: translation.question,
    archive_notice: translation.notice ?? 'This edition translates the original Facebook post while retaining its original date and historical context. Editorial titles and summaries are provided separately. Past events and technical details do not describe current arrangements.',
    translation_of: chineseUrl, translation_note: 'English translation of the original Chinese Facebook post. The original publication date and historical context are retained.',
  };
  await writeFile(path.join(output, englishFile), '---\n' + Object.entries(english).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n') + '\n---\n' + englishBody);
  report.push({ file: source.file, englishFile, topic: item.topic, title: item.title, englishTitle: translation.title, translationKey: edited.translation_key, bodySha256: createHash('sha256').update(body).digest('hex'), englishBodySha256: createHash('sha256').update(englishBody).digest('hex'), published: false });
}
await writeFile(path.join(root, '.facebook-import/curated/report.json'), JSON.stringify({ total: report.length, editions: report.length * 2, languages: ['zh-Hant', 'en'], publication: 'not-approved', articles: report }, null, 2));
const topicData = JSON.parse(await readFile(path.join(root, '_data/short_topics.json'), 'utf8'));
const review = ['# 官網短文第一批：中英文編輯檢視稿', '', '20 篇文章、40 個中英文版本，3 個主題；中文原文保留，英文為全文翻譯，尚未公開。', '', '[中文預覽](../website-preview/zh/shorts/index.html) · [English preview](../website-preview/shorts/index.html)', '', '選文原則：有具體教學或實作情境、能回答讀者問題，並能連到目前的課程或合作路徑。這不是人氣排名或搜尋量驗證。', '本輪主要保留教學、家庭學習與技術實作，未將爭議評論、私人訊息截圖或單純轉分享放入首批。涉及他人的歷史文章仍待本人確認公開範圍。', ''];
for (const topic of topicData) {
  review.push(`## ${topic.label_zh}`, '', `[主題入口](../website-preview/zh/shorts/topics/${topic.id}.html)`, '');
  for (const article of report.filter((article) => article.topic === topic.id)) {
    const entry = selection.find((entry) => entry.id === sourceNotes.find((note) => note.file === article.file).import_id);
    review.push(`- [${article.title}](../website-preview/shorts/${article.file.replace(/\.md$/, '.html')})`, `  - [${article.englishTitle}](../website-preview/shorts/${article.englishFile.replace(/\.md$/, '.html')})`, `  - 閱讀問題：${entry.question}`, `  - 編輯摘要：${entry.summary}`, '');
  }
}
review.push('## 尚未完成的部分', '', '- 尚未取得 2026/07/09 之後的個人貼文與 PecuLab LLC 粉專匯出。', '- 媒體附件尚未搬移；相應文章已標示。', '- 尚未進行真正 Jekyll 建置及瀏覽器視覺驗證。', '- 其餘 652 篇仍保留在原始整理稿，沒有遺失或公開。', '');
await writeFile(path.join(root, '.facebook-import/curated/REVIEW.md'), review.join('\n'));
console.log(JSON.stringify({ selected: report.length, editions: report.length * 2, topicCounts: report.reduce((counts, note) => { counts[note.topic] = (counts[note.topic] || 0) + 1; return counts; }, {}), originalBodiesPreserved: true, publicArticlesWritten: 0 }));
