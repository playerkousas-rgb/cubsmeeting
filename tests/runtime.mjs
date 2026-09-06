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
for (const f of ["js/data.js", "js/guide.js", "js/flow.js", "js/app.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sb, { filename: f });
}
const Q = (s) => vm.runInContext(s, sb);

ok(Q("DATA.meetings.length") >= 22, "載入 22 場集會");
Q("Store.set('tid','c07'); try{localStorage.setItem('cub_tid','c07')}catch(e){}");

const pages = [
  ["vPlan", "App.vPlan()", ["年度行事曆", "睇最新通告同活動", "帶我由頭做到尾", "獎章路線圖"]],
  ["vMeetList", "App.vMeetList()", ["集會範本庫"]],
  ["vMeetDetail", "App.vMeetDetail(curMeet())", ["照讀一句", "自動加總", "家長通知", "複製去WhatsApp"]],
  ["vPack", "App.vPack()", ["一撳印齊", "只印三樣", "預設印"]],
  ["vLead", "App.vLead()", ["投影帶領", "全螢幕帶領", "抽籤點名"]],
  ["vTrack", "App.vTrack()", ["開進度追蹤APP記獎章", "記出席"]],
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
  const html = Q("App.vTrack()") + Q("App.vBook()") + Q("App.vPlan()");
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
console.log(fail === 0 ? "\nRUNTIME PASS" : `\nRUNTIME FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
