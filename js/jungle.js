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
  /* 舞台分兩層：#story-main 每次換圖重繪；#story-audio 唔會重繪，所以播住旁白換圖唔會斷。 */
  stage:function(){
    var el=document.getElementById('story-stage');
    if(!el){el=document.createElement('div');el.id='story-stage';document.body.appendChild(el);}
    el.className='story-stage-wrap';
    if(!Jungle._skeleton||!(el.querySelector&&el.querySelector('#story-main'))){
      el.innerHTML='<div id="story-main"></div><div id="story-audio" class="story-audio"></div>';
      Jungle._skeleton=true;
    }
    document.body.classList.add('story-open');
    Jungle.renderMain();
    Jungle.buildAudio();
    return el;
  },
  renderMain:function(){
    var html=Jungle.stageHTML();
    var el=document.getElementById('story-stage');
    var main=(el&&el.querySelector)?el.querySelector('#story-main'):null;
    if(main)main.innerHTML=html; else if(el)el.innerHTML=html;
    return html;
  },
  /* ---------- 旁白錄音（兩種模式）＋環境音墊底 ----------
     逐段模式：每次只播當前嗰段，播完自動跳下一張圖（可熄）。
     整集模式：由頭連續播成集旁白，唔會自動跳圖。
     環境音：原創合成 loop，細音量墊底；自己講故事都可以開住。 */
  audio:{ep:-1,lang:'',part:0,playing:false,mode:'scene',auto:true,amb:true,ambVol:0.12,note:''},
  prefs:function(){
    if(!Jungle._prefs){
      var p=null;try{p=Store.get('storyPrefs',null);}catch(e){p=null;}
      p=p||{};
      Jungle.audio.mode=p.mode==='episode'?'episode':'scene';
      Jungle.audio.auto=p.auto!==false;
      Jungle.audio.amb=p.amb!==false;
      Jungle.audio.ambVol=typeof p.ambVol==='number'&&p.ambVol>0&&p.ambVol<=0.4?p.ambVol:0.12;
      Jungle._prefs=true;
    }
    return Jungle.audio;
  },
  savePrefs:function(){try{Store.set('storyPrefs',{mode:Jungle.audio.mode,auto:Jungle.audio.auto,amb:Jungle.audio.amb,ambVol:Jungle.audio.ambVol});}catch(e){}},
  langsOf:function(id){var f=(DATA.jungle.narration.files[id]||{}),sc=(DATA.jungle.sceneAudio||{})[id]||{};
    return DATA.jungle.narration.langs.filter(function(l){return (f[l[0]]&&f[l[0]].length)||((sc[l[0]]||[]).filter(Boolean).length);});},
  /* 播放清單：逐段錄齊嘅語言，整集模式＝順住逐段接播（唔會重複錄一套成集聲，慳位） */
  playlist:function(id,lang){
    var ep=DATA.jungle.episodes.find(function(e){return e.id===id;});if(!ep)return {files:[],chained:false};
    var sc=((DATA.jungle.sceneAudio||{})[id]||{})[lang]||[];
    var full=sc.length>=ep.scenes.length&&sc.slice(0,ep.scenes.length).every(Boolean);
    if(full)return {files:sc.slice(0,ep.scenes.length),chained:true};
    return {files:((DATA.jungle.narration.files[id]||{})[lang]||[]),chained:false};
  },
  /* 離線語音包：所有旁白＋逐段＋環境音檔案（唔預先塞入安裝包，領袖自己決定幾時下載） */
  audioPackList:function(){
    var out=[],seen={};
    function put(u){if(!u||seen[u])return;seen[u]=1;out.push(u);}
    var n=DATA.jungle.narration.files,sa=DATA.jungle.sceneAudio||{};
    Object.keys(n).forEach(function(id){Object.keys(n[id]).forEach(function(l){(n[id][l]||[]).forEach(put);});});
    Object.keys(sa).forEach(function(id){Object.keys(sa[id]).forEach(function(l){(sa[id][l]||[]).forEach(put);});});
    Object.keys(DATA.jungle.ambience||{}).forEach(function(k){put(DATA.jungle.ambience[k]);});
    return out;
  },
  audioEl:function(){return document.getElementById('story-track');},
  ambEl:function(){return document.getElementById('story-amb');},
  langNote:function(lang){var n=(DATA.jungle.narration.langNotes||{})[lang];return n||'';},
  /* 逐段旁白：slide 0 係封面，冇逐段聲；scene 由 slide 1 開始 */
  sceneFile:function(epId,lang,slide){
    var byLang=(DATA.jungle.sceneAudio||{})[epId];
    if(!byLang)return '';
    var arr=byLang[lang]||[];
    return (slide>=1&&arr[slide-1])?arr[slide-1]:'';
  },
  currentSceneFile:function(){return Jungle.sceneFile(DATA.jungle.episodes[Jungle.stageState.ep].id,Jungle.audio.lang,Jungle.stageState.slide);},
  sceneDone:function(epId,lang){
    var byLang=(DATA.jungle.sceneAudio||{})[epId]||{};
    var arr=byLang[lang]||[];
    var want=DATA.jungle.episodes.find(function(e){return e.id===epId;}).scenes.length;
    return arr.length>=want&&arr.slice(0,want).every(function(x){return !!x;});
  },
  slideAmb:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], d=DATA.jungle.decks[ep.id]||{};
    if(Jungle.stageState.slide===0)return d.amb||'day';
    var sc=ep.scenes[Jungle.stageState.slide-1];
    return (sc&&sc.amb)||d.amb||'day';
  },
  ambSrc:function(){var key=Jungle.slideAmb();return (DATA.jungle.ambience||{})[key]||'';},
  audioBarHTML:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], langs=Jungle.langsOf(ep.id);
    if(!langs.length)return '<span class="story-hint">🎧 本集未附旁白錄音；可以直接照文字講。</span>';
    var a=Jungle.audio;
    var sceneReady=langs.some(function(l){return !!Jungle.sceneFile(ep.id,l[0],1);});
    return '<span class="story-hint">🎧 旁白</span>'+
      langs.map(function(l){return '<button class="btn sm story-lang" data-lang="'+l[0]+'" onclick="Jungle.playNarration(\''+l[0]+'\')">'+esc(l[1])+'</button>';}).join('')+
      '<button class="btn sm gr" id="story-audio-btn" onclick="Jungle.toggleNarration()">▶ 播</button>'+
      '<button class="btn sm" id="story-mode-btn" onclick="Jungle.toggleMode()" title="逐段＝一段一張圖；整集＝連續播">'+(a.mode==='scene'?'📄 逐段':'🎞️ 整集')+(Jungle.sceneDone(ep.id,a.lang)?'':(a.mode==='scene'?'（部分）':''))+'</button>'+
      (a.mode==='scene'?'<button class="btn sm" id="story-auto-btn" onclick="Jungle.toggleAuto()" aria-pressed="'+(a.auto?'true':'false')+'">'+(a.auto?'🔁 自動跟圖':'⏸ 唔自動')+'</button>':'')+
      '<input type="range" id="story-audio-seek" min="0" max="100" value="0" oninput="Jungle.seekNarration(this.value)" aria-label="旁白進度">'+
      '<span class="story-hint" id="story-audio-state">準備好</span>'+
      '<span class="story-hint story-hintmsg" id="story-audio-note">'+esc(Jungle.audio.note||'')+'</span>'+
      '<button class="btn sm" id="story-amb-btn" onclick="Jungle.toggleAmb()" aria-pressed="'+(a.amb?'true':'false')+'">🌿 環境音'+(a.amb?'開':'關')+'</button>'+
      '<input type="range" id="story-amb-vol" min="0" max="100" value="'+Math.round((a.ambVol-0.02)/0.35*100)+'" oninput="Jungle.setAmbVol(this.value)" aria-label="環境音音量">'+
      '<span class="story-hint">'+(a.mode==='scene'?'逐段：播完自動跳圖｜':'')+'播住都可以照撳圖｜想自己講就唔播</span>'+
      (Jungle.langNote(a.lang)?'<span class="story-hint story-langnote">'+esc(Jungle.langNote(a.lang))+'</span>':'');
  },
  buildAudio:function(){
    Jungle.prefs();
    var bar=document.getElementById('story-audio');
    if(!bar)return;
    if(Jungle.audio.ep!==Jungle.stageState.ep){Jungle.audio.ep=Jungle.stageState.ep;Jungle.audio.part=0;Jungle.audio.playing=false;Jungle.audio.lang='';}
    var langs=Jungle.langsOf(DATA.jungle.episodes[Jungle.stageState.ep].id);
    if(!Jungle.audio.lang||!langs.some(function(l){return l[0]===Jungle.audio.lang;}))Jungle.audio.lang=langs.length?langs[0][0]:'';
    bar.innerHTML='<audio id="story-track" preload="metadata"></audio><audio id="story-amb" loop preload="none"></audio>'+Jungle.audioBarHTML();
    var el=Jungle.audioEl();
    if(el&&typeof el.addEventListener==='function'){
      el.addEventListener('ended',function(){Jungle.narrationEnded();});
      el.addEventListener('timeupdate',function(){Jungle.markAudio();});
      el.addEventListener('error',function(){Jungle.audioError();});
    }
    var amb=Jungle.ambEl();
    if(amb&&typeof amb.addEventListener==='function')amb.addEventListener('error',function(){if(amb.parentNode)amb.parentNode.removeChild(amb);});
    Jungle.syncAmb();
    Jungle.markAudio();
  },
  audioNote:function(msg){Jungle.audio.note=msg||'';var s=document.getElementById('story-audio-note')||document.getElementById('story-audio-state');if(s)s.textContent=Jungle.audio.note;},
  audioError:function(){Jungle.audio.playing=false;Jungle.audioNote('音檔未載入，可能未快取；可以直接照文字講。');Jungle.markAudio();},
  markAudio:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], pl=Jungle.playlist(ep.id,Jungle.audio.lang), list=pl.files;
    var bar=document.getElementById('story-audio');
    if(bar&&bar.querySelectorAll){
      var chips=bar.querySelectorAll('.story-lang');
      for(var i=0;i<chips.length;i++){chips[i].classList&&chips[i].classList.toggle&&chips[i].classList.toggle('cur',chips[i].getAttribute&&chips[i].getAttribute('data-lang')===Jungle.audio.lang);}
    }
    var btn=document.getElementById('story-audio-btn');
    if(btn)btn.textContent=Jungle.audio.playing?'⏸ 停':'▶ 播';
    var st=document.getElementById('story-audio-state');
    if(st&&list.length){
      var el=Jungle.audioEl(), label=Jungle.audio.playing?'播放中':'已暫停';
      var scope=Jungle.audio.mode==='scene'?'逐段':(pl.chained?'整集（接段）':'整集');
      var pos=Jungle.audio.mode==='scene'?((Jungle.stageState.slide>0?(Jungle.stageState.slide)+'/'+ep.scenes.length:'封面')):
        ((Jungle.audio.part+1)+'/'+list.length);
      st.textContent=label+'｜'+scope+' '+pos+(el&&el.duration&&isFinite(el.duration)?'｜'+Jungle.mmss(el.currentTime)+' / '+Jungle.mmss(el.duration):'');
    }
    var seek=document.getElementById('story-audio-seek');
    var el2=Jungle.audioEl();
    if(seek&&el2&&el2.duration&&isFinite(el2.duration))seek.value=String(Math.round((el2.currentTime/el2.duration)*100));
    var modeBtn=document.getElementById('story-mode-btn');
    if(modeBtn)modeBtn.textContent=(Jungle.audio.mode==='scene'?'📄 逐段':'🎞️ 整集')+(Jungle.sceneDone(ep.id,Jungle.audio.lang)?'':'（部分）');
    var ambBtn=document.getElementById('story-amb-btn');
    if(ambBtn)ambBtn.textContent='🌿 環境音'+(Jungle.audio.amb?'開':'關');
  },
  mmss:function(t){t=Math.max(0,Math.round(t||0));return Math.floor(t/60)+':'+('0'+(t%60)).slice(-2);},
  /* 揀語言 */
  playNarration:function(lang){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep];
    var list=Jungle.playlist(ep.id,lang).files;if(!list||!list.length)return;
    Jungle.audio.lang=lang;Jungle.audio.part=0;Jungle.audio.ep=Jungle.stageState.ep;
    Jungle.buildAudio();
    Jungle.playCurrent(true);
  },
  /* 由當前位置開始播：逐段模式播當前段；整集模式由頭／由指定段播 */
  playCurrent:function(fromStart){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep];
    var el=Jungle.audioEl();
    if(!el||typeof el.play!=='function'){Jungle.audioNote('呢部機／呢個環境播唔到；可以直接照文字講。');Jungle.markAudio();return;}
    if(Jungle.audio.mode==='scene'){
      if(Jungle.stageState.slide===0)Jungle.stageMove(1);
      var file=Jungle.currentSceneFile();
      if(!file){Jungle.audioNote('呢段未有逐段旁白；可以撳「🎞️ 整集」聽成集，或自己講。');Jungle.markAudio();return;}
      el.src=file;
    }else{
      var list=Jungle.playlist(ep.id,Jungle.audio.lang).files;
      if(fromStart)Jungle.audio.part=0;
      if(!list.length)return;
      el.src=list[Math.min(Jungle.audio.part,list.length-1)];
    }
    Jungle.audioNote('');
    var p=el.play();if(p&&p.catch)p.catch(function(){Jungle.audioNote('音檔未載入，可能未快取；可以直接照文字講。');});
    Jungle.audio.playing=true;Jungle.startAmb();Jungle.markAudio();
  },
  toggleNarration:function(){
    var el=Jungle.audioEl();
    if(Jungle.audio.playing){Jungle.pauseNarration();return;}
    var hasSrc=el&&el.src&&Jungle.audio.mode==='scene'&&String(el.src).indexOf('scene/')>=0;
    if(hasSrc){if(typeof el.play==='function')el.play();Jungle.audio.playing=true;Jungle.startAmb();Jungle.markAudio();return;}
    if(el&&el.src&&Jungle.audio.mode==='episode'){if(typeof el.play==='function')el.play();Jungle.audio.playing=true;Jungle.startAmb();Jungle.markAudio();return;}
    Jungle.playCurrent(false);
  },
  narrationEnded:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep];
    if(Jungle.audio.mode==='scene'){
      if(!Jungle.audio.auto){Jungle.audio.playing=false;Jungle.markAudio();return;}
      var total=Jungle.slides(Jungle.stageState.ep).length;
      if(Jungle.stageState.slide>=total-1){Jungle.audio.playing=false;Jungle.markAudio();Jungle.audioNote('成集講完；可以再撳「▶ 播」聽多次。');return;}
      Jungle.stageMove(1);
      var file=Jungle.currentSceneFile();
      if(!file){Jungle.audio.playing=false;Jungle.markAudio();Jungle.audioNote('下一段未有逐段旁白；可以自己講，或者撳「🎞️ 整集」。');return;}
      var el=Jungle.audioEl();
      if(el&&typeof el.play==='function'){el.src=file;el.play();}
      Jungle.markAudio();return;
    }
    var list=Jungle.playlist(ep.id,Jungle.audio.lang).files;
    if(Jungle.audio.part+1<list.length){Jungle.audio.part++;var el2=Jungle.audioEl();if(el2&&typeof el2.play==='function'){el2.src=list[Jungle.audio.part];el2.play();}Jungle.markAudio();return;}
    Jungle.audio.playing=false;Jungle.audio.part=0;Jungle.markAudio();Jungle.audioNote('播完；可以再撳「▶ 播」聽多次。');
  },
  toggleMode:function(){
    Jungle.audio.note='';
    Jungle.audio.mode=Jungle.audio.mode==='scene'?'episode':'scene';
    Jungle.audio.part=0;Jungle.savePrefs();
    var el=Jungle.audioEl();if(el&&typeof el.pause==='function')el.pause();
    Jungle.audio.playing=false;
    Jungle.buildAudio();
    Jungle.audioNote(Jungle.audio.mode==='scene'?'已轉逐段：播完一段自動跳下一張圖。':'已轉整集：連續播完成集旁白，唔會自動跳圖。');
  },
  toggleAuto:function(){Jungle.audio.auto=!Jungle.audio.auto;Jungle.savePrefs();Jungle.buildAudio();Jungle.audioNote(Jungle.audio.auto?'自動跟圖：開':'自動跟圖：關（播完停低等你）');},
  pauseNarration:function(){var el=Jungle.audioEl();if(el&&typeof el.pause==='function')el.pause();Jungle.audio.playing=false;Jungle.stopAmb();Jungle.markAudio();},
  seekNarration:function(v){var el=Jungle.audioEl();if(el&&el.duration&&isFinite(el.duration))el.currentTime=el.duration*(Number(v)/100);},
  /* 環境音 */
  syncAmb:function(){
    var el=Jungle.ambEl();if(!el)return;
    var src=Jungle.ambSrc();
    if(src&&el.src!==src&&el.getAttribute&&el.getAttribute('src')!==src){el.src=src;}
    el.loop=true;el.volume=Jungle.audio.ambVol;
  },
  startAmb:function(){
    Jungle.prefs();if(!Jungle.audio.amb)return;
    var el=Jungle.ambEl();if(!el||typeof el.play!=='function')return;
    if(!el.getAttribute('src')&&!el.src)Jungle.syncAmb();
    el.loop=true;el.volume=Jungle.audio.ambVol;
    var p=el.play();if(p&&p.catch)p.catch(function(){});
  },
  stopAmb:function(){var el=Jungle.ambEl();if(el&&typeof el.pause==='function')el.pause();},
  toggleAmb:function(){
    Jungle.prefs();Jungle.audio.amb=!Jungle.audio.amb;Jungle.savePrefs();
    if(Jungle.audio.amb){Jungle.syncAmb();Jungle.startAmb();Jungle.audioNote('環境音：開（細聲墊底）');}
    else{Jungle.stopAmb();Jungle.audioNote('環境音：關');}
    Jungle.markAudio();
  },
  setAmbVol:function(v){Jungle.prefs();Jungle.audio.ambVol=0.02+Math.max(0,Math.min(100,Number(v)||0))/100*0.35;Jungle.savePrefs();var el=Jungle.ambEl();if(el)el.volume=Jungle.audio.ambVol;},
  /* 印本集文字：每段一頁，圖＋文字，問題另附領袖答案頁 */
  /* ---------- 舞台控制 ---------- */
  show:function(i){
    if(!DATA.jungle.episodes[i])return;
    if(typeof Modal!=='undefined'&&Modal.close)Modal.close();
    Jungle.episode=i;Jungle.page=0;
    Jungle.stageState={ep:i,slide:0,ask:false};
    Jungle.stage();
    Jungle.bindKeys(true);
  },
  stageClose:function(){
    Jungle.pauseNarration();Jungle.stopAmb();
    var el=document.getElementById('story-stage');if(el)el.innerHTML='';
    Jungle._skeleton=false;
    document.body.classList.remove('story-open');
    Jungle.bindKeys(false);
    if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen();
  },
  stageMove:function(d){var all=Jungle.slides(Jungle.stageState.ep);var n=Jungle.stageState.slide+d;
    if(!isFinite(n))return;n=Math.max(0,Math.min(all.length-1,n));
    if(n===Jungle.stageState.slide)return;
    Jungle.stageState.slide=n;Jungle.page=Math.max(0,n-1);Jungle.stageState.ask=false;Jungle.renderMain();Jungle.syncAmb();
    var amb=Jungle.ambEl();if(amb&&Jungle.audio.amb&&typeof amb.play==='function'&&amb.paused!==false){Jungle.startAmb();}
    Jungle.markAudio();},
  episodeStep:function(i){if(!DATA.jungle.episodes[i]||i<0)return;Jungle.pauseNarration();Jungle.stageState={ep:i,slide:0,ask:false};Jungle.episode=i;Jungle.page=0;Jungle.stage();},
  stageAsk:function(){if(Jungle.stageState.slide===0)return;Jungle.stageState.ask=!Jungle.stageState.ask;Jungle.renderMain();},
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
    else if(k==='p'||k==='P'){Jungle.toggleNarration();e.preventDefault();}
    else if(k==='m'||k==='M'){Jungle.toggleAmb();e.preventDefault();}
    else if(k==='Escape'){Jungle.stageClose();}
  },
  bindKeys:function(on){
    if(on){if(Jungle._bound)return;Jungle._bound=true;document.addEventListener('keydown',Jungle.keys);}
    else{if(!Jungle._bound)return;Jungle._bound=false;document.removeEventListener('keydown',Jungle.keys);}
  },
  /* ---------- 試聽面板：唔開投屏都聽到旁白同環境音 ---------- */
  audioLab:function(){
    var rows=[['night','🌙 夜聲','遠風、蟋蟀、貓頭鷹（森林晚上、狼群集會）'],
              ['day','🌤️ 日間','樹聲、雀鳥（日間課堂、草原）'],
              ['leaves','🍂 落葉腳步','腳踏落葉、樹葉沙沙（走動、離開）'],
              ['fire','🔥 營火','低頻火聲、噼啪（紅花、特別集會）']];
    var epRows=DATA.jungle.episodes.map(function(ep,i){
      var langs=Jungle.langsOf(ep.id);
      var parts=ep.scenes.length;
      return '<div class="amb-row"><b>'+esc(ep.title)+'</b>'+(langs.length?langs.map(function(l){
        var per=Jungle.sceneDone(ep.id,l[0]);
        return '<button class="btn sm" onclick="Jungle.labNarr('+i+',\''+l[0]+'\')">🎧 '+esc(l[1])+(per?' · 逐段':(Jungle.sceneFile(ep.id,l[0],1)?' · 逐段（部分）':' · 整集'))+'</button>';}).join(''):'<span class="mut">未附旁白</span>')+
        '<span class="mut">'+parts+'段</span></div>';}).join('');
    Modal.open('<h2>🎚️ 試聽：旁白＋環境音</h2>'+
      '<p class="mut">撳落去就播，唔需要開投屏。旁白係柔和女聲、講故事語氣；環境音只作細聲墊底。</p>'+
      '<h3>旁白</h3>'+epRows+
      '<h3>環境音</h3>'+rows.map(function(r){
        return '<div class="amb-row"><button class="btn sm" onclick="Jungle.ambPlayLab(\''+r[0]+'\')">▶ '+r[1]+'</button><button class="btn sm" onclick="Jungle.ambPlayLab(\''+r[0]+'\',true)">🔁 連播</button><span class="mut">'+r[2]+'</span></div>';}).join('')+
      '<p class="eyebrow">環境音音量</p><input type="range" id="amb-lab-vol" min="0" max="100" value="'+Math.round((Jungle.audio.ambVol-0.02)/0.35*100)+'" oninput="Jungle.ambLabVol(this.value)">'+
      '<audio id="story-lab" preload="none"></audio><audio id="story-lab-amb" preload="none"></audio>'+
      '<h3>離線用</h3><div class="amb-row"><button class="btn gr" onclick="Jungle.downloadAudioPack()">⬇️ 下載離線語音包</button><span class="mut" id="pack-state">'+Jungle.packSummary()+'：唔會佔用 app 安裝包，一撳就存入裝置，之後冇網都播到（連環境音）。</span></div>'+
      '<p class="mut">覺得環境音太細／太大／想再密啲，直接講就可以；我改合成參數再生成，唔會換素材。</p>'+
      '<div class="quick"><button class="btn gr" onclick="Modal.close()">收起</button></div>');
  },
  labEl:function(id){return document.getElementById(id);},
  labNarr:function(i,lang){
    var ep=DATA.jungle.episodes[i];if(!ep)return;
    var el=Jungle.labEl('story-lab');if(!el)return;
    var file=Jungle.sceneFile(ep.id,lang,1)||(Jungle.playlist(ep.id,lang).files[0]||'');
    if(!file)return;
    el.src=file;
    if(el.pause&&typeof el.pause==='function')el.pause();
    el.currentTime=0;
    if(typeof el.play==='function'){var p=el.play();if(p&&p.catch)p.catch(function(){});}
  },
  ambPlayLab:function(key,loop){
    var el=Jungle.labEl('story-lab-amb');if(!el)return;
    var src=(DATA.jungle.ambience||{})[key];if(!src)return;
    Jungle.prefs();
    el.src=src;el.loop=true;el.volume=Jungle.audio.ambVol;Jungle._labKey=key;
    if(typeof el.play==='function'){var p=el.play();if(p&&p.catch)p.catch(function(){});}
  },
  ambLabVol:function(v){Jungle.setAmbVol(v);var el=Jungle.labEl('story-lab-amb');if(el)el.volume=Jungle.audio.ambVol;},
  /* 領袖想離線用：撳一下就把所有旁白／逐段／環境音存入裝置快取（app 安裝包本身唔會變大） */
  downloadAudioPack:function(){
    var list=Jungle.audioPackList();
    var st=document.getElementById('pack-state');
    var say=function(t){if(st)st.textContent=t;};
    if(!list.length){say('冇語音檔');return;}
    if(typeof fetch!=='function'||typeof caches==='undefined'){say('呢個環境唔支援離線下載；可以直接上網播。');return;}
    say('下載中… 0/'+list.length);
    var done=0,bytes=0;
    var step=function(i){
      if(i>=list.length){
        say('已下載 '+list.length+' 個檔案（約 '+(bytes/1048576).toFixed(1)+'MB），離線都播到。');
        return;
      }
      fetch(list[i]).then(function(r){return r.blob?r.blob():null;}).then(function(b){
        if(b)bytes+=b.size||0;
      }).catch(function(){}).then(function(){
        done++;say('下載中… '+done+'/'+list.length);
        step(i+1);
      });
    };
    step(0);
  },
  packSummary:function(){return Jungle.audioPackList().length+' 個語音檔';},
  sheets:function(i){
    var ep=DATA.jungle.episodes[i];if(!ep)return '';
    return '<section class="psheet story-sheet"><h2>🌳 '+esc(ep.title)+'｜故事文字</h2><p class="mut">'+esc((DATA.jungle.decks[ep.id]||{}).subtitle||'')+'</p>'+ep.scenes.map(function(s,k){
      return '<div class="story-page"><h3>'+(k+1)+' · '+esc(s.title)+'</h3>'+(Jungle.artReady(s.img)?'<img class="story-photo" src="'+Jungle.slideSrc(s.img)+'" alt="'+esc(s.title)+'">':'')+'<p>'+esc(s.text)+'</p></div>';}).join('')+'</section>'+
      '<section class="psheet leader-sheet"><h2>領袖問答及帶領提示</h2>'+ep.scenes.map(function(s,k){
        return '<p><b>'+(k+1)+' '+esc(s.title)+'</b><br>問：'+esc(s.question)+'<br>答：'+esc(s.answer)+'<br>現實生活：'+esc(s.lesson)+'</p>';}).join('')+
      '<p>文字依總會《森林故事》內容改寫；場景圖為 AI 生成教學插畫，非官方原圖。'+(typeof Jungle.sourceNote==='function'?'':'')+'</p></section>';
  },
  printEpisode:function(i){var ep=DATA.jungle.episodes[i];if(!ep)return;Practical.printModal('森林故事：'+ep.title,Jungle.sheets(i));},
  view:function(){return '<section class="card"><a class="back" href="#book">‹ 手冊</a><h1>🌳 森林故事</h1><p>先認角色，再講故事，最後連回小隊生活。開「投屏講故事」就可以一路投影、一路講。</p><div class="quick" style="margin:8px 0"><button class="btn" onclick="Jungle.audioLab()">🎚️ 試聽旁白／環境音</button></div><div class="template-grid">'+DATA.jungle.episodes.map(function(ep,i){return '<article class="template-card"><span class="eyebrow">'+esc(ep.refs.join('／'))+'</span><h3>'+esc(ep.title)+'</h3><p>'+esc((DATA.jungle.decks[ep.id]||{}).subtitle||'')+'</p><p class="mut" style="font-size:12px">'+ep.scenes.length+'段 · 每段一大張圖 · 領袖答案另收'+(Jungle.langsOf(ep.id).length?' · 🎧 旁白：'+Jungle.langsOf(ep.id).map(function(l){return l[1];}).join('／'):'')+'</p><div class="quick"><button class="btn gr" onclick="Jungle.show('+i+')">📺 投屏講故事</button><button class="btn" onclick="Jungle.open('+i+')">逐段閱讀</button><button class="btn" onclick="Jungle.printEpisode('+i+')">🖨️ 印文字</button></div></article>';}).join('')+'</div></section><section class="card"><h2>11位角色：認人與配對</h2><p class="mut">撳角色先睇介紹，再展開答案。哈蒂與戴白祺可作延伸，不硬放入每段故事。</p><p class="mut" style="font-size:11px">頭像為 AI 繪製教學示意，非童軍總會官方原圖；角色文字介紹以官方版本為準。</p><div class="template-grid">'+DATA.jungle.characters.map(function(c){return '<button class="btn character-card" onclick="Jungle.card(\''+c.id+'\')">'+(c.img?'<img src="'+c.img+'" alt="" loading="lazy" onerror="this.remove()">':'')+'<b>'+esc(c.name)+'</b><span>'+esc(c.english)+' · '+esc(c.kind)+'</span></button>';}).join('')+'</div></section><details class="card"><summary>故事來源</summary><p>'+esc(DATA.jungle.sourceNote)+'</p><p>投屏圖及角色圖為 AI 生成教學插畫，非總會官方原圖；故事文字依總會《森林故事》內容（《香港童軍》月刊第158–170期版本）改寫，省略暴力細節。</p>'+extBtn(DATA.jungle.source,false,'幼童軍支部：森林故事','角色及情節核對來源')+'<p class="mut">文字內容不依賴外部圖片載入，可離線使用。</p></details>';}
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
