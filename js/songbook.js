/* 🎵 Songbook — 素材庫歌曲分頁實裝。
   2026-09-15 旋律修正：用戶回饋「旋律全錯」，經核對香港童軍旅團歌集後重寫。
   歌單來源（只用可核對嘅流通版本，唔自創歌詞）：
   - 離島區第18旅營火歌集 http://www.islands18.org/campsong.htm
   - 九龍第165旅歌曲集（營火歌／野營歌／Shalom／Kumbayah 等）
   - 66HKG 童軍歌曲 https://www.66hkg.com/scoutsongs/（Campfire's Burning 英文詞）
   旋律政策（唔再俾錯旋律誤導小朋友）：
   - 有內置播放（🎶）＝ 旋律屬公有領域＋轉譜已核對（Frère Jacques／Kumbaya／
     Shalom D小調／Auld Lang Syne），來源寫喺 SongPlayer.melodies 註釋。
   - 無內置播放（🎤跟領袖唱）＝ 香港旅團特有曲調未能核對，唔造假旋律；
     領袖起板，成員跟唱（營火本來就係咁帶）。
   1) 正式文字（團呼・誓詞規律・口令）：已核對原文，開既有儀式／手冊卡，唔改寫。
   2) 傳統營火歌：非《幼童軍訓練綱要》考核內容，正式場合用歌按旅團安排。
   3) 本套包自編帶動口號：標明「自編」，唔冒充官方文字。
   功能：圍圈跟唱（逐句回声）、動作提示、單首A4歌紙列印——點哪首印哪首。 */
