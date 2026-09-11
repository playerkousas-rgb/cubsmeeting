/* ghmeeting-inspired preparation and in-meeting tools; existing cub_* records retained. */
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
  App.vPlan = function () {
    var ms = DATA.meetings, done = Store.get('done', {});
    var count = ms.filter(function (m) { return done[m.tid]; }).length;
    return '<section class="hero"><div class="troop">CUB HUB / 幼童軍團集會助手</div><h1>準備少啲，<br>一齊探索多啲。</h1><p>據幼童軍訓練綱要設計，將訓練目標化成即用集會、教材與逐步帶領支援。</p><div class="quick"><button class="btn gr" onclick="App.quickStart()">繼續準備今場 →</button><a class="btn ghost" href="#meet">搵個範本</a></div><div class="stats"><span><b>' + count + '/' + ms.length + '</b> 已完成</span><span><b>' + esc(Store.get('headcount',24)) + '</b> 團員</span></div></section>' +
      '<section class="card current-meeting"><div><span class="eyebrow">今場集會</span><h2>' + esc(curMeet().n) + '</h2><p class="mut">' + curMeet().mins + '分鐘 · 印教材 → 執袋 → 設場 → 帶領</p></div><button class="btn gr" onclick="App.quickStart()">開準備卡 →</button></section>' +
      '<section class="card"><div class="section-heading"><h2>📅 集會目錄</h2><span class="mut">自訂範本 · 按需要選用</span></div><p class="mut">撳場次開始準備；完成狀態獨立記錄。</p><div class="catalog">' + ms.map(function(m,i) {
        return '<div class="catalog-row"><a href="#prep?tid=' + m.tid + '"><span class="mno">' + String(i+1).padStart(2,'0') + '</span><span><b>' + esc(m.n) + '</b><small>' + esc(m.month) + ' · ' + m.mins + '分鐘 · ' + m.segs.length + '個環節</small></span><span class="go">→</span></a><button class="status-chip" aria-label="' + esc(m.n) + '：' + (done[m.tid]?'改為未完成':'標記完成') + '" onclick="App.toggleDone(\'' + m.tid + '\')">' + (done[m.tid]?'✓ 已完成':'未完成') + '</button></div>';
      }).join('') + '</div></section><details class="card"><summary>📨 活動通告與報名資訊</summary>' + extBtn(EXTERNAL.circulars,false,'睇最新通告同活動','揀層級＋今天／七天／三十天，搵唔到再放寬搜尋。') + '</details>';
  };
  App.vMeetList = function () {
    return '<section class="card"><h2>🧩 揀個範本，開始準備</h2><p class="mut">唔使由零砌流程；揀好就一步步帶住做。</p><div class="template-grid">' + DATA.meetings.map(function(m) {
      return '<a class="template-card" href="#prep?tid=' + m.tid + '"><span class="eyebrow">' + esc(m.tags) + '</span><h3>' + esc(m.n) + '</h3><p>' + m.mins + '分鐘 · ' + m.segs.length + '個環節</p><b>準備呢場 →</b></a>';
    }).join('') + '</div></section>';
  };
  App.vPrep = function () {
    var m = curMeet(), s = Flow.st(), current = Flow.cur();
    return '<section class="card"><a class="back" href="#plan">‹ 集會目錄</a><span class="eyebrow">今場準備</span><h1>' + esc(m.n) + '</h1><p class="mut">約' + m.mins + '分鐘 · ' + esc(Store.get('headcount',24)) + '人 · 進度自動保留</p><div class="prep-steps">' + Flow.STEPS.filter(function(x){return x.k !== 'pick' && x.k !== 'sync';}).map(function(x,i){
      var done = !!s.done[x.k], active = current && current.k === x.k;
      return '<section class="prep-step ' + (done?'complete':active?'active':'pending') + '"><span class="step-number">' + (done?'✓':i+1) + '</span><div><h3>' + x.ic + ' ' + x.n + '</h3>' + (done?'<small>已完成</small>':'<p>' + x.why + '</p>') + '<button class="btn ' + (active?'gr':'ghost') + '" onclick="' + x.go + '">' + (done?'再開一次':x.btn) + '</button></div></section>';
    }).join('') + '</div><div class="quick"><a class="btn" href="#meet?tid=' + m.tid + '">📋 睇全部資料</a><button class="btn ghost" onclick="Flow.quit()">收埋嚮導</button></div></section>' + (s.done.rec?'<section class="card"><h2>🎉 今場完成，辛苦晒！</h2>' + extBtn(EXTERNAL.badge,false,'開進度追蹤APP','如需記錄長期獎章進度，可另外開啟。') + '</section>':'');
  };
  App.vLibrary = function (skills) {
    var cards = [], seen = {};
    DATA.meetings.forEach(function(m){m.segs.forEach(function(s,i){
      if(seen[s.n] || (skills && !/結|急救|方向|指南|露營|路標|煮食|包紮/.test(s.n))) return;
      seen[s.n]=1;
      cards.push('<article class="activity-card"><div class="adia">' + (s.svg||'') + '</div><h3>' + esc(s.n) + '</h3><p class="mut">' + s.m + '分鐘</p><button class="btn" onclick="App.activity(\'' + m.tid + '\',' + i + ')">▶ 即開帶領卡</button></article>');
    });});
    return '<section class="card"><h2>' + (skills?'🪢 技能帶領卡':'🎮 活動庫') + '</h2><p class="mut">想加一節，即開即用；唔會改動今場準備。</p><div class="template-grid">' + cards.join('') + '</div></section>';
  };
  App.activity = function(tid,i){
    var s = DATA.meetings.find(function(m){return m.tid===tid;}).segs[i], g = Guide.forStage(s);
    Modal.open('<h2>' + esc(s.n) + '</h2><div class="adia">' + (s.svg||'') + '</div><p class="say">📢 ' + esc(s.script) + '</p><ol class="lsteps">' + g.steps.map(function(x){return '<li><b>' + esc(x[2]) + '</b> — ' + esc(x[3]) + '</li>';}).join('') + '</ol><details><summary>玩法、節奏與安全</summary><p>' + esc(s.how) + '</p><p>' + esc(s.rhythm) + '</p><p class="safe">' + esc(s.safety) + '</p></details>');
  };
  App.vSheets = function(){
    return '<section class="card"><h2>✂️ 工作紙索引</h2><p class="mut">按集會查找圖紙。現有列印仍是基本版，完整即用教材待逐款補齊。</p>' + DATA.meetings.map(function(m){return '<details class="sheet-entry"><summary>' + esc(m.n) + ' · ' + m.sheets.length + '款</summary><ul>' + m.sheets.map(function(s){return '<li>' + esc(s) + '</li>';}).join('') + '</ul><a class="btn" href="#prep?tid=' + m.tid + '">準備呢場及印教材 →</a></details>';}).join('') + '</section>';
  };
  App.vTools = function(teams){
    return '<section class="card"><h2>' + (teams?'🐾 小隊計分':'🎲 現場快鍵') + '</h2><p class="mut">即撳即用，唔影響今場流程。</p>' + (teams?'<div id="leadscore"></div>':'<div class="tool-grid"><button class="btn" onclick="Lead.whistle()">🤫 安靜訊號</button><button class="btn" onclick="Lead.horn()">📣 集合</button><button class="btn" onclick="Lead.pick()">🎲 抽籤</button><a class="btn" href="#teams">🐾 小隊計分</a></div><h3>⏱️ 倒數計時</h3><label>分鐘 <input id="toolMinutes" type="number" min="1" max="120" value="5" onchange="Tools.reset()"></label><div id="toolClock" role="status" class="tool-clock">' + Tools.time() + '</div><div class="quick"><button class="btn gr" onclick="Tools.start()">開始</button><button class="btn" onclick="Tools.stop()">暫停</button><button class="btn" onclick="Tools.reset()">重設</button></div>') + '</section>';
  };
  App.route = function(){
    var hash = location.hash || '#plan', tab = hash.split('?')[0].slice(1), match = hash.match(/[?&]tid=([^&]+)/);
    if(tab === 'prep' && match){
      var tid = decodeURIComponent(match[1]);
      if(DATA.meetings.some(function(m){return m.tid===tid;})) { App.prepare(tid); return; }
    }
    var render = {prep:App.vPrep,sheets:App.vSheets,play:function(){return App.vLibrary(false);},skills:function(){return App.vLibrary(true);},teams:function(){return App.vTools(true);},tools:function(){return App.vTools(false);}};
    if(!render[tab]){oldRoute();return;}
    App.tab=tab;
    document.getElementById('view').innerHTML=render[tab]();
    document.querySelectorAll('#topnav a, #tabbar a').forEach(function(a){a.classList.toggle('cur',a.getAttribute('href')==='#'+tab);});
    handleOffline(); Flow.render();
    if(['play','skills','teams','tools','sheets'].indexOf(tab)>=0){document.getElementById('flowbar').className='';document.getElementById('flowbar').innerHTML='';document.getElementById('view').style.paddingBottom='';}
    if(tab==='teams')Lead.renderScore();
    window.scrollTo(0,0);
  };
  var mark = Flow.mark;
  Flow.mark = function(k,quiet){mark(k,quiet);if(App.tab==='prep')App.route();};
  // Starting the display is not evidence that a meeting has been completed.
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
