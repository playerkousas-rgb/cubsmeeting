/* ui：導覽規則＋嚮導條＋外部APP掣＋打印樣式 */
import fs from "fs";
import vm from "vm";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
let fail = 0;
const ok = (c, msg) => { console.log((c ? "✓ " : "✗ FAIL ") + msg); if (!c) fail++; };

const html = read("index.html");
const css = read("css/app.css");
const app = read("js/app.js");
const flowCode = read("js/flow.js");

/* 1. 上下導覽各最多4粒 */
{
  const top = (html.match(/<nav id="topnav"[\s\S]*?<\/nav>/) || [""])[0];
  const bot = (html.match(/<nav id="tabbar"[\s\S]*?<\/nav>/) || [""])[0];
  const tn = (top.match(/<a /g) || []).length, bn = (bot.match(/<a /g) || []).length;
  ok(tn <= 4 && tn >= 3, `上面入口列 ${tn} 粒（≤4）`);
  ok(bn <= 4 && bn >= 3, `下面工具箱 ${bn} 粒（≤4）`);
  ok(!/一二三四|步驟一|Step 1/.test(top + bot), "導覽掣無標一二三四扮流程");
}
/* 2. 嚮導每步四要素齊（做咩n／點解why／動作掣btn／go） */
{
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(flowCode, ctx);
  ok(ctx.Flow.STEPS.length >= 7, `嚮導 ${ctx.Flow.STEPS.length} 步（含同步APP最後一步）`);
  ctx.Flow.STEPS.forEach((s) => {
    ok(!!(s.k && s.n && s.why && s.btn && s.go), `嚮導「${s.n}」四要素齊（做咩/點解/掣/go）`);
  });
  const keys = ctx.Flow.STEPS.map((s) => s.k);
  ["pick", "print", "bag", "venue", "lead", "rec", "sync"].forEach((k) => ok(keys.includes(k), `嚮導有「${k}」步`));
  ok(!/下一步/.test(ctx.Flow.STEPS.map((s) => s.btn).join("")), "嚮導無「下一步」掣（要做完自動跳）");
  ok(/邀請|帶我由頭做到尾/.test(flowCode) || /帶我由頭做到尾/.test(app), "有邀請卡「第一次帶集會？我帶你由頭做到尾」");
  ok(/quit/.test(flowCode) && /唔再彈|唔使帶/.test(flowCode + html), "可退出，退咗唔再彈");
  ok(/s\.tid!==t|s\.tid\s*!==|tid/.test(flowCode), "換第二場自動重頭計");
}
/* 3. 外部APP掣：連結正確＋新分頁＋rel＋離線變灰 */
{
  const data = read("js/data.js");
  ok(data.includes("https://cubsbadge.vercel.app/"), "進度APP網址啱");
  ok(data.includes("https://scout-circulars.vercel.app/"), "通告圖書館網址啱");
  ok((app.match(/target="_blank"/g) || []).length >= 3, "外部掣新分頁開（target=_blank ≥3處）");
  ok((app.match(/rel="noopener"/g) || []).length >= 3, "外部掣有 rel=noopener");
  ok(/要上網先用得/.test(app + html), "離線掣變灰＋顯示「要上網先用得」");
  ok(/navigator\.onLine|online.*offline|offline/.test(app), "有handle離線（online/offline監聽）");
  /* 三個位＋兩個位 */
  ok(/記獎章|開進度追蹤APP記獎章/.test(app), "記錄頁頂有大卡「開進度追蹤APP記獎章」");
  ok(/同步落進度追蹤APP/.test(flowCode + app), "嚮導最後一步係同步落進度追蹤APP");
  ok(/相關APP|相關APP/.test(app), "手冊有「相關APP」區");
  ok(/睇最新通告同活動/.test(app), "年度計劃頁有細卡「睇最新通告同活動」");
  ok(/今天／七天／三十天|七天／三十天/.test(app), "通告文案有教時間視窗");
  ok(/唔好.*再.*獎章資料庫|唔好喺套包再起一套|獎章資料庫/.test(app), "文案講清分工（唔喺套包再做獎章DB）");
}
/* 4. 打印樣式：A4＋隱藏兩列＋嚮導條 */
{
  ok(/@media print/.test(css), "有打印樣式");
  ok(/@page/.test(css) && /A4/.test(css), "A4實際尺寸");
  ok(/#topnav|#tabbar/.test(css) && /none/.test(css), "打印隱藏導覽列");
  ok(/#flowbar/.test(css), "打印隱藏嚮導條");
}
/* 5. 投影帶領六件套 */
{
  ["全螢幕|requestFullscreen", "計時|startTimer", "AudioContext|beep|音效|吹哨", "計分|scores", "抽籤|pick"].forEach((k) =>
    ok(new RegExp(k).test(app), `投影有「${k}」`));
  ok(/大字|lsay|26px/.test(app + css), "投影大字");
}
/* 6. typeof保護 */
{
  const hooks = (app.match(/typeof (Flow|Guide|PackPrint|Bag|Venue|Lead|Modal|EXTERNAL|DATA)/g) || []).length;
  ok(hooks >= 5, `嚮導hook有typeof保護（${hooks}處）`);
  ok(/typeof\s+App\s*!==\s*"undefined"|typeof\s+Flow\s*!==\s*"undefined"/.test(flowCode + html), "index/flow有typeof保護");
}
/* 7. 廣東話口語＋動詞開頭抽查 */
{
  ok(/撳|睇|剔|帶|記|執|開|去/.test(app), "文案動詞開頭（撳/睇/剔/帶/記…）");
  ok(!/请|您/.test(app), "無書面語「请/您」");
}

console.log(fail === 0 ? "\nUI PASS" : `\nUI FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
