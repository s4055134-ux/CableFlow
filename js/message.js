/* Soạn tin nhắn hỏi lại khách và tô sáng đoạn đã trích */
function genDraft(e){
 const miss=FIELDS.filter(F=>e.f[F.k].st==='miss'),chk=FIELDS.filter(F=>e.f[F.k].st==='ai');
 if(!miss.length&&!chk.length)return'';
 let s=`Chào ${e.contact},\n\nCảm ơn anh/chị đã gửi yêu cầu cho Đông Nguyên Gia. `;
 if(miss.length){s+='Để tư vấn đúng loại cáp và báo giá chính xác, nhờ anh/chị bổ sung giúp em các thông tin sau:\n';miss.forEach((F,i)=>s+=`${i+1}. ${F.q}\n`)}
 if(chk.length)s+=`${miss.length?'\nNgoài ra, ':''}bên em đang hiểu yêu cầu như sau, anh/chị xác nhận giúp em: ${chk.map(F=>F.l.toLowerCase()+' '+e.f[F.k].v).join('; ')}.\n`;
 return s+`\nEm cảm ơn anh/chị.\n${USERS[S.user.r].name} – Đông Nguyên Gia`
}
function hl(text,e){let h=esc(text);
 const srcs=[...new Set(Object.values(e.f).map(x=>x.src).filter(Boolean))].sort((a,b)=>b.length-a.length);
 srcs.forEach(s=>{const es=esc(s);if(h.includes(es))h=h.split(es).join('\u0001'+es+'\u0002')});
 return h.replace(/\u0001/g,'<mark>').replace(/\u0002/g,'</mark>').replace(/\n/g,'<br>')}
