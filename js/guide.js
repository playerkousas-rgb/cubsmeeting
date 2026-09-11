/* Each activity owns its instructions. Never infer a ritual or medical lesson from keywords. */
var Guide = {
  forStage: function(st) {
    var steps=st.steps || ['先說明目標及安全約定。','由合適領袖示範，再按成員能力輪流練習。','按實際表現回顧並記下需要跟進的部分。'];
    return {lead:st.watch || '觀察每位成員的實際參與，不用全隊完成代替個人能力。',
      steps:steps.map(function(s,i){return [String(i+1),['👀','🙌','✅'][i]||'📋','第'+(i+1)+'步',s];}),
      say:st.script || '「唔肯定就停低問領袖。」',watch:st.watch || '',safety:st.safety || '由合適領袖按場地與個別需要評估安全。'};
  }
};
