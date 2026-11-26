/* Khung ứng dụng: sidebar navy (desktop) và thanh trên + thanh điều hướng đáy (mobile) */
const NAV=[['list','#/enquiries','Tổng quan','grid'],['new','#/new','Tạo yêu cầu','plus'],['history','#/history','Lịch sử','clock'],['admin','#/admin','Quản trị','shield']];
const LOGO='assets/logo-dng.png';
const brand=()=>`<a class="brand" href="#/enquiries"><img src="${LOGO}" alt="Logo Đông Nguyên Gia"><span><b>CableFlow</b><span>Đông Nguyên Gia</span></span></a>`;
function shell(act,inner,mtitle,back){
 const u=USERS[S.user.r];
 const side=NAV.map(([k,h,l,i])=>`<a class="nav ${act===k?'on':''}" href="${h}" ${act===k?'aria-current="page"':''}>${ic(i,19)}${l}</a>`).join('');
 const bot=NAV.map(([k,h,l,i])=>`<a class="${act===k?'on':''}" href="${h}" ${act===k?'aria-current="page"':''}>${ic(i,21)}${l.replace('Tạo yêu cầu','Tạo mới')}</a>`).join('');
 const top=back?`<a class="bk" href="${back}" aria-label="Quay lại">${ic('back',20)}</a>`:`<img src="${LOGO}" alt="Logo Đông Nguyên Gia">`;
 return `<div class="shell">
 <nav class="side" aria-label="Điều hướng chính">${brand()}${side}
  <div class="ucard"><div class="who"><span class="avatar">${u.name.split(' ').pop()[0]}</span><span><b style="display:block">${u.name}</b><span style="font-size:12px;color:#C9D2E0">${u.role}</span></span></div>
   <div class="row" style="gap:6px"><button class="pill sm" data-act="switchRole">${ic('swap',15)}Đổi vai trò</button><button class="pill sm ghost" data-act="logout">${ic('out',15)}Đăng xuất</button></div></div>
 </nav>
 <div style="flex:999 1 560px;min-width:0">
  <header class="mtop">${top}<span class="t sf">${mtitle||''}</span><button class="pill sm ghost" data-act="logout" aria-label="Đăng xuất" style="margin-left:auto;padding:0 10px">${ic('out',18)}</button></header>
  <main class="main" id="main">${inner}</main>
 </div>
 <nav class="bnav" aria-label="Điều hướng">${bot}</nav></div>`
}
