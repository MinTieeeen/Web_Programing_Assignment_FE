<?php require APPROOT . '/views/layouts/header.php'; ?>

<main class="register-wrapper">
  <div class="register-overlay"></div>
  <section class="register-card">
    <h1 class="register-title">Đăng nhập NextPlay</h1>
    <form class="register-form" action="<?php echo URLROOT; ?>/auth/login" method="POST" novalidate>
      
      <div class="form-field">
        <label for="username" class="form-label">Tên người dùng hoặc Email</label>
        <input type="text" id="username" name="username" class="form-control <?php echo (!empty($data['username_err'])) ? 'is-invalid' : ''; ?>" placeholder="Nhập tên người dùng hoặc email" value="<?php echo $data['username']; ?>" required>
        <span class="invalid-feedback"><?php echo $data['username_err']; ?></span>
      </div>

      <div class="form-field">
        <label for="password" class="form-label">Mật khẩu</label>
        <input type="password" id="password" name="password" class="form-control <?php echo (!empty($data['password_err'])) ? 'is-invalid' : ''; ?>" placeholder="Nhập mật khẩu" value="<?php echo $data['password']; ?>" required>
        <span class="invalid-feedback"><?php echo $data['password_err']; ?></span>
      </div>

      <button type="submit" class="btn btn-primary register-submit">Đăng nhập</button>
      
      <div class="mt-3 text-center">
        <a href="<?php echo URLROOT; ?>/auth/register" class="text-white">Chưa có tài khoản? Đăng ký ngay</a>
      </div>
    </form>
  </section>
</main>

<?php require APPROOT . '/views/layouts/footer.php'; ?>
