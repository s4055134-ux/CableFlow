/* Màn đăng nhập (chế độ dev: không cần tài khoản) */
function vLogin(){
 return `<div class="login">
  <div class="lcorner"><b>CF</b><div><div class="cw">CableFlow</div><div class="cc">Đông Nguyên Gia</div></div></div>
 <div class="lwrap">
  <header class="lhead">
   <div class="logo lbrand"><b>CF</b><div class="lname"><div class="wm">CableFlow</div><div class="co">Đông Nguyên Gia</div></div></div>
   <div><div class="eyebrow">HỆ THỐNG NỘI BỘ</div><h1>Hệ thống xử lý yêu cầu kỹ thuật &amp; báo giá</h1><p class="lsub">Đông Nguyên Gia nhập khẩu và phân phối cáp điện từ năm 2010.</p></div>
  </header>
  <form class="card stack lcard" id="loginForm" novalidate>
   <div><h2 style="font-size:19px;font-weight:700;margin-bottom:4px">Đăng nhập</h2><p class="mute" style="margin:0">Dùng tài khoản do quản trị viên cấp.</p></div>
   <div class="devnote">${I.info}<div><b>Chế độ phát triển.</b> Chưa kết nối tài khoản thật: nhập email và mật khẩu bất kỳ (hoặc để trống) để vào.</div></div>
   <div><label class="lb" for="em">Email công ty</label><input class="inp" id="em" type="email" autocomplete="username" placeholder="ten@dongnguyengia.vn"></div>
   <div><label class="lb" for="pw">Mật khẩu</label><input class="inp" id="pw" type="password" autocomplete="current-password" placeholder="••••••••"></div>
   <fieldset style="border:0;margin:0;padding:0"><legend class="lb" style="padding:0;font-weight:600">Vào với vai trò</legend>
    <div class="role">
     <label><input type="radio" name="role" value="staff" checked><span>Nhân viên<small>Xử lý yêu cầu</small></span></label>
     <label><input type="radio" name="role" value="admin"><span>Người duyệt<small>Duyệt & quản trị</small></span></label>
    </div></fieldset>
   <button class="btn pri" type="submit" style="height:48px;font-size:15px">Đăng nhập</button>
   <div class="mute" style="border-top:1px solid var(--line2);padding-top:14px;font-size:13px">Quên mật khẩu hoặc chưa có tài khoản? Liên hệ quản trị viên để được cấp lại.</div>
  </form>
 </div>
 <footer class="lfoot">Công cụ nội bộ · Chỉ dành cho nhân viên Đông Nguyên Gia</footer>
</div>`
}
