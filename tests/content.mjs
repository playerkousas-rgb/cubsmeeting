import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const mem={}, elements={};
const el=()=>({innerHTML:'',className:'',style:{},value:'',classList:{toggle(){},add(){},remove(){}},setAttribute(){},removeAttribute(){}});
const ctx={console,localStorage:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v)},location:{hash:'#plan'},navigator:{onLine:true},document:{getElementById:id=>elements[id]??=el(),querySelectorAll:()=>[],body:el(),documentElement:el()},setTimeout:()=>{},clearTimeout(){},setInterval:()=>1,clearInterval(){},addEventListener(){},scrollTo(){},print(){}};
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
for(const episode of DATA.jungle.episodes){assert.equal(episode.scenes.length,4);for(const scene of episode.scenes){assert(scene.text&&scene.question&&scene.answer&&scene.lesson);for(const id of scene.cast)assert(DATA.jungle.characters.some(c=>c.id===id));}}
App.prepare('c07');
ctx.location.hash='#jungle';App.route();assert(elements.view.innerHTML.includes('11位角色'));assert.equal(ctx.curTid(),'c07');
ctx.Jungle.open(0);assert.equal(ctx.Jungle.page,0);ctx.Jungle.move(-1);assert.equal(ctx.Jungle.page,0);
ctx.Jungle.move(99);assert.equal(ctx.Jungle.page,3);assert(output.includes('狼家庭照顧他'));
ctx.Jungle.open(1);assert.equal(ctx.Jungle.page,0);ctx.Jungle.move(3);assert(output.includes('卡'));
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
const withImg=DATA.jungle.characters.filter(c=>c.img);
assert(withImg.length>=9,"至少 9 個角色有頭像，實際 " + withImg.length);
ctx.Jungle.card("mowgli");assert(output.includes("character-portrait"),"角色卡要 render 肖像");
ctx.Jungle.card("hathi");assert(!output.includes("character-portrait"),"未有頭像嘅角色唔得硬塞空圖");
PackPrint.open('sheet','c26');assert(output.includes('排序並重述'));assert.equal(ctx.curTid(),'c07');
ctx.location.hash='#prep?tid=c27';App.route();assert.equal(ctx.curTid(),'c27');assert(App.vPrep().includes('2.4.2'));
console.log('JUNGLE PASS: characters, source-linked scenes, independent reader, lesson routes and worksheets');
