/* Xử lý một yêu cầu: 4 bước, mỗi bước một màn (#/enquiry/<mã>/<bước>) */
const STEPS=[['Kiểm tra thông tin','msg'],['Hỏi lại khách','send'],['Gợi ý mã cáp','cable'],['Xác nhận & báo giá','excel']];
let REPLY={x:'',files:[],bad:[]};
function replyFilesHTML(){return `${REPLY.files.length?`<div class="fchips">${fileChips(REPLY.files,'rfileDel')}</div>`:''}${REPLY.bad.length?`<div class="ferr" role="alert">${REPLY.bad.map(x=>`<div>! ${esc(x)}</div>`).join('')}</div>`:''}`}
/* Bước mặc định khi mở một yêu cầu */
function defaultStep(e){return e.status==='done'?4:e.status==='ready'?3:(e.sent?2:1)}
const pct=s=>Math.round(s*100);
const confColor=p=>p>=85?'#3E8E63':p>=60?'#E9A23B':'#C8372D';
function stockInfo(stock,qty){
 if(stock===0)return['bad','x','Hết hàng','Không có trong kho'];
 if(!qty)return['ok','check',`Còn ${stock} m`,'Chưa có số lượng khách cần'];
 return stock>=qty?['ok','check',`Còn hàng · ${stock} m`,`Đủ cho ${qty} m khách cần`]:['warn','alert',`Thiếu · còn ${stock} m`,`Thiếu ${qty-stock} m so với ${qty} m`]}
function stockband(stock,qty,sm){const[k,i,t,s]=stockInfo(stock,qty);
 return `<div class="stockband ${k} ${sm?'sm':''}"><span class="ic">${ic(i,sm?16:20,'#fff',2.8)}</span><span><b>${t}</b><span>${s}</span></span></div>`}
const crit=o=>`<ul class="crit">${o.rows.map(r=>`<li class="chip ${r.ok?'ok':'bad'}">${ic(r.ok?'check':'x',13)}${esc(r.l)}</li>`).join('')}</ul>`;

function stepper(e,cur){
 const miss=reqMissing(e).length,done=[miss===0,e.sent||miss===0,!!e.decision,!!e.quote];
 return `<ol class="steps" aria-label="Các bước xử lý">${STEPS.map(([n],i)=>`<li><a href="#/enquiry/${e.id}/${i+1}" class="${i+1===cur?'cur':done[i]?'done':''}" ${i+1===cur?'aria-current="step"':''}>${done[i]&&i+1!==cur?ic('check',16,'#fff',2.6):`<b>${i+1}</b>`}<span>${n}</span></a></li>`).join('')}</ol>`
}
function vWork(e,step){
 const head=`<div class="ehead"><div><a class="back" href="#/enquiries">${ic('back',16)}Tổng quan</a>
  <h1 class="sf">${esc(e.cust)}</h1><p><b style="color:var(--ink)">${e.id}</b>${ic(CHIC[e.src]||'msg',15)}${esc(e.contact)} · ${esc(e.src)} · ${esc(e.date)}</p></div>
  <span class="sp"></span>${chip(STATUS[e.status][0],STATUS[e.status][1]+' big',STATUS[e.status][2])}</div>`;
 const body=[vStep1,vStep2,vStep3,vStep4][step-1](e);
 return head+stepper(e,step)+body
}
const actbar=(back,next)=>`<div class="actbar">${back?`<a class="pill" href="${back[1]}">${ic('back',17)}${back[0]}</a>`:''}${next}</div>`;

