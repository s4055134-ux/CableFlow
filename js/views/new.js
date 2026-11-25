/* Màn tạo yêu cầu mới */
let NEW={cust:'',contact:'',src:'Zalo',msg:'',files:[],bad:[]};
function vNew(){
 return `<div class="ph"><div><a href="#/enquiries" class="row mute" style="gap:4px;text-decoration:none;font-size:13px;margin-bottom:6px">${I.back}Danh sách yêu cầu</a><h1>Tạo yêu cầu mới</h1></div></div>
 <div class="grid2">
  <form class="card pad stack" id="newForm" novalidate>
   <div class="row" style="align-items:flex-start;gap:16px">
    <div style="flex:2 1 240px"><label class="lb" for="ncust">Tên khách / công ty <span style="color:#A8261B">*</span></label><input class="inp" id="ncust" value="${esc(NEW.cust)}" placeholder="Ví dụ: Cty CP Kỹ thuật Hải Đăng"></div>
    <div style="flex:1 1 160px"><label class="lb" for="ncontact">Người liên hệ</label><input class="inp" id="ncontact" value="${esc(NEW.contact)}" placeholder="Ví dụ: anh Tuấn"></div>
   </div>
   <div><span class="lb">Kênh nhận</span><div class="seg" role="group" aria-label="Kênh nhận">${['Zalo','Email','Điện thoại','Khác'].map(s=>`<button type="button" class="${NEW.src===s?'on':''}" aria-pressed="${NEW.src===s}" data-act="src" data-k="${s}">${s}</button>`).join('')}</div></div>
   <div><div class="row" style="justify-content:space-between;margin-bottom:6px"><label class="lb" for="nmsg" style="margin:0">Nội dung khách gửi</label><button type="button" class="btn sm ghost" data-act="sample">Dùng tin nhắn mẫu</button></div>
    <textarea class="inp" id="nmsg" rows="9" placeholder="Dán nguyên văn tin nhắn, email của khách (tiếng Việt hoặc tiếng Anh). Có thể để trống nếu khách chỉ gửi file.">${esc(NEW.msg)}</textarea></div>
   <div><span class="lb">File đính kèm</span>
    <label class="drop" for="nfile">${I.upload}<div style="font-weight:600;color:var(--ink)">Chọn file PDF hoặc ảnh</div><div style="font-size:13px">PDF, PNG, JPG, WEBP · tối đa 10 MB mỗi file</div></label>
    <input type="file" id="nfile" class="vh" multiple accept=".pdf,image/png,image/jpeg,image/webp">
    <div id="nfiles">${newFilesHTML()}</div></div>
   <div class="row" style="justify-content:flex-end"><a class="btn" href="#/enquiries">Huỷ</a><button class="btn pri" type="submit">Phân tích yêu cầu →</button></div>
  </form>
  <aside class="card pad stack" style="gap:10px"><h2 style="font-size:16px">Sau khi bấm Phân tích</h2>
   <ol style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;color:var(--ink2)">
    <li>Hệ thống trích các thông số có trong tin nhắn và file vào checklist 11 mục.</li>
    <li>Mục còn thiếu được đánh dấu đỏ, tin nhắn hỏi lại khách được soạn sẵn.</li>
    <li>Bạn kiểm tra, sửa nếu cần, rồi gửi cho khách qua kênh đang dùng.</li>
   </ol>
   <div class="mute" style="font-size:12px">Bản dev dùng quy tắc nhận dạng đơn giản để mô phỏng bước AI, và chưa đọc được nội dung file. Với yêu cầu chỉ có file, bạn điền checklist thủ công.</div>
  </aside>
 </div>`
}

function newFilesHTML(){
 return `${NEW.files.length?`<div class="fchips">${fileChips(NEW.files,'nfileDel')}</div>`:''}
 ${NEW.bad.length?`<div class="ferr" role="alert">${NEW.bad.map(x=>`<div>! ${esc(x)}</div>`).join('')}</div>`:''}`
}
