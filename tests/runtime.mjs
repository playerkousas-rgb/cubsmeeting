/* runtime：撈起全部版面 render，驗證唔爆、齊料、外部連結格式啱 */
import fs from "fs";
import vm from "vm";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let fail = 0;
const ok = (c, msg) => { console.log((c ? "✓ " : "✗ FAIL ") + msg); if (!c) fail++; };

const mem = {};
const el = () => ({ innerHTML: "", className: "", style: {}, textContent: "", value: "", href: "", dataset: {}, appendChild() {}, setAttribute() {}, removeAttribute() {}, querySelectorAll: () => [] });
const sb = {
  console,
  localStorage: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; }, clear: () => { for (const k in mem) delete mem[k]; } },
  location: { hash: "#plan", href: "" },
  navigator: { onLine: true },
  document: { getElementById: () => el(), createElement: () => el(), querySelectorAll: () => [], body: { ...el(), classList: { toggle() {}, add() {}, remove() {} } }, documentElement: el() },
  window: {}, addEventListener() {}, scrollTo() {}, confirm: () => true, setTimeout, clearTimeout, setInterval, clearInterval,
};
sb.window = sb; sb.globalThis = sb;
vm.createContext(sb);
for (const f of ["js/data.js", "js/jungle-data.js", "js/practical-data.js", "js/guide.js", "js/flow.js", "js/app.js", "js/redesign.js", "js/content.js", "js/jungle.js", "js/practical.js", "js/uniform-ceremony.js", "js/field-visuals.js", "js/salute-lab.js", "js/salute-positions.js", "js/tracking-kit.js", "js/material-desk.js", "js/plain-content.js", "js/worksheet-guides.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sb, { filename: f });
}
const Q = (s) => vm.runInContext(s, sb);

ok(Q("DATA.meetings.length") >= 22, "載入 22 場集會");
Q("Store.set('tid','c07'); try{localStorage.setItem('cub_tid','c07')}catch(e){}");

const pages = [
  ["vPlan", "App.vPlan()", ["集會目錄", "睇最新通告同活動", "今場集會", "據幼童軍訓練綱要設計"]],
  ["vMeetList", "App.vMeetList()", ["揀個範本", "準備呢場"]],
  ["vMeetDetail", "App.vMeetDetail(curMeet())", ["照讀一句", "自動加總", "家長通知", "複製去WhatsApp"]],
  ["vPack", "App.vPack()", ["完整出隊包", "精簡列印", "預設印"]],
  ["vLead", "App.vLead()", ["投影帶領", "全螢幕帶領", "抽籤點名"]],
  ["vPlay", "App.vPlay()", ["活動庫", "有口令", "有安全"]],
  ["vBook", "App.vBook()", ["手冊", "相關APP", "物資庫", "大聲呼叫"]],
];
for (const [name, expr, needles] of pages) {
  let html = "";
  try { html = Q(expr); } catch (e) { ok(false, name + " render 爆: " + e.message); continue; }
  ok(typeof html === "string" && html.length > 500, name + " 有料 (" + html.length + "字)");
  for (const n of needles) ok(html.includes(n), name + " 有「" + n + "」");
}
/* 外部連結：新分頁＋noopener */
{
  /* 定位：套包唔做記錄，所以外部APP引流連結更加要齊（手冊／目錄／制服頁） */
  const html = Q("App.vBook()") + Q("App.vPlan()") + Q("App.vUniform()");
  const links = [...html.matchAll(/<a[^>]*href="(https:[^"]+)"[^>]*>/g)];
  const ext = links.filter((m) => m[1].includes("vercel.app"));
  ok(ext.length >= 4, "外部APP連結 ≥4 個（找到 " + ext.length + "）");
  for (const m of ext) {
    ok(m[0].includes('target="_blank"'), "新分頁開：" + m[1]);
    ok(m[0].includes('rel="noopener"'), "rel=noopener：" + m[1]);
  }
  ok(html.includes("https://cubsbadge.vercel.app/"), "有進度APP網址");
  ok(html.includes("https://scout-circulars.vercel.app/"), "有通告圖書館網址");
}
/* Flow：7步＋invite＋bar 都 render 到 */
{
  const bar = Q("Flow.barHtml()");
  ok(bar.includes("帶你由頭做到尾"), "嚮導條有標題");
  const inv = Q("Flow.inviteHtml()");
  ok(inv.includes("第一次帶集會"), "邀請卡有標題");
  Q("Flow.start()");
  ok(Q("Flow.on()") === true, "Flow.start 開得");
  const bar2 = Q("Flow.barHtml()");
  ok(bar2.includes("第 1 步"), "開咗嚮導由第1步開始");
  Q("Flow.quit()");
  ok(Q("Flow.on()") === false, "Flow.quit 退到");
}
/* 定位：嚮導只做「帶集會」5 步，帶完即散會；記錄交右上角外部APP，唔喺呢度 */
{
  Q("Flow.reset()");
  ["pick", "print", "bag", "venue", "lead"].forEach((k, i) => {
    ok(Q("Flow.cur().k") === k, `第 ${i + 1} 步係「${k}」（實際「${Q("Flow.cur().k")}」）`);
    Q(`Flow.mark("${k}", true)`);
  });
  ok(Q("Flow.cur()") === null, "5 步做完即完成，冇第 6／7 步");
  const done = Q("Flow.barHtml()");
  ok(done.includes("散會"), "完成畫面講「散會」");
  ok(done.includes("進度追蹤APP"), "完成畫面引流去右上角進度追蹤APP");
  ok(!done.includes("同步落"), "完成畫面唔再提「同步落進度追蹤APP」");
  ok(Q("typeof Flow.doRec") === "undefined", "Flow.doRec 已移除");
  ok(Q("typeof Flow.doSync") === "undefined", "Flow.doSync 已移除");
  Q("Flow.quit()");
  /* inviteHtml 喺嚮導開住時回傳另一個分支，所以退咗先至讀到邀請文案 */
  const invite = Q("Flow.inviteHtml()");
  ok(invite.includes("帶領。帶完就散會"), "邀請卡文案止於「帶領」，帶完即散會");
  ok(!/記出席|同步獎章/.test(invite), "邀請卡唔再提記出席／同步獎章");
  /* 還原狀態：上面把 5 步全部標完成，會令後面「選集會直接開始印教材步驟」搵唔到 cur() */
  Q("localStorage.removeItem('cub_flow')");
}
/* 唯一要記嘅嘢：帶完今場 → 集會目錄自動剔「✓ 做咗」 */
{
  Q("Store.set('done',{})");
  Q("Store.set('tid','c07'); try{localStorage.setItem('cub_tid','c07')}catch(e){}");
  ok(!Q("Store.get('done',{})['c07']"), "未帶之前，c07 未剔");
  Q("Lead.idx = curMeet().segs.length - 1");
  Q("Lead.next()");
  ok(Q("Store.get('done',{})['c07']") === 1, "帶完最後一段，c07 自動剔「做咗」");
  ok(Q("App.vPlan()").includes("c07") , "集會目錄列到 c07");
  Q("Lead.idx = 0");
}
/* 活動章對齊《幼童軍訓練綱要》2026 年第十版「幼童軍活動徽章目錄」。
   來源：用戶提供嘅官方 PDF（一九九七年第一版／二零二六年第十版）第三章。
   呢個測試係棘輪：補咗內容就要由 PENDING 除名；頁碼改錯會即刻爆。 */
{
  /* 官方 2026 第十版活動徽章目錄（42 項，展開「積極公民」系列後共 47 個章名） */
  const OFFICIAL_2026 = {
    露營章: 27, 探險章: 28,
    愛護動物章: 29, 共融章: 30, 急救章: 31, 家務章: 32, 道路安全章: 33, 水上安全章: 34,
    防騙先鋒章: 35, 禁毒章: 35, 保護兒童章: 35, 社區應急先鋒章: 35, 環保先鋒章: 35, 機電先鋒章: 35,
    香港歷史章: 36, 國家安全大使章: 37,
    藝術章: 38, 手藝章: 39, 娛樂章: 40, 資訊科技章: 41, 語言章: 42, 媒體製作章: 43,
    音樂章: 44, 攝影章: 46, 寫作章: 47,
    天象章: 48, 園藝章: 49, 科學章: 50, 氣象章: 51, "地球部落計劃": 52,
    射箭章: 53, 田徑章: 54, 閱讀章: 55, 獨木舟章: 56, 搜集章: 57, 烹飪章: 58, 單車章: 59,
    公園定向章: 60, 寵物章: 61, 體適能章: 62, 風帆章: 63, 水手章: 64, 運動章: 65,
    游泳章: 66, 世界友誼章: 67, 宗教章: 68, 童軍先修章: 70,
  };
  /* 47 個章全部已按官方 2026 第十版原文補齊；呢個陣列留空做棘輪：
     如果日後有章被清空，呢度會即刻爆。 */
  const PENDING = [];
  /* 舊制章：2026 第十版目錄已經冇呢 4 個章，所以唔入組別（撳唔到係正確行為） */
  const LEGACY = ["勞作章","讀圖章","電腦章","體操章"];

  const items = Q("App.badgeGroups()").flatMap((g) => g.items);
  const norm = (n) => n.replace(/（[^）]*）/g, "").trim();
  ok(items.length === 47, `組別共 ${items.length} 個章名（官方2026 展開後 47）`);
  ok(items.every((n) => norm(n) in OFFICIAL_2026 || n.startsWith("地球部落計劃")), "組別冇多出官方2026以外嘅章");
  /* 「地球部落計劃」喺組別係一條複合條目（走塑達人／自然守護者／日光善用者），所以用前綴比 */
  ok(Object.keys(OFFICIAL_2026).every((k) => items.some((n) => norm(n) === k || n.startsWith(k))), "官方2026每個章都喺組別入面");

  const resolves = (n) => Q(`!!(App.officialBadges[${JSON.stringify(n)}] || App.officialBadges[String(${JSON.stringify(n)}).replace(/（[^）]*）/g,'').trim()])`);
  const missing = items.filter((n) => !resolves(n));
  const same = missing.length === PENDING.length && PENDING.every((n) => missing.includes(n)) && missing.every((n) => PENDING.includes(n));
  ok(same, `仍待補官方內容剛好 ${PENDING.length} 個（實際 ${missing.length}）`);
  PENDING.forEach((n) => ok(!resolves(n), `「${n}」仍未補 —— 補咗請由 PENDING 除名`));

  /* 官方綱要頁碼逐個核（之前 22 個係舊版頁碼） */
  const keys = Q("Object.keys(App.officialBadges)");
  const pageBad = keys.filter((k) => k in OFFICIAL_2026 && Q(`App.officialBadges[${JSON.stringify(k)}].page`) !== OFFICIAL_2026[k]);
  ok(pageBad.length === 0, `officialBadges 頁碼全部對得上官方2026目錄（唔啱：${pageBad.join("、") || "冇"}）`);

  /* 舊制章有自己嘅分組（App.legacyBadgeGroup），唔可以混入 badgeGroups() */
  const orphan = keys.filter((k) => !items.some((n) => n === k || norm(n) === k));
  const orphanOk = orphan.length === LEGACY.length && LEGACY.every((k) => orphan.includes(k));
  ok(orphanOk, `badgeGroups() 以外嘅內容剛好係 4 個舊制章（實際 ${orphan.length}：${orphan.join("、")}）`);
  LEGACY.forEach((k) => ok(!items.includes(k) && !items.some((n) => norm(n) === k), `舊制「${k}」冇混入 2026 組別`));

  const lg = Q("App.legacyBadgeGroup()");
  ok(lg.id === "legacy" && lg.items.length === LEGACY.length, `legacyBadgeGroup 有 ${lg.items.length} 個章`);
  ok(LEGACY.every((k) => lg.items.includes(k)), "legacyBadgeGroup 內容剛好係嗰 4 個舊制章");
  ok(!Q("App.badgeGroups()").some((g) => g.id === "legacy"), "badgeGroups() 唔包 legacy 組");

  /* 舊制章區必須摺埋（<details> 冇 open 屬性）先算合規格 */
  const sec = Q("App.legacySection()");
  ok(sec.startsWith("<details class=\"badge-legacy\">") && !sec.includes("<details class=\"badge-legacy\" open"),
     "舊制章區用 <details> 且預設收埋");
  LEGACY.forEach((k) => ok(sec.includes(k), `舊制章區列到「${k}」`));
  ok(sec.includes("2026 第十版"), "舊制章區講明 2026 目錄已無呢啲章");
  ok(Q("App.vBadge()").includes("App.legacySection") || Q("App.vBadge()").includes("badge-legacy"),
     "vBadge 有 render 舊制章區");

  /* 舊制章 modal 唔可以顯示「官方綱要頁」（2026 該頁係另一個章） */
  Q("Modal.open = function(h){ globalThis.__m = h; }");
  for (const k of LEGACY) {
    const spec = Q(`App.officialBadges[${JSON.stringify(k)}]`);
    ok(spec.legacy === true, `「${k}」標記為 legacy`);
    Q(`App.openBadge(${JSON.stringify(k)})`);
    ok(sb.__m.includes("舊制綱要頁 " + spec.page), `「${k}」顯示「舊制綱要頁 ${spec.page}」`);
    ok(!sb.__m.includes("官方綱要頁"), `「${k}」冇誤顯示「官方綱要頁」`);
    ok(sb.__m.includes("2026 第十版目錄已無此章"), `「${k}」有舊制警告`);
    ok(spec.legacyNote && spec.legacyNote.length > 5, `「${k}」有承接說明`);
    ok(sb.__m.includes("<h2>🎖️ " + k + "（舊制）</h2>"), `「${k}」modal 標題標明（舊制）`);
    ok(sb.__m.includes("內容來源：舊制《幼童軍訓練綱要》"), `「${k}」來源行係舊制版`);
    ok(!sb.__m.includes("官方內容來源"), `「${k}」唔會誤寫「官方內容來源：2026 第十版」`);
  }
  /* 現行章仍然顯示「官方綱要頁」，唔可以俾 legacy 分支污染 */
  Q("App.openBadge('露營章')");
  ok(sb.__m.includes("官方綱要頁 27") && !sb.__m.includes("舊制綱要頁"), "現行章仍然顯示「官方綱要頁」");
  ok(sb.__m.includes("<h2>🎖️ 露營章</h2>"), "現行章標題冇（舊制）標記");
  ok(sb.__m.includes("官方內容來源：《幼童軍訓練綱要》2026 年第十版第三章"), "現行章來源行係 2026 第十版");

  /* 括號後綴嘅官方全名都要開到真內容 */
  for (const n of ["音樂章（三級制度）","游泳章（三級制度章）","射箭章（三級制度）","田徑章（三級制度）","獨木舟章（三級制度）"]) {
    Q("Modal.open = function(h){ globalThis.__m = h; }");
    Q(`App.openBadge(${JSON.stringify(n)})`);
    ok(!sb.__m.includes("逐章內置"), `「${n}」開到真官方內容`);
  }
  /* 水上安全章：官方2026 係第34頁（舊制先係65頁） */
  const w = Q("App.officialBadges['水上安全章']");
  ok(w.page === 34, `水上安全章官方綱要頁 ${w.page}（34，2026第十版）`);
  ok(w.items.length === 3, `水上安全章 ${w.items.length} 項要求（官方原文3項）`);
  ok(w.purpose.startsWith("提升幼童軍的安全意識"), "水上安全章目的用官方原文（唔係舊版改寫）");
  ok(w.items[2].includes("手援") && w.items[2].includes("拋物") && w.items[2].includes("6 米"),
     "水上安全章第3項保留手援／拋物及 6 米距離");

  /* 新補嘅 10 個章：逐個核實質內容，唔係淨係核「有冇 key」 */
  const FILLED = {
    "手藝章":            { page:39, n:4, must:["鎚子","砂紙打磨"] },
    "資訊科技章":        { page:41, n:7, must:["人工智能","知識產權"] },
    "媒體製作章":        { page:43, n:6, must:["電子書","動畫短片"], rule:"其中兩項" },
    "地球部落計劃 – 走塑達人章、自然守護者章、日光善用者章": { page:52, n:3, must:["走塑達人章","日光善用者章"], note:"地球部落" },
    "公園定向章":        { page:60, n:3, must:["初級","拇指輔行法","等高線"], rule:"依次序", note:"同一事工" },
    "體適能章":          { page:62, n:5, must:["皮摺量度","坐地前伸"], note:"學校體適能獎勵計劃" },
    "風帆章":            { page:63, n:2, must:["游泳測試","滑浪風帆"], note:"最新課程" },
    "水手章":            { page:64, n:9, must:["訊號旗","8 字結","稱人結"] },
    "宗教章":            { page:68, n:6, must:["基督教課程","道教課程","五戒文"], rule:"其中一項課程" },
    "童軍先修章":        { page:70, n:3, must:["認知","參與","新體驗"], rule:"十歲半", note:"4.4.1" },
  };
  for (const [name, exp] of Object.entries(FILLED)) {
    const b = Q(`App.officialBadges[${JSON.stringify(name)}]`);
    ok(!!b, `「${name}」已有內容`);
    if (!b) continue;
    ok(b.page === exp.page, `「${name}」頁碼 ${b.page}（官方 ${exp.page}）`);
    ok(b.items.length === exp.n, `「${name}」${b.items.length} 項（官方 ${exp.n}）`);
    const all = b.purpose + b.items.join("") + (b.rule || "") + (b.note || "");
    exp.must.forEach((m) => ok(all.includes(m), `「${name}」內容含「${m}」`));
    if (exp.rule) ok((b.rule || "").includes(exp.rule), `「${name}」rule 含「${exp.rule}」`);
    if (exp.note) ok((b.note || "").includes(exp.note), `「${name}」note 含「${exp.note}」`);
  }

  /* 以下章 previously 係舊制改寫內容，已按官方 2026 原文重寫。
     釘住關鍵字眼，防止有人再用舊版內容覆蓋返。 */
  const REWRITTEN = {
    "共融章":      { n:4,  must:["多元共融","特能童軍"], notMust:["弱智"] },
    "家務章":      { n:8,  must:["清潔及整理一個房間"] },
    "道路安全章":  { n:8,  must:["過馬路守則","十種","海報"] },
    "香港歷史章":  { n:4,  must:["法定古蹟","博物館","命名背景和典故"] },
    "藝術章":      { n:8,  must:["賀卡","黏土","展示板"], rule:"其中三項", notMust:["數碼藝術"] },
    "娛樂章":      { n:10, must:["皮影戲","土風舞","五分鐘"], rule:"其中三項", notMust:["甲組"] },
    "語言章":      { n:5,  must:["公眾免費上網地點"] },
    "音樂章":      { n:3,  must:["ABRSM","獨奏","合奏"], notMust:["五線譜"] },
    "攝影章":      { n:4,  must:["記憶咭","變焦","保養相機","12 張"], notMust:["3分鐘"] },
    "寫作章":      { n:9,  must:["六行的詩","筆友"], note:"50 字" },
    "閱讀章":      { n:4,  must:["電子書","網上目錄"] },
    "田徑章":      { n:4,  must:["跳遠","跳高","擲豆袋","50米急跑","0.96米"], rule:"22 分", notMust:["仍待從官方"] },
    "運動章":      { n:5,  must:["基本規則","體育精神"] },
    "世界友誼章":  { n:4,  must:["四個月的時間","旗幟"] },
  };
  for (const [name, exp] of Object.entries(REWRITTEN)) {
    const b = Q(`App.officialBadges[${JSON.stringify(name)}]`);
    ok(!!b, `「${name}」有內容`);
    if (!b) continue;
    const all = b.purpose + b.items.join("") + (b.rule || "") + (b.note || "");
    ok(b.items.length === exp.n, `「${name}」${b.items.length} 項（官方2026 ${exp.n}）`);
    exp.must.forEach((m) => ok(all.includes(m), `「${name}」用官方2026字眼「${m}」`));
    (exp.notMust || []).forEach((m) => ok(!all.includes(m), `「${name}」已冇舊制字眼「${m}」`));
    if (exp.rule) ok((b.rule || "").includes(exp.rule), `「${name}」rule 含「${exp.rule}」`);
    if (exp.note) ok((b.note || "").includes(exp.note), `「${name}」note 含「${exp.note}」`);
  }
  /* 烹飪章 note 要包齊官方三條注意事項 */
  ok(Q("App.officialBadges['烹飪章'].note").includes("使用爐具安全指引"), "烹飪章 note 含「使用爐具安全指引」");

  /* 露營章／探險章／愛護動物章（官方頁27–29）：已逐字核對過原文。
     呢三個係核心範疇章，進度性獎章 4.1.3／4.1.4／4.2.5 直接引用，改錯影響大，釘死佢。 */
  const P27_29 = {
    "露營章": { page:27, n:8, first:"進行不少於一晚的戶外露營", last:"協助清理露營後的場地" },
    "探險章": { page:28, n:6, first:"明瞭地圖或街道圖上的主要圖例", last:"策劃及參加一次不少於六公里之幼童軍遠足活動" },
    "愛護動物章": { page:29, n:3, first:"向領袖講述動物的需要", last:"認識一種寵物的生命週期" },
  };
  for (const [name, exp] of Object.entries(P27_29)) {
    const b = Q(`App.officialBadges[${JSON.stringify(name)}]`);
    ok(!!b && b.page === exp.page, `「${name}」頁 ${b && b.page}（官方 ${exp.page}）`);
    ok(b.items.length === exp.n, `「${name}」${b.items.length} 項（官方 ${exp.n}）`);
    ok(b.items[0].startsWith(exp.first), `「${name}」首項同官方原文一致`);
    ok(b.items[exp.n - 1].startsWith(exp.last), `「${name}」末項同官方原文一致`);
  }

  /* rule 欄要真係 render 到，唔可以淨係存喺 data 度 */
  Q("Modal.open = function(h){ globalThis.__m = h; }");
  Q("App.openBadge('宗教章')");
  ok(sb.__m.includes("以下其中一項課程進行研習"), "宗教章 rule 有 render 到 modal");
  Q("App.openBadge('露營章')");
  ok(!sb.__m.includes("class=\"mut\">完成下列"), "冇 rule 嘅章唔會多出空段落");
}
/* officialBadges 唔可以有重複 key：JS 會用後者覆蓋前者，靜靜地丟走官方內容，
   parse 完嘅物件睇唔出，所以一定要掃原始碼 */
{
  const src = fs.readFileSync(path.join(root, "js/redesign.js"), "utf8");
  const ks = [...src.matchAll(/^    '([^']+章)':\{purpose/gm)].map((m) => m[1]);
  const dup = ks.filter((k, i) => ks.indexOf(k) !== i);
  ok(dup.length === 0, `冇重複 key（實際：${dup.join("、") || "冇"}）`);
}
/* PackPrint 張數 */
{
  const c = Q("PackPrint.count(curMeet())");
  ok(c.plan === 1 && c.divider === 1 && c.total === 2 + c.sheets, "打印張數＝1＋1＋圖紙 (" + c.total + ")");
}
/* 物資換算跟人數郁 */
{
  const a = Q("App.matList(12)"), b = Q("App.matList(36)");
  ok(a !== b, "改人數，物資數量會變");
}
/* Redesign routes, storage compatibility and preparation isolation. */
Q("App.prepare('c07')");
ok(Q("curTid()") === 'c07', '選擇集會保留正確ID（相容既有純文字儲存）');
ok(Q("Flow.cur().k") === 'print', '選集會直接開始印教材步驟');
Q("Flow.mark('print',true)");
ok(Q("Flow.cur().k") === 'bag', '完成一步推進下一步');
Q("App.prepare('c08')");
ok(!Q("Flow.isDone('print')"), '換集會清除上一場嚮導完成狀態');
Q("App.init()");
ok(Q("curTid()") === 'c08', '重新初始化不會重設為第一場');
for (const route of ['prep','sheets','play','skills','teams','tools']) {
  Q("location.hash='#" + route + "'; App.route()");
  ok(Q("App.tab") === route, '新路由可開啟：' + route);
}
/* 下方導覽五粒掣逐粒撳得開；#badge 開到 App.vBadge() */
for (const route of ['print','play','badge','jungle','tools']) {
  Q("location.hash='#" + route + "'; App.route()");
  ok(Q("App.tab") === route, '下方導覽開到：' + route);
}
ok(Q("App.vBadge()").includes('活動章工具書'), '#badge 開到 App.vBadge() 活動章工具書');
ok(Q("App.vBadge()").includes('badge-group-grid'), '活動章頁有官方組別分類');
/* 舊 #song / #songs 唔再有自己嘅主導覽掣：一律轉入「工作紙＋歌曲」合併頁 */
for (const legacy of ['song','songs','craft']) {
  Q("location.hash='#" + legacy + "'; App.route()");
  ok(Q("App.tab") === 'print', '舊 #' + legacy + ' 轉入工作紙＋歌曲頁');
}
{
  const p = Q("App.vPrint()");
  ok(p.includes('工作紙＋歌曲'), '合併頁標題係「工作紙＋歌曲」');
  ok(p.includes("App.showMiniTab(this,'worksheets')") && p.includes("App.showMiniTab(this,'songs')"), '合併頁有工作紙／歌曲兩個小分頁掣');
  ok(p.includes('id="mini-worksheets"') && p.includes('id="mini-songs"'), '兩個小分頁內容區都存在');
  ok(Q("App.vSongs()") === p && Q("App.vSong()") === p, '舊歌頁函數同一個合併頁（唔會開到孤兒版）');
}
for (const expr of ['App.vPrep()', 'App.vSheets()', 'App.vLibrary(true)', 'App.vLibrary(false)', 'App.vTools(true)', 'App.vTools(false)']) {
  ok(Q(expr).length > 100, '新頁面有內容：' + expr);
}
Q("App.activity('c01',0)");
ok(Q("curTid()") === 'c08', '即用活動不會改動今場集會');
Q("Tools.reset()");
ok(Q("Tools.time()") === '05:00', '倒數預設五分鐘');
console.log(fail === 0 ? "\nRUNTIME PASS" : `\nRUNTIME FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
