/* Xếp hạng phương án cáp và kiểm tra tồn kho */
function req(e){
 const g=k=>['miss','na'].includes(e.f[k].st)?'':e.f[k].v;
 const t=g('type'),sh=g('shield'),env=g('env'),v=g('voltage');
 return{ins:/xlpe|cxv/i.test(t)?'XLPE':/pvc|cvv/i.test(t)?'PVC':null,
  arm:/không/i.test(sh)?'no':/giáp|thép|swa|dsta/i.test(sh)?'yes':null,
  armType:/sợi|swa/i.test(sh)?'Sợi thép':/băng|dsta/i.test(sh)?'Băng thép':null,
  ug:/ngầm/i.test(env),v,
  cores:(g('cores').match(/\d+/)||[])[0],size:(g('size').match(/[\d.]+/)||[])[0],
  qty:parseInt((g('qty').match(/\d+/)||[])[0])||null}
}
function stockOf(code,c,s){const k=`${code}|${c}|${s}`;if(k in STOCK)return STOCK[k];let h=7;for(const ch of k)h=(h*31+ch.charCodeAt(0))%9973;return[0,150,300,500,900,1500,2400][h%7]}
function options(e){
 const r=req(e);if(!r.cores||!r.size)return null;
 return CAT.map(c=>{const rows=[];const add=(l,ok)=>rows.push({l,ok});
  add(`${r.cores} lõi × ${r.size} mm²`,true);
  if(r.ins)add('Cách điện '+c.ins,c.ins===r.ins);
  if(r.arm)add(c.arm==='Không'?'Không giáp':'Giáp '+c.arm.toLowerCase(),r.arm==='yes'?(c.arm!=='Không'&&(!r.armType||r.armType===c.arm)):c.arm==='Không');
  if(r.ug)add('Phù hợp chôn ngầm',c.ug);
  if(r.v)add('Điện áp '+c.v,/0\.6\/1/.test(r.v));
  const score=rows.filter(x=>x.ok).length/rows.length,stock=stockOf(c.code,r.cores,r.size);
  return{...c,rows,score,stock,qty:r.qty,name:`${c.code} ${r.cores}×${r.size} mm² · ${c.v}`}
 }).sort((a,b)=>b.score-a.score||b.stock-a.stock).slice(0,3)
}
function conf(s){return s>=.99?['Tin cậy: Cao','ok']:s>=.6?['Tin cậy: Trung bình','ai']:['Tin cậy: Thấp','miss']}
function stockChip(o){if(o.stock===0)return chip('! Hết hàng','miss');if(!o.qty)return chip('Còn '+o.stock+' m','info');
 return o.stock>=o.qty?chip('✓ Đủ · còn '+o.stock+' m','ok'):chip('! Thiếu · còn '+o.stock+' / cần '+o.qty+' m','ai')}
