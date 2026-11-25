/* Router (#/...) và xử lý sự kiện. File này chạy sau cùng */
function render(){
 const h=location.hash.replace(/^#\/?/,'');const[p,id]=h.split('/');
 const app=$('#app');
 if(!S.user){app.innerHTML=vLogin();document.title='Đăng nhập – CableFlow';return}
 if(p==='new'){app.innerHTML=shell('new',vNew());document.title='Tạo yêu cầu – CableFlow'}
 else if(p==='admin'){app.innerHTML=shell('admin',vAdmin());document.title='Quản trị – CableFlow'}
 else if(p==='enquiry'&&getE(id)){const e=getE(id);app.innerHTML=shell('list',vWork(e));document.title=e.id+' – CableFlow'}
 else{if(p!=='enquiries'){history.replaceState(null,'','#/enquiries')}app.innerHTML=shell('list',vList());document.title='Yêu cầu – CableFlow'}
}
function rerender(keepScroll=true){const y=window.scrollY;render();if(keepScroll)window.scrollTo(0,y)}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});


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
 reply(){const e=curE(),t=$('#reply').value.trim();if(!t){toast('Hãy dán câu trả lời của khách trước');return}
  const ex=extract(t);let n=0;FIELDS.forEach(F=>{const x=e.f[F.k];if(ex[F.k]&&(x.st==='miss'||x.st==='ai')){e.f[F.k]={v:ex[F.k].v,st:'ai',src:ex[F.k].src};n++}});
  e.replies.push({t:now(),x:t});e.hist.push({t:now(),x:`Khách trả lời · cập nhật ${n} thông số`});e.draft=null;recompute(e);save();rerender();
  toast(n?`Đã cập nhật ${n} thông số. Kiểm tra các mục màu vàng.`:'Không nhận ra thông số mới. Hãy nhập tay vào checklist.')},
 pick(b){const e=curE();e.selected=b.dataset.k;e.reason='';save();rerender()},
 srcLink(b,ev){ev.preventDefault();toast('Bản dev: liên kết tới trang catalogue sẽ có khi nạp tài liệu thật')},
 toReview(){const e=curE();e.note=($('#note')||{}).value||'';e.status='review';e.hist.push({t:now(),x:'Chuyển người duyệt'+(e.selected?' · '+e.selected:'')});save();rerender();toast('Đã chuyển cho người duyệt')},
 confirm(){const e=curE(),ops=options(e);if(!e.selected){toast('Hãy chọn một phương án trước');return}
  const top=ops[0].code,reason=($('#reason')||{}).value||'';e.note=($('#note')||{}).value||'';
  if(e.selected!==top&&!reason){toast('Hãy chọn lý do không dùng phương án 1');$('#reason').focus();return}
  e.reason=reason;e.status='done';e.hist.push({t:now(),x:'Xác nhận mã cáp '+e.selected});
  if(e.selected!==top)S.feedback.unshift({d:now().split(' · ')[0],u:USERS[S.user.r].name,e:e.id,type:'Đổi đề xuất',x:`Chọn ${e.selected} thay vì ${top}. Lý do: ${reason}${e.note?' – '+e.note:''}`,st:'Mới'});
  save();rerender();toast('Đã xác nhận mã cáp '+e.selected)},
 reopen(){const e=curE();e.status='ready';e.hist.push({t:now(),x:'Mở lại yêu cầu'});save();rerender()},
 admTab(b){ADM_TAB=b.dataset.k;rerender()},
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
 else if(t.id==='note'){const e=curE();if(e)e.note=t.value}});
document.addEventListener('change',ev=>{const t=ev.target;
 if(t.dataset.field){const e=curE(),x=e.f[t.dataset.field],v=t.value.trim();x.v=v;x.st=v?'ok':'miss';x.src='';e.draft=null;recompute(e);save();rerender()}
 else if(t.id==='reason'){const e=curE();e.reason=t.value;save()}});
document.addEventListener('submit',ev=>{ev.preventDefault();const f=ev.target;
 if(f.id==='loginForm'){S.user={r:f.querySelector('input[name=role]:checked').value,email:$('#em').value.trim()};save();location.hash='#/enquiries';render()}
 else if(f.id==='newForm'){const cust=NEW.cust.trim(),msg=NEW.msg.trim();
  if(!cust||!msg){toast(!cust?'Hãy nhập tên khách hoặc công ty':'Hãy dán nội dung khách gửi');(!cust?$('#ncust'):$('#nmsg')).focus();return}
  const id='YC-'+String(S.seq++).padStart(4,'0');const e=mk(id,cust,NEW.contact.trim()||'anh/chị',NEW.src,now(),msg,'new');recompute(e);
  S.enq.unshift(e);NEW={cust:'',contact:'',src:'Zalo',msg:''};save();location.hash='#/enquiry/'+id;
  toast(`Đã trích ${filled(e)}/11 thông số. Kiểm tra các mục màu vàng.`)}});

load();render();
