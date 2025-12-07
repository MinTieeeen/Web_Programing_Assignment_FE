# NEXTPLAY - Frontend Documentation

Chào mừng đến với **NextPlay**, nền tảng phân phối game bản quyền trực tuyến với giao diện hiện đại, đậm chất gaming. Tài liệu này mô tả chi tiết các tính năng và cấu trúc của phần Frontend (Giao diện người dùng).

## 🌟 Tổng Quan

NextPlay Frontend được xây dựng với tiêu chí:
*   **Hiện đại**: Sử dụng phong cách thiết kế **Glassmorphism** (hiệu ứng kính), Neon Glow và Dark Mode.
*   **Trải nghiệm người dùng (UX)**: Tối ưu hóa cho việc khám phá game, đọc tin tức và quản lý tài khoản.
*   **Tương thích**: Responsive, hoạt động tốt trên cả máy tính và thiết bị di động.

## 🚀 Tính Năng Chính

### 1. Hệ Thống Xác Thực (Authentication)
*   **Đăng nhập & Đăng ký**: Giao diện đẹp mắt, validate dữ liệu ngay trên form.
*   **Quản lý phiên làm việc**: Lưu trạng thái đăng nhập, tự động cập nhật Header khi người dùng đăng nhập.
*   **Phân quyền**: Ẩn/hiện các tính năng dựa trên vai trò người dùng (User/Admin).

### 2. Trang Chủ (Home Page)
*   **Hero Section**: Banner động giới thiệu các tựa game nổi bật nhất.
*   **Featured Games**: Danh sách game được đề xuất.
*   **Latest News**: Cập nhật tin tức công nghệ và game mới nhất.

### 3. Cửa Hàng & Khám Phá (Store & Discovery)
*   **Danh sách sản phẩm**: Hiển thị lưới sản phẩm với hình ảnh chất lượng cao.
*   **Tìm kiếm & Lọc**:
    *   Tìm kiếm theo tên game (Real-time).
    *   Lọc theo thể loại, mức giá.
*   **Chi tiết sản phẩm**:
    *   Thông tin chi tiết, cấu hình yêu cầu.
    *   Thư viện ảnh (Gallery).
    *   Nút "Thêm vào giỏ hàng" và "Yêu thích".

### 4. Giỏ Hàng & Thanh Toán (Cart & Checkout)
*   **Quản lý giỏ hàng**: Thêm, sửa, xóa sản phẩm. Tự động tính tổng tiền.
*   **Lưu trữ cục bộ**: Giỏ hàng được lưu trong LocalStorage, không bị mất khi tải lại trang.
*   **Mô phỏng thanh toán**: Quy trình thanh toán mượt mà (Simulation).

### 5. Tin Tức & Cộng Đồng (News & Community)
*   **Danh sách tin tức**: Giao diện dạng tạp chí (Magazine Layout).
*   **Chi tiết bài viết**:
    *   Nội dung bài viết phong phú.
    *   **Bình luận**: Người dùng có thể viết, sửa, xóa bình luận của mình.
    *   **Bài viết liên quan**: Gợi ý các bài viết cùng chủ đề.
    *   **Thanh bên (Sidebar)**: Tin nổi bật, tin mới nhất.

### 6. Hồ Sơ Người Dùng (User Profile)
*   **Thông tin cá nhân**: Xem và cập nhật thông tin tài khoản, Avatar.
*   **Thư viện game**: Quản lý các game đã mua.
*   **Danh sách yêu thích**: Xem các game đã lưu.
*   **Số dư tài khoản**: Hiển thị số dư hiện tại.

### 7. Trang "Về Chúng Tôi" (About Us & CMS)
*   **Giao diện giới thiệu**: Sứ mệnh, tầm nhìn, đội ngũ phát triển.
*   **CMS (Content Management System)**:
    *   Cho phép **Admin** chỉnh sửa trực tiếp nội dung (văn bản, hình ảnh) ngay trên trang.
    *   Lưu thay đổi vào cơ sở dữ liệu thông qua API.

## � Đối Tượng Sử Dụng

Hệ thống được thiết kế để phục vụ các nhóm đối tượng sau:

