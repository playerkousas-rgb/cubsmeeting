/* Cub Hub v8 - 上5下5定位重構，搬自 cubsbadge v7.5.5 手冊定位，橙色代表，無制服無國旗，3指敬禮 */
(function () {
  var oldRoute = App.route;
  App.prepare = function (tid) {
    setTid(tid);
    var s = Flow.st();
    if (s.tid !== tid) s.done = {};
    s.tid = tid; s.on = 1; s.min = 0; s.done.pick = 1; Flow.save(s);
    App.go('#prep');
    if (location.hash === '#prep') App.route();
  };
  App.pick = App.prepare;
  App.quickStart = function () { App.prepare(curTid()); };

  // 10格定義 - 上方新領袖 下方老手素材庫
  var TOP = [
    {id:'official', icon:'📦', title:'官方套包', desc:'綱要資源·說明書', color:'#FF6F00', img:'assets/manual/official.avif', hint:'綱要為準'},
    {id:'plan', icon:'📅', title:'集會目錄', desc:'實戰執行·揀題目跟住做', color:'#1565C0', img:'assets/manual/catalog.avif', hint:'武器庫'},
    {id:'book', icon:'📖', title:'手冊定位', desc:'4合1·六色/領袖/隊長/團呼', color:'#6A1B9A', img:'assets/manual/handbook.avif', hint:'新領袖必讀'},
    {id:'uniform', icon:'👕', title:'制服', desc:'無肩章·小隊色用隊旗', color:'#2E7D32', img:'', hint:'link upgrade APP'},
    {id:'ceremony', icon:'🎪', title:'儀式', desc:'旗禮5步·3指敬禮', color:'#4E342E', img:'assets/manual/ceremony.avif', hint:'5分鐘搞掂'}
  ];
  var BOTTOM = [
    {id:'jungle', icon:'🌳', title:'森林故事', desc:'即開即用·章節+音頻', color:'#2E7D32', img:'', hint:'可直接播放'},
    {id:'play', icon:'🎮', title:'遊戲', desc:'追蹤/傳口訊/信任', color:'#FF6F00', img:'assets/manual/games.avif', hint:'即開即用'},
    {id:'craft', icon:'✂️', title:'手工', desc:'手繩/再生紙/烹飪', color:'#1565C0', img:'assets/manual/craft.avif', hint:'即開即用'},
    {id:'songs', icon:'🎵', title:'歌口號', desc:'團歌·口號·營火', color:'#6A1B9A', img:'assets/manual/songs.avif', hint:'舊領袖最愛'},
    {id:'safety', icon:'🛡️', title:'安全', desc:'RAM風險·SFH原則', color:'#C62828', img:'assets/manual/safety.avif', hint:'必須'}
  ];

  function manualCard(m){
    var imgHtml = m.img ? '<div style="border-radius:8px;overflow:hidden;margin-bottom:6px;max-height:100px"><img src="'+m.img+'" style="width:100%;height:auto;object-fit:cover" onerror="this.parentElement.style.display=\'none\'" loading="lazy"></div>' : '';
    return '<a href="#'+m.id+'" class="manual-card" style="border:2px solid '+m.color+'20;background:linear-gradient(135deg,'+m.color+'08,#fff)"><div style="font-size:24px">'+m.icon+'</div>'+imgHtml+'<b style="color:'+m.color+'">'+m.title+'</b><small style="display:block;color:#666;font-size:11px;margin:2px 0">'+m.desc+'</small><span style="font-size:10px;background:'+m.color+'15;color:'+m.color+';padding:2px 6px;border-radius:999px">'+m.hint+'</span></a>';
  }

  App.vPlan = function () {
    var ms = DATA.meetings, done = Store.get('done', {});
    var count = ms.filter(function (m) { return done[m.tid]; }).length;
    return '<section class="hero" style="background:linear-gradient(135deg,#FF6F00,#FF8F00);color:#000"><div class="troop">CUB HUB / 幼童軍團集會助手 · 橙色代表</div><h1>上方新領袖跟住做，<br>下方老手即開即用。</h1><p>官方=綱要資源（說明書），目錄=實戰執行（武器庫直接上戰場）。精簡扼要，口語化，圖比字好。</p><div class="quick"><button class="btn gr" onclick="App.quickStart()">繼續準備今場 →</button><a class="btn ghost" style="color:#000;border-color:#000" href="#official">睇定位</a></div><div class="stats"><span><b>'+count+'/'+ms.length+'</b> 已完成</span><span><b>'+esc(Store.get('headcount',24))+'</b> 團員</span></div></section>' +
      '<section class="card current-meeting"><div><span class="eyebrow">今場集會</span><h2>'+esc(curMeet().n)+'</h2><p class="mut">'+curMeet().mins+'分鐘 · 印教材 → 執袋 → 設場 → 帶領</p></div><button class="btn gr" onclick="App.quickStart()">開準備卡 →</button></section>' +
      '<section class="card"><h2>📚 上5下5定位</h2><p class="mut">上方=新領袖一步步了解幼童軍及帶集會；下方=資深領袖找素材用，要遊戲搵遊戲要手工搵手工。</p>'+
      '<h3 style="margin:10px 0 6px;font-size:13px;color:#FF6F00">⬆️ 事前準備 · 新領袖</h3><div class="manual-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px">'+TOP.map(manualCard).join('')+'</div>'+
      '<h3 style="margin:14px 0 6px;font-size:13px;color:#2E7D32">⬇️ 現場即用 · 老手素材庫</h3><div class="manual-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px">'+BOTTOM.map(manualCard).join('')+'</div></section>' +
      '<section class="card"><div class="section-heading"><h2>📅 集會目錄（實戰執行）</h2><span class="mut">選那天題目跟住預備和去做就行</span></div><p class="mut">撳場次開始準備；完成狀態獨立記錄。</p><div class="catalog">'+ms.map(function(m,i){
        return '<div class="catalog-row"><a href="#prep?tid='+m.tid+'"><span class="mno">'+String(i+1).padStart(2,'0')+'</span><span><b>'+esc(m.n)+'</b><small>'+esc(m.month)+' · '+m.mins+'分鐘 · '+m.segs.length+'個環節</small></span><span class="go">→</span></a><button class="status-chip" aria-label="'+esc(m.n)+'：'+(done[m.tid]?'改為未完成':'標記完成')+'" onclick="App.toggleDone(\''+m.tid+'\')">'+(done[m.tid]?'✓ 已完成':'未完成')+'</button></div>';
      }).join('')+'</div></section>';
  };

  App.vOfficial = function(){
    return '<section class="card"><a class="back" href="#plan">‹ 返回目錄</a><span class="eyebrow">官方=綱要資源·說明書紙上談兵</span><h1>📦 官方集會套包</h1><p class="mut">對外尊重總會，內部定位：官方係說明書，目錄係武器庫直接上戰場。</p><div style="margin:10px 0;border-radius:10px;overflow:hidden;max-height:160px"><img src="assets/manual/official.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div>'+
      '<div class="tipcard">官方套包係綱要資源，以官方為準，唔自行設計徽章。</div>'+
      extBtn('https://drive.google.com/file/d/1qI5aUCFZE-sAGDDeloE8ubdGXifZg8P2/view',false,'開官方集會套包PDF','官方資源，需上網')+
      extBtn('https://prog.scouting.org.hk/cub/wp-content/uploads/2026/08/ChiCub-Scout-Section-Training-Scheme_20260809.pdf',false,'幼童軍訓練綱要2026','綱要為準')+
      '<div class="quick"><a class="btn gr" href="#plan">去集會目錄實戰 →</a></div></section>';
  };

  App.vBook = function(){
    var subs = [{id:'six',label:'六色'},{id:'roles',label:'領袖角色'},{id:'sixer',label:'隊長訓練'},{id:'calls',label:'團呼手號'}];
    var cur = (location.hash.split('sub=')[1]||'six').split('&')[0];
    function tabContent(){
      if(cur==='six') return '<div class="info-section"><h3>🌈 六色分工</h3><div style="border-radius:8px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/details/six-colors.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:12px;line-height:1.8">棕·紅·黃·綠·藍·白，每色一隊，隊長帶頭，唔係靠嗌大聲。隊長=服務，唔係管人。</p></div>';
      if(cur==='roles') return '<div class="info-section"><h3>👥 領袖4角色</h3><div style="border-radius:8px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/details/leader-roles.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:12px;line-height:1.8">Akela(總領袖)·Baloo(活動)·Bagheera(技能)·Kaa(安全)。4人輪流，唔使一個做晒。</p></div>';
      if(cur==='sixer') return '<div class="info-section"><h3>⭐ 隊長訓練卡</h3><div style="border-radius:8px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/details/sixer-training.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:12px;line-height:1.8">大童教細童，3步：示範→陪做→放手。隊長任務卡：點名、帶遊戲、執拾，唔係罰人。</p><div class="tipcard">同意加小隊長訓練卡，家長行政太複雜係另一個系統，唔做。</div></div>';
      return '<div class="info-section"><h3>🐺 團呼手號（無制服無國旗）</h3><div style="border-radius:8px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/details/pack-call-hands.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:12px;line-height:1.8">雙手放頭做狼耳，Pack Pack Pack，Akela we\'ll do our best! 手勢簡單，唔使跳。</p><div class="ecocard">安全版：無制服無國旗，只有手勢圖示。</div></div>';
    }
    return '<section class="card"><a class="back" href="#plan">‹ 返回</a><span class="eyebrow">手冊定位=新領袖用的·頭4樣放進去</span><h1>📖 手冊定位</h1><div style="margin:8px 0;border-radius:10px;overflow:hidden;max-height:150px"><img src="assets/manual/handbook.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div><div class="subtabs">'+subs.map(function(s){return '<button class="subtab '+(cur===s.id?'cur':'')+'" onclick="location.hash=\'#book?sub='+s.id+'\'">'+s.label+'</button>';}).join('')+'</div>'+tabContent()+'<div class="quick"><a class="btn" href="#uniform">制服 →</a><a class="btn" href="#ceremony">儀式 →</a></div></section>';
  };

  App.vUniform = function(){
    return '<section class="card"><a class="back" href="#plan">‹ 返回</a><span class="eyebrow">制服·無肩章·小隊色用隊旗</span><h1>👕 制服</h1><p class="mut">盡量唔用制服圖，制服唔一會有人嘈。直接用官方手冊+ upgrade APP。</p>'+
      '<div class="info-section"><h3>徽章位置（文字為準，唔自行設計）</h3><p style="font-size:12px;line-height:2">左胸袋中：會員章/和平使者章<br>左胸袋上：L1-L5進度章<br>右袖：活動章<br>左袖上：急救章<br><b>無肩章</b>（幼童軍無肩章，小隊色用隊旗/隊牌展示，肩章係童軍以上）</p><div class="tipcard">💡 獎章以官方訓練綱要為準，唔自行設計徽章圖<br>💡 徽章位置以官方指引為準</div></div>'+
      extBtn('https://github.com/playerkousas-rgb/upgrade.git',false,'開制服參考APP (upgrade)','官方參考，唔用自製圖')+
      '<div class="quick"><button class="btn gr" onclick="Uniform.open()">開制服教學包</button><button class="btn" onclick="FieldVisuals.reference()">官方款式圖</button></div></section>';
  };

  App.vCeremony = function(){
    var subs = [{id:'flag',label:'旗禮'},{id:'oath',label:'宣誓'},{id:'salute',label:'敬禮'},{id:'calls',label:'團呼'}];
    var cur = (location.hash.split('sub=')[1]||'flag').split('&')[0];
    function content(){
      if(cur==='flag') return '<div class="info-section"><h3>🚩 旗禮5步（3指敬禮）</h3><div style="border-radius:8px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/details/flag-steps.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:12px;line-height:2">1. 立正<br>2. 旗手出旗<br>3. 向旗敬禮 - <b>3指敬禮</b>（食中無名指併攏，拇指按小指）<br>4. 禮畢<br>5. 團呼 Pack Pack Pack<br><span style="font-size:11px;color:#666">5分鐘搞掂，童軍用3指敬禮，唔係2指。無制服無國旗安全版。</span></p></div>';
      if(cur==='oath') return '<div class="info-section"><h3>🤝 宣誓5步</h3><div style="border-radius:8px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/details/oath.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:12px;line-height:2">1. 企旗前半禮<br>2. 問：願意守誓詞規律嗎？<br>3. 答：我願意，讀誓詞<br>4. 頒章，左手握手<br>5. 全團歡呼<br><span style="font-size:11px;color:#666">會員章完成後做，莊重點。</span></p></div>';
      if(cur==='salute') return '<div class="info-section"><h3>🫡 敬禮口令（3指）</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px"><div style="border:1px solid var(--line);padding:8px;border-radius:6px"><b>全禮3指</b><br>食中無名指併攏放額頭，見國旗長官宣誓用，童軍用3指</div><div style="border:1px solid var(--line);padding:8px;border-radius:6px"><b>半禮3指</b><br>放胸前，幼童軍都用3指，唔係2指</div><div style="border:1px solid var(--line);padding:8px;border-radius:6px"><b>握手禮</b><br>左手握，信任</div><div style="border:1px solid var(--line);padding:8px;border-radius:6px"><b>立正/稍息/集隊/解散</b><br>口令要大聲清晰</div></div><p style="font-size:11px;margin-top:8px;background:#FFF3E0;padding:6px;border-radius:4px">💡 糾正：之前寫2指係錯，童軍幼童軍都用3指敬禮，拇指按小指，代表童軍3條誓詞。</p></div>';
      return '<div class="info-section"><h3>📣 團呼手號（安全版）</h3><div style="border-radius:8px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/details/pack-call-hands.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:12px;line-height:2">雙手放頭做狼耳=Pack<br>Pack Pack Pack<br>Akela we\'ll do our best!<br><span style="font-size:11px;color:#666">無制服無國旗，只有手勢，無敏感旗幟。</span></p></div>';
    }
    return '<section class="card"><a class="back" href="#plan">‹ 返回</a><span class="eyebrow">儀式·平時都要用·新領袖唔識</span><h1>🎪 儀式禮儀</h1><div style="margin:8px 0;border-radius:10px;overflow:hidden;max-height:150px"><img src="assets/manual/ceremony.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div><div class="subtabs">'+subs.map(function(s){return '<button class="subtab '+(cur===s.id?'cur':'')+'" onclick="location.hash=\'#ceremony?sub='+s.id+'\'">'+s.label+'</button>';}).join('')+'</div>'+content()+'<div class="quick"><button class="btn" onclick="Ceremony.open(\'howl\')">開團呼逐步卡</button><button class="btn" onclick="Ceremony.open(\'commands\')">六個口令</button></div></section>';
  };

  App.vLibrary = function (skills) {
    var cards = [], seen = {};
    DATA.meetings.forEach(function(m){m.segs.forEach(function(s,i){
      if(seen[s.n] || (skills && !/結|急救|方向|指南|露營|路標|煮食|包紮/.test(s.n))) return;
      seen[s.n]=1;
      cards.push('<article class="activity-card"><div class="adia">'+(s.svg||'')+'</div><h3>'+esc(s.n)+'</h3><p class="mut">'+s.m+'分鐘</p><button class="btn" onclick="App.activity(\''+m.tid+'\','+i+')">▶ 即開帶領卡</button></article>');
    });});
    var title = skills?'🪢 技能帶領卡':'🎮 遊戲（即開即用）';
    var img = skills?'':'<div style="border-radius:10px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/games.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div>';
    return '<section class="card"><a class="back" href="#plan">‹ 返回</a><h2>'+title+'</h2>'+img+'<p class="mut">下方五樣要即開即用，點開就係不同章節，可給領袖看著講，也可直接播放有人講故事。</p><div class="template-grid">'+cards.join('')+'</div></section>';
  };

  App.vCraft = function(){
    var crafts = [
      {n:'手繩', img:'assets/manual/details/friendship-bracelet.avif', d:'友誼手繩，彩色毛線，5分鐘'},
      {n:'再生紙', img:'assets/manual/details/recycled-paper.avif', d:'紙漿框，環保'},
      {n:'烹飪', img:'assets/manual/details/cooking.avif', d:'免火煮食，三文治'},
      {n:'營火圈', img:'assets/manual/details/campfire-circle.avif', d:'分享圈，圍圈坐'}
    ];
    return '<section class="card"><a class="back" href="#plan">‹ 返回</a><h2>✂️ 手工（即開即用）</h2><div style="border-radius:10px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/craft.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><div class="template-grid">'+crafts.map(function(c){return '<article class="activity-card"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="'+c.img+'" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>'+c.n+'</h3><p class="mut">'+c.d+'</p><button class="btn" onclick="toast(\'即開即用：'+c.n+'\')">▶ 開教材</button></article>';}).join('')+'</div></section>';
  };

  App.vSongs = function(){
    return '<section class="card"><a class="back" href="#plan">‹ 返回</a><h2>🎵 歌口號（舊領袖最愛）</h2><div style="border-radius:10px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/songs.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p class="mut">舊領袖唔會再要睇儀式，下方歌口號就得。</p><div class="template-grid"><article class="activity-card"><h3>團歌</h3><p class="mut">幼童軍團歌，跟住唱</p><button class="btn" onclick="toast(\'🎵 播放團歌\')">▶ 播放</button></article><article class="activity-card"><h3>口號</h3><p class="mut">日行一善，準備</p><button class="btn">▶ 開口號卡</button></article><article class="activity-card"><h3>營火</h3><p class="mut">營火晚會流程</p><button class="btn">▶ 開流程</button></article></div></section>';
  };

  App.vSafety = function(){
    return '<section class="card"><a class="back" href="#plan">‹ 返回</a><h2>🛡️ 安全（RAM風險評估）</h2><div style="border-radius:10px;overflow:hidden;max-height:140px;margin-bottom:8px"><img src="assets/manual/safety.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p class="mut">同意加小隊長訓練卡和RAM風險評估，家長行政太複雜係另一個系統唔做。</p>'+
      '<div class="template-grid"><article class="activity-card"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/ram-checklist.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>風險評估</h3><p class="mut">RAM清單，checklist</p><button class="btn" onclick="Modal.open(\'<h2>RAM風險評估</h2><p>天氣·場地·人·物資·活動，5項檢查</p>\')">▶ 開清單</button></article>'+
      '<article class="activity-card"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/sfh-principles.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>安全原則</h3><p class="mut">SFH原則，兩人同行</p><button class="btn">▶ 開原則</button></article>'+
      '<article class="activity-card"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/first-aid.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>急救</h3><p class="mut">擦傷·包紮·求助</p><button class="btn">▶ 開急救卡</button></article></div></section>';
  };

  App.vSheets = function(){
    return '<section class="card"><h2>✂️ 工作紙索引</h2><p class="mut">已整合入遊戲/手工即開即用，唔使再搵。</p><a class="btn" href="#play">去遊戲 →</a> <a class="btn" href="#craft">去手工 →</a></section>';
  };
  App.vTools = function(teams){
    return '<section class="card"><h2>'+(teams?'🐾 小隊計分':'🎲 現場快鍵')+'</h2><p class="mut">即撳即用，唔影響今場流程。</p>'+(teams?'<div id="leadscore"></div>':'<div class="tool-grid"><button class="btn" onclick="Lead.whistle()">🤫 安靜訊號</button><button class="btn" onclick="Lead.horn()">📣 集合</button><button class="btn" onclick="Lead.pick()">🎲 抽籤</button><a class="btn" href="#teams">🐾 小隊計分</a></div><h3>⏱️ 倒數計時</h3><label>分鐘 <input id="toolMinutes" type="number" min="1" max="120" value="5" onchange="Tools.reset()"></label><div id="toolClock" role="status" class="tool-clock">'+Tools.time()+'</div><div class="quick"><button class="btn gr" onclick="Tools.start()">開始</button><button class="btn" onclick="Tools.stop()">暫停</button><button class="btn" onclick="Tools.reset()">重設</button></div>')+'</section>';
  };

  App.route = function(){
    var hash = location.hash || '#plan', tab = hash.split('?')[0].slice(1), match = hash.match(/[?&]tid=([^&]+)/);
    if(tab === 'prep' && match){
      var tid = decodeURIComponent(match[1]);
      if(DATA.meetings.some(function(m){return m.tid===tid;})) { App.prepare(tid); return; }
    }
    var render = {
      prep:App.vPrep,
      official:App.vOfficial,
      plan:App.vPlan,
      book:App.vBook,
      uniform:App.vUniform,
      ceremony:App.vCeremony,
      jungle:function(){ if(typeof Jungle!=='undefined'&&Jungle.view) return Jungle.view(); return '<section class="card"><h2>🌳 森林故事</h2><p class="mut">用戶可能另外直接連圖連故事做，文字版可離線使用。</p></section>'; },
      play:function(){return App.vLibrary(false);},
      craft:App.vCraft,
      songs:App.vSongs,
      safety:App.vSafety,
      sheets:App.vSheets,
      skills:function(){return App.vLibrary(true);},
      teams:function(){return App.vTools(true);},
      tools:function(){return App.vTools(false);}
    };
    var fn = render[tab] || oldRoute;
    if(fn===oldRoute){ oldRoute(); return; }
    App.tab=tab;
    document.getElementById('view').innerHTML=fn();
    document.querySelectorAll('#topnav a, #tabbar a').forEach(function(a){a.classList.toggle('cur',a.getAttribute('href')==='#'+tab);});
    handleOffline(); Flow.render();
    if(['play','craft','songs','safety','jungle','skills','teams','tools','sheets'].indexOf(tab)>=0){
      document.getElementById('flowbar').className='';
      document.getElementById('flowbar').innerHTML='';
      document.getElementById('view').style.paddingBottom='';
    }
    if(tab==='teams')Lead.renderScore();
    window.scrollTo(0,0);
  };
  var mark = Flow.mark;
  Flow.mark = function(k,quiet){mark(k,quiet);if(App.tab==='prep')App.route();};
  Lead.full = function(){var el=document.documentElement;if(el.requestFullscreen){var p=el.requestFullscreen();if(p&&p.catch)p.catch(function(){});}};
})();
var Tools = {
  seconds:300, timer:null,
  time:function(){return String(Math.floor(Tools.seconds/60)).padStart(2,'0')+':'+String(Tools.seconds%60).padStart(2,'0');},
  draw:function(){var e=document.getElementById('toolClock');if(e)e.textContent=Tools.time();},
  stop:function(){clearInterval(Tools.timer);Tools.timer=null;},
  reset:function(){Tools.stop();var e=document.getElementById('toolMinutes');Tools.seconds=Math.max(1,Math.min(120,Number(e&&e.value)||5))*60;Tools.draw();},
  start:function(){if(Tools.timer)return;if(Tools.seconds<=0)Tools.reset();Tools.timer=setInterval(function(){Tools.seconds--;Tools.draw();if(Tools.seconds<=0){Tools.stop();Lead.beep();toast('⏱️ 時間到！');}},1000);}
};
