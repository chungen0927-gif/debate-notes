// 講義清單 — 全站唯一的資料來源（格式見 AGENTS.md 第 5 節）
// 新增講義時，只需要在 LESSONS 最後加一筆。

window.SITE = {
  title: "辯論社課手帳",
  tagline: "每週一堂，把辯論拆成看得懂、練得會的小單元。",
  repo: "https://github.com/chungen0927-gif/debate-notes", // GitHub repository 網址；留空則不顯示連結
  units: ["基礎觀念", "立論", "攻防", "實戰"]
};

window.LESSONS = [
  {
    id: "01",
    file: "01-what-is-debate.html",
    title: "什麼是辯論？",
    unit: "基礎觀念",
    summary: "辯論不是吵架。先搞懂辯題、正反方，以及你真正要說服的人是誰。",
    tags: ["入門", "辯題", "持方"],
    updated: "2026-11-15"
  },
  {
    id: "02",
    file: "02-argument-structure.html",
    title: "論點怎麼搭：主張、理由、證據、影響",
    unit: "立論",
    summary: "把一句口號變成站得住腳的論點，只需要補齊四個零件。",
    tags: ["論點", "架構"],
    updated: "2026-11-15"
  },
  {
    id: "03",
    file: "03-rebuttal-basics.html",
    title: "反駁入門：四句反駁法",
    unit: "攻防",
    summary: "聽到對方的論點不再腦袋空白，用固定的四句話把反駁說清楚。",
    tags: ["反駁", "交鋒"],
    updated: "2026-11-15"
  }
];
