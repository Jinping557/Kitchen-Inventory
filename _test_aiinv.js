const fs = require('fs');
const html = fs.readFileSync('/workspace/kitchen_inventory.html','utf8');
const m = html.match(/<script>\s*\(function\(\)\{([\s\S]*?)\}\)\(\);\s*<\/script>/);
const code = m[1];

// 抽取 AI 添加库存 相关代码：从 var INV_UNITS 到 aiParseInvText 结束
const invUnitsStart = code.indexOf('var INV_UNITS=');
const aiParseInvEnd = code.indexOf('function callLlmApiInv(');
const invSrc = code.slice(invUnitsStart, aiParseInvEnd);

// 抽取需要的工具函数
const utilsStart = code.indexOf('function readLS(k){');
const utilsEnd = code.indexOf('function newId(){') + 'function newId(){'.length;
const utilsSrc = code.slice(utilsStart, code.indexOf("function pad(", utilsStart));

// eval 出 aiParseInvText
const testSrc = utilsSrc + '\n' + invSrc;
eval(testSrc);

const cases = [
  '我买了3个西红柿、2斤土豆、1瓶酱油、一把葱、半斤五花肉',
  '鸡蛋、牛奶、生菜、面粉',
  '三个西红柿',
  '二十斤大米',
  '酱油1瓶',
  '土豆2斤',
  '西红柿',
  '今天买了可乐3瓶、鸡翅2斤、生抽',
  '一把葱 两头蒜 半斤五花肉'
];

cases.forEach(function(c){
  console.log('\n输入：', c);
  console.log('输出：', JSON.stringify(aiParseInvText(c), null, 2));
});
