const fs = require('fs');
const html = fs.readFileSync('/workspace/kitchen_inventory.html','utf8');
const m = html.match(/<script>\s*\(function\(\)\{([\s\S]*?)\}\)\(\);\s*<\/script>/);
const code = m[1];
const ci = code.indexOf('var COMMON_ING_HINTS=');
const ciEnd = code.indexOf(';\n', ci)+2;
const commonSrc = code.slice(ci, ciEnd);
const aiParseSrc = fs.readFileSync('/tmp/aifunc.js','utf8');
// 我们改造一下：在 eval 后调用 aiParseText 前把 blocks 也打出来
// 重写 test：在 eval 之后再手动解析一遍 block 结构
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
eval(commonSrc + '\n' + aiParseSrc);
// 现在手动模拟 blocks 分类逻辑（与 aiParseText 内一致）
(function(){
  let raw = sample.replace(/\r/g,'').trim();
  raw=raw.replace(/[\u3000\u00a0]/g,' ').replace(/[ \t]+/g,' ').trim();
  raw=raw.replace(/([🥘🍳👩🍜💡🔥❓🥢🥗🌶🧂🧄🧅🥕🥔🥩🍗🍤🥚🥣])(?=[^\n])/g,'\n$1');
  var headerWords=['食材','用料','材料','原料','主料','辅料','配料','调料','调味','准备','所需食材','准备食材','食材清单','食材明细','准备工作','做法','制作方法','烹饪方法','步骤','制作步骤','做法步骤','烹饪步骤','详细步骤','操作步骤','流程','操作流程','教程','小提示','小贴士','贴士','温馨提示','提示','Tips','tips','TIPS','注意事项'];
  headerWords.forEach(function(w){
    var re=new RegExp('([^\\n])('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*[:：]?)','g');
    raw=raw.replace(re, '$1\n$2');
  });
  var rawLines=raw.split(/\n/).map(function(l){return l.trim();});
  console.log('=== RAW LINES (count='+rawLines.length+') ===');
  rawLines.forEach((l,i)=>console.log(String(i).padStart(3,' ')+': '+JSON.stringify(l)));
  function stripHeadMarks(s){
    return (s||'').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}·•●▪◆★✨🔥💯🥘🍳💡👩‍🍳♡♥❣⭐➤➜▶️→\s\-*#]+/u,'').trim();
  }
  var blocks=[]; var curMode='other'; var curText='';
  function flush(){ if(curText.trim()) blocks.push({mode:curMode, text:curText.trim()}); curText=''; }
  var ingHeader=/^(食材|用料|材料|原料|主料|辅料|配料|调料|调味|准备食材|准备|所需食材|食材清单|食材明细|准备工作|准备材料|食材准备|配料表|配菜)/;
  var stepHeader=/^(做法|制作方法|烹饪方法|步骤|制作步骤|做法步骤|烹饪步骤|详细步骤|操作步骤|流程|操作流程|制作流程|教程|烹饪教程|做法教程|下厨)/;
  var tipHeader=/^(小提示|小贴士|贴士|温馨提示|提示|注意事项|小技巧|Tips|tips|TIPS|经验|心得|💡)/;
  rawLines.forEach(function(ln){
    if(!ln){ flush(); return; }
    var stripped=stripHeadMarks(ln);
    if(ingHeader.test(stripped)){ flush(); curMode='ing';
      var rest=stripped.replace(ingHeader,'').replace(/^\s*[:：]?\s*/,'').trim();
      curText=rest? (rest+'\n') : '';
      console.log('  -> NEW MODE=ing (head='+JSON.stringify(stripped.slice(0,20))+' rest='+JSON.stringify(rest.slice(0,40))+')');
      return;
    }
    if(stepHeader.test(stripped)){ flush(); curMode='step';
      var rest2=stripped.replace(stepHeader,'').replace(/^\s*[:：]?\s*/,'').trim();
      curText=rest2? (rest2+'\n') : '';
      console.log('  -> NEW MODE=step (head='+JSON.stringify(stripped.slice(0,20))+' rest='+JSON.stringify(rest2.slice(0,40))+')');
      return;
    }
    if(tipHeader.test(stripped)){ flush(); curMode='tip';
      var rest3=stripped.replace(tipHeader,'').replace(/^\s*[:：]?\s*/,'').trim();
      curText=rest3? (rest3+'\n') : '';
      console.log('  -> NEW MODE=tip (head='+JSON.stringify(stripped.slice(0,20))+' rest='+JSON.stringify(rest3.slice(0,40))+')');
      return;
    }
    curText+=ln+'\n';
  });
  flush();
  console.log('\n=== BLOCKS ===');
  blocks.forEach(b=>{
    console.log('--- mode='+b.mode+' len='+b.text.length+' ---');
    console.log(b.text.slice(0,200));
    if(b.text.length>200) console.log('...(truncated)');
  });
  // 取 blockIng 之后直接对每一行食材跑拆分：
  console.log('\n=== 食材拆分细节 ===');
  var blockIngText=blocks.filter(b=>b.mode==='ing').map(b=>b.text).join('\n').trim();
  console.log('blockIngText = '+JSON.stringify(blockIngText));
  blockIngText.split(/\n+/).forEach((line,i)=>{
    line=line.trim(); if(!line) return;
    line=line.replace(/^[\-·\*\d\.\)）】\]\s•●▪◆★]+/,'').trim();
    console.log('L'+i+': '+JSON.stringify(line));
    if(/[、，,；;]/.test(line)){
      console.log('  split by顿号 → '+JSON.stringify(line.split(/[、，,；;]+/)));
    } else if(/\s\s+/.test(line)){
      console.log('  split by 2spaces → '+JSON.stringify(line.split(/\s{2,}/)));
    } else {
      console.log('  use 空格+数量单位 智能切');
      var qtyUnitPattern=/(\d*\.?\d+\s*(?:勺|汤匙|大匙|小匙|茶匙|克|g|kg|毫升|ml|L|斤|两|个|只|颗|片|块|根|条|朵|瓣|节|把|束|盒|包|罐|瓶|滴|小撮|撮|适量|少许|若干|一些|备用|多点|少点|少量|大半|茶匙|大勺|小勺|杯|左右|约))/g;
      var tokens=[], lastIdx=0, qm;
      while((qm=qtyUnitPattern.exec(line))!==null){
        var qStart=qm.index, qEnd=qStart+qm[0].length;
        var nmPart=line.slice(lastIdx, qStart).trim();
        var qPart=qm[0].trim();
        console.log('  match qPart='+JSON.stringify(qPart)+' nmPart='+JSON.stringify(nmPart));
        if(nmPart){ tokens.push((nmPart+' '+(qPart||'')).trim()); }
        else if(qPart && tokens.length>0){ tokens[tokens.length-1]=(tokens[tokens.length-1]+' '+qPart).trim(); }
        else if(qPart){ tokens.push(qPart); }
        lastIdx=qEnd;
      }
      var tail=line.slice(lastIdx).trim();
      console.log('  tail='+JSON.stringify(tail));
      if(tail){
        if(/\s/.test(tail) && /(适量|少许|若干|备用|一些|多点|少点|少量)$/.test(tail)){ tokens.push(tail); }
        else if(!/\s/.test(tail)){ tokens.push(tail); }
        else { tail.split(/\s+/).forEach(t=>{if(t) tokens.push(t);}); }
      }
      console.log('  tokens = '+JSON.stringify(tokens));
    }
  });
  // 最后清洗食材项（cleanedIngredients 阶段）：
  console.log('\n=== cleanedIngredients 细节 ===');
  var ingredients = JSON.parse(JSON.stringify(aiParseText(sample)));
  console.log('最终结果：ingredients='+JSON.stringify(ingredients.ingredients));
  console.log('最终结果：steps count='+ingredients.steps.length);
  ingredients.steps.forEach((s,i)=>console.log('  S'+(i+1)+': '+s.slice(0,80)));
})();
