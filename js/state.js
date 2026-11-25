/* Dữ liệu mẫu và lưu trạng thái vào localStorage */
const LS='cableflow_dev_v1';
let S;
function mk(id,cust,contact,src,date,msg,status,o={}){
 const ex=extract(msg),f={};
 FIELDS.forEach(F=>{const x=ex[F.k];f[F.k]=x?{v:x.v,st:'ai',src:x.src}:{v:'',st:'miss',src:''};
  if(o.allOk)f[F.k].st=(f[F.k].st==='ai')?'ok':'na';});
 const hist=[{t:date,x:'Tạo yêu cầu từ '+src}];
 if(o.sent)hist.push({t:date,x:'Đã gửi tin nhắn hỏi lại khách'});
 if(status==='done')hist.push({t:date,x:'Xác nhận mã cáp '+o.selected});
 if(status==='review')hist.push({t:date,x:'Chuyển người duyệt'});
 return {id,cust,contact,src,date,msg,status,f,sent:!!o.sent,replies:[],hist,selected:o.selected||null,reason:'',note:'',draft:null,
  view:['ready','done','review'].includes(status)?'result':'info'};
}
function fresh(){return{user:null,tab:'all',q:'',seq:243,fbOpen:false,
 enq:[
  mk('YC-0242','Nhà thầu điện Minh Phát','Mr. Long','Email','26/11 · 08:40','Hi, please quote 3x95 mm2 copper cable, PVC insulated, about 300 metres for indoor cable tray. Delivery within 2 weeks.','new'),
  mk('YC-0241','Cty CP Kỹ thuật Hải Đăng','anh Tuấn','Zalo','25/11 · 09:14','Chào anh, bên em cần báo giá cáp 4x16mm2 0.6/1kV cách điện XLPE, có giáp, đi chôn ngầm cho nhà xưởng ở Bình Dương. Số lượng khoảng 650m. Cần giao trong 10 ngày.','waiting',{sent:true}),
  mk('YC-0240','Cty TNHH Cơ điện Sao Việt','chị Hạnh','Email','24/11 · 15:02','Cần cáp CXV/DSTA 4x25mm2 0.6/1kV, giáp băng thép, chôn ngầm, vận hành liên tục, nhiệt độ 40°C, 400m, giao trong 7 ngày, ngân sách 180 triệu.','done',{allOk:true,selected:'CXV/DSTA'}),
  mk('YC-0239','Xưởng in Thành Công','anh Phúc','Điện thoại','24/11 · 10:21','Cáp CVV 3x10mm2 0.6/1kV không giáp, đi trên máng cáp trong nhà, vận hành liên tục, 35°C, 220m, giao trong 5 ngày.','ready',{allOk:true}),
  mk('YC-0238','BQL Dự án KCN Tân Phú','chị Mai','Email','23/11 · 16:45','Đề nghị báo giá cáp 4x50mm2 0.6/1kV XLPE có giáp sợi thép, chôn ngầm, vận hành liên tục, 40°C, 1200m, giao trong 3 tuần.','review',{allOk:true,selected:'CXV/SWA'}),
  mk('YC-0237','Cty CP Xây lắp Đại Phong','anh Khoa','Zalo','22/11 · 11:30','Báo giá giúp anh cáp điện cho tủ điều khiển, khoảng 150m.','waiting',{sent:true})
 ],
 feedback:[
  {d:'25/11',u:'Nguyễn Văn B',e:'YC-0236',type:'Sai trích xuất',x:'Khách ghi "3C" nghĩa là 3 sợi cáp riêng, hệ thống hiểu thành 3 lõi.',st:'Mới'},
  {d:'24/11',u:'Nguyễn Văn C',e:'YC-0233',type:'Đổi đề xuất',x:'Chọn CXV/SWA thay vì CXV/DSTA. Lý do: Khách yêu cầu loại khác.',st:'Đã xử lý'},
  {d:'23/11',u:'Nguyễn Văn A',e:'—',type:'Giao diện',x:'Muốn có nút sao chép nhanh số điện thoại của khách.',st:'Mới'}
 ]}}
function load(){try{const r=localStorage.getItem(LS);if(r){S=JSON.parse(r);return}}catch(e){}S=fresh()}
function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