/* ---------- Bước 1: tin nhắn của khách + checklist ---------- */
function msgCard(e){
 return `<section class="msg" aria-label="Tin nhắn của khách"><div class="who"><span class="ico" style="background:var(--navy);color:#fff">${ic('chat',18)}</span><span><b style="display:block">Tin nhắn của khách</b><span style="font-size:12px" class="mute">${esc(e.src)} · ${esc(e.date)}</span></span></div>
 <p class="txt">${e.msg?hl(e.msg,e):'<span class="mute">Khách chỉ gửi file, không có nội dung chữ.</span>'}</p>
 ${e.files.length?`<div class="fchips">${fileChips(e.files)}</div><p class="mute" style="font-size:12px;margin:6px 0 0">Bản dev chưa đọc nội dung file. Mở file để xem rồi điền các mục còn thiếu.</p>`:''}
 ${e.replies.map(r=>`<div class="reply"><div class="mute" style="font-size:12px;margin-bottom:4px">Khách trả lời · ${esc(r.t)}</div>${r.x?`<p class="txt" style="font-size:15.5px">${hl(r.x,e)}</p>`:''}${(r.files||[]).length?`<div class="fchips">${fileChips(r.files)}</div>`:''}</div>`).join('')}
 <p class="mute" style="margin:14px 0 0;font-size:12px">Phần tô cam là thông tin hệ thống đã đọc được.</p></section>`
}
function vStep1(e){
 const n=reqFilled(e),c={ok:0,ai:0,miss:0};FIELDS.forEach(F=>{const s=e.f[F.k].st;if(s in c)c[s]++});
 const icn={ok:'check',ai:'q',miss:'alert',na:'x'};
 const tiles=FIELDS.map(F=>{const x=e.f[F.k];return `<li class="tile ${x.st}"><span class="dot">${ic(icn[x.st],17,'#fff',2.6)}</span>
  <span style="flex:1;min-width:0"><label class="lab" for="f_${F.k}">${F.l}${F.opt?' (tuỳ chọn)':''}</label><input id="f_${F.k}" data-field="${F.k}" value="${esc(x.v)}" placeholder="${x.st==='na'?'Không áp dụng':'Nhập giá trị'}"><span class="strow"><span class="st">${ST[x.st][0]}</span>
  <span class="acts">${x.st==='ai'?`<button class="mini" data-act="okField" data-k="${F.k}" aria-label="Xác nhận ${F.l}" title="Xác nhận">${ic('check',15)}</button>`:''}${x.st==='na'?`<button class="mini" data-act="unNa" data-k="${F.k}" aria-label="Bỏ đánh dấu không áp dụng" title="Bỏ đánh dấu">${ic('back',15)}</button>`:`<button class="mini" data-act="naField" data-k="${F.k}" aria-label="${F.l} không áp dụng" title="Không áp dụng">${ic('x',14)}</button>`}</span></span></span></li>`}).join('');
 const miss=reqMissing(e).length;
 return `<div class="two">${msgCard(e)}
 <section class="card"><div class="ckhead">${ring(n*10,84,9,'#EE6A2C',n+'/10')}<div><h2 class="sf h2">Checklist thông số</h2><p class="mute" style="margin:4px 0 0;font-size:13px">${miss?`Còn thiếu ${miss} thông số bắt buộc`:'Đã đủ thông số bắt buộc'}</p></div></div>
  <div class="row" style="gap:8px;margin-bottom:14px">${chip(c.ai+' AI đọc được','org','q')}${chip(c.ok+' đã xác nhận','ok','check')}${chip(c.miss+' còn thiếu','bad','alert')}</div>
  <ul class="tiles">${tiles}</ul>
  <p class="mute" style="margin:12px 0 0;font-size:12.5px">Bấm vào giá trị để sửa. Giá trị bạn nhập hoặc bấm ✓ được tính là đã xác nhận.</p></section></div>
 ${actbar(null,miss?`<a class="pill pri" href="#/enquiry/${e.id}/2">Tiếp: Hỏi lại khách${ic('next',17)}</a>`:`<a class="pill pri" href="#/enquiry/${e.id}/3">Đủ thông tin · Gợi ý mã cáp${ic('next',17)}</a>`)}`
}

