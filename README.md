# CableFlow – Hệ thống xử lý yêu cầu kỹ thuật & báo giá

Prototype giao diện cho Đông Nguyên Gia (COMM2592 – Digital Media Studio 4).
Bản dev: dữ liệu mẫu, chưa có backend, đăng nhập không cần tài khoản.

## Chạy trên máy
- VS Code: cài extension **Live Server**, chuột phải `index.html` → *Open with Live Server*.
- Hoặc mở thẳng `index.html` bằng trình duyệt.

## Cấu trúc
```
index.html            Khung trang, nạp CSS/JS theo thứ tự
css/styles.css        Toàn bộ giao diện (màu, chip trạng thái, responsive)
js/data.js            11 thông số, trạng thái, catalogue & tồn kho mẫu
js/extract.js         Trích thông số từ tin nhắn (quy tắc, mô phỏng AI)
js/state.js           Dữ liệu mẫu + lưu localStorage
js/utils.js           Hàm tiện ích, chip, toast, icon
js/recommend.js       Xếp hạng phương án cáp, kiểm tra tồn kho
js/message.js         Soạn tin nhắn hỏi lại khách, tô sáng đoạn trích
js/views/*.js         Từng màn hình: shell, login, list, new, workspace, admin
js/app.js             Router (#/...) và xử lý sự kiện – nạp sau cùng
```

## Luồng màn hình
`#/login` → `#/enquiries` → `#/new` → `#/enquiry/<mã>` (4 bước) → `#/admin`

## Deploy
Mỗi lần push lên nhánh `main`, Vercel tự build lại và cập nhật link.
