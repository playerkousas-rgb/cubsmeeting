/* 🧵 Craft — 素材庫「圖紙」分頁：小手工的物料、做法、安全同可印圖紙。
   全部係一般手工活動，唔涉及制服、徽章或正式儀式；成品唔當考驗完成。
   寫法跟 docs/teaching-copy-style.md：短口語、一句一件事、安全要睇到。 */
var Craft = {
  items: [
    {
      id: 'bracelet', title: '友誼手繩', mins: 20, people: '每人一條，兩人一組輪流幫手',
      img: 'assets/manual/details/friendship-bracelet.avif',
      mats: ['三色毛線或棉繩，每條約 60 厘米', '剪刀（成人管理）', '膠紙或夾（固定繩頭）'],
      steps: [
        '三條繩對齊，一頭打個鬆結，留 5 厘米尾。',
        '鬆結嗰邊用膠紙貼枱邊，或者叫同伴按住。',
        '左邊繩搭過中間，再穿返出嚟拉緊；右邊繩照做一次。',
        '左右輪流做到手腕長度，最後打兩個結收尾。',
        '剪剩尾（成人剪），寫個名送畀朋友。'
      ],
      safety: '繩唔好綁頸、唔好綁太緊；剪刀由成人用同收好。手痛就停，唔好拉傷手指。',
      leader: '先示範兩次，等大家睇清楚左右次序。做得慢唔緊要，唔比快。'
    },
    {
      id: 'recycled-paper', title: '再生紙', mins: 30, people: '每組 4–6 人共用一盆',
      img: 'assets/manual/details/recycled-paper.avif',
      mats: ['廢紙（撕成小塊）', '水盆、水', '紗網框或舊篩', '乾布、報紙', '抹手布'],
      steps: [
        '廢紙撕成小塊，浸水 10 分鐘。',
        '用手攪成紙漿，太稠就加少少水。',
        '紗網框放入水盆，均勻撈起一層紙漿。',
        '提起瀝水，反轉放上乾布，蓋報紙輕壓吸水。',
        '放平陰乾，乾透先寫字。'
      ],
      safety: '紙漿唔好放入口；地板濕要抹乾；唔好用力壓玻璃或尖邊工具。',
      leader: '每組一個水盆，輪流做。乾唔透就唔好寫字，會爛。'
    },
    {
      id: 'card', title: '心意卡', mins: 20, people: '每人一張',
      img: 'assets/skills/card-making-scene.avif',
      mats: ['卡紙一張', '顏色筆、貼紙', '膠水或膠紙', '剪刀（成人管理）'],
      steps: [
        '卡紙對摺，先想清楚送畀邊個。',
        '封面畫圖或寫一句，內頁寫兩句心意。',
        '貼紙或剪紙裝飾，唔好遮住寫字位。',
        '寫上日期同名字，送出去。'
      ],
      safety: '用膠水唔用熱熔膠；剪刀由成人用同收好；唔好互相貼喺面上或頭髮。',
      leader: '唔比畫功。寫唔到字可以畫，或者由成人代記口述內容。'
    },
    {
      id: 'bridge', title: '紙橋挑戰', mins: 25, people: '每組 3–4 人',
      img: 'assets/skills/bridge-report-scene.avif',
      mats: ['A4 紙數張', '兩隻相同高度的杯或盒', '輕紙杯一個', '鉛筆、記錄紙'],
      steps: [
        '兩隻杯相距 15 厘米，做橋墩。',
        '先估平放紙橋撐唔撐得住，寫低預測。',
        '放上輕紙杯，睇下會唔會塌。',
        '換同款紙摺成波浪形，再試一次。',
        '每次只改一樣，記低分別。'
      ],
      safety: '只放輕紙杯，唔坐、唔企、唔加重物；紙邊割手就交成人處理。',
      leader: '唔講輸贏，講「我見到咩分別」。塌咗都係結果，唔好擦掉預測。'
    },
    {
      id: 'snack', title: '免火點心', mins: 25, people: '每人一份，先洗手',
      img: 'assets/manual/details/cooking.avif',
      mats: ['麵包或餅乾', '已洗乾淨的蔬菜或水果', '芝士或抹醬', '碟、抹手布', '食物夾'],
      steps: [
        '先洗手，枱面抹乾淨。',
        '食材由成人預先洗好、切好。',
        '自己揀材料夾好，排靚。',
        '食之前講一句多謝，食完自己執枱。'
      ],
      safety: '唔用火、唔用刀；食物敏感要先問清楚；唔交換食物，唔試未確認嘅嘢。',
      leader: '預先收集飲食需要同敏感資料；有疑問就唔用嗰樣食材。'
    },
    {
      id: 'model', title: '紙旗模型', mins: 25, people: '每組 3–4 人',
      img: 'assets/skills/model-plan-scene.avif',
      mats: ['卡紙、顏色筆', '飲管或竹籤（成人剪好）', '膠紙', '底座：紙盒或黏土'],
      steps: [
        '先畫設計圖：旗面、旗杆、底座各用咩材料。',
        '剪旗面，畫上自己組嘅記號。',
        '旗杆貼實旗面，唔好左右搖。',
        '固定到底座，放手睇下企唔企得穩。',
        '測試只放輕紙旗，記低邊度郁。'
      ],
      safety: '竹籤尖頭由成人先剪平；唔拮人、唔當武器、唔放近眼睛。',
      leader: '唔同組可以有唔同做法。模型唔等於正式紮作或升旗用品。'
    }
  ],
  get: function (id) { return Craft.items.find(function (c) { return c.id === id; }); },
  card: function (c) {
    return '<button class="craft-card" onclick="Craft.open(\'' + c.id + '\')">' +
      '<span class="craft-thumb"><img src="' + c.img + '" alt="" loading="lazy" onerror="this.parentElement.hidden=true"></span>' +
      '<b>' + esc(c.title) + '</b><small>' + c.mins + '分鐘・' + esc(c.people) + '</small>' +
      '<span class="craft-go">睇物料・印圖紙 ›</span></button>';
  },
  panel: function () {
    return '<h3>🧵 小手工圖紙</h3><p class="mut">揀一個手工，睇物料同做法，可以只印嗰一張圖紙。成品唔當考驗完成。</p>' +
      '<div class="craft-grid">' + Craft.items.map(Craft.card).join('') + '</div>';
  },
  body: function (c) {
    return '<div class="craft-lead"><span class="craft-thumb big"><img src="' + c.img + '" alt="" onerror="this.parentElement.hidden=true"></span>' +
      '<div><p class="mut">' + c.mins + '分鐘｜' + esc(c.people) + '</p><h3>🧺 物料</h3><ul>' + c.mats.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div></div>' +
      '<h3>👣 做法</h3><ol>' + c.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
      '<p class="safe">⛑️ ' + esc(c.safety) + '</p>' +
      '<details><summary>領袖提示</summary><p>' + esc(c.leader) + '</p></details>';
  },
  open: function (id) {
    var c = Craft.get(id); if (!c) return;
    Modal.open('<h2>🧵 ' + esc(c.title) + '</h2>' + Craft.body(c) +
      '<div class="quick"><button class="btn gr" onclick="Craft.print(\'' + id + '\')">🖨️ 印呢張圖紙</button><button class="btn ghost" onclick="Modal.close()">關閉</button></div>' +
      '<p class="mut">圖紙係一般手工教材，唔涉制服、徽章或正式儀式；安全要求由現場領袖按成員情況調整。</p>');
    handleOffline();
  },
  sheet: function (id) {
    var c = Craft.get(id); if (!c) return '';
    return '<section class="psheet craft-sheet"><h2>🧵 ' + esc(c.title) + '｜圖紙</h2>' +
      '<p>姓名：________　小隊：________　日期：________</p>' +
      '<div class="craft-lead"><span class="craft-thumb big"><img src="' + c.img + '" alt=""></span><div><p><b>時間：</b>' + c.mins + '分鐘　<b>分組：</b>' + esc(c.people) + '</p>' +
      '<h3>🧺 物料</h3><ul>' + c.mats.map(function (m) { return '<li>□ ' + esc(m) + '</li>'; }).join('') + '</ul></div></div>' +
      '<h3>👣 做法</h3><ol>' + c.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
      '<p class="safe">⛑️ ' + esc(c.safety) + '</p>' +
      '<h3>✏️ 我嘅設計／記錄</h3><div class="craft-blank"></div>' +
      '<p class="mut">圖紙只係教材：成品唔當考驗完成，正式要求以適用綱要為準。</p></section>';
  },
  print: function (id) {
    var html = Craft.sheet(id); if (!html) return;
    Practical.printModal('小手工圖紙', html);
  }
};
