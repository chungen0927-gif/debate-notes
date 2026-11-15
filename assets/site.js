// 共用程式：頁首、頁尾、首頁講義列表、講義頁的上下堂導覽
// 資料全部來自 assets/lessons.js，這裡不寫死任何講義內容。
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var LESSONS = (window.LESSONS || []).slice().sort(function (a, b) {
    return a.id.localeCompare(b.id);
  });
  var body = document.body;
  var isLesson = body.dataset.page === "lesson";
  var root = isLesson ? "../" : ""; // 講義頁在 lessons/ 底下，要往上一層

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function toneOf(unit) {
    var index = (SITE.units || []).indexOf(unit);
    return String((index < 0 ? 0 : index) % 4);
  }

  // ---------- 頁首與頁尾 ----------
  function renderChrome() {
    var header = document.getElementById("site-header");
    if (header) {
      header.className = "site-header";
      var nav = el("nav", { class: "site-nav", "aria-label": "主選單" }, [
        el("a", { href: root + "index.html#lessons", text: "講義列表" }),
        el("a", { href: root + "index.html#about", text: "關於" }),
        SITE.repo ? el("a", { href: SITE.repo, text: "GitHub" }) : null
      ]);
      header.appendChild(el("a", { class: "site-title", href: root + "index.html", text: SITE.title || "" }));
      header.appendChild(nav);
    }
    var footer = document.getElementById("site-footer");
    if (footer) {
      footer.className = "site-footer";
      footer.textContent = (SITE.title || "") + " · 共 " + LESSONS.length + " 堂講義 · 依 AGENTS.md 的規則與 AI 協作製作";
    }
  }

  // ---------- 首頁：講義列表與單元篩選 ----------
  function renderHome() {
    var list = document.getElementById("lesson-list");
    var filters = document.getElementById("unit-filters");
    if (!list) return;

    function draw(unit) {
      list.textContent = "";
      var shown = LESSONS.filter(function (lesson) {
        return !unit || lesson.unit === unit;
      });
      shown.forEach(function (lesson) {
        var card = el("a", { class: "card", href: "lessons/" + lesson.file, "data-tone": toneOf(lesson.unit) }, [
          el("span", { class: "card-no", text: "第 " + lesson.id + " 堂 · " + lesson.unit }),
          el("span", { class: "card-title", text: lesson.title }),
          el("span", { class: "card-summary", text: lesson.summary }),
          el("span", { class: "card-tags", text: (lesson.tags || []).map(function (t) { return "#" + t; }).join("  ") })
        ]);
        list.appendChild(el("li", {}, [card]));
      });
      if (!shown.length) {
        list.appendChild(el("li", { class: "empty", text: "這個單元還沒有講義，敬請期待。" }));
      }
    }

    if (filters) {
      var units = [""].concat(SITE.units || []);
      units.forEach(function (unit) {
        var chip = el("button", { type: "button", class: "chip", "aria-pressed": unit === "" ? "true" : "false", text: unit || "全部" });
        chip.addEventListener("click", function () {
          Array.prototype.forEach.call(filters.children, function (other) {
            other.setAttribute("aria-pressed", other === chip ? "true" : "false");
          });
          draw(unit);
        });
        filters.appendChild(chip);
      });
    }
    draw("");
  }

  // ---------- 講義頁：頁首資訊與上下堂 ----------
  function renderLesson() {
    var id = body.dataset.lessonId;
    var index = LESSONS.findIndex(function (lesson) { return lesson.id === id; });
    var kicker = document.getElementById("lesson-kicker");
    var nav = document.getElementById("lesson-nav");

    if (index < 0) {
      if (kicker) kicker.textContent = "（這堂講義尚未登記在 assets/lessons.js）";
      console.warn("找不到 id 為 " + id + " 的講義，請檢查 assets/lessons.js");
      return;
    }
    var lesson = LESSONS[index];
    if (kicker) {
      kicker.textContent = "第 " + lesson.id + " 堂 · " + lesson.unit + " · " +
        (lesson.tags || []).map(function (t) { return "#" + t; }).join(" ");
    }
    if (nav) {
      nav.className = "lesson-nav";
      nav.setAttribute("aria-label", "上一堂與下一堂");
      var prev = LESSONS[index - 1];
      var next = LESSONS[index + 1];
      function link(target, cls, label) {
        if (!target) return el("span", { class: cls });
        var a = el("a", { class: cls, href: target.file }, [el("small", { text: label })]);
        a.appendChild(document.createTextNode(target.title));
        return a;
      }
      nav.appendChild(link(prev, "prev", "← 上一堂"));
      nav.appendChild(el("a", { class: "home", href: "../index.html#lessons", text: "回講義列表" }));
      nav.appendChild(link(next, "next", "下一堂 →"));
    }
  }

  renderChrome();
  if (isLesson) renderLesson();
  else renderHome();
})();
