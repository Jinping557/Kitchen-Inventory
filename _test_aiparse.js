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
console.log('aiParseText:', typeof aiParseText);
console.log(JSON.stringify(aiParseText(sample), null, 2));
