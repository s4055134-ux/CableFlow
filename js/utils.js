/* Hàm tiện ích, chip trạng thái, toast, icon */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
const now=()=>{const d=new Date();const p=n=>String(n).padStart(2,'0');return `${p(d.getDate())}/${p(d.getMonth()+1)} · ${p(d.getHours())}:${p(d.getMinutes())}`};
const getE=id=>S.enq.find(x=>x.id===id);
const filled=e=>FIELDS.filter(F=>e.f[F.k].st!=='miss').length;
const reqMissing=e=>FIELDS.filter(F=>!F.opt&&e.f[F.k].st==='miss');
const chip=(t,c,icon)=>`<span class="chip ${c}">${icon?ic(icon,14):''}${esc(t)}</span>`;
const stChip=s=>chip(STATUS[s][0],STATUS[s][1],STATUS[s][2]);
/* Số thông số bắt buộc đã có (trên 10) */
const reqFilled=e=>FIELDS.filter(F=>!F.opt&&e.f[F.k].st!=='miss').length;
function progress(e){const n=reqFilled(e),p=n*10;
 return `<div class="prog"><span class="pbar"><i style="width:${p}%;background:${n===10?'#14233C':'#EE6A2C'}"></i></span><b>${n}/10</b></div>`}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2400)}
const I={
 list:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
 plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
 admin:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/></svg>',
 out:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
 back:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
 info:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>'
};
I.clock='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
I.file='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/></svg>';
I.upload='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>';

/* Định dạng số tiền và dung lượng file */
const vnd=n=>Math.round(n||0).toLocaleString('vi-VN')+' đ';
const fsize=b=>b>=1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB';

/* Kiểm tra file tải lên: chỉ PDF/ảnh, tối đa 10 MB. Trả về {ok:[], bad:[]} */
function checkFiles(list){const ok=[],bad=[];
 [...list].forEach(f=>{
  if(/\.docx?$/i.test(f.name))bad.push(`${f.name}: file Word chưa hỗ trợ, hãy lưu thành PDF rồi tải lên.`);
  else if(!FILE_OK.includes(f.type))bad.push(`${f.name}: chỉ nhận PDF, PNG, JPG hoặc WEBP.`);
  else if(f.size>FILE_MAX)bad.push(`${f.name}: lớn hơn 10 MB.`);
  else ok.push({name:f.name,size:f.size,type:f.type});
 });return{ok,bad}}
const fileChips=(files,del)=>files.map((f,i)=>`<span class="fchip">${I.file}<span>${esc(f.name)}</span><small>${fsize(f.size)}</small>${del?`<button type="button" class="fdel" data-act="${del}" data-i="${i}" aria-label="Bỏ file ${esc(f.name)}">×</button>`:''}</span>`).join('');

/* Tính báo giá: chỉ bằng code, AI không tham gia */
function quoteCalc(q){const unit=q.cost*(1+q.margin/100),sub=unit*q.qty,tax=sub*q.vat/100;return{unit,sub,tax,total:sub+tax}}

/* Nạp thư viện SheetJS khi cần (đọc file tồn kho, xuất Excel) */
let xlsxP=null;
function loadXLSX(){if(window.XLSX)return Promise.resolve(window.XLSX);
 if(!xlsxP)xlsxP=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
  s.onload=()=>res(window.XLSX);s.onerror=()=>{xlsxP=null;rej(new Error('Không tải được thư viện Excel'))};document.head.appendChild(s)});
 return xlsxP}
function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
/* Chuẩn hoá tên cột: bỏ dấu, chữ thường, khoảng trắng thành _ */
const normHead=h=>String(h).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/gi,'d').toLowerCase().trim().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');

/* Bộ icon nét (stroke) dùng chung */
const ICON={grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',shield:'<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
 back:'<path d="M15 18l-6-6 6-6"/>',next:'<path d="M9 18l6-6-6-6"/>',check:'<path d="M5 12l5 5 9-10"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
 alert:'<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.5"/>',q:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 16.5v.5"/>',
 file:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',send:'<path d="M4 12l16-8-6 16-3-7z"/>',
 box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',msg:'<path d="M4 5h16v11H9l-5 4z"/>',
 cable:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 excel:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8l8 8M16 8l-8 8"/>',out:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
 phone:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 chat:'<path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12z"/>',rule:'<path d="M4 6h10M4 12h16M4 18h7"/><circle cx="17" cy="6" r="2"/><circle cx="14" cy="18" r="2"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',swap:'<path d="M7 7h12l-3-3M17 17H5l3 3"/>'};
function ic(n,s=18,c='currentColor',w=2){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:0 0 ${s}px">${ICON[n]||''}</svg>`}
const CHIC={'Email':'mail','Zalo':'chat','Điện thoại':'phone'};
/* Biểu đồ vòng tròn (%) */
function ring(p,size=88,stroke=9,color='#EE6A2C',label,sub=''){const r=(size-stroke)/2,c=2*Math.PI*r,o=c*(1-Math.max(0,Math.min(100,p))/100),t=label??(p+'%');
 return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${t} ${sub}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#E4DED2" stroke-width="${stroke}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${o.toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/></svg><div><b style="font-size:${Math.round(size/4.2)}px">${t}</b>${sub?`<span>${sub}</span>`:''}</div></div>`}
/* Đồng hồ nửa vòng (%) cho độ tin cậy */
function gauge(p,w=220,color='#3E8E63'){const r=w/2-14,L=Math.PI*r,cy=w/2;
 return `<div class="gauge" style="width:${w}px;height:${Math.round(w/2+18)}px"><svg width="${w}" height="${Math.round(w/2+18)}" viewBox="0 0 ${w} ${Math.round(w/2+18)}" role="img" aria-label="Độ tin cậy ${p}%"><path d="M14 ${cy} A${r} ${r} 0 0 1 ${w-14} ${cy}" fill="none" stroke="#E4DED2" stroke-width="16" stroke-linecap="round"/><path d="M14 ${cy} A${r} ${r} 0 0 1 ${w-14} ${cy}" fill="none" stroke="${color}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${L.toFixed(1)}" stroke-dashoffset="${(L*(1-p/100)).toFixed(1)}"/></svg><div><b class="sf" style="font-size:${Math.round(w/5)}px">${p}%</b><span>độ tin cậy</span></div></div>`}
