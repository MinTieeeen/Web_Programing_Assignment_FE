# Game Store - PHP MVC Project

Website bán game trực tuyến (giống Steam) được xây dựng bằng PHP thuần theo mô hình MVC (Model-View-Controller), không sử dụng Framework.

## 🚀 Tính năng

- **Khách (Guest)**:
  - Xem danh sách game, chi tiết game.
  - Tìm kiếm game.
  - Đăng ký / Đăng nhập.
- **Thành viên (Member)**:
  - Quản lý thông tin cá nhân.
  - Mua game (Giỏ hàng/Thanh toán).
  - Bình luận, đánh giá game.
- **Admin**:
  - Dashboard quản lý chung.
  - Quản lý sản phẩm (Game).
  - Quản lý thành viên.

## 📂 Cấu trúc dự án

Dự án được tổ chức theo mô hình MVC:

```text
/
├── app/                    # Mã nguồn chính (Core Logic)
│   ├── config/             # Cấu hình (Database, URL, Constants)
│   ├── controllers/        # Controllers (Xử lý yêu cầu)
│   ├── core/               # Lớp lõi (App, Controller, Database)
│   ├── models/             # Models (Tương tác Database)
│   └── views/              # Views (Giao diện HTML/PHP)
│       ├── admin/          # Giao diện Admin
│       ├── auth/           # Giao diện Login/Register
│       ├── home/           # Giao diện Trang chủ
│       ├── layouts/        # Header, Footer chung
│       └── products/       # Giao diện Sản phẩm
├── public/                 # Thư mục gốc truy cập Web
│   ├── assets/             # CSS, JS, Images
│   └── index.php           # Điểm khởi chạy ứng dụng
└── database.sql            # File cấu trúc Database MySQL
```

## 🛠️ Cài đặt và Chạy trên XAMPP

### 1. Cấu hình Thư mục
1.  Copy thư mục dự án vào `C:\xampp\htdocs\`. Ví dụ: `C:\xampp\htdocs\GameStore`.
2.  Mở trình duyệt và truy cập: `http://localhost/GameStore/public`.

**Lưu ý quan trọng**:
Mặc định dự án trỏ về `http://localhost:8000`. Để chạy đúng trên XAMPP (port 80), bạn cần sửa file cấu hình:

Mở `app/config/config.php` và sửa dòng `URLROOT`:
```php
// Nếu thư mục là GameStore
define('URLROOT', 'http://localhost/GameStore/public');
```

### 2. Cấu hình Database
1.  Mở **phpMyAdmin** (`http://localhost/phpmyadmin`).
2.  Tạo database mới tên là `game_store`.
3.  Import file `database.sql` vào database vừa tạo.
4.  Kiểm tra cấu hình trong `app/config/config.php`:
    ```php
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', ''); // Mặc định XAMPP không có pass
    define('DB_NAME', 'game_store');
    ```

### 3. Sử dụng
- **Trang chủ**: `http://localhost/GameStore/public`
- **Đăng nhập**: `http://localhost/GameStore/public/auth/login`
- **Admin**: `http://localhost/GameStore/public/admin`

## 📋 Yêu cầu hệ thống
- PHP >= 7.0
- MySQL
- Apache (đã bật mod_rewrite)
