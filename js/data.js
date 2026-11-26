/* Cấu hình: 11 thông số, trạng thái, catalogue và tồn kho mẫu */
const FIELDS=[
 {k:'type',l:'Loại cáp',h:'cách điện',q:'Loại cáp / vật liệu cách điện mong muốn (ví dụ CXV – XLPE hay CVV – PVC)?'},
 {k:'size',l:'Tiết diện',h:'mm²',q:'Tiết diện ruột dẫn (mm²)?'},
 {k:'cores',l:'Số lõi',h:'',q:'Số lõi của cáp?'},
 {k:'voltage',l:'Cấp điện áp',h:'',q:'Cấp điện áp sử dụng (ví dụ 0.6/1 kV)?'},
 {k:'env',l:'Môi trường lắp đặt',h:'',q:'Cáp được lắp đặt ở đâu (chôn ngầm, trên máng cáp, ngoài trời, trong nhà)?'},
 {k:'shield',l:'Giáp / chống nhiễu',h:'',q:'Có cần giáp bảo vệ (băng thép hoặc sợi thép) hay lớp chống nhiễu không?'},
 {k:'condition',l:'Điều kiện vận hành',h:'',q:'Điều kiện vận hành (liên tục, gián đoạn, có rung động hay hoá chất)?'},
 {k:'temp',l:'Nhiệt độ môi trường',h:'tối đa',q:'Nhiệt độ môi trường tối đa tại nơi lắp đặt?'},
 {k:'qty',l:'Số lượng',h:'mét',q:'Tổng chiều dài cần đặt (mét)?'},
 {k:'delivery',l:'Thời gian giao',h:'',q:'Thời gian cần giao hàng?'},
 {k:'budget',l:'Ngân sách dự án',h:'tuỳ chọn',q:'Ngân sách dự kiến cho hạng mục cáp (nếu có)?',opt:true}
];
const ST={ok:['Đã xác nhận','ok'],ai:['AI đọc · cần kiểm tra','ai'],miss:['Còn thiếu','miss'],na:['Không áp dụng','na']};
/* Trạng thái yêu cầu: [nhãn, lớp màu, icon, màu biểu đồ] */
const STATUS={new:['Mới','info','plus','#14233C'],waiting:['Chờ khách trả lời','warn','clock','#E9A23B'],ready:['Sẵn sàng gợi ý','org','cable','#EE6A2C'],done:['Đã chốt mã','ok','check','#3E8E63']};
const CAT=[
 {code:'CXV/DSTA',ins:'XLPE',arm:'Băng thép',v:'0.6/1 kV',src:'Catalogue hãng [A] · tr. 42',ug:true},
 {code:'CXV/SWA',ins:'XLPE',arm:'Sợi thép',v:'0.6/1 kV',src:'Catalogue hãng [A] · tr. 45',ug:true},
 {code:'CVV/DSTA',ins:'PVC',arm:'Băng thép',v:'0.6/1 kV',src:'Catalogue hãng [B] · tr. 18',ug:true},
 {code:'CXV',ins:'XLPE',arm:'Không',v:'0.6/1 kV',src:'Catalogue hãng [A] · tr. 30',ug:false},
 {code:'CVV',ins:'PVC',arm:'Không',v:'0.6/1 kV',src:'Catalogue hãng [B] · tr. 12',ug:false}
];
/* Tồn kho mẫu: khoá = mã cáp|số lõi|tiết diện. Bị thay khi Admin tải file Excel/CSV */
const STOCK={'CXV/DSTA|4|16':820,'CXV/SWA|4|16':300,'CVV/DSTA|4|16':0,'CXV/SWA|4|50':1500,'CXV/DSTA|4|25':600};
const USERS={staff:{name:'Nguyễn Văn A',role:'Nhân viên kinh doanh'},admin:{name:'Nguyễn Văn D',role:'Quản trị'}};
const REASONS=['Khách yêu cầu loại khác','AI trích sai thông số','Có hàng tương đương phù hợp hơn','Ưu tiên hàng sẵn kho','Khác'];

const SAMPLE='Hello, we need a quotation for 4x25 mm2 cable 0.6/1kV, XLPE insulated, armoured, for underground installation. Quantity 500 m. Cần giao trong 2 tuần.';

/* Quy tắc chọn cáp. auto:true = đang được code áp dụng khi xếp hạng; auto:false = ghi chú chờ A3 */
const RULES_DEFAULT=[
 {id:'r1',cond:'Lắp đặt chôn ngầm',eff:'Chỉ đề xuất cáp có giáp (băng thép hoặc sợi thép)',src:'Kinh nghiệm DNG',active:true,auto:true},
 {id:'r2',cond:'Khách nêu vật liệu cách điện (XLPE/PVC)',eff:'Phương án khác vật liệu bị trừ điểm',src:'Catalogue hãng',active:true,auto:true},
 {id:'r3',cond:'Khách nêu loại giáp cụ thể (DSTA/SWA)',eff:'Ưu tiên đúng loại giáp khách nêu',src:'Catalogue hãng',active:true,auto:true},
 {id:'r4',cond:'Lắp ngoài trời, nắng trực tiếp',eff:'Ưu tiên vỏ bọc chống tia UV',src:'Tài liệu kỹ thuật',active:true,auto:false},
 {id:'r5',cond:'Khu vực có yêu cầu phòng cháy',eff:'Đề xuất cáp chống cháy hoặc chậm cháy',src:'Tài liệu kỹ thuật',active:true,auto:false}
];
/* Nhận file yêu cầu: chỉ PDF và ảnh (theo proposal v3) */
const FILE_OK=['application/pdf','image/png','image/jpeg','image/webp'];
const FILE_MAX=10*1024*1024;
/* Báo giá: mẫu tạm, chờ DNG chốt (proposal mục 10) */
const QUOTE_DEFAULT={margin:15,vat:10};
