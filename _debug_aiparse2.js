const fs = require('fs');
const html = fs.readFileSync('/workspace/kitchen_inventory.html','utf8');
const m = html.match(/<script>\s*\(function\(\)\{([\s\S]*?)\}\)\(\);\s*<\/script>/);
const code = m[1];
const fnStart = code.indexOf('function aiParseText(raw)');
const renderStart = code.indexOf('function renderAiPreview(');
const aiBody = code.slice(fnStart, renderStart);
const ci = code.indexOf('var COMMON_ING_HINTS=');
const ciEnd = code.indexOf(';\n', ci)+2;
const commonSrc = code.slice(ci, ciEnd);

const sample = `【土豆烧牛肉超下饭版】🔥零失败家常硬菜！

哈喽大家好~ 今天分享一道全家人都爱的土豆烧牛肉，做法简单，炖一锅连汤汁都要拌饭吃光！

🥘食材准备：
牛肋条 500g、土豆 2个、胡萝卜 1根
洋葱 半个、大葱 1段、姜 3片、蒜 5瓣
八角 2颗、香叶 2片、干辣椒 3个（可选）
生抽 2勺、老抽 1勺、蚝油 1勺
黄豆酱 1大勺、冰糖 5g、盐 适量

👩‍🍳做法步骤：
1. 牛肉切2厘米方块，冷水下锅，加葱结姜片料酒，焯水3分钟捞出用温水冲净血沫。
2. 土豆胡萝卜切滚刀块，洋葱切丝，葱姜蒜切好备用。
3. 锅烧热倒少许油，下冰糖小火炒出糖色，呈枣红色冒小泡时，立刻倒入牛肉翻炒均匀上色。
4. 加葱姜蒜八角香叶干辣椒炒香，再放黄豆酱、生抽、老抽、蚝油，翻炒1分钟让肉裹满酱汁。
5. 倒入没过牛肉的热水，大火烧开后转最小火，盖盖炖60分钟。
6. 开盖放入土豆胡萝卜，加少许盐调味，翻匀后继续炖15-20分钟，直到土豆软烂。
7. 最后转大火收汁，汤汁浓稠裹住食材就可以出锅啦！撒点葱花点缀，配米饭绝了~

💡小Tips：炖牛肉一定要用热水，肉质才不柴；喜欢吃辣的朋友豆瓣酱可以换成郫县豆瓣酱哦！`;

