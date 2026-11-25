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
