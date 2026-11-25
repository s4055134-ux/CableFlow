/* Lịch sử: các yêu cầu đã chốt mã cáp, khớp đề xuất hay đã sửa, và báo giá đã tạo */
function vHistory(){
 const rows=S.enq.filter(e=>e.status==='done'&&e.decision);
 const matched=rows.filter(e=>e.decision.matched).length;
 const rate=rows.length?Math.round(matched/rows.length*100):0;
 const quoted=rows.filter(e=>e.quote).length;
 const qcell=e=>e.quote?`<span class="mono">${esc(e.quote.no)}</span> · ${vnd(quoteCalc(e.quote).total)}<div class="row" style="gap:4px;margin-top:6px"><button class="btn sm" data-act="hXlsx" data-id="${e.id}">Excel</button><button class="btn sm" data-act="hPdf" data-id="${e.id}">PDF</button></div>`:'<span class="mute">Chưa tạo</span>';
 const mchip=e=>e.decision.matched?chip('✓ Theo đề xuất','ok'):chip('✎ Đã sửa','ai');
 return `<div class="ph"><div><h1>Lịch sử quyết định</h1><div class="mute">Mã cáp đã chốt cho từng yêu cầu, có khớp với đề xuất hay không, và báo giá đã tạo.</div></div></div>
 <div class="stats">
  <div class="card pad stat"><span class="mute">Yêu cầu đã chốt</span><b>${rows.length}</b></div>
  <div class="card pad stat"><span class="mute">Khớp với đề xuất số 1</span><b>${rate}%</b><span class="mute" style="font-size:12px">${matched}/${rows.length} quyết định giữ nguyên đề xuất của hệ thống</span></div>
  <div class="card pad stat"><span class="mute">Báo giá đã tạo</span><b>${quoted}</b></div>
 </div>
 <div class="card">${rows.length?`
  <div class="tbl" style="overflow-x:auto"><table style="min-width:860px"><thead><tr><th>Yêu cầu</th><th>Khách hàng</th><th>Mã đã chốt</th><th>So với đề xuất</th><th>Người chốt</th><th>Báo giá</th></tr></thead><tbody>
  ${rows.map(e=>`<tr style="cursor:default"><td class="mono"><a href="#/enquiry/${e.id}">${e.id}</a></td><td style="font-weight:600">${esc(e.cust)}</td>
   <td class="mono">${esc(e.decision.code)}</td><td>${mchip(e)}${e.decision.matched?'':`<div class="mute" style="font-size:12px;margin-top:4px">Đề xuất: ${esc(e.decision.top)} · ${esc(e.decision.reason)}</div>`}</td>
   <td>${esc(e.decision.by)}<div class="mute" style="font-size:12px">${esc(e.decision.t)}</div></td><td>${qcell(e)}</td></tr>`).join('')}
  </tbody></table></div>
  <div class="ecards" style="padding:12px">${rows.map(e=>`<div class="card" style="padding:14px">
   <div class="row" style="justify-content:space-between"><a class="mono" href="#/enquiry/${e.id}">${e.id}</a>${mchip(e)}</div>
   <div style="font-weight:600;margin:6px 0 4px">${esc(e.cust)}</div>
   <div class="mono" style="font-size:13px">${esc(e.decision.code)}</div>
   <div class="mute" style="font-size:12px;margin:4px 0 8px">${esc(e.decision.by)} · ${esc(e.decision.t)}</div>${qcell(e)}</div>`).join('')}</div>`
 :`<div class="empty">Chưa có yêu cầu nào được chốt mã cáp.</div>`}</div>`
}
