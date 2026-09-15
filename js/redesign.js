/* 🐺 Cub Hub v9.1 — 對齊 ghmeeting 5+5 外殼，修復測試關鍵字與路由 — © 2026 Scout System */
(function () {
  var oldRoute = App.route;
  var oldBook = App.vBook;
  var oldMeetList = App.vMeetList;
  var oldPlan = App.vPlan;
  var oldPack = App.vPack;
  var oldLead = App.vLead;
  var oldPlay = App.vPlay;

  /* 手冊工具分頁：各 plugin 唔再疊喺手冊尾拖成一堆，改為註冊成 compact 分頁 */
  App.bookPanels = [];
  App.registerBookPanel = function (id, icon, label, htmlFn) {
    App.bookPanels.push({ id: id, icon: icon, label: label, html: htmlFn });
  };

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
    {id:'print', icon:'✂️', title:'素材庫＋歌曲', desc:'搵素材·即印即用', color:'#FF6F00', img:'assets/manual/craft.avif', hint:'素材庫'},
    {id:'play', icon:'🎮', title:'活動', desc:'遊戲·技能·帶領卡', color:'#1565C0', img:'assets/manual/games.avif', hint:'即開即用'},
    {id:'badge', icon:'🏅', title:'活動章', desc:'分類·內容·考核建議', color:'#6A1B9A', img:'assets/manual/songs.avif', hint:'逐章查看'},
    {id:'jungle', icon:'🌳', title:'森林故事', desc:'11角色·5故事·逐段帶', color:'#2E7D32', img:'', hint:'逐段閱讀'},
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

  App.handbookImage = function(id,alt){
    return '<figure class="handbook-figure"><img src="assets/manual/details/'+id+'.avif" alt="'+esc(alt)+'" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><figcaption hidden>圖片未能載入，請按下方文字帶領。</figcaption></figure>';
  };
  App.clearLocal = function(){
    if(!confirm('清除本APP的集會與準備記錄？此動作不能復原。'))return;
    Object.keys(localStorage).filter(function(k){return k.indexOf('cub_')===0;}).forEach(function(k){localStorage.removeItem(k);});
    location.reload();
  };

  App.vBook = function(){
    var subs = [
      {id:'core',label:'誓詞·規律'},
      {id:'six',label:'六色'},
      {id:'roles',label:'領袖角色'},
      {id:'sixer',label:'隊長'},
      {id:'calls',label:'團呼'},
      {id:'uniform',label:'制服'},
      {id:'ceremony',label:'儀式'},
      {id:'apps',label:'相關APP'}
    ];
    var cur = (location.hash.split('sub=')[1]||'core').split('&')[0];
    var badgeUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.badge : "https://cubsbadge.vercel.app/";
    var circUrl = (typeof EXTERNAL !== "undefined") ? EXTERNAL.circulars : "https://scout-circulars.vercel.app/";
    function tabContent(){
      if(cur==='core'){
        var hc=Store.get('headcount',24);
        return '<div class="info-section"><h3>🤝 誓詞</h3><p>'+DATA.facts.promise.map(esc).join('<br>')+'</p><h3>📏 規律</h3><p>'+esc(DATA.facts.law)+'</p><h3>💪 銘言</h3><p>'+esc(DATA.facts.motto)+'</p><p class="mut">正式原文不縮寫；團呼／大聲呼叫請用上方分頁。</p></div>'+
          '<details class="handbook-more"><summary>獎章路線與適用綱要</summary><p>'+esc(DATA.badges.map(function(b){return b.n;}).join(' → '))+'</p><p>完成活動不等於獲章；個人考驗按適用綱要確認。</p>'+extBtn(DATA.source.url,false,'查看訓練綱要','正式要求以適用版本為準')+'</details>'+
          '<details class="handbook-more"><summary>物資庫：按人數計算</summary><label>人數 <input type="range" min="6" max="48" value="'+hc+'" oninput="App.setHC(this.value)"> <b id="hcN">'+hc+'</b> 人</label><ul id="matlist">'+App.matList(hc)+'</ul><button class="btn" onclick="Bag.open()">只看今場執袋清單</button></details>'+
          '<details class="handbook-more"><summary>相關APP與本機設定</summary>'+extBtn(badgeUrl,false,'進度追蹤APP','個人獎章記錄')+extBtn(circUrl,false,'通告圖書館','查通告與活動')+'<p>記錄保存在這部裝置；離線仍可用教材。</p><button class="btn" onclick="App.clearLocal()">清除本APP本機記錄</button></details>';
      }
      if(cur==='six') return '<div class="info-section"><h3>🌈 六色小隊</h3>'+App.handbookImage('six-colors','六色小隊的教學插畫；不是制服或徽章位置圖')+'<p>'+esc(DATA.facts.six)+'</p><p class="mut">插畫只用來認顏色，不代表制服款式或必須六隊。</p></div>';
      if(cur==='roles') return '<div class="info-section"><h3>👥 領袖分工</h3>'+App.handbookImage('leader-roles','設計體驗、安全守護、價值引導、放手嘗試四項教學分工')+'<p>先分好四件事：帶活動、示範、照顧安全、觀察支援。</p><p class="mut">這是教學分工建議；由負責領袖按人手安排，不把森林角色名字當成固定職務。</p></div>';
      if(cur==='sixer') return '<div class="info-section"><h3>⭐ 隊長帶新隊員</h3>'+App.handbookImage('sixer-training','隊長示範和陪伴新隊員的教學插畫')+'<ol><li>先示範。</li><li>陪他做一次。</li><li>放手讓他試。</li></ol><p>隊長幫忙，不責罵、不代做；安全由成人負責。</p></div>';
      if(cur==='calls') return '<div class="info-section"><h3>🐺 團呼：先看隊形</h3>'+FieldVisuals.formationSVG()+'<p>先定位，再按已核的團呼逐步卡排練；不使用舊「狼耳」手號圖。</p><div class="quick"><button class="btn" onclick="Ceremony.open(\'howl\')">開團呼逐步卡</button><button class="btn" onclick="FieldVisuals.formation()">隊形與安全安排</button></div></div>';
      if(cur==='uniform') return '<div class="info-section"><h3>👕 制服：先看款式</h3>'+FieldVisuals.referenceHTML()+'<p>左右以穿著者為準。位置請用已核的六區圖，不沿用舊 L1–L5 位置簡表。</p><div class="quick"><button class="btn" onclick="Uniform.open()">開制服教學包</button><button class="btn" onclick="FieldVisuals.reference()">官方款式圖</button></div></div>';
      if(cur==='ceremony') return '<div class="info-section"><h3>🎪 儀式：每次跟一個步驟</h3><p>團呼、展旗、宣誓各有不同程序，不合併成一套「五步」。</p>'+Ceremony.panel()+'</div>';
      if(cur==='apps') return '<div class="info-section"><h3>🔗 相關APP</h3>'+extBtn(badgeUrl,false,'進度追蹤APP','個人獎章記錄')+extBtn(circUrl,false,'通告圖書館','通告與活動資料')+'<h3>本APP即用工具</h3><div class="quick"><button class="btn" onclick="Bag.open()">今場物資庫／執袋</button><a class="btn" href="#tools">集合與安靜訊號</a></div></div>';
      return '<p>請選上方手冊分頁。</p>';
    }
    var core = '<section class="card handbook"><a class="back" href="#plan">‹ 返回目錄</a><span class="eyebrow">手冊＝幼童軍核心</span><h1>📖 手冊</h1><p class="mut">撳標籤，直接去要找的內容。</p><div class="subtabs">'+subs.map(function(s){return '<button class="subtab '+(cur===s.id?'cur':'')+'" onclick="location.hash=\'#book?sub='+s.id+'\'">'+s.label+'</button>';}).join('')+'</div>'+tabContent()+'<div class="handbook-links"><a class="pill" href="https://cubsbadge.vercel.app/" target="_blank" rel="noopener">🏅 進度追蹤 APP</a><a class="pill" href="https://scout-circulars.vercel.app/" target="_blank" rel="noopener">📨 通告圖書館</a></div></section>';
    /* 教材工具：由各 plugin 註冊，分頁收埋，唔再一路疊落手冊底 */
    var tools = (App.bookPanels && App.bookPanels.length) ? App.bookPanels : [];
    var toolsHtml = '';
    if (tools.length) {
      var toolTabs = tools.map(function (t, i) {
        return '<button class="subtab booktool' + (i === 0 ? ' cur' : '') + '" data-tool="' + t.id + '" onclick="App.showBookTool(this)">' + (t.icon ? t.icon + ' ' : '') + esc(t.label) + '</button>';
      }).join('');
      var toolPanels = tools.map(function (t, i) {
        var panelHtml = '';
        try { panelHtml = t.html(); } catch (e) { panelHtml = '<p class="mut">呢件教材暫時開唔到。</p>'; }
        return '<div class="booktool-panel' + (i === 0 ? '' : ' hidden') + '" data-panel="' + t.id + '">' + panelHtml + '</div>';
      }).join('');
      toolsHtml = '<section class="card booktools"><h2>🧰 教材工具</h2><p class="mut">撳標籤直接開教材，唔使一路碌到落底。</p><div class="subtabs booktool-tabs">' + toolTabs + '</div>' + toolPanels + '</section>';
    }
    return core + toolsHtml;

  };

  /* 手冊教材工具分頁切換：撳標籤只顯示該件教材 */
  App.showBookTool = function (btn) {
    var root = btn && btn.closest ? btn.closest('.booktools') : null;
    if (!root) return;
    var id = btn.getAttribute('data-tool');
    var tabs = root.querySelectorAll('.booktool');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('cur');
    btn.classList.add('cur');
    var panels = root.querySelectorAll('.booktool-panel');
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.toggle('hidden', panels[j].getAttribute('data-panel') !== id);
    }
  };

  /* 制服同集會儀式係獨立嘅事前準備頁，唔再跳去手冊小分頁。 */
  App.vUniform = function(){
    return '<section class="card"><a class="back" href="#plan">‹ 返回目錄</a><span class="eyebrow">事前準備・必用</span><h1>👕 制服</h1><p class="mut">認清六區位置、學捲旅巾、戴帽同出門自查；附官方款式圖，可放大或印成觀察紙。</p></section>'
      + (typeof Uniform !== 'undefined' && Uniform.panel ? Uniform.panel() : '')
      + (typeof FormalKit !== 'undefined' && FormalKit.get ? '<section class="card"><h2>🔍 制服實物核對卡</h2><div class="quick">'
        + ['uniform','hats'].map(function(id){var c=FormalKit.get(id);return c?'<button class="btn" onclick="FormalKit.open(\''+id+'\')">'+esc(c.title)+'</button>':'';}).join('')
        + '</div><p class="mut">開卡即看準備、辨別要點及來源；印領袖卡可離線用。</p></section>' : '');
  };
  App.vCeremony = function(){
    return '<section class="card"><a class="back" href="#plan">‹ 返回目錄</a><span class="eyebrow">事前準備・必用</span><h1>🎪 集會儀式</h1><p class="mut">團呼、六個口令、展旗、宣誓、敬禮同開始結束，逐步卡可直接開或印。</p></section>'
      + (typeof Ceremony !== 'undefined' && Ceremony.panel ? Ceremony.panel() : '')
      + (typeof FormalKit !== 'undefined' && FormalKit.get ? '<section class="card"><h2>🚩 升旗・國歌・旗幟核對卡</h2><div class="quick">'
        + ['respect','flags'].map(function(id){var c=FormalKit.get(id);return c?'<button class="btn" onclick="FormalKit.open(\''+id+'\')">'+esc(c.title)+'</button>':'';}).join('')
        + '</div><p class="mut">升旗／國歌／旗架屬正式程序，開卡核對來源；摺旗繫旗仍未核閱，不當已完成。</p></section>' : '');
  };

  /* 活動／技能兩個分頁。分類按各場主題：技能＝結繩、急救、指南針、煮食、
     追蹤、遠足、紮作／工程、天氣等；活動＝遊戲、情境、分享、故事、手工等。
     每場只出三個核心節（第2–4個），集合／回顧係例行段，唔當活動／技能卡。 */
  App.skillTids = {c06:1,c07:1,c08:1,c09:1,c10:1,c12:1,c15:1,c17:1,c18:1,c20:1,c23:1};
  App.libraryCards = function (kind) {
    var cards = [];
    DATA.meetings.forEach(function(m){
      var isSkill = !!App.skillTids[m.tid];
      if ((kind === 'skill') !== isSkill) return;
      m.segs.forEach(function(s,i){
        if (i === 0 || i === m.segs.length - 1) return; // 略過集合／回顧例行段
        var art = (typeof SkillArt!=='undefined' && SkillArt.thumb) ? SkillArt.thumb(m.tid,i) : '';
        var support = typeof SkillArt!=='undefined' && SkillArt.support ? SkillArt.support(m.tid,i) : null;
        cards.push('<div class="activity-card lib-card'+(art?' has-art':'')+'">'+
          (art || '<div class="lib-emoji">'+(s.ic||'📋')+'</div>')+
          '<h3>'+esc(s.n)+'</h3><p class="mut" style="font-size:12px">'+s.m+'分鐘 · '+esc(m.n)+'</p>'+
          (s.art?'<span class="lib-tag">步驟圖解</span>':support?'<span class="lib-tag">'+esc(support.label)+'</span>':'<span class="lib-tag plain">文字卡・未有步驟圖</span>')+
          '<div class="quick lib-btns"><button class="btn sm" onclick="App.activity(\''+m.tid+'\','+i+')">▶ 即開帶領卡</button>'+
          ((typeof SkillArt!=='undefined' && SkillArt.print)?'<button class="btn sm ghost" onclick="SkillArt.print(\''+m.tid+'\','+i+')">🖨️ 只印呢張</button>':'')+'</div></div>');
      });
    });
    return cards.join('');
  };
  App.vLibrary = function (skills) {
    var title = '🎮 活動・技能帶領卡';
    var jungleCard = '<section class="card"><h2>🌳 想加一段故事？</h2><a class="btn" href="#jungle">森林故事・角色卡 →</a></section>';
    return jungleCard+'<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><h2>'+title+'</h2><p class="mut">先看圖，再跟住做。安全提醒必讀；詳細帶法可展開。🖨️ 只印所選一張。</p><div class="subtabs"><button class="subtab'+(skills?'':' cur')+'" onclick="App.showLibraryTab(this,\'activity\')">🎮 活動</button><button class="subtab'+(skills?' cur':'')+'" onclick="App.showLibraryTab(this,\'skill\')">🛠️ 技能</button></div><div id="lib-activity" class="manual-grid lib-grid'+(skills?' hidden':'')+'">'+App.libraryCards('activity')+'</div><div id="lib-skill" class="manual-grid lib-grid'+(skills?'':' hidden')+'">'+App.libraryCards('skill')+'</div></section>';
  };
  App.showLibraryTab = function (btn, key) {
    var root = btn.closest('.card'); if (!root) return;
    root.querySelectorAll('.subtab').forEach(function(x){x.classList.remove('cur');}); btn.classList.add('cur');
    root.querySelector('#lib-activity').classList.toggle('hidden', key !== 'activity');
    root.querySelector('#lib-skill').classList.toggle('hidden', key !== 'skill');
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

  /* 工作紙庫：對應 ghmeeting #print + 舊 #sheets。
     實裝版：工作紙分頁用真實27張索引（逐張預覽／列印＋領袖參考），
     歌曲分頁用 Songbook（跟唱卡＋A4歌紙），冇再係死掣 toast。 */
  /* 素材庫分類：按「我想做咩」組織，唔跟集會編號 */
  App.materialCategories = [
    {id:'coop', icon:'🤝', name:'合作與規則', desc:'小隊建立、誓詞規律、保護自己',
     tids:['c01','c02','c03','c14']},
    {id:'outdoor', icon:'🏕️', name:'戶外與遠足', desc:'觀察、露營、遠足、追蹤、天氣',
     tids:['c05','c09','c12','c18','c23']},
    {id:'craft', icon:'🧵', name:'手工與技能', desc:'結繩、煮食、工程、實驗',
     tids:['c06','c10','c15','c17']},
    {id:'care', icon:'❤️', name:'關懷與服務', desc:'了解需要、用心準備、減廢行動',
     tids:['c11','c16','c24']},
    {id:'direction', icon:'🧭', name:'方向與社區', desc:'地圖、指南針、社區行走',
     tids:['c07','c25']},
    {id:'safety', icon:'🩹', name:'安全與急救', desc:'求助、擦傷、鼻血、技能輪轉',
     tids:['c03','c08','c20']},
    {id:'growth', icon:'🎯', name:'成長與回顧', desc:'整理證據、運動、回顧、下一程',
     tids:['c19','c21','c22']},
    {id:'culture', icon:'🎉', name:'文化與慶祝', desc:'中國節慶、童軍家庭、森林故事',
     tids:['c13','c14']}
  ];
  App.vPrint = function(){
    var hasContent = (typeof Content!=='undefined');
    var songs = (typeof Songbook!=='undefined' && Songbook.panel) ? Songbook.panel()
      : '<p class="mut">歌曲模組未載入：重新整理一次。</p>';
    /* 素材庫：按「我想做咩」分類，唔跟集會編號 */
    var library = '<div class="material-library">';
    App.materialCategories.forEach(function(cat){
      var meetings = cat.tids.map(function(tid){
        return DATA.meetings.find(function(m){return m.tid===tid;});
      }).filter(Boolean);
      library += '<details class="material-cat"><summary><span class="cat-icon">'+cat.icon+'</span><b>'+cat.name+'</b><small>'+cat.desc+'</small><span class="cat-count">'+meetings.length+'份</span></summary>';
      library += '<div class="material-items">';
      meetings.forEach(function(m){
        library += '<div class="material-item"><b>'+esc(m.n)+'</b><small>'+esc(m.month)+' · '+esc(m.badge)+'</small>';
        if(m.worksheet && m.worksheet.prompts){
          library += '<ul class="material-prompts">'+m.worksheet.prompts.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul>';
        }
        library += '<button class="btn sm" onclick="PackPrint.open(\'sheet\',\''+m.tid+'\')">預覽及列印</button></div>';
      });
      library += '</div></details>';
    });
    library += '</div>';
    return '<section class="card"><a class="back" href="#plan">‹ 返回目錄</a><h2>✂️ 素材庫＋歌曲</h2><p class="mut">領袖搵素材嘅地方：揀你想做咩，搵合適嘅工作紙同教材。逐張預覽及列印，唔使跟集會編號。</p><div class="subtabs compact-tabs"><button class="subtab cur" onclick="App.showMiniTab(this,\'library\')">✂️ 素材庫</button><button class="subtab" onclick="App.showMiniTab(this,\'songs\')">🎵 歌曲</button></div><div id="mini-library" class="mini-pane">'+library+'</div><div id="mini-songs" class="hidden mini-pane">'+songs+'</div></section>';
  };
  App.showMiniTab = function(btn, key){
    var root=btn.closest('.card'); if(!root)return;
    root.querySelectorAll('.subtab').forEach(function(x){x.classList.remove('cur');}); btn.classList.add('cur');
    var library=root.querySelector('#mini-library'); var worksheets=root.querySelector('#mini-worksheets'); var songs=root.querySelector('#mini-songs');
    if(library) library.classList.toggle('hidden',key!=='library');
    if(worksheets) worksheets.classList.toggle('hidden',key!=='worksheets');
    if(songs) songs.classList.toggle('hidden',key!=='songs');
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
  /* 舊制章分組：2026 第十版目錄已無呢 4 個章，所以刻意唔放入 badgeGroups()。
     獨立列出，淨係供過渡期查舊制要求。 */
  App.legacyBadgeGroup = function(){return {id:'legacy',name:'舊制章（過渡期）',icon:'🕰️',items:['勞作章','讀圖章','電腦章','體操章']};};
  App.vBadge = function(){
    var groups=App.badgeGroups();
    return '<section class="card"><a class="back" href="#plan">‹ 返回目錄</a><h2>🏅 活動章工具書</h2><p class="mut">有成員喺集會上話想考某個章？即刻查：先揀官方目錄分類，再揀章。每章分開「官方要求」同「建議考核」。</p><div class="tipcard">🧰 呢頁係實戰用工具書，不是紀錄冊：只提供官方內容及建議考核方式，不儲存成員考核。要記錄，請到領袖另外申請的紀錄追蹤系統。</div><div class="badge-group-grid">'+groups.map(function(g){return '<button class="badge-group-card" onclick="App.openBadgeGroup(\''+g.id+'\')"><span>'+g.icon+'</span><b>'+g.name+'</b><small>'+g.items.length+' 個章</small></button>';}).join('')+'</div><div id="badge-library" class="badge-library"><p class="empty">揀一個組別開始。</p></div>'+App.legacySection()+'</section>';
  };
  /* 摺埋嘅舊制章區。用 <details> 所以預設收埋，唔會同 2026 目錄撈亂。 */
  App.legacySection = function(){var g=App.legacyBadgeGroup();return '<details class="badge-legacy"><summary>'+g.icon+' '+g.name+' — '+g.items.length+' 個（撳開）</summary><p class="mut">2026 第十版《幼童軍訓練綱要》活動徽章目錄已經冇呢 '+g.items.length+' 個章。過渡期內舊制活動徽章可並列於左袖並釘左下方位置，直至晉升童軍團。呢度只供查舊制要求；新考核請用上面 2026 目錄。</p><div class="badge-name-grid">'+g.items.map(function(n){return '<button class="badge-name-card legacy" onclick="App.openBadge(\''+esc(n)+'\')"><span>🎖️</span><b>'+n+'</b><small>舊制要求 ›</small></button>';}).join('')+'</div></details>';};
  App.openBadgeGroup = function(id){var g=App.badgeGroups().find(function(x){return x.id===id;});if(!g)return;var el=document.getElementById('badge-library');if(!el)return;el.innerHTML='<div class="badge-library-head"><h3>'+g.icon+' '+g.name+'</h3><button class="btn sm ghost" onclick="document.getElementById(\'badge-library\').innerHTML=\'<p class=\\\"empty\\\">揀一個組別開始。</p>\'">收起</button></div><div class="badge-name-grid">'+g.items.map(function(n){return '<button class="badge-name-card" onclick="App.openBadge(\''+esc(n)+'\')"><span>🎖️</span><b>'+n+'</b><small>開啟章內容 ›</small></button>';}).join('')+'</div>';};
  /* 官方內容以《幼童軍訓練綱要》2026 年第十版第三章「活動徽章及其他徽章」為準，
     page: 係該版目錄嘅頁碼。
     ⚠ 以下 4 個係舊制章，2026 第十版目錄已經冇佢哋，所以刻意唔放入 badgeGroups()，
       改為經 App.legacyBadgeGroup() 喺摺埋嘅「舊制章（過渡期）」區列出：
       勞作章、讀圖章、電腦章、體操章
     佢哋嘅 page: 係舊制綱要頁碼，唔係 2026 版頁碼，所以 openBadge 會顯示
     「舊制綱要頁」而唔係「官方綱要頁」。承接關係只喺官方原文可證實時先寫入 legacyNote。 */
  App.officialBadges={
    '露營章':{purpose:'透過露營的體驗，讓幼童軍學習自理能力，認識露營的知識及合作精神。',items:['進行不少於一晚的戶外露營','準備露營的裝備','協助架搭及拆卸一個營幕','懂得在營地中處理及保養一個已架搭之營幕','架設一個簡單的營地紮作','在營地協助烹調、分發及善後一次家常膳食','懂得露營的基本衞生常識及安全守則','協助清理露營後的場地'],page:27},
    '藝術章':{purpose:'鼓勵幼童軍展現創意及發展多元化的美術技巧。',rule:'完成下列其中三項：',items:['參觀美術館，並利用圖畫、相片、文字或其他媒體，紀錄並介紹參觀後之感想。','繪畫一幅靜物或風景畫。','設計並製作一張賀卡。','為幼童軍活動繪畫一張宣傳海報。','設計並製作一本書的封面及裝飾。','用黏土設計並製作一個模型。','為你感興趣的一組主題相片，設計及製作一塊展示板。','其他（取得領袖同意後，以其他藝術媒介製作一件藝術作品。）'],page:38},
    '閱讀章':{purpose:'培養幼童軍閱讀動機及習慣，認識如何使用工具書和知曉怎樣在圖書館尋找書籍（包括電子書籍）。',rule:'完成以下各項：',items:['列出最近閱讀過之書本名單及作者姓名，對領袖講述其中三本書之內容。該三本書應由幼童軍自己選出，其中最少包括一本故事書及一本寫實的書籍。此三本書深淺程度應視乎該幼童軍之年齡及能力等而定。','知曉如何保護及儲存書籍。','知曉如何運用中英文字典及地圖集或街道圖。','向領袖解釋圖書館內的書籍（實體書或電子書）如何分類及陳列，並示範如何在圖書館內或網上目錄中找出一本小說。'],page:55},
    '娛樂章':{purpose:'讓幼童軍協助策劃及表演節目，發揮創意，學習基本的藝術表達與美感，並從中培養與人溝通及合作的能力。',rule:'完成下列其中三項：',items:['協助編排並表演一個默劇或戲劇。','製作自己的布偶或木偶，並利用它們表演木偶戲或皮影戲。','協助策劃並表演一系列（三個以上）的雜技或魔術。','用一種樂器演奏一首歌曲。','編排並表演一段自己選擇音樂的舞蹈。','表演土風舞或傳統舞蹈。','演唱兩首歌。','製作簡單的節奏樂器，並在音樂表演中使用它們。','向觀眾講一個最少達五分鐘的故事。','其他（取得領袖同意後，以其他演藝形式表演一項最少三分鐘的節目。）'],page:40},
    '勞作章':{legacy:true,legacyNote:'2026 手藝章（頁39）目的完全相同，可視為其承接章。',purpose:'讓幼童軍認識如何運用及保養家居中常見的工具。',items:['示範鎚子、鋸子、螺絲批、士巴拿及鉗子的使用及保養方法','在領袖認許下，使用上述最少一項工具，以一種手藝方式設計及製造一件家庭或團部有用的物品，並介紹其用途及保養方法'],note:'需注意幼童軍是否正確使用工具及相關保護衣物。',page:45},
    '科學章':{purpose:'培養幼童軍對科學探究的興趣及求證精神。',items:['示範兩個自選科學實驗，向領袖解釋實驗及結論；實驗應以幼童軍自己發現為據','完成以下其中兩項實驗：製作裝有燈泡、電池及開關掣的模型；以尼龍布及紙製作風箏並比較性能；證明白光由多種顏色組成；製作顯微鏡或潛望鏡並解釋原理；記錄一星期每天同一時間的風向、風速、視野、雨量、溫度及雲；研究植物缺水缺光的情況；從飽和化學溶液析出晶體；證明金屬受熱膨脹；準備隱形墨水並解釋原理；證明聲音的傳播'],page:50},
    '語言章':{purpose:'培養幼童軍非母語表達能力。',rule:'除了母語之外，運用任何一種語言去完成下列各項：',items:['正確指出鄰近一帶之商店、警署、郵局、教堂、油站、酒店的所在地點。','回答居所／學校／旅部附近之公共交通服務情況的簡單問題。','解釋「單程路」、「路不通行」、交通燈號及單程票等意思。','說出一星期七天和一年十二個月的名稱，並懂得日期的說法。','指出鄰近的公眾免費上網地點及說明如何連線。'],page:42},
    '寵物章':{purpose:'透過了解寵物的需要，以及親自照料寵物，培養幼童軍的責任感。',items:['飼養一隻寵物，記錄三個月內其生活習慣及生長過程，包括特徵及變化，並附上照片或圖片','知曉其原產地、所需的特別照顧，以及辨別及處理普通病症的方法'],page:61},
    '天象章':{purpose:'透過認識香港常見天象及學習相關觀測安全事項，引發幼童軍對夜空探索的興趣，並明瞭星空保育的重要性。',items:['認識黃道十二星座的名稱及主要特徵','認識月相、日食和月食','認識太陽系各個行星的名稱及主要特徵','明瞭觀星禮儀及光污染對觀星的影響','製作針孔投影儀安全觀測太陽','完成以下其中一項：參加一次晚間戶外觀星活動，觀看月球或光亮的星星；或參觀香港太空館'],note:'進行太陽觀測時，必須注意保護眼睛。',page:48},
    '攝影章':{purpose:'讓幼童軍學習攝影基本原則及技巧，培養對攝影的興趣。',rule:'完成以下各項：',items:['了解相機之各主要部分，包括鏡頭、觀景器、閃燈、記憶咭、電池等，並懂得安裝及移除記憶咭及電池。','展示如何使用數碼相機或智能手機相機，包括：(a) 展示如何更改拍攝模式、更改設置；(b) 使用變焦功能；(c) 將相片傳輸到其他設備。','介紹如何保養相機與鏡頭。','拍攝一套 12 張的相片，以紀錄一次旅行或活動；並以剪貼簿、電腦簡報、相冊或其他方式，向他人展示並分享有關相片。'],page:46},
    '單車章':{purpose:'讓幼童軍了解騎單車前的準備事項，掌握騎單車的基本知識以策安全，並能展示基本技能。',items:['擁有或時常使用一輛大小適合的單車','正確地上車及下車','保持單車整潔及上油，並替輪胎打氣','明瞭保持單車性能良好的重要性並履行之','明瞭停放單車時上鎖的重要性','知曉及協助修補輪胎','在領袖觀察下，駕單車完成指定短路程，正確運用交通規則內的手號和守則'],note:'考取此章前應已懂得騎乘雙輪單車；騎單車時必須戴上合適個人保護裝備。',page:59},
    '烹飪章':{purpose:'培養幼童軍對烹飪的興趣，了解煮食計劃、正確技巧及健康地進行飲食。',items:['與領袖討論兩種不同烹飪方法的優缺點及均衡飲食習慣的重要','預備一份足夠兩人食用的中式或西式膳食，包括計劃餐單、烹調、餐桌安排、上菜及清理餐桌，並先獲主考同意','預備熱飲品及小食，作為下午茶或輕便午餐','向領袖解釋廚房及煮食的安全措施及衞生守則'],note:'不論中式或西式餐單，所有菜式均不可純以市面可購買的預製食品直接完成，但可將該等預製食品作為部分烹調食材，配合其他材料自行製作。如使用利器需注意使用及清潔時之安全。請參閱「使用爐具安全指引」。',page:58},
    '搜集章':{purpose:'讓幼童軍透過搜集過程，思考搜集物件的意義，學習儲存、分類與保養的技巧。',items:['在領袖同意下選定一種物件，討論搜集計劃、選擇理由及搜集與保存方法','最少用四個月搜集該物件，並整齊、有系統地整理；如已開始搜集，完成第一項後仍須繼續搜集四個月'],page:57},
    '園藝章':{purpose:'讓幼童軍了解植物的特性及栽培過程，培養對園藝的興趣。',items:['介紹四種香港常見植物，包括特徵、生長時節及所在地方','用不少於一個月栽種一株植物，記錄由種子開始的生長、栽種過程及特性，包括每星期生長情況、土壤氣候等注意事項、繁殖栽種方法及控制或培養生長','知道栽種該植物所需用具，以及適當使用及保養方法'],page:49},
    '讀圖章':{legacy:true,legacyNote:'2026 無直接對應章；地圖閱讀內容見 探險章（頁28）及進度性獎章 3.1.2。',purpose:'讓幼童軍學習基本閱讀地圖的技巧。',items:['在地圖或街道圖上指出團部及居所位置，知曉主要圖例，並解釋自選名勝地點在地圖上的表示方法','製作合比例的250米小模型，顯示相距50米的等高線','明瞭上述內容，以便形容地圖所指一條5,000米長路程上會見到的事物','正確把地圖較正位置，並知曉如何使用指南針'],note:'建議採用地政總署測繪處出版的1:20,000地圖；此章為金紫荊獎章其中一項考核項目。',page:50},
    '音樂章':{purpose:'培養幼童軍對音樂的興趣，並能展示音樂技能。',items:['初級 — 技能：聆聽一段短曲後，然後唱出來；以拍掌方式拍打另一首曲子之節奏。表演：在童軍活動、團體表演或音樂會等表演場合，選擇運用樂器演奏樂曲或唱出歌曲。知識：展示一段增進音樂技巧的音樂練習；並介紹演奏所運用的樂器及為何喜歡此樂器，或介紹所演唱的歌曲及為何喜歡並選擇這歌曲。興趣：介紹最喜歡的音樂類別或曲目。','中級 — 技能：達到英國皇家音樂學院考試委員會（ABRSM）一級或相似標準的樂器或聲樂水平。表演：在童軍活動、團體表演或音樂會等表演場合，選擇運用樂器演奏或唱出兩種不同風格的樂曲或歌曲。知識：展示兩段增進音樂技巧的音樂練習；介紹樂器或歌曲（同初級）；介紹兩首與演奏時所運用的樂器相關之音樂作品。興趣：介紹最喜歡的音樂類別或曲目；介紹最常聆聽的音樂。','高級 — 技能：達到英國皇家音樂學院考試委員會（ABRSM）三級或相似標準的樂器或聲樂水平。表演：在童軍活動、團體表演或音樂會等表演場合，選擇運用樂器演奏或唱出兩種不同風格的樂曲或歌曲；當中一首應為獨奏樂曲，另一首必須與他人一起合奏。知識：展示三段增進音樂技巧的音樂練習；介紹樂器或歌曲（同初級）；介紹三首與演奏時所運用的樂器相關之音樂作品；介紹三位喜歡的音樂家。興趣：介紹最喜歡的音樂類別或曲目；介紹最常聆聽的音樂；介紹喜歡的音樂與表演時選擇的音樂之間的異同。'],note:'此章為三級制度章，必須依次序完成初級、中級及高級。',page:44},
    '電腦章':{legacy:true,legacyNote:'2026 資訊科技章（頁41）承接其內容（含知識產權及誠實使用電腦）。',purpose:'讓幼童軍學習電腦知識及使用技巧，了解知識產權及誠實使用電腦的重要性。',items:['認識電腦系統各類裝置，並附以簡單圖說明電腦主機、硬碟及常用輸入和輸出裝置','能將USB記憶體或記憶卡格式化','能在USB記憶體或記憶卡儲存、剪下、複製、貼上及刪除檔案','明瞭雲端儲存的簡單運作原理及其好處和壞處','利用軟件完成以下任何兩項：製作一件多媒體作品；用中文或英文為旅團編寫一則包括文字及圖案的A4通告或告示；製作最少5張投影片介紹自己或旅團','利用電郵將第5項檔案附夾並傳送給領袖','明瞭尊重知識產權及誠實使用電腦的重要性'],page:37},
    '體操章':{legacy:true,legacyNote:'2026 無直接對應章；體適能章（頁62）內容不同，唔係同一個章。',purpose:'讓幼童軍認識體操運動並能展示基本技能。',items:['初級（紅色）：前滾翻；手倒立（靠牆）；分腿騰越（越過同伴或木馬）；正握低單槓懸垂，收腹穿腿成反臂懸垂（1.2米），或在平衡木完成兩個平衡動作及兩個轉體動作並由另一端下木','中級（黃色）：魚躍前滾翻越過0.6米障礙物；側手翻；由單掛膝懸垂開始勾單膝上成騎撐（低單槓1.2米），或分腿騰越（木馬／木箱高1米）','高級（綠色）：頭手翻；在一直線上連續兩次側手翻；低槓腹迴環上（1.2米），或分腿騰越（木馬／木箱高1米）'],note:'此章為三級制度章，初級、中級及高級分別為紅色、黃色及綠色。動作應由合資格人士按安全要求指導及評核。',page:44},
    '獨木舟章':{purpose:'鼓勵幼童軍參與獨木舟活動並能展示基本技能。',items:['初級（一星章）：通過香港童軍總會游泳測試，並考獲香港獨木舟總會少年獨木舟海馬章或同等資歷','中級（二星章）：通過香港童軍總會游泳測試，並考獲香港獨木舟總會少年獨木舟海豹章或同等資歷','高級（三星章）：通過香港童軍總會游泳測試，並考獲香港獨木舟總會少年獨木舟海象章或同等資歷'],page:56},
    '射箭章':{purpose:'讓幼童軍初步理解及學習射箭知識，以啟發及培養其興趣。',items:['知識：認識弓的主要部分、常用射箭輔助工具，以及五色十環靶面的計分方法','訓練：明白並遵守射箭安全規則、示範正確射箭基本姿勢、懂得記錄積分，並完成不少於8小時訓練','實射初級：10米、122厘米五色十環靶、連續6箭；反曲弓不少於24環或複合弓不少於30環','實射中級：10米、122厘米五色十環靶、連續18箭；反曲弓不少於108環或複合弓不少於126環','實射高級：10米、122厘米五色十環靶、連續36箭；反曲弓不少於288環或複合弓不少於324環；或按官方列出的18米／30米高級實射標準完成'],note:'此章為三級制度章；考取較高一級時，知識部分無須重考，但訓練四項仍須重新完成。實射必須由合資格教練按安全要求指導及評核。',page:53},
    '運動章':{purpose:'鼓勵幼童軍主動認識運動技能及安全守則，以培養他們平日做運動的興趣及習慣。',rule:'完成以下各項：',items:['認識兩種運動的基本資料，包括其玩法、基本規則、所需裝備及相關安全事項。','對上列其中一項有專門技能及知識，並經常參加該項活動。','知曉如何保養第 2 項所選之運動其所需用具及服裝。','在所有幼童軍的遊戲及活動中表現出良好的體育精神。','明瞭運動後保持個人清潔及更衣的重要性，並認識運動時保護身體各部位（例如足部）的重要性。'],page:65},
    '田徑章':{purpose:'鼓勵幼童軍參與田徑活動，了解相關安全知識，並能展示基本技能。',rule:'必須完成所有四個項目。完成初級需獲得 22 分；中級需獲得 28 分；高級需獲得 34 分。',items:['(一) 跳遠 — 10分：3米；7分：2.5米；5分：1.5米。','(二) 跳高 — 10分：0.96米；7分：0.86米；5分：0.76米。','(三) 擲豆袋 — 10分：30米；7分：24米；5分：15米。','(四) 50米急跑 — 10分：9秒正；7分：10秒正；5分：11秒正。'],page:54},
    '游泳章':{purpose:'考核幼童軍的游泳技能。',items:['初級（紅色）：跳入水中；呼吸練習；俯浮滑進；仰浮滑進；俯浮划水10米；仰浮划水10米；拯溺式背泳10米；以胸泳、捷泳或背泳游25米','中級（黃色）：以一種泳式游25米並踏水1分鐘；潛水約1.25米而不觸底；冬菇式浮水並以不同前、背泳完成；插潛或滑水至最遠距離；以正確比賽姿態用胸泳或蝶泳游25米','高級（綠色）：垂直踏水3分鐘；游200米並潛泳最少5米；不用扶梯或他人協助從深水端爬上池畔；以良好站立姿態跳起、騰空及插入水中'],note:'此章為三級制度章，並為金紫荊獎章其中一項考核項目。所有水上考驗須由合資格人士按安全要求指導及評核。',page:66},
    '寫作章':{purpose:'培養幼童軍寫作興趣。',rule:'完成下列其中三項：',items:['創作一首至少六行的詩，並和領袖討論詩句的構造與意義。','與領袖討論一個故事想法，並創作一個指定字數的短篇故事。','對於喜歡的書籍、戲劇或其他文學作品，在閱讀或欣賞後，撰寫一篇指定字數的評論文章。','為學校刊物、信仰刊物、社區刊物、報紙或童軍雜誌，投稿撰寫一篇指定字數的文章。','就某個主題，寫下一篇指定字數的日記。','撰寫一個持續五分鐘的戲劇或戲劇片段。','採訪領袖或其他人士。將訪問的問題和受訪者的回答寫下來，紀錄這次訪談。','寫一封指定字數的信件郵寄給筆友（真實或想象中的）。內容描述幼童軍中曾參與最有意義或最有趣的事，並能正確地在信封寫上收信人、發信人及地址。','發出一封指定字數的電郵寄給親友，邀請他們參加團部的活動，或向他們表達某特別事件的謝意。'],note:'指定字數：幼童軍歷奇章不少於 50 字；幼童軍高級歷奇章不少於 150 字；金紫荊獎章不少於 250 字。',page:47},
    '氣象章':{purpose:'認識天氣變化對日常生活的影響及需注意的事項。',items:['懂得利用大眾傳播媒介或電子工具獲取天氣資訊','認識氣溫、風、降雨及紫外線指數等天氣要素，並說出戶外活動時如何因應變化作出準備','懂得天氣警告發出後的注意事項，包括雷暴、暴雨及熱帶氣旋警告','認識雲的形成，並辨認層雲、積雲、卷雲及積雨雲','認識二十四節氣基本概念，並說出最少六個節氣及其特點','進行最少五天的天氣觀測，記錄個人對天氣的感覺，並與當時天氣資訊比較','完成以下兩項：製作海報或進行實驗描述水循環；製作測風儀模型；透過網上資源學習氣象知識並匯報'],page:51},
    '世界友誼章':{purpose:'讓幼童軍對世界童軍有更多認識。',rule:'完成以下各項：',items:['以不少於四個月的時間，完成一剪貼簿，內容關於世界童軍組織內其中一個國家╱地區童軍組織的民族生活方式、食物特色及風俗習慣等。','略知聯合國的組織、歷史、旗幟及其意義。','能向領袖列舉十個香港以外屬世界童軍組織的國家╱地區童軍組織，並知道其中三個國家╱地區旗幟的意義。','曾與外國童軍通訊最少兩次。'],page:67},
    '手藝章':{purpose:'讓幼童軍認識如何運用及保養家居中常見的工具。',items:['了解並示範如何安全使用和保養工具，包括鎚子、鋸子、螺絲批、板手、鉗子、拉尺、砂紙等。','在領袖或成年人監督下，使用上述工具，協助設計和製造一件在家庭或團部有用的物品。','該物品能夠展示幼童軍可以進行：量度的方法；釘及螺絲釘的使用；膠水及黏合劑的使用；砂紙打磨；不同的著色方法等。','介紹此物品的用途與保養方法。'],note:'需注意幼童軍是否正確使用工具及相關保護衣物。',page:39},
    '資訊科技章':{purpose:'讓幼童軍掌握基本資訊科技知識與技能，並初步認識人工智能（AI）的應用與影響，從小培養創意、分析與負責任的數碼公民態度。',items:['能識別常見資訊科技設備，能附以一個簡圖說明，包括：電腦、平板、手機等常見裝置；輸入與輸出設備（如鍵盤、滑鼠、螢幕、印表機）；雲端與實體儲存裝置。','認識不同檔案格式（如 .jpg、.mp4、.docx）及格式化的基本概念。','明瞭雲端儲存的簡單運作原理，以及其好處和壞處。','利用軟件，完成下列其中兩項：(a) 製作一件多媒體作品；或 (b) 用中文或英文，為旅團編寫一則 A4 尺寸的通告或告示，當中應包括文字及圖案；或 (c) 製作最少 5 張投影片，介紹自己或旅團。','能簡單說出人工智能（AI）的概念及使用時的注意事項，包括 AI 的基本原理是如何運作、日常生活中常見的 AI 應用（如語音助理、推薦系統等），以及使用 AI 所提供的資料時，應再三查證其準確性等等。','利用 AI，完成下列其中一項：(a) 使用圖像生成工具，創作一張以「我的未來世界」為主題的圖畫；或 (b) 使用簡單的 AI 對話機器人，與領袖討論一個問題，例如「環境保育的重要性」。','明瞭尊重知識產權及誠實使用電腦的重要性。'],page:41},
    '媒體製作章':{purpose:'讓幼童軍利用不同媒體，發揮創意與技術，培養幼童軍於數碼媒體設計、視覺效果、多媒體製作、故事敘述等能力。',rule:'完成下列其中兩項：',items:['利用圖像或影像處理軟件，為幼童軍團設計一項宣傳品，例如海報、宣傳單張、橫額等。','製作一個簡易網站，介紹自己日常生活，並經領袖同意後發佈。','為一個主題，例如旅行、童軍活動等，利用相片、圖畫與文字製作一本電子書。','錄製一個三分鐘的音頻故事，故事中須搭配音樂與聲效演出。','製作一個三分鐘的主題短片，並以對白或旁白加以說明。','利用軟件或拍攝，製作一個一分鐘的動畫短片。'],page:43},
    '地球部落計劃 – 走塑達人章、自然守護者章、日光善用者章':{purpose:'地球部落是一個對環境議題充滿熱情的全球青少年社區，並積極參與全球公民來維護和保護我們的地球。地球部落引導青少年進行教育之旅、培養必要的意識、能力和領導技能，在他們的社區創造環境變化。通過一系列令人興奮的地球部落挑戰，青少年瞭解如何與自然聯繫，成為可持續發展的擁護者，並參與及採取環境保護行動。',items:['走塑達人章（Plastic Tide Turners）','自然守護者章','日光善用者章（Scouts Go Solar）'],note:'本會綱要只列出目的及三個章名；有關獎章要求，請參閱「地球部落」網站。',page:52},
    '公園定向章':{purpose:'通過認識公園定向活動，提高幼童軍對定向運動之認識及興趣，並能展示基本技能。',rule:'必需依次序完成初級、中級及高級章內各個項目。',items:['初級：在完成公園定向訓練課程及參與一次相關的體驗活動後，能 (a) 認識甚麼是公園定向及其簡單歷史；(b) 知曉越野式及奪分式定向之玩法；(c) 明瞭公園定向地圖顏色定義；(d) 認識公園定向地圖基本圖例；(e) 懂得公園定向活動安全守則。','中級：在完成公園定向初級章後，能 (a) 明瞭公園定向比賽程序；(b) 示範正置公園定向地圖的方法；(c) 示範拇指輔行法；(d) 參與一次公園定向同樂日或比賽。','高級：在完成公園定向中級章後，能 (a) 認識甚麼是地圖比例及其表示方式；(b) 知曉公園定向地圖等高線之概念；(c) 明瞭國際控制點提示符號表之主要用途；(d) 描述一段不少於 100 米的公園定向地圖所見事物；(e) 完成最少二次公園定向比賽。'],note:'中級 d 項與高級 e 項不能是同一事工。',page:60},
    '體適能章':{purpose:'幼童軍通過體適能測試以了解自己的身體狀況從而建立良好生活品質及保持健康的身體。',items:['皮摺量度（測量人體內的脂肪百分比）。','曲膝仰臥起坐。','坐地前伸。','6／9 分鐘耐力跑 或 15 米漸進式心肺耐力跑。','手握力或仰臥引體上升。'],note:'此活動徽章之課程以教育局頒佈的最新「學校體適能獎勵計劃」內容為依歸（https://spfas.hkuhealth.com/）。如幼童軍考獲校內舉辦之「學校體適能獎勵計劃」（金、銀、銅獎章）測試，即等同及豁免本章相同級別（高級、中級、初級）之考驗。',page:62},
    '風帆章':{purpose:'讓幼童軍初步理解滑浪風帆原理及知識，並通過相關實習，培養對滑浪風帆的興趣，並能展示基本技能。',items:['通過本會之游泳測試。','完成下列其中一項：(a) 考獲香港滑浪風帆會兒童滑浪風帆體驗證書或同等資歷；(b) 考獲中國香港帆船運動總會少年帆船課程第一級證書或同等資歷。'],note:'此章之課程以該項運動之所屬總會所頒佈的最新課程為依歸。',page:63},
    '水手章':{purpose:'讓幼童軍初步理解海上知識，並通過相關實習，培養對水上活動的興趣，並能展示基本技能。',items:['通過本會之游泳測試。','認識本會轄下海上活動中心所使用的訊號旗及明瞭其用途。','明瞭本會轄下海上活動中心之「海上活動中心守則」及「水上安全守則」。','知曉如何獲取天氣預告及明瞭其用途。','明瞭風、潮汐、水流對進行海上活動的影響。','指出童軍標準艇所需裝備及各部分名稱。','船上拋擲救生繩至距離 8 公尺外之物體。','以單槳單獨搖動一小艇至一件距離 10 公尺的物體，並把它拾起。','示範下列各種繩結及明瞭其用途：8 字結、接繩結、雙接繩結、錨結、稱人結、繫木結、雙套結、普通繩端結。'],page:64},
    '宗教章':{purpose:'培養幼童軍靈性的發展。',rule:'以下其中一項課程進行研習。',items:['基督教課程：背誦主禱文；唱聖詩三首；能敘述聖經故事兩則，其一為耶穌降生故事；背誦並略加解釋自選金句三則；在幼童軍度假營中負責一次謝飯禱告，或為一位有病未能出席團集會的幼童軍禱告。','孔教課程：尊重中國傳統文化和儒教思想；能念誦《禮運‧大同》篇；能唱《孔聖頌》；能在團集會／小隊露營講述孔子生平故事兩則；每年拜祭祖先、天地；參與傳統祭禮時，認識並遵守有關禮儀；曾參觀孔教團體和傳統廟宇。','佛教課程：能唱佛寶歌；能誦佛號；能講述悉達太子降生故事；能背誦五戒文；能參加浴佛禮；備有佛像圖或佛章；遇見佛教法師時能合什行禮及作尊稱。','天主教課程：擁有一本《聖經》或《福音》，並明白如何使用；明白《若望福音》第十三章 34 至 35 節；舉例說明自己曾經實踐《瑪竇福音》第二十五章 35 至 40 節；能劃十字聖號及誦念天主經；明白在聖堂之正確態度；說出教宗及教區主教的姓名；明白教友對主日的本份及曾經參與最少一次彌撒；能詠唱聖歌一首。','回教課程：擁有一本《古蘭經》（中文譯本）及明白如何使用；背誦及明白清真言「萬物非主，唯有真主，穆罕默德，是主差使」；明白伊斯蘭的意義是和平、順從；明白念、禮、齋、課、朝五功的意義；說出全世界穆斯林信徒的數目；說出香港各間清真寺的位置。','道教課程：能誦《太上道祖頌》；擁有一本《道德經》；能誦《道德經》首章；能辨認「太上道祖」像；認識「道家三寶」；能解釋「七善」的意義；曾參觀一間道教宮觀。'],page:68},
    '童軍先修章':{purpose:'童軍先修章之設立旨在強化幼童軍支部及童軍支部的連接，幫助適齡之幼童軍支部成員認識童軍支部活動，吸引年長的幼童軍成員多參與幼童軍時從未體驗過的童軍活動，並藉此鼓勵他們晉升為童軍。',rule:'年滿十歲半之幼童軍支部成員可考取，完成後由其幼童軍團長簽發（特殊情況下可由區、地域或總會委派指定人士簽發）。',items:['認知：認識童軍支部的目的及方法；認識童軍制服；認識童軍支部的小隊制度；認識童軍團的獎章制度。','參與：在幼童軍團長及童軍團長同意下，由一位童軍團的團隊長／隊長帶領下，一同參與不少於兩次童軍團的集會。','新體驗：在幼童軍團長及童軍團長同意下，由一位童軍團的團隊長／隊長帶領下，參與一項於幼童軍時從未體驗過的童軍活動。'],note:'獲得童軍先修章之成員，可直接豁免金紫荊獎章內童軍家庭 4.4.1 d 項。佩戴期限：考獲後即可佩戴於制服上，直至成為童軍後一年。',page:70},
    '水上安全章':{purpose:'提升幼童軍的安全意識，使他們遇上水上意外時懂得如何協助。',rule:'完成以下各項：',items:['認識水上安全知識及守則。','明瞭向成年人求助的重要性。','明瞭及能在安全情況下完成下列各項：(a) 手援 — 利用竹竿或木棒等棒類物品，或兩件緊縛在一起之衣物，拯救近岸之溺者；(b) 拋物 — 站在岸上將任何無負重之繩索，或水泡及其他浮物，拋與一離岸 6 米之溺者。'],page:34},
    '探險章':{purpose:'讓幼童軍學習基本閱讀地圖的技巧，同時了解野外旅程前的準備及需關注事項，並明瞭戶外基本求生技能。',items:['明瞭地圖或街道圖上的主要圖例，並能指出旅團及居所的位置','製作一個合比例之 100 米高小模型，該模型應能顯示相距 20 米的等高線','明瞭上述第 1、2 點，以便能夠形容出由地圖所指的一條 5,000 米長的路上會見到的事物','懂得利用地圖及西維氏（Silva-type）指南針正置地圖、指出前進方向或地標的方位','明瞭一日遠足行程前所需要之準備工作，包括旅程費用、適當之服裝、鞋襪、救傷用品及食物等','策劃及參加一次不少於六公里之幼童軍遠足活動'],page:28},
    '愛護動物章':{purpose:'提升幼童軍對愛護動物的意識，提倡善待動物、了解動物的需要及學習尊重生命。',items:['向領袖講述動物的需要及如何選擇合適的寵物','明瞭飼養寵物的責任','認識一種寵物的生命週期、生活習性、常見疾病、棲息地及生存的基本需要'],page:29},
    '共融章':{purpose:'讓幼童軍學習認識及如何接納和關懷社會上的弱能人士，與其融洽共處並理解他們的特質及需求。',items:['認識何謂多元共融。','認識特能童軍活動。','了解以下其中兩類特殊需要人士的特質：(a) 身體；(b) 教育；(c) 文化；(d) 種族。','與上述第 3 項所提到的特殊需要人士進行一次聯合活動或進行一次服務，並作簡單記錄。'],page:30},
    '道路安全章':{purpose:'讓幼童軍明瞭交通安全的基本常識，使他們清楚了解使用道路時的正確態度，加強他們的責任感及自律性。',rule:'完成以下各項：',items:['明瞭交通意外常見成因。','懂得選擇可以安全橫過馬路的地點，及使用「過馬路守則」。','能畫出至少十種在馬路上常見的交通標誌，並能解釋其意思。','明瞭如何安全地騎單車。','明瞭作為車輛乘客如何實踐道路安全及違例的後果。','認識在自己居住的社區中不同的道路設施。','懂得在發生交通意外時，如何作出求救。','製作一張海報宣傳道路安全，或蒐集一份有關不安全使用道路的剪報。'],page:33},
    '急救章':{purpose:'讓幼童軍明白急救的目的及原則、求助的程序，並知曉日常生活中導致意外的因素及簡單處理方法。',items:['明瞭急救原則，能講出日常生活及戶外活動的危險因素，以及進行急救前的首要工作，例如向成年人求助及報警','認識輕微／嚴重出血及有異物傷口的處理方法','認識燒傷與燙傷的成因、預防方法及簡單處理方法','認識昏厥的徵狀及簡單處理方法','認識扭傷的徵狀及簡單處理方法','完成《幼童軍急救章手冊》內第一至第五課的討論及溫習項目','列舉個人藥囊的各項應用物品','示範三角繃帶的兩種紮法：大手掛及三角手掛'],note:'需確保幼童軍正確使用急救用品；請參閱官方《幼童軍急救章手冊》。',page:31},
    '家務章':{purpose:'鼓勵幼童軍分擔家務並能展示基本技能。',rule:'完成以下各項：',items:['煎煙肉或香腸，煮蛋和煮飯。','佈置飯桌及懂得進膳時之禮貌（此項可與第一項同時進行）。','洗碗碟並知道怎樣處理用過之鍋鑊、刀叉、筷子、玻璃器皿等。','洗及熨旅巾。','在制服上縫上一個徽章或鈕扣。','整理睡床。','清潔門窗、銀器或銅器。','清潔及整理一個房間。'],page:32},
    '香港歷史章':{purpose:'鼓勵幼童軍探索香港歷史，讓他們了解本地的人和事。',rule:'完成以下各項：',items:['在與領袖商討後，以下列任何一個主題製作一本剪貼簿或一個互聯網站：(a) 一名本港歷史名人的事蹟；(b) 一個香港的古舊建築；(c) 一件香港歷史大事；(d) 其他經領袖同意且對本港具相當歷史意義的題目。','選取三個香港的法定古蹟，並為此等古蹟各設計一幅海報以介紹其背景及參觀方法。','參觀其中一間由政府部門、公營機構、教育機構、非牟利組織或私營機構所管理的博物館（事前需取得團長同意），並進行匯報。','向團員介紹一條香港街道或一個香港地區名稱的命名背景和典故。'],page:36},
    '防騙先鋒章':{purpose:'教育青少年辨識和應對詐騙行為，提高警覺性及自我保護能力。',items:['認識常見詐騙手段和策略，例如詐騙電話、詐騙郵件及網絡詐騙','辨識詐騙特徵和警示訊號，例如不實承諾、高壓銷售及虛假資訊','學習應對策略，例如保持警惕、保護個人資料、報告詐騙行為及尋求幫助'],note:'各團團長可指派合適領袖教導及主考；可因應成員能力適當調適教學內容及考驗難度。',page:35},
    '保護兒童章':{purpose:'教育青少年辨別常見兒童侵害情況及保護自己。',items:['認識常見的兒童侵害情況，例如身體傷害和性侵害','學習自身或身邊的人遇到兒童被侵害時的處理方法','按適用的官方保護兒童課程完成指定學習內容'],note:'由合適領袖教導及主考；內容及考驗難度可按成員能力適當調適。',page:35},
    '禁毒章':{purpose:'教育青少年認識常見毒品的種類與禍害，了解接觸毒品的原因及相關刑罰，提高警覺性。',items:['認識依托咪酯、氯胺酮、大麻、冰毒、可卡因及海洛英，以及其對身體的禍害','認識與毒品相關的刑罰','認識常見的吸毒場所與原因','認識應對毒品及求助方法'],note:'團長及主考可因應成員能力，適當調整教學內容及考驗難度。官方資料來源包括警務署毒品調查科及保安局禁毒處。',page:35},
    '社區應急先鋒章':{purpose:'培養幼童軍的消防安全及基本應急意識。',items:['完成一小時網上課程後，向領袖知悉相關內容，並與其他幼童軍簡單分享或討論所學：火警逃生；以及消防安全及家居防火資訊','參與兩小時認可面授訓練，並通過評核'],note:'網上課程由香港消防處提供；團長及主考可按成員能力調整教學內容及考驗難度。',page:35},
    '機電先鋒章':{purpose:'培養幼童軍認識能源、電器安全及節約能源。',items:['認識新能源、可再生能源、能源效益及節約能源的重要性','了解太陽能等可再生能源的應用及其對環境的好處','認識10件常見家用電器的正確使用方法','列舉5類電器的常見危險及正確預防方法','承諾實踐節約能源及綠色生活','完成參觀機電工程署總部，或製作附有10件家居電器照片或圖畫的使用及安全檢查清單'],note:'可按成員能力調整教學內容及考驗難度。官方參考資料包括能源資訊網及家居電氣安全手冊。',page:35},
    '環保先鋒章':{purpose:'培養成員保護環境的責任感及領導能力，鼓勵以積極行動保持地球永續環境。',items:['認識香港的環保政策及措施','認識本地及全球環境議題','認識人與環境的關係','認識保護環境的方法','完成由環境運動委員會委任的環保先鋒導師教授的環保內容','完成一項由環境運動委員會安排的環境教育培訓活動','完成一項由香港童軍總會或其他機構舉辦的環境教育培訓活動'],note:'官方頁面標示為先導計劃；培訓活動須按環境運動委員會及香港童軍總會的安排進行。',page:35},
    '國家安全大使章':{purpose:'培養幼童軍對《基本法》、國家、法治及國家安全的基本認識。',items:['明暸《基本法》第一條的內容','了解中華人民共和國的首都及重要城市、地理位置，以及代表國家的事物和有趣的國家事件或事物','說出20個國家安全重點領域，並認識國家和香港常見創新科技在日常生活的應用','認識執法和服務市民的部門、其工作及個人的公民責任','參觀國家安全展覽廳，或參加以國家安全為主題的展覽、活動或比賽'],note:'可按成員能力調整教學內容及考驗難度。',page:37}
  };
  /* 「建議考核」係本套包自己嘅帶法，唔係官方條文。官方要求一律喺「官方要求」tab。
     只有兩欄：how（如何進行考核）＋ pass（何謂達標）。
     刻意唔設「時間／準備」欄 —— 好多章係成員返屋企做嘅功課（搜集、寵物、家務、園藝等），
     假設一定喺集會做係錯嘅。安全提示直接寫入 how 或 pass。
     寫法跟 docs/teaching-copy-style.md：短口語、一句一事、安全要睇到。
     順序跟官方 2026 第十版目錄：頁27 露營章 → 頁70 童軍先修章。 */
  App.badgeAssess = {
    /* ---- 頁27–28 童軍技能（綠） ---- */
    '露營章':{how:['開營時叫佢跟你落釘、拉繩、起營幕；起完叫佢自己再檢查一次。','膳食由佢落手：洗菜、睇火、派飯、執枱。你企喺旁邊睇安全。','拆營時叫佢數返清楚所有釘同繩。'],
      pass:'八項全部有佢親手做過，唔係企喺度睇你做。營幕起得起、拆得返，膳食有份落手，就算達標。生火同用刀一定要有領袖同行。',refs:[{label:'收拾背囊的方法｜訓練縱橫',url:'https://www.scout.org.hk/article_attach/997/1999_07.pdf',src:'訓練署'}]},
    '探險章':{how:['攞一張團部附近嘅地圖，叫佢指返旅團同屋企喺邊。','用紙皮同繩做一個 100 米模型，20 米一條等高線；做完叫佢指認。','行一次六公里遠足，途中叫佢用指南針講方向，同埋講沿路會見到乜。'],
      pass:'六項全做到：認到主要圖例、模型比例啱、講得出 5,000 米路上事物、指南針用得、講得出遠足前準備、真係行完六公里。'},
    /* ---- 頁29–34 關己愛人（紅） ---- */
    '愛護動物章':{how:['叫佢講一種寵物：點揀、要乜、點照顧。你追問細節。','問佢：養之前要諗清楚啲乜？','叫佢講一種寵物嘅一生：由細到大、住邊、會病乜、要乜先活得落。'],
      pass:'三項都講得出內容，唔係淨係答「得」。要講到動物嘅需要同飼養責任，先算達標。'},
    '共融章':{how:['先傾：乜嘢叫多元共融？用團員自己嘅例子講。','介紹特能童軍活動係乜。','身體／教育／文化／種族四類揀兩類，每類講佢哋嘅特質同需要。','安排一次聯合活動或者服務，做完叫佢寫低三句感受。'],
      pass:'四項齊：講得出多元共融、認識特能童軍、講到兩類特殊需要人士嘅特質、真係做過一次聯合活動或服務並有簡單記錄。'},
    '急救章':{how:['先問：「日常同戶外，邊啲嘢會整親人？」等佢自己講，你先補漏。','出血、燒傷、昏厥、扭傷逐個出情境題：「而家有人暈低，你第一步做乜？」','三角繃帶大手掛同三角手掛：你先示範一次，再叫佢喺你手上綁一次。','藥囊逐樣攞出嚟，叫佢講用途。'],
      pass:'八項全部答到或者做到；藥囊物品講得出用途；《幼童軍急救章手冊》第一至五課已完成。必須由合資格急救領袖評核，唔好攞真傷者實習。'},
    '家務章':{how:['呢章喺屋企做。派張八項清單俾佢同家長，逐項剔。','第 1、2 項（煎煙肉或香腸、煮蛋煮飯＋佈置飯桌）叫家長影相或者簽名。','其餘六項自己喺屋企完成，做完剔。','下次集會叫佢講返邊一項最難。'],
      pass:'八項全部喺屋企做完並有家長確認。第 5 項要真係喺制服上縫過徽章或鈕扣。'},
    '道路安全章':{how:['先傾：交通意外點解會發生？','行一次附近馬路，實地認交通標誌；返嚟叫佢畫十個並解釋意思。','出情境題：點揀安全位置過馬路？做乘客要注意乜？','海報或者剪報二選一，下次集會交。'],
      pass:'八項全做到：講得出意外成因、用得到「過馬路守則」、畫到十個標誌並解釋、單車安全、乘客安全、認到自己社區嘅道路設施、識求救、交齊海報或剪報。'},
    '水上安全章':{how:['先講水上安全守則，再問：點解一定要搵大人幫手？','手援同拋物兩樣，喺陸上用道具示範：竹竿、綁埋一齊嘅衫、繩索、水泡。','拋物要擲到 6 米外嘅目標，每人試幾次。'],
      pass:'三項全做到，手援同拋物都喺安全情況下示範到。千祈唔好叫幼童軍落水救人，亦唔好攞真溺者實習。'},
    /* ---- 頁35 「積極公民」獎章系列（要求喺外部網站，唔喺綱要） ---- */
    '防騙先鋒章':{how:['官方要求唔喺綱要入面，喺「積極公民」獎章網站。開網站同成員一齊睇佢要考邊個章。', '跟網站列嘅項目逐項做，每項留低證明（相片、證書或活動紀錄）。', '做完由幼童軍團長或班領導人核對，再向青少年活動署申請。'],
      pass:'跟「積極公民」獎章網站列明嘅該章要求完成並取得證書。本套包唔另設標準。'},
    '禁毒章':{how:['官方要求唔喺綱要入面，喺「積極公民」獎章網站。開網站同成員一齊睇佢要考邊個章。', '跟網站列嘅項目逐項做，每項留低證明（相片、證書或活動紀錄）。', '做完由幼童軍團長或班領導人核對，再向青少年活動署申請。'],
      pass:'跟「積極公民」獎章網站列明嘅該章要求完成並取得證書。本套包唔另設標準。'},
    '保護兒童章':{how:['官方要求唔喺綱要入面，喺「積極公民」獎章網站。開網站同成員一齊睇佢要考邊個章。', '跟網站列嘅項目逐項做，每項留低證明（相片、證書或活動紀錄）。', '做完由幼童軍團長或班領導人核對，再向青少年活動署申請。'],
      pass:'跟「積極公民」獎章網站列明嘅該章要求完成並取得證書。本套包唔另設標準。'},
    '社區應急先鋒章':{how:['官方要求唔喺綱要入面，喺「積極公民」獎章網站。開網站同成員一齊睇佢要考邊個章。', '跟網站列嘅項目逐項做，每項留低證明（相片、證書或活動紀錄）。', '做完由幼童軍團長或班領導人核對，再向青少年活動署申請。'],
      pass:'跟「積極公民」獎章網站列明嘅該章要求完成並取得證書。本套包唔另設標準。'},
    '環保先鋒章':{how:['官方要求唔喺綱要入面，喺「積極公民」獎章網站。開網站同成員一齊睇佢要考邊個章。', '跟網站列嘅項目逐項做，每項留低證明（相片、證書或活動紀錄）。', '做完由幼童軍團長或班領導人核對，再向青少年活動署申請。'],
      pass:'跟「積極公民」獎章網站列明嘅該章要求完成並取得證書。本套包唔另設標準。'},
    '機電先鋒章':{how:['官方要求唔喺綱要入面，喺「積極公民」獎章網站。開網站同成員一齊睇佢要考邊個章。', '跟網站列嘅項目逐項做，每項留低證明（相片、證書或活動紀錄）。', '做完由幼童軍團長或班領導人核對，再向青少年活動署申請。'],
      pass:'跟「積極公民」獎章網站列明嘅該章要求完成並取得證書。本套包唔另設標準。'},
    /* ---- 頁36–37 國家與社區（黃） ---- */
    '香港歷史章':{how:['先傾佢想做邊個主題（歷史名人／古舊建築／歷史大事／其他），寫低。','剪貼簿或者網站自己喺屋企做，集會只係跟進度。','揀三個法定古蹟，每個畫一幅海報介紹背景同參觀方法。','參觀博物館之前要攞團長同意；返嚟叫佢當面匯報。','叫佢講一條街或者一個地區名嘅命名典故。'],
      pass:'四項齊：作品完成、三幅古蹟海報、參觀過一間合資格博物館並已匯報、講得出街道或地區命名典故。',refs:[{label:'羅屋虛擬遊',url:'https://my.matterport.com/show/?m=GH6iviEibnC',src:'康樂及文化事務署'}]},
    '國家安全大使章':{how:['官方要求唔喺綱要入面，喺「積極公民」獎章網站。開網站同成員一齊睇佢要考邊個章。', '跟網站列嘅項目逐項做，每項留低證明（相片、證書或活動紀錄）。', '做完由幼童軍團長或班領導人核對，再向青少年活動署申請。'],
      pass:'跟「積極公民」獎章網站列明嘅該章要求完成並取得證書。本套包唔另設標準。'},
    /* ---- 頁38–47 多元創藝（藍） ---- */
    '藝術章':{how:['先同佢傾做邊三項，寫低喺卡上。','每項做完即場影相存檔，唔好留到最後先追。','每項完成叫佢用一句話講：我做咗乜、用咗乜方法。','三項齊晒，砌個小展示俾其他團員睇。'],
      pass:'完成三項唔同項目就達標。揀「其他」要先得到你同意。唔好代手——作品粗糙唔緊要，重點係佢自己做完同講得出意念。'},
    '手藝章':{how:['先逐樣工具教一次：鎚子、鋸子、螺絲批、板手、鉗子、拉尺、砂紙。每樣都要示範安全揸法同保養。','揀一件屋企或者團部用得著嘅嘢一齊設計，畫低尺寸。','量度、落釘、落螺絲、黐膠、打磨、著色，逐樣由佢做；你或者成人全程喺旁邊睇。','做完叫佢講：呢件嘢點用、點保養。'],
      pass:'四項全做到，件嘢真係用得。佢要示範到安全用工具同保養，唔係淨係做完件嘢。做嘢期間必須著保護衣物。'},
    '娛樂章':{how:['先傾做邊三項，寫低。','默劇、木偶戲、雜技、樂器、舞蹈、土風舞、唱歌、節奏樂器、講故事——每項排練最少一次先正式表演。','每項表演要真係有觀眾（團員就得），唔好淨係排練當完成。'],
      pass:'完成三項唔同項目，每項都有實際表演過。講故事要夠五分鐘；雜技或魔術要三個以上連串；揀「其他」要先得到你同意。'},
    '資訊科技章':{how:['先叫佢畫一張簡圖：電腦、平板、手機、鍵盤、滑鼠、螢幕、印表機、雲端同實體儲存。','用真實檔案教格式：揀一張 .jpg、一段 .mp4、一份 .docx，問佢分別係乜。','傾雲端儲存點運作：好處係乜、壞處係乜。','軟件兩項由佢揀：多媒體作品、A4 通告、或者 5 張投影片。','AI 分兩步：先傾概念同注意事項，再實際用一次圖像生成或者對話機器人。'],
      pass:'七項全做到。AI 部分要講得出基本原理、日常應用，同埋「用 AI 提供嘅資料要再三查證」。知識產權同誠實使用電腦要講得出，唔係淨係點頭。'},
    '語言章':{how:['先問佢用邊種語言（母語以外）。','情境題逐項問：附近商店、警署、郵局、教堂、油站、酒店喺邊？','再問公共交通：由屋企去學校點去？','教「單程路」「路不通行」、交通燈號、單程票，叫佢用該語言講返。','最後兩項：一星期七日、一年十二個月、日期點講；同埋附近邊度有免費上網、點連。'],
      pass:'五項全部用該語言答到，唔係用中文答。答唔順可以提示，但要佢自己講返一次。'},
    '媒體製作章':{how:['先傾做邊兩項，寫低。','海報／宣傳單張／橫額、簡易網站、電子書、三分鐘音頻故事、三分鐘主題短片、一分鐘動畫——每項做完即場睇一次。','網站要經你同意先可以發佈。'],
      pass:'完成兩項唔同項目，成品睇得到。音頻故事要有音樂同聲效；短片要有對白或旁白；動畫要夠一分鐘。'},
    '音樂章':{how:['先確認佢考邊級（初／中／高），逐級考，唔好跳。','技能：初級即場聽一段短曲唱返，再拍掌打另一首嘅節奏；中級同高級要 ABRSM 一級／三級或同等證明。','表演：安排一次真係有觀眾嘅場合，例如團集會、團體表演或音樂會。','知識：叫佢即場做音樂練習，再介紹所用樂器或歌曲。','興趣：傾佢最鍾意嘅音樂類別同最常聽嘅嘢。'],
      pass:'該級四項（技能／表演／知識／興趣）全部完成。高級表演必須一首獨奏、一首同他人合奏；知識要介紹三首相關作品加三位音樂家。中級則要兩首相關作品。'},
    '攝影章':{how:['逐樣指認相機部分：鏡頭、觀景器、閃燈、記憶咭、電池；再叫佢自己裝拆記憶咭同電池。','用數碼相機或手機實做：改拍攝模式、改設置、用變焦、傳相片去另一部機。','傾保養：相機同鏡頭點清潔、點存放。','一次旅行或活動影 12 張，返嚟用剪貼簿、電腦簡報或相冊展示，並講返個活動。'],
      pass:'四項全做到。12 張要係同一次活動嘅紀錄，唔係求其影；而且要真係展示過同講過。'},
    '寫作章':{how:['先確認佢而家考邊個進度章，因為指定字數唔同。','傾做邊三項，寫低。','詩要至少六行；完成後同佢傾詩句構造同意義。','交返嚟嘅作品要數字數，唔夠就叫佢補。'],
      pass:'完成三項唔同項目，每項字數夠：幼童軍歷奇章不少於 50 字、高級歷奇章不少於 150 字、金紫荊獎章不少於 250 字。'},
    /* ---- 頁48–52 科學與大自然（青） ---- */
    '天象章':{how:['先用星圖或 App 認黃道十二星座，逐個講主要特徵。','用燈同波示範月相、日食、月食。','太陽系行星逐個講名同特徵。','傾觀星禮儀同光污染對觀星嘅影響。','一齊做針孔投影儀觀太陽。','最後一項二選一：晚間戶外觀星，或者參觀香港太空館。'],
      pass:'六項全做到。觀星要真係去過一次，或者真係去過太空館。觀太陽必須用針孔投影，千祈唔好直接用眼或望遠鏡望太陽。',refs:[{label:'認識觀星禮儀｜教學簡報（桌上電腦版）',url:'https://drive.google.com/file/d/1XH2XOBwovsxY3kKspSQsrXW3JGdahKLs/view?usp=sharing',src:'香港童軍總會天文組'}]},
    '園藝章':{how:['呢章主要喺屋企做，要至少一個月。','先叫佢介紹四種香港常見植物：特徵、生長時節、喺邊度見到。','揀一株植物由種子開始種，每星期記低生長、形態、萌芽情況。','同時記低栽培注意事項（土壤、氣候、濕氣、溫度、時節）、繁殖栽種方法、點控制生長。','用具逐樣認，講點用點保養。'],
      pass:'三項全做到，而且真係有至少一個月嘅每週紀錄。冇紀錄就唔算完成。'},
    '科學章':{how:['先由佢自己揀兩個有興趣嘅實驗，做完向你解釋實驗同結論。','第二項由官方十個實驗入面揀兩個，逐個做。','每個實驗做完即場問佢：你發現咗乜？點解會咁？'],
      pass:'兩項自選實驗講得出過程同結論，加官方十項入面完成兩項。實驗要以佢自己發現為據，唔係照抄答案。'},
    '氣象章':{how:['先示範點用天氣 App 或者新聞攞天氣資訊。','逐個天氣要素傾：氣溫、風、降雨、紫外線指數；再問戶外活動點準備。','出情境題：雷暴警告、暴雨警告、熱帶氣旋警告發咗，你點做？','教辨四種雲：層雲、積雲、卷雲、積雨雲——最好出戶外指認。','二十四節氣揀最少六個講特點。','連續至少五日做天氣觀測，記低自己感覺，再同當時天氣資訊對比。'],
      pass:'七項全做到，包括至少五日嘅觀測紀錄，同埋最後三項入面完成兩項。冇紀錄就唔算完成。'},
    '地球部落計劃 – 走塑達人章、自然守護者章、日光善用者章':{how:['三個章嘅要求唔喺綱要，喺「地球部落」網站。開網站同成員一齊睇佢考邊個章。','跟網站列嘅挑戰逐項做，每項留低證明。','做完由幼童軍團長核對，再按網站程序申請。'],
      pass:'跟「地球部落」網站列明嘅該章挑戰完成並取得認證。本套包唔另設標準。'},
    /* ---- 頁53–67 運動與愛好（橙） ---- */
    '射箭章':{how:['呢章要合資格教練指導，唔好自己開弓。','知識部分教一次就得，考高一級時無須重考。','訓練四項每次都要重新做：安全規則、基本姿勢、記錄積分、不少於 8 小時訓練。','實射按級別計環數，由教練記錄。'],
      pass:'知識、訓練、實射三部分全齊。實射環數要夠該級標準，例：初級 10 米 122 厘米靶連續 6 箭，反曲弓不少於 24 環。'},
    '田徑章':{how:['四個項目全部要做：跳遠、跳高、擲豆袋、50米急跑。','每項試三次，取最好成績。','按官方評分表計分，分 10 分、7 分、5 分三檔。','加總四項分數，對返該級門檻。'],
      pass:'四項全部有成績，總分夠該級：初級 22 分、中級 28 分、高級 34 分。少做一個項目就唔算完成。'},
    '閱讀章':{how:['叫佢列返最近睇過嘅書同作者，揀三本講內容。三本要佢自己揀，最少一本故事書、一本寫實書籍。','深淺要配合佢年齡同能力，唔好求其揀。','傾點保護同儲存書籍。','實地教：用中英文字典、地圖集或街道圖。','去一次圖書館，叫佢解釋書籍點分類陳列，再示範喺館內或網上目錄搵一本小說。'],
      pass:'四項全做到，三本書要真係講得出內容。實體書同電子書都要識搵。'},
    '獨木舟章':{how:['先確認佢考邊級。','第一項：本會游泳測試，由合資格人士評核。','第二項：考獲中國香港獨木舟總會少年獨木舟章（初級海馬、中級海豹、高級海象）或同等資歷。','攞到證書後由幼童軍團長核對簽發。'],
      pass:'游泳測試通過，並考獲該級獨木舟總會章或同等資歷。課程以該運動所屬總會最新課程為準，本套包唔另設標準。'},
    '搜集章':{how:['呢章要至少四個月，主要喺屋企做。','先傾佢想搜集乜，講清楚點解揀呢樣、打算點搜集、點保存。','由你同意嗰日起計四個月，期間定期問進度。','如果佢本身已經搜集緊，都要由第 1 項完成後起計再搜集四個月。'],
      pass:'兩項全做到：搜集計劃經你同意，而且由同意日起計真係搜集咗至少四個月並有系統整理。期間斷咗就要重新計。'},
    '烹飪章':{how:['先傾兩種烹飪方法嘅優缺點，同埋均衡飲食嘅重要。','餐單要先同你傾過並得到主考同意。中式兩餸一湯加白飯；西式餐湯、主菜、甜品。','由佢由頭做到尾：計劃、烹調、擺枱、上菜、清理。','另外預備熱飲品同小食，做下午茶或輕便午餐。','最後叫佢解釋廚房安全同衞生守則。'],
      pass:'四項全做到。菜式唔可以純用市面預製食品完成（可做部分食材）。用利器同爐具時要注意安全，請參閱「使用爐具安全指引」。'},
    '單車章':{how:['先確認佢識踩雙輪單車。','逐項實做：正確上車下車、清潔上油打氣、保持性能、停放上鎖、修補輪胎。','最後一項喺你觀察下行一段短路程，途中要有十字路口、行人橫過馬路處、右轉同迴旋處。','全程必須戴合適保護裝備。'],
      pass:'七項全做到，短路程要正確用到交通規則嘅手號同守則。冇戴保護裝備唔好開始。'},
    '公園定向章':{how:['必須依次序考：初級 → 中級 → 高級，唔好跳。','初級先要完成公園定向訓練課程，加一次相關體驗活動。','中級要示範正置地圖同拇指輔行法，再参加一次同樂日或比賽。','高級要識地圖比例、等高線、國際控制點提示符號，描述 100 米路程所見，加完成最少兩次比賽。'],
      pass:'各級項目全部完成。注意：中級 d 項（同樂日或比賽）同高級 e 項（兩次比賽）唔可以係同一個活動。'},
    '寵物章':{how:['呢章要三個月，喺屋企做。','由開始飼養嗰日起，記錄生活習慣同生長過程，包括特徵同變化，附相片或圖片。','期間定期問佢：今日餵咗乜？佢有乜變化？','另外要講得出：原產地、需要嘅特別照顧、點辨別同處理普通病症。'],
      pass:'兩項全做到，而且真係有三個月嘅紀錄同相片。冇紀錄就唔算完成。'},
    '體適能章':{how:['五個測試項目全部要做：皮摺量度、曲膝仰臥起坐、坐地前伸、耐力跑、手握力或仰臥引體上升。','按「學校體適能獎勵計劃」嘅最新標準執行。','如果佢已考獲校內「學校體適能獎勵計劃」金、銀、銅獎章，可豁免本章相同級別。','攞到證明後由幼童軍團長核對。'],
      pass:'五項全部完成並按該計劃標準評核。課程以教育局頒佈嘅最新「學校體適能獎勵計劃」為依歸，本套包唔另設標準。'},
    '風帆章':{how:['第一項：本會游泳測試，由合資格人士評核。','第二項二選一：考獲香港滑浪風帆會兒童滑浪風帆體驗證書，或中國香港帆船運動總會少年帆船課程第一級證書，或同等資歷。','攞到證書後由幼童軍團長核對簽發。'],
      pass:'游泳測試通過，並考獲上述其中一項證書或同等資歷。課程以該運動所屬總會最新課程為準，本套包唔另設標準。'},
    '水手章':{how:['第一項：本會游泳測試。','理論喺團部做：訊號旗、「海上活動中心守則」、「水上安全守則」、點攞天氣預告、風同潮汐水流嘅影響、標準艇裝備同各部分名稱。','實做要去海上活動中心：拋救生繩到 8 公尺外、單槳搖小艇到 10 公尺外並拾起目標物。','八個繩結逐個教：8 字結、接繩結、雙接繩結、錨結、稱人結、繫木結、雙套結、普通繩端結。每個都要講用途。'],
      pass:'九項全做到。八個繩結要綁得出兼講得出用途，唔係淨識綁。水上項目必須喺海上活動中心由合資格人士指導。'},
    '運動章':{how:['先叫佢揀兩種運動，逐種講玩法、基本規則、需要乜裝備、有乜安全事項。','由兩種入面揀一種深入，之後要真係恆常参加。','傾該項運動嘅用具同服裝點保養。','喺團遊戲入面觀察佢嘅體育精神。','最後傾：運動後點解要清潔同更衣，點保護身體各部位（例如足部）。'],
      pass:'五項全做到。第 2 項要真係恆常参加，唔係做過一次就算。體育精神要喺實際遊戲入面睇到。'},
    '游泳章':{how:['先確認佢考邊級，逐級考。','必須喺合資格人士監督下喺泳池進行。','初級八項：跳入水、呼吸練習、俯浮滑進、仰浮滑進、俯浮划水 10 米、仰浮划水 10 米、拯溺式背泳 10 米、胸泳或捷泳或背泳 25 米。','中級五項、高級四項按官方逐項做。','每項即場記錄成績。'],
      pass:'該級全部項目完成並達到官方距離同時間要求，例：高級要踏水 3 分鐘、游 200 米並潛泳最少 5 米。必須由合資格人士評核。'},
    '世界友誼章':{how:['呢章要至少四個月。','先揀一個世界童軍組織內嘅國家或地區，做剪貼簿：民族生活方式、食物特色、風俗習慣。','傾聯合國：組織、歷史、旗幟同意義。','叫佢列十個香港以外嘅世界童軍組織國家或地區，並講其中三個嘅旗幟意義。','安排同外國童軍通訊最少兩次。'],
      pass:'四項全做到，剪貼簿真係花咗至少四個月，同外國童軍通訊真係有兩次。'},
    /* ---- 頁68–70 其他徽章 ---- */
    '宗教章':{how:['先確認佢跟邊套課程：基督教、孔教、佛教、天主教、回教、道教。','只跟其中一套，唔好溝埋。','按該套課程嘅項目逐項做，例如背誦、唱詩、講故事、參觀。','涉及宗教場所或儀式嘅項目，最好由該宗教人士或家長協助。'],
      pass:'該套課程嘅全部項目完成。唔可以混用唔同課程嘅項目湊數。'},
    '童軍先修章':{how:['先確認佢年滿十歲半。','認知部分喺團部做：童軍支部嘅目的同方法、童軍制服、小隊制度、獎章制度。','參與部分：經幼童軍團長同童軍團長同意，由童軍團嘅團隊長或隊長帶，参加不少於兩次童軍團集會。','新體驗部分：同樣經兩位團長同意，参加一項佢做幼童軍時未試過嘅童軍活動。','完成後由幼童軍團長簽發。'],
      pass:'認知、參與、新體驗三部分全部完成，參與要真係唔少於兩次童軍團集會。考獲後可豁免金紫荊獎章童軍家庭 4.4.1 d 項。'},
  };
  /* 建議考核 HTML：有寫就用專屬內容，未寫就明確講未寫（唔好扮有內容） */
  App.assessHtml = function(name){
    var key = App.officialBadges[name] ? name : String(name).replace(/（[^）]*）/g,'').trim();
    var a = App.badgeAssess[key];
    if(!a) return '<p class="mut">呢章嘅建議考核未寫。官方要求請睇上一個分頁。</p>';
    return '<p class="mut">以下係本套包建議嘅帶法，唔取代官方要求。</p>'+
      '<p><b>🎯 如何進行考核：</b></p><ol>'+a.how.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol>'+
      '<p><b>✅ 何謂達標：</b>'+esc(a.pass)+'</p>'+
      /* refs 屬可選欄位，只有少數章有官方教學資源連結。
         放喺建議考核尾部，唔開新頁——領袖喺呢章就搵到。 */
      (a.refs&&a.refs.length
        ? '<p><b>📎 官方教學資源：</b></p><ul>'+a.refs.map(function(r){
            return '<li><a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.label)+'</a><span class="mut">（'+esc(r.src)+'）</span></li>';
          }).join('')+'</ul>'
        : '');
  };
  App.openBadge = function(name){var official='https://prog.scouting.org.hk/cub/training-scheme/',
      /* 組別格仔用官方全名（例：體操章（三級制度）），officialBadges 用短名（體操章）。
         剝走括號後綴再查一次，否則內容明明寫好都撳唔到。 */
      spec=App.officialBadges[name] || App.officialBadges[String(name).replace(/（[^）]*）/g,'').trim()], officialHtml=spec?'<p><b>目的：</b>'+esc(spec.purpose)+'</p>'+(spec.rule?'<p class="mut">'+esc(spec.rule)+'</p>':'')+'<ol>'+spec.items.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol>'+(spec.note?'<p class="safe">'+esc(spec.note)+'</p>':'')+(spec.legacy?'<p class="safe">⚠️ 舊制章 — 2026 第十版目錄已無此章。舊制綱要頁 '+spec.page+'。'+esc(spec.legacyNote)+'</p>':'<p class="mut">官方綱要頁 '+spec.page+'</p>')+(spec.legacy?'<p class="mut">內容來源：舊制《幼童軍訓練綱要》。2026 年第十版第三章已無此章。</p>':'<p class="mut">官方內容來源：《幼童軍訓練綱要》2026 年第十版第三章（活動徽章及其他徽章）。</p>'):'<p>官方內容正在按 2026 年第十版逐章內置。</p>';Modal.open('<h2>🎖️ '+esc(name)+(spec&&spec.legacy?'（舊制）':'')+'</h2><div class="subtabs badge-detail-tabs"><button class="subtab cur" onclick="App.switchBadgeTab(this,\'official\')">官方要求</button><button class="subtab" onclick="App.switchBadgeTab(this,\'suggest\')">建議考核</button></div><div id="badge-official">'+officialHtml+'</div><div id="badge-suggest" class="hidden">'+App.assessHtml(name)+'</div><div class="attachment-row"><a class="btn ghost" href="'+official+'" target="_blank" rel="noopener">📎 開官方訓練綱要附件</a></div><button class="btn" onclick="Modal.close()">關閉</button>');};
  App.switchBadgeTab = function(btn,key){var root=btn.closest('.mbox');root.querySelectorAll('.badge-detail-tabs .subtab').forEach(function(x){x.classList.remove('cur');});btn.classList.add('cur');root.querySelector('#badge-official').classList.toggle('hidden',key!=='official');root.querySelector('#badge-suggest').classList.toggle('hidden',key!=='suggest');};

  App.vSongs = App.vPrint;

  App.vSong = App.vSongs;

  App.vSafety = function(){
    return '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><h2>🛡️ 安全（RAM風險評估）</h2><div style="border-radius:12px;overflow:hidden;max-height:150px;margin-bottom:8px"><img src="assets/manual/safety.avif" style="width:100%;height:auto" onerror="this.style.display=\'none\'"></div><p class="mut">跟 ghmeeting 工具頁同款：即開即用卡片。</p>'+
      '<div class="manual-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))"><div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/ram-checklist.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>風險評估</h3><p class="mut" style="font-size:12px">RAM清單，checklist</p><button class="btn sm" onclick="Modal.open(\'<h2>RAM風險評估</h2><p>天氣·場地·人·物資·活動，5項檢查</p>\')">▶ 開清單</button></div>'+
      '<div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/sfh-principles.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>安全原則</h3><p class="mut" style="font-size:12px">SFH原則，兩人同行</p><button class="btn sm" onclick="Modal.open(\'<h2>安全原則</h2><p>SFH：Safety First（安全第一）；活動前檢查場地、天氣、人手；兩名成人同行，不讓成員落單。</p>\')">▶ 開原則</button></div>'+
      '<div class="activity-card" style="border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff"><div style="border-radius:8px;overflow:hidden;max-height:100px;margin-bottom:6px"><img src="assets/manual/details/first-aid.avif" style="width:100%;height:auto" onerror="this.parentElement.style.display=\'none\'"></div><h3>急救</h3><p class="mut" style="font-size:12px">擦傷·包紮·求助</p><button class="btn sm" onclick="App.activity(\'c08\',1)">▶ 開急救卡</button></div></div></section>';
  };

  App.vTools = function(teams){
    var isTeams = !!teams;
    if(isTeams){
      return '<section class="card"><a class="back" href="#tools" style="text-decoration:none;color:var(--ord)">‹ 返回快鍵</a><h2>🐾 小隊計分</h2><p class="mut">紅黃藍綠四隊；撳 ＋1／－1 即加分。分數只喺今場畫面，唔會儲存。</p><div id="leadscore"></div></section>';
    }
    return '<section class="card"><a class="back" href="#plan" style="text-decoration:none;color:var(--ord)">‹ 返回</a><h2>🎲 快鍵（集會中途即用）</h2><p class="mut">即撳即用，唔影響今場流程：發訊號、抽籤、計分、倒數。</p>'
      + '<div class="tk-grid">'
      + '<button class="tk-btn" onclick="Lead.whistle()"><b>🤫 安靜訊號</b><small>響兩下·5秒望住我</small></button>'
      + '<button class="tk-btn" onclick="Lead.horn()"><b>📣 集合</b><small>吹哨·全體集合</small></button>'
      + '<button class="tk-btn" onclick="Tools.pick()"><b>🎲 抽籤</b><small>隨機抽一個人</small></button>'
      + '<a class="tk-btn" href="#teams"><b>🐾 小隊計分</b><small>開計分板·紅黃藍綠</small></a>'
      + '</div>'
      + '<div id="toolpick" class="toolpick" style="min-height:28px;margin:10px 0;font-size:20px;font-weight:800;color:var(--ord)"></div>'
      + '<h3>⏱️ 倒數計時</h3><div style="display:flex;gap:8px;align-items:center"><label style="flex:1">分鐘 <input id="toolMinutes" type="number" min="1" max="120" value="5" onchange="Tools.reset()"></label><div id="toolClock" role="status" class="tool-clock" style="font-size:32px;font-weight:800">05:00</div></div><div class="btns"><button class="btn gr" onclick="Tools.start()">開始</button><button class="btn" onclick="Tools.stop()">暫停</button><button class="btn ghost" onclick="Tools.reset()">重設</button></div></section>';
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
      lead: function(){ return App.vLead(); },
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
      skills: function(){return App.vLibrary(true);}, /* 同 #play 同一頁：活動＋技能合併 */
      teams: function(){return App.vTools(true);},
      tools: function(){return App.vTools(false);},
      pack: function(){ return (typeof oldPack==='function') ? oldPack() : App.vPrint(); },
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
    if(tab==='lead' && typeof Lead!=='undefined') Lead.mount();
    if(tab==='teams' && typeof Lead!=='undefined' && Lead.renderScore) Lead.renderScore();
    window.scrollTo(0,0);
  };

  /* 全站搜尋：搵集會題目、目標、活動名、徽章或綱要編號，即時列出可點結果 */
  App.searchOpen = function(){
    Modal.open('<h2>🔍 全站搵嘢</h2><p class="mut">打關鍵字，即時搵集會題目、目標、活動名、徽章或綱要編號。</p><input id="searchbox" class="search-input" type="search" placeholder="例：急救／指南針／誓詞／會員章" autocomplete="off" oninput="App.searchRun()"><div id="searchout" class="searchout"></div>');
    setTimeout(function(){var b=document.getElementById('searchbox');if(b)b.focus();},60);
  };
  App.search = App.searchOpen;
  App.searchRun = function(){
    var q = (document.getElementById('searchbox').value||'').trim().toLowerCase();
    var out = document.getElementById('searchout');
    if(!out) return;
    if(q.length < 1){ out.innerHTML=''; return; }
    var hits = [];
    DATA.meetings.forEach(function(m){
      var hay = (m.n+' '+m.goal+' '+m.badge+' '+m.month+' '+m.refs.join(' ')+' '+m.segs.map(function(s){return s.n+' '+s.how+' '+s.safety;}).join(' ')).toLowerCase();
      if(hay.indexOf(q) >= 0) hits.push(m);
    });
    if(!hits.length){
      out.innerHTML = '<p class="mut">搵唔到「'+esc(q)+'」。試其他字眼，例如「繩」「急救」「地圖」。</p>';
      return;
    }
    out.innerHTML = '<p class="mut">搵到 '+hits.length+' 場，撳落去即開：</p>'+hits.slice(0,30).map(function(m){
      return '<a class="search-hit" href="#meet?tid='+m.tid+'" onclick="Modal.close()"><b>'+esc(m.n)+'</b><small>'+esc(m.month)+' · '+esc(m.badge)+' · '+esc(m.refs.join('／'))+'</small></a>';
    }).join('');
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
  start:function(){if(Tools.timer)return;if(Tools.seconds<=0)Tools.reset();Tools.timer=setInterval(function(){Tools.seconds--;Tools.draw();if(Tools.seconds<=0){Tools.stop();if(typeof Lead!=='undefined'&&Lead.beep)Lead.beep();toast('⏱️ 時間到！');}},1000);},
  /* 抽籤：結果直接顯示喺快鍵頁（#toolpick），唔再靠隱形嘅投影區 */
  pick:function(){
    var roster = (typeof Store!=='undefined') ? Store.get('roster',[]) : [];
    var pool = roster.length ? roster : ['1號','2號','3號','4號','5號','6號','7號','8號','9號','10號','11號','12號'];
    var n = pool[Math.floor(Math.random()*pool.length)];
    if(typeof Lead!=='undefined'&&Lead.beep) Lead.beep(1200,0.3);
    var el = document.getElementById('toolpick');
    if(el) el.textContent = '🎲 抽中：'+n+'（再撳一次再抽）';
    toast('🎲 抽中：'+n);
  }
};
