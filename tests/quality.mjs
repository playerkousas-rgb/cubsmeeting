/* quality：把「三重身份評分」的改善逐項變成棘輪，防止日後改返舊樣。
   1) 集會目錄篩選＋「繼續上次」卡
   2) Service Worker 安裝包瘦身（ASSETS 細、其餘靠背景補齊）
   3) 活動頁關鍵字搜尋＋分批載入
   4) 手冊教材分頁延遲 render
   5) 集會詳情次要區塊收埋（列印時會自動打開）
   6) 新手詞彙表、統一路由（唔再各自 override App.route） */
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
let fail = 0;
const ok = (c, msg) => { console.log((c ? "✓ " : "✗ FAIL ") + msg); if (!c) fail++; };

/* ---- 真頁面用的最小 DOM ---- */
const mem = {}, els = {};
const element = () => ({
  innerHTML: "", className: "", style: {}, value: "", checked: false, textContent: "",
  dataset: {}, classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
  setAttribute() {}, removeAttribute() {}, hasAttribute() { return false; },
  querySelector() { return null; }, querySelectorAll() { return []; }, focus() {},
  insertAdjacentHTML() {}, appendChild() {}, closest() { return null; },
});
const sb = {
  console,
  localStorage: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } },
  location: { hash: "#plan", href: "" },
  navigator: { onLine: true },
  document: {
    getElementById: (id) => (els[id] ? els[id] : (els[id] = element())),
    createElement: element, querySelectorAll: () => [], querySelector: () => null,
    body: element(), documentElement: element(), addEventListener() {},
  },
  setTimeout, clearTimeout, setInterval, clearInterval, confirm: () => true, prompt: () => "x",
  scrollTo() {}, open() {}, alert() {},
};
sb.addEventListener = () => {}; sb.window = sb; sb.globalThis = sb;
vm.createContext(sb);
for (const f of ["data", "jungle-data", "practical-data", "guide", "flow", "app", "redesign", "content", "jungle", "practical", "uniform-ceremony", "field-visuals", "salute-lab", "salute-positions", "tracking-kit", "material-desk", "plain-content", "worksheet-guides", "exam-papers", "skill-art", "craft-sheets", "songbook"]) {
  vm.runInContext(read(`js/${f}.js`), sb, { filename: `js/${f}.js` });
}
const Q = (s) => vm.runInContext(s, sb);

/* 1. 集會目錄：篩選 + 繼續上次 */
{
  const plan = Q("App.vPlan()");
  ok(/plan-filter/.test(plan), "集會目錄有篩選列");
  ["全部", "未做", "已完成", "本月"].forEach((k) => ok(plan.includes(k), `篩選有「${k}」`));
  ok(/App\.setPlanFilter/.test(plan), "篩選掣呼叫 App.setPlanFilter");
  ok(/resume-card/.test(plan), "首頁有「繼續上次」卡");
  ok(plan.includes("App.resumeCard") || plan.includes("resume-title"), "續帶卡有場名");
  Q("App.setPlanFilter('done')");
  ok(Q("App.planFilter") === "done", "setPlanFilter 記住狀態");
  Q("App.setPlanFilter('bad-value')");
  ok(Q("App.planFilter") === "all", "無效篩選值回落『全部』");
  Q("App.setPlanFilter('all')");
}

