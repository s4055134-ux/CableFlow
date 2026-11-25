/* Màn đăng nhập (chế độ dev: không cần tài khoản) */
function vLogin(){
 return `<div class="login">
 <svg class="lart" viewBox="-720 -470 1440 940" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <circle r="640" fill="none" stroke="#173F4E" stroke-width="1" stroke-dasharray="2 8"/>
  <circle r="440" fill="none" stroke="#123847" stroke-width="60"/>
  <circle r="470" fill="none" stroke="#2F6F84" stroke-width="1.2"/>
  <circle r="410" fill="none" stroke="#2F6F84" stroke-width="1"/>
  <circle r="385" fill="none" stroke="#1F5163" stroke-width="18" stroke-dasharray="58 5"/>
  <circle r="365" fill="none" stroke="#2F6F84" stroke-width="1"/>
  <circle r="345" fill="none" stroke="#24596B" stroke-width="1" stroke-dasharray="4 4"/>
  <circle r="330" fill="none" stroke="#2F6F84" stroke-width="1.2"/>
  <line x1="-640" y1="0" x2="-490" y2="0" stroke="#24596B" stroke-width="1"/><line x1="490" y1="0" x2="520" y2="0" stroke="#24596B" stroke-width="1"/>
  <g class="lbl"><polyline points="358.5,-280.1 418.5,-250 540,-250" fill="none" stroke="#3E7F95" stroke-width="1"/><circle cx="358.5" cy="-280.1" r="4" fill="#C8823F"/><text x="552" y="-245">Vỏ bọc PVC</text></g><g class="lbl"><polyline points="370.1,-106.1 430.1,-120 540,-120" fill="none" stroke="#3E7F95" stroke-width="1"/><circle cx="370.1" cy="-106.1" r="4" fill="#C8823F"/><text x="552" y="-115">Giáp băng thép</text></g><g class="lbl"><polyline points="350.1,36.8 410.1,10 540,10" fill="none" stroke="#3E7F95" stroke-width="1"/><circle cx="350.1" cy="36.8" r="4" fill="#C8823F"/><text x="552" y="15">Lớp độn</text></g><g class="lbl"><polyline points="296.6,144.7 356.6,140 540,140" fill="none" stroke="#3E7F95" stroke-width="1"/><circle cx="296.6" cy="144.7" r="4" fill="#C8823F"/><text x="552" y="145">Cách điện XLPE</text></g>
 </svg>
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
