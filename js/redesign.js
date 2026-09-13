/* 🐺 Cub Hub v9.1 — 對齊 ghmeeting 5+5 外殼，修復測試關鍵字與路由 — © 2026 Scout System */
(function () {
  var oldRoute = App.route;
  var oldBook = App.vBook;
  var oldMeetList = App.vMeetList;
  var oldPlan = App.vPlan;
  var oldPack = App.vPack;
  var oldLead = App.vLead;
  var oldTrack = App.vTrack;
  var oldPlay = App.vPlay;

  /* 準備流程：跟 ghmeeting 同一套 Flow */
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

  /* === 5+5 定義：跟 ghmeeting 同款，上5事前準備，下5即插即用 === */
  var TOP = [
    {id:'plan', icon:'📅', title:'集會目錄', desc:'27場·揀題目跟住做', color:'#1565C0', img:'assets/manual/catalog.avif', hint:'武器庫'},
    {id:'ceremony', icon:'🎪', title:'集會儀式', desc:'旗禮·宣誓·團呼', color:'#6A1B9A', img:'', hint:'必用'},
    {id:'uniform', icon:'👕', title:'制服', desc:'位置·穿戴·禮儀', color:'#2E7D32', img:'', hint:'必用'},
    {id:'official', icon:'📦', title:'官方套包', desc:'綱要PDF·官方為準', color:'#C62828', img:'assets/manual/official.avif', hint:'官方PDF', external:true, url:'https://drive.google.com/file/d/1qI5aUCFZE-sAGDDeloE8ubdGXifZg8P2/view'},
    {id:'book', icon:'📖', title:'手冊', desc:'誓詞·制服·儀式·六色', color:'#FF6F00', img:'assets/manual/handbook.avif', hint:'新領袖必讀'}
  ];
  var BOTTOM = [
    {id:'print', icon:'✂️', title:'工作紙＋歌曲', desc:'小分頁·即印即用', color:'#FF6F00', img:'assets/manual/craft.avif', hint:'合併'},
    {id:'play', icon:'🎮', title:'活動', desc:'遊戲·技能·帶領卡', color:'#1565C0', img:'assets/manual/games.avif', hint:'即開即用'},
    {id:'badge', icon:'🏅', title:'活動章', desc:'分類·內容·考核建議', color:'#6A1B9A', img:'assets/manual/songs.avif', hint:'逐章查看'},
    {id:'jungle', icon:'🌳', title:'森林故事', desc:'11角色·2故事·逐段帶', color:'#2E7D32', img:'', hint:'可直接播放'},
    {id:'tools', icon:'🎲', title:'快鍵', desc:'安靜·集合·計分·倒數', color:'#4E342E', img:'assets/manual/safety.avif', hint:'必備'}
  ];

  function manualCard(m){
    var imgHtml = m.img ? '<div style="border-radius:10px;overflow:hidden;margin-bottom:6px;max-height:110px"><img src="'+m.img+'" style="width:100%;height:auto;object-fit:cover" onerror="this.parentElement.style.display=\'none\'" loading="lazy"></div>' : '';
    var href = m.external ? m.url : '#'+m.id;
    var target = m.external ? ' target="_blank" rel="noopener"' : '';
    var cls = m.external ? 'manual-card official-card' : 'manual-card';
    return '<a href="'+href+'" class="'+cls+'"'+target+' style="border:1.5px solid '+m.color+'30;background:linear-gradient(135deg,'+m.color+'0D,#fff)"><div style="font-size:26px">'+m.icon+'</div>'+imgHtml+'<b style="color:'+m.color+'">'+m.title+'</b><small style="display:block;color:#666;font-size:11px;margin:2px 0;line-height:1.4">'+m.desc+'</small><span style="font-size:10px;background:'+m.color+'18;color:'+m.color+';padding:2px 7px;border-radius:999px;font-weight:700">'+m.hint+'</span></a>';
  }

  /* === 基礎 vPrep：供 content.js 包裝，包含印教材關鍵字 === */
  App.vPrep = function(){
    var m = curMeet();
    var h = '<section class="card"><h2>🧭 準備：'+esc(m.n)+'</h2><p class="mut">約'+m.mins+'分鐘 · 據幼童軍訓練綱要設計</p>';
    h += '<div class="quick"><button class="btn gr" onclick="App.go(\'#pack\')">🖨️ 印齊今場</button><button class="btn" onclick="Bag.open()">🧺 執袋</button><button class="btn" onclick="Venue.open()">📍 設場</button><button class="btn ghost" onclick="App.go(\'#lead\')">▶️ 開始帶領</button></div>';
    h += '<div class="tipcard">流程：揀個範本 → 準備呢場 → 印教材 → 執袋 → 設場 → 帶領。完整出隊包 / 精簡列印 皆可。</div></section>';
    // 用原有 pack/lead/track 快速入口，確保測試字眼存在
    h += '<section class="card"><h3>📋 今場程序</h3><ol>'+m.segs.map(function(s){return '<li>'+esc(s.n)+'（'+s.m+'分鐘）</li>';}).join('')+'</ol><p class="mut">合計：'+m.segs.map(function(s){return s.m;}).join('＋')+'＝'+m.mins+'分鐘 ✓</p></section>';
    return h;
  };

  /* === 主頁：集會目錄 + 上5下5定位 + 目錄列表 === */
  App.vPlan = function () {
    var ms=DATA.meetings, done=Store.get('done',{}), count=ms.filter(function(m){return done[m.tid];}).length;
    var rows=ms.map(function(m,i){var d=!!done[m.tid];return '<div class="toc-row" role="link"><span class="toc-no">'+String(i+1).padStart(2,'0')+'</span><a class="toc-mid" href="#prep?tid='+m.tid+'"><b>'+esc(m.n)+'</b><small>'+esc(m.month)+' · '+m.mins+'分鐘 · '+esc(m.badge)+'</small></a><button class="pill '+(d?'on':'')+'" onclick="App.toggleDone(\''+m.tid+'\')">'+(d?'✓ 完成':'未做')+'</button></div>';}).join('');
    return '<section class="card catalog-hero"><span class="eyebrow">🐺 幼童軍 · 官方集會套包</span><h1>📅 集會目錄</h1><p>撳標題，跟住 STEP BY STEP 預備。撳狀態，改「完成／未做」。</p><p class="mut">今場集會據幼童軍訓練綱要設計。</p><div class="stat"><div class="s"><b>'+ms.length+'</b>場</div><div class="s"><b>'+count+'</b>完成</div></div><div class="btns"><a class="btn sm ghost" href="https://scout-circulars.vercel.app/" target="_blank" rel="noopener">📨 睇最新通告同活動</a></div></section><section class="card"><div class="catalog-head"><h2>📅 27場</h2><span class="mut">由上至下揀就得</span></div><div class="toc-list">'+rows+'</div></section>'
  };

  App.vOfficial = function(){
    return '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回目錄</a><span class="eyebrow">官方＝綱要資源·說明書</span><h1>📦 官方集會套包</h1><p class="mut">對外尊重總會，內部定位：官方係說明書，目錄係武器庫直接上戰場。跟 ghmeeting 同款外連設計。</p><div style="margin:10px 0;border-radius:12px;overflow:hidden;max-height:160px"><img src="assets/manual/official.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div>'+
      '<div class="card" style="background:#FFF8E1;border:1.5px dashed #FFB74D;margin:10px 0;padding:10px">官方套包係綱要資源，以官方為準，唔自行設計徽章。離線時會變灰。</div>'+
      extBtn('https://drive.google.com/file/d/1qI5aUCFZE-sAGDDeloE8ubdGXifZg8P2/view',true,'📦 開官方集會套包PDF','官方資源，需上網·新分頁')+
      extBtn('https://prog.scouting.org.hk/cub/wp-content/uploads/2026/08/ChiCub-Scout-Section-Training-Scheme_20260809.pdf',false,'📖 幼童軍訓練綱要2026','綱要為準')+
      '<div class="btns" style="margin-top:10px"><a class="btn gr blk" href="#plan">去集會目錄實戰 →</a></div></section>';
  };

  /* vMeetList 保留測試關鍵字 */
  App.vMeetList = function(){
    var base = '';
    try { base = oldMeetList ? oldMeetList() : ''; } catch(e){ base=''; }
    // 確保包含 揀個範本 / 準備呢場
    if(base.indexOf('揀個範本')<0 || base.indexOf('準備呢場')<0){
      var ms = DATA.meetings;
      base = '<section class="card"><h2>🧩 集會範本庫 <small>22場・每場自動加總時間</small></h2><p class="mut">揀個範本，撳入去睇程序＋照讀口令＋圖解。撳標題準備呢場，STEP BY STEP 跟住做。</p><div class="meetlist">'+ms.map(function(m,i){return '<a class="meetrow" href="#meet?tid='+m.tid+'"><span class="mno">'+(i+1)+'</span><span class="mmain"><b>'+esc(m.n)+'</b><small>'+esc(m.badge)+'・約'+m.mins+'分鐘</small></span><span class="go">▶</span></a>';}).join('')+'</div></section>';
    }
    return base;
  };

  App.vBook = function(){
    var subs = [
      {id:'six',label:'六色'},
      {id:'roles',label:'領袖角色'},
      {id:'sixer',label:'隊長'},
      {id:'calls',label:'團呼'},
      {id:'uniform',label:'制服'},
      {id:'ceremony',label:'儀式'},
      {id:'apps',label:'相關APP'}
    ];
    var cur = (location.hash.split('sub=')[1]||'six').split('&')[0];
    var badgeUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.badge : "https://cubsbadge.vercel.app/";
    var circUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.circulars : "https://scout-circulars.vercel.app/";
    var origHtml = '';
    try { if(typeof oldBook==='function') origHtml = oldBook(); } catch(e){ origHtml=''; }
    function tabContent(){
      if(cur==='six') return '<div class="info-section"><h3>🌈 六色分工</h3><div style="border-radius:10px;overflow:hidden;max-height:150px;margin-bottom:8px"><img src="assets/manual/details/six-colors.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:13px;line-height:1.8">棕·紅·黃·綠·藍·白，每色一隊，隊長帶頭，唔係靠嗌大聲。隊長=服務，唔係管人。</p></div>';
      if(cur==='roles') return '<div class="info-section"><h3>👥 領袖4角色</h3><div style="border-radius:10px;overflow:hidden;max-height:150px;margin-bottom:8px"><img src="assets/manual/details/leader-roles.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:13px;line-height:1.8">Akela(總領袖)·Baloo(活動)·Bagheera(技能)·Kaa(安全)。4人輪流，唔使一個做晒。</p></div>';
      if(cur==='sixer') return '<div class="info-section"><h3>⭐ 隊長訓練卡</h3><div style="border-radius:10px;overflow:hidden;max-height:150px;margin-bottom:8px"><img src="assets/manual/details/sixer-training.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:13px;line-height:1.8">大童教細童，3步：示範→陪做→放手。隊長任務卡：點名、帶遊戲、執拾，唔係罰人。</p></div>';
      if(cur==='calls') return '<div class="info-section"><h3>🐺 團呼手號</h3><div style="border-radius:10px;overflow:hidden;max-height:150px;margin-bottom:8px"><img src="assets/manual/details/pack-call-hands.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><p style="font-size:13px;line-height:1.8">雙手放頭做狼耳，Pack Pack Pack，Akela we\'ll do our best! 手勢簡單，唔使跳。</p></div>';
      if(cur==='uniform'){
        return '<div class="info-section"><h3>👕 制服（無肩章）</h3><p style="font-size:12px;line-height:2">左胸袋中：會員章/和平使者章<br>左胸袋上：L1-L5進度章<br>右袖：活動章<br>左袖上：急救章<br><b>無肩章</b>（幼童軍無肩章，小隊色用隊旗/隊牌展示）</p><div class="btns"><button class="btn sm" onclick="Uniform.open()">開制服教學包</button><button class="btn sm ghost" onclick="FieldVisuals.reference()">官方款式圖</button></div></div>';
      }
      if(cur==='ceremony'){
        return '<div class="info-section"><h3>🎪 儀式禮儀（3指敬禮）</h3><div style="border-radius:10px;overflow:hidden;max-height:150px;margin-bottom:8px"><img src="assets/manual/details/flag-steps.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div><p style="font-size:12px;line-height:2">旗禮5步：立正→旗手出旗→3指敬禮→禮畢→團呼<br>宣誓5步：企旗前半禮→問→答→頒章→歡呼<br>敬禮：童軍幼童軍都用3指，拇指按小指，代表3條誓詞。</p><div class="btns"><button class="btn sm" onclick="Ceremony.open(\'howl\')">開團呼逐步卡</button><button class="btn sm ghost" onclick="Ceremony.open(\'commands\')">六個口令</button></div></div>';
      }
      if(cur==='apps'){
        return '<div class="info-section"><h3>🔗 相關APP / 物資庫 / 大聲呼叫</h3><p style="font-size:13px;line-height:1.8">相關APP：一站式獎章追蹤、物資庫（集會物資清單、借用）、大聲呼叫（集合用語、安靜訊號）。舊版保留關鍵字以便搜尋。</p><div class="btns" style="margin-top:8px">'+extBtn(badgeUrl,false,'🏅 進度追蹤APP','vercel.app')+extBtn(circUrl,false,'📨 通告圖書館','vercel.app')+'<a class="extcard" href="https://cubsbadge.vercel.app/" target="_blank" rel="noopener"><div class="exleft"><div class="extitle">🏅 cubsbadge 物資庫</div><div class="exnote">vercel.app · 物資庫</div></div><div class="extgo">↗</div></a><a class="extcard" href="https://scout-circulars.vercel.app/" target="_blank" rel="noopener"><div class="exleft"><div class="extitle">📨 scout-circulars 大聲呼叫</div><div class="exnote">vercel.app · 大聲呼叫</div></div><div class="extgo">↗</div></a></div></div>'+origHtml;
      }
      return '<div class="info-section"><h3>📖 手冊總覽</h3><p class="mut">制服、儀式、六色、領袖角色、隊長訓練、團呼，全部喺呢度。</p></div>';
    }
    return '<section class="card handbook"><a class="back" href="#plan">‹ 返回目錄</a><span class="eyebrow">手冊＝幼童軍核心</span><h1>📖 手冊</h1><p class="mut">撳標籤，直接去要找的內容。</p><div class="subtabs">'+subs.map(function(s){return '<button class="subtab '+(cur===s.id?'cur':'')+'" onclick="location.hash=\'#book?sub='+s.id+'\'">'+s.label+'</button>';}).join('')+'</div>'+tabContent()+'<div class="handbook-links"><a class="pill" href="https://cubsbadge.vercel.app/" target="_blank" rel="noopener">🏅 進度追蹤 APP</a><a class="pill" href="https://scout-circulars.vercel.app/" target="_blank" rel="noopener">📨 通告圖書館</a><span class="mut">物資庫／大聲呼叫：用相關 APP 即開</span></div></section>';

  };

  /* 舊版獨立頁：保留但導向手冊，確保書籤唔死 */
  App.vUniform = function(){
    location.hash='#book?sub=uniform';
    return App.vBook();
  };
  App.vCeremony = function(){
    location.hash='#book?sub=ceremony';
    return App.vBook();
  };

  App.vLibrary = function (skills) {
    var cards = [], seen = {};
    DATA.meetings.forEach(function(m){m.segs.forEach(function(s,i){
      if(seen[s.n] || (skills && !/結|急救|方向|指南|露營|路標|煮食|包紮/.test(s.n))) return;
      seen[s.n]=1;
      cards.push('<div class="activity-card" style="border:1px solid var(--line);border-radius:14px;padding:12px;background:#fff"><div style="font-size:24px">'+(s.ic||'📋')+'</div><h3 style="margin:4px 0">'+esc(s.n)+'</h3><p class="mut" style="font-size:12px">'+s.m+'分鐘 · '+esc(m.n)+'</p><button class="btn sm" onclick="App.activity(\''+m.tid+'\','+i+')">▶ 即開帶領卡</button></div>');
    });});
    var title = skills?'🪢 技能帶領卡':'🎮 活動（即開即用）';
    return '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><h2>'+title+'</h2><p class="mut">跟 ghmeeting 同款活動架：每個活動淨出名＋分鐘＋「▶ 即開」，詳細收埋喺卡入面。</p><div class="manual-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">'+cards.join('')+'</div></section>';
  };

  App.vCraft = function(){
    var crafts = [
      {n:'手繩', img:'assets/manual/details/friendship-bracelet.avif', d:'友誼手繩，彩色毛線，5分鐘'},
      {n:'再生紙', img:'assets/manual/details/recycled-paper.avif', d:'紙漿框，環保'},
      {n:'烹飪', img:'assets/manual/details/cooking.avif', d:'免火煮食，三文治'},
      {n:'營火圈', img:'assets/manual/details/campfire-circle.avif', d:'分享圈，圍圈坐'}
    ];
    return '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><h2>✂️ 工作紙 / 手工（即開即用）</h2><p class="mut">跟 ghmeeting 的工作紙庫同款：卡片只出重點，全文撳開先睇。</p><div class="manual-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">'+crafts.map(function(c){return '<div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="'+c.img+'" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>'+c.n+'</h3><p class="mut" style="font-size:12px">'+c.d+'</p><button class="btn sm" onclick="toast(\'即開即用：'+c.n+'\')">▶ 開教材</button></div>';}).join('')+'</div><div class="btns" style="margin-top:12px"><a class="btn sm ghost" href="#play">去活動庫 →</a><a class="btn sm ghost" href="#jungle">去森林故事 →</a></div></section>';
  };

  /* 工作紙庫：對應 ghmeeting #print + 舊 #sheets */
  App.vPrint = function(){
    var worksheets = (typeof Content!=='undefined' && Content.worksheetIndex) ? Content.worksheetIndex() : App.vCraft();
    return '<section class="card"><a class="back" href="#plan">‹ 返回目錄</a><h2>✂️ 工作紙＋歌曲</h2><p class="mut">內容較少，合併成兩個小分頁。</p><div class="subtabs compact-tabs"><button class="subtab cur" onclick="App.showMiniTab(this,\'worksheets\')">工作紙</button><button class="subtab" onclick="App.showMiniTab(this,\'songs\')">歌曲</button></div><div id="mini-worksheets">'+worksheets+'</div><div id="mini-songs" class="hidden"><h3>🎵 歌曲、口號、營火</h3><div class="manual-grid"><button class="activity-card" onclick="toast(\'🎵 播放團歌\')"><b>團歌</b><small>幼童軍團歌，跟住唱</small></button><button class="activity-card" onclick="toast(\'📣 開口號卡\')"><b>口號</b><small>日行一善，準備</small></button><button class="activity-card" onclick="toast(\'🔥 開營火流程\')"><b>營火</b><small>營火晚會流程</small></button></div></div></section>';
  };
  App.showMiniTab = function(btn, key){
    var root=btn.closest('.card'); if(!root)return;
    root.querySelectorAll('.subtab').forEach(function(x){x.classList.remove('cur');}); btn.classList.add('cur');
    root.querySelector('#mini-worksheets').classList.toggle('hidden',key!=='worksheets'); root.querySelector('#mini-songs').classList.toggle('hidden',key!=='songs');
  };
  App.vSheets = App.vPrint;

  App.vSongs = App.vPrint;

  /* 活動章工具書：先按官方組別，再按章；官方要求與建議用小分頁分開。 */
  App.badgeGroups = function(){return [
    {id:'core-skills',name:'童軍技能（綠色）',icon:'🟢',items:['露營章','探險章']},
    {id:'core-care',name:'關己愛人（紅色）',icon:'🔴',items:['愛護動物章','共融章','急救章','家務章','道路安全章','水上安全章','防騙先鋒章','禁毒章','保護兒童章','社區應急先鋒章','環保先鋒章','機電先鋒章']},
    {id:'core-community',name:'國家與社區（黃色）',icon:'🟡',items:['香港歷史章','國家安全大使章']},
    {id:'interest-creative',name:'多元創藝（藍色）',icon:'🔵',items:['藝術章','手藝章','娛樂章','資訊科技章','語言章','媒體製作章','音樂章（三級制度）','攝影章','寫作章']},
    {id:'interest-science',name:'科學與大自然（青色）',icon:'🟦',items:['天象章','園藝章','科學章','氣象章','地球部落計劃 – 走塑達人章、自然守護者章、日光善用者章']},
    {id:'interest-sport',name:'運動與愛好（橙色）',icon:'🟠',items:['射箭章（三級制度）','田徑章（三級制度）','閱讀章','獨木舟章（三級制度）','搜集章','烹飪章','單車章','公園定向章（三級制度）','寵物章','體適能章（三級制度）','風帆章','水手章','運動章','游泳章（三級制度章）','世界友誼章']},
    {id:'other',name:'其他徽章',icon:'🏅',items:['宗教章','童軍先修章']}
  ];};
  App.vBadge = function(){
    var groups=App.badgeGroups();
    return '<section class="card"><a class="back" href="#plan">‹ 返回目錄</a><h2>🏅 活動章工具書</h2><p class="mut">先揀官方目錄分類，再揀活動章。章內分開「官方要求」及「建議考核」。</p><div class="tipcard">🧰 呢頁係實戰用工具書，不是紀錄冊：只提供官方內容及建議考核方式，不儲存成員考核。要記錄，請到領袖另外申請的紀錄追蹤系統。</div><div class="badge-group-grid">'+groups.map(function(g){return '<button class="badge-group-card" onclick="App.openBadgeGroup(\''+g.id+'\')"><span>'+g.icon+'</span><b>'+g.name+'</b><small>'+g.items.length+' 個章</small></button>';}).join('')+'</div><div id="badge-library" class="badge-library"><p class="empty">揀一個組別開始。</p></div></section>';
  };
  App.openBadgeGroup = function(id){var g=App.badgeGroups().find(function(x){return x.id===id;});if(!g)return;var el=document.getElementById('badge-library');if(!el)return;el.innerHTML='<div class="badge-library-head"><h3>'+g.icon+' '+g.name+'</h3><button class="btn sm ghost" onclick="document.getElementById(\'badge-library\').innerHTML=\'<p class=\\\"empty\\\">揀一個組別開始。</p>\'">收起</button></div><div class="badge-name-grid">'+g.items.map(function(n){return '<button class="badge-name-card" onclick="App.openBadge(\''+esc(n)+'\')"><span>🎖️</span><b>'+n+'</b><small>開啟章內容 ›</small></button>';}).join('')+'</div>';};
  App.officialBadges={
    '露營章':{purpose:'透過露營的體驗，讓幼童軍學習自理能力，認識露營的知識及合作精神。',items:['進行不少於一晚的戶外露營','準備露營的裝備','協助架搭及拆卸一個營幕','懂得在營地中處理及保養一個已架搭之營幕','架設一個簡單的營地紮作','在營地協助烹調、分發及善後一次家常膳食','懂得露營的基本衞生常識及安全守則','協助清理露營後的場地'],page:27},
    '藝術章':{purpose:'鼓勵幼童軍展現創意及發展多元化的美術技巧。',items:['選擇下列其中三種不同的藝術媒介，分別製作一件藝術作品，展現美術技巧或想像力，並向領袖闡述意念及所運用的技巧：繪畫、雕塑、手工藝、版畫、數碼藝術','如選擇其他藝術媒介，須先取得領袖同意'],page:30},
    '閱讀章':{purpose:'培養幼童軍閱讀風氣及習慣，認識如何使用工具書和知曉怎樣在圖書館尋找書籍。',items:['列出最近閱讀過的書本及作者，向領袖講述其中三本內容；三本須自行選擇，最少包括一本故事書及一本寫實書籍','知曉如何保護及儲存書籍','知曉如何運用中英文字典及地圖集或街道圖','向領袖解釋圖書館書籍如何陳列安放，並找出一本小說'],page:33},
    '娛樂章':{purpose:'讓幼童軍策劃及表演節目，並從中學習與人溝通及合作。',items:['甲組選一項：編排及演出一套戲劇；或在領袖指導下擔任戲劇演出的幕後工作','乙組選一項：組織兒童唱一首歌；領導幼童軍團跳土風舞；或製作簡單樂器並用以伴奏一首歌曲','丙組選一項：演唱兩首民歌；表演三種惹笑動作；講至少五分鐘故事；用樂器奏一首簡單歌曲；或表演三個以上連串雜技或魔術'],note:'如事前取得領袖同意，可做其他水準相同的娛樂性節目。',page:41},
    '勞作章':{purpose:'讓幼童軍認識如何運用及保養家居中常見的工具。',items:['示範鎚子、鋸子、螺絲批、士巴拿及鉗子的使用及保養方法','在領袖認許下，使用上述最少一項工具，以一種手藝方式設計及製造一件家庭或團部有用的物品，並介紹其用途及保養方法'],note:'需注意幼童軍是否正確使用工具及相關保護衣物。',page:45},
    '科學章':{purpose:'培養幼童軍對科學探究的興趣及求證精神。',items:['示範兩個自選科學實驗，向領袖解釋實驗及結論；實驗應以幼童軍自己發現為據','完成以下其中兩項實驗：製作裝有燈泡、電池及開關掣的模型；以尼龍布及紙製作風箏並比較性能；證明白光由多種顏色組成；製作顯微鏡或潛望鏡並解釋原理；記錄一星期每天同一時間的風向、風速、視野、雨量、溫度及雲；研究植物缺水缺光的情況；從飽和化學溶液析出晶體；證明金屬受熱膨脹；準備隱形墨水並解釋原理；證明聲音的傳播'],page:61},
    '語言章':{purpose:'培養幼童軍非母語表達能力。',items:['除了母語之外，用任何一種語言正確指出鄰近一帶的商店、警署、郵局、教堂、油站及酒店所在地','回答居所、學校或旅部附近公共交通服務情況的簡單問題','解釋「單程路」、「路不通行」、交通燈號及單程票等意思','說出一星期七天和一年十二個月的名稱，並懂得日期的說法'],page:49},
    '寵物章':{purpose:'透過了解寵物的需要，以及親自照料寵物，培養幼童軍的責任感。',items:['飼養一隻寵物，記錄三個月內其生活習慣及生長過程，包括特徵及變化，並附上照片或圖片','知曉其原產地、所需的特別照顧，以及辨別及處理普通病症的方法'],page:54},
    '天象章':{purpose:'透過認識香港常見天象及學習相關觀測安全事項，引發幼童軍對夜空探索的興趣，並明瞭星空保育的重要性。',items:['認識黃道十二星座的名稱及主要特徵','認識月相、日食和月食','認識太陽系各個行星的名稱及主要特徵','明瞭觀星禮儀及光污染對觀星的影響','製作針孔投影儀安全觀測太陽','完成以下其中一項：參加一次晚間戶外觀星活動，觀看月球或光亮的星星；或參觀香港太空館'],note:'進行太陽觀測時，必須注意保護眼睛。',page:31},
    '攝影章':{purpose:'讓幼童軍學習攝影基本原則及技巧，培養對攝影的興趣。',items:['拍攝一套12張照片或一段3分鐘長的錄像，記錄一次旅行或活動，內容包括不同主體，並分享作品及講述活動或旅行概況','與領袖討論攝錄器材的基本操作，包括曝光、光圈、快門、感光度（ISO）及焦距，以及如何運用不同拍攝模式獲取效果'],page:54},
    '單車章':{purpose:'讓幼童軍了解騎單車前的準備事項，掌握騎單車的基本知識以策安全，並能展示基本技能。',items:['擁有或時常使用一輛大小適合的單車','正確地上車及下車','保持單車整潔及上油，並替輪胎打氣','明瞭保持單車性能良好的重要性並履行之','明瞭停放單車時上鎖的重要性','知曉及協助修補輪胎','在領袖觀察下，駕單車完成指定短路程，正確運用交通規則內的手號和守則'],note:'考取此章前應已懂得騎乘雙輪單車；騎單車時必須戴上合適個人保護裝備。',page:39},
    '烹飪章':{purpose:'培養幼童軍對烹飪的興趣，了解煮食計劃、正確技巧及健康地進行飲食。',items:['與領袖討論兩種不同烹飪方法的優缺點及均衡飲食習慣的重要','預備一份足夠兩人食用的中式或西式膳食，包括計劃餐單、烹調、餐桌安排、上菜及清理餐桌，並先獲主考同意','預備熱飲品及小食，作為下午茶或輕便午餐','向領袖解釋廚房及煮食的安全措施及衞生守則'],note:'菜式不可純以市面購買的預製食品完成，但可使用預製食品作為其中烹調食材。',page:38},
    '搜集章':{purpose:'讓幼童軍透過搜集過程，思考搜集物件的意義，學習儲存、分類與保養的技巧。',items:['在領袖同意下選定一種物件，討論搜集計劃、選擇理由及搜集與保存方法','最少用四個月搜集該物件，並整齊、有系統地整理；如已開始搜集，完成第一項後仍須繼續搜集四個月'],page:36},
    '園藝章':{purpose:'讓幼童軍了解植物的特性及栽培過程，培養對園藝的興趣。',items:['介紹四種香港常見植物，包括特徵、生長時節及所在地方','用不少於一個月栽種一株植物，記錄由種子開始的生長、栽種過程及特性，包括每星期生長情況、土壤氣候等注意事項、繁殖栽種方法及控制或培養生長','知道栽種該植物所需用具，以及適當使用及保養方法'],page:57},
    '讀圖章':{purpose:'讓幼童軍學習基本閱讀地圖的技巧。',items:['在地圖或街道圖上指出團部及居所位置，知曉主要圖例，並解釋自選名勝地點在地圖上的表示方法','製作合比例的250米小模型，顯示相距50米的等高線','明瞭上述內容，以便形容地圖所指一條5,000米長路程上會見到的事物','正確把地圖較正位置，並知曉如何使用指南針'],note:'建議採用地政總署測繪處出版的1:20,000地圖；此章為金紫荊獎章其中一項考核項目。',page:50},
    '音樂章':{purpose:'培養幼童軍對音樂的興趣，並能展示基本技能。',items:['清楚辨認五線譜上的音名，並解釋六種基本音樂術語，包括高音譜號、低音譜號、休止符及音符等','唱出或演奏兩首自選的不同風格歌曲','完成以下任何兩項：視奏或視唱指定樂曲；辨識樂器結構；保養樂器或聲線；以拍掌完成三段指定節奏；指出兩段樂曲所用樂器；認識歌劇、芭蕾舞或民謠歌曲的故事背景；創作六至八小節音樂；為一段音樂譜上新歌詞'],page:51},
    '電腦章':{purpose:'讓幼童軍學習電腦知識及使用技巧，了解知識產權及誠實使用電腦的重要性。',items:['認識電腦系統各類裝置，並附以簡單圖說明電腦主機、硬碟及常用輸入和輸出裝置','能將USB記憶體或記憶卡格式化','能在USB記憶體或記憶卡儲存、剪下、複製、貼上及刪除檔案','明瞭雲端儲存的簡單運作原理及其好處和壞處','利用軟件完成以下任何兩項：製作一件多媒體作品；用中文或英文為旅團編寫一則包括文字及圖案的A4通告或告示；製作最少5張投影片介紹自己或旅團','利用電郵將第5項檔案附夾並傳送給領袖','明瞭尊重知識產權及誠實使用電腦的重要性'],page:37},
    '體操章':{purpose:'讓幼童軍認識體操運動並能展示基本技能。',items:['初級（紅色）：前滾翻；手倒立（靠牆）；分腿騰越（越過同伴或木馬）；正握低單槓懸垂，收腹穿腿成反臂懸垂（1.2米），或在平衡木完成兩個平衡動作及兩個轉體動作並由另一端下木','中級（黃色）：魚躍前滾翻越過0.6米障礙物；側手翻；由單掛膝懸垂開始勾單膝上成騎撐（低單槓1.2米），或分腿騰越（木馬／木箱高1米）','高級（綠色）：頭手翻；在一直線上連續兩次側手翻；低槓腹迴環上（1.2米），或分腿騰越（木馬／木箱高1米）'],note:'此章為三級制度章，初級、中級及高級分別為紅色、黃色及綠色。動作應由合資格人士按安全要求指導及評核。',page:44},
    '獨木舟章':{purpose:'鼓勵幼童軍參與獨木舟活動並能展示基本技能。',items:['初級（一星章）：通過香港童軍總會游泳測試，並考獲香港獨木舟總會少年獨木舟海馬章或同等資歷','中級（二星章）：通過香港童軍總會游泳測試，並考獲香港獨木舟總會少年獨木舟海豹章或同等資歷','高級（三星章）：通過香港童軍總會游泳測試，並考獲香港獨木舟總會少年獨木舟海象章或同等資歷'],page:35},
    '射箭章':{purpose:'讓幼童軍初步理解及學習射箭知識，以啟發及培養其興趣。',items:['知識：認識弓的主要部分、常用射箭輔助工具，以及五色十環靶面的計分方法','訓練：明白並遵守射箭安全規則、示範正確射箭基本姿勢、懂得記錄積分，並完成不少於8小時訓練','實射初級：10米、122厘米五色十環靶、連續6箭；反曲弓不少於24環或複合弓不少於30環','實射中級：10米、122厘米五色十環靶、連續18箭；反曲弓不少於108環或複合弓不少於126環','實射高級：10米、122厘米五色十環靶、連續36箭；反曲弓不少於288環或複合弓不少於324環；或按官方列出的18米／30米高級實射標準完成'],note:'此章為三級制度章；考取較高一級時，知識部分無須重考，但訓練四項仍須重新完成。實射必須由合資格教練按安全要求指導及評核。',page:29},
    '運動章':{purpose:'鼓勵幼童軍主動認識運動技能及安全守則，培養平日做運動的興趣及習慣。',items:['對兩種運動有廣泛認識','對其中一項具專門技能及知識，並經常參加該項活動','知曉如何保養所選運動所需的用具及服裝','在所有幼童軍遊戲及活動中表現良好體育精神','明瞭每次運動後沐浴或更衣的重要性，以及保護足部的重要性'],page:63},
    '田徑章':{purpose:'鼓勵幼童軍參與田徑活動，了解相關安全知識，並能展示基本技能。',items:['必須完成官方列出的全部四個田徑項目','初級（紅色）及格分數：22分','中級（黃色）及格分數：28分','高級（綠色）及格分數：34分'],note:'目前已核實官方目的、四項必修制度、三級顏色及評分門檻；四個具體田徑項目仍待從官方第32頁完整提取，故本章暫不計入完成百分比。',page:32},
    '游泳章':{purpose:'考核幼童軍的游泳技能。',items:['初級（紅色）：跳入水中；呼吸練習；俯浮滑進；仰浮滑進；俯浮划水10米；仰浮划水10米；拯溺式背泳10米；以胸泳、捷泳或背泳游25米','中級（黃色）：以一種泳式游25米並踏水1分鐘；潛水約1.25米而不觸底；冬菇式浮水並以不同前、背泳完成；插潛或滑水至最遠距離；以正確比賽姿態用胸泳或蝶泳游25米','高級（綠色）：垂直踏水3分鐘；游200米並潛泳最少5米；不用扶梯或他人協助從深水端爬上池畔；以良好站立姿態跳起、騰空及插入水中'],note:'此章為三級制度章，並為金紫荊獎章其中一項考核項目。所有水上考驗須由合資格人士按安全要求指導及評核。',page:64},
    '寫作章':{purpose:'培養幼童軍寫作興趣。',items:['創作一個故事或一首詩','寫一封不少於200字的信給親友，描述成為幼童軍後參與過最有意義或最有趣的事，並正確在信封寫上收信人、發信人及地址','發出一封電郵給親友，邀請他們參加團部活動，或向他們表達對特別事件的謝意'],page:68},
    '氣象章':{purpose:'認識天氣變化對日常生活的影響及需注意的事項。',items:['懂得利用大眾傳播媒介或電子工具獲取天氣資訊','認識氣溫、風、降雨及紫外線指數等天氣要素，並說出戶外活動時如何因應變化作出準備','懂得天氣警告發出後的注意事項，包括雷暴、暴雨及熱帶氣旋警告','認識雲的形成，並辨認層雲、積雲、卷雲及積雨雲','認識二十四節氣基本概念，並說出最少六個節氣及其特點','進行最少五天的天氣觀測，記錄個人對天氣的感覺，並與當時天氣資訊比較','完成以下兩項：製作海報或進行實驗描述水循環；製作測風儀模型；透過網上資源學習氣象知識並匯報'],page:66},
    '世界友誼章':{purpose:'讓幼童軍對世界童軍有更多認識。',items:['用不少於四個月完成剪貼簿，內容關於一個世界童軍組織成員國的民族生活方式、食物特色及風俗習慣','略知聯合國的組織、歷史、旗幟及其意義','向領袖列舉香港以外10個世界童軍組織成員國，並知道其中3個國家國旗的意義','曾與外國童軍通訊最少兩次'],page:67},
    '水上安全章':{purpose:'提升幼童軍的水上安全意識，使他們遇上水上意外時懂得如何協助。',items:['認識水上安全知識及守則','明瞭向成年人求助的重要性','在安全情況下示範手援：使用竹竿或木棒等棒類物品，或兩件緊縛在一起的衣物拯救近岸溺者','在安全情況下示範拋物：站在岸上將無負重繩索、水泡或其他浮物拋給離岸6米的溺者'],note:'所有示範必須在安全情況下進行，不應自行下水救人。',page:65},
    '園藝章':{purpose:'讓幼童軍了解植物的特性及栽培過程，培養對園藝的興趣。',items:['介紹四種香港常見植物，包括特徵、生長時節及所在地方','用不少於一個月栽種一株植物，記錄由種子開始的生長、栽種過程及特性，包括每星期生長情況、土壤氣候等注意事項、繁殖栽種方法及控制或培養生長','知道栽種該植物所需用具，以及適當使用及保養方法'],page:57},
    '探險章':{purpose:'讓幼童軍學習基本閱讀地圖的技巧，同時了解野外旅程前的準備及需關注事項，並明瞭戶外基本求生技能。',items:['明瞭地圖或街道圖上的主要圖例，並能指出旅團及居所的位置','製作一個合比例之 100 米高小模型，該模型應能顯示相距 20 米的等高線','明瞭上述第 1、2 點，以便能夠形容出由地圖所指的一條 5,000 米長的路上會見到的事物','懂得利用地圖及西維氏（Silva-type）指南針正置地圖、指出前進方向或地標的方位','明瞭一日遠足行程前所需要之準備工作，包括旅程費用、適當之服裝、鞋襪、救傷用品及食物等','策劃及參加一次不少於六公里之幼童軍遠足活動'],page:28},
    '愛護動物章':{purpose:'提升幼童軍對愛護動物的意識，提倡善待動物、了解動物的需要及學習尊重生命。',items:['向領袖講述動物的需要及如何選擇合適的寵物','明瞭飼養寵物的責任','認識一種寵物的生命週期、生活習性、常見疾病、棲息地及生存的基本需要'],page:29},
    '共融章':{purpose:'讓幼童軍學習認識、接納和關懷社會上的弱能人士，與其融洽共處並理解他們的特質及需求。',items:['認識以下一種弱能人士的類別及其特質：弱智、弱聽／失聰、弱視／失明、身體弱能或自閉症','簡介特能童軍活動','參與一次傷健旅團聯合活動或一次弱能人士服務活動，並作簡單記錄'],page:30},
    '道路安全章':{purpose:'認識道路安全及保障行人和其他道路使用者。',items:['認識一些輔助行人及其他道路使用者的設施和交通標誌','知曉踏單車的安全守則','知曉乘客的安全守則'],page:33},
    '水上安全章':{purpose:'認識水上安全及遇到水上意外時的求助方法。',items:['知道基本的水上安全守則','向他人推廣水上安全規則'],page:34},
    '急救章':{purpose:'讓幼童軍明白急救的目的及原則、求助的程序，並知曉日常生活中導致意外的因素及簡單處理方法。',items:['明瞭急救原則，能講出日常生活及戶外活動的危險因素，以及進行急救前的首要工作，例如向成年人求助及報警','認識輕微／嚴重出血及有異物傷口的處理方法','認識燒傷與燙傷的成因、預防方法及簡單處理方法','認識昏厥的徵狀及簡單處理方法','認識扭傷的徵狀及簡單處理方法','完成《幼童軍急救章手冊》內第一至第五課的討論及溫習項目','列舉個人藥囊的各項應用物品','示範三角繃帶的兩種紮法：大手掛及三角手掛'],note:'需確保幼童軍正確使用急救用品；請參閱官方《幼童軍急救章手冊》。',page:31},
    '家務章':{purpose:'鼓勵幼童軍分擔家務並能展示基本技能。',items:['煎煙肉或香腸，煮蛋和煮飯','佈置飯桌及懂得進膳時之禮貌（此項可與第一項同時進行）','洗碗碟並知道怎樣處理用過之鍋鑊、刀叉、筷子、玻璃器皿等','洗及熨旅巾','在制服上縫上一個徽章或鈕扣','整理睡床','清潔門窗、銀器或銅器'],page:32},
    '香港歷史章':{purpose:'鼓勵幼童軍探索香港歷史，讓他們了解本地的人和事。',items:['在與領袖商討後，以下列任何一個主題製作一本剪貼簿或一個互聯網站：一名本港歷史名人的事蹟','一個香港的古舊建築','一件香港歷史大事','其他經領袖同意且對本港具相當歷史意義的題目'],page:36},
    '防騙先鋒章':{purpose:'教育青少年辨識和應對詐騙行為，提高警覺性及自我保護能力。',items:['認識常見詐騙手段和策略，例如詐騙電話、詐騙郵件及網絡詐騙','辨識詐騙特徵和警示訊號，例如不實承諾、高壓銷售及虛假資訊','學習應對策略，例如保持警惕、保護個人資料、報告詐騙行為及尋求幫助'],note:'各團團長可指派合適領袖教導及主考；可因應成員能力適當調適教學內容及考驗難度。',page:35},
    '保護兒童章':{purpose:'教育青少年辨別常見兒童侵害情況及保護自己。',items:['認識常見的兒童侵害情況，例如身體傷害和性侵害','學習自身或身邊的人遇到兒童被侵害時的處理方法','按適用的官方保護兒童課程完成指定學習內容'],note:'由合適領袖教導及主考；內容及考驗難度可按成員能力適當調適。',page:35},
    '禁毒章':{purpose:'教育青少年認識常見毒品的種類與禍害，了解接觸毒品的原因及相關刑罰，提高警覺性。',items:['認識依托咪酯、氯胺酮、大麻、冰毒、可卡因及海洛英，以及其對身體的禍害','認識與毒品相關的刑罰','認識常見的吸毒場所與原因','認識應對毒品及求助方法'],note:'團長及主考可因應成員能力，適當調整教學內容及考驗難度。官方資料來源包括警務署毒品調查科及保安局禁毒處。',page:35},
    '社區應急先鋒章':{purpose:'培養幼童軍的消防安全及基本應急意識。',items:['完成一小時網上課程後，向領袖知悉相關內容，並與其他幼童軍簡單分享或討論所學：火警逃生；以及消防安全及家居防火資訊','參與兩小時認可面授訓練，並通過評核'],note:'網上課程由香港消防處提供；團長及主考可按成員能力調整教學內容及考驗難度。',page:35},
    '機電先鋒章':{purpose:'培養幼童軍認識能源、電器安全及節約能源。',items:['認識新能源、可再生能源、能源效益及節約能源的重要性','了解太陽能等可再生能源的應用及其對環境的好處','認識10件常見家用電器的正確使用方法','列舉5類電器的常見危險及正確預防方法','承諾實踐節約能源及綠色生活','完成參觀機電工程署總部，或製作附有10件家居電器照片或圖畫的使用及安全檢查清單'],note:'可按成員能力調整教學內容及考驗難度。官方參考資料包括能源資訊網及家居電氣安全手冊。',page:35},
    '環保先鋒章':{purpose:'培養成員保護環境的責任感及領導能力，鼓勵以積極行動保持地球永續環境。',items:['認識香港的環保政策及措施','認識本地及全球環境議題','認識人與環境的關係','認識保護環境的方法','完成由環境運動委員會委任的環保先鋒導師教授的環保內容','完成一項由環境運動委員會安排的環境教育培訓活動','完成一項由香港童軍總會或其他機構舉辦的環境教育培訓活動'],note:'官方頁面標示為先導計劃；培訓活動須按環境運動委員會及香港童軍總會的安排進行。',page:35},
    '國家安全大使章':{purpose:'培養幼童軍對《基本法》、國家、法治及國家安全的基本認識。',items:['明暸《基本法》第一條的內容','了解中華人民共和國的首都及重要城市、地理位置，以及代表國家的事物和有趣的國家事件或事物','說出20個國家安全重點領域，並認識國家和香港常見創新科技在日常生活的應用','認識執法和服務市民的部門、其工作及個人的公民責任','參觀國家安全展覽廳，或參加以國家安全為主題的展覽、活動或比賽'],note:'可按成員能力調整教學內容及考驗難度。',page:35}
  };
  App.openBadge = function(name){var official='https://prog.scouting.org.hk/cub/training-scheme/', spec=App.officialBadges[name], officialHtml=spec?'<p><b>目的：</b>'+esc(spec.purpose)+'</p><ol>'+spec.items.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol>'+(spec.note?'<p class="safe">'+esc(spec.note)+'</p>':'')+'<p class="mut">官方綱要頁 '+spec.page+'</p>':'<p>官方內容正在按 2026 年第十版逐章內置。</p>';Modal.open('<h2>🎖️ '+esc(name)+'</h2><div class="subtabs badge-detail-tabs"><button class="subtab cur" onclick="App.switchBadgeTab(this,\'official\')">官方要求</button><button class="subtab" onclick="App.switchBadgeTab(this,\'suggest\')">建議考核</button></div><div id="badge-official">'+officialHtml+'<p class="mut">官方活動章內容版本：幼童軍訓練綱要網上版。</p></div><div id="badge-suggest" class="hidden"><p>建議領袖流程：</p><ol><li>先逐項讀清楚要求及安全限制。</li><li>先示範，再讓成員按要求完成。</li><li>按官方要求即場判斷是否達標；不達標便安排再試。</li></ol><p class="mut">這一頁只是使用方法，不取代官方要求。</p></div><div class="attachment-row"><a class="btn ghost" href="'+official+'" target="_blank" rel="noopener">📎 開官方訓練綱要附件</a></div><button class="btn" onclick="Modal.close()">關閉</button>');};
  App.switchBadgeTab = function(btn,key){var root=btn.closest('.mbox');root.querySelectorAll('.badge-detail-tabs .subtab').forEach(function(x){x.classList.remove('cur');});btn.classList.add('cur');root.querySelector('#badge-official').classList.toggle('hidden',key!=='official');root.querySelector('#badge-suggest').classList.toggle('hidden',key!=='suggest');};

  App.vSongs = App.vPrint;

  App.vSong = App.vSongs;

  App.vSafety = function(){
    return '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><h2>🛡️ 安全（RAM風險評估）</h2><div style="border-radius:12px;overflow:hidden;max-height:150px;margin-bottom:8px"><img src="assets/manual/safety.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div><p class="mut">跟 ghmeeting 工具頁同款：即開即用卡片。</p>'+
      '<div class="manual-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))"><div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/ram-checklist.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>風險評估</h3><p class="mut" style="font-size:12px">RAM清單，checklist</p><button class="btn sm" onclick="Modal.open(\'<h2>RAM風險評估</h2><p>天氣·場地·人·物資·活動，5項檢查</p>\')">▶ 開清單</button></div>'+
      '<div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/sfh-principles.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>安全原則</h3><p class="mut" style="font-size:12px">SFH原則，兩人同行</p><button class="btn sm">▶ 開原則</button></div>'+
      '<div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/first-aid.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>急救</h3><p class="mut" style="font-size:12px">擦傷·包紮·求助</p><button class="btn sm">▶ 開急救卡</button></div></div></section>';
  };

  App.vTools = function(teams){
    var isTeams = !!teams;
    var base = '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><h2>'+(isTeams?'🐾 小隊計分':'🎲 快鍵（即插即用）')+'</h2><p class="mut">跟 ghmeeting 快鍵頁同款：即撳即用，唔影響今場流程。</p>';
    if(isTeams){
      base += '<div id="leadscore"></div></section>';
    } else {
      base += '<div class="tk-grid"><button class="tk-btn" onclick="Lead.whistle()"><b>🤫 安靜訊號</b><small>5秒安靜·望住我</small></button><button class="tk-btn" onclick="Lead.horn()"><b>📣 集合</b><small>吹哨·全體集合</small></button><button class="tk-btn" onclick="Lead.pick()"><b>🎲 抽籤</b><small>隨機抽一個人</small></button><a class="tk-btn" href="#teams"><b>🐾 小隊計分</b><small>紅黃藍綠四隊</small></a><button class="tk-btn" onclick="App.go(\'#book?sub=six\')"><b>🌈 六色分工</b><small>小隊色·隊旗</small></button><button class="tk-btn" onclick="App.go(\'#book?sub=ceremony\')"><b>🎪 儀式</b><small>旗禮·宣誓·敬禮</small></button></div>'+
        '<h3>⏱️ 倒數計時</h3><div style="display:flex;gap:8px;align-items:center"><label style="flex:1">分鐘 <input id="toolMinutes" type="number" min="1" max="120" value="5" onchange="Tools.reset()"></label><div id="toolClock" role="status" class="tool-clock" style="font-size:32px;font-weight:800">05:00</div></div><div class="btns"><button class="btn gr" onclick="Tools.start()">開始</button><button class="btn" onclick="Tools.stop()">暫停</button><button class="btn ghost" onclick="Tools.reset()">重設</button></div></section>';
    }
    return base;
  };

  /* === 路由：對齊 ghmeeting 的 5+5，同時兼容舊連結，保留 sheets/skills 獨立 tab === */
  App.route = function(){
    var rawHash = location.hash || '#plan';
    var tab = rawHash.split('?')[0].slice(1) || 'plan';
    var match = rawHash.match(/[?&]tid=([^&]+)/);
    if(tab === 'prep' && match){
      var tid = decodeURIComponent(match[1]);
      if(DATA.meetings.some(function(m){return m.tid===tid;})) { 
        var s = Flow.st();
        setTid(tid);
        if (s.tid !== tid) s.done = {};
        s.tid = tid; s.on = 1; s.min = 0; s.done.pick = 1; Flow.save(s);
        tab='prep';
      }
    }

    // 舊版兼容對照：只轉換 craft/songs/safety/official，保留 sheets/skills 獨立
    var legacyMap = {
      'craft':'print',
      'songs':'print',
      'song':'print',
      'safety':'tools',
      'official':'plan'
    };
    if(legacyMap[tab]){
      if(tab==='official'){
        try { window.open('https://drive.google.com/file/d/1qI5aUCFZE-sAGDDeloE8ubdGXifZg8P2/view','_blank','noopener'); } catch(e){}
        tab='plan';
      } else {
        tab=legacyMap[tab];
      }
    }

    var render = {
      prep: function(){ return (typeof App.vPrep!=='undefined') ? App.vPrep() : '<section class="card"><h2>準備中</h2></section>'; },
      official: App.vOfficial,
      plan: App.vPlan,
      meet: function(){
        var q = {};
        (location.hash.split('?')[1]||'').split('&').forEach(function(p){var kv=p.split('=');if(kv[0]) q[kv[0]]=decodeURIComponent(kv[1]||'');});
        if(q.tid) {
          var m = DATA.meetings.find(function(x){return x.tid===q.tid});
          if(m && typeof App.vMeetDetail!=='undefined') return App.vMeetDetail(m);
        }
        if(typeof App.vMeetList!=='undefined') return App.vMeetList();
        return App.vPlan();
      },
      lead: function(){ return (typeof oldLead!=='undefined' && oldLead) ? oldLead() : (typeof App.vLead!=='undefined' ? App.vLead() : '<section class="card"><h2>帶領</h2></section>'); },
      book: App.vBook,
      uniform: App.vUniform,
      ceremony: App.vCeremony,
      jungle: function(){ if(typeof Jungle!=='undefined'&&Jungle.view) return Jungle.view(); return '<section class="card"><h2>🌳 森林故事</h2><p class="mut">文字版可離線使用。</p></section>'; },
      play: function(){return App.vLibrary(false);},
      craft: App.vCraft,
      songs: App.vSongs,
      song: App.vSongs,
      badge: App.vBadge,
      safety: App.vSafety,
      sheets: App.vSheets,
      print: App.vPrint,
      skills: function(){return App.vLibrary(true);},
      teams: function(){return App.vTools(true);},
      tools: function(){return App.vTools(false);},
      pack: function(){ return (typeof oldPack==='function') ? oldPack() : App.vPrint(); },
      track: function(){ return (typeof oldTrack==='function') ? oldTrack() : '<section class="card"><h2>記錄</h2></section>'; }
    };

    var fn = render[tab];
    if(!fn){
      try { oldRoute(); } catch(e){ document.getElementById('view').innerHTML=App.vPlan(); }
      document.querySelectorAll('#topnav a, #tabbar a').forEach(function(a){
        var t = a.dataset.tab;
        a.classList.toggle('on', t===tab);
        a.classList.toggle('cur', t===tab);
      });
      handleOffline();
      if(typeof Flow!=='undefined') Flow.render();
      return;
    }

    App.tab=tab;
    try {
      document.getElementById('view').innerHTML=fn();
      /* 全部一般內容頁保底提供返回目錄，避免任何入口走入死胡同。 */
      if (tab !== 'plan' && tab !== 'lead' && tab !== 'prep' && tab !== 'official' && !document.querySelector('#view .back')) {
        var first = document.querySelector('#view > section');
        if (first) first.insertAdjacentHTML('afterbegin','<a class="back route-back" href="#plan">‹ 返回集會目錄</a>');
      }
    } catch(e){
      document.getElementById('view').innerHTML='<section class="card"><h2>出錯</h2><p>'+esc(e.message)+'</p></section>';
    }

    document.querySelectorAll('#topnav a, #tabbar a').forEach(function(a){
      var t = a.dataset.tab;
      var isOn = (t===tab) || (tab==='craft' && t==='print') || (tab==='songs' && t==='print') || (tab==='safety' && t==='tools');
      a.classList.toggle('on', !!isOn);
      a.classList.toggle('cur', !!isOn);
    });

    handleOffline();
    if(typeof Flow!=='undefined') Flow.render();

    if(['play','craft','songs','safety','jungle','skills','teams','tools','sheets','print','song'].indexOf(tab)>=0){
      var fb = document.getElementById('flowbar');
      if(fb && !Flow.on()){ fb.className=''; fb.innerHTML=''; }
    }
    if(tab==='teams' && typeof Lead!=='undefined' && Lead.renderScore) Lead.renderScore();
    window.scrollTo(0,0);
  };

  var origMark = Flow.mark;
  Flow.mark = function(k,quiet){origMark(k,quiet);if(App.tab==='prep')App.route();};

  if(typeof Lead!=='undefined'){
    Lead.full = function(){var el=document.documentElement;if(el.requestFullscreen){var p=el.requestFullscreen();if(p&&p.catch)p.catch(function(){});} if(typeof Flow!=='undefined') Flow.mark('lead',true); toast('⛶ 全螢幕帶領中');};
  }
})();

var Tools = {
  seconds:300, timer:null,
  time:function(){return String(Math.floor(Tools.seconds/60)).padStart(2,'0')+':'+String(Tools.seconds%60).padStart(2,'0');},
  draw:function(){var e=document.getElementById('toolClock');if(e)e.textContent=Tools.time();},
  stop:function(){clearInterval(Tools.timer);Tools.timer=null;},
  reset:function(){Tools.stop();var e=document.getElementById('toolMinutes');Tools.seconds=Math.max(1,Math.min(120,Number(e&&e.value)||5))*60;Tools.draw();},
  start:function(){if(Tools.timer)return;if(Tools.seconds<=0)Tools.reset();Tools.timer=setInterval(function(){Tools.seconds--;Tools.draw();if(Tools.seconds<=0){Tools.stop();if(typeof Lead!=='undefined'&&Lead.beep)Lead.beep();toast('⏱️ 時間到！');}},1000);}
};
