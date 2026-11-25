/* Router (#/...) và xử lý sự kiện. File này chạy sau cùng */
function render(){
 const h=location.hash.replace(/^#\/?/,'');const[p,id]=h.split('/');
 const app=$('#app');
 if(!S.user){app.innerHTML=vLogin();document.title='Đăng nhập – CableFlow';return}
 if(p==='new'){app.innerHTML=shell('new',vNew());document.title='Tạo yêu cầu – CableFlow'}
 else if(p==='admin'){app.innerHTML=shell('admin',vAdmin());document.title='Quản trị – CableFlow'}
 else if(p==='history'){app.innerHTML=shell('history',vHistory());document.title='Lịch sử – CableFlow'}
 else if(p==='enquiry'&&getE(id)){const e=getE(id);app.innerHTML=shell('list',vWork(e));document.title=e.id+' – CableFlow'}
 else{if(p!=='enquiries'){history.replaceState(null,'','#/enquiries')}app.innerHTML=shell('list',vList());document.title='Yêu cầu – CableFlow'}
}
function rerender(keepScroll=true){const y=window.scrollY;render();if(keepScroll)window.scrollTo(0,y)}
window.addEventListener('hashchange',()=>{REPLY={x:'',files:[],bad:[]};STOCK_ERR=[];render();window.scrollTo(0,0)});


const curE=()=>{const m=location.hash.match(/enquiry\/([\w-]+)/);return m&&getE(m[1])};
function recompute(e){if(['new','waiting'].includes(e.status)&&reqMissing(e).length===0)e.status='ready'}
const A={
 logout(){S.user=null;save();location.hash='#/login';render()},
 switchRole(){S.user.r=S.user.r==='admin'?'staff':'admin';save();rerender();toast('Đang dùng vai trò: '+USERS[S.user.r].role)},
 tab(b){S.tab=b.dataset.k;save();rerender()},
 open(b){location.hash='#/enquiry/'+b.dataset.id},
 src(b){NEW.src=b.dataset.k;document.querySelectorAll('.seg button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)})},
 sample(){$('#nmsg').value=SAMPLE;NEW.msg=SAMPLE;if(!$('#ncust').value){$('#ncust').value='Cty TNHH Năng lượng Phương Nam';NEW.cust=$('#ncust').value}if(!$('#ncontact').value){$('#ncontact').value='Ms. Linh';NEW.contact='Ms. Linh'}},
 view(b){const e=curE();e.view=b.dataset.k;save();render();window.scrollTo(0,0)},
 okField(b){const e=curE();e.f[b.dataset.k].st='ok';e.draft=null;recompute(e);save();rerender()},
 naField(b){const e=curE();const x=e.f[b.dataset.k];x.st='na';x.v='';e.draft=null;recompute(e);save();rerender()},
 unNa(b){const e=curE();e.f[b.dataset.k].st='miss';e.draft=null;save();rerender()},
 regen(){const e=curE();e.draft=null;save();rerender();toast('Đã soạn lại tin nhắn theo checklist')},
 async copy(){const t=$('#draft').value;try{await navigator.clipboard.writeText(t);toast('Đã sao chép tin nhắn')}catch(err){$('#draft').select();toast('Hãy nhấn Ctrl/Cmd + C để sao chép')}},
 sent(){const e=curE();if(!e.sent){e.sent=true;e.hist.push({t:now(),x:'Đã gửi tin nhắn hỏi lại khách'})}if(e.status==='new')e.status='waiting';save();rerender();toast('Đã đánh dấu là đã gửi cho khách')},
 reply(){const e=curE(),t=($('#reply').value||'').trim();if(!t&&!REPLY.files.length){toast('Hãy dán câu trả lời hoặc đính kèm file của khách');return}
  const ex=t?extract(t):{};let n=0;FIELDS.forEach(F=>{const x=e.f[F.k];if(ex[F.k]&&(x.st==='miss'||x.st==='ai')){e.f[F.k]={v:ex[F.k].v,st:'ai',src:ex[F.k].src};n++}});
  const nf=REPLY.files.length;e.replies.push({t:now(),x:t,files:REPLY.files});
  e.hist.push({t:now(),x:`Khách trả lời${nf?` · ${nf} file`:''} · cập nhật ${n} thông số`});REPLY={x:'',files:[],bad:[]};e.draft=null;recompute(e);save();rerender();
  toast(n?`Đã cập nhật ${n} thông số. Kiểm tra các mục màu vàng.`:nf?'Đã lưu file trả lời. Bản dev chưa đọc nội dung file, hãy điền checklist thủ công.':'Không nhận ra thông số mới. Hãy nhập tay vào checklist.')},
 rfileDel(b){REPLY.files.splice(+b.dataset.i,1);$('#rfiles').innerHTML=replyFilesHTML()},
 nfileDel(b){NEW.files.splice(+b.dataset.i,1);$('#nfiles').innerHTML=newFilesHTML()},
 pick(b){const e=curE();e.selected=b.dataset.k;e.manual=false;e.reason='';save();rerender()},
 manual(){const e=curE();e.manual=!e.manual;if(e.manual)e.selected=null;e.reason='';save();rerender();if(e.manual)$('#manualCode').focus()},
 srcLink(b,ev){ev.preventDefault();toast('Bản dev: liên kết tới trang catalogue sẽ có khi nạp tài liệu thật')},
 confirm(){const e=curE(),ops=options(e),top=ops[0].code;
  const code=e.manual?($('#manualCode').value||'').trim().toUpperCase():e.selected;
  if(!code){toast(e.manual?'Hãy nhập mã cáp đúng':'Hãy chọn một phương án trước');if(e.manual)$('#manualCode').focus();return}
  const reason=($('#reason')||{}).value||'';e.note=($('#note')||{}).value||'';const matched=!e.manual&&code===top;
  if(!matched&&!reason){toast('Hãy chọn lý do không dùng phương án 1');$('#reason').focus();return}
  e.reason=reason;e.status='done';e.selected=code;e.decision={code,top,matched,reason,by:USERS[S.user.r].name,t:now()};e.qf=null;e.quote=null;
  e.hist.push({t:now(),x:'Xác nhận mã cáp '+code+(matched?'':' (sửa đề xuất)')});
  if(!matched)S.feedback.unshift({d:now().split(' · ')[0],u:USERS[S.user.r].name,e:e.id,type:e.manual?'Sửa đề xuất':'Đổi đề xuất',x:`Chọn ${code}${e.manual?' (nhập tay)':''} thay vì ${top}. Lý do: ${reason}${e.note?' – '+e.note:''}`,st:'Mới'});
  save();rerender();toast('Đã xác nhận mã cáp '+code)},
 reopen(){const e=curE();e.status='ready';e.decision=null;e.quote=null;e.qf=null;e.hist.push({t:now(),x:'Mở lại yêu cầu'});save();rerender()},
 qMake(){const e=curE(),it=decidedItem(e),q=e.qf,qty=+q.qty,cost=+q.cost;
  if(!(qty>0)){toast('Hãy nhập số lượng');$('#qQty').focus();return}
  if(!(cost>0)){toast('Hãy nhập giá vốn');$('#qCost').focus();return}
  if(qty>it.stock){toast(`Chỉ báo giá hàng có sẵn: tồn kho còn ${it.stock} m`);$('#qQty').focus();return}
  e.quote={no:'BG-'+e.id.slice(3),t:now(),by:USERS[S.user.r].name,code:it.name,qty,cost,margin:+q.margin||0,vat:+q.vat};
  e.hist.push({t:now(),x:'Tạo báo giá '+e.quote.no});save();rerender();toast('Đã tạo báo giá '+e.quote.no+'. Tải file Excel hoặc PDF bên dưới.')},
 qRedo(){const e=curE();e.qf={qty:e.quote.qty,cost:e.quote.cost,margin:e.quote.margin,vat:e.quote.vat};e.quote=null;save();rerender()},
 qXlsx(){exportXlsx(curE())},qPdf(){printQuote(curE())},
 hXlsx(b){exportXlsx(getE(b.dataset.id))},hPdf(b){printQuote(getE(b.dataset.id))},
 stockTpl(){download('mau-ton-kho.csv',new Blob(['\ufeffma_cap,so_loi,tiet_dien,ton_kho_m\nCXV/DSTA,4,16,820\nCXV/SWA,4,16,300\nCVV,3,10,500\n'],{type:'text/csv'}))},
 admTab(b){ADM_TAB=b.dataset.k;STOCK_ERR=[];rerender()},
 fbToggle(b){const f=S.feedback[+b.dataset.i];f.st=f.st==='Mới'?'Đã xử lý':'Mới';save();rerender()},
 fbSend(){const x=$('#fbX').value.trim();if(!x){toast('Hãy nhập nội dung góp ý');$('#fbX').focus();return}
  S.feedback.unshift({d:now().split(' · ')[0],u:USERS[S.user.r].name,e:$('#fbE').value.trim()||'—',type:$('#fbType').value,x,st:'Mới'});save();rerender();toast('Đã gửi góp ý. Cảm ơn bạn.')},
 reset(){const u=S.user;S=fresh();S.user=u;save();rerender();toast('Đã đặt lại dữ liệu mẫu')}
};
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b||b.disabled)return;
 if(b.tagName==='TR'&&ev.target.closest('a'))return;
 const f=A[b.dataset.act];if(f){if(b.tagName==='A'&&b.dataset.act!=='open')ev.preventDefault();f(b,ev)}});
