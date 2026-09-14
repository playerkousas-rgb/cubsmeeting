/* 🐺 幼童軍團集會助手 — App 主程式（靜態PWA・離線行到） */
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function toast(msg) {
  var t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.className = "show";
  clearTimeout(t._h); t._h = setTimeout(function () { t.className = ""; }, 2200);
}
var Store = {
  get: function (k, d) { try { var v = localStorage.getItem("cub_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem("cub_" + k, JSON.stringify(v)); } catch (e) {} }
};
var Modal = {
  open: function (html) { var m = document.getElementById("modal"); if (!m) return; m.innerHTML = '<div class="mbox" role="dialog" aria-modal="true" onclick="if(event.target===this)Modal.close()"><button class="mx" onclick="Modal.close()" aria-label="關閉">✕</button><div class="modal-content">' + html + "</div></div>"; m.className = "on"; if (document.body && document.body.classList) document.body.classList.add("modal-open"); },
  close: function () { var m = document.getElementById("modal"); if (m) { m.className = ""; m.innerHTML = ""; } if (document.body && document.body.classList) document.body.classList.remove("modal-open"); }
};
/* 列印跟住「你眼前嗰項」走：列印前暫開收埋嘅 details，印完還原。
   印邊度由 CSS 決定：print-pack→#printarea；modal-open→彈窗內容；否則當前畫面。 */
if (typeof window !== "undefined" && window.addEventListener) {
  var printOpened = [];
  window.addEventListener("beforeprint", function () {
    var root = null;
    try {
      if (document.body.classList.contains("print-pack")) root = document.getElementById("printarea");
      else if (document.body.classList.contains("modal-open")) root = document.querySelector("#modal .modal-content");
      else root = document.getElementById("view");
    } catch (e) { root = null; }
    if (!root || !root.querySelectorAll) return;
    printOpened = Array.prototype.slice.call(root.querySelectorAll("details:not([open])"));
    printOpened.forEach(function (d) { d.setAttribute("open", ""); d.setAttribute("data-print-opened", "1"); });
  });
  window.addEventListener("afterprint", function () {
    printOpened.forEach(function (d) { if (d.getAttribute("data-print-opened")) { d.removeAttribute("open"); d.removeAttribute("data-print-opened"); } });
    printOpened = [];
  });
}
/* 外部APP：全部新分頁＋離線變灰 */
function extBtn(url, big, title, desc) {
  var off = (typeof navigator !== "undefined" && navigator.onLine === false);
  return '<a class="extcard' + (big ? " big" : "") + (off ? " off" : "") + '" href="' + url + '" target="_blank" rel="noopener" ' + (off ? 'aria-disabled="true" onclick="return false"' : "") + ">" +
    '<b>' + title + "</b><span>" + desc + "</span>" +
    (off ? '<em>📴 要上網先用得（而家離線）</em>' : "<em>↗ 新分頁開</em>") + "</a>";
}
function handleOffline() {
  var off = (typeof navigator !== "undefined" && navigator.onLine === false);
  try { if (document.body && document.body.classList) document.body.classList.toggle("offline", !!off); } catch (e) {}
  document.querySelectorAll("a.extcard, a.external-link, a.pill").forEach(function (a) {
    if (off) { a.classList.add("off"); a.setAttribute("aria-disabled", "true"); a.onclick = function () { toast("📴 而家離線，要上網先用得"); return false; }; }
    else { a.classList.remove("off"); a.removeAttribute("aria-disabled"); a.onclick = null; }
  });
  var b = document.getElementById("netbar");
  if (b) b.style.display = off ? "block" : "none";
}
if (typeof window !== "undefined") {
  window.addEventListener("online", handleOffline);
  window.addEventListener("offline", handleOffline);
}

/* 目前揀咗邊場 */
function curTid() { try { var v = localStorage.getItem("cub_tid"); return v ? (v.charAt(0) === '"' ? JSON.parse(v) : v) : "c01"; } catch (e) { return "c01"; } }
function curMeet() {
  var t = curTid(), ms = (typeof DATA !== "undefined") ? DATA.meetings : [];
  for (var i = 0; i < ms.length; i++) if (ms[i].tid === t) return ms[i];
  return ms[0];
}
function setTid(tid) {
  var previous = curTid();
  Store.set("tid", tid);
  try { localStorage.setItem("cub_tid", tid); } catch (e) {}
  if (typeof Flow !== "undefined") { var s = Flow.st(); if (s.on) { s.tid = tid; if (previous !== tid || !s.done) s.done = {}; s.done.pick = 1; Flow.save(s); } }
}

var App = {
  tab: "plan",
  go: function (h) { location.hash = h; },
  init: function () {
    if (!localStorage.getItem("cub_tid")) { Store.set("tid", "c01"); try { localStorage.setItem("cub_tid", "c01"); } catch (e) {} }
    if (!Store.get("headcount", null)) Store.set("headcount", 24);
    window.addEventListener("hashchange", App.route);
    App.route();
    handleOffline();
    if (typeof Flow !== "undefined") Flow.render();
  },
  route: function () {
    var h = (location.hash || "#plan").split("?")[0];
    var q = {};
    (location.hash.split("?")[1] || "").split("&").forEach(function (p) { var kv = p.split("="); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ""); });
    App.tab = h.replace("#", "") || "plan";
    if (q.tid) setTid(q.tid);
    document.querySelectorAll("#topnav a, #tabbar a").forEach(function (a) { a.classList.toggle("cur", a.getAttribute("href") === h); });
    var v = document.getElementById("view");
    if (App.tab === "plan") v.innerHTML = App.vPlan();
    else if (App.tab === "meet") v.innerHTML = q.tid ? App.vMeetDetail(curMeet()) : App.vMeetList();
    else if (App.tab === "pack") v.innerHTML = App.vPack();
    else if (App.tab === "lead") v.innerHTML = App.vLead();
    else if (App.tab === "play") v.innerHTML = App.vPlay();
    else if (App.tab === "book") v.innerHTML = App.vBook();
    else v.innerHTML = App.vPlan();
    window.scrollTo(0, 0);
    handleOffline();
    if (typeof Flow !== "undefined") Flow.render();
    if (App.tab === "lead" && typeof Lead !== "undefined") Lead.mount();
  },

  /* ---------- 年度計劃／揀集會 ---------- */
  vPlan: function () {
    var done = Store.get("done", {}), ms = DATA.meetings, c = 0;
    ms.forEach(function (m) { if (done[m.tid]) c++; });
    var badgeUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.badge : "https://cubsbadge.vercel.app/";
    var circUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.circulars : "https://scout-circulars.vercel.app/";
    var h = '<section class="hero"><div class="troop">🐺 我的幼童軍團</div><h1>拎起手機就帶到。</h1>' +
      '<p>據幼童軍訓練綱要設計，將訓練目標化成即用集會、教材與逐步帶領支援。數碼道具全內置。想印紙？去印教材。獎章進度唔喺呢度記，交畀進度APP。</p>' +
      '<div class="quick"><button class="btn gr" onclick="App.quickStart()">▶ 即開今場</button>' +
      '<button class="btn" onclick="App.go(\'#pack\')">🖨️ 印齊今場</button>' +
      '<button class="btn ghost" onclick="App.go(\'#lead\')">🎲 隨手開會</button></div>' +
      '<div class="stats"><span><b>' + (ms.length - c) + '</b>尚餘集會</span><span><b>' + c + "/" + ms.length + '</b>已完成</span><span><b>' + esc(String(Store.get("headcount", 24))) + '</b>團員</span></div></section>';
    /* 通告圖書館細卡（ pill 橫排） */
    h += '<div class="pillrow"><span class="pillcap">📨 搞活動前睇通告：</span>' +
      '<a class="pill" href="' + circUrl + '" target="_blank" rel="noopener">📨 睇最新通告同活動 ↗</a></div>' +
      '<div class="tipcard">入去揀層級（總會／地域／區）＋時間（今天／七天／三十天）搵報名資料；搵唔到就放寬時間或者轉全港搜尋。</div>';
    /* 嚮導邀請卡（預設唔出嚮導，只出呢張） */
    h += (typeof Flow !== "undefined") ? Flow.inviteHtml() : "";
    /* 行事曆 */
    h += '<section class="card"><h2>🗓️ 年度行事曆 <small>' + c + "/" + ms.length + ' 完成</small></h2><p class="mut">撳任何一格：換卡・記完成・即刻帶。</p><div class="cal">';
    ms.forEach(function (m, i) {
      var d = done[m.tid];
      h += '<div class="slot' + (d ? " done" : "") + (m.tid === curTid() ? " cur" : "") + '">' +
        '<div class="smeta"><span class="mno">' + (i + 1) + '</span><span class="mmo">' + esc(m.month) + '</span>' + (d ? '<span class="tick">✓</span>' : "") + "</div>" +
        '<a class="sname" href="#meet?tid=' + m.tid + '">' + esc(m.n) + "</a>" +
        '<div class="stag">' + esc(m.badge) + "・約" + m.mins + "分鐘</div>" +
        '<div class="sbtns"><button class="btn xs" onclick="App.pick(\'' + m.tid + "')\">▶ 帶呢場</button>" +
        '<button class="btn xs ghost" onclick="App.swap(\'' + m.tid + "')\">🔀 換卡</button>" +
        '<button class="btn xs ghost" onclick="App.toggleDone(\'' + m.tid + "')\">" + (d ? "↩ 未做" : "✓ 做咗") + "</button></div></div>";
    });
    h += '</div><button class="btn ghost" onclick="if(confirm(\'真係記低成季做晒？\'))App.finishAll()">記低呢季完成晒</button></section>';
    /* 獎章路線圖 */
    h += '<section class="card"><h2>🐺 獎章路線圖</h2><p class="mut">會員章 → 幼童軍體驗章 → 幼童軍歷奇章 → 幼童軍高級歷奇章 → 金紫荊獎章；活動徽章另按範疇選擇</p><div class="badges">' +
      DATA.badges.map(function (b) { return '<div class="badge"><span>' + b.ic + "</span><b>" + esc(b.n) + "</b><small>" + esc(b.d) + "</small></div>"; }).join("") + "</div>" +
      '<div class="tipcard">⚠️ 分工要清：呢個套包負責帶集會＋記當日出席；長期獎章進度（會員章至金紫荊）、服務／活動／訓練班履歷、金紫荊現行申請表，一律去進度追蹤APP，唔好喺套包再起一套獎章資料庫。</div></div></section>';
    return h;
  },
  quickStart: function () { App.go("#meet?tid=" + curTid()); },
  pick: function (tid) { setTid(tid); App.go("#meet?tid=" + tid); toast("已揀：" + tid); if (typeof Flow !== "undefined") Flow.mark("pick", true), Flow.render(); },
  swap: function (tid) {
    var ms = DATA.meetings, i = ms.findIndex(function (m) { return m.tid === tid; });
    if (i < 0) return;
    var j = (i + 1) % ms.length;
    var t = ms[i]; ms[i] = ms[j]; ms[j] = t;
    toast("🔀 已同下一場調位（今季專用，唔影響原裝順序）"); App.route();
  },
  toggleDone: function (tid) { var d = Store.get("done", {}); d[tid] = !d[tid]; if (!d[tid]) delete d[tid]; Store.set("done", d); App.route(); },
  finishAll: function () { var d = {}; DATA.meetings.forEach(function (m) { d[m.tid] = 1; }); Store.set("done", d); App.route(); },

  /* ---------- 集會範本庫 ---------- */
  vMeetList: function () {
    var h = '<section class="card"><h2>🧩 集會範本庫 <small>22場・每場自動加總時間</small></h2><p class="mut">揀個範本，撳入去睇程序＋照讀口令＋圖解。撳標題準備呢場，STEP BY STEP 跟住做。</p><div class="meetlist">';
    DATA.meetings.forEach(function (m, i) {
      h += '<a class="meetrow" href="#meet?tid=' + m.tid + '"><span class="mno">' + (i + 1) + '</span><span class="mmain"><b>' + esc(m.n) + "</b><small>" + esc(m.badge) + "・" + esc(m.tags) + "・約" + m.mins + "分鐘</small></span><span class='go'>▶</span></a>";
    });
    return h + "</div></section>";
  },
  vMeetDetail: function (m) {
    var h = '<section class="card"><a class="back" href="#plan">‹ 返行事曆</a><h2>' + esc(m.n) + "</h2>" +
      '<p class="mut">' + esc(m.month) + "・" + esc(m.badge) + "・" + esc(m.tags) + '・<b>約' + m.mins + '分鐘（自動加總）</b></p>' +
      '<div class="quick"><button class="btn gr" onclick="App.go(\'#lead\')">▶ 投影帶領</button>' +
      '<button class="btn" onclick="App.go(\'#pack\')">🖨️ 印齊呢場</button>' +
      '<button class="btn ghost" onclick="Bag.open()">🧺 執袋</button>' +
      '<button class="btn ghost" onclick="Venue.open()">📍 設場</button></div></section>';
    h += '<section class="card"><h3>📋 今場程序（跟住做就得）</h3>';
    m.segs.forEach(function (s, i) {
      var g = (typeof Guide !== "undefined") ? Guide.forStage(s) : null;
      h += '<details class="seg" ' + (i === 0 ? "open" : "") + '><summary><span class="t">' + (i + 1) + ". " + esc(s.n) + '</span><span class="mins">' + s.m + '分鐘</span></summary>' +
        '<div class="segbody"><div class="dia">' + (s.svg || "") + "</div>" +
        '<p class="say">📢 照讀一句：「' + esc((s.script || "").replace(/^「|」$/g, "")) + '」</p>' +
        '<p><b>點做：</b>' + esc(s.how || "") + "</p>" +
        '<p><b>節奏：</b>' + esc(s.rhythm || "") + "</p>" +
        '<p class="safe">⛑️ 安全：' + esc(s.safety || "") + "</p>" +
        (g ? "<p class='lead'><b>🟢 領袖卡：</b>" + esc(g.lead) + "</p><ol class='lsteps'>" + g.steps.map(function (x) { return "<li><b>" + esc(x[2]) + "</b> — " + esc(x[3]) + "</li>"; }).join("") + "</ol>" : "") +
        "</div></details>";
    });
    h += '<p class="mut">⏱️ 合計：' + m.segs.map(function (s) { return s.m; }).join("＋") + "＝" + m.mins + '分鐘 ✓（時間自動加總）</p></section>';
    h += '<section class="card"><h3>🧺 物資＋設場</h3><p>人數 ' + esc(String(Store.get("headcount", 24))) + ' 人（喺手冊改）。物資跟人數自動換算。</p><ul>' +
      m.bag.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
      '<div class="quick"><button class="btn sm" onclick="Bag.open()">🧺 開執袋單（APP剔）</button><button class="btn sm ghost" onclick="Venue.open()">📍 睇設場圖</button></div>' +
      "<p><b>設場要點：</b>" + m.venue.map(esc).join("；") + "。</p></section>";
    h += '<section class="card"><h3>📨 家長通知（一撳複製）</h3><p class="notice">' + esc(m.notice) + "</p>" +
      '<div class="quick"><button class="btn sm" onclick="App.copyNotice()">📋 複製去WhatsApp</button>' +
      '<a class="btn sm ghost" id="waLink" href="https://wa.me/?text=" target="_blank" rel="noopener">↗ 開WhatsApp貼上</a></div></section>';
    return h;
  },
  copyNotice: function () {
    var m = curMeet(), txt = "🐺幼童軍團通知｜" + m.n + "｜" + m.month + "｜" + m.notice + "（詳情睇通告，唔明問領袖）";
    function ok() { toast("📋 已複製！去WhatsApp貼上就得"); var a = document.getElementById("waLink"); if (a) a.href = "https://wa.me/?text=" + encodeURIComponent(txt); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, function () { fallback(); });
    else fallback();
    function fallback() { var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { toast("複製唔到，長撳文字自己抄"); } ta.remove(); }
    var a = document.getElementById("waLink"); if (a) a.href = "https://wa.me/?text=" + encodeURIComponent(txt);
  },

  /* ---------- 印教材：一撳印齊 ---------- */
  vPack: function () {
    var m = curMeet(), hc = Store.get("headcount", 24), roster = Store.get("roster", []);
    var copies = roster.length > 0 ? roster.length : 1;
    var h = '<section class="card"><h2>🖨️ 集會套包・一撳印齊</h2>' +
      '<p class="mut">今場：' + esc(m.n) + "（約" + m.mins + '分鐘）</p>' +
      '<div class="ecocard">🌱 環保預設：只印三樣 — ①小朋友即用紙 ②貼地標記 ③領袖一頁流程。其餘全部喺APP睇，唔使印。' +
      (roster.length === 0 ? "未填名單，預設印 <b>1 份</b>（唔會預設印" + hc + "份）。" : "名單 " + roster.length + " 人，圖紙印 " + copies + " 份。") + "</div>" +
      '<div class="quick"><button class="btn gr" onclick="PackPrint.open(\'all\')">🖨️ 一撳印齊（教案＋分隔頁＋圖紙）</button>' +
      '<button class="btn" onclick="PackPrint.open(\'leader\')">只印領袖一頁流程</button>' +
      '<button class="btn ghost" onclick="Bag.open()">🧺 執袋（唔使印）</button>' +
      '<button class="btn ghost" onclick="Venue.open()">📍 設場（唔使印）</button>' +
      '<button class="btn ghost" onclick="App.editRoster()">✏️ 改名單（而家 ' + roster.length + ' 人）</button></div>' +
      '<p class="mut">一疊過張數 ＝ 教案 1 ＋ 分隔頁 1 ＋ 圖紙 ' + m.sheets.length + " ＝ " + (2 + m.sheets.length) + " 款（圖紙再×份數）。</p></section>";
    h += '<section class="card"><h3>📄 打印預覽（撳入去剔）</h3><div class="printlist">' +
      "<label><input type='checkbox' checked disabled> 領袖教案（程序＋口令＋時間）</label>" +
      "<label><input type='checkbox' checked disabled> 分隔頁（小朋友圖紙之前嗰張）</label>" +
      m.sheets.map(function (s) { return "<label><input type='checkbox' checked> 小朋友圖紙：" + esc(s) + " × " + copies + " 份</label>"; }).join("") +
      "</div></section>";
    h += '<section class="card"><h3>🧺 執袋＋設場（喺APP剔，唔使印）</h3><div class="quick"><button class="btn sm" onclick="Bag.open()">🧺 開執袋清單</button><button class="btn sm ghost" onclick="Venue.open()">📍 開設場圖</button></div></section>';
    return h;
  },

  /* ---------- 投影帶領 ---------- */
  vLead: function () {
    var m = curMeet();
    return '<section class="card"><h2>▶️ 投影帶領 <small>' + esc(m.n) + '</small></h2>' +
      '<p class="mut">全螢幕・大字・計時・音效・分組計分・抽籤點名。撳下面開全螢幕投影。</p>' +
      '<div class="quick"><button class="btn gr" onclick="Lead.full()">⛶ 全螢幕帶領</button>' +
      '<button class="btn" onclick="Lead.pick()">🎲 抽籤點名</button>' +
      '<button class="btn ghost" onclick="Lead.whistle()">🤫 5秒安靜</button>' +
      '<button class="btn ghost" onclick="Lead.horn()">🎺 吹哨</button></div>' +
      '<div id="leadscore"></div><div id="leadstage"></div>' +
      '<p class="mut">跟綠色領袖卡做：每段有圖、有口令、有節奏、有安全。做完一段撳「✓ 做完」，自動跳下一段。</p></section>';
  },

  /* ---------- 名單（只為打印份數及抽籤點名，唔做出席紀錄） ---------- */
  editRoster: function () {
    var r = Store.get("roster", ["陳小狼", "李小虎", "黃小豹"]);
    Modal.open("<h3>✏️ 改名單（一行一個名）</h3><textarea id='ros' rows='8'>" + esc(r.join("\n")) + "</textarea><div class='quick'><button class='btn gr' onclick='App.saveRoster()'>💾 儲存</button></div>");
  },
  saveRoster: function () {
    var t = document.getElementById("ros").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    Store.set("roster", t); Store.set("headcount", t.length || 24);
    Modal.close(); App.route(); toast("✓ 名單更新：" + t.length + "人");
  },

  /* ---------- 活動庫 ---------- */
  vPlay: function () {
    var cats = [
      { t: "🪢 結繩", k: /結繩|繫木|平結|營門/ }, { t: "⛑️ 急救", k: /急救|包紮|999/ },
      { t: "🧭 方向露營", k: /方向|指南針|露營|遠足|追蹤|路標|先鋒/ }, { t: "🍳 煮食環保", k: /煮食|環保|分類|STEM|實驗/ },
      { t: "🐺 儀式傳統", k: /呼叫|誓詞|會操|升旗|故事|貝登堡|聖誕|新春|頒獎|水戰|體能|藝術/ }
    ];
    var all = [];
    DATA.meetings.forEach(function (m) { m.segs.forEach(function (s) { all.push({ m: m, s: s }); }); });
    var h = '<section class="card"><h2>🎮 活動庫 <small>每個活動有圖・有口令・有節奏・有安全</small></h2>';
    cats.forEach(function (c) {
      h += "<h3>" + c.t + "</h3><div class='acts'>";
      all.filter(function (x) { return c.k.test(x.s.n + x.s.how); }).slice(0, 8).forEach(function (x) {
        h += '<div class="act"><div class="adia">' + (x.s.svg || x.s.ic || "🐺") + "</div><b>" + esc(x.s.n) + "</b><small>📢 " + esc(x.s.script || "") + "</small><small>⏱ " + x.s.m + "分鐘・出自：" + esc(x.m.n) + "</small><small>⛑ " + esc(x.s.safety || "") + "</small></div>";
      });
      h += "</div>";
    });
    return h + "</section>";
  },

  /* ---------- 手冊／設定 ---------- */
  vBook: function () {
    var badgeUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.badge : "https://cubsbadge.vercel.app/";
    var circUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.circulars : "https://scout-circulars.vercel.app/";
    var hc = Store.get("headcount", 24);
    var h = '<section class="card"><h2>📖 幼童軍手冊</h2>' +
      "<h3>🤝 誓詞</h3><p>" + DATA.facts.promise.map(esc).join("<br>") + "</p>" +
      "<h3>📏 規律</h3><p>" + esc(DATA.facts.law) + "</p>" +
      "<h3>💪 銘言</h3><p>" + esc(DATA.facts.motto) + "</p>" +
      "<h3>🐺 大聲呼叫</h3><p>" + esc(DATA.facts.howl) + '<br>📢 照讀：「' + esc(DATA.facts.howlScript.replace(/^「|」$/g, "")) + '」</p>' +
      "<h3>👥 小隊制</h3><p>" + esc(DATA.facts.six) + "</p>" +
      "<h3>🌳 Akela同叢林故事</h3><p>" + esc(DATA.facts.akela) + "</p>" +
      "<h3>🫡 旅團會操禮儀</h3><p>" + esc(DATA.facts.salute) + "</p></section>";
    h += '<section class="card"><h3>🎖️ 獎章路線</h3><div class="badges">' +
      DATA.badges.map(function (b) { return '<div class="badge"><span>' + b.ic + "</span><b>" + esc(b.n) + "</b><small>" + esc(b.d) + "</small></div>"; }).join("") + "</div></section>";
    h += '<section class="card"><h3>🧰 物資庫（跟人數自動換算）</h3><p class="mut">而家人數：' + hc + ' 人（改下面滑桿，數量即刻計）。算法：24人做基準，每多人按比例加。</p>' +
      '<label>👥 團員人數：<input type="range" min="6" max="48" value="' + hc + '" oninput="App.setHC(this.value)"> <b id="hcN">' + hc + "</b>人</label><ul id='matlist'>" + App.matList(hc) + "</ul></section>";
    h += '<section class="card"><h3>🔗 相關APP（網上服務・要上網先用得）</h3>' +
      extBtn(badgeUrl, true, "🏅 幼童軍進度追蹤系統", "記每個團員獎章進度（會員章至金紫荊）、活動履歷（服務／活動／訓練班，家長申報領袖審批）、金紫荊申請表。分工：套包只帶集會；出席同長期獎章進度交畀佢。") +
      extBtn(circUrl, false, "📨 童軍通告圖書館", "搵總會／地區／區通告同活動報名資料。入去揀層級＋時間（今天／七天／三十天）；搵唔到就放寬時間或者轉全港搜尋。") + "</section>";
    h += '<section class="card"><h3>⚙️ 設定</h3><div class="quick"><button class="btn sm ghost" onclick="if(confirm(\'清晒所有記錄？\')){localStorage.clear();location.reload()}">🗑 清除本機記錄</button></div>' +
      '<p class="mut">離線PWA：無網都帶到集會；兩個相關APP係網上服務，離線會變灰。</p></section>';
    return h;
  },
  matList: function (hc) {
    return DATA.materials.map(function (m) {
      var q = (typeof DATA.calcQty === "function") ? DATA.calcQty(m, hc) : m.base;
      return "<li>" + esc(m.n) + " — <b>" + q + esc(m.unit) + "</b><br><small>" + esc(m.note) + "</small></li>";
    }).join("");
  },
  setHC: function (v) {
    Store.set("headcount", +v);
    var n = document.getElementById("hcN"); if (n) n.textContent = v;
    var l = document.getElementById("matlist"); if (l) l.innerHTML = App.matList(+v);
  }
};

/* ---------- 執袋：喺APP剔，唔使印 ---------- */
var Bag = {
  open: function () {
    var m = curMeet(), hc = Store.get("headcount", 24);
    var chk = Store.get("bag_" + m.tid, {});
    var h = "<h3>🧺 執袋 — " + esc(m.n) + "</h3><p class='mut'>跟人數 " + hc + " 人自動計好，逐樣剔，剔晒自動跳下一步。</p>";
    var items = m.bag.map(function (name) {
      var found = DATA.materials.filter(function (x) { return x.n === name; })[0];
      var q = found ? DATA.calcQty(found, hc) + found.unit : "適量";
      return { n: name, q: q };
    });
    h += items.map(function (it, i) { return "<label class='chk'><input type='checkbox' data-i='" + i + "' " + (chk[i] ? "checked" : "") + " onchange='Bag.tick()'> " + esc(it.n) + " × <b>" + esc(it.q) + "</b></label>"; }).join("");
    h += "<div class='quick'><button class='btn gr' onclick='Bag.done()'>✓ 執齊晒</button></div><div id='bagmsg'></div>";
    Modal.open(h);
  },
  tick: function () {
    var m = curMeet(), o = {};
    document.querySelectorAll(".mbox .chk input").forEach(function (c) { if (c.checked) o[c.getAttribute("data-i")] = 1; });
    Store.set("bag_" + m.tid, o);
    var total = document.querySelectorAll(".mbox .chk input").length;
    if (Object.keys(o).length >= total) Bag.done(true);
  },
  done: function (auto) {
    var m = curMeet(), total = document.querySelectorAll(".mbox .chk input").length, o = {};
    if (auto) o = Store.get("bag_" + m.tid, {});
    else document.querySelectorAll(".mbox .chk input").forEach(function (c, i) { o[i] = 1; c.checked = true; }), Store.set("bag_" + m.tid, o);
    Modal.close(); toast("🧺 執好袋！");
    if (typeof Flow !== "undefined") { Flow.mark("bag"); Flow.render(); }
    App.route();
  }
};

/* ---------- 設場：設場圖＋執袋清單 ---------- */
var Venue = {
  open: function () {
    var m = curMeet();
    var chk = Store.get("ven_" + m.tid, {});
    var h = "<h3>📍 設場 — " + esc(m.n) + "</h3><div class='venuepic'><svg viewBox='0 0 300 180' role='img' aria-label='設場圖'><rect x='4' y='4' width='292' height='172' rx='14' fill='#E8F5E9' stroke='#2E7D32' stroke-width='3'/><circle cx='150' cy='90' r='42' fill='none' stroke='#E65100' stroke-width='4' stroke-dasharray='8 6'/><text x='150' y='96' font-size='16' text-anchor='middle'>🐺 小隊圈</text><rect x='18' y='18' width='70' height='34' rx='8' fill='#FFF3E0' stroke='#E65100' stroke-width='2'/><text x='53' y='40' font-size='12' text-anchor='middle'>🚩 旗／投影</text><rect x='212' y='18' width='70' height='34' rx='8' fill='#E3F2FD' stroke='#1565C0' stroke-width='2'/><text x='247' y='40' font-size='12' text-anchor='middle'>🧰 物資枱</text><rect x='18' y='128' width='70' height='34' rx='8' fill='#F3E5F5' stroke='#6A1B9A' stroke-width='2'/><text x='53' y='150' font-size='12' text-anchor='middle'>⛑️ 急救站</text><rect x='212' y='128' width='70' height='34' rx='8' fill='#FFF8E1' stroke='#F9A825' stroke-width='2'/><text x='247' y='150' font-size='12' text-anchor='middle'>🚪 出入口</text></svg></div>";
    h += "<p class='mut'>到場30分鐘前搞掂，逐項剔，剔晒自動跳下一步。</p>";
    m.venue.forEach(function (v, i) { h += "<label class='chk'><input type='checkbox' data-i='" + i + "' " + (chk[i] ? "checked" : "") + " onchange='Venue.tick()'> " + esc(v) + "</label>"; });
    h += "<div class='quick'><button class='btn gr' onclick='Venue.done()'>✓ 設好場</button></div>";
    Modal.open(h);
  },
  tick: function () {
    var m = curMeet(), o = {};
    document.querySelectorAll(".mbox .chk input").forEach(function (c) { if (c.checked) o[c.getAttribute("data-i")] = 1; });
    Store.set("ven_" + m.tid, o);
    if (Object.keys(o).length >= m.venue.length) Venue.done(true);
  },
  done: function () {
    var m = curMeet(), o = {};
    m.venue.forEach(function (_, i) { o[i] = 1; });
    Store.set("ven_" + m.tid, o);
    Modal.close(); toast("📍 設好場，開得！");
    if (typeof Flow !== "undefined") { Flow.mark("venue"); Flow.render(); }
    App.route();
  }
};

/* ---------- 一撳印齊 ---------- */
var PackPrint = {
  /* 張數公式：一疊過 ＝ 教案1 ＋ 分隔頁1 ＋ 圖紙N（對測試用，唔好改） */
  count: function (m) { return { plan: 1, divider: 1, sheets: m.sheets.length, total: 2 + m.sheets.length }; },
  open: function (mode) {
    var m = curMeet(), roster = Store.get("roster", []), copies = roster.length > 0 ? roster.length : 1;
    var c = PackPrint.count(m);
    var h = "<h3>🖨️ 打印 — " + esc(m.n) + "</h3><p class='mut'>一疊過：" + c.plan + "教案＋" + c.divider + "分隔頁＋" + c.sheets + "圖紙＝" + c.total + "款（圖紙×" + copies + "份）。撳下面列印，記得揀A4。</p>";
    h += "<div class='quick'><button class='btn gr' onclick='PackPrint.doit()'>🖨️ 列印</button><button class='btn ghost' onclick='Modal.close()'>返轉頭</button></div>";
    h += "<div id='printarea'><div class='psheet'><h4>領袖教案（1）</h4><p>" + esc(m.n) + "・約" + m.mins + "分鐘</p><ol>" + m.segs.map(function (s) { return "<li>" + esc(s.n) + "（" + s.m + "分鐘）— 照讀：「" + esc(s.script || "") + "」</li>"; }).join("") + "</ol></div>";
    h += "<div class='psheet divider'><h4>✂️ 分隔頁（1）</h4><p>之後係小朋友圖紙，沿線剪開派。</p></div>";
    h += m.sheets.map(function (s) { return "<div class='psheet'><h4>小朋友圖紙：" + esc(s) + "（×" + copies + "份）</h4><p>名：________  小隊：________  日期：________</p><div class='sheetbox'>（圖紙內容：跟住領袖指示做）</div></div>"; }).join("") + "</div>";
    Modal.open(h);
  },
  doit: function () {
    if (typeof Flow !== "undefined") { Flow.mark("print"); }
    setTimeout(function () { window.print(); }, 150);
  }
};

/* ---------- 投影帶領：大字計時音效計分抽籤 ---------- */
var Lead = {
  idx: 0, secs: 0, timer: null, scores: { "紅隊": 0, "黃隊": 0, "藍隊": 0, "綠隊": 0 },
  mount: function () { Lead.idx = 0; Lead.render(); Lead.renderScore(); },
  full: function () {
    var el = document.documentElement;
    try { if (el.requestFullscreen) el.requestFullscreen(); else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen(); } catch (e) {}
    if (typeof Flow !== "undefined") { Flow.mark("lead", true); }
    toast("⛶ 全螢幕帶領中：撳段落「✓ 做完」會自動跳下一段");
  },
  beep: function (f, d) {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.frequency.value = f || 880; o.type = "sine";
      g.gain.value = 0.2; o.start(); o.stop(ctx.currentTime + (d || 0.3));
    } catch (e) {}
  },
  whistle: function () { Lead.beep(2200, 0.15); setTimeout(function () { Lead.beep(2200, 0.15); }, 250); toast("🤫 5秒安靜：望住我！"); },
  horn: function () { Lead.beep(660, 0.4); setTimeout(function () { Lead.beep(880, 0.5); }, 300); toast("🎺 集合！"); },
  renderScore: function () {
    var el = document.getElementById("leadscore"); if (!el) return;
    el.innerHTML = '<div class="scorebar">' + Object.keys(Lead.scores).map(function (t) {
      return "<span class='team'><b>" + t + " " + Lead.scores[t] + "分</b> <button onclick=\"Lead.add('" + t + "',1)\">＋1</button><button onclick=\"Lead.add('" + t + "',-1)\">－1</button></span>";
    }).join("") + "</div>";
  },
  add: function (t, d) { Lead.scores[t] = Math.max(0, Lead.scores[t] + d); Lead.beep(d > 0 ? 880 : 440, 0.2); Lead.renderScore(); },
  pick: function () {
    var roster = Store.get("roster", []);
    var pool = roster.length ? roster : ["1號", "2號", "3號", "4號", "5號", "6號", "7號", "8號", "9號", "10號", "11號", "12號"];
    var n = pool[Math.floor(Math.random() * pool.length)];
    Lead.beep(1200, 0.3);
    toast("🎲 抽中：" + n + "！出嚟！");
    var el = document.getElementById("leadstage");
    if (el) el.innerHTML = "<div class='picked'>🎲 抽中：<b>" + esc(n) + "</b>！出嚟答／表演！</div>" + el.innerHTML;
  },
  render: function () {
    var st = document.getElementById("leadstage"); if (!st) return;
    var m = curMeet(), s = m.segs[Lead.idx];
    if (!s) { st.innerHTML = "<div class='picked'>🎉 今場帶完！已自動喺集會目錄剔低「✓ 做咗」。<br><button class='btn gr' onclick=\"App.go('#plan')\">📅 返集會目錄</button></div>"; return; }
    st.innerHTML = "<div class='leadcard'><div class='lhead'>第" + (Lead.idx + 1) + "/" + m.segs.length + "段・" + esc(s.n) + "・" + s.m + "分鐘</div>" +
      "<div class='ldia'>" + (s.svg || "") + "</div>" +
      "<div class='lsay'>📢 " + esc(s.script || "") + "</div>" +
      "<div class='ltimer'>⏱ <b id='ltime'>" + (s.m * 60) + "</b>秒 <button class='btn xs' onclick='Lead.startTimer(" + (s.m * 60) + ")'>▶ 開始計時</button> <button class='btn xs ghost' onclick='Lead.stopTimer()'>⏸ 停</button></div>" +
      "<div class='lhow'>" + esc(s.how || "") + "<br><small>節奏：" + esc(s.rhythm || "") + "</small><br><small>⛑ " + esc(s.safety || "") + "</small></div>" +
      "<div class='quick'><button class='btn sm' onclick='Lead.prev()'>‹ 上一段</button><button class='btn sm gr' onclick='Lead.next()'>✓ 做完，下一段</button><button class='btn sm ghost' onclick='Lead.pick()'>🎲 抽人</button></div></div>";
  },
  startTimer: function (secs) {
    Lead.stopTimer(); Lead.secs = secs;
    Lead.beep(880, 0.2);
    Lead.timer = setInterval(function () {
      Lead.secs--;
      var el = document.getElementById("ltime"); if (el) el.textContent = Lead.secs;
      if (Lead.secs <= 5 && Lead.secs > 0) Lead.beep(1200, 0.15);
      if (Lead.secs <= 0) { Lead.stopTimer(); Lead.beep(660, 0.6); toast("⏰ 時間到！"); }
    }, 1000);
  },
  stopTimer: function () { if (Lead.timer) clearInterval(Lead.timer); Lead.timer = null; },
  next: function () {
    Lead.stopTimer(); Lead.beep(880, 0.2); Lead.idx++; Lead.render();
    if (Lead.idx >= curMeet().segs.length) {
      /* 呢個套包唯一要記嘅嘢：今場集會用過咗。剔落集會目錄，唔做出席／獎章紀錄。 */
      var d = Store.get("done", {}); d[curTid()] = 1; Store.set("done", d);
      if (typeof Flow !== "undefined") Flow.mark("lead");
    }
  },
  prev: function () { Lead.stopTimer(); Lead.idx = Math.max(0, Lead.idx - 1); Lead.render(); }
};
/* ESC always closes the active dialog; useful on desktop and prevents modal dead ends. */
if (typeof document !== "undefined" && typeof document.addEventListener === "function") document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    var m = document.getElementById("modal");
    if (m && m.classList.contains("on")) Modal.close();
  }
});
