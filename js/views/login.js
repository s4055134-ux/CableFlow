/* Màn đăng nhập (chế độ dev: không cần tài khoản) */
const APP_TITLE='Hệ thống báo giá kỹ thuật';
function vLogin(){
 const steps=[['Kiểm tra thông tin','msg'],['Hỏi lại khách','send'],['Gợi ý mã cáp','cable'],['Xác nhận & báo giá','excel']]
  .map(([t,i])=>`<li><span class="ico">${ic(i,16)}</span>${t}</li>`).join('');
 return `<div class="login">
 <div><span class="brand" style="display:inline-flex"><img src="${LOGO}" alt="Logo Đông Nguyên Gia"><span><b>CableFlow</b><span>Đông Nguyên Gia</span></span></span></div>
 <div class="lpanel"><div class="lbox">
  <div class="lintro"><h1 class="sf">${APP_TITLE}</h1><span class="lline"></span><p class="mute" style="margin:12px 0 0;font-size:15px">Đông Nguyên Gia · công cụ nội bộ</p><ul>${steps}</ul></div>
  <form class="lform" id="loginForm" novalidate>
   <div><h2 class="sf" style="font-size:24px">Đăng nhập</h2><p class="mute" style="margin:4px 0 0">Dùng tài khoản do quản trị viên cấp.</p></div>
   <div><label class="lb" for="em">Email công ty</label><input class="inp" id="em" type="email" autocomplete="username" placeholder="ten@dongnguyengia.vn"></div>
   <div><label class="lb" for="pw">Mật khẩu</label><input class="inp" id="pw" type="password" autocomplete="current-password" placeholder="••••••••"></div>
   <fieldset style="border:0;margin:0;padding:0"><legend class="lb">Vào với vai trò</legend>
    <div class="roles"><label><input type="radio" name="role" value="staff" checked>Nhân viên</label><label><input type="radio" name="role" value="admin">Quản trị</label></div></fieldset>
   <button class="pill pri" type="submit" style="height:52px;font-size:15px">Đăng nhập</button>
   <p class="note" style="margin:0">${ic('alert',16)}Bản dev: nhập email và mật khẩu bất kỳ (hoặc để trống) để vào.</p>
  </form></div></div>
 <p class="mute" style="margin:0;font-size:12px;text-align:center">Chỉ dành cho nhân viên Đông Nguyên Gia</p></div>`
}
