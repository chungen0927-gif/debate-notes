// 檢查腳本：確認講義清單與檔案一致、每堂講義的固定段落齊全。
// 用法：在專案根目錄執行  node tools/check.mjs
// 規則來源：AGENTS.md 第 4～7 節。

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (message) => errors.push(message);

// 讀取 assets/lessons.js（它把資料掛在 window 上）
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, "assets/lessons.js"), "utf8"), sandbox);
const site = sandbox.window.SITE || {};
const lessons = sandbox.window.LESSONS || [];

const files = readdirSync(join(root, "lessons")).filter((name) => name.endsWith(".html"));
const allowed = ["sticky", "example", "warn", "speech", "terms", "compare", "steps"];
const count = (text, pattern) => (text.match(pattern) || []).length;

// 1. 清單本身
lessons.forEach((lesson, index) => {
  const expectedId = String(index + 1).padStart(2, "0");
  const where = `lessons.js 第 ${index + 1} 筆`;
  if (lesson.id !== expectedId) fail(`${where}：id 應為 "${expectedId}"（依序遞增、不跳號），目前是 "${lesson.id}"`);
  if (!/^\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.html$/.test(lesson.file || "")) fail(`${where}：檔名 "${lesson.file}" 不符合 NN-英文短名.html`);
  if (!(lesson.file || "").startsWith(lesson.id + "-")) fail(`${where}：檔名開頭要和 id 相同`);
  if (!(site.units || []).includes(lesson.unit)) fail(`${where}：單元 "${lesson.unit}" 不在 SITE.units 中`);
  if (!lesson.summary || lesson.summary.length > 40) fail(`${where}：summary 必填且不超過 40 字`);
  if (!Array.isArray(lesson.tags) || lesson.tags.length < 1 || lesson.tags.length > 3) fail(`${where}：tags 需要 1～3 個`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lesson.updated || "")) fail(`${where}：updated 格式應為 YYYY-MM-DD`);
  if (!files.includes(lesson.file)) fail(`${where}：找不到檔案 lessons/${lesson.file}`);
});

// 2. 每個講義檔
for (const name of files) {
  const lesson = lessons.find((item) => item.file === name);
  if (!lesson) {
    fail(`lessons/${name}：沒有登記在 assets/lessons.js`);
    continue;
  }
  const html = readFileSync(join(root, "lessons", name), "utf8");
  const where = `lessons/${name}`;

  if (!html.includes(`data-lesson-id="${lesson.id}"`)) fail(`${where}：<body> 的 data-lesson-id 應為 "${lesson.id}"`);
  if (!html.includes(`<title>第 ${lesson.id} 堂｜${lesson.title} — ${site.title}</title>`)) fail(`${where}：<title> 應為「第 ${lesson.id} 堂｜${lesson.title} — ${site.title}」`);
  if (count(html, /<h1[\s>]/g) !== 1) fail(`${where}：只能有一個 <h1>`);
  if (!html.includes(`<h1>${lesson.title}</h1>`)) fail(`${where}：<h1> 要和 lessons.js 的 title 完全相同`);
  if (!html.includes('id="lesson-kicker"') || !html.includes('id="lesson-nav"')) fail(`${where}：缺少 lesson-kicker 或 lesson-nav`);

  // 固定段落與順序
  const order = ['class="lesson-head"', 'class="goals"', 'class="content"', 'class="practice"', 'class="recap"'];
  let cursor = -1;
  for (const marker of order) {
    const at = html.indexOf(marker);
    if (at < 0) fail(`${where}：缺少段落 ${marker}`);
    else if (at < cursor) fail(`${where}：段落 ${marker} 的順序不對`);
    cursor = Math.max(cursor, at);
  }
  for (const once of ['class="goals"', 'class="practice"', 'class="recap"']) {
    if (count(html, new RegExp(once, "g")) > 1) fail(`${where}：段落 ${once} 只能出現一次`);
  }

  const goals = html.slice(html.indexOf('class="goals"'), html.indexOf("</section>", html.indexOf('class="goals"')));
  if (count(goals, /<li[\s>]/g) !== 3) fail(`${where}：本堂目標必須剛好 3 點`);

  const sections = html.split('<section class="content">').slice(1).map((part) => part.split("</section>")[0]);
  if (sections.length < 2 || sections.length > 4) fail(`${where}：內容段落需要 2～4 段，目前 ${sections.length} 段`);
  sections.forEach((section, index) => {
    if (!allowed.some((cls) => section.includes(`class="${cls}"`))) fail(`${where}：第 ${index + 1} 個內容段落沒有使用任何元件`);
    if (count(section, /class="sticky"/g) > 1) fail(`${where}：第 ${index + 1} 個內容段落的便利貼超過 1 張`);
  });

  // 禁止事項
  if (/<style[\s>]/.test(html) || /\sstyle="/.test(html)) fail(`${where}：不可使用 <style> 或行內 style`);
  if (count(html, /<script/g) !== 2) fail(`${where}：只能有範本最下方的兩行 <script src>`);
  if (/(href|src)="\//.test(html)) fail(`${where}：不可使用 / 開頭的絕對路徑`);
  for (const match of html.matchAll(/class="([^"]+)"/g)) {
    for (const cls of match[1].split(/\s+/)) {
      const known = ["page", "sheet", "lesson", "lesson-head", "lesson-kicker", "lead", "goals", "content", "practice", "recap", ...allowed];
      if (!known.includes(cls)) fail(`${where}：使用了 AGENTS.md 沒有列出的 class "${cls}"`);
    }
  }
}

if (errors.length) {
  console.error(`檢查未通過，共 ${errors.length} 個問題：`);
  errors.forEach((message) => console.error("  - " + message));
  process.exit(1);
}
console.log(`全部通過：${lessons.length} 堂講義，清單與檔案一致，段落齊全。`);
