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
  /* ---------- 旁白錄音（逐段對應／整集連續）＋環境音墊底 ----------
     逐段模式（預設）：一張圖一段聲，播完自動跳下一張圖再播（可熄「自動跟圖」）。
     整集模式：一路連續播完成集（用逐段檔案接住播，唔會跳圖）。
     環境音：原創合成 loop（夜／日／落葉／營火），細音量墊底，跟段落轉，自己講都開得。 */
  audio:{ep:-1,lang:'',part:0,playing:false,mode:'scene',auto:true,amb:true,ambVol:0.12,note:''},
  ambVolMax:0.4,
  prefs:function(){
    if(!Jungle._prefs){
      var p=null;try{p=Store.get('storyPrefs',null);}catch(e){p=null;}
      p=p||{};
      Jungle.audio.mode=p.mode==='episode'?'episode':'scene';
      Jungle.audio.auto=p.auto!==false;
      Jungle.audio.amb=p.amb!==false;
      Jungle.audio.ambVol=typeof p.ambVol==='number'&&p.ambVol>0&&p.ambVol<=Jungle.ambVolMax?p.ambVol:0.12;
      Jungle._prefs=true;
    }
    return Jungle.audio;
  },
  savePrefs:function(){try{Store.set('storyPrefs',{mode:Jungle.audio.mode,auto:Jungle.audio.auto,amb:Jungle.audio.amb,ambVol:Jungle.audio.ambVol});}catch(e){}},
  langsOf:function(id){
    var f=(DATA.jungle.narration.files[id]||{}), sc=(DATA.jungle.sceneAudio||{})[id]||{};
    return DATA.jungle.narration.langs.filter(function(l){return (f[l[0]]&&f[l[0]].length)||((sc[l[0]]||[]).filter(Boolean).length);});
  },
  /* 逐段檔案：slide 0 係封面（冇聲），scene 由 slide 1 開始 */
  sceneFile:function(epId,lang,slide){
    var byLang=(DATA.jungle.sceneAudio||{})[epId];if(!byLang)return '';
    var arr=byLang[lang]||[];
    return (slide>=1&&arr[slide-1])?arr[slide-1]:'';
  },
  currentSceneFile:function(){return Jungle.sceneFile(DATA.jungle.episodes[Jungle.stageState.ep].id,Jungle.audio.lang,Jungle.stageState.slide);},
  sceneDone:function(epId,lang){
    var byLang=(DATA.jungle.sceneAudio||{})[epId]||{}, arr=byLang[lang]||[];
    var ep=DATA.jungle.episodes.find(function(e){return e.id===epId;});if(!ep)return false;
    return arr.length>=ep.scenes.length&&arr.slice(0,ep.scenes.length).every(Boolean);
  },
  sceneCount:function(epId,lang){var arr=((DATA.jungle.sceneAudio||{})[epId]||{})[lang]||[];return arr.filter(Boolean).length;},
  /* 播放清單：整集模式會用逐段檔案接住播；未錄齊先用成集檔案 */
  playlist:function(id,lang){
    var ep=DATA.jungle.episodes.find(function(e){return e.id===id;});if(!ep)return {files:[],chained:false};
    var sc=((DATA.jungle.sceneAudio||{})[id]||{})[lang]||[];
    var full=sc.length>=ep.scenes.length&&sc.slice(0,ep.scenes.length).every(Boolean);
    if(full)return {files:sc.slice(0,ep.scenes.length),chained:true};
    return {files:((DATA.jungle.narration.files[id]||{})[lang]||[]),chained:false};
  },
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
  slideAmb:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], d=DATA.jungle.decks[ep.id]||{};
    if(Jungle.stageState.slide===0)return d.amb||'day';
    var sc=ep.scenes[Jungle.stageState.slide-1];
    return (sc&&sc.amb)||d.amb||'day';
  },
  ambSrc:function(){var key=Jungle.slideAmb();return (DATA.jungle.ambience||{})[key]||'';},
  ambName:function(){return {night:'🌙 夜聲',day:'🌤️ 日間',leaves:'🍂 落葉',fire:'🔥 營火'}[Jungle.slideAmb()]||'🌿 環境音';},
  audioBarHTML:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], langs=Jungle.langsOf(ep.id);
    if(!langs.length)return '<span class="story-hint">🎧 本集未附旁白錄音；可以直接照文字講。</span>';
    var a=Jungle.audio, mine=new Set();
    var chips=langs.map(function(l){
      var done=Jungle.sceneDone(ep.id,l[0])?' · 逐段':(Jungle.sceneCount(ep.id,l[0])?' · 逐段部分':' · 整集');
      return '<button class="btn sm story-lang'+(a.lang===l[0]?' cur':'')+'" data-lang="'+l[0]+'" onclick="Jungle.playNarration(\''+l[0]+'\')">'+esc(l[1])+done+'</button>';
    }).join('');
    var sceneReady=Jungle.sceneCount(ep.id,a.lang)>0;
    return '<span class="story-hint">🎧 旁白</span>'+
      chips+
      '<button class="btn sm gr" id="story-audio-btn" onclick="Jungle.toggleNarration()">▶ 播</button>'+
      '<input type="range" id="story-audio-seek" min="0" max="100" value="0" oninput="Jungle.seekNarration(this.value)" aria-label="旁白進度">'+
      '<span class="story-hint" id="story-audio-state">準備好</span>'+
      '<button class="btn sm" id="story-mode-btn" onclick="Jungle.toggleMode()" title="逐段＝一張圖一段聲；整集＝連續播">'+(a.mode==='scene'?'📄 逐段':'🎞️ 整集')+'</button>'+
      (a.mode==='scene'?'<button class="btn sm" id="story-auto-btn" onclick="Jungle.toggleAuto()" aria-pressed="'+(a.auto?'true':'false')+'">'+(a.auto?'🔁 自動跟圖:開':'⏸ 自動跟圖:關')+'</button>':'')+
      '<button class="btn sm" id="story-amb-btn" onclick="Jungle.toggleAmb()" aria-pressed="'+(a.amb?'true':'false')+'">'+(a.amb?Jungle.ambName()+'：開':'🌿 環境音：關')+'</button>'+
      '<input type="range" id="story-amb-vol" min="0" max="100" value="'+Math.round((a.ambVol/0.35)*1000)/10+'" oninput="Jungle.setAmbVol(this.value)" aria-label="環境音音量">'+
      '<span class="story-hint" id="story-audio-note">'+esc(a.note||'')+'</span>'+
      '<span class="story-hint">'+(a.mode==='scene'?(a.auto?'逐段：播完自動跳下一張圖｜':'逐段：播完停低｜'):'')+'播住都可以照撳圖｜想自己講就唔播'+(sceneReady?'':'（本集未有逐段聲）')+'</span>'+
      (Jungle.langNote(a.lang)?'<span class="story-hint story-langnote">'+esc(Jungle.langNote(a.lang))+'</span>':'');
  },
  buildAudio:function(){
    Jungle.prefs();
    var bar=document.getElementById('story-audio');if(!bar)return;
    if(Jungle.audio.ep!==Jungle.stageState.ep){Jungle.audio.ep=Jungle.stageState.ep;Jungle.audio.part=0;Jungle.audio.playing=false;Jungle.audio.lang='';}
    var langs=Jungle.langsOf(DATA.jungle.episodes[Jungle.stageState.ep].id);
    if(!Jungle.audio.lang||!langs.some(function(l){return l[0]===Jungle.audio.lang;}))Jungle.audio.lang=langs.length?langs[0][0]:'';
    if(Jungle.audio.mode==='scene'&&!Jungle.sceneCount(DATA.jungle.episodes[Jungle.stageState.ep].id,Jungle.audio.lang))Jungle.audio.mode='episode';
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
  audioNote:function(msg){Jungle.audio.note=msg||'';Jungle.markAudio();var s=document.getElementById('story-audio-note');if(s)s.textContent=Jungle.audio.note;},
  audioError:function(){Jungle.audio.playing=false;Jungle.audioNote('音檔未載入，可能未快取；可以直接照文字講。');},
  markAudio:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], pl=Jungle.playlist(ep.id,Jungle.audio.lang), list=pl.files;
    var a=Jungle.audio;
    var bar=document.getElementById('story-audio');
    if(bar&&bar.querySelectorAll){
      var chips=bar.querySelectorAll('.story-lang');
      for(var i=0;i<chips.length;i++)chips[i].classList&&chips[i].classList.toggle&&chips[i].classList.toggle('cur',chips[i].getAttribute&&chips[i].getAttribute('data-lang')===a.lang);
    }
    var btn=document.getElementById('story-audio-btn');if(btn)btn.textContent=a.playing?'⏸ 停':'▶ 播';
    var modeBtn=document.getElementById('story-mode-btn');if(modeBtn)modeBtn.textContent=a.mode==='scene'?'📄 逐段':'🎞️ 整集';
    var autoBtn=document.getElementById('story-auto-btn');if(autoBtn)autoBtn.textContent=a.auto?'🔁 自動跟圖:開':'⏸ 自動跟圖:關';
    var ambBtn=document.getElementById('story-amb-btn');if(ambBtn)ambBtn.textContent=a.amb?Jungle.ambName()+'：開':'🌿 環境音：關';
    var st=document.getElementById('story-audio-state');
    if(st){
      var el=Jungle.audioEl(), label=a.playing?'播放中':'已暫停';
      var pos=a.mode==='scene'?((Jungle.stageState.slide>0?Jungle.stageState.slide+'/'+ep.scenes.length:'封面')):
        ((a.part+1)+'/'+(list.length||1))+(pl.chained?'（接段）':'');
      var scope=a.mode==='scene'?'逐段':'整集';
      st.textContent=label+'｜'+scope+' '+pos+(el&&el.duration&&isFinite(el.duration)?'｜'+Jungle.mmss(el.currentTime)+' / '+Jungle.mmss(el.duration):'');
    }
    var seek=document.getElementById('story-audio-seek'), el2=Jungle.audioEl();
    if(seek&&el2&&el2.duration&&isFinite(el2.duration))seek.value=String(Math.round((el2.currentTime/el2.duration)*100));
    var note=document.getElementById('story-audio-note');if(note)note.textContent=a.note||'';
  },
  mmss:function(t){t=Math.max(0,Math.round(t||0));return Math.floor(t/60)+':'+('0'+(t%60)).slice(-2);},
  /* 揀語言即由本集第一段開始播（逐段模式會先跳去第一張圖） */
  playNarration:function(lang){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep];
    var pl=Jungle.playlist(ep.id,lang);
    if(!pl.files.length)return;
    Jungle.audio.lang=lang;Jungle.audio.part=0;Jungle.audio.ep=Jungle.stageState.ep;
    Jungle.buildAudio();
    Jungle.playCurrent(true);
  },
  playCurrent:function(fromStart){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], a=Jungle.audio;
    var el=Jungle.audioEl();
    if(!el||typeof el.play!=='function'){Jungle.audioNote('呢部機／呢個環境播唔到；可以直接照文字講。');return;}
    if(a.mode==='scene'){
      if(Jungle.stageState.slide===0)Jungle.stageMove(1);
      var file=Jungle.currentSceneFile();
      if(!file){Jungle.audio.playing=false;Jungle.audioNote('呢段未有逐段旁白；可以撳「🎞️ 整集」連續播，或者自己講。');Jungle.markAudio();return;}
      el.src=file;
    }else{
      var list=Jungle.playlist(ep.id,a.lang).files;
      if(!list.length)return;
      if(fromStart)a.part=0;
      el.src=list[Math.min(a.part,list.length-1)];
    }
    Jungle.audioNote('');
    var p=el.play();if(p&&p.catch)p.catch(function(){Jungle.audioNote('音檔未載入，可能未快取；可以直接照文字講。');});
    a.playing=true;Jungle.startAmb();Jungle.markAudio();
  },
  toggleNarration:function(){
    var el=Jungle.audioEl(), a=Jungle.audio;
    if(a.playing){Jungle.pauseNarration();return;}
    if(el&&el.src){if(typeof el.play==='function')el.play();a.playing=true;Jungle.startAmb();Jungle.markAudio();return;}
    Jungle.playCurrent(false);
  },
  narrationEnded:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep], a=Jungle.audio;
    if(a.mode==='scene'){
      if(!a.auto){a.playing=false;Jungle.markAudio();return;}
      var total=Jungle.slides(Jungle.stageState.ep).length;
      var next=Jungle.stageState.slide+1;
      if(next>total-1){a.playing=false;Jungle.audioNote('成集講完；可以撳「▶ 播」聽多次。');return;}
      var file=Jungle.sceneFile(ep.id,a.lang,next);
      if(!file){a.playing=false;Jungle.markAudio();Jungle.audioNote('下一段未有逐段旁白；可以自己講，或者撳「🎞️ 整集」。');return;}
      Jungle.stageMove(1);
      var el=Jungle.audioEl();
      if(el&&typeof el.play==='function'){el.src=file;el.play();}
      a.playing=true;Jungle.markAudio();return;
    }
    var list=Jungle.playlist(ep.id,a.lang).files;
    if(a.part+1<list.length){a.part++;var el2=Jungle.audioEl();if(el2&&typeof el2.play==='function'){el2.src=list[a.part];el2.play();}Jungle.markAudio();return;}
    a.playing=false;a.part=0;Jungle.markAudio();Jungle.audioNote('播完；可以再撳「▶ 播」聽多次。');
  },
  toggleMode:function(){
    var ep=DATA.jungle.episodes[Jungle.stageState.ep];
    var next=Jungle.audio.mode==='scene'?'episode':'scene';
    if(next==='scene'&&!Jungle.sceneCount(ep.id,Jungle.audio.lang||'yue')){Jungle.audioNote('本集／本語言未有逐段旁白，暫時要用整集播。');return;}
    Jungle.audio.mode=next;Jungle.audio.part=0;Jungle.audio.note='';
    Jungle.savePrefs();
    var el=Jungle.audioEl();if(el&&typeof el.pause==='function')el.pause();
    Jungle.audio.playing=false;
    Jungle.buildAudio();
    Jungle.audioNote(next==='scene'?'已轉逐段：播完一段自動跳下一張圖（可以熄「自動跟圖」）。':'已轉整集：連續播完成集，唔會跳圖。');
  },
  toggleAuto:function(){
    Jungle.audio.auto=!Jungle.audio.auto;Jungle.savePrefs();Jungle.markAudio();
    Jungle.audioNote(Jungle.audio.auto?'自動跟圖：開（播完自動跳）':'自動跟圖：關（播完停低等你）');
  },
  pauseNarration:function(){var el=Jungle.audioEl();if(el&&typeof el.pause==='function')el.pause();Jungle.audio.playing=false;Jungle.stopAmb();Jungle.markAudio();},
  seekNarration:function(v){var el=Jungle.audioEl();if(el&&el.duration&&isFinite(el.duration))el.currentTime=el.duration*(Number(v)/100);},
  /* ---------- 環境音：細音量墊底，跟段落轉 ---------- */
  syncAmb:function(){
    var el=Jungle.ambEl();if(!el)return;
    var src=Jungle.ambSrc();
    if(src&&el.getAttribute&&el.getAttribute('src')!==src){el.src=src;}
    el.loop=true;el.volume=Jungle.audio.amb?Jungle.audio.ambVol:0;
  },
  fadeAmb:function(to,ms){
    var el=Jungle.ambEl();if(!el)return;
    var from=typeof el.volume==='number'?el.volume:0, steps=6, i=0;
    if(typeof setInterval!=='function'){el.volume=to;return;}
    var t=setInterval(function(){
      i++;
      try{el.volume=from+(to-from)*(i/steps);}catch(e){}
      if(i>=steps){clearInterval(t);Jungle._ambFade=null;}
    },Math.max(16,Math.round((ms||400)/steps)));
    Jungle._ambFade=t;
  },
  startAmb:function(){
    Jungle.prefs();Jungle.ambStopping=false;if(!Jungle.audio.amb)return;
    var el=Jungle.ambEl();if(!el||typeof el.play!=='function')return;
    if(!el.getAttribute('src')&&!el.src)Jungle.syncAmb();
    el.loop=true;el.volume=0;
    var p=el.play();if(p&&p.catch)p.catch(function(){});
    Jungle.fadeAmb(Jungle.audio.ambVol,450);
  },
  stopAmb:function(){
    var el=Jungle.ambEl();if(!el||typeof el.pause!=='function')return;
    Jungle.ambStopping=true;
    Jungle.fadeAmb(0,260);
    if(typeof setTimeout==='function')setTimeout(function(){try{if(el.volume<=0.001)el.pause();}catch(e){}} ,280);
    else el.pause();
  },
  toggleAmb:function(){
    Jungle.prefs();Jungle.audio.amb=!Jungle.audio.amb;Jungle.savePrefs();
    if(Jungle.audio.amb){Jungle.syncAmb();Jungle.startAmb();Jungle.audioNote('環境音：開（'+Jungle.ambName()+'，細聲墊底）');}
    else{Jungle.stopAmb();Jungle.audioNote('環境音：關');}
    Jungle.markAudio();
  },
  setAmbVol:function(v){
    Jungle.prefs();
    Jungle.audio.ambVol=Math.max(0,Math.min(100,Number(v)||0))/100*0.35+0.02;
    if(Jungle.audio.ambVol>Jungle.ambVolMax)Jungle.audio.ambVol=Jungle.ambVolMax;
    Jungle.savePrefs();
    var el=Jungle.ambEl();if(el&&Jungle.audio.amb)el.volume=Jungle.audio.ambVol;
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
    /* 逐段模式：手動翻頁都換返嗰段聲（唔會播錯段） */
    if(Jungle.audio.playing&&Jungle.audio.mode==='scene'){
      var f=Jungle.currentSceneFile(), el=Jungle.audioEl();
      if(f&&el&&typeof el.play==='function'){el.src=f;el.play();}
      else if(!f){Jungle.audio.playing=false;Jungle.audioNote('呢段未有逐段旁白；可以撳「🎞️ 整集」或者自己講。');}
    }
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
      '<p class="mut">逐段旁白覆蓋：'+esc(Jungle.sceneCoverage())+'（逐段模式會跟圖自動跳下一張）</p>'+
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
  /* 逐段旁白覆蓋率（畀領袖一眼睇到邊種語言齊）：例如「粵 27/27、普 27/27、英 26/27」 */
  sceneCoverage:function(){
    var total=DATA.jungle.episodes.reduce(function(n,e){return n+e.scenes.length;},0);
    return DATA.jungle.narration.langs.map(function(l){
      var done=0;
      DATA.jungle.episodes.forEach(function(e){done+=(((DATA.jungle.sceneAudio[e.id]||{})[l[0]]||[]).filter(Boolean).length);});
      return l[1]+' '+done+'/'+total;
    }).join('、');
  },
  /* 列印選項：只印圖／圖＋故事文字／圖＋旁白稿／只印旁白稿，另可揀要唔要領袖問答頁。 */
  printModes:{image:'🖼️ 只印圖', story:'📖 圖＋故事文字＋問題', script:'🗣️ 圖＋旁白稿', text:'📝 只印旁白稿'},
  printOptions:function(i){
    var ep=DATA.jungle.episodes[i];if(!ep)return;
    var p=Jungle.printPref();
    var langs=Jungle.langsOf(ep.id).map(function(l){return l[1];});
    Modal.open('<h2>🖨️ 列印《'+esc(ep.title)+'》</h2><p class="mut">共 '+ep.scenes.length+' 段。旁白稿＝照讀用嘅文字，同錄音版本同一段內容。'+(langs.length?'🎧 本集旁白：'+langs.join('／')+'（可以先播再派圖）。':'')+'</p>'+
      Object.keys(Jungle.printModes).map(function(m){
        return '<div class="amb-row"><button class="btn '+(p.mode===m?'gr':'')+'" onclick="Jungle.printEpisode('+i+',\''+m+'\')">'+Jungle.printModes[m]+'</button>'+
          '<span class="mut">'+esc({image:'每段一大圖，冇文字（投影用／派發）',story:'原本列印：大圖＋故事文字＋領袖問答',script:'大圖＋旁白稿（照讀），唔印問題',text:'冇圖，只有旁白稿（慳紙，領袖自己講）'}[m])+'</span></div>';}).join('')+
      '<h3>附加</h3><div class="amb-row"><label><input type="checkbox" id="print-answers"'+(p.answers?' checked':'')+' onchange="Jungle.printPrefSet(\'answers\',this.checked)"> 加領袖問答頁（問／答／現實生活）</label>'+
      '<label><input type="checkbox" id="print-cast"'+(p.cast?' checked':'')+' onchange="Jungle.printPrefSet(\'cast\',this.checked)"> 每段列出場角色</label></div>'+
      '<p class="mut">選項會記住（本機）。想印邊段？投屏時都可以用同一份圖。</p>'+
      '<div class="quick"><button class="btn" onclick="Modal.close()">收起</button></div>');
  },
  printPref:function(){
    if(!Jungle._printPref){
      var p=null;try{p=Store.get('storyPrint',null);}catch(e){p=null;}
      p=p||{};
      Jungle._printPref={mode:Jungle.printModes[p.mode]?p.mode:'story',answers:p.answers!==false,cast:p.cast===true};
    }
    return Jungle._printPref;
  },
  printPrefSet:function(k,v){var p=Jungle.printPref();p[k]=v;try{Store.set('storyPrint',p);}catch(e){}},
  sheets:function(i,opts){
    var ep=DATA.jungle.episodes[i];if(!ep)return '';
    var pref=Jungle.printPref();
    var mode=(opts&&opts.mode)||pref.mode, answers=(opts&&opts.answers!==undefined)?opts.answers:pref.answers, cast=(opts&&opts.cast!==undefined)?opts.cast:pref.cast;
    var title={image:'場景圖',story:'故事文字',script:'旁白稿（照讀）',text:'旁白稿（照讀）'}[mode]||'故事文字';
    var body=ep.scenes.map(function(s,k){
      var img=(mode!=='text'&&Jungle.artReady(s.img))?'<img class="story-photo" src="'+Jungle.slideSrc(s.img)+'" alt="'+esc(s.title)+'">':'';
      var castLine=cast?'<p class="mut">出場：'+s.cast.map(function(id){var c=DATA.jungle.characters.find(function(c){return c.id===id;});return c?esc(c.name):'';}).join('、')+'</p>':'';
      var text=(mode==='image')?'':'<p'+(mode==='script'?' class="story-text"':'')+'>'+esc(s.text)+'</p>';
      var q=(mode==='story')?'<p><b>停一停，問一問：</b>'+esc(s.question)+'</p>':'';
      return '<div class="story-page"><h3>'+(k+1)+' · '+esc(s.title)+'</h3>'+img+castLine+text+q+'</div>';
    }).join('');
    var head='<section class="psheet story-sheet"><h2>🌳 '+esc(ep.title)+'｜'+title+'</h2><p class="mut">'+esc((DATA.jungle.decks[ep.id]||{}).subtitle||'')+'</p>';
    var out=head+body+'<p class="mut">文字依總會《森林故事》內容（《香港童軍》月刊第158–170期版本）改寫；場景圖為 AI 生成教學插畫，非官方原圖。旁白錄音與此稿同一段內容，用講故事語氣讀出。</p></section>';
    if(answers&&mode!=='image')out+='<section class="psheet leader-sheet"><h2>領袖問答及帶領提示</h2>'+ep.scenes.map(function(s,k){
      return '<p><b>'+(k+1)+' '+esc(s.title)+'</b><br>問：'+esc(s.question)+'<br>答：'+esc(s.answer)+'<br>現實生活：'+esc(s.lesson)+'</p>';}).join('')+
      '<p class="mut">領袖可先播逐段旁白（🎧），再問問題；圖、字、問題次序可以按小隊情況調整。</p></section>';
    return out;
  },
  printEpisode:function(i,mode,opts){
    var ep=DATA.jungle.episodes[i];if(!ep)return;
    if(mode&&Jungle.printModes[mode])Jungle.printPrefSet('mode',mode);
    Practical.printModal('森林故事：'+ep.title,Jungle.sheets(i,opts));
  },
  view:function(){return '<section class="card"><a class="back" href="#book">‹ 手冊</a><h1>🌳 森林故事</h1><p>先認角色，再講故事，最後連回小隊生活。開「投屏講故事」就可以一路投影、一路講。</p><div class="quick" style="margin:8px 0"><button class="btn" onclick="Jungle.audioLab()">🎚️ 試聽旁白／環境音</button></div><div class="template-grid">'+DATA.jungle.episodes.map(function(ep,i){return '<article class="template-card"><span class="eyebrow">'+esc(ep.refs.join('／'))+'</span><h3>'+esc(ep.title)+'</h3><p>'+esc((DATA.jungle.decks[ep.id]||{}).subtitle||'')+'</p><p class="mut" style="font-size:12px">'+ep.scenes.length+'段 · 每段一大張圖 · 領袖答案另收'+(Jungle.langsOf(ep.id).length?' · 🎧 旁白：'+Jungle.langsOf(ep.id).map(function(l){return l[1];}).join('／'):'')+'</p><div class="quick"><button class="btn gr" onclick="Jungle.show('+i+')">📺 投屏講故事</button><button class="btn" onclick="Jungle.open('+i+')">逐段閱讀</button><button class="btn" onclick="Jungle.printOptions('+i+')">🖨️ 列印</button></div></article>';}).join('')+'</div></section><section class="card"><h2>11位角色：認人與配對</h2><p class="mut">撳角色先睇介紹，再展開答案。哈蒂與戴白祺可作延伸，不硬放入每段故事。</p><p class="mut" style="font-size:11px">頭像為 AI 繪製教學示意，非童軍總會官方原圖；角色文字介紹以官方版本為準。</p><div class="template-grid">'+DATA.jungle.characters.map(function(c){return '<button class="btn character-card" onclick="Jungle.card(\''+c.id+'\')">'+(c.img?'<img src="'+c.img+'" alt="" loading="lazy" onerror="this.remove()">':'')+'<b>'+esc(c.name)+'</b><span>'+esc(c.english)+' · '+esc(c.kind)+'</span></button>';}).join('')+'</div></section><details class="card"><summary>故事來源</summary><p>'+esc(DATA.jungle.sourceNote)+'</p><p>投屏圖及角色圖為 AI 生成教學插畫，非總會官方原圖；故事文字依總會《森林故事》內容（《香港童軍》月刊第158–170期版本）改寫，省略暴力細節。</p>'+extBtn(DATA.jungle.source,false,'幼童軍支部：森林故事','角色及情節核對來源')+'<p class="mut">文字內容不依賴外部圖片載入，可離線使用。</p></details>';}
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
