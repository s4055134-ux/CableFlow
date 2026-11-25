/* Khung ứng dụng: thanh bên (desktop) và thanh điều hướng đáy (mobile) */
function shell(act,inner){
 const u=USERS[S.user.r];
 const nav=(k,href,icon,label)=>`<a class="nav ${act===k?'on':''}" href="${href}">${icon}${label}</a>`;
 return `<div class="shell">
 <aside class="side" aria-label="Điều hướng chính">
  <div class="logo"><b>CF</b><div><div style="font-weight:700">CableFlow</div><div class="mute" style="font-size:12px">Đông Nguyên Gia</div></div></div>
  ${nav('list','#/enquiries',I.list,'Yêu cầu của khách')}
  ${nav('new','#/new',I.plus,'Tạo yêu cầu')}
  ${nav('history','#/history',I.clock,'Lịch sử')}
  ${nav('admin','#/admin',I.admin,'Quản trị & góp ý')}
  <div class="ucard">
   <div><div style="font-weight:600">${u.name}</div><div class="mute" style="font-size:12px">${u.role}</div></div>
   <span class="chip na" style="align-self:flex-start">Bản dev · dữ liệu mẫu</span>
   <div class="row" style="gap:6px"><button class="btn sm" data-act="switchRole">Đổi vai trò</button><button class="btn sm ghost" data-act="logout">${I.out}Đăng xuất</button></div>
  </div>
 </aside>
 <main class="main" id="main">${inner}</main>
 <nav class="bnav" aria-label="Điều hướng">
  <a href="#/enquiries" class="${act==='list'?'on':''}">${I.list}Yêu cầu</a>
  <a href="#/new" class="${act==='new'?'on':''}">${I.plus}Tạo mới</a>
  <a href="#/history" class="${act==='history'?'on':''}">${I.clock}Lịch sử</a>
  <a href="#/admin" class="${act==='admin'?'on':''}">${I.admin}Quản trị</a>
  <button data-act="logout">${I.out}Đăng xuất</button>
 </nav></div>`
}