### 1. Khách (Guest)
*   **Xem thông tin public**: Truy cập các trang thông tin như trang chủ, sản phẩm, thông tin liên hệ, tin tức,...
*   **Tìm kiếm tài nguyên**: Tìm kiếm tin tức, sản phẩm, dịch vụ,...
*   **Tài khoản**: Đăng ký và Đăng nhập hệ thống.

### 2. Thành Viên (Member)
*   *Yêu cầu: Đã đăng nhập vào hệ thống.*
*   **Quản lý thông tin cá nhân**: Thay đổi thông tin cá nhân, mật khẩu, hình ảnh đại diện,...
*   **Tương tác**: Viết bình luận, đánh giá cho sản phẩm và tin tức.
*   **Tính năng khác**: Các chức năng dành riêng cho thành viên (Lịch sử mua hàng, Yêu thích,...).

### 3. Quản Trị Viên (Admin)
*   **Quản lý thành viên**: Xem thông tin, sửa, cấm, xóa thành viên.
*   **Quản lý tương tác**: Quản lý bình luận, đánh giá của thành viên.
*   **Quản lý liên hệ**: Quản lý các liên hệ gửi từ khách hàng.
*   **Quản lý trang public**: Thay đổi các thông tin hiển thị công khai (như thông tin liên hệ).
*   **Quản lý thông tin (CRUD)**: Xem, thêm, sửa, xóa các trang thông tin như sản phẩm, dịch vụ, bảng giá.
*   **Quản lý tin tức (CRUD)**: Xem, thêm, sửa, xóa tin tức; quản lý từ khóa, mô tả, tiêu đề bài viết.
*   **Quản lý tài nguyên**: Quản lý hình ảnh, nội dung trang web và các tài nguyên khác.

### 4. Nhà Phát Hành (Publisher)
*   **Mục tiêu**: Phân phối game, quản lý doanh thu và sản phẩm của mình.
*   **Quyền hạn**:
    *   Đăng ký tài khoản nhà phát hành.
    *   Đăng tải và quản lý các tựa game của mình.
    *   Xem thống kê doanh thu và lượt mua.
    *   Cập nhật thông tin, giá bán và khuyến mãi cho game.

## �🛠 Công Nghệ Sử Dụng

*   **HTML5 / CSS3**: Xây dựng cấu trúc và giao diện. Sử dụng CSS Variables để quản lý theme.
*   **JavaScript (Vanilla)**: Xử lý logic, gọi API, tương tác DOM. Không phụ thuộc vào Framework nặng nề.
*   **Bootstrap 5**: Framework CSS hỗ trợ Layout và Responsive.
*   **Google Fonts**: Font chữ 'Outfit' hiện đại.
*   **Bootstrap Icons**: Bộ icon phong phú.

## 📂 Cấu Trúc Thư Mục

```
BTL_LTW_FE/
├── assets/             # Tài nguyên tĩnh
│   ├── css/            # Các file CSS (style.css, news.css, about.css, ...)
│   ├── js/             # Các file JS (auth.js, cart.js, include-components.js, ...)
│   └── images/         # Hình ảnh dự án
├── auth/               # Trang xác thực (login.html, register.html)
├── news/               # Trang tin tức (index.html, detail.html)
├── products/           # Trang sản phẩm (index.html, detail.html)
├── users/              # Trang người dùng (profile.html)
├── cart/               # Trang giỏ hàng (index.html)
├── about/              # Trang giới thiệu (index.html)
├── components/         # Các thành phần tái sử dụng (header.html, footer.html)
└── index.html          # Trang chủ
```

## 🔗 Kết Nối Backend

Frontend giao tiếp với Backend thông qua RESTful API:
*   **Base URL**: `/BTL_LTW/BTL_LTW_BE/api`
*   **Endpoints chính**:
    *   `/auth/*`: Xác thực.
    *   `/games/*`: Dữ liệu game.
    *   `/news/*`: Dữ liệu tin tức.
    *   `/pages/*`: Nội dung trang tĩnh (CMS).
    *   `/users/*`: Thông tin người dùng.


