/* Màn tổng quan: thẻ tóm tắt + lọc trạng thái + thẻ yêu cầu */
function vList(){
 const keys=['new','waiting','ready','done'],cnt=k=>S.enq.filter(e=>e.status===k).length;
 const open=S.enq.filter(e=>e.status!=='done').length;
 const dec=S.enq.filter(e=>e.decision),rate=dec.length?Math.round(dec.filter(e=>e.decision.matched).length/dec.length*100):0;
 const bar=keys.map(k=>cnt(k)?`<span style="flex:${cnt(k)};background:${STATUS[k][3]}"></span>`:'').join('');
 const leg=keys.map(k=>`<span><i style="background:${STATUS[k][3]}"></i>${STATUS[k][0]} ${cnt(k)}</span>`).join('');
 const tabs=[...keys.map(k=>[k,STATUS[k][0],cnt(k)]),['all','Tất cả',S.enq.length]]
  .map(([k,l,n])=>`<button class="pill sm ${S.tab===k?'org':'soft'}" data-act="tab" data-k="${k}" aria-pressed="${S.tab===k}">${l} · ${n}</button>`).join('');
 const newCnt=cnt('new');
 return `<div class="ph"><div><h1 class="sf h1">Yêu cầu của khách</h1><p>${newCnt?`${newCnt} yêu cầu mới đang chờ kiểm tra thông tin.`:'Không có yêu cầu mới.'}</p></div><span class="sp"></span>
  <label class="search">${ic('search',18)}<input id="q" type="search" placeholder="Tìm mã, khách hàng…" value="${esc(S.q)}" aria-label="Tìm yêu cầu"></label>
  <a class="pill org" href="#/new">${ic('plus',17)}Tạo yêu cầu</a></div>
 <section class="summary" aria-label="Tóm tắt"><div><p class="k">Đang mở</p><p class="v sf">${open} yêu cầu</p></div>
  <div style="flex:1 1 260px"><div class="sbar">${bar}</div><div class="legend">${leg}</div></div>
  <div style="text-align:right"><p class="k">Khớp gợi ý số 1</p><p class="v sf" style="color:#F7B48F">${rate}%</p></div></section>
 <div class="filters" role="group" aria-label="Lọc theo trạng thái">${tabs}</div>
 <div id="listBody">${listBody()}</div>
 <a class="pill org" href="#/new" style="width:100%;margin-top:16px" data-mobile-only>${ic('plus',17)}Tạo yêu cầu</a>
 <div class="note" style="margin-top:16px">${ic('box',16)}Tồn kho cập nhật ${esc(S.stock.date)} từ file ${esc(S.stock.file)}. Số lượng có thể lệch nếu có xuất nhập sau giờ này.</div>`
}
function listBody(){
 const q=S.q.trim().toLowerCase();
 const rows=S.enq.filter(e=>(S.tab==='all'||e.status===S.tab)&&(!q||(e.id+' '+e.cust+' '+e.msg).toLowerCase().includes(q)));
 if(!rows.length)return `<div class="empty">Không có yêu cầu nào khớp bộ lọc.</div>`;
 return `<div class="grid4">${rows.map(e=>`<a class="ecard" href="#/enquiry/${e.id}">
  <div class="row" style="justify-content:space-between"><span style="font-size:12.5px;font-weight:600;color:var(--mute)">${e.id}</span>${stChip(e.status)}</div>
  <h3>${esc(e.cust)}</h3><p class="meta">${ic(CHIC[e.src]||'msg',14)}${esc(e.src)} · ${esc(e.date)}</p>${progress(e)}
  <span class="pill sm ${['new','ready'].includes(e.status)?'pri':''}" style="align-self:flex-start">${e.status==='done'?'Xem lại':'Tiếp tục'}${ic('next',15)}</span></a>`).join('')}</div>`
}
