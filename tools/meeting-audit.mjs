/* meeting-audit：逐場列出「未夠統一」嘅欄位，方便一次過替其餘集會補齊。
   用法：
     node tools/meeting-audit.mjs            # 只列出有缺漏嘅場
     node tools/meeting-audit.mjs --all      # 全部場次逐場列出
     node tools/meeting-audit.mjs --strict   # 有任何缺漏即以 exit 1 結束（可放入 CI）
   只讀取資料，不寫入任何檔案、不連網。 */
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const args = new Set(process.argv.slice(2));

/* ---- 同 index.html 一樣次序載入；DOM 用最小 stub，只求資料層跑得起 ---- */
const element = () => ({
  innerHTML: "", className: "", style: {}, value: "", checked: false, textContent: "", dataset: {},
  classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
  setAttribute() {}, removeAttribute() {}, hasAttribute() { return false; },
  querySelector() { return null; }, querySelectorAll() { return []; }, focus() {},
  insertAdjacentHTML() {}, appendChild() {}, closest() { return null; },
});
const mem = {};
const els = {};
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
  setTimeout, clearTimeout, setInterval, clearInterval,
  confirm: () => true, prompt: () => "x", scrollTo() {}, open() {}, alert() {},
};
sb.addEventListener = () => {}; sb.window = sb; sb.globalThis = sb;
vm.createContext(sb);
for (const f of ["data", "jungle-data", "practical-data", "guide", "flow", "app", "redesign", "content", "jungle", "practical", "uniform-ceremony", "field-visuals", "salute-lab", "salute-positions", "tracking-kit", "material-desk", "plain-content", "worksheet-guides", "exam-papers", "skill-art", "craft-sheets", "songbook"]) {
  vm.runInContext(read(`js/${f}.js`), sb, { filename: `js/${f}.js` });
}
const DATA = vm.runInContext("DATA", sb);
const Plain = vm.runInContext("typeof PlainContent!=='undefined'?PlainContent:null", sb);

const has = (v) => typeof v === "string" ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : !!v;

/* 每場應有嘅欄位同最低要求。改得嚴會令現有內容大批失敗，所以只檢查「空／缺」同結構。 */
function audit(m, i) {
  const miss = [];
  const need = { n: "場名", month: "月份", badge: "範疇／章別", refs: "綱要出處", goal: "學習目標", evidence: "觀察重點", gap: "未涵蓋聲明", venue: "設場", notice: "家長通知" };
  for (const k in need) if (!has(m[k])) miss.push(`缺 ${need[k]}（${k}）`);
  if (!has(m.adapt && m.adapt.easy) || !has(m.adapt && m.adapt.hard)) miss.push("缺 簡化／加深版（adapt.easy／hard)");
  if (!has(m.bag) || (Array.isArray(m.bag) && m.bag.length < 3)) miss.push("物資清單過短（bag）");
  if (!has(m.worksheet && m.worksheet.title)) miss.push("缺 工作紙標題（worksheet.title）");
  const prompts = (m.worksheet && m.worksheet.prompts) || [];
  if (prompts.length < 3) miss.push(`工作紙得 ${prompts.length} 題（建議 ≥3）`);

  const segs = m.segs || [];
  if (segs.length < 4) miss.push(`只 ${segs.length} 節（建議 4–6 節）`);
  const sum = segs.reduce((a, s) => a + (Number(s.m) || 0), 0);
  if (Number(m.mins) !== sum) miss.push(`時間不符：標示 ${m.mins} 分鐘，逐節加總 ${sum} 分鐘`);
  segs.forEach((s, k) => {
    const tag = `第${k + 1}節「${String(s.n || "?").slice(0, 10)}」`;
    if (!has(s.n)) miss.push(`${tag} 缺名`);
    if (!(Number(s.m) > 0)) miss.push(`${tag} 缺時長`);
    if (!Array.isArray(s.steps) || s.steps.length < 2) miss.push(`${tag} 步驟少於 2 步`);
    if (!has(s.script)) miss.push(`${tag} 缺帶領對白（script）`);
    if (!has(s.safety)) miss.push(`${tag} 缺安全提醒（safety）`);
    if (!has(s.watch)) miss.push(`${tag} 缺觀察重點（watch）`);
    if (!has(s.rhythm)) miss.push(`${tag} 缺節奏（rhythm）`);
    if (!has(s.how)) miss.push(`${tag} 缺 how 摘要（steps 自動生成）`);
    /* 同 PlainContent.apply() 一致：第一節同最後一節用共用文字，中間各節由 copy.steps 逐一提供。 */
    const plain = Plain && Plain.lessons && Plain.lessons[m.tid];
    const mid = k > 0 && k < segs.length - 1;
    if (mid && !(plain && plain.steps && plain.steps[k - 1])) miss.push(`${tag} 缺口語版（js/plain-content.js）`);
    if (!mid && !m.practical) miss.push(`${tag} 缺實戰包（practical），共用文字唔會套用`);
  });

  const p = m.practical;
  if (!p) miss.push("缺實戰帶領包（practical）");
  else {
    ["opening", "distribute", "confused", "quiet", "few", "missing", "short"].forEach((k) => { if (!has(p[k])) miss.push(`實戰包缺 ${k}`); });
    if (!Array.isArray(p.qa) || p.qa.length < 2) miss.push(`實戰包問答得 ${(p.qa || []).length} 條（建議 ≥2）`);
    if (!has(p.sourceNote)) miss.push("實戰包缺來源說明（sourceNote）");
  }
  return miss;
}

const rows = DATA.meetings.map((m, i) => ({ tid: m.tid, n: m.n, miss: audit(m, i) }));
const bad = rows.filter((r) => r.miss.length);
if (args.has("--all")) rows.forEach((r) => console.log(`${r.tid} ${r.n}：${r.miss.length ? "\n  - " + r.miss.join("\n  - ") : "✓ 齊全"}`));
else bad.forEach((r) => console.log(`${r.tid} ${r.n}：\n  - ${r.miss.join("\n  - ")}`));

console.log("");
console.log(`共 ${rows.length} 場；${bad.length ? `有 ${bad.length} 場未夠統一` : "全部場次欄位齊全"}`);
const fields = new Map();
bad.forEach((r) => r.miss.forEach((x) => { const k = x.replace(/第\d+節「[^」]*」/, "逐節").replace(/\d+/g, "N"); fields.set(k, (fields.get(k) || 0) + 1); }));
if (fields.size) {
  console.log("最常見缺漏（頂 10）：");
  [...fields.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => console.log(`  ${v} 場 — ${k}`));
}
if (args.has("--strict") && bad.length) process.exit(1);
