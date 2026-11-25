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
const ST={ok:['✓ Đã xác nhận','ok'],ai:['? AI trích – cần kiểm tra','ai'],miss:['! Còn thiếu','miss'],na:['– Không áp dụng','na']};
const STATUS={new:['Mới','info'],waiting:['Chờ khách trả lời','ai'],ready:['Sẵn sàng đề xuất','ok'],review:['Chờ người duyệt','na'],done:['Đã xác nhận','ok']};
const CAT=[
 {code:'CXV/DSTA',ins:'XLPE',arm:'Băng thép',v:'0.6/1 kV',src:'Catalogue hãng [A] · tr. 42',ug:true},
 {code:'CXV/SWA',ins:'XLPE',arm:'Sợi thép',v:'0.6/1 kV',src:'Catalogue hãng [A] · tr. 45',ug:true},
 {code:'CVV/DSTA',ins:'PVC',arm:'Băng thép',v:'0.6/1 kV',src:'Catalogue hãng [B] · tr. 18',ug:true},
 {code:'CXV',ins:'XLPE',arm:'Không',v:'0.6/1 kV',src:'Catalogue hãng [A] · tr. 30',ug:false},
 {code:'CVV',ins:'PVC',arm:'Không',v:'0.6/1 kV',src:'Catalogue hãng [B] · tr. 12',ug:false}
];
const STOCK={'CXV/DSTA|4|16':820,'CXV/SWA|4|16':300,'CVV/DSTA|4|16':0,'CXV/SWA|4|50':1500,'CXV/DSTA|4|25':600};
const USERS={staff:{name:'Nguyễn Văn A',role:'Nhân viên kinh doanh'},admin:{name:'Nguyễn Văn D',role:'Người duyệt · Quản trị'}};
const REASONS=['Khách yêu cầu loại khác','AI trích sai thông số','Có hàng tương đương phù hợp hơn','Ưu tiên hàng sẵn kho','Khác'];

const SAMPLE='Hello, we need a quotation for 4x25 mm2 cable 0.6/1kV, XLPE insulated, armoured, for underground installation. Quantity 500 m. Cần giao trong 2 tuần.';
