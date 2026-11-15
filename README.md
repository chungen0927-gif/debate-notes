# 辯論社課手帳

把演辯社每一堂社課的簡報整理成講義的網站。

網站：https://chungen0927-gif.github.io/debate-notes/

## 目前的講義

1. 辯士的基本素養：參加第一場辯論比賽
2. 如何解題（一）：奧瑞岡的需根解損
3. 如何解題（二）：國際賽的判定立駁
4. 資料使用與蒐集：辯士的武器

## 怎麼新增講義

規則都寫在 [AGENTS.md](./AGENTS.md)。把新的簡報交給 AI，然後說：

> 請依 AGENTS.md 把這份簡報做成下一堂講義。

AI 會複製 `templates/lesson.html`、填入內容，並在 `assets/lessons.js` 加一筆，首頁就會自動多一張卡片。