document.addEventListener('input',ev=>{const t=ev.target;
 if(t.id==='q'){S.q=t.value;save();$('#listBody').innerHTML=listBody()}
 else if(t.id==='draft'){const e=curE();e.draft=t.value;save()}
 else if(t.id==='ncust')NEW.cust=t.value;else if(t.id==='ncontact')NEW.contact=t.value;else if(t.id==='nmsg')NEW.msg=t.value;
 else if(t.id==='note'){const e=curE();if(e)e.note=t.value}
 else if(t.id==='reply')REPLY.x=t.value;
 else if(t.id==='manualCode'){const e=curE();e.manualCode=t.value}
 else if(t.dataset.q){const e=curE();e.qf[t.dataset.q]=t.value;save();$('#qcalc').innerHTML=qcalcHTML(e.qf,decidedItem(e))}});
document.addEventListener('change',ev=>{const t=ev.target;
 if(t.dataset.field){const e=curE(),x=e.f[t.dataset.field],v=t.value.trim();x.v=v;x.st=v?'ok':'miss';x.src='';e.draft=null;recompute(e);save();rerender()}
 else if(t.id==='reason'){const e=curE();e.reason=t.value;save()}
 else if(t.id==='nfile'){const r=checkFiles(t.files);NEW.files.push(...r.ok);NEW.bad=r.bad;t.value='';$('#nfiles').innerHTML=newFilesHTML()}
 else if(t.id==='rfile'){const r=checkFiles(t.files);REPLY.files.push(...r.ok);REPLY.bad=r.bad;t.value='';$('#rfiles').innerHTML=replyFilesHTML()}
 else if(t.id==='stockFile'){const f=t.files[0];t.value='';if(f)importStock(f)}
 else if(t.dataset.rule!==undefined){const r=S.rules[+t.dataset.rule];r.active=t.checked;save();rerender();toast((r.active?'Đã bật':'Đã tắt')+' quy tắc: '+r.cond)}});
