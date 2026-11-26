/* Màn tạo yêu cầu mới: một khung lớn, ô nội dung và ô tải file đặt cạnh nhau */
let NEW={cust:'',contact:'',src:'Zalo',msg:'',files:[],bad:[]};
function vNew(){
 const seg=['Zalo','Email','Điện thoại','Khác'].map(c=>`<button type="button" class="pill sm ${NEW.src===c?'pri':'soft'}" aria-pressed="${NEW.src===c}" data-act="src" data-k="${c}">${ic(CHIC[c]||'msg',15)}${c}</button>`).join('');
 return `<div class="ph"><div><h1 class="sf h1">Tạo yêu cầu mới</h1><p>Dán tin nhắn hoặc tải file khách gửi. Hệ thống sẽ đọc và lập checklist.</p></div></div>
 <form class="card stack" id="newForm" novalidate style="padding:32px;gap:22px">
  <div class="two" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:18px">
   <div><label class="lb" for="ncust">Tên khách / công ty <span style="color:var(--bad)">*</span></label><input class="inp" id="ncust" value="${esc(NEW.cust)}" placeholder="Ví dụ: Cty CP Kỹ thuật Hải Đăng"></div>
   <div><label class="lb" for="ncontact">Người liên hệ</label><input class="inp" id="ncontact" value="${esc(NEW.contact)}" placeholder="Ví dụ: anh Tuấn"></div></div>
  <div><span class="lb">Kênh nhận</span><div class="row" role="group" aria-label="Kênh nhận" style="gap:8px">${seg}</div></div>
  <div class="two" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:18px;align-items:stretch">
   <div><div class="row" style="justify-content:space-between;margin-bottom:6px"><label class="lb" for="nmsg" style="margin:0">Nội dung khách gửi</label><button type="button" class="pill sm ghost" data-act="sample">Dùng tin nhắn mẫu</button></div>
    <textarea class="inp" id="nmsg" rows="11" style="font-size:16px" placeholder="Dán nguyên văn tin nhắn hoặc email (tiếng Việt hoặc tiếng Anh). Có thể để trống nếu khách chỉ gửi file.">${esc(NEW.msg)}</textarea></div>
   <div style="display:flex;flex-direction:column"><span class="lb">File đính kèm</span>
    <label class="drop" for="nfile" style="flex:1"><span class="ico">${ic('upload',22)}</span><b>Chọn file PDF hoặc ảnh</b><span style="font-size:12.5px">PDF, PNG, JPG, WEBP · tối đa 10 MB</span></label>
    <input type="file" id="nfile" class="vh" multiple accept=".pdf,image/png,image/jpeg,image/webp"><div id="nfiles">${newFilesHTML()}</div></div></div>
  <div class="actbar" style="margin-top:0"><a class="pill" href="#/enquiries">Huỷ</a><button class="pill org" type="submit" style="height:52px;font-size:15px">Phân tích yêu cầu${ic('next',17)}</button></div>
 </form>`
}
function newFilesHTML(){
 return `${NEW.files.length?`<div class="fchips">${fileChips(NEW.files,'nfileDel')}</div>`:''}
 ${NEW.bad.length?`<div class="ferr" role="alert">${NEW.bad.map(x=>`<div>! ${esc(x)}</div>`).join('')}</div>`:''}`
}
