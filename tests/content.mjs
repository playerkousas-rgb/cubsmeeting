import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const mem={}, elements={};
const el=()=>({id:'',innerHTML:'',className:'',style:{setProperty(){}},value:'',hidden:false,
  classList:{_s:new Set(),toggle(c,on){on?this._s.add(c):this._s.delete(c)},add(c){this._s.add(c)},remove(c){this._s.delete(c)},contains(c){return this._s.has(c)}},
  setAttribute(){},getAttribute:()=>null,removeAttribute(){},appendChild(n){if(n&&n.id)elements[n.id]=n},addEventListener(){},removeEventListener(){},
  querySelector:()=>null,querySelectorAll:()=>[],closest:()=>null,focus(){},insertAdjacentHTML(){},remove(){}});
const body=el();body.id='body';
const ctx={console,localStorage:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v)},location:{hash:'#plan'},navigator:{onLine:true},
  document:{getElementById:id=>elements[id]??=el(),createElement:()=>el(),querySelectorAll:()=>[],querySelector:()=>null,body,documentElement:el(),addEventListener(){},removeEventListener(){},fullscreenElement:null,exitFullscreen(){}},
  setTimeout:()=>{},clearTimeout(){},setInterval:()=>1,clearInterval(){},addEventListener(){},scrollTo(){},print(){}};
ctx.window=ctx;vm.createContext(ctx);
for(const file of ['data','jungle-data','practical-data','guide','flow','app','redesign','content','jungle','practical','uniform-ceremony','field-visuals','salute-lab','salute-positions','tracking-kit','material-desk','plain-content','worksheet-guides'])vm.runInContext(fs.readFileSync(`js/${file}.js`,'utf8'),ctx);
const {DATA,App,Flow,PackPrint}=ctx;
assert.equal(DATA.meetings.length,27);
assert.equal(new Set(DATA.meetings.map(m=>m.tid)).size,27);
assert.equal(DATA.facts.motto,'準備');
assert.equal(DATA.source.version,'2026-08-09');
assert(DATA.badges.some(b=>b.n==='幼童軍體驗章'));
assert(!DATA.badges.some(b=>b.n==='幼童軍獎章'||b.n==='專科章'));
for(const m of DATA.meetings){
  for(const key of ['goal','evidence','gap','notice','contentVersion'])assert(m[key]?.length>5,`${m.tid} ${key}`);
  assert(m.refs.length&&m.adapt.easy&&m.adapt.hard);
  assert.equal(m.mins,m.segs.reduce((sum,s)=>sum+s.m,0));
  for(const s of m.segs){assert.equal(s.steps.length,3);assert(s.watch&&s.safety&&s.script&&s.rhythm);assert.equal(ctx.Guide.forStage(s).steps[0][3],s.steps[0]);for(const item of s.mats)assert(m.bag.includes(item));}
  for(const item of m.bag)assert(DATA.materials.some(x=>x.n===item),`${m.tid} missing material ${item}`);
  assert.equal(m.worksheet.prompts.length,3);
  const detail=App.vMeetDetail(m);assert(detail.includes(m.evidence)&&detail.includes(m.gap));
}
for(const code of ['1.1.1','1.1.2','1.1.3','1.2.1','1.2.2','1.2.3','1.3.1','1.3.2','1.3.3','1.4.1','1.4.2','1.4.3'])assert(DATA.meetings.some(m=>m.refs.includes(code)),`experience support ${code}`);
assert(DATA.meetings.find(m=>m.tid==='c24').gap.includes('一週'));
assert(DATA.meetings.find(m=>m.tid==='c03').gap.includes('須補核'));
let output='';ctx.Modal.open=html=>output=html;
App.prepare('c07');ctx.Store.set('roster',['A','B','C']);
PackPrint.open('sheet','c24');assert.equal(ctx.curTid(),'c07');assert.equal((output.match(/class="psheet worksheet"/g)||[]).length,3);assert(!output.includes('class="psheet leader-sheet"'));assert(output.includes('一週內三次幫手任務'));
PackPrint.confirmDone();assert(!Flow.isDone('print'),'printing another sheet must not advance current meeting');
PackPrint.open('leader');assert(output.includes('class="psheet leader-sheet"'));assert(!output.includes('class="psheet worksheet"'));
PackPrint.doit();assert(!Flow.isDone('print'),'opening or cancelling print must not auto-complete');
PackPrint.open('all');assert.equal((output.match(/class="psheet worksheet"/g)||[]).length,3);assert.equal((output.match(/class="psheet divider"/g)||[]).length,1);
PackPrint.confirmDone();assert(Flow.isDone('print'));
assert(!output.includes('圖紙內容：跟住領袖指示做'));
assert(App.vBook().includes(DATA.source.url));
console.log('CONTENT PASS: 27 lessons, 135 authored stages, syllabus mappings, materials, text worksheets and print isolation');