document.addEventListener('submit',ev=>{ev.preventDefault();const f=ev.target;
 if(f.id==='loginForm'){S.user={r:f.querySelector('input[name=role]:checked').value,email:$('#em').value.trim()};save();location.hash='#/enquiries';render()}
 else if(f.id==='newForm'){const cust=NEW.cust.trim(),msg=NEW.msg.trim();
  if(!cust){toast('Hãy nhập tên khách hoặc công ty');$('#ncust').focus();return}
  if(!msg&&!NEW.files.length){toast('Hãy dán nội dung hoặc đính kèm file khách gửi');$('#nmsg').focus();return}
  const id='YC-'+String(S.seq++).padStart(4,'0');const e=mk(id,cust,NEW.contact.trim()||'anh/chị',NEW.src,now(),msg,'new',{files:NEW.files});recompute(e);
  S.enq.unshift(e);NEW={cust:'',contact:'',src:'Zalo',msg:'',files:[],bad:[]};save();location.hash='#/enquiry/'+id;
  toast(msg?`Đã trích ${filled(e)}/11 thông số. Kiểm tra các mục màu vàng.`:'Đã lưu yêu cầu. Bản dev chưa đọc nội dung file, hãy điền checklist thủ công.')}
 else if(f.id==='ruleForm'){const c=$('#rCond').value.trim(),x=$('#rEff').value.trim();
  if(!c||!x){toast('Hãy nhập đủ phần Nếu và Thì');(!c?$('#rCond'):$('#rEff')).focus();return}
  S.rules.push({id:'u'+Date.now(),cond:c,eff:x,src:$('#rSrc').value.trim()||'Chưa ghi nguồn',active:true,auto:false});save();rerender();toast('Đã thêm quy tắc')}});

load();render();

