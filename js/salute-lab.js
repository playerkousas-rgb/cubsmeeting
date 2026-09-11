/* Illustrated salute lesson: no personal assessment or automatic awards. */
var SaluteLab = {
 image:'assets/teaching/right-hand-salute.jpg',
 reader:{index:0,reveal:false},
 questions:[
  {q:'正式宣誓或覆誓，領袖請大家作宣誓手號。用哪一種禮？手在哪裏？',a:'半禮：用右手三指手號，手在肩膊高度、手指向上。半禮只用於宣誓或覆誓。'},
  {q:'團呼最後，已宣誓成員向亞基拿致敬並回應口號。用哪一種禮？',a:'全禮：立正、右手掌心向前，三指靠攏，食指在右眼對上2厘米。未宣誓成員的退後與立正安排另按團呼卡。'},
  {q:'兩位童軍都願意、亦方便握手打招呼。用哪隻手？',a:'左手握手禮。先確認對方願意及方便，不抓住或強拉對方的手。'},
  {q:'想向另一位童軍表示友善，但對方不方便握手。可以怎樣打招呼？',a:'可用友善目光及微笑致意，不強求接觸或眼神對視。這是友善招呼情境，不是替代所有正式隊列的敬禮程序。'}
 ],
 figure:function(){return '<figure class="salute-hand"><img src="'+SaluteLab.image+'" alt="右手掌心朝前；食指、中指、無名指靠攏向上，拇指壓住彎曲的小指。" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p class="safe" hidden>手形圖未能載入，請重新載入；勿把缺圖頁當成已備妥的圖解。</p><figcaption>右手・掌心向前・三指靠攏</figcaption></figure>';},
 credit:function(){return '<p class="reference-credit">手形插圖為AI輔助生成，已目視檢查五指數目、右手方向、三指及拇指按小指；原依2021典禮附錄製作，文字已核2026綱要第73頁，並非官方照片或認證示範。全禮／半禮的位置仍須由領袖按文字現場示範；圖只示手形，不顯示2厘米距離。</p>';},
 rules:function(){return '<ol><li><b>先認自己的右手：</b>圖是面對你的人伸出右掌，不要照鏡像舉成左手。</li><li><b>三指靠攏：</b>食指、中指、無名指伸直靠攏；小指彎下，拇指輕按小指，掌心向前。不是兩指狼禮。</li><li><b>全禮：</b>先立正；右臂伸直向右平伸至肩高，做三指手號；屈肘，食指在右眼對上2厘米。手指、手腕及前臂成一直線。</li><li><b>半禮：</b>同一手號，手在肩膊高度，手指向上；只用於宣誓及覆誓。</li><li><b>安全與支援：</b>只動自己的手，不扳同伴手指；不強迫拉直、握手或保持疼痛姿勢。按需要口述或指認，另記支援，不冒稱標準動作已完成。</li></ol>';},
 zoom:function(){Modal.open('<h2>右手三指手形｜放大觀察</h2><div class="salute-zoom">'+SaluteLab.figure()+'</div>'+SaluteLab.credit()+'<button class="btn" onclick="SaluteLab.open()">回圖解與情境</button>');},
 open:function(){Modal.open('<h2>三指手號｜看圖、示範、選情境</h2><p>先辨右手和手指，再分清全禮與半禮；圖只示手形，不表示手相對眼睛或肩膊的高度。</p><div class="salute-teaching">'+SaluteLab.figure()+'<div>'+SaluteLab.rules()+'</div></div><details><summary>5分鐘怎樣教／物資</summary><p>共用一張A4圖解、領袖現場示範即可；做紙上練習則每人一張情境紙及鉛筆。1分鐘認右手、2分鐘慢速示範與自查、2分鐘輪流回答情境。不借此額外塞滿c04既有時間，可作另一次短練習。</p></details>'+SaluteLab.credit()+'<div class="quick"><button class="btn gr" onclick="SaluteLab.start()">開始情境配對</button><button class="btn" onclick="SaluteLab.zoom()">放大手形</button><button class="btn" onclick="SaluteLab.print(true)">印領袖圖解與答案</button><button class="btn" onclick="SaluteLab.print(false)">印成員情境紙</button><button class="btn" onclick="Ceremony.open(\'salutes\')">回敬禮逐步卡</button></div>'+extBtn(Ceremony.sources.scheme2026.url,false,'2026綱要：敬禮文字','第73頁；圖不按比例，位置由領袖示範'));handleOffline();},
 start:function(){SaluteLab.reader={index:0,reveal:false};SaluteLab.render();},
 move:function(d){if(!Number.isFinite(d))return;SaluteLab.reader.index=Math.max(0,Math.min(SaluteLab.questions.length-1,SaluteLab.reader.index+Math.trunc(d)));SaluteLab.reader.reveal=false;SaluteLab.render();},
 reveal:function(){SaluteLab.reader.reveal=true;SaluteLab.render();},
 render:function(){var r=SaluteLab.reader,q=SaluteLab.questions[r.index];Modal.open('<section class="salute-question"><p class="eyebrow">敬禮情境 · '+(r.index+1)+' / '+SaluteLab.questions.length+'</p><h2>'+esc(q.q)+'</h2><p>先說出你的選擇和原因，也可以指認。</p>'+(r.reveal?'<div class="field-answer">'+esc(q.a)+'</div>':'<button class="btn gr" onclick="SaluteLab.reveal()">回答後揭答案</button>')+'<div class="quick"><button class="btn" onclick="SaluteLab.move(-1)" '+(r.index===0?'disabled':'')+'>上一情境</button><button class="btn" onclick="SaluteLab.move(1)" '+(r.index===SaluteLab.questions.length-1?'disabled':'')+'>下一情境</button><button class="btn" onclick="SaluteLab.open()">回手形圖解</button></div><p class="mut">只作練習，不儲存個人成績、不自動標記獲章。</p></section>');},
 sheets:function(teacher){if(!teacher)return '<section class="psheet salute-task"><h2>我會選合適的敬禮</h2><p>姓名：________　日期：________</p><p>可口述、指認或寫下選擇：全禮／半禮／左手握手／友善目光及微笑。</p>'+SaluteLab.questions.map(function(q,i){return '<article><h3>'+(i+1)+'. '+esc(q.q)+'</h3><p>我的選擇與原因：________________________________</p><div class="salute-writing"></div></article>';}).join('')+'<p>遇到不舒服或不方便的動作，可以告訴領袖。不要拉扯別人的手指。</p></section>';
 return '<section class="psheet leader-sheet salute-guide"><h2>三指手號｜領袖示範圖解</h2><div class="salute-teaching">'+SaluteLab.figure()+'<div>'+SaluteLab.rules()+'</div></div><h3>帶法及物資</h3><p>共用A4圖解1張；1分鐘認右手、2分鐘示範及自查、2分鐘情境問答。圖只示手形，眼睛／肩膊位置由領袖示範。手指不能舒適完成時安排支援。</p>'+SaluteLab.credit()+'<p class="reference-credit">來源：2026幼童軍訓練綱要，第73頁；prog.scouting.org.hk/cub/。插圖不是官方照片。</p></section><section class="psheet leader-sheet salute-answers"><h2>敬禮情境｜領袖參考答案</h2>'+SaluteLab.questions.map(function(q,i){return '<article><h3>'+(i+1)+'. '+esc(q.q)+'</h3><p>'+esc(q.a)+'</p></article>';}).join('')+'<p>先聽理由，再讓成員按能力嘗試。這份是帶領參考，不是個人考驗表或自動獲章依據。</p></section>';},
 print:function(teacher){Practical.printModal(teacher?'三指手號圖解與答案':'敬禮情境成員紙',SaluteLab.sheets(!!teacher));}
};
(function(){
 var panel=Ceremony.panel,render=Ceremony.render,build=SessionPack.build;
 Ceremony.panel=function(){return panel().replace('精確敬禮示範圖','全身敬禮姿勢示範圖').replace('</section>','<div class="quick"><button class="btn" onclick="SaluteLab.open()">三指手形圖解・敬禮情境</button></div></section>');};
 Ceremony.render=function(){render();if(['salutes','investiture'].includes(Ceremony.reader.key)){var el=document.getElementById('modal');if(el&&el.querySelector){var r=el.querySelector('.ceremony-reader');if(r)r.insertAdjacentHTML('beforeend','<button class="btn" onclick="SaluteLab.open()">看右手三指圖解</button>');}}};
 Ceremony.get('salutes').scope='已核2026綱要第73頁全禮、半禮、握手及一般注目禮。隊列目迎目送另依2024指引。AI手形與自繪位置圖不是官方照片；2厘米位置由領袖示範，不拿尺貼近眼睛。';
 SessionPack.build=function(m,n,children){var html=build(m,n,children);if(!html||!['c02','c04'].includes(m.tid))return html;var extra=SaluteLab.sheets(true),marker='<section class="psheet divider">';html=html.includes(marker)?html.replace(marker,extra+marker):html+extra;return html;};
 // The scenario worksheet is optional: don't silently multiply another handout per child.
 DATA.materials.push({n:'三指手號圖解及敬禮答案（A4共2張）',base:1,per:0,unit:'套',note:'c02／c04完整紙包已附一套領袖用頁。情境成員紙可另按需要列印；不加在既有成員份數內。'});
 ['c02','c04'].forEach(function(tid){Practical.meeting(tid).bag.push('三指手號圖解及敬禮答案（A4共2張）');});
})();