var Songbook = {
  songs: [
    {
      id: 'campfire-song', title: '營火歌', en: '', kind: 'traditional',
      tune: '香港童軍旅團流通版本（離島18旅／九龍165旅歌集）', use: '營火晚會開場・第一首',
      lines: [
        ['合', '紅日西沉，黑夜來臨，營火高燒曠野裡，'],
        ['合', '你來彈琴，他們唱歌，大家一齊樂歡暢。'],
        ['合', '你唱歌仔，我講故事，表演節目花樣多，'],
        ['合', '一同歡呼，一同遊戲，今晚歡樂永難忘。']
      ],
      actions: '圍圈坐好；唱到「一同歡呼」時舉手輕搖，唔好站起跑動。',
      lead: ['呢首先係香港童軍營火歌（唔係 Frère Jacques 嗰首英文 Campfire＇s Burning，兩首唔同歌）。', '領袖先完整唱一次，成員跟住齊唱；速度放慢，咬字清楚。']
    },
    {
      id: 'campfire-burning', title: "Campfire's Burning", en: "Campfire's Burning", kind: 'traditional',
      tune: 'Frère Jacques 旋律・公有領域；英文詞為童軍流通版本', use: '圍圈輪唱・英文歌',
      lines: [
        ['合', "Campfire's burning, campfire's burning,"],
        ['合', 'Draw nearer, draw nearer.'],
        ['合', 'In the gloaming, in the gloaming,'],
        ['合', 'Come sing and be merry. Come sing and be merry.']
      ],
      actions: '可分兩組輪唱：第二組遲兩句加入。唔識英文可以淨哼旋律。',
      lead: ['先完整唱一次，再分組試輪唱。', '輪唱時每組跟自己進度，唔好被隔離組帶走；唱完請值日小隊長帶下一項，唔留空檔。']
    },
    {
      id: 'together', title: '當我們同在一起', en: 'The More We Get Together', kind: 'traditional',
      tune: 'The More We Get Together・傳統民歌旋律・公有領域；中文詞為旅團流通版本', use: '破冰・轉場・等人齊時',
      lines: [
        ['領', '當我們同在一起，'], ['眾', '在一起，在一起，'],
        ['領', '當我們同在一起，'], ['眾', '其快樂無比。'],
        ['合', '你對著我笑嘻嘻，我對著你笑哈哈，'], ['合', '當我們同在一起，其快樂無比。']
      ],
      actions: '搭肩或叉腰左右輕搖；「笑嘻嘻」時向隔離隊友點頭，唔強求身體接觸。',
      lead: ['先問成員想唔想搭肩；唔想就用叉腰或拍手代替。', '最後一句全員轉向圈心唱，收細聲結束。']
    },
    {
      id: 'wolf-tail', title: '一隻小狼一條尾', en: '', kind: 'traditional',
      tune: '幼童軍傳統帶動唱・香港旅團流通版本', use: '幼童軍圍圈接力・醒神',
      lines: [
        ['領', '一隻小狼一條尾，'], ['眾', '兩隻耳朵直豎起，'],
        ['領', '四條腿兒蹦蹦跳，'], ['眾', '第二隻小狼輪到你。']
      ],
      actions: '用手指做狼耳、原地輕跳一下；句尾指隔離隊友接下一句。跳動留意地面同距離。',
      lead: ['圍圈企定先講動作，先慢速輪一次。', '地面濕滑或空間不足就改坐姿用手勢，唔跳。']
    },
    {
      id: 'kumbayah', title: 'Kumbayah', en: 'Kumbayah', kind: 'traditional',
      tune: '傳統靈歌・公有領域', use: '營火中段・靜落嚟',
      lines: [
        ['合', 'Kumbayah, my Lord, kumbayah,'],
        ['合', 'Kumbayah, my Lord, kumbayah,'],
        ['合', 'Kumbayah, my Lord, kumbayah,'],
        ['合', 'Oh Lord, kumbayah.'],
        ['合', "Someone's singing, Lord, kumbayah,"],
        ['合', "Someone's singing, Lord, kumbayah,"],
        ['合', "Someone's singing, Lord, kumbayah,"],
        ['合', 'Oh Lord, kumbayah.']
      ],
      actions: '雙手放膝，身體輕搖；唱到 Oh Lord 時雙手合十。唔識英文可以淨哼旋律。',
      lead: ['兩段共用同一旋律；聲量逐句收細，帶出安靜氣氛。', '解釋 Kumbayah 意思係「主啊，嚟我處」，尊重唔同信仰成員：可以淨係跟旋律哼唱。']
    },
    {
      id: 'shalom', title: 'Shalom', en: 'Shalom', kind: 'traditional',
      tune: '傳統希伯來民歌・公有領域・D小調', use: '道別・互祝平安',
      lines: [
        ['合', 'Shalom my friends,'], ['合', 'Shalom my friends,'],
        ['合', 'Shalom, shalom.'], ['合', "We'll see you again,"],
        ['合', "We'll see you again,"], ['合', 'Shalom, shalom.']
      ],
      actions: '句尾向圈內兩位隊友點頭或揮手；唔強求握手或擁抱。',
      lead: ['解釋 shalom 意思係平安／問安。', '最後一次用氣聲唱，作為散會前過渡。']
    },
    {
      id: 'parting', title: '臨歧頌（道別歌）', en: '', kind: 'traditional',
      tune: 'Auld Lang Syne 旋律・公有領域；中文詞為童軍流通版本（臨歧頌）', use: '散會前・營火收尾',
      lines: [
        ['合', '我們低聲唱著別離的歌，'],
        ['合', '明天大家又各在一方，'],
        ['合', '珍重吧我親愛的朋友們，'],
        ['合', '天涯海角永遠不相忘。']
      ],
      actions: '手拉手或雙手放膝；聲音放輕，唔鬥大聲。',
      lead: ['先講呢首係道別歌（臨歧頌），唱完就係今晚最後一項。', '中文十字句配八字旋律，個別字併唱：先慢唱一次，等大家跟到節奏。', '有成員唔方便拉手就改雙手放膝，一樣算參與。']
    },
    {
      id: 'grace', title: '謝飯歌', en: '', kind: 'traditional',
      tune: '香港童軍旅團流通版本（謝飯歌）', use: '開餐前・謝飯',
      lines: [
        ['領', '一群童軍，'], ['眾', '聚首一堂，'],
        ['領', '感謝上主，'], ['眾', '賜我用糧。']
      ],
      actions: '開餐前全體企定，雙手合十或放膝，唱完先開餐。',
      lead: ['謝飯歌要莊重，唔好嘻哈；領袖起板，成員跟唱。', '有唔同信仰嘅成員一齊食飯，唱之前講一句：大家用自己方式感恩。']
    },
    {
      id: 'ready-call', title: '準備好未？（帶動口號）', en: '', kind: 'original',
      tune: '本套包自編節奏口號・無旋律', use: '集合後・出發前醒神',
      lines: [
        ['領', '準備好未？'], ['眾', '準備好！'],
        ['領', '手腳耳仔？'], ['眾', '全部到！'],
        ['領', '今日玩嘢？'], ['眾', '盡所能！']
      ],
      actions: '「全部到」時舉雙手轉腕；「盡所能」時舉右拳。',
      lead: ['自編口號，只作帶動氣氛；正式誓詞、規律同口令照原文，唔混用。', '速度由慢到快一次就夠，唔無限重複。']
    }
  ],
  /* 正式文字入口：唔係歌，但係集會一定會用嘅「照讀」內容，放埋一齊方便現場撳。 */
  formal: [
    { id: 'howl', title: '團呼逐步卡', desc: '正式程序・2026綱要第73頁', open: "Ceremony.open('howl')" },
    { id: 'promise', title: '誓詞・規律・銘言', desc: '正式原文・手冊核心', open: "App.go('#book')" },
    { id: 'commands', title: '六個集合口令', desc: '正式口令・2026綱要第74頁', open: "Ceremony.open('commands')" }
  ],
  get: function (id) { return Songbook.songs.find(function (s) { return s.id === id; }); },
  hasMelody: function (id) { return !!(typeof SongPlayer !== 'undefined' && SongPlayer.melodies && SongPlayer.melodies[id]); },
  reader: { id: '', index: 0 },
  lineHtml: function (l, big) {
    var who = l[0] === '領' ? 'lead' : (l[0] === '眾' ? 'cubs' : 'all');
    return '<p class="song-line ' + who + (big ? ' big' : '') + '"><b>' + esc(l[0]) + '</b>' + esc(l[1]) + '</p>';
  },
  panel: function () {
    var h = '<h3>🎵 歌曲・帶動唱</h3><p class="mut">撳歌名開跟唱卡：逐句回声、動作提示、可單印一張A4歌紙。🎶有旋律＝可播內置主旋律；🎤跟領袖唱＝旅團曲調無內置播放，領袖起板。傳統歌非綱要考核內容；正式文字另開儀式卡。</p>';
    h += '<div class="song-grid">' + Songbook.songs.map(function (s) {
      var hasMelody = Songbook.hasMelody(s.id);
      return '<button class="song-card' + (s.kind === 'original' ? ' own' : '') + '" onclick="Songbook.open(\'' + s.id + '\')">' +
        '<b>' + (s.kind === 'original' ? '📣 ' : '🎵 ') + esc(s.title) + '</b>' +
        '<small>' + esc(s.use) + '</small>' +
        '<span class="song-kind">' + (s.kind === 'original' ? '自編口號' : '傳統・流通版本') + (hasMelody ? ' · 🎶有旋律' : ' · 🎤跟領袖唱') + '</span></button>';
    }).join('') + '</div>';
    h += '<h3>📣 正式文字（照讀・唔改寫）</h3><div class="song-grid">' + Songbook.formal.map(function (f) {
      return '<button class="song-card formal" onclick="' + f.open + '"><b>📜 ' + esc(f.title) + '</b><small>' + esc(f.desc) + '</small><span class="song-kind">已核原文</span></button>';
    }).join('') + '</div>';
    h += '<div class="quick"><button class="btn" onclick="Songbook.printAll()">🖨️ 印今晚歌單（每首一張）</button></div>';
    h += '<p class="mut song-prov">歌詞為香港童軍旅團長期流通版本（離島18旅／九龍165旅歌集）；國際傳統歌旋律屬公有領域，轉譜來源見 docs/content-audit.md。自編口號標明「自編」。歌曲唔屬獎章考核；離線照用得。</p>';
    return h;
  },
  open: function (id) {
    var s = Songbook.get(id); if (!s) return;
    Songbook.reader = { id: id, index: 0 };
    var hasMelody = Songbook.hasMelody(id);
    Modal.open('<h2>' + (s.kind === 'original' ? '📣 ' : '🎵 ') + esc(s.title) + (s.en ? ' <small>' + esc(s.en) + '</small>' : '') + '</h2>' +
      '<p class="mut">' + esc(s.tune) + '｜用途：' + esc(s.use) + (hasMelody ? '｜🎶有內置旋律' : '｜🎤跟領袖唱（無內置播放）') + '</p>' +
      '<div class="song-lines">' + s.lines.map(function (l) { return Songbook.lineHtml(l, false); }).join('') + '</div>' +
      '<details open><summary>動作提示</summary><p>' + esc(s.actions) + '</p></details>' +
      '<details><summary>點帶（領袖）</summary><ol>' + s.lead.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></details>' +
      '<div class="quick">' +
      (hasMelody ? '<button class="btn song-play-btn" style="background:#E65100;color:#fff" onclick="SongPlayer.playing?SongPlayer.stop():SongPlayer.play(\'' + id + '\')">🎶 播旋律</button>' : '') +
      '<button class="btn gr" onclick="Songbook.sing(\'' + id + '\')">▶ 圍圈跟唱</button>' +
      '<button class="btn" onclick="Songbook.print(\'' + id + '\')">🖨️ 印呢首A4歌紙</button>' +
      '<button class="btn ghost" onclick="Modal.close()">關閉</button></div>');
  },
  sing: function (id) {
    var s = Songbook.get(id); if (!s) return;
    var r = Songbook.reader; if (r.id !== id) r = Songbook.reader = { id: id, index: 0 };
    var l = s.lines[Math.min(r.index, s.lines.length - 1)];
    var done = r.index >= s.lines.length;
    var hasMelody = Songbook.hasMelody(id);
    Modal.open('<h2>▶ 跟唱：' + esc(s.title) + '</h2>' +
      '<p class="mut">句 ' + Math.min(r.index + 1, s.lines.length) + '／' + s.lines.length + '｜' + (l[0] === '領' ? '領袖唱呢句，成員聽' : l[0] === '眾' ? '成員跟唱' : '全員齊唱') + (hasMelody ? '' : '｜🎤跟領袖起板') + '</p>' +
      (done ? '<div class="song-now done"><b>🎉 唱完！</b><p>' + esc(s.actions) + '</p></div>'
        : '<div class="song-now">' + Songbook.lineHtml(l, true) + '</div>') +
      '<div class="quick">' +
      (hasMelody ? '<button class="btn song-play-btn" style="background:#E65100;color:#fff" onclick="SongPlayer.playing?SongPlayer.stop():SongPlayer.play(\'' + id + '\')">' + (SongPlayer.playing ? '⏹ 停止旋律' : '🎶 播旋律') + '</button>' : '') +
      '<button class="btn" onclick="Songbook.move(-1)"' + (r.index === 0 ? ' disabled' : '') + '>‹ 上一句</button>' +
      '<button class="btn gr" onclick="Songbook.move(1)">' + (done ? '↺ 重頭唱' : '下一句 ›') + '</button>' +
      '<button class="btn" onclick="Lead.beep(880,0.12)">👏 拍手拍子</button>' +
      '<button class="btn ghost" onclick="Songbook.open(\'' + id + '\')">返歌卡</button></div>');
  },
  move: function (d) {
    var r = Songbook.reader, s = Songbook.get(r.id); if (!s) return;
    r.index += d;
    if (r.index > s.lines.length) r.index = 0;
    if (r.index < 0) r.index = 0;
    if (d > 0 && typeof Lead !== 'undefined' && Lead.beep) Lead.beep(r.index >= s.lines.length ? 660 : 880, 0.15);
    Songbook.sing(r.id);
  },
  sheet: function (id) {
    var s = Songbook.get(id); if (!s) return '';
    var hasMelody = Songbook.hasMelody(id);
    return '<section class="psheet song-sheet"><h2>' + (s.kind === 'original' ? '📣 ' : '🎵 ') + esc(s.title) + (s.en ? '（' + esc(s.en) + '）' : '') + '</h2>' +
      '<p>' + esc(s.use) + '｜' + esc(s.tune) + (hasMelody ? '｜🎶有內置旋律' : '｜🎤跟領袖唱') + '</p>' +
      '<div class="song-lines print">' + s.lines.map(function (l) { return Songbook.lineHtml(l, false); }).join('') + '</div>' +
      '<h3>動作提示</h3><p>' + esc(s.actions) + '</p>' +
      '<h3>領袖帶法</h3><ol>' + s.lead.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '<p class="p-foot">' + (s.kind === 'original' ? '本套包自編帶動口號，非官方文字。' : '營火歌：歌詞為香港童軍旅團流通版本；國際傳統歌旋律屬公有領域；非《幼童軍訓練綱要》考核內容。') + '正式場合用歌按旅團安排。</p></section>';
  },
  print: function (id) {
    var html = Songbook.sheet(id);
    if (!html) { toast('搵唔到呢首歌'); return; }
    Practical.printModal('歌紙：' + Songbook.get(id).title, html);
  },
  printAll: function () {
    var html = Songbook.songs.map(function (s) { return Songbook.sheet(s.id); }).join('');
    Practical.printModal('今晚歌單（' + Songbook.songs.length + '首）', html);
  }
};

