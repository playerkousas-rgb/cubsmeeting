/* 🎨 SkillArt — 活動／技能逐步示意圖。
   同集會儀式一樣：一張圖講清「點企、點做、小心乜」，文字只補安全與界線。
   全部為本套包自行繪製的示意圖：非官方圖樣、不按比例、不當考驗標準；
   實際動作仍由領袖現場示範。來源界線同 TrackingKit／Ceremony 一致。 */
var SkillArt = {
  credit: '自行繪製示意圖・非官方圖樣・不按比例｜動作以領袖現場示範為準',
  /* ---- 小工具 ---- */
  frame: function (title, inner, h) {
    h = h || 300;
    return '<svg class="skill-art" viewBox="0 0 640 ' + h + '" role="img" aria-label="' + esc(title) + '">' +
      '<rect width="640" height="' + h + '" rx="14" fill="#fbf8f1" stroke="#e4dccd"/>' +
      '<text x="320" y="27" text-anchor="middle" font-size="17" font-weight="700" fill="#4e342e">' + esc(title) + '</text>' +
      inner +
      '<text x="320" y="' + (h - 9) + '" text-anchor="middle" font-size="11" fill="#6d6455">' + esc(SkillArt.credit) + '</text></svg>';
  },
  panel: function (x, y, w, h, no, lines) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="#ffffff" stroke="#d8cfc0"/>';
    if (no) s += '<circle cx="' + (x + 19) + '" cy="' + (y + 19) + '" r="12" fill="#FF6F00"/><text x="' + (x + 19) + '" y="' + (y + 24) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">' + no + '</text>';
    (lines || []).forEach(function (t, i) {
      s += '<text x="' + (x + w / 2) + '" y="' + (y + h - 10 - ((lines.length - 1 - i) * 15)) + '" text-anchor="middle" font-size="13" fill="#4e342e">' + esc(t) + '</text>';
    });
    return s;
  },
  person: function (x, y, color, scale) {
    var k = scale || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + k + ')"><circle cx="0" cy="-26" r="10" fill="' + color + '"/><path d="M0 -16 V14 M0 -8 L-14 2 M0 -8 L14 2 M0 14 L-10 34 M0 14 L10 34" stroke="' + color + '" stroke-width="5" stroke-linecap="round" fill="none"/></g>';
  },
  rope: function (d, color) {
    /* 白底描邊做出「壓住／穿過」嘅視覺 */
    return '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round"/>';
  },
  arrow: function (x1, y1, x2, y2, color) {
    var c = color || '#8d6e63';
    return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + c + '" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>';
  },
  defs: '<defs><marker id="sa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#8d6e63"/></marker></defs>',

  /* ---- 圖庫：每幅圖都係「三步／三欄」結構，畀領袖照圖講 ---- */
  art: {
    'circle-paper': function () {
      var dots = '';
      for (var i = 0; i < 6; i++) {
        var a = Math.PI * 2 * i / 6 - Math.PI / 2;
        dots += '<circle cx="' + Math.round(320 + 105 * Math.cos(a)) + '" cy="' + Math.round(150 + 78 * Math.sin(a)) + '" r="11" fill="#1565C0"/>';
      }
      return SkillArt.frame('一張紙，全隊到位', SkillArt.defs +
        '<rect x="255" y="112" width="130" height="76" rx="6" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>' +
        '<text x="320" y="155" text-anchor="middle" font-size="14" fill="#8d6e63">大紙（基地）</text>' + dots +
        '<path d="M292 96 C310 82 330 82 348 96" stroke="#2E7D32" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        '<text x="320" y="76" text-anchor="middle" font-size="13" fill="#2E7D32">企喺紙外圍，唔使企上紙</text>' +
        SkillArt.panel(30, 214, 180, 62, 1, ['每人輪流畫一個', '隊員符號']) +
        SkillArt.panel(230, 214, 180, 62, 2, ['全隊商量', '用線連成一幅圖']) +
        SkillArt.panel(430, 214, 180, 62, 3, ['有人想改位？', '先聽原因再諗兩法']));
    },
    'cup-tower': function () {
      var cup = function (x, y) { return '<path d="M' + x + ' ' + y + ' h34 l-5 22 h-24 z" fill="#ffe0b2" stroke="#e65100" stroke-width="2"/>'; };
      return SkillArt.frame('輪流起杯塔', SkillArt.defs +
        cup(300, 168) + cup(340, 168) + cup(320, 144) + cup(330, 120) +
        '<path d="M250 96 C270 84 292 92 306 108" stroke="#1565C0" stroke-width="4" fill="none" marker-end="url(#sa-arrow)"/>' +
        SkillArt.person(232, 120, '#1565C0') +
        '<text x="238" y="76" text-anchor="middle" font-size="13" fill="#1565C0">一次只得一人放一隻</text>' +
        SkillArt.person(452, 130, '#2E7D32') + SkillArt.person(492, 150, '#6A1B9A') + SkillArt.person(530, 170, '#C62828') +
        '<text x="492" y="92" text-anchor="middle" font-size="13" fill="#4e342e">其餘排隊等：可以出聲鼓勵，唔代人放</text>' +
        SkillArt.panel(30, 214, 180, 62, 1, ['每隊六隻杯', '約定一人放一隻']) +
        SkillArt.panel(230, 214, 180, 62, 2, ['倒咗就停一停', '講句鼓勵再試']) +
        SkillArt.panel(430, 214, 180, 62, 3, ['完成後每人讚', '一位隊友嘅幫助']));
    },
    'boundary': function () {
      return SkillArt.frame('我的界線由我表達', SkillArt.defs +
        SkillArt.panel(30, 52, 180, 100, 1, []) +
        '<path d="M120 92 v-18 M120 92 l-14 22 M120 92 l14 22 M106 74 h28" stroke="#C62828" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<text x="120" y="140" text-anchor="middle" font-size="14" fill="#C62828">講「停」＋手勢</text>' +
        SkillArt.panel(230, 52, 180, 100, 2, []) +
        SkillArt.person(300, 100, '#1565C0') + '<path d="M322 108 h44" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        '<rect x="372" y="86" width="26" height="46" rx="6" fill="#e8f5e9" stroke="#2E7D32" stroke-width="2"/>' +
        '<text x="320" y="140" text-anchor="middle" font-size="14" fill="#2E7D32">退開去安全位</text>' +
        SkillArt.panel(430, 52, 180, 100, 3, []) +
        SkillArt.person(492, 104, '#6A1B9A', 0.8) + SkillArt.person(540, 100, '#4e342e') +
        '<text x="520" y="140" text-anchor="middle" font-size="14" fill="#4e342e">搵肯聽你講嘅大人</text>' +
        '<text x="320" y="182" text-anchor="middle" font-size="13" fill="#6d6455">唔想就可以講停；講唔出口或者冇走得開，都唔係你嘅錯。</text>' +
        SkillArt.panel(30, 200, 580, 58, '', ['練習約定：唔分享私人經歷、唔碰人嚟示範；照顧或醫療接觸要有解釋、合適陪同同私隱。']));
    },
    'help-steps': function () {
      return SkillArt.frame('求助三步：停・離開・講', SkillArt.defs +
        SkillArt.panel(30, 52, 180, 96, 1, ['停手、保持距離', '唔硬碰、唔保密']) +
        SkillArt.panel(230, 52, 180, 96, 2, ['去人多／光線好', '嘅安全地方']) +
        SkillArt.panel(430, 52, 180, 96, 3, ['搵大人講清楚', '幫唔到再搵第二位']) +
        SkillArt.person(120, 108, '#C62828', 0.85) + SkillArt.person(320, 108, '#2E7D32', 0.85) +
        SkillArt.person(500, 104, '#6A1B9A', 0.7) + SkillArt.person(545, 100, '#4e342e') +
        '<path d="M150 108 h60" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        '<path d="M350 108 h60" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        SkillArt.panel(30, 176, 580, 82, '', ['第一位大人幫唔到？再搵另一位可信任成人。', '即時有危險：先保安全，交成人或緊急服務處理。', '領袖唔承諾絕對保密；有人披露就安靜聽、記原話、按保障兒童程序處理。']));
    },
    'senses': function () {
      return SkillArt.frame('看三樣、聽兩種', SkillArt.defs +
        '<circle cx="120" cy="100" r="34" fill="#fff" stroke="#1565C0" stroke-width="4"/>' +
        '<path d="M92 100 C106 82 134 82 148 100 C134 118 106 118 92 100 z" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/>' +
        '<circle cx="120" cy="100" r="9" fill="#1565C0"/>' +
        '<text x="120" y="152" text-anchor="middle" font-size="14">見到：① ② ③</text>' +
        '<path d="M300 78 c26 0 26 44 0 44 c-8 0 -8 -14 0 -14 c10 0 10 -16 0 -16 z" fill="#fff" stroke="#6A1B9A" stroke-width="4"/>' +
        '<path d="M318 122 v10 h14" stroke="#6A1B9A" stroke-width="4" fill="none"/>' +
        '<text x="312" y="152" text-anchor="middle" font-size="14">聽到：① ②</text>' +
        SkillArt.person(470, 104, '#2E7D32', 0.9) +
        '<rect x="500" y="76" width="110" height="52" rx="8" fill="#e8f5e9" stroke="#2E7D32" stroke-width="2"/>' +
        '<text x="555" y="98" text-anchor="middle" font-size="12">一項應做＋</text><text x="555" y="116" text-anchor="middle" font-size="12">一項唔應做</text>' +
        SkillArt.panel(30, 176, 580, 82, '', ['喺成人選好嘅安全區觀察；唔摸、唔摘、唔試味。', '停定聽：分辨自然聲定人為聲。', '離開前收好物品同垃圾，點名後返交接點。']));
    },
    'overhand': function () {
      return SkillArt.frame('反手結（止端結）三步', SkillArt.defs +
        SkillArt.panel(30, 50, 180, 120, 1, ['繩端繞一圈']) +
        SkillArt.rope('M60 130 C60 84 150 84 150 122 C150 148 96 150 92 126', '#E65100') +
        SkillArt.panel(230, 50, 180, 120, 2, ['繩端穿入圈']) +
        SkillArt.rope('M260 130 C260 84 350 84 350 122 C350 150 300 152 296 128 L318 104', '#E65100') +
        SkillArt.panel(430, 50, 180, 120, 3, ['慢慢拉緊']) +
        SkillArt.rope('M470 128 C486 96 540 96 552 122 C560 140 528 150 516 132 C508 120 528 112 540 118', '#E65100') +
        '<text x="520" y="86" text-anchor="middle" font-size="12" fill="#2E7D32">成結：繩端唔再散開</text>' +
        SkillArt.panel(30, 190, 580, 68, '', ['用途：簡單止端，避免繩端穿過合適開口。', '限制：唔用嚟攀爬、吊人、提水樽或承重。']));
    },
    'reef': function () {
      return SkillArt.frame('平結三步：右搭左・左搭右', SkillArt.defs +
        SkillArt.panel(30, 50, 180, 120, 1, ['右繩搭左繩', '穿過壓實']) +
        SkillArt.rope('M52 118 C90 96 150 96 190 118', '#C62828') +
        SkillArt.rope('M52 100 C90 128 150 128 190 100', '#F9A825') +
        SkillArt.panel(230, 50, 180, 120, 2, ['方向相反：', '左繩搭右繩穿過']) +
        SkillArt.rope('M252 100 C290 128 350 128 390 100', '#C62828') +
        SkillArt.rope('M252 118 C290 92 350 92 390 118', '#F9A825') +
        SkillArt.panel(430, 50, 180, 120, 3, ['兩端拉緊', '檢查對稱']) +
        SkillArt.rope('M452 112 C480 92 508 92 520 108 C532 92 560 92 588 112', '#C62828') +
        SkillArt.rope('M452 122 C480 140 508 140 520 124 C532 140 560 140 588 122', '#F9A825') +
        '<text x="520" y="80" text-anchor="middle" font-size="12" fill="#2E7D32">對稱＝啱；歪斜＝拆開再試</text>' +
        SkillArt.panel(30, 190, 580, 68, '', ['用途：綁合適嘅輕紙包、輕物綁紮。', '限制：唔用嚟攀爬、吊人、提水樽；唔係安全承重結。']));
    },
    'knot-choose': function () {
      return SkillArt.frame('選結・解結・收繩', SkillArt.defs +
        SkillArt.panel(30, 50, 280, 118, '', ['任務A：繩端想有個止端', '→ 反手結']) +
        SkillArt.rope('M70 120 C70 88 140 88 140 116 C140 136 100 138 96 118', '#E65100') +
        SkillArt.panel(330, 50, 280, 118, '', ['任務B：輕紙包想綁好', '→ 平結']) +
        SkillArt.rope('M370 112 C400 92 430 92 442 108 C454 92 484 92 514 112', '#C62828') +
        SkillArt.rope('M370 122 C400 140 430 140 442 124 C454 140 484 140 514 122', '#F9A825') +
        '<rect x="520" y="96" width="60" height="44" rx="6" fill="#fff8e1" stroke="#f9a825" stroke-width="2"/>' +
        SkillArt.panel(30, 188, 580, 70, '', ['先講用途，再揀結；自己打，隊友講觀察，領袖最後確認。', '慢慢解結、鬆散收好、點數；記低邊個結要再練。', '唔比最快；繩唔纏身體、唔甩向人。']));
    },
    'compass': function () {
      return SkillArt.frame('指南針：放平・等針停・對北', SkillArt.defs +
        '<rect x="60" y="66" width="150" height="110" rx="10" fill="#fff" stroke="#8d6e63" stroke-width="3"/>' +
        '<circle cx="135" cy="121" r="40" fill="#f3f7ff" stroke="#1565C0" stroke-width="4"/>' +
        '<path d="M135 89 L143 121 L135 153 L127 121 z" fill="#C62828"/>' +
        '<path d="M135 153 L127 121 L135 89" fill="none" stroke="#C62828" stroke-width="1"/>' +
        '<path d="M135 121 L135 153" stroke="#fff" stroke-width="5"/>' +
        '<text x="135" y="82" text-anchor="middle" font-size="13" fill="#1565C0">N 標記</text>' +
        '<text x="135" y="196" text-anchor="middle" font-size="13">遠離金屬・放平</text>' +
        SkillArt.panel(240, 66, 170, 110, 1, ['放平、等針停', '認北端標記']) +
        SkillArt.panel(430, 66, 180, 110, 2, ['轉身體／轉盤', '令N對正紅針']) +
        SkillArt.person(320, 230, '#2E7D32', 0.8) +
        '<path d="M352 214 L420 200" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        '<rect x="430" y="188" width="120" height="40" rx="8" fill="#e8f5e9" stroke="#2E7D32" stroke-width="2"/>' +
        '<text x="490" y="213" text-anchor="middle" font-size="13">對照場地地標</text>' +
        '<text x="320" y="262" text-anchor="middle" font-size="13" fill="#6d6455">地圖上方未必係北：要看北箭嘴。唔好邊行邊盯儀器。</text>');
    },
    'map-legend': function () {
      return SkillArt.frame('地圖：北箭嘴・比例・圖例', SkillArt.defs +
        '<rect x="40" y="56" width="250" height="150" rx="8" fill="#eef6ec" stroke="#38634d" stroke-width="3"/>' +
        '<path d="M70 80 L70 190 M70 120 L200 120 M140 120 L140 190" stroke="#8aa88f" stroke-width="5" fill="none"/>' +
        '<path d="M252 70 L262 96 L242 96 z" fill="#C62828"/><text x="252" y="112" text-anchor="middle" font-size="12">北箭嘴</text>' +
        '<rect x="60" y="176" width="60" height="10" fill="#4e342e"/><text x="130" y="186" font-size="11">比例</text>' +
        SkillArt.panel(310, 56, 300, 44, 1, ['先找北箭嘴同比例']) +
        SkillArt.panel(310, 108, 300, 44, 2, ['找五個指定圖例，講意思']) +
        SkillArt.panel(310, 160, 300, 46, 3, ['同附近真實設施配對']) +
        '<rect x="52" y="86" width="20" height="20" rx="4" fill="#1565C0"/><text x="80" y="101" font-size="12">廁所</text>' +
        '<rect x="52" y="116" width="20" height="20" rx="4" fill="#E65100"/><text x="80" y="131" font-size="12">營地</text>' +
        '<rect x="52" y="146" width="20" height="20" rx="4" fill="#0277BD"/><text x="80" y="161" font-size="12">水</text>' +
        '<text x="320" y="238" text-anchor="middle" font-size="13" fill="#6d6455">圖上符號唔係物件實際大小；用公開地標，唔記住址門牌。</text>');
    },
    'eight-dir': function () {
      var pts = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
      var s = SkillArt.defs + '<circle cx="320" cy="140" r="16" fill="#FF6F00"/>' + SkillArt.person(320, 152, '#4e342e', 0.7);
      pts.forEach(function (p, i) {
        var a = Math.PI * 2 * i / 8 - Math.PI / 2;
        var x = Math.round(320 + 96 * Math.cos(a)), y = Math.round(140 + 76 * Math.sin(a));
        s += '<path d="M320 140 L' + x + ' ' + y + '" stroke="#c9bfae" stroke-width="2"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="15" fill="#fff" stroke="#8d6e63" stroke-width="2"/>' +
          '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-size="12">' + p + '</text>';
      });
      s += '<text x="320" y="252" text-anchor="middle" font-size="13" fill="#4e342e">成人先核實場內八個方位；每人指一個地標方向，再交換。</text>' +
        '<text x="320" y="272" text-anchor="middle" font-size="13" fill="#6d6455">熟練先加十六方位；其餘重練四或八方位，分開記。</text>';
      return SkillArt.frame('八方向找地標', s, 292);
    },
    'help-call': function () {
      return SkillArt.frame('現場安全與求助：停・叫大人・講三樣', SkillArt.defs +
        SkillArt.panel(30, 52, 180, 104, 1, ['停：唔衝入去', '保持距離']) +
        '<path d="M120 92 v-16 M120 92 l-13 20 M120 92 l13 20 M107 76 h26" stroke="#C62828" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        SkillArt.panel(230, 52, 180, 104, 2, ['叫大人／', '場地領袖']) +
        SkillArt.person(300, 106, '#4e342e', 0.85) + SkillArt.person(345, 102, '#2E7D32') +
        SkillArt.panel(430, 52, 180, 104, 3, ['用道具電話講：', '位置・事故・傷者']) +
        '<rect x="492" y="76" width="34" height="58" rx="7" fill="#fff" stroke="#6A1B9A" stroke-width="3"/>' +
        '<circle cx="509" cy="124" r="4" fill="#6A1B9A"/>' +
        '<text x="545" y="88" font-size="12">① 你喺邊</text><text x="545" y="106" font-size="12">② 發生咩事</text><text x="545" y="124" font-size="12">③ 傷者情況</text>' +
        SkillArt.panel(30, 176, 580, 82, '', ['有車、電線等危險：先退到安全處，唔自行搬動傷者。', '只用不能撥號嘅道具電話演練；聽從接線員指示。', '真實緊急情況：立即由成人求助或打999。']));
    },
    'wound': function () {
      return SkillArt.frame('小擦傷：潔手・按壓・沖洗・覆蓋', SkillArt.defs +
        SkillArt.panel(30, 52, 138, 108, 1, ['潔手', '唔碰血液']) +
        SkillArt.panel(182, 52, 138, 108, 2, ['有出血：', '乾淨敷料按壓']) +
        SkillArt.panel(334, 52, 138, 108, 3, ['止血後清水', '模擬沖洗印乾']) +
        SkillArt.panel(486, 52, 124, 108, 4, ['乾淨敷料', '覆蓋']) +
        '<circle cx="99" cy="102" r="16" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/>' +
        '<rect x="232" y="88" width="38" height="30" rx="5" fill="#fff" stroke="#C62828" stroke-width="3"/>' +
        '<path d="M403 92 v22 M392 103 h22" stroke="#0277BD" stroke-width="4"/>' +
        '<rect x="528" y="88" width="38" height="30" rx="5" fill="#f1f8e9" stroke="#2E7D32" stroke-width="3"/>' +
        SkillArt.panel(30, 178, 580, 80, '', ['只在模型練習；一人練一次。', '持續出血、深傷口或有異物：交成人及醫護，唔拔異物。', '熟悉急救嘅領袖先示範；唔用可撥號電話演練。']));
    },
    'nosebleed': function () {
      return SkillArt.frame('流鼻血：坐低・向前・捏鼻翼', SkillArt.defs +
        '<rect x="70" y="150" width="120" height="14" rx="4" fill="#8d6e63"/>' +
        '<path d="M110 150 V110 q0 -18 18 -18 h14" stroke="#4e342e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<circle cx="150" cy="86" r="13" fill="#4e342e"/>' +
        '<path d="M150 99 q10 8 6 18" stroke="#4e342e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<circle cx="162" cy="94" r="6" fill="#C62828"/>' +
        '<text x="130" y="190" text-anchor="middle" font-size="13">坐低、身體稍向前</text>' +
        '<circle cx="330" cy="110" r="34" fill="#fff" stroke="#6A1B9A" stroke-width="4"/>' +
        '<path d="M330 92 v18 M321 101 h18" stroke="#6A1B9A" stroke-width="4"/>' +
        '<text x="330" y="164" text-anchor="middle" font-size="13">捏鼻翼柔軟位</text>' +
        '<text x="330" y="184" text-anchor="middle" font-size="13">10–15分鐘・用口呼吸</text>' +
        '<g transform="translate(470,70)"><circle cx="40" cy="40" r="34" fill="#fff5f4" stroke="#C62828" stroke-width="4"/>' +
        '<path d="M22 22 L58 58 M58 22 L22 58" stroke="#C62828" stroke-width="5"/>' +
        '<text x="40" y="98" text-anchor="middle" font-size="13" fill="#C62828">唔昂頭・唔躺低</text></g>' +
        SkillArt.panel(30, 208, 580, 56, '', ['按壓10–15分鐘仍唔停、出血多、頭傷、暈或呼吸困難：成人立即安排急症；緊急時打999。']));
    },
    'backpack': function () {
      return SkillArt.frame('執背包：常用易拎・重物靠背', SkillArt.defs +
        '<path d="M250 70 h140 q26 0 26 26 v110 q0 26 -26 26 h-140 q-26 0 -26 -26 v-110 q0 -26 26 -26 z" fill="#dce6da" stroke="#38634d" stroke-width="4"/>' +
        '<path d="M270 70 q50 -26 100 0" fill="none" stroke="#38634d" stroke-width="5"/>' +
        '<rect x="262" y="92" width="116" height="40" rx="8" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>' +
        '<text x="320" y="117" text-anchor="middle" font-size="13">上格：水・手巾・常用</text>' +
        '<rect x="262" y="142" width="116" height="46" rx="8" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/>' +
        '<text x="320" y="170" text-anchor="middle" font-size="13">中間貼背：重物</text>' +
        '<rect x="262" y="196" width="116" height="26" rx="8" fill="#f3e5f5" stroke="#6A1B9A" stroke-width="3"/>' +
        '<text x="320" y="214" text-anchor="middle" font-size="12">底格：後備衣物</text>' +
        SkillArt.panel(440, 70, 170, 74, 1, ['一人揀三件', '講用途']) +
        SkillArt.panel(440, 152, 170, 74, 2, ['自己執：', '重物靠背']) +
        SkillArt.panel(440, 234, 170, 40, 3, ['領袖查重量肩帶']) +
        '<text x="150" y="110" text-anchor="middle" font-size="13">姓名標籤</text>' +
        '<text x="150" y="128" text-anchor="middle" font-size="13">分類袋</text>' +
        '<text x="150" y="146" text-anchor="middle" font-size="13">清單</text>' +
        '<path d="M196 120 h40" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        '<text x="320" y="262" text-anchor="middle" font-size="13" fill="#6d6455">唔公開電話地址；藥物按旅團安排由成人管理，唔共用。</text>');
    },
    'snack-box': function () {
      return SkillArt.frame('點心盒：飲用水＋健康食物', SkillArt.defs +
        '<rect x="60" y="80" width="240" height="110" rx="12" fill="#fff" stroke="#8d6e63" stroke-width="4"/>' +
        '<path d="M180 80 V190" stroke="#8d6e63" stroke-width="3"/>' +
        '<rect x="80" y="100" width="34" height="72" rx="8" fill="#e3f2fd" stroke="#0277BD" stroke-width="3"/>' +
        '<text x="97" y="196" text-anchor="middle" font-size="12">飲用水</text>' +
        '<circle cx="230" cy="126" r="16" fill="#ffe0b2" stroke="#E65100" stroke-width="3"/>' +
        '<rect x="256" y="112" width="30" height="26" rx="6" fill="#f1f8e9" stroke="#2E7D32" stroke-width="3"/>' +
        '<text x="245" y="196" text-anchor="middle" font-size="12">適合自己嘅食物</text>' +
        SkillArt.panel(330, 80, 280, 52, 1, ['先核敏感・飲食・吞嚥需要']) +
        SkillArt.panel(330, 140, 280, 52, 2, ['潔手分用具；切割冷藏交成人']) +
        SkillArt.panel(330, 200, 280, 52, 3, ['寫姓名；戴手套都要洗手']) +
        '<text x="320" y="272" text-anchor="middle" font-size="13" fill="#6d6455">唔交換食物；不能安全保存嘅唔留。唔評論人哋食物。</text>');
    },
    'frame-test': function () {
      return SkillArt.frame('桌上小架：先固定底座', SkillArt.defs +
        '<path d="M80 170 h120 M110 170 V96 M170 170 V96 M110 96 H170" stroke="#8d6e63" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<circle cx="110" cy="170" r="7" fill="#FF6F00"/><circle cx="170" cy="170" r="7" fill="#FF6F00"/><circle cx="140" cy="96" r="7" fill="#FF6F00"/>' +
        '<text x="140" y="196" text-anchor="middle" font-size="13">紙棍＋紙膠帶</text>' +
        '<path d="M300 170 h120 M330 170 V110 M390 170 V110 M330 110 H390" stroke="#8d6e63" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<path d="M360 110 V84 l22 8 l-22 8 z" fill="#C62828"/>' +
        '<text x="360" y="196" text-anchor="middle" font-size="13">只放輕紙旗測試</text>' +
        SkillArt.panel(450, 66, 160, 62, 1, ['畫設計・分好工']) +
        SkillArt.panel(450, 136, 160, 62, 2, ['先底座後支柱']) +
        SkillArt.panel(450, 206, 160, 62, 3, ['記低要改嘅接位']) +
        '<text x="320" y="246" text-anchor="middle" font-size="13" fill="#6d6455">模型唔畀人坐、企或爬；倒咗先停手再商量，唔大力壓、唔拋物測試。</text>');
    },
    'bins': function () {
      var bin = function (x, color, label) {
        return '<path d="M' + x + ' 100 h70 l-8 70 h-54 z" fill="' + color + '22" stroke="' + color + '" stroke-width="4"/>' +
          '<rect x="' + (x - 4) + '" y="88" width="78" height="12" rx="5" fill="' + color + '"/>' +
          '<text x="' + (x + 35) + '" y="196" text-anchor="middle" font-size="13">' + label + '</text>';
      };
      return SkillArt.frame('按標示分類：唔靠桶色猜', SkillArt.defs +
        bin(60, '#1565C0', '紙') + bin(170, '#E65100', '膠') + bin(280, '#616161', '不可回收') +
        '<rect x="400" y="92" width="150" height="78" rx="10" fill="#fff8e1" stroke="#f9a825" stroke-width="3" stroke-dasharray="7 5"/>' +
        '<text x="475" y="126" text-anchor="middle" font-size="15" font-weight="700" fill="#8d6e63">查清楚</text>' +
        '<text x="475" y="150" text-anchor="middle" font-size="12">唔肯定＝放呢格</text>' +
        '<text x="475" y="196" text-anchor="middle" font-size="13">由領袖查，唔估</text>' +
        SkillArt.panel(30, 214, 580, 58, '', ['先看附近回收設施最新接收資料；洗乾淨都未必收。', '一人放一件樣本講原因；唔從垃圾桶取物。']));
    },
    'bridge': function () {
      return SkillArt.frame('紙橋：平紙 vs 摺紙（只改一樣）', SkillArt.defs +
        '<rect x="60" y="150" width="26" height="40" fill="#8d6e63"/><rect x="190" y="150" width="26" height="40" fill="#8d6e63"/>' +
        '<path d="M86 150 C120 168 156 168 190 150" stroke="#F9A825" stroke-width="6" fill="none"/>' +
        '<path d="M130 156 v-16 h16 v16 z" fill="#ffe0b2" stroke="#E65100" stroke-width="2"/>' +
        '<text x="138" y="212" text-anchor="middle" font-size="13">平紙：變形／塌</text>' +
        '<rect x="330" y="150" width="26" height="40" fill="#8d6e63"/><rect x="460" y="150" width="26" height="40" fill="#8d6e63"/>' +
        '<path d="M356 150 l14 -12 l14 12 l14 -12 l14 12 l14 -12 l14 12" stroke="#F9A825" stroke-width="6" fill="none"/>' +
        '<path d="M408 138 v-16 h16 v16 z" fill="#ffe0b2" stroke="#E65100" stroke-width="2"/>' +
        '<text x="408" y="212" text-anchor="middle" font-size="13">摺波浪：較穩</text>' +
        SkillArt.panel(30, 226, 180, 48, '', ['保持相同：紙・跨度']) +
        SkillArt.panel(230, 226, 180, 48, '', ['相同：紙杯・放杯位']) +
        SkillArt.panel(430, 226, 180, 48, '', ['記結果，唔講輸贏']) +
        '<text x="320" y="66" text-anchor="middle" font-size="13" fill="#6d6455">先估後試；塌下就停，手離開橋下，掉落先停再拾。</text>');
    },
    'tracking': function () {
      return SkillArt.frame('追蹤符號：先認三個', SkillArt.defs +
        SkillArt.panel(30, 56, 180, 96, '', ['前進']) +
        '<path d="M90 120 h60 M132 104 l18 16 l-18 16" stroke="#38634d" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        SkillArt.panel(230, 56, 180, 96, '', ['此路不通']) +
        '<path d="M290 120 h44 M320 104 l16 16 M336 104 l-16 16" stroke="#C62828" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        SkillArt.panel(430, 56, 180, 96, '', ['結束']) +
        '<circle cx="520" cy="118" r="16" fill="none" stroke="#6A1B9A" stroke-width="6"/>' +
        '<path d="M520 134 v18" stroke="#6A1B9A" stroke-width="6"/>' +
        SkillArt.panel(30, 172, 580, 86, '', ['一人講一圖意思再配對；熟練先加左右轉或信物。', '搵唔到下一個符號：停喺安全位，叫領袖。', '六個符號名已核官方工作紙；圖形屬自繪，原圖另開連結。']));
    },
    'three-cols': function () {
      return SkillArt.frame('我的證據：三欄分開記', SkillArt.defs +
        SkillArt.panel(40, 60, 176, 130, '', ['參與過']) +
        '<circle cx="128" cy="110" r="18" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/>' +
        SkillArt.panel(232, 60, 176, 130, '', ['仍練習']) +
        '<path d="M300 128 a20 20 0 1 1 40 0" fill="none" stroke="#F9A825" stroke-width="5"/>' +
        '<path d="M336 116 l10 -6 v14 z" fill="#F9A825"/>' +
        SkillArt.panel(424, 60, 176, 130, '', ['領袖已確認']) +
        '<path d="M492 112 l14 14 l26 -28" stroke="#2E7D32" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        SkillArt.panel(30, 208, 580, 56, '', ['寫真實日期同做法；唔用全隊完成代替自己做到。', '出席過同自己做到，係兩回事。']));
    },
    'stations': function () {
      return SkillArt.frame('技能輪轉：三站', SkillArt.defs +
        '<circle cx="150" cy="120" r="46" fill="#fff3e0" stroke="#E65100" stroke-width="4"/><text x="150" y="116" text-anchor="middle" font-size="14">繩結站</text><text x="150" y="136" text-anchor="middle" font-size="12">講用途再示範</text>' +
        '<circle cx="330" cy="120" r="46" fill="#e3f2fd" stroke="#1565C0" stroke-width="4"/><text x="330" y="116" text-anchor="middle" font-size="14">方向站</text><text x="330" y="136" text-anchor="middle" font-size="12">原地找北</text>' +
        '<circle cx="510" cy="120" r="46" fill="#f3e5f5" stroke="#6A1B9A" stroke-width="4"/><text x="510" y="116" text-anchor="middle" font-size="14">求助站</text><text x="510" y="136" text-anchor="middle" font-size="12">講清楚現場</text>' +
        '<path d="M200 108 C240 88 250 88 282 104" stroke="#8d6e63" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        '<path d="M380 108 C420 88 430 88 462 104" stroke="#8d6e63" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        '<path d="M470 156 C400 196 260 196 192 156" stroke="#8d6e63" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        SkillArt.panel(30, 210, 580, 54, '', ['每站記一項做到＋一項待練；每人只選一項反覆練，唔趕站。', '未有足夠領袖就不分散開站。']));
    },
    'beanbag': function () {
      return SkillArt.frame('軟豆袋投擲：前面清空先投', SkillArt.defs +
        '<path d="M90 70 V190" stroke="#C62828" stroke-width="5" stroke-dasharray="10 7"/>' +
        '<text x="96" y="64" font-size="13" fill="#C62828">投擲線</text>' +
        SkillArt.person(130, 120, '#1565C0', 0.9) +
        '<path d="M160 108 C220 84 300 84 356 108" stroke="#8d6e63" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        '<circle cx="430" cy="130" r="42" fill="none" stroke="#2E7D32" stroke-width="5"/>' +
        '<circle cx="430" cy="130" r="20" fill="none" stroke="#2E7D32" stroke-width="4"/>' +
        '<text x="430" y="196" text-anchor="middle" font-size="13">目標圈</text>' +
        '<rect x="240" y="150" width="120" height="40" rx="8" fill="#fff5f4" stroke="#C62828" stroke-width="2" stroke-dasharray="6 5"/>' +
        '<text x="300" y="175" text-anchor="middle" font-size="12" fill="#C62828">等待區：全停先拾</text>' +
        SkillArt.panel(30, 214, 580, 56, '', ['每人投三次；前面清空先投，唔投向人。', '唔排全團名次；記自己調整咗咩。']));
    },
    'weather': function () {
      return SkillArt.frame('看看窗外：天空・光線・感覺', SkillArt.defs +
        '<rect x="50" y="62" width="150" height="110" rx="10" fill="#e3f2fd" stroke="#1565C0" stroke-width="4"/>' +
        '<circle cx="95" cy="100" r="20" fill="#F9A825"/>' +
        '<path d="M130 96 q10 -16 26 -8 q16 -6 20 10 q10 12 -8 14 h-36 q-12 -6 -2 -16 z" fill="#fff" stroke="#90a4ae" stroke-width="3"/>' +
        '<path d="M140 122 l-6 14 M156 122 l-6 14 M172 122 l-6 14" stroke="#0277BD" stroke-width="3"/>' +
        '<text x="125" y="192" text-anchor="middle" font-size="13">又可以多雲又熱</text>' +
        SkillArt.panel(230, 62, 180, 110, 1, ['室內安全位', '看天空光線']) +
        SkillArt.panel(430, 62, 180, 110, 2, ['選描述：晴・雨・', '多雲・炎熱・清涼']) +
        SkillArt.panel(230, 186, 380, 46, 3, ['對照當日官方天氣資料：分清觀察同預報']) +
        '<text x="125" y="252" text-anchor="middle" font-size="12" fill="#6d6455">唔直視太陽</text>' +
        '<text x="420" y="252" text-anchor="middle" font-size="12" fill="#6d6455">唔冒雨或探身窗外</text>');
    },
    'day-plan': function () {
      var blocks = [['起床', '#F9A825'], ['上學', '#1565C0'], ['活動', '#2E7D32'], ['休息', '#6A1B9A'], ['睡覺', '#37474F']];
      var s = SkillArt.defs;
      blocks.forEach(function (b, i) {
        var x = 40 + i * 116;
        s += '<rect x="' + x + '" y="80" width="100" height="70" rx="10" fill="' + b[1] + '18" stroke="' + b[1] + '" stroke-width="3"/>' +
          '<text x="' + (x + 50) + '" y="120" text-anchor="middle" font-size="15" font-weight="700" fill="' + b[1] + '">' + b[0] + '</text>' +
          (i < 4 ? '<path d="M' + (x + 102) + ' 115 h12" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' : '');
      });
      s += '<text x="320" y="180" text-anchor="middle" font-size="13">先排五項，再畫自己嘅日程同實際時段</text>' +
        SkillArt.panel(30, 196, 280, 62, 1, ['選兩個好習慣', '講原因']) +
        SkillArt.panel(330, 196, 280, 62, 2, ['休息都係計劃', '一部分']) +
        '<text x="320" y="278" text-anchor="middle" font-size="12" fill="#6d6455">不同家庭作息可不同；唔以父母工作時間評價家庭。</text>';
      return SkillArt.frame('我的一天有休息', s, 292);
    },
    'community-map': function () {
      return SkillArt.frame('社區簡圖：家・學校・公園', SkillArt.defs +
        '<rect x="40" y="56" width="300" height="160" rx="10" fill="#eef6ec" stroke="#38634d" stroke-width="3"/>' +
        '<path d="M80 180 C120 120 200 160 240 96" stroke="#8d6e63" stroke-width="5" fill="none" stroke-dasharray="9 6"/>' +
        '<rect x="62" y="164" width="34" height="30" rx="5" fill="#fff3e0" stroke="#E65100" stroke-width="3"/><text x="79" y="210" text-anchor="middle" font-size="12">家</text>' +
        '<rect x="222" y="70" width="34" height="30" rx="5" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/><text x="239" y="116" text-anchor="middle" font-size="12">學校</text>' +
        '<circle cx="170" cy="150" r="18" fill="#f1f8e9" stroke="#2E7D32" stroke-width="3"/><text x="170" y="186" text-anchor="middle" font-size="12">公園</text>' +
        '<path d="M292 150 l10 -18 l10 18 z" fill="#C62828"/><text x="302" y="186" text-anchor="middle" font-size="11">停低留意</text>' +
        SkillArt.panel(360, 56, 250, 50, 1, ['用符號標示', '唔寫真實門牌']) +
        SkillArt.panel(360, 114, 250, 50, 2, ['選一條常用路線', '步行定搭車']) +
        SkillArt.panel(360, 172, 250, 50, 3, ['記一項安全或禮貌']) +
        '<text x="320" y="242" text-anchor="middle" font-size="13" fill="#6d6455">簡圖不按實際比例，唔作導航；唔鼓勵獨自出行或實地試路。</text>');
    },
    'handover': function () {
      return SkillArt.frame('準備 vs 服務：分開記', SkillArt.defs +
        SkillArt.panel(40, 60, 260, 110, '', ['準備：做卡・整物資']) +
        '<rect x="80" y="92" width="52" height="38" rx="6" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>' +
        '<rect x="150" y="92" width="52" height="38" rx="6" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>' +
        '<text x="170" y="156" text-anchor="middle" font-size="12">只記準備</text>' +
        '<path d="M310 115 h40" stroke="#8d6e63" stroke-width="4" marker-end="url(#sa-arrow)"/>' +
        SkillArt.panel(360, 60, 250, 110, '', ['服務：成人按約定交接']) +
        SkillArt.person(420, 116, '#2E7D32', 0.8) + SkillArt.person(520, 112, '#4e342e', 0.9) +
        '<rect x="452" y="96" width="44" height="34" rx="6" fill="#f1f8e9" stroke="#2E7D32" stroke-width="3"/>' +
        '<text x="474" y="156" text-anchor="middle" font-size="12">先確認對方需要</text>' +
        SkillArt.panel(30, 190, 580, 68, '', ['未有接收單位就先做團內關懷；未交接只記準備，唔記已服務。', '一人講：做咗咩、幫到邊、下次改咩。領袖分開記準備同服務日期。']));
    }
  },
  /* 邊節用邊幅圖（tid:節序）。冇對上嘅節維持文字卡，唔硬塞圖。 */
  map: {
    'c01:1': 'circle-paper', 'c01:2': 'cup-tower',
    'c03:1': 'boundary', 'c03:2': 'help-steps',
    'c05:2': 'senses',
    'c06:1': 'overhand', 'c06:2': 'reef', 'c06:3': 'knot-choose',
    'c07:1': 'compass', 'c07:2': 'map-legend', 'c07:3': 'eight-dir',
    'c08:1': 'help-call', 'c08:2': 'wound', 'c08:3': 'nosebleed',
    'c09:2': 'backpack',
    'c10:2': 'snack-box',
    'c11:2': 'handover',
    'c15:2': 'frame-test',
    'c16:2': 'bins',
    'c17:2': 'bridge',
    'c18:1': 'tracking',
    'c19:1': 'three-cols',
    'c20:1': 'stations',
    'c21:2': 'beanbag',
    'c23:1': 'weather',
    'c24:1': 'day-plan',
    'c25:1': 'community-map'
  },
  key: function (tid, i) { return tid + ':' + i; },
  get: function (tid, i) {
    var k = SkillArt.map[SkillArt.key(tid, i)];
    return k && SkillArt.art[k] ? { id: k, svg: SkillArt.art[k]() } : null;
  },
  thumb: function (tid, i) {
    var a = SkillArt.get(tid, i);
    return a ? '<div class="skill-thumb">' + a.svg + '</div>' : '';
  },
  /* 單張A4圖解卡：點邊節印邊節，唔會印成個活動庫 */
  sheet: function (tid, i) {
    var m = DATA.meetings.find(function (x) { return x.tid === tid; });
    if (!m || !m.segs[i]) return '';
    var s = m.segs[i], a = SkillArt.get(tid, i);
    return '<section class="psheet leader-sheet skill-sheet"><h2>' + esc(s.n) + '｜圖解帶領卡</h2>' +
      '<p>' + s.m + '分鐘 · ' + esc(m.n) + ' · 第' + (i + 1) + '／' + m.segs.length + '節</p>' +
      (a ? a.svg : '<p class="mut">呢節以文字帶法為主；圖解稍後補。</p>') +
      '<p class="say">' + esc(s.script) + '</p>' +
      '<h3>跟住做</h3><ol>' + s.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '<h3>安全與停止條件</h3><p>' + esc(s.safety) + '</p>' +
      '<h3>物資</h3><p>' + esc(s.mats.join('、') || '無額外物資') + '</p>' +
      '<p>觀察：' + esc(s.watch) + '</p>' +
      '<p class="p-foot">圖為本套包自繪示意，非官方圖樣；實際動作由領袖示範。對應綱要：' + esc(m.refs.join('／')) + '。出席或完成活動不等於獲章。</p></section>';
  },
  print: function (tid, i) {
    var html = SkillArt.sheet(tid, i);
    if (!html) { toast('呢節未有圖解卡'); return; }
    Practical.printModal('活動圖解卡', html);
  },
  /* 把圖接返入既有帶領畫面：投影頁嘅 .ldia 本來就讀 s.svg */
  apply: function () {
    DATA.meetings.forEach(function (m) {
      m.segs.forEach(function (s, i) {
        var a = SkillArt.get(m.tid, i);
        if (a) { s.svg = a.svg; s.art = a.id; }
      });
    });
  }
};
SkillArt.apply();
/* 活動卡（#play／#skills）同即用活動視窗都睇到圖，並可單印一張。 */
(function () {
  var act = App.activity;
  App.activity = function (tid, i) {
    act(tid, i);
    var a = SkillArt.get(tid, i);
    var el = document.getElementById('modal');
    if (!el || !el.querySelector) return;
    var box = el.querySelector('.mbox .modal-content');
    if (!box) return;
    var extra = (a ? '<div class="skill-figure">' + a.svg + '<button class="btn sm ghost skill-zoom" onclick="SkillArt.zoom(\'' + tid + '\',' + i + ')">放大圖</button></div>' : '') +
      '<div class="quick"><button class="btn" onclick="SkillArt.print(\'' + tid + '\',' + i + ')">🖨️ 印呢張圖解卡</button></div>';
    box.insertAdjacentHTML('afterbegin', extra);
  };
  SkillArt.zoom = function (tid, i) {
    var a = SkillArt.get(tid, i);
    if (!a) return;
    var m = DATA.meetings.find(function (x) { return x.tid === tid; });
    Modal.open('<h2>' + esc(m.segs[i].n) + '｜放大圖</h2><div class="skill-zoomwrap">' + a.svg + '</div><p class="mut">' + esc(SkillArt.credit) + '</p><div class="quick"><button class="btn" onclick="App.activity(\'' + tid + '\',' + i + ')">返帶領卡</button><button class="btn" onclick="SkillArt.print(\'' + tid + '\',' + i + ')">印呢張圖解卡</button></div>');
  };
})();
