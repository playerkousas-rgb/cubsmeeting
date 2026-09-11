/* smoke：數據完整性 — 每場時間加總啱、有圖有口令、打印張數公式 */
import fs from "fs";
import vm from "vm";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (f) => {
  const code = fs.readFileSync(path.join(root, f), "utf8") + (f === "js/data.js" ? "\n" + fs.readFileSync(path.join(root, "js/jungle-data.js"), "utf8") : "");
  const sb = {};
  vm.createContext(sb);
  vm.runInContext(code + "\nthis.__out={DATA:typeof DATA!=='undefined'?DATA:undefined,EXTERNAL:typeof EXTERNAL!=='undefined'?EXTERNAL:undefined,Guide:typeof Guide!=='undefined'?Guide:undefined,Flow:typeof Flow!=='undefined'?Flow:undefined};", sb);
  return sb.__out;
};

let fail = 0;
const ok = (c, msg) => { console.log((c ? "✓ " : "✗ FAIL ") + msg); if (!c) fail++; };

const d = load("js/data.js");
const g = load("js/guide.js");
const fl = load("js/flow.js");

/* 1. 22場 */
ok(d.DATA.meetings.length >= 22, `集會 ${d.DATA.meetings.length} 場（要約22場）`);
/* 2. 每場時間自動加總啱 */
d.DATA.meetings.forEach((m) => {
  const sum = m.segs.reduce((a, s) => a + (s.m || 0), 0);
  ok(sum === m.mins, `${m.tid} 時間加總 ${sum}=${m.mins} ${sum === m.mins ? "啱" : "錯"}`);
});
/* 3. 每個活動有圖有口令 */
d.DATA.meetings.forEach((m) => {
  m.segs.forEach((s) => {
    const hasImg = !!(s.svg || s.ic);
    const hasSay = !!(s.script && s.script.length >= 4);
    ok(hasImg && hasSay, `${m.tid}「${s.n}」有圖(${hasImg})有口令(${hasSay})`);
    ok(!!(s.rhythm && s.rhythm.length >= 4), `${m.tid}「${s.n}」有節奏`);
    ok(!!(s.safety && s.safety.length >= 4), `${m.tid}「${s.n}」有安全提示`);
  });
});
/* 4. Guide兜底：每個活動經Guide.forStage都有圖解口令節奏安全 */
{
  const ctx = {};
  vm.createContext(ctx);
  const gc = fs.readFileSync(path.join(root, "js/guide.js"), "utf8");
  vm.runInContext(gc, ctx);
  d.DATA.meetings.forEach((m) => m.segs.forEach((s) => {
    const r = ctx.Guide.forStage(s);
    ok(!!(r && r.say && r.lead && r.steps && r.steps.length >= 3 && r.safety), `${m.tid}「${s.n}」領袖卡齊（口令/帶法/3步/安全）`);
  }));
}
/* 5. 打印張數＝教案＋分隔頁＋圖紙 */
{
  const appCode = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  const ctx2 = { DATA: d.DATA };
  vm.createContext(ctx2);
  // 抽 PackPrint.count 公式
  const m = d.DATA.meetings[0];
  const expect = 2 + m.sheets.length;
  ok(/plan:\s*1/.test(appCode) && /divider:\s*1/.test(appCode) && /sheets:\s*m\.sheets\.length/.test(appCode), `打印公式 教案1＋分隔頁1＋圖紙N（例：${m.tid} 圖紙${m.sheets.length}，一疊過${expect}款）`);
  ok(/total:\s*2\s*\+\s*m\.sheets\.length/.test(appCode), `打印總數 total=2+圖紙數`);
}
/* 6. 獎章路線齊 */
{
  const names = d.DATA.badges.map((b) => b.n).join("");
  ["會員章", "幼童軍體驗章", "幼童軍歷奇章", "幼童軍高級歷奇章", "金紫荊", "活動徽章"].forEach((k) => ok(names.includes(k), `獎章路線有「${k}」`));
}
/* 7. 幼童軍傳統齊 */
{
  const facts = JSON.stringify(d.DATA.facts);
  ["準備", "Akela", "小隊", "大聲呼叫", "Grand Howl", "會操"].forEach((k) => ok(facts.includes(k) || (d.DATA.meetings.some((m) => JSON.stringify(m).includes(k))), `傳統有「${k}」`));
}

console.log(fail === 0 ? "\nSMOKE PASS" : `\nSMOKE FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
