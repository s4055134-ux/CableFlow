/* Hàm tiện ích, chip trạng thái, toast, icon */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
const now=()=>{const d=new Date();const p=n=>String(n).padStart(2,'0');return `${p(d.getDate())}/${p(d.getMonth()+1)} · ${p(d.getHours())}:${p(d.getMinutes())}`};
const getE=id=>S.enq.find(x=>x.id===id);
const filled=e=>FIELDS.filter(F=>e.f[F.k].st!=='miss').length;
const reqMissing=e=>FIELDS.filter(F=>!F.opt&&e.f[F.k].st==='miss');
const chip=(t,c)=>`<span class="chip ${c}">${esc(t)}</span>`;
const stChip=s=>chip(STATUS[s][0],STATUS[s][1]);
function progress(e){const n=filled(e),p=Math.round(n/11*100),col=n===11?'#17603A':n>=7?'#C98A0B':'#A8261B';
 return `<div class="row" style="gap:8px;flex-wrap:nowrap"><div class="bar"><i style="width:${p}%;background:${col}"></i></div><span class="mono" style="font-size:12px">${n}/11</span></div>`}
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