/* ---------- Bước 2: tin nhắn hỏi lại ---------- */
function vStep2(e){
 const miss=FIELDS.filter(F=>e.f[F.k].st==='miss'),draft=e.draft??genDraft(e);
 return `<div style="max-width:880px">
 <div class="row" style="margin-bottom:16px"><b>Cần hỏi thêm:</b>${miss.length?miss.map(F=>chip(F.l,'bad','alert')).join(''):chip('Không còn mục thiếu','ok','check')}</div>
 ${draft?`<div class="bubble"><div class="row" style="margin-bottom:10px;font-weight:700;color:var(--orange-ink)">${ic('send',17)}Tin nhắn soạn sẵn · sửa trực tiếp nếu cần<span class="sp"></span>${e.sent?chip('Đã gửi','ok','check'):''}</div>
  <textarea id="draft" aria-label="Tin nhắn hỏi lại khách">${esc(draft)}</textarea></div>
 <div class="row" style="margin-top:14px"><button class="pill pri" data-act="copy">${ic('copy',17)}Sao chép tin nhắn</button><button class="pill" data-act="sent">${ic('check',17)}Đánh dấu đã gửi</button><button class="pill ghost sm" data-act="regen">Soạn lại theo checklist</button></div>`
 :`<div class="note">${ic('check',16)}Thông tin đã đủ và đã xác nhận, không cần hỏi lại khách.</div>`}
 <section class="card" style="margin-top:20px"><h2 class="sf" style="font-size:19px">Khách đã trả lời?</h2><p class="mute" style="margin:4px 0 12px;font-size:13px">Dán câu trả lời hoặc đính kèm file. Hệ thống sẽ cập nhật checklist.</p>
  <textarea class="inp" id="reply" rows="3" aria-label="Câu trả lời của khách" placeholder="Ví dụ: Nhiệt độ tối đa 40 độ C, vận hành liên tục.">${esc(REPLY.x)}</textarea>
  <input type="file" id="rfile" class="vh" multiple accept=".pdf,image/png,image/jpeg,image/webp"><div id="rfiles">${replyFilesHTML()}</div>
  <div class="row" style="margin-top:10px"><label class="pill sm soft" for="rfile">${ic('file',15)}Đính kèm PDF / ảnh</label><button class="pill sm pri" data-act="reply">Cập nhật checklist</button></div></section></div>
 ${actbar(['Kiểm tra thông tin',`#/enquiry/${e.id}/1`],`<a class="pill pri" href="#/enquiry/${e.id}/3">Tiếp: Gợi ý mã cáp${ic('next',17)}</a>`)}`
}

/* ---------- Bước 3: 3 phương án ---------- */
function vStep3(e){
 const ops=options(e);
 if(!ops)return `<section class="card stack"><h2 class="sf h2">Chưa đủ thông tin để gợi ý</h2><p class="mute" style="margin:0">Cần tối thiểu <b>số lõi</b> và <b>tiết diện</b>. Quay lại bước 1–2 để bổ sung hoặc hỏi lại khách.</p><div><a class="pill pri" href="#/enquiry/${e.id}/1">${ic('back',17)}Về checklist</a></div></section>`;
 const top=ops[0],sel=e.manual?null:(e.selected||top.code),miss=reqMissing(e);
 if(!e.manual&&!e.selected){e.selected=top.code}
 const p0=pct(top.score),isSel=c=>!e.manual&&sel===c;
 const hero=`<article class="hero ${isSel(top.code)?'':'off'}"><div style="display:flex;justify-content:center">${gauge(p0,220,confColor(p0))}</div>
  <div>${chip('Gợi ý số 1','org')}<h3 class="sf code">${top.code}</h3><p class="mute" style="margin:0 0 12px">${top.cores}×${top.size} mm² · ${top.v}</p>${crit(top)}
   <p class="mute" style="margin:12px 0 0;font-size:12.5px;display:flex;gap:6px;align-items:center">${ic('file',14)}<a href="#" data-act="srcLink">${esc(top.src)}</a></p></div>
  <div class="stack" style="gap:12px">${stockband(top.stock,top.qty)}<button class="pill ${isSel(top.code)?'pri':''}" data-act="pick" data-k="${top.code}" style="height:50px" ${e.decision?'disabled':''}>${isSel(top.code)?ic('check',17)+'Đã chọn':'Chọn phương án này'}</button></div></article>`;
 const alts=ops.slice(1).map((o,i)=>{const p=pct(o.score);return `<article class="alt ${isSel(o.code)?'sel':''}"><div class="row" style="flex-wrap:nowrap;gap:14px">${ring(p,70,8,confColor(p),null,'tin cậy')}<div><span class="mute" style="font-size:12px;font-weight:600">Phương án ${i+2}</span><h3 class="sf" style="font-size:23px">${o.code}</h3></div>
  <button class="pill sm ${isSel(o.code)?'pri':''}" data-act="pick" data-k="${o.code}" style="margin-left:auto" ${e.decision?'disabled':''}>${isSel(o.code)?'Đã chọn':'Chọn'}</button></div>${stockband(o.stock,o.qty,true)}${crit(o)}</article>`}).join('');
 const needReason=e.manual||(sel&&sel!==top.code);
 const manual=e.manual||needReason?`<section class="manual">
  ${e.manual?`<div><label class="lb" for="manualCode">Mã cáp đúng <span style="color:var(--bad)">*</span></label><input class="inp" id="manualCode" value="${esc(e.manualCode||'')}" placeholder="Ví dụ: CXV/SWA"></div>`:''}
  <div><label class="lb" for="reason">Lý do không dùng gợi ý số 1 <span style="color:var(--bad)">*</span></label><select class="inp" id="reason"><option value="">Chọn lý do…</option>${REASONS.map(r=>`<option ${e.reason===r?'selected':''}>${r}</option>`).join('')}</select></div>
  <p class="mute" style="margin:0;font-size:12.5px;grid-column:1/-1">Lý do được ghi vào nhật ký góp ý để cải thiện quy tắc.</p></section>`:'';
 return `<div class="row" style="margin-bottom:18px"><h2 class="sf h2">3 phương án phù hợp nhất</h2><span class="sp"></span>${chip('AI gợi ý · nhân viên chốt','info','alert')}</div>
 ${miss.length?`<div class="note" style="margin-bottom:16px">${ic('alert',16)}Còn thiếu: ${miss.map(F=>F.l.toLowerCase()).join(', ')}. Gợi ý chỉ dựa trên thông số đã có.</div>`:''}
 ${hero}<div class="alts">${alts}</div>
 <p class="mute" style="margin:16px 0 0;font-size:13px">Không phương án nào đúng? <button class="pill sm ghost" data-act="manual" style="padding:0 6px;text-decoration:underline">${e.manual?'Huỷ nhập mã khác':'Nhập mã khác'}</button></p>${manual}
 ${actbar(['Hỏi lại khách',`#/enquiry/${e.id}/2`],e.decision?`<a class="pill pri" href="#/enquiry/${e.id}/4">Xem báo giá${ic('next',17)}</a>`:`<button class="pill pri" data-act="confirm">${ic('check',17)}Chốt mã &amp; tạo báo giá</button>`)}`
}

