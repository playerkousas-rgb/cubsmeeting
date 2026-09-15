/* Story reader + 投屏講故事 (projector stage)：分段大圖、大字、鍵盤／觸控翻頁。
   場景圖為 AI 繪製教學插畫（非總會官方原圖）；故事文字依總會《森林故事》內容改寫。 */
var Jungle = {
  episode:0,page:0,
  /* 每張投屏圖都喺 assets/jungle/slides/；未齊圖嘅段落用角色卡代替，唔會開天窗。 */
  slideSrc:function(name){return name?'assets/jungle/slides/'+name+'.avif':'';},
  /* 有啲段落嘅圖仲喺 pendingArt（分批繪製）：未出圖就用角色卡，唔會開天窗。 */
  artReady:function(name){return !!(name&&(DATA.jungle.pendingArt||[]).indexOf(name)<0);},
  slideImg:function(name,alt,lazy){
    if(!name)return '';
    return '<img class="story-photo" src="'+Jungle.slideSrc(name)+'" alt="'+esc(alt||'故事插圖（AI繪製教學插畫）')+'"'+(lazy?' loading="lazy"':'')+' onerror="this.hidden=true;this.nextElementSibling.hidden=false">'+
      '<p class="safe" hidden>插圖未能載入（可能未快取）。文字一樣可以講；重新載入或用「角色卡」頂住。</p>';
  },
  portraits:function(ids,lazy){return '<div class="story-cast">'+ids.map(function(id){var c=DATA.jungle.characters.find(function(c){return c.id===id;});return c?'<figure><img src="'+c.img+'" alt="'+esc(c.name+'：'+c.kind)+'" width="100" height="100"'+(lazy?' loading="lazy"':'')+' onerror="this.hidden=true;this.nextElementSibling.insertAdjacentHTML(\'beforeend\',\'<small>（圖片未能載入）</small>\')"><figcaption>'+esc(c.name)+'</figcaption></figure>':'';}).join('')+'</div>';},
  card:function(id){var c=DATA.jungle.characters.find(function(x){return x.id===id;});if(!c)return;Modal.open('<h2>'+esc(c.name)+' <small>'+esc(c.english)+'</small></h2>'+(c.img?'<img class="character-portrait" src="'+c.img+'" alt="'+esc(c.name)+'" onerror="this.hidden=true">':'')+'<p class="eyebrow">'+esc(c.kind)+' · '+esc(c.gender||'')+'</p><p>'+esc(c.role)+'</p><h3>問一問</h3><p>'+esc(c.question)+'</p><details><summary>睇答案及帶領提醒</summary><p>'+esc(c.answer)+'</p><p class="mut">'+esc(c.check)+'</p></details>');},
  /* ---------- 逐段閱讀（維持有問題／答案分隔） ---------- */
  open:function(i){if(!DATA.jungle.episodes[i])return;Jungle.episode=i;Jungle.page=0;Jungle.render();},
  move:function(delta){var ep=DATA.jungle.episodes[Jungle.episode];Jungle.page=Math.max(0,Math.min(ep.scenes.length-1,Jungle.page+delta));Jungle.render();},
  render:function(){var ep=DATA.jungle.episodes[Jungle.episode],s=ep.scenes[Jungle.page];Modal.open('<div class="story-reader"><p class="eyebrow">'+esc(ep.title)+' · '+(Jungle.page+1)+' / '+ep.scenes.length+'</p><h2>'+esc(s.title)+'</h2>'+(Jungle.artReady(s.img)?Jungle.slideImg(s.img,s.title,true):'')+Jungle.portraits(s.cast)+'<p class="story-text">'+esc(s.text)+'</p><p class="mut">出場：'+s.cast.map(function(id){return esc(DATA.jungle.characters.find(function(c){return c.id===id;}).name);}).join('、')+'</p><h3>停一停，問一問</h3><p>'+esc(s.question)+'</p><p class="safe">現實生活：'+esc(s.lesson)+'</p><details><summary>領袖參考答案</summary><p>'+esc(s.answer)+'</p></details><div class="quick"><button class="btn gr" onclick="Jungle.show('+Jungle.episode+')">📺 投屏講故事</button><button class="btn" onclick="Jungle.move(-1)" '+(Jungle.page===0?'disabled':'')+'>‹ 上一段</button><button class="btn" onclick="Jungle.move(1)" '+(Jungle.page===ep.scenes.length-1?'disabled':'')+'>下一段 ›</button><button class="btn" onclick="Modal.close()">收起故事</button></div><p class="mut">教學改寫 · 場景圖為 AI 生成教學插畫，非官方原圖 · 可離線閱讀</p></div>');},
  /* ---------- 投屏模式 ---------- */
  stageState:{ep:0,slide:0,ask:false},
  /* 投屏第一張係封面（大圖＋集名），之後每段一張。 */
  slides:function(i){
    var ep=DATA.jungle.episodes[i];if(!ep)return [];
    var d=DATA.jungle.decks[ep.id]||{};
    return [{cover:true,img:d.cover,title:ep.title,text:d.subtitle||'',cast:ep.characters.slice(0,6)}].concat(ep.scenes);
  },
  slideTotal:function(i){return Jungle.slides(i).length;},
  stageHTML:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], all=Jungle.slides(Jungle.stageState.ep), s=all[Jungle.stageState.slide], d=DATA.jungle.decks[ep.id]||{};
    var cast=s.cast.map(function(id){var c=DATA.jungle.characters.find(function(c){return c.id===id;});return c?c.name:'';}).filter(Boolean);
    var art=s.cover?d.cover:s.img;
    return '<div class="story-stage'+(s.cover?' on-cover':'')+'">'+
      '<header class="story-bar"><b>🌳 '+esc(ep.title)+'</b><span class="story-count">'+(Jungle.stageState.slide+1)+' / '+all.length+'</span>'+
      '<span class="story-spacer"></span>'+
      '<button class="btn sm" onclick="Jungle.stageAsk()" aria-pressed="'+(Jungle.stageState.ask?'true':'false')+'">❓ 問題</button>'+
      '<button class="btn sm" onclick="Jungle.fontStep(-1)" aria-label="字細啲">A－</button>'+
      '<button class="btn sm" onclick="Jungle.fontStep(1)" aria-label="字大啲">A＋</button>'+
      '<button class="btn sm" onclick="Jungle.full()">⛶ 全螢幕</button>'+
      '<button class="btn sm" onclick="Jungle.stageClose()">✕ 收幕</button></header>'+
      '<div class="story-body">'+
        '<div class="story-visual">'+(Jungle.artReady(art)?Jungle.slideImg(art,s.title):Jungle.portraits(s.cast))+
        (!s.cover&&s.img&&!Jungle.artReady(s.img)?'<p class="story-hint">呢段嘅大圖仲喺製作中，先用角色卡講；其他段落嘅圖照用。</p>':'')+'</div>'+
        '<div class="story-words"><p class="eyebrow">'+esc(s.cover?'第 '+(Jungle.stageState.ep+1)+' 集｜'+s.text: s.title)+'</p><p class="story-lead">'+esc(s.cover?s.title:s.text)+'</p>'+
        (cast.length?'<p class="story-castline">出場：'+esc(cast.join('、'))+'</p>':'')+
        (s.cover?'':'<p class="story-hint">撳「下一張」開始講</p>')+
        (Jungle.stageState.ask&&!s.cover?'<div class="story-ask reveal"><p class="q">❓ '+esc(s.question)+'</p><details><summary>領袖答案</summary><p>'+esc(s.answer)+'</p></details></div>':'<p class="story-hint">撳「❓ 問題」先問成員，再揭答案</p>')+
        '</div></div>'+
      '<footer class="story-foot">'+
        '<button class="btn gr" onclick="Jungle.stageMove(-1)" '+(Jungle.stageState.slide===0?'disabled':'')+'>‹ 上一張</button>'+
        '<span class="story-dots">'+all.map(function(_,i){return '<i class="'+(i===Jungle.stageState.slide?'cur':'')+'"></i>';}).join('')+'</span>'+
        '<button class="btn gr" onclick="Jungle.stageMove(1)" '+(Jungle.stageState.slide===all.length-1?'disabled':'')+'>下一張 ›</button>'+
        '<button class="btn" onclick="Jungle.episodeStep('+(Jungle.stageState.ep-1)+')" '+(Jungle.stageState.ep===0?'disabled':'')+'>‹ 上一集</button>'+
        '<button class="btn" onclick="Jungle.episodeStep('+(Jungle.stageState.ep+1)+')" '+(Jungle.stageState.ep===DATA.jungle.episodes.length-1?'disabled':'')+'>下一集 ›</button>'+
        '<button class="btn" onclick="Jungle.printEpisode('+Jungle.stageState.ep+')">🖨️ 印本集文字</button>'+
        '<span class="story-hint">← → 翻頁 · Q 問題 · Esc 收幕｜'+esc(d.subtitle||'')+'</span>'+
      '</footer>'+
      '<p class="story-credit">場景圖：AI 生成教學插畫，非童軍總會官方原圖，只作講故事用。故事文字依總會《森林故事》內容改寫，省略暴力細節。</p>'+
      '</div>';
  },
  stage:function(){
    var el=document.getElementById('story-stage');
    if(!el){el=document.createElement('div');el.id='story-stage';document.body.appendChild(el);}
    el.className='story-stage-wrap';
    el.innerHTML=Jungle.stageHTML();
    document.body.classList.add('story-open');
    return el;
  },
  show:function(i){
    if(!DATA.jungle.episodes[i])return;
    if(typeof Modal!=='undefined'&&Modal.close)Modal.close();
    Jungle.episode=i;Jungle.page=0;
    Jungle.stageState={ep:i,slide:0,ask:false};
    Jungle.stage();
    Jungle.bindKeys(true);
  },
  stageClose:function(){
    var el=document.getElementById('story-stage');if(el)el.innerHTML='';
    document.body.classList.remove('story-open');
    Jungle.bindKeys(false);
    if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen();
  },
  stageMove:function(d){var all=Jungle.slides(Jungle.stageState.ep);var n=Jungle.stageState.slide+d;
    if(!isFinite(n))return;n=Math.max(0,Math.min(all.length-1,n));
    if(n===Jungle.stageState.slide)return;
    Jungle.stageState.slide=n;Jungle.page=Math.max(0,n-1);Jungle.stageState.ask=false;Jungle.stage();},
  episodeStep:function(i){if(!DATA.jungle.episodes[i]||i<0)return;Jungle.stageState={ep:i,slide:0,ask:false};Jungle.episode=i;Jungle.page=0;Jungle.stage();},
  stageAsk:function(){if(Jungle.stageState.slide===0)return;Jungle.stageState.ask=!Jungle.stageState.ask;Jungle.stage();},
  fontStep:function(d){var el=document.getElementById('story-stage');if(!el)return;
    var cur=parseFloat(el.getAttribute('data-scale')||'1')||1;
    var next=Math.max(0.8,Math.min(1.8,Math.round((cur+d*0.1)*10)/10));
    el.setAttribute('data-scale',String(next));el.style.setProperty('--story-scale',String(next));},
  full:function(){var el=document.getElementById('story-stage');if(!el)return;
    if(document.fullscreenElement){if(document.exitFullscreen)document.exitFullscreen();return;}
    if(el.requestFullscreen)el.requestFullscreen();
    else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();},
  keys:function(e){
    if(!document.body.classList.contains('story-open'))return;
    var k=e.key;
    if(k==='ArrowRight'||k===' '||k==='PageDown'){Jungle.stageMove(1);e.preventDefault();}
    else if(k==='ArrowLeft'||k==='PageUp'){Jungle.stageMove(-1);e.preventDefault();}
    else if(k==='q'||k==='Q'||k==='?'){Jungle.stageAsk();e.preventDefault();}
    else if(k==='Escape'){Jungle.stageClose();}
  },
  bindKeys:function(on){
    if(on){if(Jungle._bound)return;Jungle._bound=true;document.addEventListener('keydown',Jungle.keys);}
    else{if(!Jungle._bound)return;Jungle._bound=false;document.removeEventListener('keydown',Jungle.keys);}
  },
  /* 印本集文字：每段一頁，圖＋文字，問題另附領袖答案頁 */
  sheets:function(i){
    var ep=DATA.jungle.episodes[i];if(!ep)return '';
    return '<section class="psheet story-sheet"><h2>🌳 '+esc(ep.title)+'｜故事文字</h2><p class="mut">'+esc((DATA.jungle.decks[ep.id]||{}).subtitle||'')+'</p>'+ep.scenes.map(function(s,k){
      return '<div class="story-page"><h3>'+(k+1)+' · '+esc(s.title)+'</h3>'+(Jungle.artReady(s.img)?'<img class="story-photo" src="'+Jungle.slideSrc(s.img)+'" alt="'+esc(s.title)+'">':'')+'<p>'+esc(s.text)+'</p></div>';}).join('')+'</section>'+
      '<section class="psheet leader-sheet"><h2>領袖問答及帶領提示</h2>'+ep.scenes.map(function(s,k){
        return '<p><b>'+(k+1)+' '+esc(s.title)+'</b><br>問：'+esc(s.question)+'<br>答：'+esc(s.answer)+'<br>現實生活：'+esc(s.lesson)+'</p>';}).join('')+
      '<p>文字依總會《森林故事》內容改寫；場景圖為 AI 生成教學插畫，非官方原圖。'+(typeof Jungle.sourceNote==='function'?'':'')+'</p></section>';
  },
  printEpisode:function(i){var ep=DATA.jungle.episodes[i];if(!ep)return;Practical.printModal('森林故事：'+ep.title,Jungle.sheets(i));},
  view:function(){return '<section class="card"><a class="back" href="#book">‹ 手冊</a><h1>🌳 森林故事</h1><p>先認角色，再講故事，最後連回小隊生活。開「投屏講故事」就可以一路投影、一路講。</p><div class="template-grid">'+DATA.jungle.episodes.map(function(ep,i){return '<article class="template-card"><span class="eyebrow">'+esc(ep.refs.join('／'))+'</span><h3>'+esc(ep.title)+'</h3><p>'+esc((DATA.jungle.decks[ep.id]||{}).subtitle||'')+'</p><p class="mut" style="font-size:12px">'+ep.scenes.length+'段 · 每段一大張圖 · 領袖答案另收</p><div class="quick"><button class="btn gr" onclick="Jungle.show('+i+')">📺 投屏講故事</button><button class="btn" onclick="Jungle.open('+i+')">逐段閱讀</button><button class="btn" onclick="Jungle.printEpisode('+i+')">🖨️ 印文字</button></div></article>';}).join('')+'</div></section><section class="card"><h2>11位角色：認人與配對</h2><p class="mut">撳角色先睇介紹，再展開答案。哈蒂與戴白祺可作延伸，不硬放入每段故事。</p><p class="mut" style="font-size:11px">頭像為 AI 繪製教學示意，非童軍總會官方原圖；角色文字介紹以官方版本為準。</p><div class="template-grid">'+DATA.jungle.characters.map(function(c){return '<button class="btn character-card" onclick="Jungle.card(\''+c.id+'\')">'+(c.img?'<img src="'+c.img+'" alt="" loading="lazy" onerror="this.remove()">':'')+'<b>'+esc(c.name)+'</b><span>'+esc(c.english)+' · '+esc(c.kind)+'</span></button>';}).join('')+'</div></section><details class="card"><summary>故事來源</summary><p>'+esc(DATA.jungle.sourceNote)+'</p><p>投屏圖及角色圖為 AI 生成教學插畫，非總會官方原圖；故事文字依總會《森林故事》內容（《香港童軍》月刊第158–170期版本）改寫，省略暴力細節。</p>'+extBtn(DATA.jungle.source,false,'幼童軍支部：森林故事','角色及情節核對來源')+'<p class="mut">文字內容不依賴外部圖片載入，可離線使用。</p></details>';}
};
(function(){
  var route=App.route;
  App.registerBookPanel('jungle-lead','🌳','森林故事',function(){return '<section class="card"><h2>🌳 森林故事帶領</h2><p>角色介紹、分段故事及問題，撳「投屏講故事」就可以投影一路講。</p><a class="btn gr" href="#jungle">開森林故事 →</a></section>';});
  App.route=function(){if((location.hash||'').split('?')[0]!=='#jungle'){route();return;}App.tab='jungle';document.getElementById('view').innerHTML=Jungle.view();document.getElementById('view').style.paddingBottom='';var bar=document.getElementById('flowbar');bar.className='';bar.innerHTML='';document.querySelectorAll('#topnav a, #tabbar a').forEach(function(a){a.classList.toggle('cur',a.getAttribute('href')==='#jungle');});handleOffline();window.scrollTo(0,0);};
})();
(function(){
  var lead=App.vLead,detail=App.vMeetDetail;
  function shortcut(m){var i=m.tid==='c26'?0:m.tid==='c27'?1:-1;return i<0?'':'<section class="card"><h3>🌳 今場故事</h3><div class="quick"><button class="btn gr" onclick="Jungle.show('+i+')">📺 投屏講故事</button><button class="btn" onclick="Jungle.open('+i+')">逐段講故事＋提問</button><a class="btn" href="#jungle">角色卡</a></div></section>';}
  App.vLead=function(){return shortcut(curMeet())+lead();};
  App.vMeetDetail=function(m){return shortcut(m)+detail(m);};
})();
