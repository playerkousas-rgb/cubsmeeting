/* Original, source-described tracking signs. No automatic assessment. */
var TrackingKit = {
 sources:{hk:'https://prog.scouting.org.hk/cub/wp-content/uploads/2019/01/TrackingSigns.pdf',shapes:'https://scouts.mt/wp-content/uploads/SK_Downloads/Training/Cubs/Bronze_Arrow/B01_Tracking_signs.pdf'},
 scope:'六個符號名稱已逐個核對官方《幼童軍獎章—追蹤》工作紙（沿路前進／左轉／右轉／此路不通／我們已回家／六步後有信物），全部吻合。官方該工作紙共十個符號，本套只收六個，未收：繼續前進、前面有水、前面有障礙、我們分途前進（兩人轉左、四人轉右）。圖形依馬耳他童軍協會教材文字自行繪製，並非香港官方原圖；官方原圖請開下面「香港官方追蹤工作紙」連結。正式考驗由領袖按適用教材確認。',
 items:[
  {key:'forward',name:'沿路前進',geometry:'向上的直箭嘴',path:'M90 115 V25 M65 50 L90 25 L115 50',answer:'沿箭嘴方向繼續前進；箭嘴只指路線，不代表一定向北。'},
  {key:'left',name:'左轉',geometry:'由下向上再彎向左的箭嘴',path:'M90 115 V60 H35 M60 35 L35 60 L60 85',answer:'沿前進方向到轉彎位置再向左，不是永遠向圖紙左邊走；先由成人確認安全路線。'},
  {key:'right',name:'右轉',geometry:'由下向上再彎向右的箭嘴',path:'M90 115 V60 H145 M120 35 L145 60 L120 85',answer:'沿前進方向到轉彎位置再向右；設卡者要按來路擺正，避免把卡倒轉。'},
  {key:'wrong',name:'此路不通',geometry:'兩條相交的斜線，形成交叉',path:'M55 35 L125 105 M125 35 L55 105',answer:'不要沿這條路繼續。停在安全位置，按成人安排找正確路線；不是越過障礙的挑戰。'},
  {key:'home',name:'我們已回家',geometry:'一個圓圈，中央有一點',answer:'路線結束。活動中到約定集合點找領袖點名，不代表可以自己離場回家。'},
  {key:'message',name:'六步後有信物',geometry:'方框內有數字6，旁邊有向右箭嘴',answer:'沿箭嘴方向走六個正常步伐找信物。步幅不是固定米數；信物由成人放在可見安全範圍，找不到就停下求助。'}
 ],
 reader:{index:0,reveal:false},
 svg:function(i){var s=TrackingKit.items[i];if(!s)return '';var shape=s.path?'<path d="'+s.path+'"/>':s.key==='home'?'<circle cx="90" cy="70" r="38"/><circle cx="90" cy="70" r="5" fill="#222"/>':'<rect x="25" y="40" width="60" height="60"/><path d="M85 70 H155 M135 50 L155 70 L135 90"/><text x="55" y="83" text-anchor="middle" font-size="36" stroke="none" fill="#222">6</text>';return '<svg class="tracking-symbol" viewBox="0 0 180 140" role="img" aria-label="'+esc(s.geometry)+'"><g fill="none" stroke="#222" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">'+shape+'</g></svg>';},
 note:function(full){var text='<p class="reference-credit">'+esc(TrackingKit.scope)+'</p>';return full?text:'<p class="reference-credit">自繪圖，非香港官方原圖；本套只收六款。考驗以適用教材為準。</p><details><summary>來源與未收錄的符號</summary>'+text+'</details>';},
 plan:function(){return '<ol><li><b>先設場：</b>成人走完路線，設起點、三個可見站及終點；不過車路、不靠水邊／高處。每站在成人照顧範圍，卡放桌面或穩固展示位置，不散放在踏步路線。</li><li><b>先教三圖：</b>先用前進、此路不通、結束。認清後才加左右轉或信物；不可把全套六圖當每次必須全教。</li><li><b>試走再開：</b>另一成人從來路看箭嘴方向。小隊同行，輪流說意思，等全隊到齊；看不到下一圖就在安全點停下求助，不四散搜索。</li><li><b>找信物：</b>成人在可見安全範圍預放一張紙訊息；六步只是步數，不是六米。找不到先問，不跨界、不翻石或採集生物。</li><li><b>完成要交接：</b>見圓圈中央一點後，到約定集合點點名。成人帶隊收回卡及物資，恢復場地；不自行回家。</li></ol>';},
 open:function(){Modal.open('<h2>追蹤符號｜先認圖，再跟路線</h2><p>六款圖、無答案剪卡、成員圖表及三站帶法；黑白也能辨認。</p>'+TrackingKit.note()+'<div class="tracking-key-grid">'+TrackingKit.items.map(function(s,i){return '<article>'+TrackingKit.svg(i)+'<h3>'+String.fromCharCode(65+i)+' · '+esc(s.name)+'</h3><p>'+esc(s.answer)+'</p></article>';}).join('')+'</div><details><summary>三站怎樣設／安全／物資</summary>'+TrackingKit.plan()+'<p>每組共用一套A4六張剪卡、成人用剪刀一把、紙訊息一张；記錄用每人A4紙及鉛筆。不能安全行走可改桌面指路，另記支援，不冒稱戶外追蹤完成。</p></details><div class="quick"><button class="btn gr" onclick="TrackingKit.start()">開始看圖配對</button><button class="btn" onclick="TrackingKit.print(\'cards\')">印六張無答案剪卡</button><button class="btn" onclick="TrackingKit.print(\'guide\')">印領袖帶法與答案</button><button class="btn" onclick="TrackingKit.print(\'worksheet\')">印成員符號圖表</button></div>'+extBtn(TrackingKit.sources.hk,false,'香港官方追蹤工作紙','十個符號名稱來源；本套六個名稱已全部核對吻合，圖形屬自繪')+extBtn(TrackingKit.sources.shapes,false,'圖樣文字來源：馬耳他童軍協會','只參考圖形描述，不採用其獎章制度或兩小時遠足安排'));handleOffline();},
 start:function(){TrackingKit.reader={index:0,reveal:false};TrackingKit.render();},
 move:function(d){if(!Number.isFinite(d))return;TrackingKit.reader.index=Math.max(0,Math.min(5,TrackingKit.reader.index+Math.trunc(d)));TrackingKit.reader.reveal=false;TrackingKit.render();},
 reveal:function(){TrackingKit.reader.reveal=true;TrackingKit.render();},
 render:function(){var r=TrackingKit.reader,s=TrackingKit.items[r.index];Modal.open('<section class="tracking-question"><p class="eyebrow">追蹤符號 · '+(r.index+1)+' / 6</p><h2>這個符號要我們怎樣做？</h2>'+TrackingKit.svg(r.index)+(r.reveal?'<div class="field-answer"><h3>'+esc(s.name)+'</h3><p>'+esc(s.answer)+'</p></div>':'<button class="btn gr" onclick="TrackingKit.reveal()">說出意思，再揭答案</button>')+'<div class="quick"><button class="btn" onclick="TrackingKit.move(-1)" '+(r.index===0?'disabled':'')+'>上一符號</button><button class="btn" onclick="TrackingKit.move(1)" '+(r.index===5?'disabled':'')+'>下一符號</button><button class="btn" onclick="TrackingKit.open()">回追蹤教材</button></div><p>可以口述、指認，或由領袖描述線條再討論；練習不自動標記考驗完成。</p>'+TrackingKit.note()+'</section>');},
 sheets:function(mode){if(!['cards','guide','worksheet'].includes(mode))return '';if(mode==='guide')return '<section class="psheet leader-sheet tracking-guide"><h2>追蹤符號｜領袖答案與三站帶法</h2><div class="tracking-key-grid">'+TrackingKit.items.map(function(s,i){return '<article>'+TrackingKit.svg(i)+'<b>'+String.fromCharCode(65+i)+' · '+esc(s.name)+'</b><p>'+esc(s.answer)+'</p></article>';}).join('')+'</div><p><b>物資：</b>每組一套六張剪卡；成人裁卡剪刀1把，信物紙訊息1張（可選），每人紙筆。剪刀由成人在活動前使用及收好。</p>'+TrackingKit.plan()+TrackingKit.note(true)+'<p class="reference-credit">來源：香港幼童軍天地 TrackingSigns.pdf（2019）；Scouts Malta B01 Tracking Signs，B01.1–B01.3。每組一套剪卡；可另印多套。未完成香港完整圖表核對。</p></section>';
 return '<section class="psheet tracking-'+mode+'"><h2>'+(mode==='cards'?'追蹤圖卡｜成人沿框線剪開':'我的追蹤符號圖表')+'</h2><p>'+(mode==='cards'?'每套六張，不附答案。字母只供配對，不是符號的一部分；不要當地貼。':'姓名：________　日期：________　可寫、口述或請領袖協助記錄。')+'</p><div class="tracking-card-grid">'+TrackingKit.items.map(function(s,i){return '<article><b>'+String.fromCharCode(65+i)+'</b>'+TrackingKit.svg(i)+(mode==='worksheet'?'<p>意思／行動：________________</p>':'')+'</article>';}).join('')+'</div><p>'+(mode==='cards'?'先在桌面認圖；圖卡帶入場地前由成人按來路方向擺正，活動後收回。':'找不到下一站，我會：________________________')+'</p><p class="reference-credit">本APP教學示意；圖卡不是完整考驗紀錄。圖樣來源與核對範圍見領袖頁。</p></section>';},
 print:function(mode){var html=TrackingKit.sheets(mode);if(html)Practical.printModal('追蹤符號教材',html);},
 panel:function(){return '<section class="card"><h2>追蹤符號實戰教材</h2><p>六款看圖配對、無答案剪卡、三站安全帶法及成員符號圖表。</p><button class="btn gr" onclick="TrackingKit.open()">開追蹤符號教材</button></section>';}
};
(function(){
 var summary=Practical.summary,activity=App.activity,build=SessionPack.build;
 App.registerBookPanel('tracking','🔍','追蹤教材',function(){return TrackingKit.panel();});
 Practical.summary=function(m){return summary(m)+(m.tid==='c18'?TrackingKit.panel():'');};
 App.activity=function(tid,i){if(tid==='c18'&&!Practical.meeting(tid).segs[i])return;activity(tid,i);if(tid==='c18'){var el=document.getElementById('modal');if(el&&el.querySelector){var box=el.querySelector('.mbox');if(box)box.insertAdjacentHTML('beforeend','<button class="btn gr" onclick="TrackingKit.open()">開追蹤圖卡與三站帶法</button>');}}};
 SessionPack.build=function(m,n,children){var html=build(m,n,children);if(!html||m.tid!=='c18')return html;var marker='<section class="psheet divider">',extra=TrackingKit.sheets('guide');html=html.includes(marker)?html.replace(marker,extra+marker):html+extra;return children?html+TrackingKit.sheets('cards'):html;};
 var m=Practical.meeting('c18');
 m.gap='已附六款追蹤圖卡、配對及三站帶法。六個符號名稱已核對官方《幼童軍獎章—追蹤》工作紙；圖形屬自繪，官方原圖見上方連結。官方另有四個符號未收錄。正式考驗由領袖確認。室內練習不代替郊野守則的郊野公園活動要求。';
 m.segs[1].steps[0]='開追蹤符號教材，先教前進、此路不通及結束三圖；需要時才加左右轉及信物。說明圖樣來源與待核範圍，正式考驗須另由領袖確認。';
 m.segs[1].how=m.segs[1].steps.map(function(x,i){return (i+1)+'. '+x;}).join(' ');
 DATA.materials.push({n:'追蹤領袖頁及六張剪卡（A4共2張）',base:1,per:0,unit:'套',note:'完整出隊包含領袖頁及共用剪卡；領袖專用模式不印剪卡。每組需一套時可獨立另印。成人剪開；成員符號圖表按需要另印。'});
 DATA.materials.push({n:'成人裁卡剪刀',base:1,per:0,unit:'把',note:'成人在活動前剪開圖卡並收好；不在追蹤路線中拿著剪刀。'},{n:'六步練習紙訊息（可選）',base:1,per:0,unit:'張',note:'做六步信物才需要；成人預先放在可見安全範圍，不放食物、獎金或私人資料。'});
 m.bag.push('追蹤領袖頁及六張剪卡（A4共2張）','成人裁卡剪刀','六步練習紙訊息（可選）');
})();
