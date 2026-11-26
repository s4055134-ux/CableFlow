/* Quản trị: tồn kho, quy tắc chọn cáp, góp ý */
let ADM_TAB='stock',STOCK_ERR=[];
function fbForm(){return `<section class="card stack" style="gap:12px"><h2 class="sf" style="font-size:19px">Gửi góp ý</h2>
 <div class="two" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px"><div><label class="lb" for="fbType">Loại</label><select class="inp" id="fbType"><option>Sai trích xuất</option><option>Đổi đề xuất</option><option>Giao diện</option><option>Khác</option></select></div>
 <div><label class="lb" for="fbE">Mã yêu cầu</label><input class="inp" id="fbE" placeholder="YC-0241"></div></div>
 <div><label class="lb" for="fbX">Nội dung</label><textarea class="inp" id="fbX" rows="3" placeholder="Mô tả ngắn điều chưa đúng hoặc cần cải thiện"></textarea></div>
 <div><button class="pill pri" data-act="fbSend">Gửi góp ý</button></div></section>`}
function vAdmin(){
 if(S.user.r!=='admin')return `<div class="ph"><div><h1 class="sf h1">Góp ý</h1><p>Gửi góp ý để nhóm cải thiện hệ thống.</p></div></div>${fbForm()}
  <section class="card" style="margin-top:20px"><p class="mute" style="margin:0">Tồn kho, quy tắc và bảng góp ý chỉ hiển thị cho vai trò <b>Quản trị</b>.</p><button class="pill" style="margin-top:12px" data-act="switchRole">Chuyển sang vai trò Quản trị (dev)</button></section>`;
 const nNew=S.feedback.filter(f=>f.st==='Mới').length;
 const tabs=[['stock','Tồn kho','box'],['rules','Quy tắc','rule'],['fb',`Góp ý · ${nNew} mới`,'msg']].map(([k,l,i])=>`<button class="pill sm ${ADM_TAB===k?'pri':'soft'}" data-act="admTab" data-k="${k}" aria-pressed="${ADM_TAB===k}">${ic(i,15)}${l}</button>`).join('');
 return `<div class="ph"><div><h1 class="sf h1">Quản trị</h1><p>Tồn kho, quy tắc chọn cáp và góp ý của nhân viên.</p></div><span class="sp"></span><button class="pill sm" data-act="reset">Đặt lại dữ liệu mẫu</button></div>
 <div class="tabs" role="group" aria-label="Mục quản trị">${tabs}</div>${ADM_TAB==='stock'?admStock():ADM_TAB==='rules'?admRules():admFeedback()}`
}
function admStock(){
 const ent=Object.entries(S.stock.map),mx=Math.max(1,...ent.map(([,v])=>v));
 const bars=ent.slice(0,10).map(([k,v])=>{const[c,n,s]=k.split('|');return `<div><span style="font-weight:600">${esc(c)} ${esc(n)}×${esc(s)}</span><span class="pbar" style="height:14px"><i style="width:${v/mx*100}%;background:${v?'#14233C':'#A8261B'}"></i></span><span style="text-align:right;${v?'':'color:var(--bad);font-weight:700'}">${v?v+' m':'Hết'}</span></div>`}).join('');
 return `<section class="status"><span class="ico">${ic('excel',22,'#F7B48F')}</span><div><span style="font-size:12.5px;color:#C9D2E0">File tồn kho đang dùng</span><b style="display:block;font-size:17px">${esc(S.stock.file)}</b><span style="font-size:12.5px;color:#C9D2E0">Cập nhật ${esc(S.stock.date)} · ${S.stock.rows} mã${S.stock.sample?' · dữ liệu mẫu':''}</span></div>
  <span class="sp"></span><label class="pill org" for="stockFile">${ic('upload',17)}Tải file mới</label><input type="file" id="stockFile" class="vh" accept=".xlsx,.xls,.csv"></section>
 ${STOCK_ERR.length?`<div class="ferr" role="alert">${STOCK_ERR.map(x=>`<div>! ${esc(x)}</div>`).join('')}</div>`:''}
 <div class="two" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);margin-top:16px">
  <section class="card"><h2 class="sf" style="font-size:19px;margin-bottom:16px">Tồn kho theo mã</h2><div class="sbars">${bars}</div>${ent.length>10?`<p class="mute" style="font-size:12px;margin:10px 0 0">Hiển thị 10 / ${ent.length} mã.</p>`:''}</section>
  <section class="card stack" style="gap:12px"><h2 class="sf" style="font-size:19px">Định dạng file</h2><p style="margin:0">Cột bắt buộc (không phân biệt dấu, hoa thường):<br><code>ma_cap, so_loi, tiet_dien, ton_kho_m</code></p>
   <div><button class="pill sm soft" data-act="stockTpl">${ic('file',15)}Tải file mẫu (CSV)</button></div><p class="mute" style="margin:0;font-size:12.5px">Tồn kho chỉ là kiểm tra tham khảo. Hàng cắt lẻ cập nhật thủ công nên có thể lệch.</p></section></div>`
}
function admRules(){
 return `<section class="card"><h2 class="sf" style="font-size:19px">Quy tắc chọn cáp</h2><p class="mute" style="margin:4px 0 6px;font-size:13px">Quy tắc <b>Tự động</b> đang được dùng khi xếp hạng phương án. Quy tắc <b>Ghi chú</b> sẽ được chuyển thành tự động trong A3.</p>
 <ul class="rules">${S.rules.map((r,i)=>`<li class="${r.active?'':'off'}"><label class="switch"><input type="checkbox" data-rule="${i}" ${r.active?'checked':''} aria-label="Bật quy tắc: ${esc(r.cond)}"><span></span></label>
  <span style="flex:1;font-size:13.5px"><b>Nếu</b> ${esc(r.cond)} <b>thì</b> ${esc(r.eff)}<span class="mute" style="display:block;font-size:12px">Nguồn: ${esc(r.src)}</span></span>${r.auto?chip('Tự động','ok'):chip('Ghi chú','na')}</li>`).join('')}</ul>
 <form id="ruleForm" class="stack" style="gap:10px;margin-top:16px;background:var(--paper);border-radius:18px;padding:18px" novalidate><b>Thêm quy tắc</b>
  <div class="two" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:10px"><div><label class="lb" for="rCond">Nếu</label><input class="inp" id="rCond" placeholder="Lắp trong nhà máy hoá chất"></div>
  <div><label class="lb" for="rEff">Thì</label><input class="inp" id="rEff" placeholder="Ưu tiên vỏ chống hoá chất"></div><div><label class="lb" for="rSrc">Nguồn</label><input class="inp" id="rSrc" placeholder="Kinh nghiệm DNG"></div></div>
  <div><button class="pill pri sm" type="submit">${ic('plus',15)}Thêm quy tắc</button></div></form></section>`
}
function admFeedback(){
 const k=t=>/đề xuất/.test(t)?'org':t==='Sai trích xuất'?'bad':'info';
 return `<div class="two" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)"><section class="card"><h2 class="sf" style="font-size:19px">Góp ý của nhân viên</h2>
  ${S.feedback.length?`<ul class="fb">${S.feedback.map((f,i)=>`<li><div style="flex:1"><div class="row" style="gap:8px">${chip(f.type,k(f.type))}<span class="mute" style="font-size:12px">${esc(f.u)} · ${esc(f.d)} · ${esc(f.e)}</span></div><p style="margin:6px 0 0">${esc(f.x)}</p></div>
   <button class="pill sm ${f.st==='Mới'?'soft':''}" data-act="fbToggle" data-i="${i}">${f.st==='Mới'?'Đánh dấu đã xử lý':ic('check',14)+'Đã xử lý'}</button></li>`).join('')}</ul>`:`<p class="mute">Chưa có góp ý.</p>`}</section>${fbForm()}</div>`
}