/* ---------- Bước 4: mã đã chốt + báo giá ---------- */
function decidedItem(e){const r=req(e),code=e.decision.code,ops=options(e)||[],o=ops.find(x=>x.code===code);
 return{code,name:o?o.name:`${code} ${r.cores||'?'}×${r.size||'?'} mm²`,stock:stockOf(code,r.cores,r.size),qty:r.qty,p:o?pct(o.score):null}}
function vStep4(e){
 if(!e.decision)return `<section class="card stack"><h2 class="sf h2">Chưa chốt mã cáp</h2><p class="mute" style="margin:0">Chọn một phương án ở bước 3 rồi bấm “Chốt mã &amp; tạo báo giá”.</p><div><a class="pill pri" href="#/enquiry/${e.id}/3">${ic('back',17)}Về gợi ý mã cáp</a></div></section>`;
 const d=e.decision,it=decidedItem(e),[sk,,st]=stockInfo(it.stock,it.qty);
 const chosen=`<section class="chosen"><span class="ico">${ic('check',22,'#14233C',2.8)}</span><div><span style="font-size:12.5px;opacity:.8">Mã cáp đã chốt · ${d.matched?'gợi ý số 1':'đã sửa gợi ý'} · ${esc(d.by)}, ${esc(d.t)}</span><b class="sf" style="display:block;font-size:26px;line-height:1.15">${esc(it.name)}</b></div>
  <span class="row" style="margin-left:auto;gap:8px">${chip(st,sk,sk==='ok'?'check':'alert')}${it.p!=null?chip('Tin cậy '+it.p+'%','info','cable'):''}<button class="pill sm" data-act="reopen" style="color:#fff;border-color:#4A5A78">Đổi mã</button></span></section>`;
 return `<div class="stack">${chosen}${quoteBlock(e,it)}</div>${actbar(['Gợi ý mã cáp',`#/enquiry/${e.id}/3`],`<a class="pill pri" href="#/enquiries">Hoàn tất${ic('next',17)}</a>`)}`
}
function quoteBlock(e,it){
 if(it.stock===0)return `<section class="card"><h2 class="sf" style="font-size:20px">Báo giá</h2><div class="ferr">! Mã ${esc(it.code)} hiện không có trong kho. Theo phạm vi MVP, chỉ tạo báo giá cho hàng có sẵn.</div></section>`;
 const qf=e.qf||(e.qf=e.quote?{qty:e.quote.qty,cost:e.quote.cost,margin:e.quote.margin,vat:e.quote.vat}:{qty:it.qty||'',cost:'',margin:QUOTE_DEFAULT.margin,vat:QUOTE_DEFAULT.vat});
 const f=(id,k,l,extra='')=>`<div><label class="lb" for="${id}">${l}</label><input class="inp" id="${id}" data-q="${k}" type="number" min="0" value="${esc(qf[k])}" ${extra}></div>`;
 return `<section class="card">
  <div class="row" style="margin-bottom:14px"><h2 class="sf" style="font-size:20px">Báo giá</h2><span class="sp"></span>${chip('Chỉ hàng có sẵn','ok','box')}${e.quote?chip('Đã tạo '+e.quote.no,'info','check'):''}</div>
  <div class="qgrid" style="margin-bottom:16px">${f('qQty','qty','Số lượng (m)')}${f('qCost','cost','Giá vốn (đ/m)','step="1000" placeholder="Nhập giá vốn"')}${f('qMargin','margin','Lợi nhuận (%)')}
   <div><label class="lb" for="qVat">VAT</label><select class="inp" id="qVat" data-q="vat">${[8,10].map(v=>`<option value="${v}" ${+qf.vat===v?'selected':''}>${v}%</option>`).join('')}</select></div></div>
  <div id="qcalc">${qcalcHTML(e,qf,it)}</div>
  <p class="mute" style="margin:10px 0 0;font-size:12.5px;display:flex;gap:8px;align-items:flex-start">${ic('excel',16)}Ô màu cam là công thức: sửa số lượng hoặc đơn giá trong Excel, thành tiền và tổng tự tính lại. Giá vốn do nhân viên nhập; AI không tham gia bước này.</p>
  <div class="row" style="margin-top:16px"><button class="pill org" data-act="qXlsx">${ic('excel',17)}Xuất Excel</button><button class="pill" data-act="qPdf">${ic('file',17)}Xuất PDF</button></div></section>`
}
function qcalcHTML(e,qf,it){
 const q={qty:+qf.qty||0,cost:+qf.cost||0,margin:+qf.margin||0,vat:+qf.vat||0},c=quoteCalc(q),over=q.qty>it.stock;
 const n=v=>q.cost?Math.round(v).toLocaleString('vi-VN'):'—';
 const rows=[['','A','B','C','D','E','F'],['1','BÁO GIÁ','','','','',''],['2','Khách hàng',e.cust,'','','',''],['4','STT','Mô tả','ĐVT','Số lượng','Đơn giá','Thành tiền'],
  ['5','1',it.name,'m',String(q.qty||'—'),n(c.unit),'=D5*E5'],['7','','','','','Cộng','=F5'],['8','','','','',`VAT ${q.vat}%`,'=F7*'+q.vat+'%'],['9','','','','','Tổng cộng','=F7+F8']];
 const sheet=`<div class="sheet"><table>${rows.map((r,ri)=>`<tr>${r.map((v,ci)=>`<td class="${ri===0||ci===0?'h':''} ${v.startsWith('=')?'f':''} ${ci>=4&&ri>3?'n':''}" ${ri===1||ri===3?'style="font-weight:700"':''}>${esc(v)}</td>`).join('')}</tr>`).join('')}</table></div>`;
 return `${over?`<div class="ferr" style="margin:0 0 10px">! Số lượng ${q.qty} m vượt tồn kho ${it.stock} m. Chỉ báo giá phần có sẵn.</div>`:''}
 <div class="two" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr);align-items:end"><div><p class="lb">Xem trước file Excel</p>${sheet}</div>
 <dl class="qsum"><dt>Đơn giá bán</dt><dd>${q.cost?vnd(c.unit)+'/m':'—'}</dd><dt>Thành tiền</dt><dd>${q.cost?vnd(c.sub):'—'}</dd><dt>VAT ${q.vat}%</dt><dd>${q.cost?vnd(c.tax):'—'}</dd><dt><b>Tổng cộng</b></dt><dd><b>${q.cost?vnd(c.total):'—'}</b></dd></dl></div>`
}
