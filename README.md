# CableFlow – Hệ thống báo giá kỹ thuật

Prototype giao diện cho Đông Nguyên Gia (COMM2592 – Digital Media Studio 4).
Bản dev: dữ liệu mẫu, chưa có backend, đăng nhập không cần tài khoản.

## Chạy trên máy
- VS Code: cài extension **Live Server**, chuột phải `index.html` → *Open with Live Server*.
- Hoặc mở thẳng `index.html` bằng trình duyệt.

## Cấu trúc
```
assets/logo-dng*.png  Logo DNG (bản màu cam và bản trắng)
index.html            Khung trang, nạp CSS/JS theo thứ tự
css/styles.css        Toàn bộ giao diện (màu, chip trạng thái, responsive)
js/data.js            11 thông số, trạng thái, catalogue & tồn kho mẫu
js/extract.js         Trích thông số từ tin nhắn (quy tắc, mô phỏng AI)
js/state.js           Dữ liệu mẫu + lưu localStorage
js/utils.js           Hàm tiện ích, chip, toast, icon
js/recommend.js       Xếp hạng phương án cáp, kiểm tra tồn kho
js/message.js         Soạn tin nhắn hỏi lại khách, tô sáng đoạn trích
js/views/*.js         Từng màn hình: shell, login, list, new, workspace, history, admin
js/app.js             Router (#/...) và xử lý sự kiện – nạp sau cùng
```

## Luồng màn hình
`#/login` → `#/enquiries` → `#/new` → `#/enquiry/<mã>/1..4` (1 kiểm tra thông tin · 2 hỏi lại khách · 3 gợi ý mã cáp · 4 xác nhận & báo giá) → `#/history` → `#/admin`

## Ghi chú bản dev
- Nhận file PDF/ảnh nhưng chưa đọc nội dung (cần backend + AI API).
- File tồn kho Excel/CSV đọc ngay trên trình duyệt bằng SheetJS (tải từ CDN khi cần).
- Báo giá: mẫu tạm, chỉ hàng có sẵn, giá vốn do nhân viên nhập. Xuất Excel và PDF (in từ trình duyệt).
- Độ tin cậy % ở bước 3 tính theo mức khớp quy tắc, chưa phải AI thật.
- File Excel báo giá có công thức (thành tiền, cộng, VAT) nên sửa trực tiếp trong Excel được.
- Dữ liệu lưu trong localStorage của từng trình duyệt.

## Deploy
Mỗi lần push lên nhánh `main`, Vercel tự build lại và cập nhật link.
