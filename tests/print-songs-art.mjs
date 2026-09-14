/* print-songs-art：2026-09-14 三項用戶回饋嘅回歸測試
   1) 列印隔离：點哪項印哪項（body.print-pack 只出 #printarea；冇預覽就唔印彈窗）。
   2) 工作紙＋歌曲實裝：27張工作紙逐張可印＋領袖參考；歌曲有跟唱卡同A4歌紙，冇死掣 toast。
   3) 活動／技能圖解：每個對映鍵都有真實節、SVG 齊開齊埋、附自繪聲明；可單印一張圖解卡。 */
import fs from "fs";
import vm from "vm";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let fail = 0;
const ok = (c, msg) => { console.log((c ? "✓ " : "✗ FAIL ") + msg); if (!c) fail++; };

const mem = {};
const el = () => ({ innerHTML: "", className: "", style: {}, textContent: "", value: "", href: "", dataset: {}, appendChild() {}, setAttribute() {}, removeAttribute() {}, insertAdjacentHTML() {}, querySelector: () => null, querySelectorAll: () => [], closest: () => null });
const sb = {
  console,
  localStorage: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; }, clear: () => { for (const k in mem) delete mem[k]; } },
  location: { hash: "#plan", href: "" },
  navigator: { onLine: true },
  document: { getElementById: () => el(), createElement: () => el(), querySelectorAll: () => [], querySelector: () => null, body: { ...el(), classList: { toggle() {}, add() {}, remove() {} } }, documentElement: el(), addEventListener() {}, fonts: {} },
  window: {}, addEventListener() {}, scrollTo() {}, confirm: () => true, setTimeout, clearTimeout, setInterval, clearInterval,
};
sb.window = sb; sb.globalThis = sb;
vm.createContext(sb);
for (const f of ["js/data.js", "js/jungle-data.js", "js/practical-data.js", "js/guide.js", "js/flow.js", "js/app.js", "js/redesign.js", "js/content.js", "js/jungle.js", "js/practical.js", "js/uniform-ceremony.js", "js/field-visuals.js", "js/salute-lab.js", "js/salute-positions.js", "js/tracking-kit.js", "js/material-desk.js", "js/plain-content.js", "js/worksheet-guides.js", "js/skill-art.js", "js/songbook.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sb, { filename: f });
}
const Q = (s) => vm.runInContext(s, sb);

/* 1. 列印隔离 CSS */
{
  const css = fs.readFileSync(path.join(root, "css/app.css"), "utf8");
  ok(/body\.print-pack #app[\s\S]{0,200}display: none !important/.test(css), "print-pack 時背後 #app 唔出紙");
  ok(/body\.print-pack #modal \.modal-content > \*:not\(#printarea\)\s*\{\s*display: none !important/.test(css), "print-pack 時彈窗只留 #printarea（標題／說明／掣唔出紙）");
  ok(/body:not\(\.print-pack\):not\(\.modal-open\) #modal\s*\{\s*display: none !important/.test(css), "冇彈窗冇預覽直接列印時彈窗唔出紙（只印當前畫面）");
  ok(/body\.print-pack #modal \.mx\s*\{\s*display: none !important/.test(css), "列印時收埋彈窗關閉掣");
  /* 第二層：開咗活動卡／任何彈窗而未開預覽 → 只印彈窗嗰項，背後清單（A–H）唔出紙 */
  ok(/body\.modal-open:not\(\.print-pack\) #app[\s\S]{0,220}display: none !important/.test(css), "modal-open 列印時背後 #app（成頁清單）唔出紙");
  ok(/body\.modal-open:not\(\.print-pack\) #modal \.modal-content\s*\{/.test(css), "modal-open 列印時出彈窗內容");
  ok(/body\.modal-open:not\(\.print-pack\) #modal button[\s\S]{0,80}display: none !important/.test(css), "modal-open 列印時收埋彈窗內嘅掣");
  const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  ok(/classList\.add\("modal-open"\)/.test(app) && /classList\.remove\("modal-open"\)/.test(app), "Modal.open/close 維護 body.modal-open");
  ok(/addEventListener\("beforeprint"/.test(app) && /addEventListener\("afterprint"/.test(app), "beforeprint 暫開 details、afterprint 還原");
}

/* 2. 工作紙＋歌曲實裝 */
{
  const p = Q("App.vPrint()");
  const sheets = (p.match(/預覽及列印呢張/g) || []).length;
  ok(sheets === 27, `工作紙分頁有27張逐張列印鈕（實際 ${sheets}）`);
  ok((p.match(/領袖參考答案與提示/g) || []).length === 25, "25場實戰集會的工作紙附領袖參考鈕");
  ok(p.includes('id="mini-songs"') && p.includes("Songbook.open("), "歌曲分頁係真實歌卡（Songbook.open）");
  ok(!/onclick="toast\('🎵|onclick="toast\('📣|onclick="toast\('🔥/.test(p), "歌曲分頁冇再用死掣 toast 扮實裝");
  ok(Q("App.vSongs()") === p && Q("App.vSong()") === p, "舊 #songs／#song 路由仍指同一合併頁");
  ok(Q("typeof Content!=='undefined' && typeof Content.worksheetIndex==='function'"), "Content.worksheetIndex 存在（#print 同 #sheets 共用單一來源）");
  ok(Q("Content.worksheetIndex()").includes("預覽及列印呢張") && !Q("Content.worksheetIndex()").includes("教材工作台"), "工作紙分頁唔疊教材工作台面板（面板留喺手冊）");
}

/* 3. Songbook 內容與界線 */
{
  const songs = Q("Songbook.songs");
  ok(songs.length >= 6, `歌曲／口號 ${songs.length} 首（≥6）`);
  songs.forEach((s) => {
    ok(Array.isArray(s.lines) && s.lines.length >= 4 && s.lines.every((l) => ["領", "眾", "合"].includes(l[0]) && l[1]), `${s.id} 每句有領／眾／合標記`);
    ok(!!s.tune && !!s.use && Array.isArray(s.lead) && s.lead.length >= 1 && !!s.actions, `${s.id} 有旋律來源／用途／動作／帶法`);
    ok(s.kind === "traditional" || s.kind === "original", `${s.id} 類別明確（${s.kind}）`);
  });
  ok(songs.some((s) => s.kind === "original" && /自編/.test(s.tune)), "自編口號標明「自編」，唔冒充官方");
  ok(songs.filter((s) => s.kind === "traditional").every((s) => /公有領域|流通/.test(s.tune)), "傳統歌標明公有領域／流通版本");
  songs.forEach((s) => {
    const sh = Q(`Songbook.sheet('${s.id}')`);
    ok(sh.includes('class="psheet song-sheet"') && sh.includes("p-foot"), `${s.id} A4歌紙含版面同來源腳註`);
  });
  ok((Q("Songbook.songs.map(function(s){return Songbook.sheet(s.id);}).join('')").match(/class="psheet song-sheet"/g) || []).length === songs.length, "印今晚歌單＝每首一張");
  ok(Q("Songbook.formal").length === 3 && Q("Songbook.formal").every((f) => f.open), "正式文字入口（團呼／誓詞／口令）開既有已核卡");
  ok(!/誓詞|規律|銘言/.test(Q("Songbook.songs.map(function(s){return s.lines.map(function(l){return l[1];}).join('');}).join('')")), "歌曲歌詞唔改寫正式誓詞／規律／銘言原文");
}

/* 4. SkillArt 圖解 */
{
  const map = Q("SkillArt.map"), art = Q("SkillArt.art");
  const keys = Object.keys(map);
  ok(keys.length >= 20, `圖解對映 ${keys.length} 節（≥20）`);
  keys.forEach((k) => {
    ok(!!art[map[k]], `對映鍵 ${k} → ${map[k]} 有圖`);
    const [tid, i] = k.split(":");
    const m = Q(`DATA.meetings.find(function(x){return x.tid==='${tid}';})`);
    ok(!!m && !!m.segs[Number(i)], `${k} 對應真實集會節`);
    ok(Number(i) > 0 && Number(i) < m.segs.length - 1, `${k} 用喺教學節（唔係集合／回顧例行段）`);
  });
  keys.forEach((k) => {
    const a = Q(`SkillArt.get('${k.split(":")[0]}',${k.split(":")[1]})`);
    ok(a && (a.svg.match(/<svg/g) || []).length === (a.svg.match(/<\/svg>/g) || []).length, `${k} SVG 開埋齊`);
    ok(a.svg.includes("自行繪製示意圖") && a.svg.includes("非官方圖樣"), `${k} 圖內標明自繪・非官方`);
    ok(!/undefined|NaN/.test(a.svg), `${k} SVG 無 undefined／NaN`);
  });
  /* 圖已接返入帶領資料：投影頁 .ldia 讀 s.svg */
  keys.forEach((k) => {
    const [tid, i] = k.split(":");
    ok(Q(`DATA.meetings.find(function(x){return x.tid==='${tid}';}).segs[${i}].art`) === map[k], `${k} 嘅節已掛上圖解（s.svg／s.art）`);
  });
  /* 單張圖解卡：點哪節印哪節 */
  const sh = Q("SkillArt.sheet('c06',1)");
  ok((sh.match(/class="psheet/g) || []).length === 1 && sh.includes("圖解帶領卡") && sh.includes("<svg"), "c06 平結圖解卡＝單張A4");
  ok(Q("SkillArt.sheet('c06',0)").includes("呢節以文字帶法為主"), "例行段冇圖時坦白講明，唔硬塞");
  ok(Q("App.libraryCards('skill')").includes("skill-thumb"), "技能卡格仔有圖縮圖");
  ok(Q("App.libraryCards('activity')").includes("lib-tag"), "活動卡标明有圖解／文字卡");
  ok((Q("App.libraryCards('activity')").match(/只印呢張/g) || []).length >= 10 && (Q("App.libraryCards('skill')").match(/只印呢張/g) || []).length >= 10, "活動／技能卡格仔有「🖨️ 只印呢張」單張列印鈕");
}

console.log(fail === 0 ? "\nPRINT/SONGS/ART PASS: print isolation, real worksheets+songs tab, sing-along cards with A4 sheets, per-stage skill diagrams" : `\nPRINT/SONGS/ART FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
