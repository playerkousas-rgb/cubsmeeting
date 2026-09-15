/* 📝 ExamPapers — 獨立試卷／問題卷庫（唔跟集會編號）。
   2026-09-15 新增：用戶要求工作紙脫離集會目錄，做成領袖印畀成員嘅試卷。
   - 每份卷獨立：成員卷（作答）＋領袖答案（評分要點）分開印，答案唔會混入成員卷。
   - 印一份母本，領袖按人數自行影印；唔一次過印晒全庫。
   - 誓詞／規律／銘言文字以 js/data.js（已核 2026 綱要）為準，出題唔改寫原文。
   - 集會專用嘅反思工作紙保留喺「完整出隊包」入面（跟嗰場集會印），
     呢度只放跨集會通用嘅溫習卷同考核卷。
   Content.worksheetIndex 指向呢個庫，素材庫「工作紙」分頁即見。 */
var ExamPapers = {
  papers: [
    {
      id: 'promise-law', title: '誓詞・規律・銘言溫習卷', topic: '制服・儀式', mins: 10,
      intro: '開卷溫習：先讀熟手冊誓詞、規律同銘言，再作答。',
      score: '選擇題每題 10 分，是非題每題 10 分，短答 20 分，共 100 分。80 分或以上為溫習達標。',
      sections: [
        { h: '一、選擇題（圈出一個答案）', kind: 'mc', items: [
          { q: '幼童軍誓詞第一句係？', opts: ['我願盡所能', '我要考第一', '我愛食雪糕'], a: 0, why: '誓詞第一句：我願盡所能。' },
          { q: '誓詞入面「對別人」要點做？', opts: ['要幫助', '要比賽', '要避開'], a: 0, why: '誓詞：對別人，要幫助。' },
          { q: '幼童軍規律教我哋點做？', opts: ['先顧別人，才顧自己', '自己開心最緊要', '唔使理其他人'], a: 0, why: '規律：幼童軍，盡所能，先顧別人才顧己，日行一善富精神。' },
          { q: '幼童軍銘言係邊個字？', opts: ['準備', '快樂', '努力'], a: 0, why: '銘言係「準備」。' }
        ]},
        { h: '二、是非題（啱 ✓　錯 ✗）', kind: 'tf', items: [
          { q: '宣誓之前，要先認識誓詞同規律。', a: true, why: '要先認識，宣誓先有意義。' },
          { q: '規律淨係集會先要守，返屋企唔使理。', a: false, why: '規律係日常生活都要守，日行一善。' },
          { q: '「日行一善」即係每日做一件好事。', a: true, why: '每日一件，富精神。' }
        ]},
        { h: '三、寫一寫', kind: 'short', items: [
          { q: '寫一件你本週做過嘅善事（幾時做／幫到邊個）：', key: '有具體行動、時間同對象就算啱；唔評論大小。例子：星期三幫同學拾返跌咗嘅筆。' }
        ]}
      ]
    },
    {
      id: 'knots', title: '繩結考核卷', topic: '童軍技能', mins: 15,
      intro: '筆試＋實作：先答紙上題，再喺考官面前打出繩結。',
      score: '筆試每題 10 分，共 50 分；實作兩個結，每個 25 分，共 100 分。實作兩個都要合格，全卷先算合格。',
      sections: [
        { h: '一、選擇題（圈出一個答案）', kind: 'mc', items: [
          { q: '邊個結用嚟綁埋兩條繩尾？', opts: ['平結', '反手結', '死結唔解'], a: 0, why: '平結用嚟綁合兩條繩尾（輕物綁紮）。' },
          { q: '反手結有咩用？', opts: ['防止繩尾散開（止端）', '用嚟爬樹', '用嚟吊水桶打水'], a: 0, why: '反手結係簡單止端，唔係承重結。' },
          { q: '邊樣唔可以用平結嚟做？', opts: ['吊人、攀爬或提重物', '綁輕紙包', '綁兩條繩尾'], a: 0, why: '平結唔係安全承重結，唔可以吊人攀爬。' }
        ]},
        { h: '二、是非題（啱 ✓　錯 ✗）', kind: 'tf', items: [
          { q: '平結可以用嚟爬樹同吊人。', a: false, why: '唔可以，平結唔承重，會鬆脫，好危險。' },
          { q: '打完結之後，要拉緊再檢查結形。', a: true, why: '每次打完都要檢查，鬆嘅要重打。' }
        ]},
        { h: '三、實作（考官睇住打）', kind: 'do', items: [
          { q: '打出一個反手結，並講出佢嘅用途。', key: '合格標準：本人獨立打出、結形正確、拉得緊、講得出止端用途。考官簽名：________' },
          { q: '打出一個平結，並講出佢唔可以用嚟做咩。', key: '合格標準：本人獨立打出、結形正確、講得出唔可以吊人攀爬承重。考官簽名：________' }
        ]}
      ]
    },
    {
      id: 'compass', title: '指南針・方向溫習卷', topic: '童軍技能', mins: 10,
      intro: '先溫習指南針用法，再作答；實作部分要喺戶外或空曠地方做。',
      score: '選擇題每題 15 分，是非題每題 10 分，實作 25 分，共 100 分。80 分或以上為溫習達標。',
      sections: [
        { h: '一、選擇題（圈出一個答案）', kind: 'mc', items: [
          { q: '指南針紅針（北端）指住邊個方向？', opts: ['北', '南', '東'], a: 0, why: '紅端指北（按型號北端標記）。' },
          { q: '面向北方，右手邊係邊個方向？', opts: ['東', '西', '南'], a: 0, why: '面北，右東左西，後面係南。' },
          { q: '一般地圖嘅上方代表邊個方向？', opts: ['北', '南', '邊度都得'], a: 0, why: '地圖上方一般為北，以該地圖圖例為準。' }
        ]},
        { h: '二、是非題（啱 ✓　錯 ✗）', kind: 'tf', items: [
          { q: '用指南針嗰陣，要放平、等支針停定先讀數。', a: true, why: '放平、遠離鐵器磁石、等針停定。' },
          { q: '指南針擺喺磁石隔離，讀數一樣準確。', a: false, why: '磁石會干擾，要避開。' }
        ]},
        { h: '三、實作（考官睇住做）', kind: 'do', items: [
          { q: '用指南針找出北方，再依次指出東、南、西三個方向。', key: '合格標準：本人操作、放平、等針停、指嘅方向大致正確。考官簽名：________' }
        ]}
      ]
    },
    {
      id: 'firstaid', title: '急救常識溫習卷', topic: '關己愛人', mins: 10,
      intro: '急救第一課：先保自己安全，再幫人，再叫大人。全部只係常識問答同模擬，唔做真實傷口處理。',
      score: '選擇題每題 15 分，是非題每題 10 分，短答 25 分，共 100 分。80 分或以上為溫習達標。',
      sections: [
        { h: '一、選擇題（圈出一個答案）', kind: 'mc', items: [
          { q: '流鼻血嗰陣應該點做？', opts: ['坐低、身向前微俯、捏住鼻翼', '頭向後仰', '用力擤鼻'], a: 0, why: '坐低向前、捏鼻翼柔軟位約 10–15 分鐘，唔昂頭。' },
          { q: '畀熱水燙親，第一步應該點做？', opts: ['用凍水沖洗降溫', '即刻搽豉油', '用手捽'], a: 0, why: '凍水沖洗降溫，再搵大人；嚴重燙傷要睇醫生。' },
          { q: '香港緊急求助電話係幾多號？', opts: ['999', '123', '888'], a: 0, why: '緊急求助 999；練習用道具電話，唔可以真打。' }
        ]},
        { h: '二、是非題（啱 ✓　錯 ✗）', kind: 'tf', items: [
          { q: '傷口有玻璃碎，要自己即刻拔出嚟。', a: false, why: '唔可以拔，要搵大人同醫護處理。' },
          { q: '幫人之前，要先睇下現場安唔安全。', a: true, why: '先避開車、電線等危險，唔可以連自己都受傷。' }
        ]},
        { h: '三、寫一寫', kind: 'short', items: [
          { q: '要求助，要講清楚邊三樣資料？', key: '參考：喺邊度（位置）、發生咩事、有幾多人受傷／傷者情況。' }
        ]}
      ]
    },
    {
      id: 'tracking', title: '追蹤記號溫習卷', topic: '童軍技能', mins: 10,
      intro: '符號名同意思跟追蹤教材（六款符號）；先溫習剪卡，再作答。',
      score: '連線題每對 10 分，共 60 分；畫記號每個 20 分，共 100 分。80 分或以上為溫習達標。',
      sections: [
        { h: '一、連線（左邊符號連去右邊意思）', kind: 'match',
          left: ['1. 直箭嘴', '2. 彎向左嘅箭嘴', '3. 交叉（✕）', '4. 圓圈加一點', '5. 方框入面寫 6，加箭嘴', '6. 彎向右嘅箭嘴'],
          right: ['A. 此路不通', 'B. 沿路前進', 'C. 我們已回家', 'D. 左轉', 'E. 右轉', 'F. 六步後有信物'],
          pairs: [1, 3, 0, 2, 5, 4],
          why: '1→B 直箭嘴係沿路前進；2→D 彎左係左轉；3→A 交叉係此路不通；4→C 圓圈點係我們已回家；5→F 方框6係六步後有信物；6→E 彎右係右轉。' },
        { h: '二、畫一畫', kind: 'short', items: [
          { q: '畫出「此路不通」記號：', key: '兩條相交斜線（✕）。見到要停喺安全位置，唔好繼續行。' },
          { q: '畫出「我們已回家」記號：', key: '圓圈加中央一點。路線結束，返集合點搵領袖點名，唔可以自己離場。' }
        ]}
      ]
    },
    {
      id: 'weather', title: '天氣觀察溫習卷', topic: '科學與大自然', mins: 10,
      intro: '結合當日真實天氣作答；觀察用眼同皮膚感覺，唔好直望太陽。',
      score: '選擇題每題 15 分，是非題每題 10 分，短答 25 分，共 100 分。80 分或以上為溫習達標。',
      sections: [
        { h: '一、選擇題（圈出一個答案）', kind: 'mc', items: [
          { q: '天色變黑、烏雲密佈，好可能代表咩？', opts: ['就快落雨', '就快出彩虹', '天氣好好'], a: 0, why: '烏雲密佈多數係落雨先兆，要準備雨具。' },
          { q: '行雷閃電嗰陣應該點做？', opts: ['入室內躲避，唔企喺樹下', '企喺大樹下避雨', '繼續喺空曠地方玩'], a: 0, why: '雷暴要入室內；戶外唔好企喺孤樹下或空曠高處。' },
          { q: '猛太陽去戶外活動，要帶咩？', opts: ['帽、清水（仲有防曬用品）', '雨褸同暖包', '乜都唔使帶'], a: 0, why: '帽、清水、防曬；定時飲水，唔舒服即刻講。' }
        ]},
        { h: '二、是非題（啱 ✓　錯 ✗）', kind: 'tf', items: [
          { q: '可以用眼直望太陽嚟判斷天氣。', a: false, why: '唔可以直望太陽，會傷眼。' },
          { q: '出發去戶外活動之前，要先睇天氣報告。', a: true, why: '睇報告、帶啱裝備，天氣差就改期或轉室內。' }
        ]},
        { h: '三、寫一寫（今日真實天氣）', kind: 'short', items: [
          { q: '今日天氣：晴／多雲／陰／雨（圈一個），再寫一句你嘅觀察依據：', key: '按當日真實情況，有觀察依據就算啱，例如：地下濕、有水氹，所以今朝落過雨。' }
        ]}
      ]
    },
    {
      id: 'community', title: '社區認識溫習卷', topic: '國家與社區', mins: 10,
      intro: '認識自己住嘅社區：設施、安全、禮貌。唔寫真實門牌地址。',
      score: '選擇題每題 15 分，是非題每題 10 分，短答 25 分，共 100 分。80 分或以上為溫習達標。',
      sections: [
        { h: '一、選擇題（圈出一個答案）', kind: 'mc', items: [
          { q: '過馬路最安全嘅方法係？', opts: ['行斑馬線、睇燈號', '邊度近就邊度衝過', '跟住巴士尾過'], a: 0, why: '行斑馬線或行人隧道，睇燈號，唔衝出馬路。' },
          { q: '喺街執到銀包，應該點做？', opts: ['交畀大人或警署', '自己袋咗佢', '掉咗佢'], a: 0, why: '交畀可信任嘅大人或警署，唔可以據為己有。' },
          { q: '想借故事書，應該去社區邊個設施？', opts: ['圖書館', '警署', '消防局'], a: 0, why: '圖書館借書；唔舒服去診所；緊急先至 999。' }
        ]},
        { h: '二、是非題（啱 ✓　錯 ✗）', kind: 'tf', items: [
          { q: '等車嗰陣要排隊，唔推撞。', a: true, why: '排隊讓人，先落後上。' },
          { q: '喺圖書館可以大聲講電話。', a: false, why: '圖書館要安靜，唔騷擾其他人。' }
        ]},
        { h: '三、寫一寫', kind: 'short', items: [
          { q: '寫出你住嘅區（唔使寫門牌），再寫一個你去過嘅社區設施：', key: '有區名同一個真實設施就算啱；唔收集門牌地址。' }
        ]}
      ]
    },
    {
      id: 'eco', title: '環保・大自然溫習卷', topic: '科學與大自然', mins: 10,
      intro: '由自己做起：慳、用少啲、回收、唔留痕。',
      score: '選擇題每題 15 分，是非題每題 10 分，短答 25 分，共 100 分。80 分或以上為溫習達標。',
      sections: [
        { h: '一、選擇題（圈出一個答案）', kind: 'mc', items: [
          { q: '飲完嘅膠樽應該點處理？', opts: ['洗乾淨，按回收點指示回收', '掉落普通垃圾桶', '掉喺街'], a: 0, why: '洗乾淨再回收；唔確定收唔收就先問，唔亂掉。' },
          { q: '野外活動之後，垃圾應該點做？', opts: ['全部帶走，不留痕', '就地埋咗佢', '掉喺草叢'], a: 0, why: '自己垃圾自己帶走，郊野不留痕。' },
          { q: '邊樣係慳水嘅好習慣？', opts: ['刷牙嗰陣關水龍頭', '開住水龍頭慢慢刷', '每日沖涼沖半個鐘'], a: 0, why: '唔用嗰陣就關水，珍惜食水。' }
        ]},
        { h: '二、是非題（啱 ✓　錯 ✗）', kind: 'tf', items: [
          { q: '喺郊野公園可以隨便採摘花草。', a: false, why: '唔可以採摘或破壞，要留畀大家同小動物。' },
          { q: '見到受傷嘅野生動物，應該自己捉住佢帶返屋企。', a: false, why: '唔可以自己捉，要即刻叫大人處理。' }
        ]},
        { h: '三、寫一寫', kind: 'short', items: [
          { q: '寫一項你本週可以做到嘅減廢或慳資源行動：', key: '具體可行就算啱，例如：帶水樽唔買樽裝水；用手帕代替紙巾。' }
        ]}
      ]
    }
  ],
  get: function (id) { return ExamPapers.papers.find(function (p) { return p.id === id; }); },
  countQ: function (p) {
    var n = 0;
    p.sections.forEach(function (s) {
      if (s.kind === 'match') n += s.left.length;
      else n += s.items.length;
    });
    return n;
  },
  /* 題目 html：withKey=true 先出答案（領袖答案專用）。 */
  qHtml: function (s, withKey) {
    if (s.kind === 'match') {
      var h = '<div class="exam-match"><div class="exam-col"><ol>' +
        s.left.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></div>' +
        '<div class="exam-col"><ul>' +
        s.right.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div></div>' +
        '<p class="mut">用線連起左右兩邊。</p>';
      if (withKey) h += '<p class="exam-key"><b>答案：</b>' + esc(s.why) + '</p>';
      return h;
    }
    return '<ol class="exam-qlist">' + s.items.map(function (it) {
      var h = '<li>' + esc(it.q);
      if (s.kind === 'mc') h += '<div class="exam-opts">' + it.opts.map(function (o, i) {
        return '<span class="exam-opt">' + 'ABC'[i] + '. ' + esc(o) + '</span>';
      }).join('') + '</div>';
      if (s.kind === 'tf') h += ' <span class="exam-tf">(　✓　／　✗　)</span>';
      if (s.kind === 'short') h += '<div class="writing-space tall"></div>';
      if (s.kind === 'do') h += '<p class="mut">考官簽名：________　日期：________</p>';
      if (withKey) {
        if (s.kind === 'mc') h += '<p class="exam-key"><b>答案：' + 'ABC'[it.a] + '</b>　' + esc(it.why) + '</p>';
        else if (s.kind === 'tf') h += '<p class="exam-key"><b>答案：' + (it.a ? '✓ 啱' : '✗ 錯') + '</b>　' + esc(it.why) + '</p>';
        else h += '<p class="exam-key"><b>評分要點：</b>' + esc(it.key) + '</p>';
      }
      return h + '</li>';
    }).join('') + '</ol>';
  },
  panel: function () {
    return '<section class="card"><h2>📝 試卷・問題卷（獨立列印）</h2>' +
      '<p class="mut">唔跟集會編號：邊份啱用就印邊份。每份卷分開「成員卷」同「領袖答案」兩張印，答案唔會混入成員卷。印一份母本，按人數自行影印。</p>' +
      '<div class="exam-grid">' + ExamPapers.papers.map(function (p) {
        return '<article class="exam-card"><b>📝 ' + esc(p.title) + '</b>' +
          '<small>' + esc(p.topic) + '・約' + p.mins + '分鐘・' + ExamPapers.countQ(p) + '題</small>' +
          '<p class="mut">' + esc(p.intro) + '</p>' +
          '<div class="quick"><button class="btn sm" onclick="ExamPapers.open(\'' + p.id + '\')">預覽</button>' +
          '<button class="btn sm" onclick="ExamPapers.print(\'' + p.id + '\')">印成員卷</button>' +
          '<button class="btn sm ghost" onclick="ExamPapers.printKey(\'' + p.id + '\')">印領袖答案</button></div></article>';
      }).join('') + '</div>' +
      '<p class="mut">集會專用反思工作紙唔喺呢度：開嗰場集會嘅「完整出隊包」，會連埋嗰場嘅反思紙一齊印。</p></section>';
  },
  open: function (id) {
    var p = ExamPapers.get(id); if (!p) return;
    Modal.open('<h2>📝 ' + esc(p.title) + '</h2>' +
      '<p class="mut">' + esc(p.topic) + '・約' + p.mins + '分鐘・' + ExamPapers.countQ(p) + '題｜' + esc(p.intro) + '</p>' +
      '<div class="subtabs compact-tabs"><button class="subtab cur" onclick="ExamPapers.tab(this,\'' + id + '\',false)">成員卷預覽</button>' +
      '<button class="subtab" onclick="ExamPapers.tab(this,\'' + id + '\',true)">領袖答案預覽</button></div>' +
      '<div id="exam-preview">' + ExamPapers.sheetInner(p, false) + '</div>' +
      '<div class="quick"><button class="btn gr" onclick="ExamPapers.print(\'' + id + '\')">🖨️ 印成員卷</button>' +
      '<button class="btn" onclick="ExamPapers.printKey(\'' + id + '\')">🖨️ 印領袖答案</button>' +
      '<button class="btn ghost" onclick="Modal.close()">關閉</button></div>');
  },
  tab: function (btn, id, withKey) {
    var p = ExamPapers.get(id); if (!p) return;
    var bar = btn.parentElement;
    if (bar) bar.querySelectorAll('.subtab').forEach(function (x) { x.classList.remove('cur'); });
    btn.classList.add('cur');
    var box = document.getElementById('exam-preview');
    if (box) box.innerHTML = ExamPapers.sheetInner(p, withKey);
  },
  sheetInner: function (p, withKey) {
    var h = '<h2>📝 ' + esc(p.title) + (withKey ? '｜領袖答案（唔派畀成員）' : '') + '</h2>' +
      '<p>姓名：________　小隊：________　日期：________' + (withKey ? '' : '　得分：________') + '</p>' +
      '<p class="mut">' + esc(p.intro) + '</p>' +
      p.sections.map(function (s) {
        return '<h3>' + esc(s.h) + '</h3>' + ExamPapers.qHtml(s, withKey);
      }).join('') +
      (withKey ? '<h3>📊 評分</h3><p>' + esc(p.score) + '</p>' : '<p class="mut">交卷前檢查：有冇漏做邊題？姓名小隊寫咗未？</p>');
    return h;
  },
  sheet: function (id, withKey) {
    var p = ExamPapers.get(id); if (!p) return '';
    return '<section class="psheet exam-sheet' + (withKey ? ' leader-sheet' : '') + '">' + ExamPapers.sheetInner(p, !!withKey) +
      '<p class="p-foot">' + (withKey ? '領袖答案：評分後收回，唔派畀成員；分數由領袖另行記錄，本卷唔作獎章達標唯一證明。' : '溫習卷：分數只作溫習參考；正式獎章考驗按適用綱要由領袖觀察確認。') + '</p></section>';
  },
  print: function (id) {
    var html = ExamPapers.sheet(id, false);
    if (!html) { toast('搵唔到呢份卷'); return; }
    Practical.printModal('試卷（母本，自行影印）：' + ExamPapers.get(id).title, html);
  },
  printKey: function (id) {
    var html = ExamPapers.sheet(id, true);
    if (!html) { toast('搵唔到呢份卷'); return; }
    Practical.printModal('試卷領袖答案：' + ExamPapers.get(id).title, html);
  }
};
/* 工作紙索引改指向獨立試卷庫。集會反思紙保留喺出隊包（跟集會印）。 */
(function () {
  if (typeof window !== 'undefined' && window.Content) window.Content.worksheetIndex = function () { return ExamPapers.panel(); };
  else if (typeof Content !== 'undefined') Content.worksheetIndex = function () { return ExamPapers.panel(); };
})();