/* 2. Service Worker：安裝包細、其餘背景補齊 */
{
  const sw = read("sw.js");
  const assets = (sw.match(/var ASSETS = \[([\s\S]*?)\];/) || ["", ""])[1];
  const extra = (sw.match(/var EXTRA = \[([\s\S]*?)\];/) || ["", ""])[1];
  const count = (b) => (b.match(/\.\//g) || []).length;
  ok(assets.length > 0, "sw.js 有 ASSETS 清單");
  ok(extra.length > 0, "sw.js 有 EXTRA 清單（背景補齊）");
  ok(count(assets) <= 40, `安裝包只預載 ${count(assets)} 個檔案（≤40）`);
  ok(count(extra) > 50, `背景補齊 ${count(extra)} 個檔案`);
  ok(/CACHE_EXTRA/.test(sw) && /function cacheExtra/.test(sw), "收到 CACHE_EXTRA 訊息才補齊大圖");
  ok(read("index.html").includes("CACHE_EXTRA"), "頁面會請 Service Worker 背景補齊");
  ok(/destination === "image"/.test(sw), "圖片失敗回 404，唔會回 index.html");
  ok(!/assets\/jungle\/(audio|ambience)\//.test(assets), "語音／環境音仍然唔入安裝包");
}

/* 3. 活動頁：搜尋 + 分批 */
{
  const lib = Q("App.vLibrary(false)");
  ok(lib.includes('id="libsearch"'), "活動頁有關鍵字搜尋框");
  ok(/App\.libSearch/.test(lib), "搜尋框接去 App.libSearch");
  ok(/lib-more/.test(lib), "有「睇多啲」分批載入");
  ok(Q("App.libraryList('activity').length") > Q("App.LIB_STEP"), "活動卡總數多於一批");
  const step = (Q("App.librarySlice('activity',0)").match(/lib-card/g) || []).length;
  const all = (Q("App.libraryCards('activity')").match(/lib-card/g) || []).length;
  ok(step === Q("App.LIB_STEP"), `首次只出 ${step} 張（一批）`);
  ok(all > step, `全部 ${all} 張，其餘靠『睇多啲』`);
  const hit = Q("App.matchLibrary('skill','繩')");
  ok(hit.length > 0 && hit.length < Q("App.libraryList('skill').length"), "搜尋『繩』只出相關技能卡");
  ok(Q("App.matchLibrary('activity','')").length === Q("App.LIB_STEP"), "清空搜尋回到一批");
  ok(/data-kw="/.test(Q("App.libraryCards('activity')")), "每張卡有 data-kw 供搜尋");
}

/* 4. 手冊：教材分頁延遲 render */
{
  const book = Q("App.vBook()");
  const panels = (book.match(/booktool-panel/g) || []).length;
  const pending = (book.match(/data-pending="1"/g) || []).length;
  ok(panels > 1, `手冊有 ${panels} 個教材分頁`);
  ok(pending >= panels - 1, `除第一個外 ${pending} 個分頁延遲生成`);
  ok(book.includes("glossary-list"), "手冊有新手詞彙表");
  ok(Q("App.GLOSSARY.length") >= 8, `詞彙表有 ${Q("App.GLOSSARY.length")} 個名詞`);
}

/* 5. 集會詳情：次要區塊收埋，列印會自動打開 */
{
  const html = Q("App.vMeetDetail(curMeet())");
  ok(/details class="card meet-more"/.test(html), "物資／家長通知收成 details");
  ok(/details class='seg-lead'/.test(html), "領袖卡收成 details");
  ok(!/details class="card meet-more"[^>]*\sopen/.test(html), "次要區塊預設唔打開");
  const app = read("js/app.js");
  ok(/details:not\(\[open\]\)/.test(app), "列印前會打開所有 details");
  ok(/PrintScope\._closed/.test(app), "列印後會還原原本收埋狀態");
}

/* 6. 統一路由：唔再各自 override App.route */
{
  for (const f of ["js/jungle.js", "js/uniform-ceremony.js", "js/field-visuals.js", "js/practical.js", "js/content.js"]) {
    ok(!/App\.route\s*=/.test(read(f)), `${f} 唔再自己 override App.route`);
  }
  ok(/App\.route\s*=\s*function/.test(read("js/redesign.js")), "路由集中在 redesign.js");
  ok(read("js/redesign.js").includes("aria-current"), "統一路由負責 aria-current");
  Q("location.hash='#meet'; App.route()");
  ok(Q("App.tab") === "meet", "#meet 無 tid 仍然有頁可出（回目錄）");
}

/* 7. 模組擴充鏈：一律經 App.wrap／App.wrapOn 登記，唔再各自覆寫 */
{
  ok(Q("typeof App.wrap") === "function", "有 App.wrap 擴充登記處");
  ok(Q("typeof App.wrapOn") === "function", "有 App.wrapOn（其他模組方法用）");
  const chain = Q("JSON.stringify(App._wrapChain)");
  const want = { vPrep: 2, vMeetDetail: 3, vLead: 3, activity: 4, vPack: 1, "Practical.summary": 2, "SessionPack.build": 2 };
  for (const k in want) {
    const got = Q(`App._wrapChain[${JSON.stringify(k)}] || 0`);
    ok(got === want[k], `${k} 疊加 ${got} 層（預期 ${want[k]}）`);
  }
  /* 直接覆寫只准兩個檔案：app.js 物件字面（基礎）同 content.js（基礎實作，wrap 由其他檔疊上）。 */
  const names = ["vLead", "vPack", "vMeetDetail", "vPrep", "activity"];
  const offenders = [];
  for (const f of fs.readdirSync(path.join(root, "js")).filter((x) => x.endsWith(".js"))) {
    const src = read(`js/${f}`);
    for (const n of names) {
      const re = new RegExp(`App\\.${n}\\s*=\\s*function`, "g");
      const hits = (src.match(re) || []).length;
      if (!hits) continue;
      /* 允許：app.js 物件字面（原有基礎）、redesign.js 嘅 vPrep（外殼基礎）、
         content.js 嘅 vPack／activity（基礎實作，之後由其他檔以 wrap 疊上）。 */
      if (f === "app.js") continue;
      if (f === "redesign.js" && n === "vPrep") continue;
      if (f === "content.js" && (n === "vPack" || n === "activity")) continue;
      offenders.push(`${f}:${n}×${hits}`);
    }
  }
  ok(offenders.length === 0, `無檔案私自覆寫頁面函式${offenders.length ? "：" + offenders.join("、") : ""}`);
  ok(Q("App.vLead()").includes("投影帶領"), "疊加後仍出投影帶領卡");
  ok(Q("App.vPack()").length > 200, "疊加後仍出出隊包頁");
}

/* 8. 每頁一個 h1：頁面層標題唔可以係 h2 */
{
  const pages = {
    "集會目錄": "App.vPlan()", "手冊": "App.vBook()", "活動": "App.vLibrary(false)", "技能": "App.vLibrary(true)",
    "制服": "App.vUniform()", "典禮": "App.vCeremony()", "準備": "App.vPrep()",
    "出隊包": "App.vPack()", "投影帶領": "App.vLead()", "活動章": "App.vBadge()",
    "森林故事": "Jungle.view()", "集會詳情": "App.vMeetDetail(curMeet())", "試卷": "App.vSheets()",
  };
  for (const k in pages) {
    let html = "";
    try { html = Q(pages[k]); } catch (e) { html = ""; }
    const n = (html.match(/<h1[\s>]/g) || []).length;
    ok(n === 1, `${k} 有 ${n} 個 h1`);
  }
}

/* 9. 每場集會骨幹一致：時間加總、步驟／對白／安全／觀察齊、口語版、實戰包
   例外：c14 中間一節刻意 nil（保留森林故事原文）；c26／c27 後期加入，實戰包待補。 */
{
  const meetings = Q("DATA.meetings");
  ok(meetings.length >= 25, `場次 ${meetings.length} 場`);
  const noPractical = new Set(["c26", "c27"]);
  const keepOriginal = new Set(["c14"]); /* 中間某節保留原文 */
  const bad = [];
  meetings.forEach((m) => {
    const segs = m.segs || [];
    const sum = segs.reduce((a, x) => a + (Number(x.m) || 0), 0);
    if (Number(m.mins) !== sum) bad.push(`${m.tid} 時間 ${m.mins}≠${sum}`);
    if (segs.length < 4) bad.push(`${m.tid} 只有 ${segs.length} 節`);
    segs.forEach((x, k) => {
      if (!x.script || !x.safety || !x.watch || !x.rhythm) bad.push(`${m.tid}#${k + 1} 缺 script／safety／watch／rhythm`);
      if (!x.steps || x.steps.length < 2) bad.push(`${m.tid}#${k + 1} 步驟少於 2 步`);
    });
    if (!m.gap) bad.push(`${m.tid} 未寫「本場不涵蓋」`);
    if (!m.worksheet || !m.worksheet.prompts || m.worksheet.prompts.length < 3) bad.push(`${m.tid} 工作紙少於 3 題`);
    if (noPractical.has(m.tid)) return;
    ["opening", "distribute", "confused", "quiet", "few", "missing", "short"].forEach((k) => {
      if (!m.practical || !m.practical[k]) bad.push(`${m.tid} 實戰包缺 ${k}`);
    });
    if (m.practical && (!m.practical.qa || m.practical.qa.length < 2)) bad.push(`${m.tid} 實戰問答少於 2 條`);
    if (!keepOriginal.has(m.tid)) {
      const plain = Q(`(PlainContent.lessons[${JSON.stringify(m.tid)}]||{}).steps||[]`);
      for (let k = 1; k < segs.length - 1; k++) if (!plain[k - 1]) bad.push(`${m.tid}#${k + 1} 缺口語版`);
    }
  });
  ok(bad.length === 0, `27 場骨幹一致${bad.length ? "：" + bad.slice(0, 4).join("、") : ""}`);
  ok(Q("typeof PlainContent.apply") === "function", "口語版有統一 apply()");
  ok(!/m\.segs\[4\]/.test(read("js/plain-content.js")), "口語版唔再用硬編碼第 5 節（節數一變就錯位）");
}

/* 10. 訓練綱要一律直開官方文件（Drive），唔再要人喺官網再撳幾層 */
{
  const DRIVE = "https://drive.google.com/file/d/19StE5sobEUb8DOSkW0e57T0j784S6-R5/view";
  const html = read("index.html");
  const nav = (html.match(/<a href="([^"]+)"[^>]*data-tab="scheme"[^>]*>/) || [])[1] || "";
  ok(nav === DRIVE, `底部導覽「訓練綱要」直開官方文件（${nav.slice(0, 46)}…）`);
  ok(/target="_blank"/.test(html.match(/<a href="[^"]*"[^>]*data-tab="scheme"[^>]*>/)[0]) && /rel="noopener"/.test(html.match(/<a href="[^"]*"[^>]*data-tab="scheme"[^>]*>/)[0]), "新分頁＋noopener");
  ok(Q("App.vPlan()").includes(DRIVE), "集會目錄的綱要掣直開官方文件");
  ok(Q("App.vBook()").includes(DRIVE), "手冊的綱要連結直開官方文件");
  ok(Q("Uniform.schemeLinks()").includes(DRIVE), "制服頁的綱要掣直開官方文件");
  ok(Q("DATA.source.url") === DRIVE, "全站來源 DATA.source.url 指向官方文件");
  ok(!/<a href="https:\/\/prog\.scouting\.org\.hk\/cub\/training-scheme\/"[^>]*data-tab="scheme"/.test(html), "底部導覽唔再落官網首頁");
}

/* 11. 「真實場合參考」相片已移除（童軍支部大會操，對幼童軍帶領冇用） */
{
  const cer = Q("App.vCeremony()");
  ok(!cer.includes("真實場合參考"), "儀式頁冇「真實場合參考」卡");
  ok(!cer.includes("rally-flag-party"), "儀式頁冇大會操相片");
  ok(!fs.existsSync(path.join(root, "assets/reference/rally-flag-party-2025.avif")), "相片檔已刪");
  ok(!read("sw.js").includes("rally-flag-party"), "預快取唔再載入該相片");
  ok(Q("FieldVisuals.official.length") === 2, "官方圖只剩兩張位置圖");
}

console.log(fail === 0 ? "\nQUALITY PASS" : `\nQUALITY FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