/* 🎶 SongPlayer — Web Audio API 旋律播放：用簡單合成器播出歌曲主旋律。
   2026-09-15 修正：舊版 6 首轉譜全部核對，錯嘅刪、啱嘅留：
   - campfire-burning（Frère Jacques）：舊譜啱，保留。8 句結構 CDEC×2／EFG×2／
     GAGFEC×2／CGC×2，C4=60。來源：傳統兒歌，公有領域。
   - kumbayah：舊譜錯（C-E-G-E 進行唔係 Kumbaya）。新譜 C 大調：
     C E G G G A A G／C E G G G F E D／同第一句／A G E D C。
     頭三句轉自 F# 大調鍵盤譜（playinoneday.com），尾句 Oh Lord 按和弦
     F-C-G-C 收落主音。靈歌・公有領域。
   - shalom：舊譜錯（C 大調 G-F-E-D，Shalom 係 D 小調）。新譜逐粒音轉自
     維基 Shalom chaverim 條目 LilyPond（D小調 4/4，A3 起板）。
     希伯來民歌・公有領域。
   - parting（臨歧頌／Auld Lang Syne）：舊譜錯（C-E 開頭）。新譜 C 大調：
     G C C C E D C D／E D C C E G A／A G E E C D C D／E D C A A G C，
     轉自 F# 五聲音階譜（musicwithease.com）。蘇格蘭傳統・公有領域。
   - together／wolf-tail／campfire-song／grace：旅團曲調未能核對，唔造假譜，
     無內置播放，跟領袖唱。ready-call 係口號，本來就無旋律。
   每首歌定義一組音符（MIDI 音高＋時值），播放時可暫停／重播。 */
