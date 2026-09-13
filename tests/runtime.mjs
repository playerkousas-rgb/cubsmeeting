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
