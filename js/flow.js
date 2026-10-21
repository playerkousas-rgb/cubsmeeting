/* 🐺 flow.js — 🧭「帶你由頭做到尾」：揀咗一場集會之後，一步接一步帶到散會。
   呢個套包只做「帶集會」，唔做記錄：出席同獎章進度交畀右上角嘅進度追蹤APP／通告圖書館。 */
var Flow = {
  STEPS: [
    { k: "pick", ic: "📅", n: "揀今場集會", why: "揀一場，之後全部步驟跟住佢。", btn: "去揀集會", go: "Flow.doPick()" },
    { k: "print", ic: "🖨️", n: "印齊教案＋圖紙", why: "一疊過：領袖教案、分隔頁、成員圖紙。", btn: "即刻印", go: "Flow.doPrint()" },
    { k: "bag", ic: "🧺", n: "執袋（喺APP剔）", why: "逐樣剔，數量跟人數自動計。", btn: "開執袋單", go: "Flow.doBag()" },
    { k: "venue", ic: "📍", n: "到場設場", why: "到場逐項剔，剔完先開場。", btn: "睇設場清單", go: "Flow.doVenue()" },
    { k: "lead", ic: "▶️", n: "開始帶領", why: "跟綠色領袖卡做；計時、音效一撳即有。", btn: "即開帶領", go: "Flow.doLead()" }
  ],
  st: function () {
    try {
      var s = JSON.parse(localStorage.getItem("cub_flow") || "null");
      if (!s || typeof s !== "object") s = { on: 0, tid: "", done: {}, min: 0 };
      if (!s.done) s.done = {};
      return s;
    } catch (e) { return { on: 0, tid: "", done: {}, min: 0 }; }
  },
  save: function (s) { try { localStorage.setItem("cub_flow", JSON.stringify(s)); } catch (e) {} },
  tidNow: function () { try { return localStorage.getItem("cub_tid") || ""; } catch (e) { return ""; } },
  sync: function () {
    var s = Flow.st(), t = Flow.tidNow();
    if (s.on && s.tid !== t) { s.tid = t; s.done = { pick: 1 }; s.min = 0; Flow.save(s); }
    return s;
  },
  on: function () { return !!Flow.st().on; },
  start: function () {
    var s = Flow.st();
    s.on = 1; s.min = 0; s.tid = Flow.tidNow();
    if (!s.done) s.done = {};
    Flow.save(s);
    if (typeof App !== "undefined" && App.route) App.route(); else Flow.render();
    if (typeof toast !== "undefined") toast("🧭 好，我一步步帶你做到尾");
  },
  quit: function () {
    var s = Flow.st(); s.on = 0; Flow.save(s);
    if (typeof App !== "undefined" && App.route) App.route(); else Flow.render();
    if (typeof toast !== "undefined") toast("已收起嚮導 — 隨時喺「揀集會」頁撳返");
  },
  minimize: function () { var s = Flow.st(); s.min = s.min ? 0 : 1; Flow.save(s); Flow.render(); },
  reset: function () {
    var s = Flow.st(); s.done = {}; s.on = 1; s.tid = Flow.tidNow(); s.min = 0; Flow.save(s);
    if (typeof App !== "undefined" && App.route) App.route(); else Flow.render();
  },
  isDone: function (k) { return !!Flow.st().done[k]; },
  /* 用戶真係做完先自動跳：由各版 hook 呼叫，唔靠「下一步」掣 */
  mark: function (k, quiet) {
    var s = Flow.st();
    if (s.done[k]) return;
    s.done[k] = 1; Flow.save(s);
    if (!s.on) return;
    var nx = Flow.cur();
    if (!quiet && typeof toast !== "undefined") toast(nx ? ("✓ 做咗！下一步：" + nx.ic + " " + nx.n) : "🎉 做齊晒，散會！");
    Flow.render();
  },
  cur: function () {
    var s = Flow.st(), i;
    for (i = 0; i < Flow.STEPS.length; i++) if (!s.done[Flow.STEPS[i].k]) return Flow.STEPS[i];
    return null;
  },
  curNo: function () {
    var c = Flow.cur(); if (!c) return Flow.STEPS.length;
    for (var i = 0; i < Flow.STEPS.length; i++) if (Flow.STEPS[i].k === c.k) return i + 1;
    return 1;
  },
  doPick: function () { if (typeof App !== "undefined" && App.go) App.go("#plan"); },
  doPrint: function () { if (typeof App !== "undefined" && App.go) { App.go("#pack"); setTimeout(function () { if (typeof PackPrint !== "undefined" && PackPrint.open) PackPrint.open("all"); }, 80); } },
  doBag: function () { if (typeof App !== "undefined" && App.go) { App.go("#pack"); setTimeout(function () { if (typeof Bag !== "undefined" && Bag.open) Bag.open(); }, 80); } },
  doVenue: function () { if (typeof App !== "undefined" && App.go) { if (typeof Venue !== "undefined" && Venue.open) Venue.open(); else App.go("#pack"); } },
  doLead: function () { if (typeof Modal !== "undefined" && Modal.close) { try { Modal.close(); } catch (e) {} } if (typeof App !== "undefined" && App.go) App.go("#lead"); },
  render: function () {
    if (typeof document === "undefined") return;
    var el = document.getElementById("flowbar");
    if (!el) return;
    var view = document.getElementById("view");
    if (!Flow.on()) { el.innerHTML = ""; el.className = ""; if (view) view.style.paddingBottom = ""; return; }
    Flow.sync();
    el.className = "on";
    el.innerHTML = Flow.barHtml();
    if (view) view.style.paddingBottom = (Flow.st().min ? 150 : 200) + "px";
  },
  dotsHtml: function () {
    var s = Flow.st();
    return '<span class="fb-dots">' + Flow.STEPS.map(function (x, i) {
      var cls = s.done[x.k] ? "d" : (Flow.curNo() === i + 1 ? "c" : "");
      return '<i class="' + cls + '" title="' + x.n + '"></i>';
    }).join("") + "</span>";
  },
  barHtml: function () {
    var c = Flow.cur(), s = Flow.st(), m = null;
    try { if (typeof DATA !== "undefined") { var t = Flow.tidNow(); m = DATA.meetings.filter(function (x) { return x.tid === t; })[0] || null; } } catch (e) {}
    var head = '<div class="fb-top"><b>🧭 帶你由頭做到尾</b>' +
      (c ? '<span class="fb-no">第 ' + Flow.curNo() + " 步／共 " + Flow.STEPS.length + "</span>" : '<span class="fb-no ok">全部做齊 🎉</span>') +
      Flow.dotsHtml() +
      '<button class="fb-ic" onclick="Flow.minimize()" title="縮細／放大">' + (s.min ? "▲" : "▼") + "</button>" +
      '<button class="fb-ic" onclick="if(confirm(\'真係唔使帶？退出後唔會再彈。\'))Flow.quit()" title="唔使帶，我自己嚟">✕</button></div>';
    if (!c) {
      return head + (s.min ? "" : '<div class="fb-main"><div class="fb-txt"><b>🎉 散會！今場由頭到尾帶齊晒。</b>' +
        "<small>進度記喺右上角 🏅 進度追蹤APP；下場再帶就撳重頭再嚟。</small></div>" +
        '<div class="fb-act"><button class="btn sm" onclick="Flow.reset()">🔁 下一場重頭再嚟</button>' +
        '<button class="btn sm ghost" onclick="Flow.quit()">完成</button></div></div>');
    }
    if (s.min) return head;
    return head + '<div class="fb-main"><div class="fb-txt"><b>' + c.ic + " " + c.n + "</b>" +
      "<small>" + c.why + (m && c.k !== "pick" ? "（今場：" + m.n + "）" : "") + "</small></div>" +
      '<div class="fb-act"><button class="btn sm" onclick="' + c.go + '">' + c.btn + " ▸</button></div></div>";
  },
  inviteHtml: function () {
    if (Flow.on()) {
      var c = Flow.cur();
      return '<div class="flow-invite on"><b>🧭 嚮導行緊</b>' +
        "<span>" + (c ? ("而家：" + c.ic + " " + c.n + "（第 " + Flow.curNo() + "／" + Flow.STEPS.length + " 步）") : "全部做齊 🎉") + "</span>" +
        '<div class="btns"><button class="btn sm ghost" onclick="Flow.reset()">🔁 由第一步再嚟</button>' +
        '<button class="btn sm ghost" onclick="Flow.quit()">✕ 唔使帶</button></div></div>';
    }
    return '<div class="flow-invite"><b>🧭 第一次帶集會？我帶你由頭做到尾</b>' +
      "<span>撳一下，底部逐步帶你：揀集會 → 印教材 → 執袋 → 設場 → 帶領。帶完就散會。</span>" +
      '<div class="btns"><button class="btn sm gr" onclick="Flow.start()">🧭 帶我由頭做到尾</button></div></div>';
  }
};
