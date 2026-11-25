/* Màn quản trị và góp ý */
let ADM_TAB='fb';
function vAdmin(){
 const isAdmin=S.user.r==='admin';
 const fbForm=`<section class="card pad stack" style="gap:12px"><h2 style="font-size:16px">Gửi góp ý</h2>
  <div class="row" style="align-items:flex-start"><div style="flex:1 1 180px"><label class="lb" for="fbType">Loại</label><select class="inp" id="fbType"><option>Sai trích xuất</option><option>Đổi đề xuất</option><option>Giao diện</option><option>Khác</option></select></div>
  <div style="flex:1 1 140px"><label class="lb" for="fbE">Mã yêu cầu</label><input class="inp" id="fbE" placeholder="YC-0241"></div></div>
  <div><label class="lb" for="fbX">Nội dung</label><textarea class="inp" id="fbX" rows="3" placeholder="Mô tả ngắn điều chưa đúng hoặc cần cải thiện"></textarea></div>
  <div><button class="btn pri" data-act="fbSend">Gửi góp ý</button></div></section>`;
 const st=S.stock,autoN=S.rules.filter(r=>r.auto&&r.active).length;
 return `<div class="ph"><div><h1>Quản trị & góp ý</h1><div class="mute">${isAdmin?'Cập nhật file tồn kho, quy tắc chọn cáp và theo dõi góp ý của nhân viên.':'Gửi góp ý để nhóm cải thiện hệ thống.'}</div></div><span class="sp"></span>${isAdmin?`<button class="btn" data-act="reset">Đặt lại dữ liệu mẫu</button>`:''}</div>
 ${isAdmin?`<div class="stats">
  <div class="card pad stat"><span class="mute">File tồn kho</span><b>${esc(st.date)}</b><span class="mute" style="font-size:12px">${esc(st.file)} · ${st.rows} dòng${st.sample?' · dữ liệu mẫu':''}</span></div>
  <div class="card pad stat"><span class="mute">Quy tắc chọn cáp</span><b>${S.rules.filter(r=>r.active).length} đang bật</b><span class="mute" style="font-size:12px">${autoN} quy tắc được áp dụng tự động</span></div>
  <div class="card pad stat"><span class="mute">Góp ý chưa xử lý</span><b>${S.feedback.filter(f=>f.st==='Mới').length}</b><span class="mute" style="font-size:12px">trên tổng ${S.feedback.length} góp ý</span></div></div>
 <div class="card" style="margin-bottom:20px"><div style="padding:0 16px"><div class="tabs" role="tablist">
  ${[['fb','Góp ý',S.feedback.length],['stock','Tồn kho',st.rows],['rules','Quy tắc',S.rules.length]].map(([k,l,n])=>`<button class="tab ${ADM_TAB===k?'on':''}" role="tab" aria-selected="${ADM_TAB===k}" data-act="admTab" data-k="${k}">${l}<span class="cnt">${n}</span></button>`).join('')}</div></div>
  ${ADM_TAB==='fb'?admFeedback():ADM_TAB==='stock'?admStock():admRules()}
 </div>${fbForm}`
 :`${fbForm}<div class="card pad" style="margin-top:20px"><div class="mute">Tồn kho, quy tắc và bảng góp ý chỉ hiển thị cho vai trò <b>Quản trị</b>.</div><button class="btn" style="margin-top:12px" data-act="switchRole">Chuyển sang vai trò Quản trị (dev)</button></div>`}`
}
function admFeedback(){
 return S.feedback.length?`<div style="overflow-x:auto"><table style="min-width:680px"><thead><tr><th>Ngày</th><th>Người gửi</th><th>Yêu cầu</th><th>Loại</th><th>Nội dung</th><th>Trạng thái</th></tr></thead><tbody>
   ${S.feedback.map((f,i)=>`<tr style="cursor:default"><td class="mono" style="font-size:12px">${esc(f.d)}</td><td>${esc(f.u)}</td><td class="mono">${esc(f.e)}</td><td>${chip(f.type,/đề xuất/.test(f.type)?'ai':f.type==='Sai trích xuất'?'miss':'info')}</td><td style="max-width:360px">${esc(f.x)}</td><td><button class="btn sm" data-act="fbToggle" data-i="${i}">${f.st==='Mới'?chip('Mới','info'):chip('✓ Đã xử lý','ok')}</button></td></tr>`).join('')}
   </tbody></table></div>`:`<div class="empty">Chưa có góp ý.</div>`
}
let STOCK_ERR=[];
function admStock(){
 const ent=Object.entries(S.stock.map).slice(0,8);
 return `<div class="pad stack" style="gap:14px">
  <div class="row" style="align-items:flex-start;gap:16px">
   <div style="flex:1 1 320px"><label class="drop" for="stockFile">${I.upload}<div style="font-weight:600;color:var(--ink)">Tải lên file tồn kho mới</div><div style="font-size:13px">Excel (.xlsx) hoặc CSV · thay toàn bộ dữ liệu tồn kho hiện tại</div></label>
    <input type="file" id="stockFile" class="vh" accept=".xlsx,.xls,.csv"></div>
   <div style="flex:1 1 260px;font-size:13px" class="stack"><div><b>Cột bắt buộc</b> (không phân biệt dấu, hoa thường):<br><span class="mono">ma_cap, so_loi, tiet_dien, ton_kho_m</span></div>
    <div><button class="btn sm" data-act="stockTpl">Tải file mẫu (CSV)</button></div>
    <div class="mute">Kết quả tồn kho chỉ là kiểm tra tham khảo. Hàng cắt lẻ được cập nhật thủ công nên có thể lệch.</div></div>
  </div>
  ${STOCK_ERR.length?`<div class="ferr" role="alert">${STOCK_ERR.map(x=>`<div>! ${esc(x)}</div>`).join('')}</div>`:''}
  <div><div class="row" style="justify-content:space-between;margin-bottom:8px"><b>Dữ liệu đang dùng</b><span class="mute" style="font-size:13px">${esc(S.stock.file)} · ${esc(S.stock.date)} · ${S.stock.rows} dòng</span></div>
  <div style="overflow-x:auto"><table style="min-width:480px"><thead><tr><th>Mã cáp</th><th>Số lõi</th><th>Tiết diện (mm²)</th><th>Tồn kho (m)</th></tr></thead><tbody>
  ${ent.map(([k,v])=>{const [c,n,s]=k.split('|');return `<tr style="cursor:default"><td class="mono">${esc(c)}</td><td>${esc(n)}</td><td>${esc(s)}</td><td>${v}</td></tr>`}).join('')}
  </tbody></table></div>${S.stock.rows>8?`<div class="mute" style="font-size:12px;margin-top:6px">Hiển thị 8 / ${S.stock.rows} dòng.</div>`:''}</div>
 </div>`
}
function admRules(){
 return `<div class="pad stack" style="gap:12px">
  <div class="mute" style="font-size:13px">Quy tắc có nhãn <b>Tự động</b> đang được code dùng khi xếp hạng phương án. Quy tắc <b>Ghi chú</b> là quy tắc đã thu thập, sẽ được chuyển thành điều kiện tự động trong A3.</div>
  <ul class="rules">${S.rules.map((r,i)=>`<li class="${r.active?'':'off'}">
   <label class="sw"><input type="checkbox" data-rule="${i}" ${r.active?'checked':''}><span class="vh">Bật quy tắc</span></label>
   <div style="flex:1"><div><b>Nếu</b> ${esc(r.cond)} <b>thì</b> ${esc(r.eff)}</div><div class="mute" style="font-size:12px">Nguồn: ${esc(r.src)}</div></div>
   ${r.auto?chip('Tự động','ok'):chip('Ghi chú','na')}</li>`).join('')}</ul>
  <form id="ruleForm" class="card pad stack" style="gap:10px;background:#FAFBFC" novalidate><b>Thêm quy tắc</b>
   <div class="row" style="align-items:flex-start"><div style="flex:1 1 220px"><label class="lb" for="rCond">Nếu</label><input class="inp" id="rCond" placeholder="Ví dụ: Lắp trong nhà máy hoá chất"></div>
   <div style="flex:1 1 220px"><label class="lb" for="rEff">Thì</label><input class="inp" id="rEff" placeholder="Ví dụ: Ưu tiên vỏ chống hoá chất"></div>
   <div style="flex:0 1 180px"><label class="lb" for="rSrc">Nguồn</label><input class="inp" id="rSrc" placeholder="Kinh nghiệm DNG"></div></div>
   <div><button class="btn pri" type="submit">Thêm quy tắc</button></div></form>
 </div>`
}
