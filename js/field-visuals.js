/* Reviewed reference images and source-grounded, original teaching diagrams. */
var FieldVisuals = {
 refs:[{id:'boy',title:'幼童軍男團員款式',file:'assets/reference/cub-uniform-boy.avif',original:'https://www.scout.org.hk/uploads/member/Cub_B.jpg',alt:'幼童軍男款示例：深綠黃間條鴨舌帽、杏色短袖恤衫、旅巾、草青色短褲、深草青色長襪及黑色繫帶鞋。'}, {id:'girl',title:'幼童軍女團員款式',file:'assets/reference/cub-uniform-girl.avif',original:'https://www.scout.org.hk/uploads/member/Cub_G.jpg',alt:'幼童軍女款示例：深綠色有邊帽、杏色短袖恤衫、旅巾、草青色裙褲、深草青色長襪及黑色繫帶鞋。'}],
 /* 官方圖／真實相片：唔係自繪制服圖。位置圖只用來認位置，縫製尺寸另依手冊及修訂；
    大會操相片係真實場合，唔當幼童軍團集會程序示範。 */
 official:[
  {id:'badgemap',title:'官方徽章佩戴位置圖（2025）',file:'assets/reference/cub-badge-map-2025.avif',
   original:'https://prog.scouting.org.hk/cub/wp-content/uploads/2025/09/Uniform-CUB.jpg',
   page:{url:'https://prog.scouting.org.hk/cub/uniform/',title:'幼童軍天地：制服標誌及徽章佩戴'},
   credit:'香港童軍總會幼童軍天地（2025-09上載）；圖源為《儀容與制服手冊》',
   alt:'官方2025年徽章佩戴位置圖：上方穿制服的正面圖標示宗教章、童軍先修章、進度性獎章、會員章、香港章、服務年星及活動徽章的佩戴位置；下方分開右袖（旅章、地域章與區章）及左袖（幼童軍活動徽章）。',
   limit:'官方圖只定佩戴位置，唔等於車縫尺寸；縫製位置及最新修訂仍以制服手冊、P013-23及適用綱要完整圖為準。',
   use:'位置核對：先睇官方圖認位置，再用實物恤衫核對；唔按螢幕圖直接車縫。'},
  {id:'rally',title:'大會操旗隊（2025真實相片）',file:'assets/reference/rally-flag-party-2025.avif',
   original:'https://gia.info.gov.hk/general/202510/26/P2025102600277_photo_1315827t.jpg',
   page:{url:'https://www.info.gov.hk/gia/general/202510/26/P2025102600277.htm',title:'政府新聞處：香港童軍大會操2025（2025-10-26）'},
   credit:'相片：政府新聞處（香港童軍大會操2025，香港大球場）',
   alt:'真實相片：香港童軍大會操2025的旗隊持旗步操，成員穿整齊制服、戴帽及旅巾，前排成員行敬禮。',
   limit:'相片係童軍支部大會操場合，唔係幼童軍團集會示範；幼童軍展旗、團呼同集會程序跟本APP逐步卡（KT/37/25及2026第五章）。',
   use:'睇真實場合嘅制服整齊度、持旗步操同隊列要求；幼童軍做嘅係簡化程序，唔加升旗步驟。'}
 ],
 officialGet:function(id){return FieldVisuals.official.find(function(x){return x.id===id;});},
 officialFigure:function(id,cls){var o=FieldVisuals.officialGet(id);if(!o)return '';
  return '<figure class="official-figure '+esc(cls||'')+'"><img src="'+o.file+'" alt="'+esc(o.alt)+'" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p class="safe" hidden>官方圖未能載入；未載入就唔好當教材，可重新載入或直接開來源連結。</p><figcaption><b>'+esc(o.title)+'</b><span>'+esc(o.credit)+'</span><small>'+esc(o.use)+'</small><small class="official-limit">'+esc(o.limit)+'</small></figcaption></figure>';},
 officialZoom:function(id){var o=FieldVisuals.officialGet(id);if(!o)return;
  Modal.open('<h2>'+esc(o.title)+'</h2><img class="official-zoom" src="'+o.file+'" alt="'+esc(o.alt)+'"><p class="reference-credit">'+esc(o.credit)+'</p><p class="mut">'+esc(o.limit)+'</p><div class="quick"><button class="btn" onclick="FieldVisuals.officialZoomBack()">返上一頁</button><button class="btn gr" onclick="FieldVisuals.printOfficial()">印官方位置圖（領袖用）</button></div>'+extBtn(o.page.url,false,o.page.title,'官方來源；只作位置及場合參考')+'');handleOffline();},
 officialZoomBack:function(){FieldVisuals.reference();},
 officialPanel:function(heading,lead,ids){var list=(ids||[]).filter(function(id){return !!FieldVisuals.officialGet(id);});
  if(!list.length)return '';
  return '<section class="card official-card"><h2>'+esc(heading)+'</h2><p>'+(lead||'')+'</p>'+list.map(function(id){return FieldVisuals.officialFigure(id);}).join('')+
   '<div class="quick"><button class="btn" onclick="FieldVisuals.officialZoom(\''+list[0]+'\')">放大睇圖</button><button class="btn gr" onclick="FieldVisuals.printOfficial()">印位置圖（領袖用）</button></div>'+
   '<p class="mut">官方圖同真實相片只用嚟核對位置及場合，唔會代替實物核對；本APP唔會自己畫制服。</p></section>';},
 officialSheet:function(){return '<section class="psheet leader-sheet official-sheet"><h2>官方徽章佩戴位置圖（領袖核對用）</h2>'+FieldVisuals.officialFigure('badgemap')+'<p>位置依官方2025年上載圖；車縫尺寸、圖樣及最新修訂依制服手冊、P013-23及適用綱要。實物恤衫核對比分紙重要。</p></section>';},
 printOfficial:function(){Practical.printModal('官方徽章佩戴位置圖',FieldVisuals.officialSheet());},
 source:'https://www.scout.org.hk/tc/youth-members/cub-scouts/index.html?sid=2',
 referenceHTML:function(){return '<div class="uniform-reference-grid">'+FieldVisuals.refs.map(function(r){return '<figure><img src="'+r.file+'" alt="'+esc(r.alt)+'" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p class="safe" hidden>款式圖片未能載入。請勿把空白頁當作教材印好；可重新載入或查看來源。</p><figcaption>'+esc(r.title)+'</figcaption></figure>';}).join('')+'</div><p class="reference-credit">圖片：香港童軍總會幼童軍制服頁；本APP只縮小及壓縮，沒有生成或改畫制服／徽章。圖版只用於款式觀察，不能按比例車縫；旅巾顏色按本旅，精確佩戴方法依制服手冊，徽章位置依其後生效修訂及適用綱要。</p>';},
 referenceSheet:function(){return '<section class="psheet uniform-reference-sheet"><h2>幼童軍制服｜款式觀察</h2>'+FieldVisuals.referenceHTML()+'<p><b>依次找：</b>帽、恤衫、旅巾／巾圈、腰帶、短褲／裙褲、襪、鞋。</p><p><b>再比較：</b>說出兩款帽及下裝的不同；指出兩項相同配件。只觀察，不拉扯同伴衣服。</p><p class="reference-credit">來源：www.scout.org.hk → 青少年成員 → 幼童軍 → 制服。圖片權利屬原提供者。</p></section>';},
 zoom:function(id){var r=FieldVisuals.refs.find(function(x){return x.id===id;});if(!r)return;Modal.open('<h2>'+esc(r.title)+'</h2><img class="uniform-reference-zoom" src="'+r.file+'" alt="'+esc(r.alt)+'"><p class="reference-credit">香港童軍總會款式參考圖；不是新版徽章位置或縫製尺寸指引。圖片權利屬原提供者。</p><button class="btn" onclick="FieldVisuals.reference()">回款式對照</button>');},
 reference:function(){Modal.open('<h2>先看清楚幼童軍款式</h2>'+FieldVisuals.referenceHTML()+'<div class="quick"><button class="btn" onclick="FieldVisuals.zoom(\'boy\')">放大男款圖</button><button class="btn" onclick="FieldVisuals.zoom(\'girl\')">放大女款圖</button><button class="btn gr" onclick="FieldVisuals.printReference()">印款式觀察紙</button><button class="btn" onclick="Uniform.startQuiz()">再做位置配對</button></div>'+extBtn(FieldVisuals.source,false,'官方款式圖來源','穿戴以制服手冊與最新修訂為準'));handleOffline();},
 printReference:function(){Practical.printModal('制服款式觀察紙',FieldVisuals.referenceSheet());},
 formationSVG:function(){var dots='';for(var i=1;i<8;i++){var a=(-90+i*45)*Math.PI/180,x=300+142*Math.cos(a),y=211+142*Math.sin(a);dots+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="16" fill="#e9e3f2" stroke="#675077" stroke-width="2"/>';}
 return '<svg class="formation-map" viewBox="0 0 600 410" role="img" aria-label="團呼隊形示意：亞基拿A在圈內面向旗位，值日小隊長B面向亞基拿，其餘成員按小隊次序圍圈面向圓心。圓點數目不代表規定人數。"><rect width="600" height="410" rx="14" fill="#faf7f0"/><rect x="255" y="7" width="90" height="31" rx="6" fill="#fff" stroke="#555"/><text x="300" y="29" text-anchor="middle" font-size="17">旗的位置</text><circle cx="300" cy="211" r="142" fill="none" stroke="#978a9e" stroke-width="2" stroke-dasharray="6 6"/>'+dots+'<circle cx="300" cy="69" r="24" fill="#604487"/><text x="300" y="77" text-anchor="middle" fill="#fff" font-size="24">B</text><path d="M300 99 V136 M291 125 L300 136 L309 125" stroke="#604487" fill="none" stroke-width="4"/><circle cx="300" cy="211" r="29" fill="#38634d"/><text x="300" y="220" text-anchor="middle" fill="#fff" font-size="27">A</text><path d="M300 174 V145 M291 156 L300 145 L309 156" stroke="#38634d" fill="none" stroke-width="4"/><text x="300" y="274" text-anchor="middle" font-size="17">其餘成員面向圓心</text><text x="300" y="395" text-anchor="middle" font-size="15">A 亞基拿　B 值日小隊長｜圓點數目、距離均為示意</text></svg>';},
 formationText:function(){return '<ol><li>成人先選平坦防滑場地；清走障礙、留出各人活動空間，旗架放在穩固安全位置，保持出入口暢通。</li><li>亞基拿面向旗位；值日小隊長面向亞基拿，其餘成員按各小隊次序圍圈、面向圓心。</li><li>先慢行定位、練轉向，不急於喊口號或做蹲起。成圈後放手，避免拉扯；未宣誓成員需要退後時，先留足後方空間。</li><li>正式口號及先後次序開「團呼逐步卡」。圖不規定人數、半徑、隊色；其他領袖的具體站位由負責領袖依正式程序及場地安排。</li><li>個別成員不能蹲起、轉身或接受聲量刺激時，先安排合適支援；不以站位紙或全隊完成代替個人能力觀察。</li></ol>';},
 formation:function(){Modal.open('<h2>團呼：先定位，再排練</h2>'+FieldVisuals.formationSVG()+FieldVisuals.formationText()+'<p class="mut">依官方2021典禮附錄的相對位置自行繪製；不是正式尺寸圖；文字已核2026綱要第73頁，呼號後立正，不加入比賽躍起。</p><div class="quick"><button class="btn gr" onclick="FieldVisuals.printFormation()">印隊形及角色提示紙</button><button class="btn" onclick="Ceremony.open(\'howl\')">開團呼逐步卡</button></div>'+extBtn(Ceremony.sources.scheme2026.url,false,Ceremony.sources.scheme2026.title,'2026第五章第73頁：團呼'));handleOffline();},
 formationSheets:function(){return '<section class="psheet leader-sheet formation-sheet"><h2>團呼隊形｜領袖定位圖</h2>'+FieldVisuals.formationSVG()+FieldVisuals.formationText()+'<p>依官方2021典禮附錄相對位置繪製；非人數、尺寸或比賽編制規定。文字已核2026第五章；呼號後立正，不加入比賽躍起。</p></section><section class="psheet role-cards"><h2>角色提示紙｜放桌面，不貼在行走路線</h2><div class="role-card-grid">'+[['A','亞基拿','面向旗位；召集、給手號、回禮。'],['B','值日小隊長','面向亞基拿；按程序領呼。'],['','幼童軍','依小隊次序圍圈，面向圓心；成圈後放手。'],['','其他領袖','按正式程序及場地安排站位，照顧安全與需要支援的成員。']].map(function(r){return '<article><h3>'+esc(r[0]+' '+r[1])+'</h3><p>'+esc(r[2])+'</p></article>';}).join('')+'</div><p>提示紙不是地貼、旗幟或正式職級標誌；不放在需要踏步或蹲起的位置。</p></section>';},
 printFormation:function(){Practical.printModal('團呼隊形與角色提示紙',FieldVisuals.formationSheets());},
 sourceNote:function(k){var c=Ceremony.get(k);if(!c)return '';return '<p class="ceremony-source-note"><b>來源範圍：</b>'+esc(c.scope)+'</p>';}
};
(function(){
 var meeting=Practical.meeting('c04');
 DATA.materials.push({n:'制服款式觀察紙（A4）',base:1,per:0,unit:'張',note:'完整出隊包已附1張供共看；多組可另印。實體示範制服仍須另備。'},{n:'團呼定位圖及角色提示紙（A4共2張）',base:1,per:0,unit:'套',note:'完整出隊包已附一套2張；提示只放桌面，不放在行走或蹲起路線。多組可另印。'});
 meeting.bag.push('團呼定位圖及角色提示紙（A4共2張）');
 meeting.segs[1].mats.push('制服款式觀察紙（A4）');
 meeting.bag.push(meeting.segs[1].mats[meeting.segs[1].mats.length-1]);
 meeting.segs[1].steps[0]='先看官方款式觀察紙，比較兩款帽及下裝，再展示旅巾與正確制服樣本，分清穿著者左右；只看、先問才碰。';
 meeting.segs[1].how=meeting.segs[1].steps.map(function(x,i){return (i+1)+'. '+x;}).join(' ');
 var uniformPanel=Uniform.panel,uniformSheets=Uniform.sheets,ceremonyPanel=Ceremony.panel,ceremonyRender=Ceremony.render,ceremonySheets=Ceremony.sheets;
 Uniform.panel=function(){return uniformPanel().replace('</section>','<div class="quick"><button class="btn" onclick="FieldVisuals.reference()">看官方款式圖・印觀察紙</button><button class="btn" onclick="FieldVisuals.officialZoom(\'badgemap\')">官方徽章位置圖（2025）</button></div></section>');};
 Uniform.sheets=function(teacher){return (teacher?FieldVisuals.referenceSheet()+FieldVisuals.officialSheet():'')+uniformSheets(teacher);};
 Ceremony.panel=function(){return ceremonyPanel().replace('</section>','<div class="quick"><button class="btn" onclick="FieldVisuals.formation()">團呼隊形・角色提示紙</button></div></section>');};
 // Keep provenance visible during live use, not only hidden in a collapsed details block.
 Ceremony.render=function(){var c=Ceremony.get(Ceremony.reader.key);if(!c)return;ceremonyRender();var el=document.getElementById('modal');if(el&&el.querySelector){var reader=el.querySelector('.ceremony-reader');if(reader){if(c.id==='howl')reader.insertAdjacentHTML('beforeend','<button class="btn" onclick="FieldVisuals.formation()">先看隊形與角色提示</button>');}}};
 Ceremony.sheets=function(k){return (k==='howl'?FieldVisuals.formationSheets():'')+ceremonySheets(k);};
})();
