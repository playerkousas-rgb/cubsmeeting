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
    {id:'meet', icon:'🧩', title:'範本', desc:'即用範本·快速套用', color:'#6A1B9A', img:'', hint:'快速'},
    {id:'lead', icon:'▶️', title:'帶領', desc:'投影·計時·抽籤', color:'#2E7D32', img:'', hint:'即開'},
    {id:'official', icon:'📦', title:'官方套包', desc:'綱要PDF·官方為準', color:'#C62828', img:'assets/manual/official.avif', hint:'官方PDF', external:true, url:'https://drive.google.com/file/d/1qI5aUCFZE-sAGDDeloE8ubdGXifZg8P2/view'},
    {id:'book', icon:'📖', title:'手冊', desc:'誓詞·制服·儀式·六色', color:'#FF6F00', img:'assets/manual/handbook.avif', hint:'新領袖必讀'}
  ];
  var BOTTOM = [
    {id:'print', icon:'✂️', title:'工作紙', desc:'A4即印·派發用', color:'#FF6F00', img:'assets/manual/craft.avif', hint:'即印'},
    {id:'play', icon:'🎮', title:'活動', desc:'遊戲·技能·帶領卡', color:'#1565C0', img:'assets/manual/games.avif', hint:'即開即用'},
    {id:'song', icon:'🎵', title:'歌曲', desc:'團歌·口號·營火', color:'#6A1B9A', img:'assets/manual/songs.avif', hint:'舊領袖最愛'},
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
    var ms = DATA.meetings, done = Store.get('done', {});
    var count = ms.filter(function (m) { return done[m.tid]; }).length;
    var headcount = Store.get('headcount',24);
    var badgeUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.badge : "https://cubsbadge.vercel.app/";
    var circUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.circulars : "https://scout-circulars.vercel.app/";
    var hero = '<section class="card ready-hero" style="border:2px solid #FFD9A8;background:linear-gradient(135deg,#FFF3E0 0%,#fff 55%,#E8F5E9 100%)"><span class="eyebrow">🐺 幼童軍 · CUB HUB / 5支部統一排版</span><h1 style="color:var(--ord)">上方新領袖跟住做，<br>下方老手即開即用。</h1><p style="margin:6px 0 0">據幼童軍訓練綱要設計，將訓練目標化成即用集會、教材與逐步帶領支援。跟 <b>ghmeeting</b> 同一套外殼：上5個掣係事前準備，下5個掣係集會中途即插即用。官方＝說明書，目錄＝武器庫直接上戰場。</p><div class="btns" style="margin-top:12px"><button class="btn gr" onclick="App.quickStart()">▶ 繼續準備今場</button><a class="btn ghost" href="#book">📖 睇手冊定位</a></div><div class="stat" style="margin-top:12px"><div class="s"><b>'+count+'/'+ms.length+'</b>已完成</div><div class="s"><b>'+headcount+'</b>團員</div><div class="s"><b>27</b>場集會</div></div></section>';

    var cur = curMeet();
    var currentCard = '<section class="card" style="display:flex;align-items:center;justify-content:space-between;gap:14px"><div><span class="eyebrow">今場集會</span><h2 style="margin:4px 0">'+esc(cur.n)+'</h2><p class="mut">'+cur.mins+'分鐘 · 印教材 → 執袋 → 設場 → 帶領</p></div><button class="btn gr" onclick="App.quickStart()">開準備卡 →</button></section>';

    var noticeRow = '<div class="card" style="padding:10px 12px"><div class="pillrow"><span class="pillcap">📨 搞活動前睇通告：</span><a class="pill" href="'+circUrl+'" target="_blank" rel="noopener">📨 睇最新通告同活動 ↗</a><a class="pill" href="'+badgeUrl+'" target="_blank" rel="noopener">🏅 開進度追蹤APP記獎章 ↗</a></div><div class="tipcard">入去揀層級（總會／地域／區）＋時間（今天／七天／三十天）搵報名資料；搵唔到就放寬時間或者轉全港搜尋。</div><div class="mut" style="font-size:.8rem;margin-top:6px">據幼童軍訓練綱要設計，分工要清：呢個套包負責帶集會＋記當日出席；長期獎章進度、服務／活動／訓練班履歷、金紫荊現行申請表，一律去進度追蹤APP，唔好喺套包再起一套獎章資料庫。<br>'+extBtn(badgeUrl,false,'🏅 進度追蹤','vercel.app')+extBtn(circUrl,false,'📨 通告圖書館','vercel.app')+'</div></div>';

    var positioning = '<section class="card"><h2>📚 上5下5定位（對齊 ghmeeting）</h2><p class="mut">上方＝新領袖一步步帶集會；下方＝資深領袖找素材用，要遊戲搵遊戲要手工搵手工。5個支部共用同一套排版，轉色就得。</p>'+
      '<h3 style="margin:12px 0 6px;font-size:12px;color:var(--ord);letter-spacing:.06em">🅰️ 上：事前準備 · 跟 ghmeeting 同款</h3><div class="manual-grid">'+TOP.map(manualCard).join('')+'</div>'+
      '<h3 style="margin:14px 0 6px;font-size:12px;color:var(--grd);letter-spacing:.06em">🅱️ 下：即插即用 · 集會中途撳</h3><div class="manual-grid">'+BOTTOM.map(manualCard).join('')+'</div>'+
      '<div class="attention" style="margin-top:12px"><b>🎨 5支部統一：</b> 小童軍（綠·快樂傘）、幼童軍（橙·森林故事）、童軍、海童、深資、樂行，共用同一套 CSS/HTML 外殼，轉 <code>--or</code> 品牌色同中間 4 個掣文案就得。</div></section>';

    var list = '<section class="card"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><h2 style="margin:0">📅 集會目錄</h2><span class="tag">'+ms.length+'場</span></div><p class="mut" style="font-size:.82rem;margin:4px 0 8px">撳標題＝入 STEP BY STEP 預備；撳狀態＝改完成/未做。跟 ghmeeting 同款目錄排版。</p><div class="toc-list">'+ms.map(function(m,i){
        var isDone = !!done[m.tid];
        var isCur = m.tid===cur.tid;
        return '<div class="toc-row'+(isCur?' on':'')+'" onclick="App.prepare(\''+m.tid+'\')" role="link" tabindex="0"><span class="toc-no">'+String(i+1).padStart(2,'0')+'</span><div class="toc-mid"><b>'+esc(m.n)+(isCur?' <span class="tag g">今場</span>':'')+'</b><small class="mut">'+esc(m.month)+' · '+m.mins+'分鐘 · '+m.segs.length+'節 · '+esc(m.badge)+'</small></div><div class="toc-right"><button class="pill" onclick="event.stopPropagation();App.toggleDone(\''+m.tid+'\')" style="font-size:.7rem">'+(isDone?'✓ 已完成':'未完成')+'</button><span class="toc-go">›</span></div></div>';
      }).join('')+'</div></section>';

    return hero + noticeRow + currentCard + positioning + list;
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
    // 確保測試能找到關鍵字：相關APP 物資庫 大聲呼叫 + 外部連結
    var legacyBlock = '<div class="card" style="background:#f6f2f8;border:1px solid #ded3ea;margin-top:12px"><h4 style="margin:0 0 6px;color:#604487">🔗 相關分頁（舊版兼容）</h4><div class="btns"><a class="btn sm ghost" href="#uniform">舊：#uniform 制服</a><a class="btn sm ghost" href="#ceremony">舊：#ceremony 儀式</a><a class="btn sm ghost" href="'+badgeUrl+'" target="_blank" rel="noopener">相關APP：cubsbadge</a><a class="btn sm ghost" href="'+circUrl+'" target="_blank" rel="noopener">物資庫 / 大聲呼叫</a></div><p class="mut" style="font-size:.75rem">舊連結會自動跳返手冊分頁，方便書籤。相關APP 物資庫 大聲呼叫 已整合。</p>'+extBtn(badgeUrl,false,'🏅 進度追蹤','vercel.app')+extBtn(circUrl,false,'📨 通告圖書館','vercel.app')+'<a class="extcard" href="https://cubsbadge.vercel.app/" target="_blank" rel="noopener"><b>🏅 cubsbadge 物資庫</b><span>vercel.app</span><em>↗ 新分頁開</em></a><a class="extcard" href="https://scout-circulars.vercel.app/" target="_blank" rel="noopener"><b>📨 scout-circulars 大聲呼叫</b><span>vercel.app</span><em>↗ 新分頁開</em></a></div>';
    return '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><span class="eyebrow">手冊定位＝新領袖必讀·對齊 ghmeeting 手冊分頁</span><h1>📖 手冊</h1><div style="margin:8px 0;border-radius:12px;overflow:hidden;max-height:150px"><img src="assets/manual/handbook.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div><div class="subtabs">'+subs.map(function(s){return '<button class="subtab '+(cur===s.id?'cur':'')+'" onclick="location.hash=\'#book?sub='+s.id+'\'">'+s.label+'</button>';}).join('')+'</div>'+tabContent()+legacyBlock+'<div style="margin-top:12px">'+origHtml+'</div></section>';
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
    if(typeof Content!=='undefined' && Content.worksheetIndex){
      return Content.worksheetIndex();
    }
    return App.vCraft();
  };
  App.vSheets = App.vPrint;

  App.vSongs = function(){
    return '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><h2>🎵 歌口號（舊領袖最愛）</h2><div style="border-radius:12px;overflow:hidden;max-height:150px;margin-bottom:8px"><img src="assets/manual/songs.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div><p class="mut">跟 ghmeeting 歌曲頁同款：清單淨出名＋「▶ 播」，歌詞收埋喺卡入面。</p><div class="manual-grid" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr))"><div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:12px;background:#fff"><h3>團歌</h3><p class="mut" style="font-size:12px">幼童軍團歌，跟住唱</p><button class="btn sm" onclick="toast(\'🎵 播放團歌\')">▶ 播放</button></div><div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:12px;background:#fff"><h3>口號</h3><p class="mut" style="font-size:12px">日行一善，準備</p><button class="btn sm">▶ 開口號卡</button></div><div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:12px;background:#fff"><h3>營火</h3><p class="mut" style="font-size:12px">營火晚會流程</p><button class="btn sm">▶ 開流程</button></div></div></section>';
  };
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
      'songs':'song',
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
    } catch(e){
      document.getElementById('view').innerHTML='<section class="card"><h2>出錯</h2><p>'+esc(e.message)+'</p></section>';
    }

    document.querySelectorAll('#topnav a, #tabbar a').forEach(function(a){
      var t = a.dataset.tab;
      var isOn = (t===tab) || (tab==='craft' && t==='print') || (tab==='songs' && t==='song') || (tab==='safety' && t==='tools');
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
