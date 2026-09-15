/* Text-first Jungle Book teaching adaptation. Artwork inventory is NOT a visual approval. */
DATA.jungle = {
  source: 'https://prog.scouting.org.hk/cub/the-jungle-book/',
  sourceNote: '角色及情節依幼童軍支部「森林故事」網頁核對；以下為簡短教學改寫，省略暴力細節。該舊網頁的年齡介紹不作現行支部年齡依據。',
  characters: [
    {id:'mowgli',img:'assets/jungle/mowgli.avif',name:'毛吉利',english:'Mowgli',gender:'男孩',visual:'男孩；人類孩子；非童軍制服；簡單森林衣著',kind:'人類孩子',role:'由狼家庭照顧，在森林中學習規律及與朋友相處。',question:'毛吉利是小狼，還是人類孩子？',answer:'是人類孩子；他得到狼家庭照顧及狼群接納。',check:'入狼群情節用幼年版本；青年版本另用於成長故事。'},
    {id:'raksha',img:'assets/jungle/raksha.avif',name:'駱石',english:'Raksha',gender:'母狼',visual:'雌性母狼；自然狼形；非人類服裝',kind:'母狼',role:'照顧及保護毛吉利的母狼。',question:'誰在狼家庭中照顧毛吉利？',answer:'父狼和母狼照顧他；母狼名叫駱石。',check:'不要與狼群首領亞基拿混淆。'},
    {id:'akela',img:'assets/jungle/akela.avif',name:'亞基拿',english:'Akela',gender:'雄狼',visual:'雄性狼；狼群首領；自然狼形；非人類服裝',kind:'狼群首領',role:'主持狼群集會並保護毛吉利，不是老虎，也不稱叢林之王。',question:'亞基拿在狼群中負責甚麼？',answer:'他是狼群領袖，在集會中處理狼群事務。',check:'狼的特徵及首領氣質要清楚，不靠皇冠認身份。'},
    {id:'baloo',img:'assets/jungle/baloo.avif',name:'白勞',english:'Baloo',gender:'雄性棕熊',visual:'雄性棕熊；自然熊形；非人類服裝',kind:'棕熊',role:'教導毛吉利及小狼森林規律的老師。',question:'誰願意教毛吉利森林規律？',answer:'白勞；他也曾在毛吉利加入狼群時為他說話。',check:'應辨認為棕熊；不要只以電影唱歌角色作設定。'},
    {id:'bagheera',img:'assets/jungle/bagheera.avif',name:'白基拿',english:'Bagheera',gender:'雄性黑豹',visual:'雄性黑豹；自然黑豹形；非人類服裝',kind:'黑豹',role:'保護及幫助毛吉利，在加入狼群和尋回他的故事中出力。',question:'白基拿是甚麼動物？',answer:'黑豹，不是老虎或狼。',check:'保持黑豹輪廓；不同中文譯名以本教材索引統一。'},
    {id:'sherekhan',img:'assets/jungle/sherekhan.avif',name:'施亞汗',english:'Shere Khan',gender:'雄性老虎',visual:'雄性孟加拉虎；自然虎形；非人類服裝',kind:'老虎',role:'威脅毛吉利的老虎，故事中的衝突角色。',question:'讓毛吉利遇到危險的老虎叫甚麼名字？',answer:'施亞汗。',check:'可以有威脅感，但不用流血、撕咬或過度驚嚇畫面。'},
    {id:'kaa',img:'assets/jungle/kaa.avif',name:'卡',english:'Kaa',gender:'大蟒蛇',visual:'大蟒蛇；自然蛇形；非人類服裝',kind:'大蟒蛇',role:'在猴群事件中協助白勞及白基拿救回毛吉利，後來與毛吉利成為朋友。',question:'在這個森林故事中，卡有沒有幫助毛吉利？',answer:'有；不要套用其他電影版本的敵人設定。',check:'不能畫成只想欺騙毛吉利的反派；不演勒頸動作。'},
    {id:'chil',img:'assets/jungle/chil.avif',name:'施露',english:'Chil',gender:'雄性鳶',visual:'鳶；自然鳥形；非人類服裝',kind:'鳶',role:'從空中觀察，在毛吉利被猴群帶走時傳遞求助消息。',question:'誰幫毛吉利把消息帶給朋友？',answer:'施露，是鳶。',check:'不是貓頭鷹或鸚鵡；圖卡標字應寫「鳶」。'},
    {id:'banderlog',img:'assets/jungle/banderlog.avif',name:'賓廸洛',english:'Bander-log',gender:'猴群',visual:'一群猴子；不是單一猴王；自然猴形；非人類服裝',kind:'猴群',role:'把毛吉利帶到猴子鎮的猴群；不是單一猴王。',question:'賓廸洛是一個名字，還是一群猴子？',answer:'這裏指猴群；可以用多隻猴子表達。',check:'檔名「賓迪洛／賓廸洛」是同一索引；避免加入電影猴王。'},
    {id:'hathi',img:'assets/jungle/hathi.avif',name:'哈蒂',english:'Hathi',gender:'雄性大象',visual:'雄性亞洲象；自然象形；非人類服裝',kind:'大象',role:'在旱災時提出水邊停戰，讓動物取水的大象。',question:'哈蒂提出水邊停戰，是為了甚麼？',answer:'讓動物在缺水時可以取水，不在水邊爭鬥。',check:'延伸角色，不硬插入毛吉利初入狼群的場景。'},
    {id:'tabaqui',img:'assets/jungle/tabaqui.avif',name:'戴白祺',english:'Tabaqui',gender:'雄性豺',visual:'雄性豺；自然豺形；非人類服裝',kind:'豺',role:'與施亞汗相關、搬弄是非的角色；討論行為，不把動物種類等同好壞。',question:'聽到未核實的傳言，應該怎樣做？',answer:'先核實，不散播，不用故事角色名稱取笑隊友。',check:'辨認為豺；不要直接稱為狐狸或普通家犬。'}
  ],
  /* 投屏講故事：每段一張大圖（img 用 assets/jungle/slides/ 內嘅 AVIF），文字依總會《森林故事》
     內容改寫（《香港童軍》月刊第158–170期版本），省略暴力細節，保留情節次序。
     pendingArt：已安排但未出圖嘅段落（繪圖有每輪上限，分批補）；出圖後由清單移除。 */
  /* 旁白錄音：每集可有多種語言，每種語言可以分幾段（播放器會自動接落去）。
     廣東話照用，但廣東話 TTS 讀書面語會生硬，畫面上會提示領袖可以自己講。 */
  narration: {
    langs: [['zh','普'],['en','EN'],['yue','粵']],
    pending: [],
    /* 粵語版係系統合成聲音：句子已經寫成口語，但語氣可能仍然偏生硬；領袖自己講通常最自然。 */
    langNotes: {yue:'粵語版本係系統合成聲音，語氣可能偏生硬；想更自然可以由領袖自己照文字講。'},
    files: {
      /* 成集聲只保留「逐段仲未錄齊」嘅語言（避免重複佔位）：
         逐段錄齊嘅語言，整集模式會用逐段接住播，聽落一樣，但唔會多一套檔。 */
      welcome: {zh:[], en:[], yue:[]},
      help:    {zh:[], en:[], yue:[]},
      rules:   {zh:[], en:['assets/jungle/audio/rules-en.mp3'], yue:[]},
      fire:    {zh:[], en:['assets/jungle/audio/fire-en-1.mp3','assets/jungle/audio/fire-en-2.mp3'], yue:[]},
      village: {zh:[], en:['assets/jungle/audio/village-en-1.mp3','assets/jungle/audio/village-en-2.mp3'], yue:[]}
    }
  },
  pendingArt:[],
  /* 逐段旁白：scene 對應每段（唔計封面），null = 未錄，播放器會提示改用「整集連續播」。
     scenePending 記錄仲未錄完嘅集數／語言，補完之後由清單移除。 */
  sceneAudio: {
    welcome: {yue:['assets/jungle/audio/scene/welcome-1-yue.mp3','assets/jungle/audio/scene/welcome-2-yue.mp3','assets/jungle/audio/scene/welcome-3-yue.mp3','assets/jungle/audio/scene/welcome-4-yue.mp3','assets/jungle/audio/scene/welcome-5-yue.mp3','assets/jungle/audio/scene/welcome-6-yue.mp3'],
              zh:['assets/jungle/audio/scene/welcome-1-zh.mp3','assets/jungle/audio/scene/welcome-2-zh.mp3','assets/jungle/audio/scene/welcome-3-zh.mp3','assets/jungle/audio/scene/welcome-4-zh.mp3','assets/jungle/audio/scene/welcome-5-zh.mp3','assets/jungle/audio/scene/welcome-6-zh.mp3'], en:['assets/jungle/audio/scene/welcome-1-en.mp3','assets/jungle/audio/scene/welcome-2-en.mp3','assets/jungle/audio/scene/welcome-3-en.mp3','assets/jungle/audio/scene/welcome-4-en.mp3','assets/jungle/audio/scene/welcome-5-en.mp3','assets/jungle/audio/scene/welcome-6-en.mp3']},
    help:    {yue:['assets/jungle/audio/scene/help-1-yue.mp3','assets/jungle/audio/scene/help-2-yue.mp3','assets/jungle/audio/scene/help-3-yue.mp3','assets/jungle/audio/scene/help-4-yue.mp3','assets/jungle/audio/scene/help-5-yue.mp3','assets/jungle/audio/scene/help-6-yue.mp3','assets/jungle/audio/scene/help-7-yue.mp3'],
              zh:['assets/jungle/audio/scene/help-1-zh.mp3','assets/jungle/audio/scene/help-2-zh.mp3','assets/jungle/audio/scene/help-3-zh.mp3','assets/jungle/audio/scene/help-4-zh.mp3','assets/jungle/audio/scene/help-5-zh.mp3','assets/jungle/audio/scene/help-6-zh.mp3','assets/jungle/audio/scene/help-7-zh.mp3'], en:['assets/jungle/audio/scene/help-1-en.mp3','assets/jungle/audio/scene/help-2-en.mp3','assets/jungle/audio/scene/help-3-en.mp3','assets/jungle/audio/scene/help-4-en.mp3','assets/jungle/audio/scene/help-5-en.mp3','assets/jungle/audio/scene/help-6-en.mp3','assets/jungle/audio/scene/help-7-en.mp3']},
    rules:   {yue:['assets/jungle/audio/scene/rules-1-yue.mp3','assets/jungle/audio/scene/rules-2-yue.mp3','assets/jungle/audio/scene/rules-3-yue.mp3','assets/jungle/audio/scene/rules-4-yue.mp3'], zh:['assets/jungle/audio/scene/rules-1-zh.mp3','assets/jungle/audio/scene/rules-2-zh.mp3','assets/jungle/audio/scene/rules-3-zh.mp3','assets/jungle/audio/scene/rules-4-zh.mp3'], en:['assets/jungle/audio/scene/rules-1-en.mp3','assets/jungle/audio/scene/rules-2-en.mp3','assets/jungle/audio/scene/rules-3-en.mp3',null]},
    fire:    {yue:['assets/jungle/audio/scene/fire-1-yue.mp3','assets/jungle/audio/scene/fire-2-yue.mp3','assets/jungle/audio/scene/fire-3-yue.mp3','assets/jungle/audio/scene/fire-4-yue.mp3','assets/jungle/audio/scene/fire-5-yue.mp3'], zh:['assets/jungle/audio/scene/fire-1-zh.mp3','assets/jungle/audio/scene/fire-2-zh.mp3','assets/jungle/audio/scene/fire-3-zh.mp3','assets/jungle/audio/scene/fire-4-zh.mp3','assets/jungle/audio/scene/fire-5-zh.mp3'], en:[null,null,null,null,null]},
    village: {yue:['assets/jungle/audio/scene/village-1-yue.mp3','assets/jungle/audio/scene/village-2-yue.mp3','assets/jungle/audio/scene/village-3-yue.mp3','assets/jungle/audio/scene/village-4-yue.mp3','assets/jungle/audio/scene/village-5-yue.mp3'], zh:['assets/jungle/audio/scene/village-1-zh.mp3','assets/jungle/audio/scene/village-2-zh.mp3','assets/jungle/audio/scene/village-3-zh.mp3','assets/jungle/audio/scene/village-4-zh.mp3','assets/jungle/audio/scene/village-5-zh.mp3'], en:[null,null,null,null,null]},
  },
  /* 粵語 27 段全部完成；普通話、英文逐段繼續補。 */
  scenePending: ['rules:en','fire:en','village:en'],
  /* 環境音：原創程序合成（tools/make-ambience.mjs），細音量墊底，唔會蓋過人聲。 */
  ambience: {night:'assets/jungle/ambience/jungle-night.mp3', day:'assets/jungle/ambience/jungle-day.mp3', leaves:'assets/jungle/ambience/leaves.mp3', fire:'assets/jungle/ambience/fire-crackle.mp3'},
  decks: {
    welcome: {cover:'jungle-wolf-carry', amb:'night', subtitle:'狼家庭收留一個小人兒，狼群大會上有人為他說話。'},
    help:    {cover:'jungle-water-snake', amb:'day', subtitle:'白勞教森林規律：先觀察、先問，遇事識得求助。'},
    rules:   {cover:'jungle-forest-rules', amb:'day', subtitle:'森林規律唔係禁令，而係同人相處嘅方法。'},
    fire:    {cover:'jungle-red-flower', amb:'fire', subtitle:'一枝紅花、一場特別集會，毛吉利要保護亞基拿。'},
    village: {cover:'jungle-carry-on', amb:'day', subtitle:'回到人類村莊，毛吉利帶住學過嘅事繼續向前。'}
  },
  episodes: [
    {id:'welcome',title:'毛吉利加入狼群',refs:['會員章 e(i)','會員章 e(ii)'],characters:['mowgli','raksha','akela','baloo','bagheera','sherekhan'],scenes:[
      {title:'森林裏的晚上',amb:'night',img:'jungle-night-tiger',cast:['sherekhan','raksha'],text:'印度森林一個悶熱的晚上，老虎施亞汗在獵食。牠的叫聲傳到狼洞，父狼聽得出：牠今晚獵的是「人」。父狼跑出洞外，看見施亞汗在樵夫營旁的火邊踱步，撲上去時被營火燒傷了腳。',question:'父狼聽到施亞汗的叫聲，為甚麼要走出洞外？',answer:'牠聽出老虎要襲擊人，立即出去看清楚、保護人。',lesson:'留意四周、關心身邊的人；聽到可疑聲音要告訴成人。'},
      {title:'洞口的小人兒',amb:'leaves',img:'jungle-wolf-carry',cast:['mowgli','raksha'],text:'叢林裏沙沙作響，父狼立刻作好準備，千鈞一髮之際止住腳步——爬出來的竟然是一個小人兒。父狼把他銜回狼洞，交給母狼駱石照顧。',question:'父狼在叢林裏遇到誰？他怎樣做？',answer:'他遇到一個小嬰兒，把他銜回狼洞交母狼照顧。',lesson:'現實中遇到走失兒童，留在安全位置並找成人幫忙，不自行帶走。'},
      {title:'老虎來到洞口',amb:'night',img:'jungle-tiger-cave',cast:['mowgli','raksha','sherekhan'],text:'施亞汗來到洞口，要取回牠的「晚餐」。父狼母狼護住孩子，不肯交出；施亞汗想硬衝進去，但洞口太窄，牠只好氣憤地走了。',question:'為甚麼施亞汗入不了狼洞？',answer:'洞口太窄，父狼母狼又守住不肯交出孩子。',lesson:'保護年幼的人要企硬但唔動武，有事就搵可靠嘅成人。'},
      {title:'到狼群集會',amb:'night',img:'jungle-council',cast:['mowgli','raksha','akela'],text:'小狼學會走路之後，父狼在群眾大會的晚上，帶着母狼、小狼和毛吉利到集會的地方。集會在小山頂上，狼領袖亞基拿躺在岩石上，百多隻狼圍着牠。',question:'狼群在哪裏集會？誰主持？',answer:'在小山頂；狼群領袖亞基拿躺在岩石上主持。',lesson:'集會有規矩：先聽領袖講，再有秩序發言。'},
      {title:'有人願意支持',amb:'night',img:'jungle-presented',cast:['mowgli','baloo','bagheera','akela'],text:'父狼把毛吉利推出去讓狼群認識，但狼群不肯接納。按森林規則，至少要兩位會員作擔保：棕熊白勞走出來說好話，願意教他；黑影中的黑豹白基拿更願意加一頭死牛作擔保。議論過後，毛吉利加入狼群。',question:'哪兩位願意擔保毛吉利？白勞答應做甚麼？',answer:'白勞和白基拿；白勞答應教導他。',lesson:'支持唔係講句好話就算，而係肯承擔、持續幫手。'},
      {title:'在白勞家生活',amb:'day',img:'jungle-den-family',cast:['mowgli','raksha','baloo'],text:'毛吉利在森林生活，漸漸長大。他生性頑皮，母狼和父狼商量之後，把他寄養在白勞家。白勞熟識森林規律，人人都叫他老師，母狼父狼都很放心。',question:'為甚麼把毛吉利交給白勞照顧？',answer:'白勞熟識森林規律，又常常教小狼，父狼母狼放心。',lesson:'學習要有人帶；我哋都可以做願意帶新朋友嘅嗰個。'}]},
    {id:'help',title:'森林生活：學習與求助',refs:['2.4.2(a)（故事支援）','會員章 e(ii)（角色重溫）'],characters:['mowgli','baloo','bagheera','banderlog','chil','kaa'],scenes:[
      {title:'白勞的課堂',amb:'day',img:'jungle-baloo-lesson',cast:['mowgli','baloo'],text:'白勞每天都帶毛吉利到森林裏，認識不同事物和其中的規律。有一天，他們見到一棵枝葉茂盛的樹，毛吉利一手就把樹幹抓開——原來內裏已經爛了。白勞說：「有時要小心分辨：外觀很好，內裏可能一團糟。」',question:'樹的外觀和內裏有甚麼不同？',answer:'外面枝葉茂盛，內裏已經爛；要睇清楚才判斷。',lesson:'唔好只睇表面；買嘢、交朋友、睇消息都一樣。'},
      {title:'雄蜂與蝙蝠',amb:'day',img:'jungle-bees-bat',cast:['mowgli','baloo'],text:'他們遇上雄蜂。白勞小心翼翼同雄蜂打招呼，沒有慌張走避——否則雄蜂會成群追來。就在這時，毛吉利看中了倒吊在樹上睡覺的蝙蝠，把牠吵醒；白勞連忙叫他道歉，不然蝙蝠一定報復。',question:'吵醒了蝙蝠之後，白勞叫毛吉利做甚麼？',answer:'即刻道歉。',lesson:'尊重別人休息同空間；現實中唔騷擾野生動物。'},
      {title:'湖邊的水蛇',amb:'day',img:'jungle-water-snake',cast:['mowgli','baloo'],text:'來到湖邊，毛吉利見到水蛇正在湖中暢泳，本想跳落水一齊游，忽然記起白勞的話：「先在岸邊同人家問句好，得到同意才好下水，否則水蛇會把你捲到水底。」他打了個冷顫，乖乖同水蛇打招呼。',question:'毛吉利下水前做了甚麼？',answer:'先同水蛇打招呼，得到同意才下水。',lesson:'借用別人嘅地方或物品，先問一句，係尊重。'},
      {title:'各自的獵場',amb:'day',img:'jungle-hunting-grounds',cast:['mowgli','baloo'],text:'白勞又講：每隻動物都有自己的獵場。在自己的獵場找不到食物，可以過去捕獵，但要站在邊界上大聲打招呼，得到同意才能進入。白勞把這些規律細細說給毛吉利聽，又教他鳥獸的密語和暗號。毛吉利覺得枯燥乏味，天氣又熱，不一會就睡着了。',question:'想進入別人的獵場，第一步係咩？',answer:'站在邊界打招呼，得到同意才進入。',lesson:'界線要問過先過；唔問就闖入，別人會唔舒服。'},
      {title:'被猴群帶走',amb:'leaves',img:'jungle-monkeys',cast:['mowgli','banderlog'],text:'今天，毛吉利、白勞和亞基拿在樹蔭下睡覺時，猴子們把毛吉利帶了去。他不知怎樣是好，途中遇到鳶鳥施露，向牠求救。',question:'毛吉利睡醒時發生咩事？他向誰求救？',answer:'猴子們把他帶走；他向鳶鳥施露求救。',lesson:'遇事要即時求助，講清楚位置同發生咩事。'},
      {title:'施露傳消息',amb:'day',img:'jungle-kite-message',cast:['mowgli','chil','baloo','bagheera'],text:'施露跟着猴子們到猴子鎮去。白勞和白基拿雖然拼命追，也追不上，便去找卡；牠們從施露口中知道毛吉利的下落，一同朝猴子鎮進發。',question:'施露幫毛吉利做了甚麼？',answer:'把毛吉利的消息帶給白勞和白基拿。',lesson:'傳消息要準確：邊個、喺邊、發生咩事。'},
      {title:'朋友一起幫忙',amb:'day',img:'jungle-kaa-rescue',cast:['mowgli','baloo','bagheera','kaa'],text:'白勞和白基拿與幾百隻猴子搏鬥，已經皮破血流、筋疲力盡。卡一出現，猴子們嚇得魂飛魄散；卡叫白勞和白基拿快帶毛吉利走。牠們走後，猴子們怕被卡吞食，為了討好卡，只好跟着牠跳舞。毛吉利終於重新與朋友會合。',question:'卡出現之後，毛吉利點樣離開？',answer:'卡叫白勞和白基拿把握時機帶他走。',lesson:'省略打鬥及吞食細節；不模仿搏鬥、蛇纏身或催眠動作。'}]},
    {id:'rules',title:'白勞的森林規律',refs:['會員章 e(ii)','森林故事文字'],characters:['mowgli','baloo','bagheera'],scenes:[
      {title:'先觀察，再行動',amb:'day',img:'jungle-forest-rules',cast:['mowgli','baloo'],text:'白勞帶毛吉利認識森林。毛吉利學到：遇到陌生動物、陌生地方或不熟悉的事，要先觀察、先問，再決定怎樣做。',question:'遇到未見過嘅事物，第一步可以做咩？',answer:'先停一停、觀察環境，向合適嘅人查問。',lesson:'森林規律係故事設定；現實活動跟領袖安全指示，唔接觸野生動物。'},
      {title:'不同地方有不同規矩',amb:'day',img:'jungle-water-snake',cast:['mowgli','baloo','bagheera'],text:'森林裏每種動物都有自己的地方。毛吉利明白，想進入別人的地方要先打招呼、尊重界線，唔可以因為自己想玩就闖入。',question:'為甚麼要先打招呼、得到同意？',answer:'要尊重別人嘅地方同安全界線。',lesson:'連回小隊生活：先問才借物、先聽清楚才開始遊戲。'},
      {title:'密語不是秘密行動',amb:'leaves',img:'jungle-monkeys',cast:['mowgli','baloo'],text:'白勞教毛吉利分辨不同聲音和傳訊方法。毛吉利知道，學到的訊息要用來求助和合作，唔係用來瞞住領袖獨自行動。',question:'需要幫忙時，應把消息話畀邊個？',answer:'話畀在場可信任嘅領袖或成人，講清楚位置同需要。',lesson:'唔教成員模仿野生動物叫聲，也不把密語當作避開成人嘅方法。'},
      {title:'學習需要練習',amb:'day',img:'jungle-council',cast:['mowgli','baloo','bagheera'],text:'毛吉利有時覺得規律沉悶，但白勞提醒他：學習係為咗日後照顧自己、幫助朋友。白基拿也提醒他，聰明唔代表可以跳過安全步驟。',question:'學識規律，將來可以點幫自己？',answer:'遇到新情況時可以較安全咁作決定，亦知道幾時求助。',lesson:'唔以一次答錯判定能力；可以用講、畫或者示範表達。'}]},
    {id:'fire',title:'火種與離開狼群',refs:['森林故事文字','團體生活討論'],characters:['mowgli','akela','baloo','bagheera','sherekhan'],scenes:[
      {title:'狼群出現分歧',amb:'night',img:'jungle-pack-split',cast:['akela','sherekhan','bagheera'],text:'毛吉利已經十一、二歲，身體結實，眼光令其他狼群害怕。亞基拿年老衰弱，施亞汗乘機煽動年青的狼群起來反叛，還要把毛吉利一併殺掉。白基拿把這個消息告訴毛吉利，叫他到人類村子取神奇的紅花。',question:'施亞汗用咩方法對付毛吉利？',answer:'煽動年青狼群反叛亞基拿，並要一併殺掉毛吉利。',lesson:'有人煽動時要停一停、核實消息，唔好跟着起鬨。'},
      {title:'紅花是火',amb:'fire',img:'jungle-red-flower',cast:['mowgli','bagheera'],text:'毛吉利去到村子，看見村婦把黑土壤般的東西擲進壺子，小孩把樹枝放進去，紅花便開得很茂盛。這不是甚麼神奇紅花，其實就是人類所說的火，所以森林裏的動物都怕它、躲避它。',question:'森林動物講嘅「紅花」其實係咩？',answer:'係火；動物都怕火。',lesson:'火有力量但要由成人按安全規定管理；唔玩火、唔用火嚇人。'},
      {title:'特別集會',amb:'night',img:'jungle-faceoff',cast:['mowgli','akela','baloo','bagheera','sherekhan'],text:'毛吉利在途中知道亞基拿跌入施亞汗和狼群的陷阱，獵不到大鹿，還負了重傷，狼群要處死牠。毛吉利取了紅花，同白基拿商量一會，一齊到狼族的特別集會。會場中央站着的並非亞基拿，而是施亞汗。',question:'特別集會上，企在中央嘅係邊個？',answer:'施亞汗；亞基拿受了重傷，狼群要處死牠。',lesson:'遇到不公平嘅事，先了解清楚再諗辦法，唔自己一個衝。'},
      {title:'保護亞基拿',amb:'fire',img:'jungle-fire-branch',cast:['mowgli','akela','sherekhan'],text:'毛吉利非常傷心，忍不住落淚。他憤怒地把盛着紅花的壺摔在地上，頓時火花四散，點着雜草，狼群嚇得往後退。他隨手拿起燃燒的樹枝，走向狼群中間，狼群非常害怕。他想起罪魁禍首是施亞汗，手執牠的鬍子揮動火炬，打到牠焦頭爛額，命令牠離開，還說再見到牠就會剝下牠的皮。',question:'毛吉利點樣令狼群停手？',answer:'用火光嚇退狼群，再趕走施亞汗，並叫大家唔可以傷害亞基拿。',lesson:'故事用誇張方法處理衝突；現實遇到欺凌或危險要退到安全位置再求助，唔自行對打。'},
      {title:'離開狼群',amb:'leaves',img:'jungle-farewell',cast:['mowgli','akela','baloo','bagheera'],text:'毛吉利轉向狼群，告訴牠們絕對不能傷害亞基拿，說罷揮動火炬把狼群趕走，周圍恢復了原來的寂靜。他向亞基拿、白基拿和保護過他的狼群告別，懷着悲憤的心情走向人類的村莊。',question:'毛吉利離開時帶走咗咩？',answer:'朋友的教導、森林規律同成長經驗。',lesson:'離開唔代表否定以前嘅家；可以告別、感謝，再安排支援。'}]},
    {id:'village',title:'回到人類社會',refs:['森林故事文字','會員章 e(ii)'],characters:['mowgli','baloo','bagheera','sherekhan'],scenes:[
      {title:'美修娃的兒子',amb:'day',img:'jungle-village',cast:['mowgli','baloo'],text:'毛吉利走到一塊大田園，人群聚集起來觀察他。一位身穿白衣的婦人美修娃走出來，用白布包着他的身體，說他就是她的兒子納都，年幼時給老虎擄走。毛吉利便住在美修娃家裏：第一晚因為不習慣被關在房內，撞窗爬出屋外，走到大草原上睡覺。',question:'美修娃話毛吉利係邊個？',answer:'係她年幼時被老虎擄走嘅兒子納都。',lesson:'新環境要時間適應；唔習慣可以講出嚟，搵人幫手。'},
      {title:'草原上的老師',amb:'night',img:'jungle-two-homes',cast:['mowgli','baloo'],text:'毛吉利的老師白勞早已在草原上等他，並約定每天都見面。可是做人要學的東西那麼多，毛吉利忙得抽不到時間與白勞見面。後來他被派去看管牛群，非常高興，因為可以再次返回大草原的懷抱。',question:'毛吉利點解高興去看管牛群？',answer:'因為可以再次返到大草原，見返白勞。',lesson:'掛住舊朋友係正常嘅；可以講出嚟，安排時間見面。'},
      {title:'施亞汗回來了',amb:'night',img:'jungle-tiger-return',cast:['mowgli','sherekhan','baloo','akela'],text:'白勞原來每天都在等毛吉利。這天牠帶來重要的消息：老虎施亞汗回來了，聲言要殺毛吉利。毛吉利想了一個計策要除去施亞汗，但需要白勞和亞基拿幫上一大把。',question:'白勞帶嚟咩消息？毛吉利點應對？',answer:'施亞汗回來要殺他；他先想好計策，再請朋友幫手。',lesson:'面對大問題要先計劃、分工合作，唔好一個人衝入危險。'},
      {title:'兩面夾攻',amb:'leaves',img:'jungle-herd-plan',cast:['mowgli','sherekhan','baloo','akela'],text:'毛吉利利用兇猛的牛群兩面夾攻施亞汗，把牠踩死。之後他剝下虎皮，讓亞基拿放在集會場地中央作為警戒，狼群再次團結起來，遵守森林規律，推舉亞基拿為牠們的領袖。',question:'毛吉利嘅計策係點做？',answer:'用牛群兩面夾攻，朋友幫手配合。',lesson:'呢段只講情節，唔描述獵殺細節，亦唔安排追逐或打鬥遊戲。'},
      {title:'帶著學過的事前行',amb:'day',img:'jungle-carry-on',cast:['mowgli','akela','baloo','bagheera'],text:'獵人想掠走施亞汗的屍首，但敵不過亞基拿，只好回村散播謠言，說毛吉利是惡魔、是狼養大的孩子，要把他趕走。人們用石頭擲向毛吉利，他非常傷心：在狼族因為係人類嘅兒子被趕走，在村莊又因為係狼養嘅孩子被逐。最後，他把虎皮帶回森林，放在集會場中央，請亞基拿向天長嘯三聲，把四散嘅狼群召回。毛吉利唱起描述施亞汗被殺情景嘅歌，狼群再次團結，遵守森林規律，推舉亞基拿為領袖。他偷偷擦掉眼淚，大步向前走；所有狼群都站起來，目送他離去。',question:'毛吉利離開之前做咗兩件事，係咩？',answer:'把虎皮放回集會場中央，唱歌說明經過，並請亞基拿召回狼群。',lesson:'成長唔係一個人變得無所不能，而係知道自己學過咩、仲需要咩幫助，以及點同唔同嘅人相處。'}]}
  ]
};
(function(){
  function reading(ep){return ep.scenes.map(function(s,i){return (i+1)+'｜'+s.title+'：'+s.text;}).join('\n');}
  var a=DATA.jungle.episodes[0],b=DATA.jungle.episodes[1];
  var first=lesson('c26','森林故事①：毛吉利加入狼群','彈性安排','會員章故事教學',a.refs,'認識故事角色，依次講述毛吉利加入狼群的經過。','每人辨認主要角色及動物，依四段順序重述；說出白勞和白基拿的支持。','本場支援會員章e，不等於全部會員章；角色數目不是自訂正式過關標準。','每次只展示三位角色，允許指認、口述或領袖代記。','比較白勞與白基拿如何提供不同支持，再用自己的話重述。',[
    activity('先認識六位角色',['用角色文字卡認識毛吉利、駱石、亞基拿、白勞、白基拿及施亞汗。','成員輪流配對名稱與身份；分清狼群首領、棕熊及黑豹。','兩人各說一個角色的作用，不以「好人／壞人」標籤同伴。'],'先講佢係邊個，再講佢幫過甚麼忙。','認識角色名稱與身份，不把毛吉利說成小狼。','不模仿咬、爬或抓人。',['A4紙','鉛筆']),
    activity('四段故事，停一停再問',[reading(a),'每段後依故事頁的提問停一停，先聽成員回答再展開答案。','第四段後請成員說誰照顧、誰支持毛吉利，領袖記錄仍混淆的地方。'],'聽到有人願意幫忙時，留意佢答應做甚麼。','能說出狼家庭照顧、兩位朋友支持及狼群接納的經過。','不展示血腥獵物；解釋故事中的牛不是現實中買朋友的方法。',[]),
    activity('排故事、迎新朋友',['將「被狼家庭照顧／到集會／朋友支持／獲接納」四張文字條打亂。','每人或兩人組排次序，用自己的話講，領袖個別確認理解。','提出一項歡迎新隊員的行動並試說一句友善邀請。'],'新朋友未識唔緊要，我哋可以點幫佢一齊學？','保留個人排序與口述記錄；接受非書寫表達。','不將真實成員扮成被投票排斥的人。',['A4紙','鉛筆'])],[],['圍坐故事區','桌面配對區'],'今次用森林故事學接納與互助，毋須購買卡牌；可用文字卡參與。');
  var second=lesson('c27','森林故事②：朋友、規律與求助','彈性安排','歷奇章故事支援',b.refs,'講述毛吉利的森林生活，辨認傳信者與幫助者。','每人用四段重述求助經過；説明白勞、施露及卡的作用。','支援2.4.2(a)，團呼意義及正式儀式仍須另核，不以這場故事活動代替全部2.4.2。','每段只問一題，用名稱卡幫助表達。','比較故事求助與現實求助，說出不能模仿的情節。',[
    activity('森林生活：規律有甚麼用',[reading(b),'逐段用故事頁提問，確認賓廸洛是猴群、施露是鳶、卡有提供幫助。','請成員各說一句學習或求助能幫忙的情況。'],'故事可以想像，但現實求助要找可信任嘅大人。','能依序講出學習、被帶走、傳信、獲救。','不把遇險歸咎於毛吉利未認真學習，不嚇唬成員。',[]),
    activity('消息要說清楚',['用虛構情境：「我在旅部門口，與帶領成人分開了，需要幫忙」。','兩人輪流作求助者及聆聽的成人，說清位置、事情與需要。','比較施露的故事角色與現實成人支援，不讓成員外出找人演練。'],'先留喺安全位置，再講清楚你喺邊同發生咩事。','能說清位置及需要，知道持續向適當成人求助。','不用真實私人資料，不演追逐、捆綁或獨自救援。',[]),
    activity('角色配對與小隊回顧',['將毛吉利、施露、白勞、白基拿及卡配到求助者、傳信者、幫助者。','每人說明一個配對理由，領袖展開角色答案作核對。','各隊提出一項小隊互助約定，記下未懂的角色或情節下次重溫。'],'每個角色可以用唔同方法幫忙，我哋都可以各盡所能。','角色配對有理由，不只猜名字。','不用猴群或老虎名稱取笑成員。',['A4紙','鉛筆'])],[],['安靜故事圈','室內桌面配對位置'],'今次講森林生活與求助，不演綁架、搏鬥或蛇纏身；成員可選擇旁聽。');
  first.worksheet={title:first.n+'｜排序與角色',prompts:['配對：毛吉利、駱石、亞基拿、白勞、白基拿各是誰？','排序並重述：朋友支持／獲接納／狼家庭照顧／到狼群集會。','白勞答應做甚麼？我會怎樣迎接新隊員？']};
  second.worksheet={title:second.n+'｜故事與求助',prompts:['用四段重述毛吉利如何與朋友重新會合：','誰求助、誰傳信、誰幫忙？卡在這段故事做了甚麼？','現實中需要求助時，我會找誰及說清甚麼？不用寫私人聯絡資料。']};
  DATA.meetings.push(first,second);
  DATA.facts.akela='亞基拿（Akela）是狼群首領；白勞（Baloo）是教規律的棕熊；白基拿（Bagheera）是保護毛吉利的黑豹。毛吉利由狼家庭照顧，得到白勞及白基拿支持後加入狼群。完整文字帶領見森林故事頁。';
})();
// Replace the earlier placeholder story segment with the now source-checked narrative.
(function(){
  var m=DATA.meetings.find(function(x){return x.tid==='c14';});
  if(!m)return;
  m.gap='人物生平及領袖肩章等其他會員章細項仍須補足；完整加入狼群故事可接c26，不以本場一次涵蓋全部會員章。';
  m.segs[3]=activity('毛吉利得到接納',['父狼和母狼駱石照顧毛吉利，後來帶他到亞基拿主持的狼群集會。','白勞願意教他森林規律，白基拿也提供支持；狼群同意讓毛吉利加入。','請成員說出毛吉利是人類孩子、亞基拿是狼群首領，以及兩位支持者；再提出一項迎新做法。'],'新朋友可以慢慢學，我哋可以點樣接納佢？','能說出照顧者、兩位支持者及接納的結果；需要完整排序練習可接c26。','不演驅趕或排斥真實成員；不把故事中的代價說成購買朋友。',[]);
})();
