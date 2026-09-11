/* Content presentation: one source of truth for preparation, live cards and print. */
(function(){
  var modalClose=Modal.close,modalOpen=Modal.open;
  Modal.close=function(){document.body.classList.remove('print-pack');modalClose();};
  Modal.open=function(html){document.body.classList.remove('print-pack');modalOpen(html);};
  var prompts={
    c01:['我們玩過的兩個合作遊戲：','我讚賞隊友的一件事／我鼓勵隊友的一句話：','我們的遊戲約定，以及一次解決分歧的方法：'],
    c02:['選一句誓詞，用自己的話說明意思：','一個實踐規律的生活情境，以及我會怎樣做：','本週善事：做法、日期及下次分享時間：'],
    c03:['如果虛構故事中的角色不想被擁抱，可以怎樣表達？','到安全地方後，可以怎樣向成人求助？','如果第一位成人未能幫忙，還可以做甚麼？（不寫私人經歷或聯絡資料）'],
    c04:['我觀察到的兩項不同標誌或裝備：','我問領袖的問題／得到的回答：','畫一項我最想嘗試的童軍活動：'],
    c05:['我看見的三樣事物：①　②　③','我聽見的兩種聲音：①　②','一項安全行為／一項不應做的危險行為／一項愛護公共設施的方法：'],
    c06:['反手結的用途：','平結的合適用途／為甚麼不能用來吊人或承重：','我能獨立做到的結／仍需要提示的一步：'],
    c07:['我的指南針操作次序：','我找到的地標及方向：','我認識的圖例／今天練習的方位程度（四、八或十六）：'],
    c08:['先確保安全：我會避開甚麼危險？','向成人或緊急服務求助，要說清楚哪些資料？','小擦傷護理次序／鼻血時不能做的一件事：'],
    c09:['活動日三樣個人物品及用途：','活動前後點算：有甚麼遺漏？怎樣處理？','一項保護或分類收納個人物品的方法：'],
    c10:['點心盒設計：飲用水＋健康食物（可畫）：','我選擇這食物的原因：','實際準備日期／清潔手部和用具為甚麼重要：'],
    c11:['對方已確認的需要：','我負責的工作／實際完成日期（準備與服務分開）：','做法是否幫到對方？下次可以改善甚麼？'],
    c12:['路線起點、終點及撤離安排：','我會準備的裝備及用途：','天氣變壞或身體不適時，我會怎樣做？'],
    c13:['節慶名稱及一項食物或習俗（可畫）：','我想分享的一個家庭／社區做法或回憶：','慶祝時要注意的一項安全或禮儀：'],
    c14:['童軍起源：人物、時間、地點及活動意義：','五支部名稱／我所屬的支部：','森林故事中的人物，以及接納新朋友的做法：'],
    c15:['我的模型設計和分工：','第一次測試結果／我改了哪一項：','第二次結果／模型與真正紮作有甚麼不同：'],
    c16:['我想到的一項減少浪費的方法：','按實際回收點要求，這物品應怎樣處理？','一週減廢計劃及回顧日期：'],
    c17:['我的預測／保持相同的條件：','測試一：做法與結果／測試二：做法與結果：','我觀察到的變化及下一個想試的問題：'],
    c18:['畫出今天用過的追蹤符號及意思：','追蹤過程中，我在哪裏停下來確認？','找不到下一站時的安全做法：'],
    c19:['已參與、仍練習、領袖已確認的內容（分開寫）：','適用綱要版本／尚欠或待核對的要求：','下一個目標、支援者及回顧日期：'],
    c20:['繩結：我能做哪個結？用途及限制是甚麼？','方向：今天我操作了甚麼？下一步要練甚麼？','求助：我能說清楚的資料／仍需提示的資料：'],
    c21:['今天選擇的安全運動及我留意的身體訊號：','兩次嘗試的變化／我調整了甚麼：','畫一項想繼續嘗試的活動，說明原因：'],
    c22:['我真正進步的一件事及得到的幫助：','我問童軍團代表的問題／答案：','暑期一個安全目標、成人支援及停止條件：'],
    c23:['當日天氣及我的觀察依據：','畫出我的活動日衣着及配件，説明選擇理由：','天氣轉變時的一項後備安排：'],
    c24:['一天日程：起床、上學、活動、休息、睡覺（可畫）：','兩個好習慣及一週後的實踐分享：','一週內三次幫手任務：日期①／做法；日期②／做法；日期③／做法。再寫一項安全或禮貌：'],
    c25:['畫簡化地圖，標示家、學校或旅部、公園（不用真實門牌）：','一條常用路線或交通方式：','一項社區行走的安全或禮貌：']
  };
  DATA.meetings.forEach(function(m){m.worksheet.prompts=prompts[m.tid]||m.worksheet.prompts;});
  function learning(m){return '<section class="card learning-card"><h3>🎯 今場學習重點</h3><p>'+esc(m.goal)+'</p><p class="mut">'+esc(m.badge)+' · '+esc(m.refs.join('／'))+'</p><details><summary>領袖要觀察甚麼？還要跟進甚麼？</summary><h4>觀察與記錄</h4><p>'+esc(m.evidence)+'</p><h4>未涵蓋／後續實踐</h4><p>'+esc(m.gap)+'</p><h4>需要多一點支援</h4><p>'+esc(m.adapt.easy)+'</p><h4>準備好再挑戰</h4><p>'+esc(m.adapt.hard)+'</p><p class="mut">活動完成及出席不等於考獲獎章。沿用的舊出席／完成狀態不作新版內容已達標的證明。</p></details></section>';}
  var prep=App.vPrep,detail=App.vMeetDetail,book=App.vBook;
  App.vPrep=function(){return learning(curMeet())+prep();};
  App.vMeetDetail=function(m){return learning(m)+detail(m);};
  App.vBook=function(){return '<section class="card"><h2>📚 訓練內容基準</h2><p>'+esc(DATA.facts.age)+'</p><p>四個核心範疇：'+esc(DATA.domains.slice(0,4).join('、'))+'。三個興趣範疇：'+esc(DATA.domains.slice(4).join('、'))+'。</p><details><summary>版本及核對範圍</summary><p>'+esc(DATA.source.verified)+'</p>'+extBtn(DATA.source.url,false,'幼童軍訓練綱要 · '+DATA.source.version,'查看正式要求；不是官方集會套包。')+'</details></section>'+book();};
  App.vSheets=function(){return '<section class="card"><h2>✂️ 文字工作紙</h2><p class="mut">先寫、畫或口述記錄；每份有對應問題。插圖稍後補，唔使等圖先用。</p>'+DATA.meetings.map(function(m){return '<details class="sheet-entry"><summary>'+esc(m.n)+'</summary><ul>'+m.worksheet.prompts.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul><button class="btn" onclick="PackPrint.open(\'sheet\',\''+m.tid+'\')">預覽及列印呢張</button></details>';}).join('')+'</section>';};
  App.vPack=function(){var m=curMeet(),n=Store.get('roster',[]).length||1;return '<section class="card"><h2>🖨️ 今場文字教材 · 精簡列印</h2><p>'+esc(m.n)+'</p><p class="mut">適合現場會使用APP的領袖：一頁流程摘要與成員工作紙。需要離開螢幕帶領，可選完整出隊包。未填名單預設印1份。</p><div class="quick"><button class="btn gr" onclick="PackPrint.open(\'all\')">印流程摘要＋分隔頁＋工作紙（'+n+'份）</button><button class="btn" onclick="PackPrint.open(\'leader\')">只印領袖流程</button><button class="btn" onclick="PackPrint.open(\'sheet\')">只印工作紙</button></div></section>'+learning(m)+'<section class="card"><h3>🧺 執袋／設場唔使印</h3><div class="quick"><button class="btn" onclick="Bag.open()">執袋清單</button><button class="btn" onclick="Venue.open()">設場清單</button></div></section>';};
  App.activity=function(tid,i){var m=DATA.meetings.find(function(x){return x.tid===tid;}),s=m.segs[i];Modal.open('<h2>'+esc(s.n)+'</h2><p class="mut">'+s.m+'分鐘 · '+esc(m.n)+'</p><p class="say">📢 '+esc(s.script)+'</p><ol class="lsteps">'+s.steps.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol><p class="safe">⛑️ '+esc(s.safety)+'</p><details><summary>物資、觀察及節奏</summary><p>物資：'+esc(s.mats.join('、')||'無額外物資')+'</p><p>觀察：'+esc(s.watch)+'</p><p>'+esc(s.rhythm)+'</p><p>未涵蓋：'+esc(m.gap)+'</p></details>');};
  PackPrint.open=function(mode,tid){
    var m=tid?DATA.meetings.find(function(x){return x.tid===tid;}):curMeet();if(!m)return;
    var copies=Store.get('roster',[]).length||1, html='';PackPrint.activeTid=m.tid;
    if(mode!=='sheet')html+='<section class="psheet leader-sheet"><h2>'+esc(m.n)+'</h2><p>'+m.mins+'分鐘 · '+esc(m.refs.join('／'))+'</p><p><b>目標：</b>'+esc(m.goal)+'</p><ol>'+m.segs.map(function(s){return '<li><b>'+esc(s.n)+'（'+s.m+'分鐘）</b><br>'+esc(s.script)+'</li>';}).join('')+'</ol><p><b>物資：</b>'+esc(m.bag.join('、'))+'</p><p><b>觀察：</b>'+esc(m.evidence)+'</p><p><b>跟進：</b>'+esc(m.gap)+'</p><p>詳細三步帶法與安全提示請開APP；本頁為領袖流程摘要。</p></section>';
    if(mode==='all')html+='<section class="psheet divider"><h2>✂️ 成員工作紙</h2><p>之後共'+copies+'份，同一份一頁。可寫、可畫、可由成人代記口述。</p><p>按適用要求由領袖觀察，不用工作紙本身當作達標證明。</p></section>';
    if(mode!=='leader')for(var i=0;i<copies;i++){html+='<section class="psheet worksheet"><h2>'+esc(m.worksheet.title)+'</h2><p>姓名：________　小隊：________　日期：________</p>'+m.worksheet.prompts.map(function(p){return '<div class="writing-prompt"><b>'+esc(p)+'</b><div class="writing-space"></div></div>';}).join('')+'<p class="mut">可畫或口述。下次跟進日期：________　領袖觀察另記，不等於獲章。</p></section>';}
    Modal.open('<h3>🖨️ '+esc(m.n)+'</h3><p class="mut">A4直向，預覽後列印；取消列印不會自動標完成。</p><div class="quick"><button class="btn gr" onclick="PackPrint.doit()">列印</button><button class="btn" onclick="PackPrint.confirmDone()">我已印好今場教材</button></div><div id="printarea">'+html+'</div>');
    document.body.classList.add('print-pack');
  };
  PackPrint.doit=function(){window.print();};
  PackPrint.confirmDone=function(){if(PackPrint.activeTid===curTid()){Flow.mark('print');toast('✓ 已記低今場教材印好');}else toast('呢張唔屬於今場，準備進度保持不變');};
  // Skill cards stay grounded in authored steps, not keyword-generated medical/ritual advice.
  var render=Lead.render;
  Lead.render=function(){render();var s=curMeet().segs[Lead.idx],el=document.getElementById('leadstage');if(!s||!el)return;var how=el.querySelector&&el.querySelector('.lhow');if(how)how.innerHTML='<ol class="lsteps">'+s.steps.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol><p class="safe">⛑️ '+esc(s.safety)+'</p><details><summary>領袖觀察／物資／節奏</summary><p>'+esc(s.watch)+'</p><p>'+esc(s.mats.join('、')||'無額外物資')+'</p><p>'+esc(s.rhythm)+'</p></details>';};
})();