/* ===== Tồn kho: đọc file Excel/CSV do Admin tải lên ===== */
function nowFull(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${p(d.getHours())}:${p(d.getMinutes())} · ${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`}
async function importStock(file){
 STOCK_ERR=[];
 try{
  const X=await loadXLSX(),isCsv=/\.csv$/i.test(file.name),wb=isCsv?X.read((await file.text()).replace(/^\ufeff/,''),{type:'string'}):X.read(await file.arrayBuffer()),rows=X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,blankrows:false});
  if(!rows.length)throw new Error('File không có dữ liệu.');
  const h=rows[0].map(normHead),find=f=>h.findIndex(f);
  const ci=find(x=>x==='ma_cap'||x==='ma'||x.startsWith('ma_cap')),ni=find(x=>x.includes('so_loi')||x==='loi'),
        si=find(x=>x.includes('tiet_dien')),qi=find(x=>x.includes('ton_kho')||x==='ton');
  const miss=[['ma_cap',ci],['so_loi',ni],['tiet_dien',si],['ton_kho_m',qi]].filter(x=>x[1]<0).map(x=>x[0]);
  if(miss.length)throw new Error('Thiếu cột: '+miss.join(', ')+'. Tải file mẫu để xem đúng định dạng.');
  const map={};let bad=0;
  rows.slice(1).forEach(r=>{const c=String(r[ci]??'').trim(),n=parseInt(r[ni]),s=parseFloat(String(r[si]).replace(',','.')),q=parseFloat(String(r[qi]).replace(',','.'));
   if(!c||!(n>0)||!(s>0)||!(q>=0)){bad++;return}const k=stockKey(c,n,s);map[k]=(map[k]||0)+q});
  const n=Object.keys(map).length;if(!n)throw new Error('Không đọc được dòng hợp lệ nào.');
  S.stock={sample:false,file:file.name,date:nowFull(),rows:n,map};save();rerender();
  toast(`Đã nạp ${n} dòng tồn kho${bad?`, bỏ qua ${bad} dòng thiếu hoặc sai dữ liệu`:''}`);
 }catch(err){STOCK_ERR=[err.message];rerender()}
}

/* ===== Báo giá: xuất Excel và PDF (in từ trình duyệt) ===== */
function quoteData(e){const q=e.quote,c=quoteCalc(q);
 return{q,c,head:[['BÁO GIÁ',''],['Số',q.no],['Ngày',q.t],['Khách hàng',e.cust],['Người liên hệ',e.contact],['Mã yêu cầu',e.id],['Người lập',q.by]],
  cols:['STT','Mô tả','ĐVT','Số lượng','Đơn giá (đ)','Thành tiền (đ)'],
  line:[1,q.code,'m',q.qty,Math.round(c.unit),Math.round(c.sub)]}}
async function exportXlsx(e){
 try{const X=await loadXLSX(),{q,c,head,cols,line}=quoteData(e);
  const aoa=[...head,[],cols,line,[],['','','','','Cộng',Math.round(c.sub)],['','','','','VAT '+q.vat+'%',Math.round(c.tax)],['','','','','Tổng cộng',Math.round(c.total)],[],['Mẫu báo giá tạm (bản dev) – điều khoản và mẫu chính thức chờ Đông Nguyên Gia chốt.']];
  const ws=X.utils.aoa_to_sheet(aoa);ws['!cols']=[{wch:14},{wch:42},{wch:6},{wch:10},{wch:16},{wch:18}];
  const wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,'Bao gia');X.writeFile(wb,q.no+'.xlsx');toast('Đã tải '+q.no+'.xlsx');
 }catch(err){toast('Không tạo được file Excel: '+err.message)}
}
function printQuote(e){
 const {q,c,head,cols,line}=quoteData(e);
 $('#print').innerHTML=`<div class="pq"><div class="pqh"><div><b>Đông Nguyên Gia</b><div>Nhập khẩu và phân phối cáp điện</div></div><div class="pqt">BÁO GIÁ<div>${esc(q.no)}</div></div></div>
  <table class="pqi">${head.slice(2).map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>
  <table class="pql"><thead><tr>${cols.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody><tr>${line.map((x,i)=>`<td>${i>=4?Math.round(x).toLocaleString('vi-VN'):esc(x)}</td>`).join('')}</tr></tbody>
  <tfoot><tr><td colspan="5">Cộng</td><td>${vnd(c.sub)}</td></tr><tr><td colspan="5">VAT ${q.vat}%</td><td>${vnd(c.tax)}</td></tr><tr class="tt"><td colspan="5">Tổng cộng</td><td>${vnd(c.total)}</td></tr></tfoot></table>
  <p class="pqn">Mẫu báo giá tạm (bản dev). Điều khoản và mẫu chính thức chờ Đông Nguyên Gia chốt.</p></div>`;
 window.print();
}
