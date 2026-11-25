/* Màn danh sách yêu cầu */
function vList(){
 const tabs=[['all','Tất cả'],['new','Mới'],['waiting','Chờ khách'],['ready','Sẵn sàng'],['review','Chờ duyệt'],['done','Đã xác nhận']];
 const cnt=k=>k==='all'?S.enq.length:S.enq.filter(e=>e.status===k).length;
 return `<div class="ph"><div><h1>Yêu cầu của khách</h1><div class="mute">Tiếp nhận, kiểm tra thông số và đề xuất cáp cho từng yêu cầu.</div></div><span class="sp"></span><a class="btn pri" href="#/new">${I.plus}Tạo yêu cầu</a></div>
 <div class="banner">${I.info}<span>Dữ liệu tồn kho cập nhật lúc <b>08:00 · 25/11/2026</b> từ file Excel của kho. Số lượng có thể chênh lệch nếu có xuất nhập sau giờ này.</span></div>
 <div class="card">
  <div style="padding:0 16px"><div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button class="tab ${S.tab===k?'on':''}" role="tab" aria-selected="${S.tab===k}" data-act="tab" data-k="${k}">${l}<span class="cnt">${cnt(k)}</span></button>`).join('')}</div></div>
  <div style="padding:14px 16px"><input class="inp" id="q" type="search" placeholder="Tìm theo mã yêu cầu, tên khách hoặc nội dung…" value="${esc(S.q)}" aria-label="Tìm kiếm yêu cầu"></div>
  <div id="listBody">${listBody()}</div>
 </div>`
}
function listBody(){
 const q=S.q.trim().toLowerCase();
 const rows=S.enq.filter(e=>(S.tab==='all'||e.status===S.tab)&&(!q||(e.id+' '+e.cust+' '+e.msg).toLowerCase().includes(q)));
 if(!rows.length)return `<div class="empty">Không có yêu cầu nào khớp bộ lọc.</div>`;
 return `<div class="tbl"><table><thead><tr><th>Mã</th><th>Khách hàng</th><th>Nhận lúc</th><th>Kênh</th><th>Thông số</th><th>Trạng thái</th></tr></thead><tbody>
 ${rows.map(e=>`<tr data-act="open" data-id="${e.id}"><td class="mono"><a href="#/enquiry/${e.id}">${e.id}</a></td><td style="font-weight:600">${esc(e.cust)}</td><td>${esc(e.date)}</td><td>${esc(e.src)}</td><td>${progress(e)}</td><td>${stChip(e.status)}</td></tr>`).join('')}
 </tbody></table></div>
 <div class="ecards" style="padding:0 12px 12px">${rows.map(e=>`<a class="card" href="#/enquiry/${e.id}" style="display:block;padding:14px;text-decoration:none;color:inherit">
  <div class="row" style="justify-content:space-between"><span class="mono mute" style="font-size:13px">${e.id}</span>${stChip(e.status)}</div>
  <div style="font-weight:600;margin:6px 0 8px">${esc(e.cust)}</div>
  <div class="row" style="justify-content:space-between"><span class="mute" style="font-size:13px">${esc(e.src)} · ${esc(e.date)}</span>${progress(e)}</div></a>`).join('')}</div>`
}
