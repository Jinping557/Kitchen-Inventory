const fs = require('fs');
var tipHeader=/^(温馨提示|注意事项|食用小贴士|厨房小贴士|家常小贴士|烹调小提示|新手小贴士|烹饪小窍门|烹调小窍门|小提示|小贴士|贴士|小技巧|提示|Tips|tips|TIPS|经验分享|经验|心得|注意)[\s:：]*$/;
var TIP_KNOWN={'温馨提示':1,'注意事项':1,'食用小贴士':1,'厨房小贴士':1,'家常小贴士':1,'烹调小提示':1,'新手小贴士':1,'烹饪小窍门':1,'烹调小窍门':1,'小提示':1,'小贴士':1,'贴士':1,'小技巧':1,'提示':1,'经验分享':1,'经验':1,'心得':1,'注意':1,'Tips':1,'tips':1,'TIPS':1};
function isHeaderLine(stripped, strictRe, knownDict){
  if(strictRe.test(stripped)) return true;
  if(!stripped) return false;
  var colonIdx=stripped.search(/[:：]/);
  if(colonIdx>=0 && colonIdx<=10){
    var hdr=stripped.slice(0,colonIdx).trim();
    if(strictRe.test(hdr)) return true;
    if(hdr && knownDict[hdr]) return true;
  }
  return false;
}
var stripped='Tips：炖牛肉一定要用热水，肉质才不柴；喜欢吃辣的朋友豆瓣酱可以换成郫县豆瓣酱哦！';
console.log('strictRe test stripped:', tipHeader.test(stripped));
var colonIdx=stripped.search(/[:：]/);
console.log('colonIdx:', colonIdx, 'colonIdx<=10?', colonIdx<=10);
var hdr=stripped.slice(0,colonIdx).trim();
console.log('hdr:', JSON.stringify(hdr));
console.log('strictRe test hdr:', tipHeader.test(hdr));
console.log('TIP_KNOWN[hdr]:', TIP_KNOWN[hdr]);
console.log('isHeaderLine =>', isHeaderLine(stripped, tipHeader, TIP_KNOWN));