eval(commonSrc + '\n' + aiBody);
// 手动跑 aiParseText 里的块分类逻辑
(function(){
  let raw = sample.replace(/\r/g,'').trim();
  raw=raw.replace(/[\u3000\u00a0]/g,' ').replace(/[ \t]+/g,' ').trim();
  var headerWords=['食材准备','所需食材','准备食材','食材清单','食材明细','准备工作','准备材料','配料表','配菜清单','用料清单','小提示','小贴士','温馨提示','注意事项','小技巧','食材','用料','材料','原料','主料','辅料','配料','调料','调味','准备','做法','制作方法','烹饪方法','制作步骤','做法步骤','烹饪步骤','详细步骤','操作步骤','操作流程','制作流程','烹饪教程','做法教程','步骤','流程','教程','下厨','Tips','tips','TIPS','提示'];
  headerWords.sort(function(a,b){ return b.length-a.length; });
  headerWords.forEach(function(w){
    var escaped=w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    var re=new RegExp('([^\\n\\s])\\s*('+escaped+'\\s*[:：]?)','g');
    raw=raw.replace(re, function(m, prev, kw){
      var cc=prev.charCodeAt(0);
      if(cc>=0xD800 && cc<=0xDBFF) return m;
      return prev + '\n' + kw;
    });
  });
  var rawLines=raw.split(/\n/).map(function(l){return l.trim();});
  console.log('=== RAW LINES ('+rawLines.length+') ===');
  rawLines.forEach((l,i)=>console.log(String(i).padStart(3,' ')+': '+JSON.stringify(l)));
  var blocks=[]; var curMode='other'; var curText='';
  function flush(){ if(curText.trim()) blocks.push({mode:curMode, text:curText.trim()}); curText=''; }
  var ingHeader=/^(食材准备|所需食材|准备食材|食材清单|食材明细|准备工作|准备材料|配料表|配菜清单|用料清单|食材|用料|材料|原料|主料|辅料|配料表?|调料|调味料|调味)[\s:：]*$/;
  var stepHeader=/^(做法步骤|制作步骤|烹饪步骤|详细步骤|操作步骤|操作流程|制作流程|烹饪教程|做法教程|制作方法|烹饪方法|家常做法|做法大全|详细做法|分步|步骤|做法|流程|教程|下厨步骤|下厨)[\s:：]*$/;
  var tipHeader=/^(温馨提示|注意事项|食用小贴士|厨房小贴士|家常小贴士|烹调小提示|新手小贴士|烹饪小窍门|烹调小窍门|小提示|小贴士|贴士|小技巧|提示|Tips|tips|TIPS|经验分享|经验|心得|注意)[\s:：]*$/;
  function isHeaderLine(stripped, strictRe){
    if(strictRe.test(stripped)) return true;
    if(!stripped) return false;
    var colonIdx=stripped.search(/[:：]/);
    if(colonIdx>=0 && colonIdx<=10){
      var hdr=stripped.slice(0,colonIdx).trim();
      if(strictRe.test(hdr)) return true;
      var known={食材准备:1,所需食材:1,准备食材:1,食材清单:1,食材明细:1,准备工作:1,准备材料:1,配料表:1,配菜清单:1,用料清单:1,食材:1,用料:1,材料:1,原料:1,主料:1,辅料:1,配料:1,调料:1,调味料:1,调味:1,做法步骤:1,制作步骤:1,烹饪步骤:1,详细步骤:1,操作步骤:1,操作流程:1,制作流程:1,烹饪教程:1,做法教程:1,制作方法:1,烹饪方法:1,家常做法:1,做法大全:1,详细做法:1,分步:1,步骤:1,做法:1,流程:1,教程:1,下厨:1,温馨提示:1,注意事项:1,食用小贴士:1,厨房小贴士:1,家常小贴士:1,烹调小提示:1,新手小贴士:1,烹饪小窍门:1,烹调小窍门:1,小提示:1,小贴士:1,贴士:1,小技巧:1,提示:1,经验:1,心得:1};
      if(hdr && known[hdr]) return true;
    }
    return false;
  }
  function stripHeadMarks(s){
    return (s||'').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}·•●▪◆★✨🔥💯🥘🍳💡👩‍🍳♡♥❣⭐➤➜▶️→\s\-*#]+/u,'').trim();
  }
  rawLines.forEach(function(ln, idx){
    if(!ln){ flush(); return; }
    var stripped=stripHeadMarks(ln);
    var isSentence = stripped.length>=15 && /[。！？!?]/.test(stripped);
    function mark(mode, rest){
      console.log('LINE#'+idx+' → NEW MODE='+mode+' stripped.prefix(30)='+JSON.stringify(stripped.slice(0,30))+' rest='+JSON.stringify((rest||'').slice(0,40)));
    }
    if(!isSentence && isHeaderLine(stripped, ingHeader)){
      flush(); curMode='ing';
      var cidx=stripped.search(/[:：]/);
      var rest=(cidx>=0 ? stripped.slice(cidx+1) : '').trim();
      mark('ing', rest);
      curText=rest? (rest+'\n') : '';
      return;
    }
    if(!isSentence && isHeaderLine(stripped, stepHeader)){
      flush(); curMode='step';
      var c2=stripped.search(/[:：]/);
      var rest2=(c2>=0 ? stripped.slice(c2+1) : '').trim();
      mark('step', rest2);
      curText=rest2? (rest2+'\n') : '';
      return;
    }
    if(!isSentence && isHeaderLine(stripped, tipHeader)){
      flush(); curMode='tip';
      var c3=stripped.search(/[:：]/);
      var rest3=(c3>=0 ? stripped.slice(c3+1) : '').trim();
      mark('tip', rest3);
      curText=rest3? (rest3+'\n') : '';
      return;
    }
    curText+=ln+'\n';
  });
  flush();
  console.log('\n=== BLOCKS (count='+blocks.length+') ===');
  blocks.forEach(b=>{
    console.log('\n--- mode='+b.mode+' len='+b.text.length+' ---');
    console.log(b.text.slice(0,400));
  });
  // 然后跑正式 aiParseText：
  console.log('\n=== 最终解析结果 ===');
  console.log(JSON.stringify(aiParseText(sample), null, 2));
})();
