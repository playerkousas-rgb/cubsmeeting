/* 🎨 SkillArt — 活動／技能逐步示意圖。
   同集會儀式一樣：一張圖講清「點企、點做、小心乜」，文字只補安全與界線。
   媒材按內容選擇：向量示意圖與另繪插畫分開標示；非官方圖樣、不當考驗標準；
   實際動作仍由領袖現場示範。來源界線同 TrackingKit／Ceremony 一致。 */
var SkillArt = {
  credit: '自行繪製示意圖・非官方圖樣・不按比例｜動作以領袖現場示範為準',
  /* ---- 小工具 ---- */
  frame: function (title, inner, h) {
    h = h || 300;
    return '<svg class="skill-art" viewBox="0 0 640 ' + h + '" role="img" aria-label="' + esc(title) + '">' +
      '<rect width="640" height="' + h + '" rx="14" fill="#fbf8f1" stroke="#e4dccd"/>' +
      '<text x="320" y="27" text-anchor="middle" font-size="17" font-weight="700" fill="#4e342e">' + esc(title) + '</text>' +
      inner +
      '<text x="320" y="' + (h - 9) + '" text-anchor="middle" font-size="11" fill="#6d6455">' + esc(SkillArt.credit) + '</text></svg>';
  },
  panel: function (x, y, w, h, no, lines) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="#ffffff" stroke="#d8cfc0"/>';
    if (no) s += '<circle cx="' + (x + 19) + '" cy="' + (y + 19) + '" r="12" fill="#FF6F00"/><text x="' + (x + 19) + '" y="' + (y + 24) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">' + no + '</text>';
    (lines || []).forEach(function (t, i) {
      s += '<text x="' + (x + w / 2) + '" y="' + (y + h - 10 - ((lines.length - 1 - i) * 15)) + '" text-anchor="middle" font-size="13" fill="#4e342e">' + esc(t) + '</text>';
    });
    return s;
  },
  person: function (x, y, color, scale) {
    var k = scale || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + k + ')"><circle cx="0" cy="-26" r="10" fill="' + color + '"/><path d="M0 -16 V14 M0 -8 L-14 2 M0 -8 L14 2 M0 14 L-10 34 M0 14 L10 34" stroke="' + color + '" stroke-width="5" stroke-linecap="round" fill="none"/></g>';
  },
  rope: function (d, color) {
    /* 白底描邊做出「壓住／穿過」嘅視覺 */
    return '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round"/>';
  },
  arrow: function (x1, y1, x2, y2, color) {
    var c = color || '#8d6e63';
    return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + c + '" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>';
  },
  defs: '<defs><marker id="sa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#8d6e63"/></marker></defs>',

  // Both activity cards share TrackingKit's reviewed drawing source, never independent near-miss glyphs.
  trackingGlyph: function (key, x, y, scale) {
    if (typeof TrackingKit === 'undefined') return '';
    var index = TrackingKit.items.findIndex(function(item){return item.key === key;});
    if (index < 0) return '';
    var inner = TrackingKit.svg(index).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return '<g data-tracking-key="'+key+'" transform="translate('+x+','+y+') scale('+scale+')">'+inner+'</g>';
  },
  /* ---- 圖庫：每幅圖都係「三步／三欄」結構，畀領袖照圖講 ---- */
  art: {
    'command-compare': function () {
      var commands = Ceremony.get('commands').steps;
      var diagram = SkillArt.defs +
        '<rect x="25" y="54" width="250" height="239" rx="13" fill="#fff" stroke="#d8cfc0"/>' +
        '<text x="150" y="80" text-anchor="middle" font-size="18" font-weight="700" fill="#38634d">'+esc(commands[3][1])+'</text>' +
        '<rect x="104" y="94" width="92" height="30" rx="9" fill="#38634d"/><text x="150" y="115" text-anchor="middle" font-size="17" fill="#fff">領袖</text>';
      [90,210].forEach(function(x){
        diagram+='<path d="M'+x+' 244 V136" stroke="#b2bdab" stroke-width="2" stroke-dasharray="4 4"/>' +
          '<path d="M'+(x-5)+' 142 L'+x+' 134 L'+(x+5)+' 142" fill="none" stroke="#6f8763" stroke-width="2"/>' +
          '<rect x="'+(x-35)+'" y="151" width="70" height="30" rx="9" fill="#edf1e8" stroke="#79926d"/><text x="'+x+'" y="172" text-anchor="middle" font-size="16" fill="#38634d">隊長</text>' +
          '<circle cx="'+x+'" cy="202" r="11" fill="#eee8da" stroke="#ad9e81"/>' +
          '<rect x="'+(x-35)+'" y="224" width="70" height="30" rx="9" fill="#f8eddb" stroke="#b99b64"/><text x="'+x+'" y="245" text-anchor="middle" font-size="16" fill="#88591c">隊副</text>';
      });
      diagram+='<text x="150" y="279" text-anchor="middle" font-size="11" fill="#6d6455">面向領袖；隊數、人數、距離只作示意</text>' +
        '<rect x="290" y="54" width="325" height="111" rx="13" fill="#f4f5eb" stroke="#d8cfc0"/>' +
        '<text x="452" y="81" text-anchor="middle" font-size="18" font-weight="700" fill="#38634d">'+esc(commands[4][1])+'</text>' +
        '<text x="452" y="116" text-anchor="middle" font-size="17" fill="#4e342e">立正 → 右轉 → 暫時解散</text>' +
        '<text x="452" y="146" text-anchor="middle" font-size="15" fill="#6d6455">仍留在約定活動範圍</text>' +
        '<rect x="290" y="178" width="325" height="115" rx="13" fill="#fcf2e5" stroke="#d8cfc0"/>' +
        '<text x="452" y="205" text-anchor="middle" font-size="18" font-weight="700" fill="#88591c">'+esc(commands[5][1])+'</text>' +
        '<text x="452" y="237" text-anchor="middle" font-size="17" fill="#4e342e">立正 → 右轉 → 敬禮</text>' +
        '<text x="452" y="270" text-anchor="middle" font-size="17" fill="#4e342e">等領袖回禮 → 散會</text>' +
        '<text x="320" y="322" text-anchor="middle" font-size="16" fill="#38634d">Fall In先立正，領袖放下手號後才成At Ease。</text>' +
        '<text x="320" y="348" text-anchor="middle" font-size="14" fill="#88591c">未交接仍由領袖照顧；手號與動作另看六口令卡。</text>';
      return SkillArt.frame('集合與解散：位置、流程分清楚',diagram,378);
    },
    'origin-timeline': function () {
      var history=DATA.fieldDecks.history.cards;
      var diagram=SkillArt.defs+'<path d="M110 127 H530" stroke="#9aab8c" stroke-width="4"/>';
      [[0,'貝登堡出生','英國倫敦'],[2,'白浪島實驗露營','合作與自理'],[3,'《少年警探》出版','不是露營年份']].forEach(function(card,i){
        var x=30+i*200,year=history[card[0]].front.match(/\d{4}/)[0];
        diagram+='<rect x="'+x+'" y="58" width="180" height="205" rx="14" fill="#fff" stroke="#d8cfc0"/>' +
          '<text x="'+(x+90)+'" y="93" text-anchor="middle" font-size="27" font-weight="700" fill="#38634d">'+year+'</text>' +
          '<text x="'+(x+90)+'" y="216" text-anchor="middle" font-size="17" font-weight="700" fill="#4e342e">'+card[1]+'</text>' +
          '<text x="'+(x+90)+'" y="244" text-anchor="middle" font-size="15" fill="#6d6455">'+card[2]+'</text>';
      });
      diagram+='<rect x="90" y="116" width="60" height="64" rx="6" fill="#fcf6e8" stroke="#b49a68" stroke-width="3"/><path d="M90 133 H150 M105 109 V122 M135 109 V122" stroke="#b49a68" stroke-width="3"/><text x="120" y="166" text-anchor="middle" font-size="19" fill="#88591c">22/2</text>' +
        '<path d="M279 179 L320 116 L361 179 Z" fill="#e9d8ad" stroke="#ad915a" stroke-width="3"/><path d="M306 179 L320 148 L334 179 Z" fill="#fff8eb" stroke="#ad915a" stroke-width="2"/>' +
        '<path d="M487 121 Q504 115 520 126 Q536 115 553 121 V179 Q536 173 520 184 Q504 173 487 179 Z M520 126 V184" fill="#edf1e8" stroke="#79926d" stroke-width="3"/>' +
        '<text x="320" y="293" text-anchor="middle" font-size="15" fill="#88591c">核心三卡；其餘年份見短講，時間距離不按比例。</text>';
      return SkillArt.frame('出生、露營、出版：三張核心時間卡',diagram,323);
    },
    'five-sections': function () {
      var diagram=SkillArt.defs+'<rect x="230" y="57" width="180" height="47" rx="12" fill="#38634d"/><text x="320" y="87" text-anchor="middle" font-size="20" fill="#fff">童軍家庭</text>' +
        '<path d="M320 104 V130 M80 130 H560" stroke="#93a385" stroke-width="3" fill="none"/>';
      DATA.fieldDecks.sections.cards.forEach(function(card,i){var x=25+i*120,own=card.front==='幼童軍';
        diagram+='<path d="M'+(x+55)+' 130 V156" stroke="#93a385" stroke-width="3"/>' +
          '<rect x="'+x+'" y="156" width="110" height="69" rx="13" fill="'+(own?'#e1ebd5':'#fff')+'" stroke="'+(own?'#38634d':'#d8cfc0')+'" stroke-width="'+(own?3:1)+'"/>' +
          '<text x="'+(x+55)+'" y="197" text-anchor="middle" font-size="18" font-weight="700" fill="#38634d">'+esc(card.front)+'</text>' +
          (own?'<text x="'+(x+55)+'" y="250" text-anchor="middle" font-size="14" fill="#38634d">我哋嘅支部</text>':'');
      });
      diagram+='<text x="320" y="285" text-anchor="middle" font-size="18" fill="#88591c">年長成員可以怎樣幫年幼成員？</text>' +
        '<text x="320" y="314" text-anchor="middle" font-size="14" fill="#6d6455">這不是年齡表、職級表或自動晉團次序。</text>';
      return SkillArt.frame('五個支部，同屬童軍家庭',diagram,344);
    },
    'good-deed-plan': function () {
      var diagram = SkillArt.defs;
      [['先準備',30],['定一件善事',230],['約下次回顧',430]].forEach(function(card){
        diagram+='<rect x="'+card[1]+'" y="58" width="180" height="181" rx="13" fill="#fff" stroke="#d8cfc0"/>' +
          '<text x="'+(card[1]+90)+'" y="88" text-anchor="middle" font-size="19" font-weight="700" fill="#38634d">'+card[0]+'</text>';
      });
      diagram+='<rect x="76" y="123" width="30" height="63" rx="9" fill="#e6f0ed" stroke="#708e80" stroke-width="3"/><rect x="83" y="112" width="16" height="11" rx="2" fill="#708e80"/>' +
        '<path d="M126 164 Q129 123 165 140 L175 164 Z M118 166 H183" fill="#e9d8ad" stroke="#ad915a" stroke-width="3"/>' +
        '<text x="120" y="217" text-anchor="middle" font-size="15" fill="#6d6455">用品與心情</text>' +
        '<rect x="285" y="112" width="70" height="78" rx="7" fill="#fcf6e8" stroke="#b49a68" stroke-width="3"/><path d="M285 133 H355 M300 106 V119 M340 106 V119 M297 155 H343 M297 176 H343" stroke="#b49a68" stroke-width="3"/>' +
        '<text x="320" y="217" text-anchor="middle" font-size="15" fill="#6d6455">做甚麼？何時做？</text>' +
        '<path d="M477 113 H562 Q574 113 574 126 V166 Q574 178 562 178 H525 L508 193 V178 H477 Q465 178 465 166 V126 Q465 113 477 113 Z" fill="#edf1e8" stroke="#79926d" stroke-width="3"/>' +
        '<path d="M480 137 H558 M480 155 H543" stroke="#b4bda9" stroke-width="3"/>' +
        '<text x="520" y="217" text-anchor="middle" font-size="15" fill="#6d6455">支援與實際情況</text>' +
        '<text x="320" y="270" text-anchor="middle" font-size="15" fill="#88591c">先問同意；計劃唔等於已經做過。</text>';
      return SkillArt.frame('準備一件安全善事',diagram,302);
    },
    'requirements-check': function () {
      var diagram = SkillArt.defs +
        '<rect x="30" y="61" width="232" height="177" rx="13" fill="#fff" stroke="#d8cfc0"/>' +
        '<path d="M62 89 Q93 81 124 93 Q155 81 186 89 V129 Q155 121 124 133 Q93 121 62 129 Z M124 93 V133" fill="#edf1e8" stroke="#6f8763" stroke-width="3"/>' +
        '<text x="52" y="170" font-size="18" fill="#4e342e">適用版本</text><path d="M144 174 H240" stroke="#c7c0b3" stroke-width="2"/>' +
        '<text x="52" y="210" font-size="18" fill="#4e342e">適用級別</text><path d="M144 214 H240" stroke="#c7c0b3" stroke-width="2"/>' + SkillArt.arrow(275,145,310,145);
      [['時間',330,64],['實際活動',477,64],['數量',330,153],['指定徽章',477,153]].forEach(function(card){
        diagram+='<rect x="'+card[1]+'" y="'+card[2]+'" width="132" height="75" rx="10" fill="#f7f3e8" stroke="#d8cfc0"/>' +
          '<text x="'+(card[1]+66)+'" y="'+(card[2]+43)+'" text-anchor="middle" font-size="19" fill="#38634d">'+card[0]+'</text>';
      });
      diagram+='<text x="35" y="269" font-size="17" fill="#88591c">未完成／待核實：</text><path d="M188 273 H605" stroke="#c7c0b3" stroke-width="2"/>' +
        '<text x="320" y="300" text-anchor="middle" font-size="14" fill="#6d6455">依條文逐項查；不是資格審核結果或完成貼紙。</text>';
      return SkillArt.frame('先查條文，再記待跟進',diagram,331);
    },
    'travel-explain': function () {
      var diagram = SkillArt.defs +
        '<rect x="35" y="53" width="570" height="61" rx="12" fill="#fff" stroke="#d8cfc0"/>' +
        '<text x="69" y="89" font-size="19" fill="#38634d">怎樣去？</text>' +
        '<text x="259" y="89" font-size="18" fill="#4e342e">步行</text>' +
        '<rect x="382" y="63" width="35" height="34" rx="6" fill="#e9d8ad" stroke="#ad915a" stroke-width="2"/><rect x="387" y="69" width="25" height="12" rx="2" fill="#fff"/><path d="M387 99 V104 M412 99 V104" stroke="#ad915a" stroke-width="4"/>' +
        '<text x="432" y="89" font-size="18" fill="#4e342e">交通工具</text>' +
        '<path d="M90 170 Q178 139 278 170 T550 170" stroke="#8d9a78" stroke-width="5" fill="none" stroke-dasharray="8 7"/>' +
        '<circle cx="90" cy="170" r="15" fill="#edf1e8" stroke="#6f8763" stroke-width="3"/><circle cx="550" cy="170" r="15" fill="#f4e2bc" stroke="#ad915a" stroke-width="3"/>' +
        '<text x="90" y="211" text-anchor="middle" font-size="20" fill="#38634d">起點</text><text x="550" y="211" text-anchor="middle" font-size="20" fill="#38634d">終點</text>' +
        '<circle cx="320" cy="180" r="24" fill="#fff9ed" stroke="#bf8657" stroke-width="3"/><text x="320" y="189" text-anchor="middle" font-size="27" font-weight="700" fill="#a66b39">?</text>' +
        '<text x="320" y="235" text-anchor="middle" font-size="18" fill="#88591c">要留意的位置：先問同行成人</text>' +
        '<text x="320" y="270" text-anchor="middle" font-size="15" fill="#6d6455">示意線不是道路；不作導航、過路教學或自行試路。</text>';
      return SkillArt.frame('講清路線，唔肯定先問',diagram,303);
    },
    'next-goal': function () {
      var diagram = SkillArt.defs +
        '<rect x="30" y="57" width="200" height="185" rx="14" fill="#fff" stroke="#d8cfc0"/>' +
        '<circle cx="130" cy="126" r="41" fill="#f1f5e9" stroke="#38634d" stroke-width="3"/>' +
        '<circle cx="130" cy="126" r="24" fill="none" stroke="#7b956f" stroke-width="3"/><circle cx="130" cy="126" r="8" fill="#c98a41"/>' +
        '<text x="130" y="202" text-anchor="middle" font-size="20" font-weight="700" fill="#38634d">一個小目標</text>' + SkillArt.arrow(249,145,295,145);
      [['做法',88],['誰支援',148],['回顧日期',208]].forEach(function(row){
        diagram+='<rect x="315" y="'+(row[1]-31)+'" width="295" height="52" rx="10" fill="#fff" stroke="#d8cfc0"/>' +
          '<text x="332" y="'+row[1]+'" font-size="18" fill="#4e342e">'+row[0]+'</text><path d="M420 '+(row[1]+3)+' H586" stroke="#c7c0b3" stroke-width="2"/>';
      });
      return SkillArt.frame('下一小步：同領袖一齊定',diagram+
        '<text x="320" y="272" text-anchor="middle" font-size="15" fill="#88591c">實際內容由你與領袖商量；不是獲章承諾。</text>',305);
    },
    'progress-story': function () {
      var diagram=SkillArt.defs;
      [['起初唔識咩',30],['試過點樣改',230],['我觀察到咩',430]].forEach(function(card,i){
        diagram+='<rect x="'+card[1]+'" y="64" width="180" height="152" rx="13" fill="#fff" stroke="#d8cfc0"/>' +
          '<circle cx="'+(card[1]+90)+'" cy="103" r="20" fill="#eaf0e1"/>' +
          '<text x="'+(card[1]+90)+'" y="110" text-anchor="middle" font-size="20" font-weight="700" fill="#38634d">'+(i+1)+'</text>' +
          '<text x="'+(card[1]+90)+'" y="150" text-anchor="middle" font-size="18" font-weight="700" fill="#4e342e">'+card[0]+'</text>' +
          '<path d="M'+(card[1]+18)+' 184 H'+(card[1]+162)+'" stroke="#c7c0b3" stroke-width="2"/>';
      });
      return SkillArt.frame('講一次真實進步，唔使比獎章',diagram+
        '<text x="320" y="249" text-anchor="middle" font-size="17" fill="#88591c">邊個幫過我？下一步仲想練咩？</text>' +
        '<text x="320" y="277" text-anchor="middle" font-size="14" fill="#6d6455">可用作品或口述；空格不是已完成證據。</text>',305);
    },
    'summer-plan': function () {
      var diagram=SkillArt.defs;
      [['做甚麼',30,'量力小任務'],['誰陪同',230,'先同成人商量'],['何時停',430,'唔安全就停']].forEach(function(card){
        diagram+='<rect x="'+card[1]+'" y="58" width="180" height="163" rx="13" fill="#fff" stroke="#d8cfc0"/>' +
          '<text x="'+(card[1]+90)+'" y="91" text-anchor="middle" font-size="21" font-weight="700" fill="#38634d">'+card[0]+'</text>' +
          '<text x="'+(card[1]+90)+'" y="198" text-anchor="middle" font-size="16" fill="#4e342e">'+card[2]+'</text>';
      });
      diagram+='<rect x="98" y="110" width="44" height="54" rx="5" fill="#fff8e9" stroke="#ac8d58" stroke-width="3"/>' +
        '<path d="M108 124 H132 M108 138 H132 M108 152 H126" stroke="#ac8d58" stroke-width="2"/>' +
        '<circle cx="308" cy="137" r="20" fill="none" stroke="#6c8860" stroke-width="5"/><circle cx="332" cy="137" r="20" fill="none" stroke="#9bb28f" stroke-width="5"/>' +
        '<circle cx="520" cy="137" r="28" fill="#c97657"/><path d="M509 122 V152 M531 122 V152" stroke="#fff" stroke-width="7"/>' +
        '<text x="320" y="258" text-anchor="middle" font-size="16" fill="#88591c">記物資與分享日期，先商量再開始。</text>';
      return SkillArt.frame('暑期小計劃：先諗三件事',diagram,290);
    },
    'tracking-record': function () {
      return SkillArt.frame('我的符號圖表：畫圖，也要講行動', SkillArt.defs +
        '<rect x="30" y="59" width="205" height="160" rx="12" fill="#fff" stroke="#d8cfc0"/>' +
        SkillArt.trackingGlyph('forward',78,79,0.6) +
        '<text x="132" y="197" text-anchor="middle" font-size="16" fill="#4e342e">例子：沿路前進</text>' + SkillArt.arrow(251,139,306,139) +
        '<rect x="325" y="59" width="285" height="160" rx="12" fill="#fff" stroke="#d8cfc0"/>' +
        '<text x="467" y="87" text-anchor="middle" font-size="19" font-weight="700" fill="#38634d">你的圖表</text>' +
        '<path d="M340 126 H595 M340 172 H595 M430 99 V207" stroke="#c7c0b3" stroke-width="2"/>' +
        '<text x="383" y="116" text-anchor="middle" font-size="15" fill="#4e342e">畫符號</text>' +
        '<text x="510" y="116" text-anchor="middle" font-size="15" fill="#4e342e">意思／行動</text>' +
        '<text x="320" y="252" text-anchor="middle" font-size="15" fill="#88591c">只記今天用過的符號；有歧義就請領袖核對。</text>' +
        '<text x="320" y="278" text-anchor="middle" font-size="13" fill="#6d6455">符號沿用追蹤教材自繪資料，非香港官方原圖。</text>',305);
    },
    'compass-practice': function () {
      return SkillArt.frame('自己找北：原地操作，再記下一步', SkillArt.defs +
        '<rect x="50" y="60" width="210" height="186" rx="14" fill="#fff" stroke="#d8cfc0"/>' +
        '<circle cx="155" cy="151" r="61" fill="#f2f6f0" stroke="#38634d" stroke-width="3"/>' +
        '<path d="M155 105 L166 151 L155 151 L144 151 Z" fill="#c44a35"/>' +
        '<path d="M155 197 L144 151 L166 151 Z" fill="#ddd7c9" stroke="#8d8272"/>' +
        '<circle cx="155" cy="151" r="5" fill="#4e342e"/>' +
        '<text x="155" y="82" text-anchor="middle" font-size="19" font-weight="700" fill="#c44a35">N</text>' +
        '<text x="232" y="157" text-anchor="middle" font-size="16" fill="#4e342e">E</text>' +
        '<text x="155" y="235" text-anchor="middle" font-size="16" fill="#4e342e">S</text>' +
        '<text x="78" y="157" text-anchor="middle" font-size="16" fill="#4e342e">W</text>' +
        '<rect x="310" y="60" width="280" height="186" rx="14" fill="#fff" stroke="#d8cfc0"/>' +
        '<text x="450" y="92" text-anchor="middle" font-size="19" font-weight="700" fill="#38634d">我今日練嘅方位</text>' +
        '<text x="450" y="133" text-anchor="middle" font-size="20" fill="#4e342e">四 ／ 八 ／ 十六</text>' +
        '<path d="M337 178 H565 M337 217 H565" stroke="#c7c0b3" stroke-width="2"/>' +
        '<text x="337" y="169" font-size="14" fill="#6d6455">我指出嘅地標：</text>' +
        '<text x="337" y="208" font-size="14" fill="#6d6455">下一步想練：</text>' +
        '<text x="320" y="279" text-anchor="middle" font-size="14" fill="#88591c">俯視示意，唔係即時方向；北端標記以實物為準。</text>',305);
    },
    'weather-backup': function () {
      var image=SkillArt.defs;
      [[30,'突然落雨','先問成人・備雨具'],[230,'變冷','加衣・告知成人'],[430,'熱到唔舒服','停低・找成人・休息']].forEach(function(c){
        image+='<rect x="'+c[0]+'" y="56" width="180" height="161" rx="12" fill="#fff" stroke="#d8cfc0"/>' +
          '<text x="'+(c[0]+90)+'" y="161" text-anchor="middle" font-size="18" font-weight="700" fill="#4e342e">'+c[1]+'</text>' +
          '<text x="'+(c[0]+90)+'" y="193" text-anchor="middle" font-size="14" fill="#6d6455">'+c[2]+'</text>';
      });
      image+='<path d="M90 110 C70 110 77 84 94 90 C98 65 134 68 139 89 C161 83 169 110 150 110 Z" fill="#dce8ec" stroke="#688999" stroke-width="3"/>' +
        '<path d="M100 117 l-4 10 M120 117 l-4 10 M140 117 l-4 10" stroke="#688999" stroke-width="3"/>' +
        '<path d="M320 76 V128 M295 89 L345 115 M295 115 L345 89" stroke="#7b9dad" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="520" cy="102" r="23" fill="#e8ba67" stroke="#bb752b" stroke-width="3"/>' +
        '<path d="M520 67 V60 M520 137 V144 M485 102 H478 M555 102 H562 M495 77 L490 72 M545 77 L550 72 M495 127 L490 132 M545 127 L550 132" stroke="#bb752b" stroke-width="3"/>' +
        '<text x="320" y="257" text-anchor="middle" font-size="15" fill="#88591c">雷暴／高溫風險：由領袖決定停止、改期或撤離。</text>';
      return SkillArt.frame('天氣變，計劃都可以變',image,290);
    },
    'model-review': function () {
      var model = function(x,w){
        return '<path d="M'+(x-w/2)+' 188 H'+(x+w/2)+' M'+(x-36)+' 185 V112 H'+(x+36)+' V185" fill="none" stroke="#bda27e" stroke-width="9" stroke-linecap="round"/>' +
          '<path d="M'+x+' 112 V82" stroke="#8d6e63" stroke-width="3"/>' +
          '<path d="M'+x+' 82 l24 7 l-24 7 z" fill="#d38647"/>' +
          '<rect x="'+(x-44)+'" y="177" width="16" height="16" rx="3" fill="#eddfb9"/><rect x="'+(x+28)+'" y="177" width="16" height="16" rx="3" fill="#eddfb9"/>';
      };
      return SkillArt.frame('只改一處，用同一紙旗再試', SkillArt.defs +
        '<rect x="30" y="49" width="260" height="184" rx="14" fill="#fff" stroke="#d8cfc0"/>' +
        '<rect x="350" y="49" width="260" height="184" rx="14" fill="#fff" stroke="#d8cfc0"/>' +
        '<text x="160" y="73" text-anchor="middle" font-size="19" font-weight="700" fill="#4e342e">改前</text>' +
        '<text x="480" y="73" text-anchor="middle" font-size="19" font-weight="700" fill="#4e342e">例子：只加闊底座</text>' +
        model(160,100) + model(480,164) + SkillArt.arrow(303,145,336,145) +
        '<text x="160" y="218" text-anchor="middle" font-size="14" fill="#6d6455">同一高度・同一紙旗</text>' +
        '<text x="480" y="218" text-anchor="middle" font-size="14" fill="#6d6455">記下自己觀察到嘅結果</text>' +
        '<text x="320" y="267" text-anchor="middle" font-size="16" fill="#88591c">只示意一項改法；穩唔穩，要實際再試。</text>',305);
    },
    'bridge-predict': function () {
      var folds='';
      for(var j=0;j<6;j++){
        var x=414+j*18, y=110+(j%2)*12, ny=110+((j+1)%2)*12;
        folds+='<path d="M'+x+' '+y+' L'+(x+18)+' '+ny+' L'+(x+38)+' '+(ny+49)+' L'+(x+20)+' '+(y+49)+' Z" fill="'+(j%2?'#dfd4bf':'#fffdf5')+'" stroke="#9c8d72" stroke-width="2"/>';
      }
      return SkillArt.frame('先估再做：平紙定摺紙較穩？', SkillArt.defs +
        '<rect x="30" y="54" width="250" height="153" rx="14" fill="#fff" stroke="#d8cfc0"/>' +
        '<rect x="360" y="54" width="250" height="153" rx="14" fill="#fff" stroke="#d8cfc0"/>' +
        '<text x="155" y="83" text-anchor="middle" font-size="21" font-weight="700" fill="#38634d">平紙</text>' +
        '<text x="485" y="83" text-anchor="middle" font-size="21" font-weight="700" fill="#38634d">摺紙</text>' +
        '<path d="M85 117 H210 L230 168 H105 Z" fill="#fffdf5" stroke="#9c8d72" stroke-width="2"/>' + folds +
        '<text x="320" y="149" text-anchor="middle" font-size="38" font-weight="700" fill="#bb752b">？</text>' +
        '<text x="320" y="235" text-anchor="middle" font-size="17" font-weight="700" fill="#4e342e">紙張・跨度・紙杯・放杯位置：保持一樣</text>' +
        '<text x="320" y="265" text-anchor="middle" font-size="15" fill="#88591c">紙形示意，唔係測試結果；之後只用輕紙杯試。</text>',305);
    },
    'needs-first': function () {
      return SkillArt.frame('先問需要，再選任務', SkillArt.defs +
        '<rect x="30" y="59" width="220" height="144" rx="14" fill="#fff3e0" stroke="#dfbd8c"/>' +
        '<rect x="390" y="59" width="220" height="144" rx="14" fill="#edf4e9" stroke="#9db493"/>' +
        '<text x="140" y="91" text-anchor="middle" font-size="21" font-weight="700" fill="#88591c">我想送</text>' +
        '<text x="500" y="91" text-anchor="middle" font-size="21" font-weight="700" fill="#38634d">對方確認需要</text>' +
        '<rect x="113" y="120" width="54" height="39" rx="4" fill="#ecd1a5" stroke="#88591c" stroke-width="3"/>' +
        '<path d="M109 119 H171 M140 121 V159" fill="none" stroke="#88591c" stroke-width="3"/>' +
        '<rect x="471" y="107" width="58" height="59" rx="5" fill="#fff" stroke="#38634d" stroke-width="2"/>' +
        '<path d="M482 118 L486 122 L493 113 M482 135 L486 139 L493 130 M482 152 L486 156 L493 147 M501 119 H519 M501 136 H519 M501 153 H519" fill="none" stroke="#38634d" stroke-width="2"/>' +
        '<text x="320" y="119" text-anchor="middle" font-size="17" fill="#6d6455">先問清楚</text>' + SkillArt.arrow(269,144,371,144) +
        '<text x="140" y="185" text-anchor="middle" font-size="14" fill="#88591c">唔只係清走唔要嘅嘢</text>' +
        '<text x="500" y="185" text-anchor="middle" font-size="14" fill="#38634d">成人先聯絡確認</text>' +
        '<rect x="30" y="221" width="280" height="52" rx="12" fill="#e7efdf"/>' +
        '<rect x="330" y="221" width="280" height="52" rx="12" fill="#fff0d9"/>' +
        '<text x="170" y="253" text-anchor="middle" font-size="18" fill="#38634d">有確認：揀安全任務</text>' +
        '<text x="470" y="253" text-anchor="middle" font-size="18" fill="#88591c">未有單位：團內關懷</text>', 305);
    },
    'route-plan': function () {
      var nodes = [[78,124,'1','集合起點'],[238,101,'2','休息點'],[398,139,'3','廁所'],[558,111,'4','終點']];
      var diagram = SkillArt.defs +
        '<text x="320" y="53" text-anchor="middle" font-size="14" fill="#6d6455">位置關係示例・次序及安排按成人踏查的實際地圖</text>' +
        '<path d="M78 124 Q158 69 238 101 T398 139 T558 111" fill="none" stroke="#6d8867" stroke-width="5" stroke-dasharray="9 6"/>' +
        '<path d="M216 101 H185 V217 H300" fill="none" stroke="#bb752b" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#sa-arrow)"/>';
      nodes.forEach(function(n){
        diagram += '<circle cx="'+n[0]+'" cy="'+n[1]+'" r="22" fill="#38634d"/>' +
          '<text x="'+n[0]+'" y="'+(n[1]+7)+'" text-anchor="middle" font-size="21" font-weight="700" fill="#fff">'+n[2]+'</text>' +
          '<text x="'+n[0]+'" y="'+(n[1]+46)+'" text-anchor="middle" font-size="18" font-weight="700" fill="#4e342e">'+n[3]+'</text>';
      });
      diagram += '<circle cx="330" cy="217" r="22" fill="#bb752b"/>' +
        '<text x="330" y="224" text-anchor="middle" font-size="21" font-weight="700" fill="#fff">5</text>' +
        '<text x="368" y="215" font-size="18" font-weight="700" fill="#704615">撤離／接應點</text>' +
        '<text x="368" y="237" font-size="13" fill="#704615">按領袖已確認安排</text>' +
        '<text x="320" y="276" text-anchor="middle" font-size="14" fill="#9c3f21">教學示例，不按比例；不可作導航或自行試路。</text>';
      return SkillArt.frame('路線規劃：先找五個位置', diagram, 305);
    },
    'circle-paper': function () {
      var dots = '';
      for (var i = 0; i < 6; i++) {
        var a = Math.PI * 2 * i / 6 - Math.PI / 2;
        dots += '<circle cx="' + Math.round(320 + 105 * Math.cos(a)) + '" cy="' + Math.round(150 + 78 * Math.sin(a)) + '" r="11" fill="#1565C0"/>';
      }
      return SkillArt.frame('一張紙，全隊到位', SkillArt.defs +
        '<rect x="255" y="112" width="130" height="76" rx="6" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>' +
        '<text x="320" y="155" text-anchor="middle" font-size="14" fill="#8d6e63">大紙（基地）</text>' + dots +
        '<path d="M292 96 C310 82 330 82 348 96" stroke="#2E7D32" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        '<text x="320" y="76" text-anchor="middle" font-size="13" fill="#2E7D32">企喺紙外圍，唔使企上紙</text>' +
        SkillArt.panel(30, 214, 180, 62, 1, ['每人輪流畫一個', '隊員符號']) +
        SkillArt.panel(230, 214, 180, 62, 2, ['全隊商量', '用線連成一幅圖']) +
        SkillArt.panel(430, 214, 180, 62, 3, ['有人想改位？', '先聽原因再諗兩法']));
    },
    'cup-tower': function () {
      var cup = function (x, y) { return '<path d="M' + x + ' ' + y + ' h34 l-5 22 h-24 z" fill="#ffe0b2" stroke="#e65100" stroke-width="2"/>'; };
      return SkillArt.frame('輪流起杯塔', SkillArt.defs +
        cup(300, 168) + cup(340, 168) + cup(320, 144) + cup(330, 120) +
        '<path d="M250 96 C270 84 292 92 306 108" stroke="#1565C0" stroke-width="4" fill="none" marker-end="url(#sa-arrow)"/>' +
        SkillArt.person(232, 120, '#1565C0') +
        '<text x="238" y="76" text-anchor="middle" font-size="13" fill="#1565C0">一次只得一人放一隻</text>' +
        SkillArt.person(452, 130, '#2E7D32') + SkillArt.person(492, 150, '#6A1B9A') + SkillArt.person(530, 170, '#C62828') +
        '<text x="492" y="92" text-anchor="middle" font-size="13" fill="#4e342e">其餘排隊等：可以出聲鼓勵，唔代人放</text>' +
        SkillArt.panel(30, 214, 180, 62, 1, ['每隊六隻杯', '約定一人放一隻']) +
        SkillArt.panel(230, 214, 180, 62, 2, ['倒咗就停一停', '講句鼓勵再試']) +
        SkillArt.panel(430, 214, 180, 62, 3, ['完成後每人讚', '一位隊友嘅幫助']));
    },
    'boundary': function () {
      return SkillArt.frame('我的界線由我表達', SkillArt.defs +
        SkillArt.panel(30, 52, 180, 100, 1, []) +
        '<path d="M120 92 v-18 M120 92 l-14 22 M120 92 l14 22 M106 74 h28" stroke="#C62828" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<text x="120" y="140" text-anchor="middle" font-size="14" fill="#C62828">講「停」＋手勢</text>' +
        SkillArt.panel(230, 52, 180, 100, 2, []) +
        SkillArt.person(300, 100, '#1565C0') + '<path d="M322 108 h44" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        '<rect x="372" y="86" width="26" height="46" rx="6" fill="#e8f5e9" stroke="#2E7D32" stroke-width="2"/>' +
        '<text x="320" y="140" text-anchor="middle" font-size="14" fill="#2E7D32">退開去安全位</text>' +
        SkillArt.panel(430, 52, 180, 100, 3, []) +
        SkillArt.person(492, 104, '#6A1B9A', 0.8) + SkillArt.person(540, 100, '#4e342e') +
        '<text x="520" y="140" text-anchor="middle" font-size="14" fill="#4e342e">搵肯聽你講嘅大人</text>' +
        '<text x="320" y="182" text-anchor="middle" font-size="13" fill="#6d6455">唔想就可以講停；講唔出口或者冇走得開，都唔係你嘅錯。</text>' +
        SkillArt.panel(30, 200, 580, 58, '', ['練習約定：唔分享私人經歷、唔碰人嚟示範；照顧或醫療接觸要有解釋、合適陪同同私隱。']));
    },
    'help-steps': function () {
      return SkillArt.frame('求助三步：停・離開・講', SkillArt.defs +
        SkillArt.panel(30, 52, 180, 96, 1, ['停手、保持距離', '唔硬碰、唔保密']) +
        SkillArt.panel(230, 52, 180, 96, 2, ['去人多／光線好', '嘅安全地方']) +
        SkillArt.panel(430, 52, 180, 96, 3, ['搵大人講清楚', '幫唔到再搵第二位']) +
        SkillArt.person(120, 89, '#C62828', 0.6) + SkillArt.person(320, 89, '#2E7D32', 0.6) +
        SkillArt.person(500, 92, '#6A1B9A', 0.55) + SkillArt.person(545, 88, '#4e342e', 0.65) +
        '<path d="M150 108 h60" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        '<path d="M350 108 h60" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        SkillArt.panel(30, 176, 580, 82, '', ['第一位大人幫唔到？再搵另一位可信任成人。', '即時有危險：先保安全，交成人或緊急服務處理。', '領袖唔承諾絕對保密；有人披露就安靜聽、記原話、按保障兒童程序處理。']));
    },
    'senses': function () {
      return SkillArt.frame('看三樣、聽兩種', SkillArt.defs +
        '<circle cx="120" cy="100" r="34" fill="#fff" stroke="#1565C0" stroke-width="4"/>' +
        '<path d="M92 100 C106 82 134 82 148 100 C134 118 106 118 92 100 z" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/>' +
        '<circle cx="120" cy="100" r="9" fill="#1565C0"/>' +
        '<text x="120" y="152" text-anchor="middle" font-size="14">見到：① ② ③</text>' +
        '<path d="M300 78 c26 0 26 44 0 44 c-8 0 -8 -14 0 -14 c10 0 10 -16 0 -16 z" fill="#fff" stroke="#6A1B9A" stroke-width="4"/>' +
        '<path d="M318 122 v10 h14" stroke="#6A1B9A" stroke-width="4" fill="none"/>' +
        '<text x="312" y="152" text-anchor="middle" font-size="14">聽到：① ②</text>' +
        SkillArt.person(470, 104, '#2E7D32', 0.9) +
        '<rect x="500" y="76" width="110" height="52" rx="8" fill="#e8f5e9" stroke="#2E7D32" stroke-width="2"/>' +
        '<text x="555" y="98" text-anchor="middle" font-size="12">一項應做＋</text><text x="555" y="116" text-anchor="middle" font-size="12">一項唔應做</text>' +
        SkillArt.panel(30, 176, 580, 82, '', ['喺成人選好嘅安全區觀察；唔摸、唔摘、唔試味。', '停定聽：分辨自然聲定人為聲。', '離開前收好物品同垃圾，點名後返交接點。']));
    },
    'overhand': function () {
      return SkillArt.frame('反手結（止端結）三步', SkillArt.defs +
        SkillArt.panel(30, 50, 180, 120, 1, ['繩端繞一圈']) +
        SkillArt.rope('M60 130 C60 84 150 84 150 122 C150 148 96 150 92 126', '#E65100') +
        SkillArt.panel(230, 50, 180, 120, 2, ['繩端穿入圈']) +
        SkillArt.rope('M260 130 C260 84 350 84 350 122 C350 150 300 152 296 128 L318 104', '#E65100') +
        SkillArt.panel(430, 50, 180, 120, 3, ['慢慢拉緊']) +
        SkillArt.rope('M470 128 C486 96 540 96 552 122 C560 140 528 150 516 132 C508 120 528 112 540 118', '#E65100') +
        '<text x="520" y="86" text-anchor="middle" font-size="12" fill="#2E7D32">成結：繩端唔再散開</text>' +
        SkillArt.panel(30, 190, 580, 68, '', ['用途：簡單止端，避免繩端穿過合適開口。', '限制：唔用嚟攀爬、吊人、提水樽或承重。']));
    },
    'reef': function () {
      return SkillArt.frame('平結三步：右搭左・左搭右', SkillArt.defs +
        SkillArt.panel(30, 50, 180, 120, 1, ['右繩搭左繩', '穿過壓實']) +
        SkillArt.rope('M52 118 C90 96 150 96 190 118', '#C62828') +
        SkillArt.rope('M52 100 C90 128 150 128 190 100', '#F9A825') +
        SkillArt.panel(230, 50, 180, 120, 2, ['方向相反：', '左繩搭右繩穿過']) +
        SkillArt.rope('M252 100 C290 128 350 128 390 100', '#C62828') +
        SkillArt.rope('M252 118 C290 92 350 92 390 118', '#F9A825') +
        SkillArt.panel(430, 50, 180, 120, 3, ['兩端拉緊', '檢查對稱']) +
        SkillArt.rope('M452 112 C480 92 508 92 520 108 C532 92 560 92 588 112', '#C62828') +
        SkillArt.rope('M452 122 C480 140 508 140 520 124 C532 140 560 140 588 122', '#F9A825') +
        '<text x="520" y="80" text-anchor="middle" font-size="12" fill="#2E7D32">對稱＝啱；歪斜＝拆開再試</text>' +
        SkillArt.panel(30, 190, 580, 68, '', ['用途：綁合適嘅輕紙包、輕物綁紮。', '限制：唔用嚟攀爬、吊人、提水樽；唔係安全承重結。']));
    },
    'knot-choose': function () {
      return SkillArt.frame('選結・解結・收繩', SkillArt.defs +
        SkillArt.panel(30, 50, 280, 118, '', ['任務A：繩端想有個止端', '→ 反手結']) +
        SkillArt.rope('M70 120 C70 88 140 88 140 116 C140 136 100 138 96 118', '#E65100') +
        SkillArt.panel(330, 50, 280, 118, '', ['任務B：輕紙包想綁好', '→ 平結']) +
        SkillArt.rope('M370 112 C400 92 430 92 442 108 C454 92 484 92 514 112', '#C62828') +
        SkillArt.rope('M370 122 C400 140 430 140 442 124 C454 140 484 140 514 122', '#F9A825') +
        '<rect x="520" y="96" width="60" height="44" rx="6" fill="#fff8e1" stroke="#f9a825" stroke-width="2"/>' +
        SkillArt.panel(30, 188, 580, 70, '', ['先講用途，再揀結；自己打，隊友講觀察，領袖最後確認。', '慢慢解結、鬆散收好、點數；記低邊個結要再練。', '唔比最快；繩唔纏身體、唔甩向人。']));
    },
    'compass': function () {
      return SkillArt.frame('指南針：放平・等針停・對北', SkillArt.defs +
        '<rect x="60" y="66" width="150" height="110" rx="10" fill="#fff" stroke="#8d6e63" stroke-width="3"/>' +
        '<circle cx="135" cy="121" r="40" fill="#f3f7ff" stroke="#1565C0" stroke-width="4"/>' +
        '<path d="M135 89 L143 121 L135 153 L127 121 z" fill="#C62828"/>' +
        '<path d="M135 153 L127 121 L135 89" fill="none" stroke="#C62828" stroke-width="1"/>' +
        '<path d="M135 121 L135 153" stroke="#fff" stroke-width="5"/>' +
        '<text x="135" y="82" text-anchor="middle" font-size="13" fill="#1565C0">N 標記</text>' +
        '<text x="135" y="196" text-anchor="middle" font-size="13">遠離金屬・放平</text>' +
        SkillArt.panel(240, 66, 170, 110, 1, ['放平、等針停', '認北端標記']) +
        SkillArt.panel(430, 66, 180, 110, 2, ['轉身體／轉盤', '令N對正紅針']) +
        SkillArt.person(320, 230, '#2E7D32', 0.8) +
        '<path d="M352 214 L420 200" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        '<rect x="430" y="188" width="120" height="40" rx="8" fill="#e8f5e9" stroke="#2E7D32" stroke-width="2"/>' +
        '<text x="490" y="213" text-anchor="middle" font-size="13">對照場地地標</text>' +
        '<text x="320" y="262" text-anchor="middle" font-size="13" fill="#6d6455">地圖上方未必係北：要看北箭嘴。唔好邊行邊盯儀器。</text>');
    },
    'map-legend': function () {
      return SkillArt.frame('地圖：北箭嘴・比例・圖例', SkillArt.defs +
        '<rect x="40" y="56" width="250" height="150" rx="8" fill="#eef6ec" stroke="#38634d" stroke-width="3"/>' +
        '<path d="M70 80 L70 190 M70 120 L200 120 M140 120 L140 190" stroke="#8aa88f" stroke-width="5" fill="none"/>' +
        '<path d="M252 70 L262 96 L242 96 z" fill="#C62828"/><text x="252" y="112" text-anchor="middle" font-size="12">北箭嘴</text>' +
        '<rect x="60" y="176" width="60" height="10" fill="#4e342e"/><text x="130" y="186" font-size="11">比例</text>' +
        SkillArt.panel(310, 56, 300, 44, 1, ['先找北箭嘴同比例']) +
        SkillArt.panel(310, 108, 300, 44, 2, ['找五個指定圖例，講意思']) +
        SkillArt.panel(310, 160, 300, 46, 3, ['同附近真實設施配對']) +
        '<rect x="52" y="86" width="20" height="20" rx="4" fill="#1565C0"/><text x="80" y="101" font-size="12">廁所</text>' +
        '<rect x="52" y="116" width="20" height="20" rx="4" fill="#E65100"/><text x="80" y="131" font-size="12">營地</text>' +
        '<rect x="52" y="146" width="20" height="20" rx="4" fill="#0277BD"/><text x="80" y="161" font-size="12">水</text>' +
        '<text x="320" y="238" text-anchor="middle" font-size="13" fill="#6d6455">圖上符號唔係物件實際大小；用公開地標，唔記住址門牌。</text>');
    },
    'eight-dir': function () {
      var pts = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
      var s = SkillArt.defs + '<circle cx="320" cy="140" r="16" fill="#FF6F00"/>' + SkillArt.person(320, 152, '#4e342e', 0.7);
      pts.forEach(function (p, i) {
        var a = Math.PI * 2 * i / 8 - Math.PI / 2;
        var x = Math.round(320 + 96 * Math.cos(a)), y = Math.round(140 + 76 * Math.sin(a));
        s += '<path d="M320 140 L' + x + ' ' + y + '" stroke="#c9bfae" stroke-width="2"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="15" fill="#fff" stroke="#8d6e63" stroke-width="2"/>' +
          '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-size="12">' + p + '</text>';
      });
      s += '<text x="320" y="252" text-anchor="middle" font-size="13" fill="#4e342e">成人先核實場內八個方位；每人指一個地標方向，再交換。</text>' +
        '<text x="320" y="272" text-anchor="middle" font-size="13" fill="#6d6455">熟練先加十六方位；其餘重練四或八方位，分開記。</text>';
      return SkillArt.frame('八方向找地標', s, 292);
    },
    'help-call': function () {
      return SkillArt.frame('現場安全與求助：停・叫大人・講三樣', SkillArt.defs +
        SkillArt.panel(30, 52, 180, 104, 1, ['停：唔衝入去', '保持距離']) +
        '<path d="M120 92 v-16 M120 92 l-13 20 M120 92 l13 20 M107 76 h26" stroke="#C62828" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        SkillArt.panel(230, 52, 180, 104, 2, ['叫大人／', '場地領袖']) +
        SkillArt.person(300, 92, '#4e342e', 0.6) + SkillArt.person(345, 88, '#2E7D32', 0.65) +
        SkillArt.panel(430, 52, 180, 104, 3, ['用道具電話講：', '位置・事故・傷者']) +
        '<rect x="492" y="76" width="34" height="58" rx="7" fill="#fff" stroke="#6A1B9A" stroke-width="3"/>' +
        '<circle cx="509" cy="124" r="4" fill="#6A1B9A"/>' +
        '<text x="545" y="88" font-size="12">① 你喺邊</text><text x="545" y="106" font-size="12">② 發生咩事</text><text x="545" y="124" font-size="12">③ 傷者情況</text>' +
        SkillArt.panel(30, 176, 580, 82, '', ['有車、電線等危險：先退到安全處，唔自行搬動傷者。', '只用不能撥號嘅道具電話演練；聽從接線員指示。', '真實緊急情況：立即由成人求助或打999。']));
    },
    'wound': function () {
      return SkillArt.frame('小擦傷：潔手・按壓・沖洗・覆蓋', SkillArt.defs +
        SkillArt.panel(30, 52, 138, 108, 1, ['潔手', '唔碰血液']) +
        SkillArt.panel(182, 52, 138, 108, 2, ['有出血：', '乾淨敷料按壓']) +
        SkillArt.panel(334, 52, 138, 108, 3, ['止血後清水', '模擬沖洗印乾']) +
        SkillArt.panel(486, 52, 124, 108, 4, ['乾淨敷料', '覆蓋']) +
        '<circle cx="99" cy="102" r="16" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/>' +
        '<rect x="232" y="88" width="38" height="30" rx="5" fill="#fff" stroke="#C62828" stroke-width="3"/>' +
        '<path d="M403 92 v22 M392 103 h22" stroke="#0277BD" stroke-width="4"/>' +
        '<rect x="528" y="88" width="38" height="30" rx="5" fill="#f1f8e9" stroke="#2E7D32" stroke-width="3"/>' +
        SkillArt.panel(30, 178, 580, 80, '', ['只在模型練習；一人練一次。', '持續出血、深傷口或有異物：交成人及醫護，唔拔異物。', '熟悉急救嘅領袖先示範；唔用可撥號電話演練。']));
    },
    'nosebleed': function () {
      return SkillArt.frame('流鼻血：坐低・向前・捏鼻翼', SkillArt.defs +
        '<rect x="70" y="150" width="120" height="14" rx="4" fill="#8d6e63"/>' +
        '<path d="M110 150 V110 q0 -18 18 -18 h14" stroke="#4e342e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<circle cx="150" cy="86" r="13" fill="#4e342e"/>' +
        '<path d="M150 99 q10 8 6 18" stroke="#4e342e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<circle cx="162" cy="94" r="6" fill="#C62828"/>' +
        '<text x="130" y="190" text-anchor="middle" font-size="13">坐低、身體稍向前</text>' +
        '<circle cx="330" cy="110" r="34" fill="#fff" stroke="#6A1B9A" stroke-width="4"/>' +
        '<path d="M330 92 v18 M321 101 h18" stroke="#6A1B9A" stroke-width="4"/>' +
        '<text x="330" y="164" text-anchor="middle" font-size="13">捏鼻翼柔軟位</text>' +
        '<text x="330" y="184" text-anchor="middle" font-size="13">10–15分鐘・用口呼吸</text>' +
        '<g transform="translate(470,70)"><circle cx="40" cy="40" r="34" fill="#fff5f4" stroke="#C62828" stroke-width="4"/>' +
        '<path d="M22 22 L58 58 M58 22 L22 58" stroke="#C62828" stroke-width="5"/>' +
        '<text x="40" y="98" text-anchor="middle" font-size="13" fill="#C62828">唔昂頭・唔躺低</text></g>' +
        SkillArt.panel(30, 208, 580, 56, '', ['按壓10–15分鐘仍唔停、出血多、頭傷、暈或呼吸困難：成人立即安排急症；緊急時打999。']));
    },
    'backpack': function () {
      return SkillArt.frame('執背包：常用易拎・重物靠背', SkillArt.defs +
        '<path d="M250 70 h140 q26 0 26 26 v110 q0 26 -26 26 h-140 q-26 0 -26 -26 v-110 q0 -26 26 -26 z" fill="#dce6da" stroke="#38634d" stroke-width="4"/>' +
        '<path d="M270 70 q50 -26 100 0" fill="none" stroke="#38634d" stroke-width="5"/>' +
        '<rect x="262" y="92" width="116" height="40" rx="8" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>' +
        '<text x="320" y="117" text-anchor="middle" font-size="13">上格：水・手巾・常用</text>' +
        '<rect x="262" y="142" width="116" height="46" rx="8" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/>' +
        '<text x="320" y="170" text-anchor="middle" font-size="13">中間貼背：重物</text>' +
        '<rect x="262" y="196" width="116" height="26" rx="8" fill="#f3e5f5" stroke="#6A1B9A" stroke-width="3"/>' +
        '<text x="320" y="214" text-anchor="middle" font-size="12">底格：後備衣物</text>' +
        SkillArt.panel(440, 70, 170, 74, 1, ['一人揀三件', '講用途']) +
        SkillArt.panel(440, 152, 170, 74, 2, ['自己執：', '重物靠背']) +
        SkillArt.panel(440, 234, 170, 40, 3, ['領袖查重量肩帶']) +
        '<text x="150" y="110" text-anchor="middle" font-size="13">姓名標籤</text>' +
        '<text x="150" y="128" text-anchor="middle" font-size="13">分類袋</text>' +
        '<text x="150" y="146" text-anchor="middle" font-size="13">清單</text>' +
        '<path d="M196 120 h40" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' +
        '<text x="320" y="295" text-anchor="middle" font-size="13" fill="#6d6455">唔公開電話地址；藥物按旅團安排由成人管理，唔共用。</text>', 325);
    },
    'snack-box': function () {
      return SkillArt.frame('點心盒：飲用水＋健康食物', SkillArt.defs +
        '<rect x="60" y="80" width="240" height="110" rx="12" fill="#fff" stroke="#8d6e63" stroke-width="4"/>' +
        '<path d="M180 80 V190" stroke="#8d6e63" stroke-width="3"/>' +
        '<rect x="80" y="100" width="34" height="72" rx="8" fill="#e3f2fd" stroke="#0277BD" stroke-width="3"/>' +
        '<text x="97" y="196" text-anchor="middle" font-size="12">飲用水</text>' +
        '<circle cx="230" cy="126" r="16" fill="#ffe0b2" stroke="#E65100" stroke-width="3"/>' +
        '<rect x="256" y="112" width="30" height="26" rx="6" fill="#f1f8e9" stroke="#2E7D32" stroke-width="3"/>' +
        '<text x="245" y="196" text-anchor="middle" font-size="12">適合自己嘅食物</text>' +
        SkillArt.panel(330, 80, 280, 52, 1, ['先核敏感・飲食・吞嚥需要']) +
        SkillArt.panel(330, 140, 280, 52, 2, ['潔手分用具；切割冷藏交成人']) +
        SkillArt.panel(330, 200, 280, 52, 3, ['寫姓名；戴手套都要洗手']) +
        '<text x="320" y="272" text-anchor="middle" font-size="13" fill="#6d6455">唔交換食物；不能安全保存嘅唔留。唔評論人哋食物。</text>');
    },
    'frame-test': function () {
      return SkillArt.frame('桌上小架：先固定底座', SkillArt.defs +
        '<path d="M80 170 h120 M110 170 V96 M170 170 V96 M110 96 H170" stroke="#8d6e63" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<circle cx="110" cy="170" r="7" fill="#FF6F00"/><circle cx="170" cy="170" r="7" fill="#FF6F00"/><circle cx="140" cy="96" r="7" fill="#FF6F00"/>' +
        '<text x="140" y="196" text-anchor="middle" font-size="13">紙棍＋紙膠帶</text>' +
        '<path d="M300 170 h120 M330 170 V110 M390 170 V110 M330 110 H390" stroke="#8d6e63" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<path d="M360 110 V84 l22 8 l-22 8 z" fill="#C62828"/>' +
        '<text x="360" y="196" text-anchor="middle" font-size="13">只放輕紙旗測試</text>' +
        SkillArt.panel(450, 66, 160, 62, 1, ['畫設計・分好工']) +
        SkillArt.panel(450, 136, 160, 62, 2, ['先底座後支柱']) +
        SkillArt.panel(450, 206, 160, 62, 3, ['記低要改嘅接位']) +
        '<text x="320" y="295" text-anchor="middle" font-size="13" fill="#6d6455">模型唔畀人坐、企或爬；倒咗先停手再商量，唔大力壓、唔拋物測試。</text>', 325);
    },
    'bins': function () {
      var bin = function (x, color, label) {
        return '<path d="M' + x + ' 100 h70 l-8 70 h-54 z" fill="' + color + '22" stroke="' + color + '" stroke-width="4"/>' +
          '<rect x="' + (x - 4) + '" y="88" width="78" height="12" rx="5" fill="' + color + '"/>' +
          '<text x="' + (x + 35) + '" y="196" text-anchor="middle" font-size="13">' + label + '</text>';
      };
      return SkillArt.frame('按標示分類：唔靠桶色猜', SkillArt.defs +
        bin(60, '#1565C0', '紙') + bin(170, '#E65100', '膠') + bin(280, '#616161', '不可回收') +
        '<rect x="400" y="92" width="150" height="78" rx="10" fill="#fff8e1" stroke="#f9a825" stroke-width="3" stroke-dasharray="7 5"/>' +
        '<text x="475" y="126" text-anchor="middle" font-size="15" font-weight="700" fill="#8d6e63">查清楚</text>' +
        '<text x="475" y="150" text-anchor="middle" font-size="12">唔肯定＝放呢格</text>' +
        '<text x="475" y="196" text-anchor="middle" font-size="13">由領袖查，唔估</text>' +
        SkillArt.panel(30, 214, 580, 58, '', ['先看附近回收設施最新接收資料；洗乾淨都未必收。', '一人放一件樣本講原因；唔從垃圾桶取物。']));
    },
    'bridge': function () {
      return SkillArt.frame('紙橋：平紙 vs 摺紙（只改一樣）', SkillArt.defs +
        '<rect x="60" y="150" width="26" height="40" fill="#8d6e63"/><rect x="190" y="150" width="26" height="40" fill="#8d6e63"/>' +
        '<path d="M86 150 C120 168 156 168 190 150" stroke="#F9A825" stroke-width="6" fill="none"/>' +
        '<path d="M130 156 v-16 h16 v16 z" fill="#ffe0b2" stroke="#E65100" stroke-width="2"/>' +
        '<text x="138" y="212" text-anchor="middle" font-size="13">平紙：變形／塌</text>' +
        '<rect x="330" y="150" width="26" height="40" fill="#8d6e63"/><rect x="460" y="150" width="26" height="40" fill="#8d6e63"/>' +
        '<path d="M356 150 l14 -12 l14 12 l14 -12 l14 12 l14 -12 l14 12" stroke="#F9A825" stroke-width="6" fill="none"/>' +
        '<path d="M408 138 v-16 h16 v16 z" fill="#ffe0b2" stroke="#E65100" stroke-width="2"/>' +
        '<text x="408" y="212" text-anchor="middle" font-size="13">摺波浪：較穩</text>' +
        SkillArt.panel(30, 226, 180, 48, '', ['保持相同：紙・跨度']) +
        SkillArt.panel(230, 226, 180, 48, '', ['相同：紙杯・放杯位']) +
        SkillArt.panel(430, 226, 180, 48, '', ['記結果，唔講輸贏']) +
        '<text x="320" y="66" text-anchor="middle" font-size="13" fill="#6d6455">先估後試；塌下就停，手離開橋下，掉落先停再拾。</text>');
    },
    'tracking': function () {
      var cards = [['forward','沿路前進'],['wrong','此路不通'],['home','我們已回家']];
      var image = SkillArt.defs;
      cards.forEach(function(card,i){var x=30+i*200;
        image += '<rect x="'+x+'" y="55" width="180" height="150" rx="12" fill="#fff" stroke="#d8cfc0"/>' +
          SkillArt.trackingGlyph(card[0], x+36, 77, 0.6) +
          '<text x="'+(x+90)+'" y="185" text-anchor="middle" font-size="18" fill="#4e342e">'+card[1]+'</text>';
      });
      return SkillArt.frame('追蹤符號：先認三個，再講行動', image +
        '<text x="320" y="239" text-anchor="middle" font-size="15" fill="#88591c">自繪圖，非香港官方原圖；先核對適用教材。</text>',280);
    },
    'three-cols': function () {
      return SkillArt.frame('我的證據：三欄分開記', SkillArt.defs +
        SkillArt.panel(40, 60, 176, 130, '', ['參與過']) +
        '<circle cx="128" cy="110" r="18" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/>' +
        SkillArt.panel(232, 60, 176, 130, '', ['仍練習']) +
        '<path d="M300 128 a20 20 0 1 1 40 0" fill="none" stroke="#F9A825" stroke-width="5"/>' +
        '<path d="M336 116 l10 -6 v14 z" fill="#F9A825"/>' +
        SkillArt.panel(424, 60, 176, 130, '', ['領袖已確認']) +
        '<path d="M492 112 l14 14 l26 -28" stroke="#2E7D32" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        SkillArt.panel(30, 208, 580, 56, '', ['寫真實日期同做法；唔用全隊完成代替自己做到。', '出席過同自己做到，係兩回事。']));
    },
    'stations': function () {
      return SkillArt.frame('技能輪轉：三站', SkillArt.defs +
        '<circle cx="150" cy="120" r="46" fill="#fff3e0" stroke="#E65100" stroke-width="4"/><text x="150" y="116" text-anchor="middle" font-size="14">繩結站</text><text x="150" y="136" text-anchor="middle" font-size="12">講用途再示範</text>' +
        '<circle cx="330" cy="120" r="46" fill="#e3f2fd" stroke="#1565C0" stroke-width="4"/><text x="330" y="116" text-anchor="middle" font-size="14">方向站</text><text x="330" y="136" text-anchor="middle" font-size="12">原地找北</text>' +
        '<circle cx="510" cy="120" r="46" fill="#f3e5f5" stroke="#6A1B9A" stroke-width="4"/><text x="510" y="116" text-anchor="middle" font-size="14">求助站</text><text x="510" y="136" text-anchor="middle" font-size="12">講清楚現場</text>' +
        '<path d="M200 108 C240 88 250 88 282 104" stroke="#8d6e63" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        '<path d="M380 108 C420 88 430 88 462 104" stroke="#8d6e63" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        '<path d="M470 156 C400 196 260 196 192 156" stroke="#8d6e63" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        SkillArt.panel(30, 210, 580, 54, '', ['每站記一項做到＋一項待練；每人只選一項反覆練，唔趕站。', '未有足夠領袖就不分散開站。']));
    },
    'beanbag': function () {
      return SkillArt.frame('軟豆袋投擲：前面清空先投', SkillArt.defs +
        '<path d="M90 70 V190" stroke="#C62828" stroke-width="5" stroke-dasharray="10 7"/>' +
        '<text x="96" y="64" font-size="13" fill="#C62828">投擲線</text>' +
        SkillArt.person(130, 120, '#1565C0', 0.9) +
        '<path d="M160 108 C220 84 300 84 356 108" stroke="#8d6e63" stroke-width="3" fill="none" marker-end="url(#sa-arrow)"/>' +
        '<circle cx="430" cy="130" r="42" fill="none" stroke="#2E7D32" stroke-width="5"/>' +
        '<circle cx="430" cy="130" r="20" fill="none" stroke="#2E7D32" stroke-width="4"/>' +
        '<text x="430" y="196" text-anchor="middle" font-size="13">目標圈</text>' +
        '<rect x="240" y="150" width="120" height="40" rx="8" fill="#fff5f4" stroke="#C62828" stroke-width="2" stroke-dasharray="6 5"/>' +
        '<text x="300" y="175" text-anchor="middle" font-size="12" fill="#C62828">等待區：全停先拾</text>' +
        SkillArt.panel(30, 214, 580, 56, '', ['每人投三次；前面清空先投，唔投向人。', '唔排全團名次；記自己調整咗咩。']));
    },
    'weather': function () {
      return SkillArt.frame('看看窗外：天空・光線・感覺', SkillArt.defs +
        '<rect x="50" y="62" width="150" height="110" rx="10" fill="#e3f2fd" stroke="#1565C0" stroke-width="4"/>' +
        '<circle cx="95" cy="100" r="20" fill="#F9A825"/>' +
        '<path d="M130 96 q10 -16 26 -8 q16 -6 20 10 q10 12 -8 14 h-36 q-12 -6 -2 -16 z" fill="#fff" stroke="#90a4ae" stroke-width="3"/>' +
        '<path d="M140 122 l-6 14 M156 122 l-6 14 M172 122 l-6 14" stroke="#0277BD" stroke-width="3"/>' +
        '<text x="125" y="192" text-anchor="middle" font-size="13">又可以多雲又熱</text>' +
        SkillArt.panel(230, 62, 180, 110, 1, ['室內安全位', '看天空光線']) +
        SkillArt.panel(430, 62, 180, 110, 2, ['選描述：晴・雨・', '多雲・炎熱・清涼']) +
        SkillArt.panel(230, 186, 380, 46, 3, ['對照當日官方天氣資料：分清觀察同預報']) +
        '<text x="125" y="252" text-anchor="middle" font-size="12" fill="#6d6455">唔直視太陽</text>' +
        '<text x="420" y="252" text-anchor="middle" font-size="12" fill="#6d6455">唔冒雨或探身窗外</text>');
    },
    'day-plan': function () {
      var blocks = [['起床', '#F9A825'], ['上學', '#1565C0'], ['活動', '#2E7D32'], ['休息', '#6A1B9A'], ['睡覺', '#37474F']];
      var s = SkillArt.defs;
      blocks.forEach(function (b, i) {
        var x = 40 + i * 116;
        s += '<rect x="' + x + '" y="80" width="100" height="70" rx="10" fill="' + b[1] + '18" stroke="' + b[1] + '" stroke-width="3"/>' +
          '<text x="' + (x + 50) + '" y="120" text-anchor="middle" font-size="15" font-weight="700" fill="' + b[1] + '">' + b[0] + '</text>' +
          (i < 4 ? '<path d="M' + (x + 102) + ' 115 h12" stroke="#8d6e63" stroke-width="3" marker-end="url(#sa-arrow)"/>' : '');
      });
      s += '<text x="320" y="180" text-anchor="middle" font-size="13">先排五項，再畫自己嘅日程同實際時段</text>' +
        SkillArt.panel(30, 196, 280, 62, 1, ['選兩個好習慣', '講原因']) +
        SkillArt.panel(330, 196, 280, 62, 2, ['休息都係計劃', '一部分']) +
        '<text x="320" y="278" text-anchor="middle" font-size="12" fill="#6d6455">不同家庭作息可不同；唔以父母工作時間評價家庭。</text>';
      return SkillArt.frame('我的一天有休息', s, 310);
    },
    'community-map': function () {
      return SkillArt.frame('社區簡圖：家・學校・公園', SkillArt.defs +
        '<rect x="40" y="56" width="300" height="160" rx="10" fill="#eef6ec" stroke="#38634d" stroke-width="3"/>' +
        '<path d="M80 180 C120 120 200 160 240 96" stroke="#8d6e63" stroke-width="5" fill="none" stroke-dasharray="9 6"/>' +
        '<rect x="62" y="164" width="34" height="30" rx="5" fill="#fff3e0" stroke="#E65100" stroke-width="3"/><text x="79" y="210" text-anchor="middle" font-size="12">家</text>' +
        '<rect x="222" y="70" width="34" height="30" rx="5" fill="#e3f2fd" stroke="#1565C0" stroke-width="3"/><text x="239" y="116" text-anchor="middle" font-size="12">學校</text>' +
        '<circle cx="170" cy="150" r="18" fill="#f1f8e9" stroke="#2E7D32" stroke-width="3"/><text x="170" y="186" text-anchor="middle" font-size="12">公園</text>' +
        '<path d="M292 150 l10 -18 l10 18 z" fill="#C62828"/><text x="302" y="186" text-anchor="middle" font-size="11">停低留意</text>' +
        SkillArt.panel(360, 56, 250, 50, 1, ['用符號標示', '唔寫真實門牌']) +
        SkillArt.panel(360, 114, 250, 50, 2, ['選一條常用路線', '步行定搭車']) +
        SkillArt.panel(360, 172, 250, 50, 3, ['記一項安全或禮貌']) +
        '<text x="320" y="242" text-anchor="middle" font-size="13" fill="#6d6455">簡圖不按實際比例，唔作導航；唔鼓勵獨自出行或實地試路。</text>');
    },
    'handover': function () {
      return SkillArt.frame('準備 vs 服務：分開記', SkillArt.defs +
        SkillArt.panel(40, 60, 260, 110, '', ['準備：做卡・整物資']) +
        '<rect x="80" y="92" width="52" height="38" rx="6" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>' +
        '<rect x="150" y="92" width="52" height="38" rx="6" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>' +
        '<text x="170" y="185" text-anchor="middle" font-size="12">只記準備</text>' +
        '<path d="M310 115 h40" stroke="#8d6e63" stroke-width="4" marker-end="url(#sa-arrow)"/>' +
        SkillArt.panel(360, 60, 250, 110, '', ['服務：成人按約定交接']) +
        SkillArt.person(420, 116, '#2E7D32', 0.8) + SkillArt.person(520, 112, '#4e342e', 0.9) +
        '<rect x="452" y="96" width="44" height="34" rx="6" fill="#f1f8e9" stroke="#2E7D32" stroke-width="3"/>' +
        '<text x="474" y="185" text-anchor="middle" font-size="12">先確認對方需要</text>' +
        SkillArt.panel(30, 200, 580, 68, '', ['未有接收單位就先做團內關懷；未交接只記準備，唔記已服務。', '一人講：做咗咩、幫到邊、下次改咩。領袖分開記準備同服務日期。']));
    }
  },
  /* 邊節用邊幅圖（tid:節序）。冇對上嘅節維持文字卡，唔硬塞圖。 */
  map: {
    'c01:1': 'circle-paper', 'c01:2': 'cup-tower', 'c01:3': 'group-card',
    'c02:1': 'promise-reading', 'c02:2': 'kindness', 'c02:3': 'good-deed-plan',
    'c03:1': 'boundary', 'c03:2': 'help-steps', 'c03:3': 'help-network',
    'c04:2': 'command-compare', 'c04:3': 'ask-leader',
    'c05:1': 'departure-check', 'c05:2': 'senses', 'c05:3': 'park-facility',
    'c06:1': 'overhand', 'c06:2': 'reef', 'c06:3': 'knot-choose',
    'c07:1': 'compass', 'c07:2': 'map-legend', 'c07:3': 'eight-dir',
    'c08:1': 'help-call', 'c08:2': 'wound', 'c08:3': 'nosebleed',
    'c09:1': 'kit-choice', 'c09:2': 'backpack', 'c09:3': 'return-check',
    'c10:1': 'food-check', 'c10:2': 'snack-box', 'c10:3': 'snack-tidy',
    'c11:1': 'needs-first', 'c11:2': 'card-making', 'c11:3': 'handover',
    'c12:1': 'route-plan', 'c12:2': 'hike-kit', 'c12:3': 'weather-stop',
    'c13:1': 'festival-discovery', 'c13:2': 'festival-art', 'c13:3': 'festival-safety',
    'c14:1': 'origin-timeline', 'c14:2': 'five-sections',
    'c15:1': 'model-plan', 'c15:2': 'frame-test', 'c15:3': 'model-review',
    'c16:1': 'waste-choice', 'c16:2': 'bins', 'c16:3': 'waste-week',
    'c17:1': 'bridge-predict', 'c17:2': 'bridge', 'c17:3': 'bridge-report',
    'c18:1': 'tracking', 'c18:2': 'tracking-walk', 'c18:3': 'tracking-record',
    'c19:1': 'three-cols', 'c19:2': 'requirements-check', 'c19:3': 'next-goal',
    'c20:1': 'stations', 'c20:2': 'compass-practice', 'c20:3': 'help-practice',
    'c21:1': 'gentle-warmup', 'c21:2': 'beanbag', 'c21:3': 'exploration-art',
    'c22:1': 'progress-story', 'c22:2': 'next-questions', 'c22:3': 'summer-plan',
    'c23:1': 'weather', 'c23:2': 'activity-clothes', 'c23:3': 'weather-backup',
    'c24:1': 'day-plan', 'c24:2': 'safe-helping', 'c24:3': 'helping-review',
    'c25:1': 'community-map', 'c25:2': 'travel-explain', 'c25:3': 'community-manners'
  },
  /* 按內容選媒材，不把「改副檔名」當美化。人物插畫另行繪製；
     尚未重畫的人物／動作圖維持原稿，不冒稱已美化或正式核准。 */
  vectors: ['compass','map-legend','eight-dir','bins','bridge','tracking','three-cols','stations','weather','day-plan','community-map','frame-test','route-plan','needs-first','model-review','bridge-predict','tracking-record','compass-practice','weather-backup','next-goal','progress-story','summer-plan','good-deed-plan','requirements-check','travel-explain','command-compare','origin-timeline','five-sections'],
  vectorCues: {
    'command-compare': ['先開六口令卡，慢練留心、立正、稍息。','按Fall In手號定位，放手號後稍息。','分清暫時解散同散會，逐人慢練。'],
    'origin-timeline': ['開起源短講，先排出生、露營、出版三卡。','分清1907露營同1908出版。','講一項生平事實、一項露營可學嘅能力。'],
    'five-sections': ['認五個支部名，再指出自己嘅幼童軍。','講年長成員可以點幫年幼成員。','領袖用真實公開資料介紹；肩章唔估級別。'],
    'good-deed-plan': ['講銘言「準備」：用品同心情點預備？','揀本週一件安全善事，定幾時做。','先問同意同成人支援，下次講實際情況。'],
    'requirements-check': ['領袖先查適用版本、級別同正式條文。','找時間、實際活動、數量及指定徽章要求。','未做或未核寫清楚；過渡安排另查通告。'],
    'travel-explain': ['揀一條常用路線，講步行定搭咩車。','指起點、終點，同一個要停低留意嘅地方。','唔肯定就搵同行大人確認，唔自行試路。'],
    'next-goal': ['揀一項下月想練嘅能力。','同領袖定做法、支援同回顧日期。','長期進度另記；本場完成唔等於獲章。'],
    'progress-story': ['揀一件作品，或者講一段活動回憶。','講開始唔識咩、點改善、邊個幫過。','同伴具體鼓勵，再記想練嘅事。'],
    'summer-plan': ['揀一項可同成人安全做嘅活動或家務。','記物資、邊個幫，同咩情況要停。','約下次分享日期，點齊個人物品。'],
    'tracking': ['認圖再講行動，箭嘴唔代表一定向北。','搵唔到下一圖，就喺安全位停，叫領袖。','結束要到約定點點名，唔係自行回家。'],
    'tracking-record': ['畫今日用過嘅符號，寫或講意思。','同伴讀唔清，就請領袖核對。','成人帶隊收回標記，場地還原。'],
    'compass-practice': ['成人先查儀器同磁性干擾。','自己放平、等針停，找北再指地標。','分清今日練四、八定十六方位，記下一步。'],
    'weather-backup': ['揀落雨、變冷或炎熱不適嘅情境。','講加衣、備雨具、飲水或停低求助。','圖旁記一個後備方案，下次出門再查。'],
    'model-review': ['只改一處，用同一紙旗再試。','講改咗底座、接位定支撐。','慢慢拆開分類；模型唔當正式紮作。'],
    'bridge-predict': ['先估平紙定摺紙較穩，講原因。','紙張、跨度、紙杯、放杯位置一樣。','只放輕紙杯；記低估計，之後先試。'],
    'needs-first': ['先問對方需要，唔只係自己想送。','未有接收單位，就先做團內關懷。','揀安全任務，由成人聯絡同交接。'],
    'route-plan': ['用成人踏查嘅實際地圖，找五個位置。','按路況同大家能力商量時間。','指出休息位置，講點聯絡領袖。']
  },
  illustrations: {
    "promise-reading": {
      "title": "四句承諾慢慢讀",
      "src": "assets/skills/promise-reading-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "成人指着桌上四條示意線，兩位孩子圍坐跟讀或畫生活例子；沒有舉手敬禮。圖不是正式宣誓，正確誓詞另以文字列出。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "照正式誓詞逐句讀，先講意思再跟讀。",
        "揀一句，用自己嘅話講意思，唔鬥大聲。",
        "兩人輪流練，領袖逐個聽同提供支援。"
      ]
    },
    "group-card": {
      "title": "我們的旅團名片",
      "src": "assets/skills/group-card-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "四位孩子與成人核對一張旅團名片的空白欄位，輪流指認及書寫；沒有預填旅號或私人住址。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "領袖核對旅號、區、地域同主辦機構。",
        "一齊整名片，一人指出一項公開資料。",
        "揀合作約定，記點解決分歧，下次重溫。"
      ]
    },
    "festival-discovery": {
      "title": "節慶小發現",
      "src": "assets/skills/festival-discovery-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "成人和兩位孩子以桌上的紅色紙飾作觀察例子，聆聽不同做法並記下待查問題；不是節日起源重演或製作教學。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "開已備新春短講；其他節日先核資料。",
        "講見過嘅食物或習俗，唔肯定就記低查。",
        "講點連繫家人或社區；傳說唔當史實。"
      ]
    },
    "next-questions": {
      "title": "下一程問答站",
      "src": "assets/skills/next-questions-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "兩位孩子帶空白提問卡與一位便服成人對話，旁邊有待記錄的紙筆；不展示制服式樣或頒章，不表示已獲晉團批准。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "請合適童軍團代表，或用已核實資料。",
        "輪流問活動、制服、小隊或獎章。",
        "未知就記低跟進，唔用幼童軍制度估。"
      ]
    },
    "ask-leader": {
      "title": "問領袖一條問題",
      "src": "assets/skills/ask-leader-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子以帳篷和樹的活動草圖向成人提問，另一張記錄紙空白；只是提出想法，不是已批准的露營安排。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "問一條最想知嘅活動問題。",
        "聽完用字、畫或口述記低；未答就約再跟。",
        "畫一項最想試嘅活動，講點解想試。"
      ]
    },
    "food-check": {
      "title": "選食材前先看清楚",
      "src": "assets/skills/food-check-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子先等成人核對密封包裝；桌上有自己的水樽和空餐盒，沒有試食。圖中包裝線條不是實際成分或無致敏原聲明。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "成人先核對敏感、飲食同吞嚥需要。",
        "飲用水加至少一項適合自己嘅健康食物。",
        "講選擇理由，唔評論人哋食物。"
      ]
    },
    "snack-tidy": {
      "title": "介紹點心盒及善後",
      "src": "assets/skills/snack-tidy-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "左右兩格：先介紹自己的點心盒與飲用水，再清理自己的空餐盒及桌面，成人在旁；沒有交換或跨家庭送剩食。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "介紹自己選擇同一項衞生做法。",
        "按安全安排食或帶走；不能安全保存唔留。",
        "清理枱面用具，講下次想自己做邊一步。"
      ]
    },
    "hike-kit": {
      "title": "背囊檢查站",
      "src": "assets/skills/hike-kit-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子在室內雙肩試背輕便背囊，成人觀察舒適程度；桌上用品及清單只是例子，不是完整出隊裝備或實際遠足紀錄。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "照清單查水、衣物、防曬、防雨、食物及個人物品。",
        "講三件用品用途，試背再調整重量。",
        "垃圾帶走，唔干擾野生動物。"
      ]
    },
    "exploration-art": {
      "title": "畫出我的探索",
      "src": "assets/skills/exploration-art-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子自選分享目標圈與豆袋的活動畫，同伴欣賞想法；另一張作品面朝下，不要求所有人公開展示。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "畫今日最想繼續試嘅活動。",
        "講自己做緊咩、想改善邊一部分。",
        "具體欣賞同伴，作品展唔展由本人決定。"
      ]
    },
    "tracking-walk": {
      "title": "跟線索慢慢行",
      "src": "assets/skills/tracking-walk-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子與兩位成人在室內站點停下等齊隊友，卡片背面向外，沒有由AI繪製追蹤符號；實際符號另看現有教材。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "成人先查站點，全隊在可見範圍慢行。",
        "逐站輪流講意思，等齊隊友先繼續。",
        "終點先點名，再講一次停低確認嘅經過。"
      ]
    },
    "help-practice": {
      "title": "求助站：說清楚現場",
      "src": "assets/skills/help-practice-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子用無連線的木製玩具電話作求助練習，成人聆聽並記下待練內容；三張虛構提示卡代表地點、事故及人物，不是真實受傷個案。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "先問現場安全嗎、成人喺邊。",
        "只用不能撥號道具，講位置、事故、傷者。",
        "領袖記低邊樣要提示，再練一次。"
      ]
    },
    "gentle-warmup": {
      "title": "暖身與身體訊號",
      "src": "assets/skills/gentle-warmup-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子在成人旁慢行暖身；另一位孩子在步行區外自選坐下休息，成人陪同，沒有強拉、彈震或比賽。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "按自己能力慢行，動作溫和。",
        "痛、暈、呼吸唔舒服即停，叫成人。",
        "可調整幅度或休息，唔勉強跟人做。"
      ]
    },
    "helping-review": {
      "title": "約好一週後見",
      "src": "assets/skills/helping-review-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子與成人看兩張分開的空白記錄紙：三格任務與兩個習慣欄，沒有日期、簽名或完成記號；不是已完成證據。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "同一週做三次安全任務，記真實日期。",
        "兩個生活習慣另外記，唔混作任務次數。",
        "約一週後分享，做唔到就商量支援。"
      ]
    },
    "community-manners": {
      "title": "社區禮貌路線劇場",
      "src": "assets/skills/community-manners-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "室內說演：孩子留出通道，讓使用輪椅的同伴通過；沒有人擅自碰或推輪椅。只是一個讓路例子，不是真實過路或乘車程序。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "讀等車、走廊、排隊情境，講點做。",
        "慢行、輪候、唔推撞，留位畀人過。",
        "圖旁記一項安全或禮貌，同成人實踐。"
      ]
    },
    "model-plan": {
      "title": "先畫，再分工",
      "src": "assets/skills/model-plan-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子分工畫小架草圖、整理短紙棍及準備紙膠帶，成人在旁；只是桌上模型規劃，不是人體承重或正式紮作。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "先畫桌上小架，再動手。",
        "分好設計、取物、組裝同記錄。",
        "成人定高度；模型唔畀人坐、企或爬。"
      ]
    },
    "waste-choice": {
      "title": "少一件垃圾的方法",
      "src": "assets/skills/waste-choice-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子與成人比較自備水樽、餐盒和乾淨即棄容器。沒有從垃圾桶取物，亦不表示圖中物品都可回收。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "比較乾淨樣本，諗兩個減廢選擇。",
        "先少啲浪費，用返已有嘅物品。",
        "可唔可以回收，要查接收點規則。"
      ]
    },
    "waste-week": {
      "title": "一週減廢小實驗",
      "src": "assets/skills/waste-week-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子用已有的水樽與成人商量減廢行動；桌上記錄紙只有空格，沒有日期或已完成記號。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "揀一項家中或學校做得到嘅行動。",
        "記真實日期、做法同遇到嘅困難。",
        "一週後分享；用現有物品，唔使買新。"
      ]
    },
    "bridge-report": {
      "title": "改良與小報告",
      "src": "assets/skills/bridge-report-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子記錄及討論紙橋觀察，成人在旁；背景只有矮支座、紙橋和輕紙杯。圖中草圖不是實際結果或成功保證。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "只揀一個改法，先講估計效果。",
        "其他條件唔變，再試並畫前後分別。",
        "講我見到咩、下次想試咩，留好記錄。"
      ]
    },
    "park-facility": {
      "title": "設施使用小觀察",
      "src": "assets/skills/park-facility-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "成人和孩子在公園長椅旁一起看設施標示，通道保持暢通。標示圖案只是示意，不是真實場地規則或實地參觀紀錄。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "先讀現場標示，再觀察點樣使用。",
        "講邊啲人會用、點讓大家安全用。",
        "收好物品同垃圾，點名後返交接點。"
      ]
    },
    "kit-choice": {
      "title": "帶甚麼才有用",
      "src": "assets/skills/kit-choice-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "水樽、帽和手巾與玩具車、玩偶分開作比較；孩子在成人旁選用品。只是選擇例子，不是完整出隊清單。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "揀三件活動用品，逐件講用途。",
        "比較咩唔必需；唔係帶得多就好。",
        "藥物由成人按安排管理，唔共用。"
      ]
    },
    "card-making": {
      "title": "用心完成一份任務",
      "src": "assets/skills/card-making-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "一位孩子畫問候卡，另一位檢看卡片，成人在旁核對；屬準備工作，沒有向接收者交接。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "分工製作問候卡，人人做一部分。",
        "互看內容有禮貌，唔標籤人。",
        "成人核對；未交接只記準備。"
      ]
    },
    "festival-art": {
      "title": "一幅習俗畫",
      "src": "assets/skills/festival-art-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子畫紅燈籠並與同伴交流，成人在旁；背景燈籠不點火，只作習俗畫的例子，不要求每個家庭同樣慶祝。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "揀一項習俗，用畫或摺紙記低。",
        "講節日名，再介紹圖中嘅做法。",
        "互看作品，各問一條有禮貌嘅問題。"
      ]
    },
    "festival-safety": {
      "title": "節慶安全小主持",
      "src": "assets/skills/festival-safety-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子在室內輪候看紙上燈籠畫，一位孩子邀請下一位，成人看顧；是輪候禮貌的說演例子，不是真實節慶人流安排。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "分享一次觀察，唔使講私人經歷。",
        "提出人群、排隊或清潔提醒。",
        "合成三句提醒，輪流做小主持。"
      ]
    },
    "departure-check": {
      "title": "出發前安全檢查",
      "src": "assets/skills/departure-check-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子在室內與成人一起檢查水樽、帽和手巾，尚未出發。圖中人數不代表帶隊比例要求。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "查水、帽、手巾，講要搵邊位成人。",
        "重講：唔離隊、唔攀爬、唔摸未知物。",
        "成人核實安排，點名先按同伴安排出發。"
      ]
    },
    "return-check": {
      "title": "回營後的點算",
      "src": "assets/skills/return-check-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子對照平放桌面的圖像清單再點算物品；乾衣、水樽和帽與另一邊托盤內的濕手巾分開，成人在旁。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "乾濕分開，濕物唔長留袋內。",
        "照清單點數；少咗先報告，唔離隊搵。",
        "收好背包，講下次出門要查嘅三件事。"
      ]
    },
    "weather-stop": {
      "title": "天氣變了怎樣辦",
      "src": "assets/skills/weather-stop-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "窗外下雨，孩子與成人留在室內，放下背囊討論改變計劃；不是在雷暴中示範撤離路線。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "唔舒服即刻講，停低搵成人。",
        "可停止、改期，或跟成人撤離安排。",
        "雷暴、酷熱、封路都唔硬行。"
      ]
    },
    "activity-clothes": {
      "title": "我的活動日穿著圖",
      "src": "assets/skills/activity-clothes-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子在成人旁邊畫自己的穿著，桌上有帽、薄外套和雨衣作不同需要的選項，不是要求全部穿上。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "按今日天氣同活動，揀合適衣物。",
        "畫自己嘅穿著，講一項選擇理由。",
        "同領袖確認飲水、防曬或保暖需要。"
      ]
    },
    "safe-helping": {
      "title": "先問，再幫忙",
      "src": "assets/skills/safe-helping-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子站在地上，拿着輕便非易碎碟子先向成人詢問；成人回應和指導，桌上沒有利器、熱物或清潔劑。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "先問：我可以幫手嗎？聽完先做。",
        "揀安全小任務，例如放非易碎物品。",
        "唔肯定就停；危險工作交成人。"
      ]
    },
    "boundary": {
      "title": "我的界線由我表達",
      "src": "assets/skills/boundary-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "一位孩子舉掌表達停止，另一位孩子保持距離並尊重拒絕，成人在旁。沒有接觸身體的演練。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "可以講停、用手勢，或者離開。",
        "尊重別人講唔想，唔逼、唔碰。",
        "講唔出口、走唔開，都唔係你嘅錯。"
      ]
    },
    "help-steps": {
      "title": "求助三步情境",
      "src": "assets/skills/help-steps-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "三格虛構情境：孩子表達停止、走向安全的活動室，再向願意聆聽的成人說明。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "先保安全，可以講停或離開。",
        "到安全地方，搵肯聽你講嘅成人。",
        "第一位幫唔到，再搵另一位。"
      ]
    },
    "help-call": {
      "title": "現場安全與求助",
      "src": "assets/skills/help-call-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子與成人用木製玩具電話演練求助，指向只畫房屋和樹的情境卡。不是可撥號電話或真實事故。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "先保安全，唔衝入去；叫成人。",
        "只用不能撥號嘅道具電話練習。",
        "講位置、發生咩事、傷者情況。"
      ]
    },
    "help-network": {
      "title": "我的求助網",
      "src": "assets/skills/help-network-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子私下畫自己的求助卡，上面有兩個成人頭像；背景兩位不同成人只作求助對象例子，沒有姓名、地址或電話。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "私下揀至少兩位肯聽你講嘅成人。",
        "練講：我有件事唔安心，想你幫我。",
        "求助卡自己收好，唔使公開資料。"
      ]
    },
    "kindness": {
      "title": "規律情境小劇場",
      "src": "assets/skills/kindness-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "一位孩子安全地跪在桌旁，幫坐着的同伴拾回掉落的彩色筆。是關心別人的日常例子，沒有推撞或假裝跌倒。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "先問需唔需要幫，再安全咁幫手。",
        "輪流演一個關心別人、負責任嘅做法。",
        "講返做法同邊句規律有關。"
      ]
    },
    "circle-paper": {
      "src": "assets/skills/circle-paper-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "三位孩子在大紙外圍合作畫圖，一人用筆畫線，其他人等待和商量，沒有站在紙上。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "企／蹲喺紙外，輪流畫自己的符號。",
        "先聽每個人，再用線連成圖。",
        "想改位？先聽原因，再諗兩個方法。"
      ]
    },
    "backpack": {
      "src": "assets/skills/backpack-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子拿着摺好的外衣準備放入打開的背囊；桌上有水樽、後備衣物、手巾和帽，成人在旁協助。非收納位置剖面圖。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "揀三件用品，講清用途。",
        "常用易拎、重物靠背；後備衣物放底。",
        "自己試背，領袖檢查重量同肩帶。"
      ]
    },
    "snack-box": {
      "src": "assets/skills/snack-box-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "兩位孩子各有自己的茶點盒、水樽和餐具，成人在旁照看，沒有互相交換食物。食物只作例子。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "先核對食物敏感、飲食同吞嚥需要。",
        "先洗手；切割、冷藏交成人。",
        "各用自己餐盒同水樽，唔交換食物。"
      ]
    },
    "beanbag": {
      "src": "assets/skills/beanbag-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "孩子站在投擲線後低手投軟豆袋，前方目標圈無人；等候孩子和成人留在投擲者後方，沒有人執豆袋。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "留在線後，前方清空先低手投。",
        "每人三次；全停先一齊執。",
        "同自己上次比，講一項調整。"
      ]
    },
    "senses": {
      "src": "assets/skills/senses-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "兩位孩子在成人身旁停定觀察公園的花、樹、蝴蝶和雀鳥，沒有觸摸或採集。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "跟成人留在安全區，看三樣、聽兩種。",
        "只觀察，唔摸、唔摘、唔試味。",
        "分享一項應做、一項唔應做嘅事。"
      ]
    },
    "handover": {
      "src": "assets/skills/handover-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "左右兩格情境：左邊孩子製作關懷卡，是準備；右邊兩位成人按安排交接卡盒。不是實際服務紀錄。",
      "credit": "AI輔助插畫・非官方教材｜活動由領袖現場帶領",
      "cues": [
        "做卡、整物資，只記作準備。",
        "先確認需要，再由成人按約定交接。",
        "未交接唔記已服務；兩個日期分開記。"
      ]
    },
    'cup-tower': {
      src:'assets/skills/cup-tower-scene.avif', width:1280, height:714,
      alt:'三位孩子合作起杯塔：一人放杯，兩人等待鼓勵。桌上底層三杯、中層兩杯，手上最後一杯。',
      credit:'AI輔助插畫・非官方教材｜活動由領袖現場帶領',
      cues:['六隻杯，輪流一人放一隻。','倒了先停手，鼓勵再試。','完成後，每人讚一位隊友。']
    },
    "wound": {
      "title": "小擦傷：潔手・按壓・沖洗・覆蓋",
      "src": "assets/skills/wound-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "四步温和急救圖：洗手、乾淨敷料按壓、清水沖洗、覆蓋包紮。無血液，適合幼童安心學習。",
      "credit": "AI輔助插畫・非官方教材｜急救由熟悉嘅領袖示範",
      "cues": [
        "先潔手，唔碰血液。",
        "有出血用乾淨敷料按壓，止血後清水沖。",
        "持續出血或有異物：交成人及醫護。"
      ]
    },
    "nosebleed": {
      "title": "流鼻血：坐低・向前・捏鼻翼",
      "src": "assets/skills/nosebleed-scene.avif",
      "width": 1280,
      "height": 714,
      "alt": "正確做法：坐低、身體稍向前、捏鼻翼柔軟位。錯誤做法（紅色X）：仰頭。温和風格，適合幼童。",
      "credit": "AI輔助插畫・非官方教材｜急救由熟悉嘅領袖示範",
      "cues": [
        "坐低，身體稍向前，用口呼吸。",
        "捏鼻翼柔軟位10–15分鐘。",
        "唔昂頭、唔躺低；按壓唔停就搵成人。"
      ]
    }
  },
  sequence: 0,
  media: function(id){
    var illustration=SkillArt.illustrations[id];
    if(illustration)return {kind:'illustration',format:'avif',src:illustration.src,credit:illustration.credit};
    if(SkillArt.vectors.indexOf(id)>=0)return {kind:'vector',format:'svg',src:null,credit:SkillArt.credit};
    return {kind:'legacy-diagram',format:'avif',src:'assets/skills/'+id+'.avif',credit:SkillArt.credit};
  },
  key: function (tid, i) { return tid + ':' + i; },
  get: function (tid, i) {
    var k = SkillArt.map[SkillArt.key(tid, i)];
    if (!k || (!SkillArt.art[k] && !SkillArt.illustrations[k])) return null;
    // New scenes need no fake SVG placeholder. Historical vector sources remain optional.
    var illustration = SkillArt.illustrations[k];
    var svg = SkillArt.art[k] ? SkillArt.art[k]() : null;
    var title = svg ? svg.match(/aria-label="([^"]*)"/)[1] : esc(illustration.title);
    var height = svg ? Number(svg.match(/viewBox="0 0 640 (\d+)"/)[1]) : illustration.height / 2;
    var media = SkillArt.media(k), image;
    if(media.format==='svg'){
      // Inline SVG inherits readable system/web fonts. Unique marker IDs prevent cross-card collisions.
      var marker='sa-arrow-'+(++SkillArt.sequence);
      image=svg.replace(/sa-arrow/g,marker).replace('<svg ', '<svg data-skill-id="'+k+'" ');
    } else {
      image='<img class="skill-art" data-skill-id="'+k+'" src="'+media.src+'" width="'+(illustration?illustration.width:1280)+'" height="'+(illustration?illustration.height:height*2)+'" alt="'+(illustration?esc(illustration.alt):title)+'。'+esc(media.credit)+'" decoding="async" onerror="SkillArt.imageError(this)">';
    }
    // Captions stay as real HTML; never ask the image model to draw Chinese instructions.
    var cues=illustration ? illustration.cues : SkillArt.vectorCues[k];
    var caption=cues?'<ol class="skill-cues">'+cues.map(function(cue){return '<li>'+esc(cue)+'</li>';}).join('')+'</ol>':'';
    if(illustration) caption += '<p class="skill-art-credit">'+esc(media.credit)+'</p>';
    if(k==='promise-reading') caption += '<div class="skill-formal-copy"><strong>幼童軍誓詞｜正式原文</strong><ol>'+DATA.facts.promise.map(function(line){return '<li>'+esc(line)+'</li>';}).join('')+'<small>取自內置誓詞文字；圍坐跟讀不是正式宣誓儀式。</small></div>';
    return {id:k,svg:svg,image:image,visual:image+caption,format:media.format,kind:media.kind,credit:media.credit};
  },
  // Reference pictures are not step diagrams. Keep that distinction on screen and paper.
  support: function(tid,i){
    var ep = tid==='c26'?0:tid==='c27'?1:(tid==='c14'&&Number(i)===3?0:-1);
    if(ep>=0 && Number(i)>0 && Number(i)<4 && typeof Jungle!=='undefined'){
      var ids=DATA.jungle.episodes[ep].characters;
      return {label:'角色參考圖',html:Jungle.portraits(ids)+'<p class="reference-credit">AI角色示意圖，非官方原圖；不是本節動作步驟圖。</p>',thumb:Jungle.portraits(ids.slice(0,3),true),episode:ep};
    }
    if(tid==='c04'&&Number(i)===1&&typeof FieldVisuals!=='undefined'){
      return {label:'官方款式參考',html:'<div class="skill-reference">'+FieldVisuals.referenceHTML()+'</div>',thumb:'<img class="skill-art" src="'+FieldVisuals.refs[0].file+'" alt="幼童軍制服款式參考，不是徽章位置圖" loading="lazy">'};
    }
    return null;
  },
  thumb: function (tid, i) {
    var a = SkillArt.get(tid, i);
    var support = !a && SkillArt.support(tid,i);
    return a ? '<div class="skill-thumb">' + a.image.replace(' decoding=', ' loading="lazy" decoding=') + '</div>' : support ? '<div class="skill-thumb reference-thumb">'+support.thumb+'</div>' : '';
  },
  safetyNote: function (tid, i) {
    var m = DATA.meetings.find(function (m) { return m.tid === tid; });
    var s = m && m.segs[i];
    if (!s) return '';
    var safeguarding = tid === 'c03' ? (Number(i) === 1 ? ' ' + s.steps[0] + ' ' + s.steps[2] : Number(i) === 3 ? ' ' + s.steps[2] : '') : '';
    var preparation = '';
    if (tid === 'c05' && Number(i) === 1) preparation = ' ' + s.steps[0] + ' ' + s.steps[2];
    if (tid === 'c05' && Number(i) === 3) preparation = ' 圖中標示只作示意，實地先讀現場標示；配圖不代替實地參觀。';
    if (tid === 'c13' && Number(i) === 2) preparation = ' 圖以燈籠畫作例子，不要求家庭慶祝或新購用品。';
    if (tid === 'c13' && Number(i) === 3) preparation = ' 只作室內慢動作說演，不推撞；配圖不代表真實節慶人流安排。';
    if (tid === 'c12' && Number(i) === 1) preparation = ' 教學示例，不按比例；不可作導航或自行試路。實走須另作風險評估及正式安排。';
    if (tid === 'c12' && Number(i) === 3) preparation = ' ' + s.steps[1] + ' ' + s.steps[2];
    if (tid === 'c15' && Number(i) === 3) preparation = ' 模型唔畀人坐、企或爬，只用同一輕紙旗再試；不代替正式紮作考驗。';
    if (tid === 'c17' && Number(i) === 3) preparation = ' 只用矮支座及輕紙杯，手離開橋下；倒下先停並移走紙杯，不用重物或攀桌取物。插畫不代表實際測試結果。';
    if (tid === 'c18' && Number(i) >= 1 && Number(i) <= 3) preparation = ' 搵唔到下一圖就喺安全位停、叫領袖；結束要到約定點點名，不自行回家。符號見現有追蹤教材；圖形非香港官方原圖。';
    if (tid === 'c20' && Number(i) === 2) preparation = ' 圖只作示意，唔係即時指南針；先由成人核對儀器與場地。';
    if (tid === 'c20' && Number(i) === 3) preparation = ' 只用不能撥號道具，不搬動疑似重傷者；真實緊急情況立即求助或打999。';
    if (tid === 'c21' && Number(i) === 1) preparation = ' ' + s.steps[0] + ' ' + s.steps[1];
    if (tid === 'c24' && Number(i) === 3) preparation = ' 記真實做過的事，不即日當完成一週要求；三次安全任務與兩個生活習慣分開記錄。';
    if (tid === 'c02' && Number(i) === 1) preparation = ' 正式誓詞照原文，不用自創口號代替；學習與正式宣誓分開，不因跟讀而頒章。';
    if (tid === 'c04' && Number(i) === 2) preparation = ' 本圖只示意Fall In站位與解散分別，不畫手號或腳手細節；依2026內置六口令卡由熟悉程序的領袖示範，身體不適即停並安排支援。';
    if (tid === 'c14' && Number(i) === 1) preparation = ' 圖像是日期分類圖示，不是歷史照片。熟練再加1910、1920、1941；其餘事實見內置短講。';
    if (tid === 'c14' && Number(i) === 2) preparation = ' 名稱取自內置五支部卡；不加未核實年齡表，不猜肩章職級或自動批准晉團。';
    if (tid === 'c01' && Number(i) === 3) preparation = ' 圖中欄位是空白示例，真實公開資料由領袖提供；不預填或猜旅號。';
    if (tid === 'c02' && Number(i) === 3) preparation = ' 記本週行動與下次回顧時間，不要求私人證據照片；未實踐只記計劃。';
    if (tid === 'c13' && Number(i) === 1) preparation = ' 紙飾只作觀察例子，不代表每個家庭都慶祝；傳說不當唯一歷史事實。';
    if (tid === 'c19' && Number(i) === 2) preparation = ' 圖中沒有核准結果；資格按適用正式要求及過渡通告另查，不用通用時數或舊表概括。';
    if (tid === 'c22' && Number(i) === 2) preparation = ' ' + s.steps[2] + ' 記問題、答案及跟進人，配圖不是頒章或晉團批准。';
    if (tid === 'c25' && Number(i) === 2) preparation = ' 示意圖不按實際比例、不作導航或過路教學；不寫真實住址，出行跟約定成人同行安排。';
    if (tid === 'c10' && Number(i) === 1) preparation = ' 備好分開用具及標籤，成人按實際食品標示核對；圖中包裝不代表成分資料或安全確認。';
    if (tid === 'c12' && Number(i) === 2) preparation = ' 室內檢查不等於實際遠足，出隊須另按正式安排。';
    if (tid === 'c19' && Number(i) === 3) preparation = ' 需要家庭配合先徵求同意；本APP不代替正式長期進度記錄。';
    if (tid === 'c24' && Number(i) === 2) preparation = ' ' + s.steps[2];
    return s.safety + safeguarding + preparation + (tid === 'c08' && i >= 1 && i <= 3 ? ' ' + (i === 1 || i === 3 ? s.steps[1] + ' ' : '') + s.steps[2] : '');
  },
  imageError: function (img) {
    if (img.dataset.failed) return;
    img.dataset.failed = '1';
    img.hidden = true;
    var notice = document.createElement('p');
    notice.className = 'skill-image-error';
    notice.textContent = '圖解未能載入，請參閱文字帶法；動作由領袖示範。';
    img.after(notice);
    var box = img.closest('.modal-content');
    var instructions = box && box.querySelector('.skill-instructions');
    if (instructions) instructions.open = true;
    var sheet = img.closest('.skill-sheet');
    if (sheet && sheet.dataset.tid) {
      var m = DATA.meetings.find(function (m) { return m.tid === sheet.dataset.tid; });
      var steps = m && m.segs[Number(sheet.dataset.stage)].steps;
      if (steps) notice.insertAdjacentHTML('afterend', '<ol>' + steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>');
    }
  },
  /* 單張A4圖解卡：點邊節印邊節，唔會印成個活動庫 */
  sheet: function (tid, i) {
    var m = DATA.meetings.find(function (x) { return x.tid === tid; });
    if (!m || !m.segs[i]) return '';
    var s = m.segs[i], a = SkillArt.get(tid, i), support = SkillArt.support(tid,i);
    return '<section class="psheet leader-sheet skill-sheet" data-tid="' + esc(tid) + '" data-stage="' + i + '"><h2>' + esc(s.n) + (a ? '｜圖解帶領卡' : support ? '｜參考圖與帶法' : '｜文字帶領卡') + '</h2>' +
      '<p>' + s.m + '分鐘 · ' + esc(m.n) + ' · 第' + (i + 1) + '／' + m.segs.length + '節</p>' +
      (a ? a.visual : support ? support.html : '<p class="mut">呢節以文字帶法為主；未有專屬步驟圖。</p>') +
      '<p class="say">' + esc(s.script) + '</p>' +
      (a ? '' : '<h3>跟住做</h3><ol>' + s.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>') +
      '<h3>安全與停止條件</h3><p>' + esc(SkillArt.safetyNote(tid, i)) + '</p>' +
      '<h3>物資</h3><p>' + esc(s.mats.join('、') || '無額外物資') + '</p>' +
      '<p>觀察：' + esc(s.watch) + '</p>' +
      '<p class="p-foot">' + (a ? esc(a.credit)+'。' : support ? '參考圖片來源及界線見圖說。' : '') + '實際動作由領袖示範。對應綱要：' + esc(m.refs.join('／')) + '。出席或完成活動不等於獲章。</p></section>';
  },
  print: function (tid, i) {
    var html = SkillArt.sheet(tid, i);
    if (!html) { toast('找不到這節帶領卡'); return; }
    Practical.printModal('活動帶領卡', html);
  },
  /* 把圖接返入既有帶領畫面：投影頁嘅 .ldia 本來就讀 s.svg */
  apply: function () {
    DATA.meetings.forEach(function (m) {
      m.segs.forEach(function (s, i) {
        var a = SkillArt.get(m.tid, i);
        if (a) { s.svg = a.visual; s.art = a.id; }
        else { var support = SkillArt.support(m.tid,i); s.svg = support ? support.html : ''; }
      });
    });
  }
};
SkillArt.apply();
/* 活動卡（#play／#skills）同即用活動視窗都睇到圖，並可單印一張。 */
(function () {
  var act = App.activity;
  App.activity = function (tid, i) {
    var meeting = DATA.meetings.find(function (m) { return m.tid === tid; });
    if (!meeting || !meeting.segs[i]) return;
    act(tid, i);
    var a = SkillArt.get(tid, i);
    var el = document.getElementById('modal');
    if (!el || !el.querySelector) return;
    var box = el.querySelector('.mbox .modal-content');
    if (!box) return;
    var support = !a && SkillArt.support(tid,i);
    var extra = (a ? '<div class="skill-figure">' + a.visual + '<small class="skill-pan-hint">放大圖後可左右滑動查看細節</small><button class="btn sm ghost skill-zoom" onclick="SkillArt.zoom(\'' + tid + '\',' + i + ')">放大圖</button></div>' : support ? support.html : '') +
      '<div class="quick"><button class="btn" onclick="SkillArt.print(\'' + tid + '\',' + i + ')">🖨️ '+(a?'印呢張圖解卡':'印呢張帶領卡')+'</button></div>';
    if (support && support.episode !== undefined) {
      extra += '<div class="quick"><button class="btn gr" onclick="Jungle.open('+support.episode+')">逐段讀故事＋提問</button></div>';
    }
    if (a || (tid==='c26'&&Number(i)===2) || (tid==='c27'&&Number(i)===1)) {
      box.classList.add('skill-reader');
      var safety = box.querySelector(':scope > .safe');
      if (safety) safety.textContent = SkillArt.safetyNote(tid, i);
      var detail = document.createElement('details');
      detail.className = 'skill-instructions';
      detail.innerHTML = '<summary>展開文字帶法／口令</summary>';
      var say = box.querySelector(':scope > .say');
      var steps = box.querySelector(':scope > .lsteps, :scope > ol');
      if (say) detail.appendChild(say);
      if (steps) detail.appendChild(steps);
      box.appendChild(detail);
    }
    var heading = box.querySelector(':scope > h2');
    var meta = heading && heading.nextElementSibling;
    if (meta) meta.insertAdjacentHTML('afterend', extra);
    else box.insertAdjacentHTML('afterbegin', extra);
  };
  SkillArt.zoom = function (tid, i) {
    var a = SkillArt.get(tid, i);
    if (!a) return;
    var m = DATA.meetings.find(function (x) { return x.tid === tid; });
    Modal.open('<h2>' + esc(m.segs[i].n) + '｜放大圖</h2><div class="skill-zoomwrap">' + a.visual + '</div><p class="mut">' + esc(a.credit) + '</p><div class="quick"><button class="btn" onclick="App.activity(\'' + tid + '\',' + i + ')">返帶領卡</button><button class="btn" onclick="SkillArt.print(\'' + tid + '\',' + i + ')">印呢張圖解卡</button></div>');
  };
})();