assert.equal(DATA.jungle.characters.length,11);
assert.equal(DATA.jungle.episodes.length,5);
/* 2026-09-15：故事文字依總會原版（月刊158–170期版本）加厚，每集6/7/4/5/5段，投屏每段一大圖。 */
assert.equal(JSON.stringify(DATA.jungle.episodes.map(e=>e.scenes.length)),'[6,7,4,5,5]','每集分段數目（加厚後）');
for(const episode of DATA.jungle.episodes){
  assert(DATA.jungle.decks[episode.id]&&DATA.jungle.decks[episode.id].subtitle,'每集要有投屏封面同副題：'+episode.id);
  for(const scene of episode.scenes){
    assert(scene.text&&scene.question&&scene.answer&&scene.lesson);
    for(const id of scene.cast)assert(DATA.jungle.characters.some(c=>c.id===id));
    if(scene.img&&!DATA.jungle.pendingArt.includes(scene.img)){const fp=path.join(root,'assets/jungle/slides/'+scene.img+'.avif');
      assert(fs.existsSync(fp),'已出圖嘅段落檔案要存在：'+scene.img);
      assert(fs.statSync(fp).size<=120*1024,'投屏圖 ≤120KB：'+scene.img);
      assert(fs.readFileSync('sw.js','utf8').includes('./assets/jungle/slides/'+scene.img+'.avif'),'投屏圖要入離線快取：'+scene.img);}
    else if(scene.img){assert(!fs.existsSync(path.join(root,'assets/jungle/slides/'+scene.img+'.avif')),'pendingArt 清單要同實際檔案同步：'+scene.img);}
  }
}
assert(DATA.jungle.episodes.find(e=>e.id==='welcome').scenes.some(s=>s.text.includes('白勞')&&s.text.includes('白基拿')),'加入狼群一集要保留兩位擔保人');
assert(DATA.jungle.episodes.find(e=>e.id==='fire').scenes.some(s=>s.text.includes('紅花')),'火種一集要保留紅花情節');
assert(DATA.jungle.episodes.find(e=>e.id==='village').scenes.some(s=>s.text.includes('美修娃')),'回村一集要保留美修娃認子情節');
App.prepare('c07');
ctx.location.hash='#jungle';App.route();assert(elements.view.innerHTML.includes('11位角色'));assert.equal(ctx.curTid(),'c07');
ctx.Jungle.open(0);assert.equal(ctx.Jungle.page,0);ctx.Jungle.move(-1);assert.equal(ctx.Jungle.page,0);
ctx.Jungle.move(99);assert.equal(ctx.Jungle.page,5,'第一集最尾一段');assert(output.includes('白勞'));
ctx.Jungle.open(1);assert.equal(ctx.Jungle.page,0);ctx.Jungle.move(3);assert(output.includes('獵場'));
ctx.Jungle.card('kaa');assert(output.includes('幫助毛吉利'));assert.equal(ctx.curTid(),'c07');
/* 本地 AI 插畫頭像係受審查嘅依賴，准；外連 http 圖唔准。 */
const jungleView=ctx.Jungle.view();
assert(!jungleView.includes('src="http'),"jungle view 唔得引用外連 http 圖");
for(const c of DATA.jungle.characters){
  if(c.img){assert(c.img.startsWith("assets/jungle/"),"頭像路徑要喺 assets/jungle/：" + c.id);
    const fp=path.join(root,c.img);assert(fs.existsSync(fp),"頭像檔案要存在：" + c.img);
    assert(fs.statSync(fp).size<=120*1024,"頭像要 ≤120KB：" + c.img);}
}
assert(jungleView.includes("AI 繪製教學示意"),"要標明頭像係 AI 教學示意、非官方原圖");
/* 投屏講故事：開幕、翻頁、問題、收幕、鍵盤、列印，全部唔改準備狀態。 */
ctx.location.hash='#jungle';App.route();
assert(elements.view.innerHTML.includes('投屏講故事'),'故事頁要有投屏入口');
const stageEl=()=>ctx.document.getElementById('story-stage');
ctx.Jungle.show(0);
assert(stageEl().innerHTML.includes('story-stage'),'投屏要 render 舞台');
assert(stageEl().innerHTML.includes('jungle-wolf-carry.avif'),'封面用大圖');
assert(stageEl().innerHTML.includes('1 / 7'),'顯示第幾張（封面＋6段）');
assert(!stageEl().innerHTML.includes('story-ask'),'封面唔會顯示問題區');
assert(stageEl().innerHTML.includes('story-castline')&&/出場：/.test(stageEl().innerHTML),'封面列出今集出場角色');
ctx.Jungle.stageMove(1);assert.equal(ctx.Jungle.stageState.slide,1);assert(stageEl().innerHTML.includes('jungle-night-tiger.avif'),'第二張換圖');
assert(!stageEl().innerHTML.includes('story-ask'),'未撳問題時唔會預先出問題區');
const beforeAsk=stageEl().innerHTML;ctx.Jungle.stageAsk();
assert(stageEl().innerHTML!==beforeAsk&&stageEl().innerHTML.includes('story-ask'),'撳「問題」先出問題區');
assert(/領袖答案/.test(stageEl().innerHTML),'答案收喺問題區內可展開');
ctx.Jungle.stageMove(1);assert(!stageEl().innerHTML.includes('story-ask'),'轉去下一張會收返問題區');
assert(stageEl().innerHTML.includes('jungle-wolf-carry.avif'),'第三張用返狼父銜住嬰兒嗰張圖');
ctx.Jungle.stageMove(-5);assert.equal(ctx.Jungle.stageState.slide,0,'上一張唔會越界');
ctx.Jungle.stageMove(99);assert.equal(ctx.Jungle.stageState.slide,6,'下一張去到最後一張（封面＋6段）');
ctx.Jungle.episodeStep(4);assert.equal(ctx.Jungle.stageState.ep,4);assert(stageEl().innerHTML.includes('1 / 6'),'可跳去第五集（封面＋5段）');
ctx.Jungle.episodeStep(9);assert.equal(ctx.Jungle.stageState.ep,4,'跳去唔存在集數唔會出事');
ctx.Jungle.fontStep(1);assert(stageEl().style&&typeof stageEl().style.setProperty==='function','放大字唔會拋錯');
ctx.Jungle.stageMove(1);
assert.equal(DATA.jungle.pendingArt.length,0,'場景圖已經全部出齊');
assert(stageEl().innerHTML.includes('story-photo')&&stageEl().innerHTML.includes('jungle-village.avif'),'第五集第 2 段用新出嘅大圖');
assert(!stageEl().innerHTML.includes('製作中'),'圖齊咗就唔會再出「製作中」提示');
ctx.Jungle.episodeStep(0);ctx.Jungle.stageMove(1);
assert(stageEl().innerHTML.includes('story-photo')&&stageEl().innerHTML.includes('jungle-night-tiger.avif'),'已出圖嘅段落用大圖');
ctx.Jungle.bindKeys(true);const slideBefore=ctx.Jungle.stageState.slide;ctx.Jungle.keys({key:'ArrowRight',preventDefault(){}});assert(ctx.Jungle.stageState.slide===slideBefore+1,'鍵盤 → 可以翻頁');
ctx.Jungle.keys({key:'q',preventDefault(){}});assert(ctx.Jungle.stageState.ask,'鍵盤 Q 開問題區');
ctx.Jungle.bindKeys(false);
ctx.Jungle.stageClose();assert.equal(stageEl().innerHTML,'','收幕清空舞台');
assert(!ctx.document.body.classList.contains('story-open'),'收幕要移除 body.story-open');
ctx.Jungle.bindKeys(true);assert(ctx.Jungle._bound===true,'綁定鍵盤');ctx.Jungle.bindKeys(false);assert(ctx.Jungle._bound===false,'收幕解除鍵盤綁定');
ctx.Jungle.bindKeys(false);
/* 旁白錄音：語言清單、檔案、播放清單、暫停／換集行為。 */
const narr=DATA.jungle.narration;
assert(narr&&narr.langs.length===3&&narr.files,'要有旁白錄音資料');
const narrFiles=[];
for(const ep of DATA.jungle.episodes){
  const langs=ctx.Jungle.langsOf(ep.id);
  if(narr.pending.includes(ep.id))assert.equal(langs.length,0,'待錄旁白嘅集數唔應該有清單：'+ep.id);
  else assert(langs.length>=1,'每集至少一種語言旁白（'+ep.id+'）');
  for(const [code] of langs){
    const list=narr.files[ep.id][code];
    assert(Array.isArray(list)&&list.length>=1,'旁白清單要係陣列：'+ep.id+'/'+code);
    for(const f of list){assert(fs.existsSync(path.join(root,f)),'旁白檔案要存在：'+f);
      narrFiles.push(f);
      assert(fs.readFileSync('sw.js','utf8').includes('./'+f),'旁白要入離線快取：'+f);}
  }
}
assert(narrFiles.length>=5,'起碼有幾段旁白（實際 '+narrFiles.length+'）');
assert(narr.files.help.zh&&narr.files.help.zh.length===1,'普通話旁白要覆蓋第二集');
assert(narr.files.welcome.en.length===2,'英文旁白可以分幾段順住播');
/* 2026-09-15 第二輪：普通話＋英文補齊五集；粵語第一集試聽，並標明語氣限制。 */
assert.deepEqual===undefined||true;
assert.equal(JSON.stringify(Object.keys(narr.files).sort()),JSON.stringify(['fire','help','rules','village','welcome']),'五集都有旁白資料');
for(const [ep,byLang] of Object.entries(narr.files)){
  assert(byLang.zh&&byLang.zh.length>=1,ep+' 要有普通話旁白');
  assert(byLang.en&&byLang.en.length>=1,ep+' 要有英文旁白');
}
assert(narr.files.welcome.yue&&narr.files.welcome.yue.length===1,'粵語第一集');
for(const [ep,byLang] of Object.entries(narr.files))assert(byLang.yue&&byLang.yue.length>=1,ep+' 要有粵語旁白');
assert(narr.langNotes&&narr.langNotes.yue.includes('生硬'),'粵語要標明語氣限制');
assert.equal(narr.pending.length,0,'旁白唔應該再有待錄項');
assert.equal(DATA.jungle.pendingArt.length,0,'場景圖要全部出齊');
ctx.Jungle.show(0);
const barHTML=ctx.Jungle.audioBarHTML();
assert(barHTML.includes('🎧')&&barHTML.includes('普')&&barHTML.includes('EN'),'音訊條要有語言掣');
assert(barHTML.includes('粵'),'粵語掣要出（五集都有粵語旁白）');
assert(ctx.Jungle.langsOf('welcome').some(l=>l[0]==='en'),'第一集有英文旁白');
assert.equal(ctx.Jungle.langsOf('village').length,3,'第五集有普通話、英文同粵語');
assert(ctx.Jungle.langsOf('rules').length===3,'第三集有三種語言');
ctx.Jungle.show(1);assert(ctx.Jungle.langsOf('help').length===3,'第二集有三種語言');
ctx.Jungle.show(0);
assert(ctx.Jungle.langNote('yue').includes('生硬')&&ctx.Jungle.langNote('zh')==='','粵語提示只喺粵語出現');

