/* Workspace 4 bước: thông tin, hỏi lại, đề xuất, xác nhận */
function stepper(e){
 const miss=reqMissing(e).length;
 const done=[miss===0,e.sent||miss===0,!!e.selected,e.status==='done'];
 const cur=e.view==='info'?(miss===0?1:(e.sent?2:1)):(e.selected?4:3);
 const L=[['Thông tin','Checklist 11 mục'],['Hỏi lại khách','Tin nhắn soạn sẵn'],['Đề xuất & kho','Chọn mã cáp'],['Xác nhận','Người xử lý chốt']];
 return `<div class="steps">${L.map((s,i)=>`<button class="st ${done[i]?'done':''} ${cur===i+1?'cur':''}" data-act="view" data-k="${i<2?'info':'result'}" ${cur===i+1?'aria-current="step"':''}><span class="n">${done[i]?'✓':i+1}</span><span><b>${s[0]}</b><small>${s[1]}</small></span></button>`).join('')}</div>`
}
function vWork(e){
 return `<div class="ph"><div><a href="#/enquiries" class="row mute" style="gap:4px;text-decoration:none;font-size:13px;margin-bottom:6px">${I.back}Danh sách yêu cầu</a>
  <div class="row" style="gap:10px"><span class="mono mute">${e.id}</span>${stChip(e.status)}</div>
  <h1 style="margin-top:4px">${esc(e.cust)}</h1><div class="mute">${esc(e.contact||'—')} · ${esc(e.src)} · ${esc(e.date)}</div></div></div>
 ${stepper(e)}
 ${e.view==='info'?vInfo(e):vResult(e)}`
}
function vInfo(e){
 const miss=reqMissing(e),draft=e.draft??genDraft(e),wide=window.innerWidth>860;
 return `<div class="ws">
 <div class="stack">
  <details class="card pad" ${wide?'open':''}><summary style="cursor:pointer;font-weight:700;font-size:16px">Tin nhắn gốc</summary>
   <div class="orig" style="margin-top:12px">${hl(e.msg,e)}</div>
   ${e.replies.map(r=>`<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--line2)"><div class="mute" style="font-size:12px;margin-bottom:4px">Khách trả lời · ${esc(r.t)}</div><div class="orig">${hl(r.x,e)}</div></div>`).join('')}
   <div class="mute" style="font-size:12px;margin-top:12px"><mark>Phần tô vàng</mark> là đoạn hệ thống đã trích thành thông số.</div>
  </details>
  <section class="card pad"><h2 style="font-size:16px;margin-bottom:12px">Lịch sử xử lý</h2><ul class="hist">${e.hist.slice().reverse().map(h=>`<li><span class="mono">${esc(h.t)}</span><span>${esc(h.x)}</span></li>`).join('')}</ul></section>
 </div>
 <div class="stack">
  <section class="card pad">
   <div class="row" style="justify-content:space-between;margin-bottom:6px"><h2 style="font-size:16px">Bước 1 · Checklist thông số</h2><div class="prog">${progress(e)}</div></div>
   <div class="mute" style="font-size:13px;margin-bottom:8px">Sửa trực tiếp giá trị nếu chưa đúng. Giá trị bạn nhập hoặc bấm ✓ sẽ được tính là đã xác nhận.</div>
   ${FIELDS.map(F=>{const x=e.f[F.k];return `<div class="ck"><div class="k">${F.l}${F.h?`<small>${F.h}</small>`:''}</div>
    <input class="inp" data-field="${F.k}" value="${esc(x.v)}" placeholder="${x.st==='na'?'Không áp dụng':'Chưa có'}" aria-label="${F.l}">
    <div>${chip(ST[x.st][0],ST[x.st][1])}</div>
    <div class="acts">${x.st==='ai'?`<button class="btn sm" data-act="okField" data-k="${F.k}" title="Xác nhận giá trị AI trích" aria-label="Xác nhận ${F.l}">✓</button>`:''}${x.st!=='na'?`<button class="btn sm ghost" data-act="naField" data-k="${F.k}" title="Không áp dụng" aria-label="Đánh dấu ${F.l} không áp dụng">–</button>`:`<button class="btn sm ghost" data-act="unNa" data-k="${F.k}" title="Bỏ đánh dấu">↺</button>`}</div></div>`}).join('')}
  </section>
  <section class="card pad stack" style="gap:12px">
   <div class="row" style="justify-content:space-between"><h2 style="font-size:16px">Bước 2 · Tin nhắn hỏi lại khách</h2>${e.sent?chip('✓ Đã gửi','ok'):''}</div>
   ${draft?`<textarea class="inp" id="draft" rows="10" aria-label="Tin nhắn hỏi lại">${esc(draft)}</textarea>
   <div class="row"><button class="btn sm ghost" data-act="regen">↺ Soạn lại theo checklist</button></div>
   <div class="actbar"><button class="btn" data-act="copy">Sao chép tin nhắn</button><button class="btn" data-act="sent">Đánh dấu đã gửi</button></div>`
   :`<div class="mute">Thông tin đã đủ và đã xác nhận, không cần hỏi lại khách.</div>`}
   <div style="border-top:1px solid var(--line2);padding-top:14px"><label class="lb" for="reply">Dán câu trả lời của khách</label>
    <textarea class="inp" id="reply" rows="3" placeholder="Ví dụ: Nhiệt độ tối đa 40 độ C, cáp vận hành liên tục 24/7."></textarea>
    <div class="row" style="margin-top:8px"><button class="btn" data-act="reply">Cập nhật thông số từ trả lời</button></div></div>
  </section>
  <div class="actbar stick" style="justify-content:flex-end">${miss.length?`<span class="mute" style="font-size:13px">Còn thiếu ${miss.length} thông số bắt buộc</span>`:''}<button class="btn pri" data-act="view" data-k="result">Xem đề xuất cáp →</button></div>
 </div></div>`
}
function vResult(e){
 const ops=options(e),miss=reqMissing(e);
 const specs=FIELDS.filter(F=>!['miss','na'].includes(e.f[F.k].st)).map(F=>chip(F.l+': '+e.f[F.k].v,e.f[F.k].st==='ok'?'ok':'ai')).join('');
 if(!ops)return `<div class="card pad stack"><h2 style="font-size:16px">Chưa đủ thông tin để đề xuất</h2><p class="mute" style="margin:0">Cần tối thiểu <b>số lõi</b> và <b>tiết diện</b>. Quay lại bước 1–2 để bổ sung hoặc hỏi lại khách.</p><div><button class="btn pri" data-act="view" data-k="info">← Về checklist</button></div></div>`;
 const top=ops[0].code,done=e.status==='done';
 return `<div class="stack">
 <section class="card pad"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h2 style="font-size:16px">Yêu cầu kỹ thuật</h2>${progress(e)}</div>
  <div class="specs">${specs}</div>
  ${miss.length?`<div class="banner" style="margin:12px 0 0">${I.info}<span>Còn thiếu: ${miss.map(F=>F.l.toLowerCase()).join(', ')}. Đề xuất bên dưới chỉ dựa trên thông số đã có.</span></div>`:''}</section>
 <div class="row" style="gap:8px">${chip('AI đề xuất','info')}<span class="mute" style="font-size:13px">Xếp theo mức khớp với yêu cầu, sau đó theo tồn kho. Luôn kiểm tra nguồn trước khi xác nhận.</span></div>
 <div class="opts">${ops.map((o,i)=>{const c=conf(o.score),sel=e.selected===o.code;return `<article class="card opt ${sel?'sel':''}">
  <div class="row" style="justify-content:space-between"><span class="mute" style="font-size:12px;font-weight:600">PHƯƠNG ÁN ${i+1}${i===0?' · ĐỀ XUẤT':''}</span>${chip(c[0],c[1])}</div>
  <div class="mono" style="font-size:15px">${esc(o.name)}</div>
  <div>${o.rows.map(r=>`<div class="mrow"><span>${esc(r.l)}</span>${r.ok?chip('✓ Đạt','ok'):chip('✗ Không đạt','miss')}</div>`).join('')}</div>
  <div style="font-size:13px">Nguồn: <a href="#" data-act="srcLink">${esc(o.src)}</a></div>
  <div class="stock"><b style="font-size:13px">Tồn kho</b>${stockChip(o)}</div>
  <button class="btn ${sel?'pri':''}" data-act="pick" data-k="${o.code}" ${done?'disabled':''}>${sel?'✓ Đã chọn':'Chọn phương án này'}</button></article>`}).join('')}</div>
 <section class="card pad stack" style="gap:12px">
  <h2 style="font-size:16px">Bước 4 · Xác nhận</h2>
  ${done?`<div class="banner" style="background:#E3F3EA;border-color:#B9DEC8;color:#17603A;margin:0">✓ Đã xác nhận mã cáp <b class="mono">&nbsp;${esc(e.selected)}</b></div>
   <div class="row"><button class="btn" disabled title="Mục tiêu mở rộng">Tạo chào giá ${chip('Sắp có','na')}</button><button class="btn ghost" data-act="reopen">Mở lại yêu cầu</button></div>`
  :`<div class="mute">${e.selected?`Đang chọn <b class="mono" style="color:var(--ink)">${esc(e.selected)}</b>.`:'Chọn một phương án ở trên.'}</div>
   ${e.selected&&e.selected!==top?`<div><label class="lb" for="reason">Lý do không chọn phương án 1 <span style="color:#A8261B">*</span></label>
    <select class="inp" id="reason"><option value="">Chọn lý do…</option>${REASONS.map(r=>`<option ${e.reason===r?'selected':''}>${r}</option>`).join('')}</select>
    <div class="mute" style="font-size:12px;margin-top:6px">Lý do được ghi vào nhật ký góp ý để cải thiện đề xuất.</div></div>`:''}
   <div><label class="lb" for="note">Ghi chú nội bộ</label><textarea class="inp" id="note" rows="2" placeholder="Không bắt buộc">${esc(e.note)}</textarea></div>
   <div class="actbar stick"><button class="btn" data-act="toReview">Chuyển người duyệt</button><button class="btn pri" data-act="confirm">Xác nhận mã cáp</button></div>`}
 </section></div>`
}
