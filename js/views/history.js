/* Lịch sử: mã đã chốt, có giữ gợi ý hay không, và báo giá đã tạo */
function vHistory(){
 const rows=S.enq.filter(e=>e.status==='done'&&e.decision);
 const matched=rows.filter(e=>e.decision.matched).length,rate=rows.length?Math.round(matched/rows.length*100):0,quoted=rows.filter(e=>e.quote).length;
 const q=e=>e.quote?`<span class="row" style="gap:6px"><button class="pill sm soft" data-act="hXlsx" data-id="${e.id}">${ic('excel',14)}${e.quote.no}.xlsx</button><button class="pill sm soft" data-act="hPdf" data-id="${e.id}">PDF</button></span>`:`<a class="pill sm" href="#/enquiry/${e.id}/4">Tạo báo giá</a>`;
 return `<div class="ph"><div><h1 class="sf h1">Lịch sử quyết định</h1><p>Mã cáp đã chốt, có giữ gợi ý hay không, và báo giá đã tạo.</p></div></div>
 <div class="stats"><section class="card row" style="gap:18px;flex-wrap:nowrap">${ring(rate,96,11)}<div><b style="font-size:16px">Khớp với gợi ý số 1</b><p class="mute" style="margin:4px 0 0;font-size:13px">${matched}/${rows.length} quyết định giữ nguyên gợi ý của hệ thống</p></div></section>
  <section class="card stat"><span class="k">Yêu cầu đã chốt</span><b class="v sf">${rows.length}</b></section><section class="card stat"><span class="k">Báo giá đã tạo</span><b class="v sf">${quoted}</b></section></div>
 ${rows.length?`<ul class="hlist">${rows.map(e=>`<li class="hitem"><div><span class="mute" style="font-size:12.5px;font-weight:600">${e.id}</span><a href="#/enquiry/${e.id}/4" style="display:block;font-weight:700;font-size:15.5px;text-decoration:none">${esc(e.cust)}</a><span class="mute" style="font-size:12.5px">${esc(e.decision.by)} · ${esc(e.decision.t)}</span></div>
  <div><b class="sf" style="font-size:22px">${esc(e.decision.code)}</b>${e.decision.matched?'':`<p class="mute" style="margin:2px 0 0;font-size:12px">Gợi ý: ${esc(e.decision.top)} · ${esc(e.decision.reason)}</p>`}</div>
  <div>${e.decision.matched?chip('Theo gợi ý','ok','check'):chip('Đã sửa','org','alert')}</div>${q(e)}</li>`).join('')}</ul>`:`<div class="empty">Chưa có yêu cầu nào được chốt mã cáp.</div>`}`
}
