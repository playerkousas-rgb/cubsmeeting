/* 🎵 Songbook — 工作紙＋歌曲頁嘅歌曲分頁實裝。
   內容分三類，界線寫清楚：
   1) 正式文字（誓詞・規律・銘言・團呼）：已核對原文，開既有儀式／手冊卡，唔改寫。
   2) 傳統營火歌：旋律屬公有領域、歌詞為香港童軍旅團長期流通版本；
      非《幼童軍訓練綱要》考核內容，正式場合用歌按旅團安排。來源紀錄見 docs/content-audit.md。
   3) 本套包自編帶動口號：標明「自編」，唔冒充官方文字。
   功能：圍圈跟唱（逐句回声）、動作提示、單首A4歌紙列印——點哪首印哪首。 */
var Songbook = {
  songs: [
    {
      id: 'campfire-burning', title: '營火熊熊', en: "Campfire's Burning", kind: 'traditional',
      tune: '傳統營火歌・旋律公有領域（與 Frère Jacques 同調）', use: '圍圈開始・營火點起後第一首',
      lines: [
        ['領', '熊熊營火，熊熊營火，'], ['眾', '團團坐，團團坐，'],
        ['領', '黑夜來臨，黑夜來臨，'], ['眾', '大家歡呼高歌。'],
        ['合', "Campfire's burning, Campfire's burning,"], ['合', 'Draw nearer, draw nearer.'],
        ['合', 'In the gloaming, in the gloaming,'], ['合', 'Come sing and be merry.']
      ],
      actions: '兩人一組面對面；句尾拍手兩下。第二輪先加輕搖，唔好一次過加晒動作。',
      lead: ['領袖先完整唱一次，再一句一句回声唱：領唱一句，成員跟一句。', '第二輪先加動作；速度保持慢，聽得清先算帶到。', '唱完請值日小隊長帶下一項，唔留空檔。']
    },
    {
      id: 'together', title: '當我們同在一起', en: 'The More We Get Together', kind: 'traditional',
      tune: '傳統民歌旋律・公有領域', use: '破冰・轉場・等人齊時',
      lines: [
        ['領', '當我們同在一起，'], ['眾', '在一起，在一起，'],
        ['領', '當我們同在一起，'], ['眾', '真快樂無比。'],
        ['合', '你對我笑嘻嘻，我對你笑哈哈，'], ['合', '當我們同在一起，真快樂無比。']
      ],
      actions: '搭肩或叉腰左右輕搖；「笑嘻嘻」時向隔離隊友點頭，唔強求身體接觸。',
      lead: ['先問成員想唔想搭肩；唔想就用叉腰或拍手代替。', '最後一句全員轉向圈心唱，收細聲結束。']
    },
    {
      id: 'wolf-tail', title: '一隻小狼一條尾', en: '', kind: 'traditional',
      tune: '幼童軍傳統帶動唱・流通版本', use: '幼童軍圍圈接力・醒神',
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
        ['領', "Someone's singing, Lord,"], ['眾', 'Kumbayah…'],
        ['領', "Someone's singing, Lord,"], ['眾', 'Kumbayah…'],
        ['合', 'Oh, Lord, Kumbayah.'], ['合', 'Oh, Lord, Kumbayah.']
      ],
      actions: '雙手放膝，身體輕搖；Kumbayah 時雙手由下慢慢舉起再放下。',
      lead: ['聲量逐句收細，帶出安靜氣氛。', '解釋 Kumbayah 意思係「主啊，嚟我處」，尊重唔同信仰成員：可以淨係跟旋律。']
    },
    {
      id: 'shalom', title: 'Shalom', en: 'Shalom', kind: 'traditional',
      tune: '傳統希伯來民歌・公有領域', use: '道別・互祝平安',
      lines: [
        ['合', 'Shalom my friends,'], ['合', 'Shalom my friends,'],
        ['合', 'Shalom, shalom.'], ['合', "We'll see you again,"],
        ['合', "We'll see you again,"], ['合', 'Shalom, shalom.']
      ],
      actions: '句尾向圈內兩位隊友點頭或揮手；唔強求握手或擁抱。',
      lead: ['解釋 shalom 意思係平安／問安。', '最後一次用氣聲唱，作為散會前過渡。']
    },
    {
      id: 'parting', title: '驪歌（道別歌）', en: '', kind: 'traditional',
      tune: 'Auld Lang Syne 旋律・公有領域；中文詞為童軍流通版本', use: '散會前・營火收尾',
      lines: [
        ['合', '我們低聲唱著別離的歌，'], ['合', '明天大家又各在一方，'],
        ['合', '珍重吧，我親愛的朋友們，'], ['合', '天涯海角永遠不相忘。']
      ],
      actions: '手拉手或雙手放膝；聲音放輕，唔鬥大聲。',
      lead: ['先講呢首係道別歌，唱完就係今晚最後一項。', '有成員唔方便拉手就改雙手放膝，一樣算參與。']
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
  reader: { id: '', index: 0 },
  lineHtml: function (l, big) {
    var who = l[0] === '領' ? 'lead' : (l[0] === '眾' ? 'cubs' : 'all');
    return '<p class="song-line ' + who + (big ? ' big' : '') + '"><b>' + esc(l[0]) + '</b>' + esc(l[1]) + '</p>';
  },
  panel: function () {
    var h = '<h3>🎵 歌曲・帶動唱</h3><p class="mut">撳歌名開跟唱卡：逐句回声、動作提示、可單印一張A4歌紙。傳統歌非綱要考核內容；正式文字另開儀式卡。</p>';
    h += '<div class="song-grid">' + Songbook.songs.map(function (s) {
      return '<button class="song-card' + (s.kind === 'original' ? ' own' : '') + '" onclick="Songbook.open(\'' + s.id + '\')">' +
        '<b>' + (s.kind === 'original' ? '📣 ' : '🎵 ') + esc(s.title) + '</b>' +
        '<small>' + esc(s.use) + '</small>' +
        '<span class="song-kind">' + (s.kind === 'original' ? '自編口號' : '傳統・公有領域旋律') + '</span></button>';
    }).join('') + '</div>';
    h += '<h3>📣 正式文字（照讀・唔改寫）</h3><div class="song-grid">' + Songbook.formal.map(function (f) {
      return '<button class="song-card formal" onclick="' + f.open + '"><b>📜 ' + esc(f.title) + '</b><small>' + esc(f.desc) + '</small><span class="song-kind">已核原文</span></button>';
    }).join('') + '</div>';
    h += '<div class="quick"><button class="btn" onclick="Songbook.printAll()">🖨️ 印今晚歌單（每首一張）</button></div>';
    h += '<p class="mut song-prov">傳統歌詞為香港童軍旅團長期流通版本，旋律屬公有領域；來源紀錄見 docs/content-audit.md。自編口號標明「自編」。歌曲唔屬獎章考核；離線照用得。</p>';
    return h;
  },
  open: function (id) {
    var s = Songbook.get(id); if (!s) return;
    Songbook.reader = { id: id, index: 0 };
    Modal.open('<h2>' + (s.kind === 'original' ? '📣 ' : '🎵 ') + esc(s.title) + (s.en ? ' <small>' + esc(s.en) + '</small>' : '') + '</h2>' +
      '<p class="mut">' + esc(s.tune) + '｜用途：' + esc(s.use) + '</p>' +
      '<div class="song-lines">' + s.lines.map(function (l) { return Songbook.lineHtml(l, false); }).join('') + '</div>' +
      '<details open><summary>動作提示</summary><p>' + esc(s.actions) + '</p></details>' +
      '<details><summary>點帶（領袖）</summary><ol>' + s.lead.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></details>' +
      '<div class="quick"><button class="btn gr" onclick="Songbook.sing(\'' + id + '\')">▶ 圍圈跟唱</button>' +
      '<button class="btn" onclick="Songbook.print(\'' + id + '\')">🖨️ 印呢首A4歌紙</button>' +
      '<button class="btn ghost" onclick="Modal.close()">關閉</button></div>');
  },
  sing: function (id) {
    var s = Songbook.get(id); if (!s) return;
    var r = Songbook.reader; if (r.id !== id) r = Songbook.reader = { id: id, index: 0 };
    var l = s.lines[Math.min(r.index, s.lines.length - 1)];
    var done = r.index >= s.lines.length;
    Modal.open('<h2>▶ 跟唱：' + esc(s.title) + '</h2>' +
      '<p class="mut">句 ' + Math.min(r.index + 1, s.lines.length) + '／' + s.lines.length + '｜' + (l[0] === '領' ? '領袖唱呢句，成員聽' : l[0] === '眾' ? '成員跟唱' : '全員齊唱') + '</p>' +
      (done ? '<div class="song-now done"><b>🎉 唱完！</b><p>' + esc(s.actions) + '</p></div>'
        : '<div class="song-now">' + Songbook.lineHtml(l, true) + '</div>') +
      '<div class="quick"><button class="btn" onclick="Songbook.move(-1)"' + (r.index === 0 ? ' disabled' : '') + '>‹ 上一句</button>' +
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
    return '<section class="psheet song-sheet"><h2>' + (s.kind === 'original' ? '📣 ' : '🎵 ') + esc(s.title) + (s.en ? '（' + esc(s.en) + '）' : '') + '</h2>' +
      '<p>' + esc(s.use) + '｜' + esc(s.tune) + '</p>' +
      '<div class="song-lines print">' + s.lines.map(function (l) { return Songbook.lineHtml(l, false); }).join('') + '</div>' +
      '<h3>動作提示</h3><p>' + esc(s.actions) + '</p>' +
      '<h3>領袖帶法</h3><ol>' + s.lead.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '<p class="p-foot">' + (s.kind === 'original' ? '本套包自編帶動口號，非官方文字。' : '傳統營火歌：旋律公有領域、歌詞為香港童軍旅團流通版本；非《幼童軍訓練綱要》考核內容。') + '正式場合用歌按旅團安排。</p></section>';
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
