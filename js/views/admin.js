/* Màn quản trị và góp ý */
let ADM_TAB='fb';
function vAdmin(){
 const isAdmin=S.user.r==='admin';
 const fbForm=`<section class="card pad stack" style="gap:12px"><h2 style="font-size:16px">Gửi góp ý</h2>
  <div class="row" style="align-items:flex-start"><div style="flex:1 1 180px"><label class="lb" for="fbType">Loại</label><select class="inp" id="fbType"><option>Sai trích xuất</option><option>Đổi đề xuất</option><option>Giao diện</option><option>Khác</option></select></div>
  <div style="flex:1 1 140px"><label class="lb" for="fbE">Mã yêu cầu</label><input class="inp" id="fbE" placeholder="YC-0241"></div></div>
  <div><label class="lb" for="fbX">Nội dung</label><textarea class="inp" id="fbX" rows="3" placeholder="Mô tả ngắn điều chưa đúng hoặc cần cải thiện"></textarea></div>
  <div><button class="btn pri" data-act="fbSend">Gửi góp ý</button></div></section>`;
 const review=S.enq.filter(e=>e.status==='review');
 return `<div class="ph"><div><h1>Quản trị & góp ý</h1><div class="mute">${isAdmin?'Theo dõi góp ý của nhân viên và tình trạng dữ liệu tham chiếu.':'Gửi góp ý để nhóm cải thiện hệ thống.'}</div></div><span class="sp"></span>${isAdmin?`<button class="btn" data-act="reset">Đặt lại dữ liệu mẫu</button>`:''}</div>
 ${isAdmin?`<div class="stats">
  <div class="card pad stat"><span class="mute">Tài liệu kỹ thuật</span><b>5 catalogue</b><span class="mute" style="font-size:12px">Hãng [A], [B] · mẫu</span></div>
  <div class="card pad stat"><span class="mute">File tồn kho</span><b>25/11/2026</b><span class="mute" style="font-size:12px">Cập nhật 08:00 từ Excel</span></div>
  <div class="card pad stat"><span class="mute">Quy tắc kiểm tra</span><b>11 thông số</b><span class="mute" style="font-size:12px">1 mục tuỳ chọn</span></div></div>
 <div class="card" style="margin-bottom:20px"><div style="padding:0 16px"><div class="tabs">
  <button class="tab ${ADM_TAB==='fb'?'on':''}" data-act="admTab" data-k="fb">Góp ý<span class="cnt">${S.feedback.length}</span></button>
  <button class="tab ${ADM_TAB==='rv'?'on':''}" data-act="admTab" data-k="rv">Chờ duyệt<span class="cnt">${review.length}</span></button></div></div>
  ${ADM_TAB==='fb'?(S.feedback.length?`<div style="overflow-x:auto"><table style="min-width:680px"><thead><tr><th>Ngày</th><th>Người gửi</th><th>Yêu cầu</th><th>Loại</th><th>Nội dung</th><th>Trạng thái</th></tr></thead><tbody>
   ${S.feedback.map((f,i)=>`<tr style="cursor:default"><td class="mono" style="font-size:12px">${esc(f.d)}</td><td>${esc(f.u)}</td><td class="mono">${esc(f.e)}</td><td>${chip(f.type,f.type==='Đổi đề xuất'?'ai':f.type==='Sai trích xuất'?'miss':'info')}</td><td style="max-width:360px">${esc(f.x)}</td><td><button class="btn sm" data-act="fbToggle" data-i="${i}">${f.st==='Mới'?chip('Mới','info'):chip('✓ Đã xử lý','ok')}</button></td></tr>`).join('')}
   </tbody></table></div>`:`<div class="empty">Chưa có góp ý.</div>`)
  :(review.length?`<div style="padding:8px 16px 16px;display:flex;flex-direction:column;gap:8px">${review.map(e=>`<a class="card" href="#/enquiry/${e.id}" style="padding:12px 14px;display:flex;gap:12px;align-items:center;text-decoration:none;color:inherit;flex-wrap:wrap"><span class="mono mute">${e.id}</span><b>${esc(e.cust)}</b><span class="sp"></span><span class="mono" style="font-size:13px">${esc(e.selected||'—')}</span>${stChip(e.status)}</a>`).join('')}</div>`:`<div class="empty">Không có yêu cầu chờ duyệt.</div>`)}
 </div>${fbForm}`
 :`${fbForm}<div class="card pad" style="margin-top:20px"><div class="mute">Bảng góp ý, tài liệu và tồn kho chỉ hiển thị cho vai trò <b>Người duyệt</b>.</div><button class="btn" style="margin-top:12px" data-act="switchRole">Chuyển sang vai trò Người duyệt (dev)</button></div>`}`
}
