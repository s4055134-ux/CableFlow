/* Màn đăng nhập (chế độ dev: không cần tài khoản) */
function vLogin(){
 return `<div class="login">
 <section class="brand">
  <div class="logo" style="padding:0"><b>CF</b><div><div style="font-weight:700;font-size:18px">CableFlow</div><div style="font-size:13px;opacity:.85">Đông Nguyên Gia</div></div></div>
  <div style="max-width:460px"><div style="font-size:13px;font-weight:600;letter-spacing:.08em;opacity:.8;margin-bottom:12px">HỆ THỐNG NỘI BỘ</div>
  <h1 class="big" style="font-size:34px;line-height:1.3;font-weight:700">Hệ thống xử lý yêu cầu kỹ thuật &amp; báo giá</h1></div>
  <div class="foot" style="font-size:13px;opacity:.8">Công cụ nội bộ · Chỉ dành cho nhân viên Đông Nguyên Gia</div>
 </section>
 <section class="lform">
  <form class="card stack" id="loginForm" novalidate>
   <div><h2 style="font-size:24px;font-weight:700;margin-bottom:6px">Đăng nhập</h2><p class="mute" style="margin:0">Dùng tài khoản do quản trị viên cấp.</p></div>
   <div class="devnote">${I.info}<div><b>Chế độ phát triển.</b> Chưa kết nối tài khoản thật: nhập email và mật khẩu bất kỳ (hoặc để trống) để vào.</div></div>
   <div><label class="lb" for="em">Email công ty</label><input class="inp" id="em" type="email" autocomplete="username" placeholder="ten@dongnguyengia.vn"></div>
   <div><label class="lb" for="pw">Mật khẩu</label><input class="inp" id="pw" type="password" autocomplete="current-password" placeholder="••••••••"></div>
   <fieldset style="border:0;margin:0;padding:0"><legend class="lb" style="padding:0">Vào với vai trò</legend>
    <div class="role">
     <label><input type="radio" name="role" value="staff" checked><span>Nhân viên<small>Xử lý yêu cầu</small></span></label>
     <label><input type="radio" name="role" value="admin"><span>Người duyệt<small>Duyệt & quản trị</small></span></label>
    </div></fieldset>
   <button class="btn pri" type="submit" style="height:48px;font-size:15px">Đăng nhập</button>
   <div class="mute" style="border-top:1px solid var(--line2);padding-top:14px;font-size:13px">Quên mật khẩu hoặc chưa có tài khoản? Liên hệ quản trị viên để được cấp lại.</div>
  </form>
 </section></div>`
}