var SongPlayer = {
  ctx: null,
  playing: false,
  timers: [],
  gainNode: null,
  /* 旋律定義：[midiNote, durationInBeats] — 0 表示休止 */
  melodies: {
    'campfire-burning': {
      tempo: 120,
      notes: [
        [60,1],[62,1],[64,1],[60,1],[60,1],[62,1],[64,1],[60,1],
        [64,1],[65,1],[67,2],[64,1],[65,1],[67,2],
        [67,0.5],[69,0.5],[67,0.5],[65,0.5],[64,1],[60,1],
        [67,0.5],[69,0.5],[67,0.5],[65,0.5],[64,1],[60,1],
        [60,1],[55,1],[60,2],[60,1],[55,1],[60,2]
      ]
    },
    'kumbayah': {
      tempo: 80,
      notes: [
        [60,1],[64,1],[67,1],[67,1],[67,1],[69,1],[69,1],[67,1],
        [60,1],[64,1],[67,1],[67,1],[67,1],[65,1],[64,1],[62,1],
        [60,1],[64,1],[67,1],[67,1],[67,1],[69,1],[69,1],[67,1],
        [69,2],[67,1],[64,1],[62,1],[60,3]
      ]
    },
    'shalom': {
      tempo: 90,
      notes: [
        [57,1],
        [62,1],[62,0.5],[64,0.5],[65,1],[62,1],
        [65,1],[65,0.5],[67,0.5],[69,1],[69,1],
        [74,2],[72,2],
        [69,3],
        [69,1],
        [74,1],[69,0.5],[67,0.5],[65,1],[67,1],
        [69,1],[65,0.5],[64,0.5],[62,1],[57,1],
        [62,3],[64,0.5],[65,0.5],
        [62,3]
      ]
    },
    'parting': {
      tempo: 72,
      notes: [
        [55,1],[60,1],[60,1],[60,1],[64,1],[62,1],[60,1],[62,2],
        [64,1],[62,1],[60,1],[60,1],[64,1],[67,1],[69,2],
        [69,1],[67,1],[64,1],[64,1],[60,1],[62,1],[60,1],[62,2],
        [64,1],[62,1],[60,1],[57,1],[57,1],[55,1],[60,3]
      ]
    }
  },
  midiToFreq: function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); },
  init: function () {
    if (!SongPlayer.ctx) {
      try { SongPlayer.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
    }
    if (SongPlayer.ctx.state === 'suspended') SongPlayer.ctx.resume();
    return true;
  },
  play: function (id) {
    if (!SongPlayer.init()) { toast('瀏覽器唔支援音效'); return; }
    SongPlayer.stop();
    var melody = SongPlayer.melodies[id];
    if (!melody) { toast('呢首歌跟領袖唱，無內置旋律'); return; }
    SongPlayer.playing = true;
    var beatMs = 60000 / melody.tempo;
    var ctx = SongPlayer.ctx;
    var gain = ctx.createGain();
    gain.gain.value = 0.3;
    gain.connect(ctx.destination);
    SongPlayer.gainNode = gain;
    var time = ctx.currentTime + 0.1;
    melody.notes.forEach(function (n) {
      if (n[0] > 0 && n[1] > 0) {
        var osc = ctx.createOscillator();
        var noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = SongPlayer.midiToFreq(n[0]);
        /* 加一個柔和嘅二次諧波令聲音溫暖 */
        var osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = SongPlayer.midiToFreq(n[0]) * 2;
        var g2 = ctx.createGain();
        g2.gain.value = 0.08;
        osc2.connect(g2);
        g2.connect(noteGain);
        var dur = n[1] * beatMs / 1000;
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.4, time + 0.03);
        noteGain.gain.linearRampToValueAtTime(0.25, time + dur * 0.5);
        noteGain.gain.linearRampToValueAtTime(0, time + dur);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start(time);
        osc.stop(time + dur + 0.05);
        osc2.start(time);
        osc2.stop(time + dur + 0.05);
      }
      time += n[1] * beatMs / 1000;
    });
    var totalMs = (time - ctx.currentTime) * 1000;
    var endTimer = setTimeout(function () { SongPlayer.playing = false; SongPlayer.updateUI(); }, totalMs);
    SongPlayer.timers.push(endTimer);
    SongPlayer.updateUI();
  },
  stop: function () {
    SongPlayer.timers.forEach(function (t) { clearTimeout(t); });
    SongPlayer.timers = [];
    if (SongPlayer.gainNode) { try { SongPlayer.gainNode.gain.value = 0; } catch(e){} }
    SongPlayer.playing = false;
    SongPlayer.updateUI();
  },
  updateUI: function () {
    if (typeof document === 'undefined' || !document.querySelectorAll) return;
    var btns = document.querySelectorAll('.song-play-btn');
    btns.forEach(function (b) {
      b.textContent = SongPlayer.playing ? '⏹ 停止旋律' : '🎶 播旋律';
    });
  }
};
