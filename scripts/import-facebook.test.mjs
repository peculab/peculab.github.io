import test from 'node:test';
import assert from 'node:assert/strict';
import { convertRecord, repairText, recordsFrom } from './import-facebook.mjs';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const options = { source: 'profile', since: '2023-11-09', until: '2026-11-09' };
const record = { timestamp: Date.parse('2024-05-01T17:00:00Z') / 1000, data: [{ post: '教育與 AI\n\n保留原文。' }] };
test('preserves Chinese, original timestamps, paragraphs, and attribution', () => {
  const post = convertRecord(record, options);
  assert.match(post.markdown, /教育與 AI/);
  assert.match(post.markdown, /2024-05-01T17:00:00.000Z/);
  assert.match(post.markdown, /<p>保留原文。<\/p>/);
  assert.match(post.markdown, /Facebook · Pecu Tsai/);
  assert.equal(post.id, convertRecord(record, options).id);
  assert.notEqual(post.id, convertRecord(record, { ...options, source: 'page' }).id);
});
test('uses Los Angeles dates at range boundaries', () => {
  assert.equal(convertRecord({ ...record, timestamp: Date.parse('2023-11-09T07:59:59Z') / 1000 }, options).skip, 'outside_range');
  assert.ok(convertRecord({ ...record, timestamp: Date.parse('2023-11-09T08:00:00Z') / 1000 }, options).id);
  assert.ok(convertRecord({ ...record, timestamp: Date.parse('2026-11-10T07:59:59Z') / 1000 }, options).id);
  assert.equal(convertRecord({ ...record, timestamp: Date.parse('2026-11-10T08:00:00Z') / 1000 }, options).skip, 'outside_range');
});
test('escapes HTML and Liquid, and accepts only Facebook HTTPS source links', () => {
  const post = convertRecord({ ...record, data: [{ post: '<script>alert(1)</script> {{ site.secret }} {% endraw %}' }], post_url: 'javascript:alert(1)' }, options);
  assert.match(post.markdown, /&lt;script&gt;/);
  assert.match(post.markdown, /&#123;&#123; site.secret/);
  assert.doesNotMatch(post.markdown, /source_url:/);
  assert.match(convertRecord({ ...record, post_url: 'https://www.facebook.com/pecu.tsai/posts/123' }, options).markdown, /source_url:/);
});
test('does not publish activity titles, comments, or attachment text as authored posts', () => {
  assert.equal(convertRecord({ timestamp: record.timestamp, title: 'commented', data: [{ comment: 'Other person' }], attachments: [{ data: [{ text: 'Not a post' }] }] }, options).skip, 'no_post_text');
  assert.equal(convertRecord({ data: [{ post: 'bad' }] }, options).skip, 'invalid_date');
});
test('repairs byte-escaped exports without damaging valid Unicode', () => {
  const text = '教育與 AI 😀';
  assert.equal(repairText(Buffer.from(text).toString('latin1')), text);
  assert.equal(repairText(text), text);
  assert.equal(repairText('café'), 'café');
});
test('supports known export containers and rejects unrelated exports', () => {
  for (const key of ['posts', 'your_posts', 'status_updates', 'wall_posts', 'posts_v2']) assert.deepEqual(recordsFrom({ [key]: [record] }), [record]);
  assert.deepEqual(recordsFrom([record]), [record]);
  assert.throws(() => recordsFrom({ messages: [] }), /Unsupported/);
});

test('CLI stages privately, is repeatable, and publishes only when requested', async () => {
  const sandbox = await mkdtemp(path.join(tmpdir(), 'pecu-facebook-test-'));
  try {
    await mkdir(path.join(sandbox, 'scripts'));
    const script = path.join(sandbox, 'scripts', 'import-facebook.mjs');
    await copyFile(new URL('./import-facebook.mjs', import.meta.url), script);
    await copyFile(new URL('./facebook-html.mjs', import.meta.url), path.join(sandbox, 'scripts', 'facebook-html.mjs'));
    const input = path.join(sandbox, 'posts.json');
    await writeFile(input, JSON.stringify([record, record, { timestamp: record.timestamp, title: 'Photo only' }]));
    const args = [script, '--input', input, '--source', 'profile', '--since', options.since, '--until', options.until];
    const run = (...extra) => spawnSync(process.execPath, [...args, ...extra], { encoding: 'utf8' });
    const staged = run();
    assert.equal(staged.status, 0, staged.stderr);
    assert.match(staged.stdout, /"written": 1/);
    assert.match(staged.stdout, /"existing": 1/);
    assert.match(staged.stdout, /"no_post_text": 1/);
    await assert.rejects(readdir(path.join(sandbox, '_shorts')), /ENOENT/);
    assert.match(run().stdout, /"written": 0/);
    const published = run('--publish');
    assert.equal(published.status, 0, published.stderr);
    const [name] = await readdir(path.join(sandbox, '_shorts'));
    const publishedPath = path.join(sandbox, '_shorts', name);
    await writeFile(publishedPath, 'Editorial correction');
    assert.equal(run('--publish').status, 0);
    assert.equal(await readFile(publishedPath, 'utf8'), 'Editorial correction');
    await writeFile(input, '{bad JSON');
    assert.notEqual(run().status, 0);
  } finally {
    // Only this test's freshly created OS temp directory is removed.
    if (path.dirname(sandbox) === tmpdir() && path.basename(sandbox).startsWith('pecu-facebook-test-')) await rm(sandbox, { recursive: true, force: true });
  }
});
