/* Trích thông số từ tin nhắn bằng quy tắc (mô phỏng bước AI) */
function extract(t){
 const r={};let m;const set=(k,v,src)=>{if(!r[k])r[k]={v,src}};
 if(m=t.match(/(\d{1,2})\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(?:mm2|mm²|mm)?/i)){set('cores',m[1]+' lõi',m[0]);set('size',m[2].replace(',','.')+' mm²',m[0]);}
 if(m=t.match(/0[.,]6\s*\/\s*1\s*kv/i))set('voltage','0.6/1 kV',m[0]);else if(m=t.match(/\b(\d+(?:[.,]\d+)?)\s*kv\b/i))set('voltage',m[1].replace(',','.')+' kV',m[0]);
 if(m=t.match(/xlpe|cxv/i))set('type','CXV – cách điện XLPE',m[0]);else if(m=t.match(/pvc|cvv/i))set('type','CVV – cách điện PVC',m[0]);
 if(m=t.match(/không\s*giáp|unarmou?red|non[- ]armou?red/i))set('shield','Không giáp',m[0]);
 else if(m=t.match(/swa|sợi\s*thép|wire\s*armou?r/i))set('shield','Giáp sợi thép (SWA)',m[0]);
 else if(m=t.match(/dsta|băng\s*thép|steel\s*tape/i))set('shield','Giáp băng thép (DSTA)',m[0]);
 else if(m=t.match(/armou?r(?:ed)?|có\s*giáp|giáp/i))set('shield','Có giáp',m[0]);
 else if(m=t.match(/shield(?:ed)?|screen(?:ed)?|chống\s*nhiễu/i))set('shield','Có chống nhiễu',m[0]);
 if(m=t.match(/chôn\s*ngầm|đi\s*ngầm|underground|buried|direct burial/i))set('env','Chôn ngầm',m[0]);
 else if(m=t.match(/máng\s*cáp|trên\s*máng|cable\s*tray|tray/i))set('env','Trên máng cáp',m[0]);
 else if(m=t.match(/ngoài\s*trời|outdoor/i))set('env','Ngoài trời',m[0]);
 else if(m=t.match(/trong\s*nhà|indoor/i))set('env','Trong nhà',m[0]);
 if(m=t.match(/vận\s*hành\s*liên\s*tục|liên\s*tục|continuous|24\/7/i))set('condition','Vận hành liên tục',m[0]);
 else if(m=t.match(/rung(?:\s*động)?|vibration/i))set('condition','Có rung động',m[0]);
 if(m=t.match(/(\d{2})\s*(?:°\s*C|độ\s*C|độ(?!\s*ẩm))/i))set('temp','≤ '+m[1]+'°C',m[0]);
 if(m=t.match(/(\d{1,3}(?:[.,]\d{3})+|\d+)\s*(?:m|mét|met|meters?|metres?)(?![a-zA-Z²2àáạảãâầấậẩẫăằắặẳẵ])/i))set('qty',m[1].replace(/[.,]/g,'')+' m',m[0]);
 if(m=t.match(/(\d+)\s*(ngày|days?|tuần|weeks?)/i))set('delivery','Trong '+m[1]+' '+(/ngày|day/i.test(m[2])?'ngày':'tuần'),m[0]);
 if(m=t.match(/(\d[\d.,]*)\s*(triệu|tỷ|vnđ|vnd|usd)/i))set('budget',m[1]+' '+m[2],m[0]);
 return r;
}
