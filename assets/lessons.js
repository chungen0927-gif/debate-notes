// 講義清單 — 全站唯一的資料來源（格式見 AGENTS.md）
// 新增講義時，只需要在 LESSONS 最後加一筆。

window.SITE = {
  title: "辯論社課手帳",
  tagline: "每週一堂，把辯論拆成看得懂、練得會的小單元。",
  repo: "https://github.com/chungen0927-gif/debate-notes", // GitHub repository 網址；留空則不顯示連結
  units: ["基礎觀念", "解題框架", "資料準備", "實戰"]
};

window.LESSONS = [
  {
    id: "01",
    file: "01-debater-basics.html",
    title: "辯士的基本素養：參加第一場辯論比賽",
    unit: "基礎觀念",
    summary: "演辯社在做什麼、辯題有哪些種類，以及一場辯論比賽怎麼進行。",
    tags: ["入門", "辯題", "賽制"],
    updated: "2026-11-15"
  },
  {
    id: "02",
    file: "02-stock-issues.html",
    title: "如何解題（一）：奧瑞岡的需根解損",
    unit: "解題框架",
    summary: "用需要性、根屬性、解決力、損益比，拆解政策性辯題。",
    tags: ["奧瑞岡", "需根解損"],
    updated: "2026-11-15"
  },
  {
    id: "03",
    file: "03-criterion-and-rebuttal.html",
    title: "如何解題（二）：國際賽的判定立駁",
    unit: "解題框架",
    summary: "用判準、定義、立論、駁論，看懂國際賽在爭什麼。",
    tags: ["國際賽", "判定立駁"],
    updated: "2026-11-15"
  },
  {
    id: "04",
    file: "04-evidence-research.html",
    title: "資料使用與蒐集：辯士的武器",
    unit: "資料準備",
    summary: "認識三組資料類型，學會搭配使用，並且有步驟地找資料。",
    tags: ["資料", "檢證"],
    updated: "2026-11-15"
  }
];
