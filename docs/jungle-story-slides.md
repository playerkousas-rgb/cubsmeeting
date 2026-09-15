# 森林故事：投屏講故事（2026-09-15）

## 用戶要求

1. 現有森林故事內容單薄 → 用總會原版補厚。
2. 總會原版嘅圖太老舊 → 重做（新繪製場景圖）。
3. 做成可以投屏 → 領袖投影睇圖講故事。

## 文字來源（已核）

- 用戶提供：總會《森林故事》內容（PDF，2026-09-15 以 `drive.usercontent.google.com/download?id=10SVNWUuBRw5de24c7SuhkK2aeZvP3ebI&export=download` 讀取全文）。
- 用戶提供：總會 PowerPoint「The Jungle Book」（`drive.usercontent.google.com/download?id=1QSf7FMjpcbiZZcavdY4KTIN_iMPoO0dz&export=download`）。
- 兩份都註明「內容轉載自《香港童軍》月刊第158至170期」；PDF 版本另有英文圖說（Tiger Jumping Out of a Cave 等）屬原圖標題，用作核對情節次序。
- 原有網頁來源（`prog.scouting.org.hk/cub/the-jungle-book/`）仍保留在畫面上作角色及情節核對。

## 改寫原則（跟 docs/teaching-copy-style.md）

- 保留原始情節次序及專名（毛吉利、駱石、亞基拿、白勞、白基拿、施亞汗、卡、施露、賓廸洛、美修娃／納都）。
- 省略暴力、獵殺及吞食細節；以一句「呢段只講情節」帶過，並保留現實安全對照。
- 成員問題短而具體；答案另收喺「問題」區或領袖答案內，唔會事先顯示。
- 每段保留「現實生活」一句，連回小隊生活、求助及安全。

分段數目（改寫後，全部經測試鎖定）：加入狼群 6 段、森林生活與求助 7 段、森林規律 4 段、火種與離開狼群 5 段、回到人類社會 5 段。

## 投屏播放器

- `Jungle.show(i)` 開 `/森林故事` 投屏舞台：第一張係封面（集名、副題、出場角色），之後每段一張大圖＋大字。
- 控制：上一張／下一張、上一集／下一集、❓問題（先問後揭領袖答案）、A－／A＋ 字級、⛶全螢幕、印本集文字。
- 鍵盤：← → 翻頁、空白鍵下一張、Q 問題、Esc 收幕。底部有進度點。
- 列印：每段一頁（圖＋文字），領袖問答及答案另成一頁獨立領袖紙。
- 未出圖嘅段落自動退回「角色卡＋製作中」提示，唔會開天窗。

## 圖像

場景圖為 AI 生成教學插畫（AVIF，每張 ≤120KB，已加入 `sw.js` 預快取），非童軍總會官方原圖，畫面上標明。角色頭像沿用 2026-09-11 已審查嗰批。

分批繪製：繪圖工具有每輪上限，未出圖嘅段落列在 `DATA.jungle.pendingArt`（現時 14 個），出圖後由清單移除；測試會確認清單同實際檔案同步。已完成：

| 段落 | 檔案 |
|---|---|
| 森林裏的晚上 | `assets/jungle/slides/jungle-night-tiger.avif` |
| 洞口的小人兒 | `assets/jungle/slides/jungle-wolf-carry.avif` |
| 老虎來到洞口 | `assets/jungle/slides/jungle-tiger-cave.avif` |
| 到狼群集會 | `assets/jungle/slides/jungle-council.avif` |
| 有人願意支持 | `assets/jungle/slides/jungle-presented.avif` |
| 在白勞家生活 | `assets/jungle/slides/jungle-den-family.avif` |
| 湖邊的水蛇 | `assets/jungle/slides/jungle-water-snake.avif` |
| 被猴群帶走 | `assets/jungle/slides/jungle-monkeys.avif` |
| 施露傳消息 | `assets/jungle/slides/jungle-kite-message.avif` |

## 驗證

`npm test` 全綠。新增回歸（`tests/content.mjs`）：每集分段數目、每段文字／問題／答案／現實生活齊、投屏圖存在且 ≤120KB 且已預快取、`pendingArt` 同實際檔案同步、封面唔顯示答案、問題區預設收合、翻頁及集數界限、鍵盤綁定／解除、印本集文字唔會當印出隊包、以及睇故事唔會寫任何準備狀態。