/* 用假 audio 元素驗播放清單：第一段播完自動接第二段，播完停 */
const played=[];let paused=0;
ctx.Jungle.audioEl=()=>({src:'',currentTime:0,duration:60,play(){played.push(this.src);return Promise.resolve();},pause(){paused++;},addEventListener(){}});
ctx.Jungle.playNarration('en');
assert(played.length===1&&played[0].includes('welcome-en-1.mp3'),'撳 EN 由第一段開始播');
assert(ctx.Jungle.audio.playing,'播放狀態要開');
ctx.Jungle.narrationEnded();
assert(played.length===2&&played[1].includes('welcome-en-2.mp3'),'第一段完自動接第二段');
ctx.Jungle.narrationEnded();
assert(!ctx.Jungle.audio.playing,'最後一段播完停低');
ctx.Jungle.playNarration('zh');
assert(played[played.length-1].includes('welcome-zh.mp3'),'可以轉普通話');
ctx.Jungle.playNarration('yue');
assert(played[played.length-1].includes('welcome-yue.mp3'),'可以轉粵語');
ctx.Jungle.show(4);ctx.Jungle.playNarration('yue');
assert(played[played.length-1].includes('village-yue-1.mp3'),'第五集粵語由第一段開始');
ctx.Jungle.narrationEnded();
assert(played[played.length-1].includes('village-yue-2.mp3'),'第五集粵語第二段自動接播');
ctx.Jungle.show(0);
ctx.Jungle.pauseNarration();
assert(paused>=1&&!ctx.Jungle.audio.playing,'收幕／暫停要叫停音檔');
assert(ctx.Jungle.mmss(75)==='1:15','時間顯示格式');
ctx.Jungle.printEpisode(0);
assert(output.includes('story-sheet')&&output.includes('class="psheet leader-sheet"'),'可印本集文字＋領袖答案');
assert(output.includes('jungle-night-tiger.avif'),'印出嚟都有圖');
assert.equal(ctx.PackPrint.activeTid,null,'印故事唔會當印出隊包');
const withImg=DATA.jungle.characters.filter(c=>c.img);
assert.equal(withImg.length,11,"11 個角色全部要有頭像，實際 " + withImg.length);
ctx.Jungle.card("mowgli");assert(output.includes("character-portrait"),"角色卡要 render 肖像");
ctx.Jungle.card("hathi");assert(output.includes("character-portrait"),"哈蒂而家有頭像，card 要 render 肖像");
PackPrint.open('sheet','c26');assert(output.includes('排序並重述'));assert.equal(ctx.curTid(),'c07');
ctx.location.hash='#prep?tid=c27';App.route();assert.equal(ctx.curTid(),'c27');assert(App.vPrep().includes('2.4.2'));
console.log('JUNGLE PASS: characters, source-linked scenes, independent reader, lesson routes and worksheets');
