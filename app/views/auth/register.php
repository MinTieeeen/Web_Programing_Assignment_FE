<?php require APPROOT . '/views/layouts/header.php'; ?>

<main class="register-wrapper">
  <div class="register-overlay"></div>
  <section class="register-card">
    <h1 class="register-title">Đăng ký tài khoản NextPlay</h1>
    <form class="register-form" action="<?php echo URLROOT; ?>/auth/register" method="POST" novalidate>
      <div class="form-row">
        <div class="form-field">
          <label for="lastName" class="form-label">Họ</label>
          <input type="text" id="lastName" name="lastName" class="form-control <?php echo (!empty($data['last_name_err'])) ? 'is-invalid' : ''; ?>" placeholder="Nhập họ" value="<?php echo $data['last_name']; ?>" required>
          <span class="invalid-feedback"><?php echo $data['last_name_err']; ?></span>
        </div>
        <div class="form-field">
          <label for="firstName" class="form-label">Tên</label>
          <input type="text" id="firstName" name="firstName" class="form-control <?php echo (!empty($data['first_name_err'])) ? 'is-invalid' : ''; ?>" placeholder="Nhập tên" value="<?php echo $data['first_name']; ?>" required>
          <span class="invalid-feedback"><?php echo $data['first_name_err']; ?></span>
        </div>
      </div>

      <div class="form-field">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" name="email" class="form-control <?php echo (!empty($data['email_err'])) ? 'is-invalid' : ''; ?>" placeholder="name@example.com" value="<?php echo $data['email']; ?>" required>
        <span class="invalid-feedback"><?php echo $data['email_err']; ?></span>
      </div>

      <div class="form-field">
        <label for="username" class="form-label">Tên người dùng</label>
        <input type="text" id="username" name="username" class="form-control <?php echo (!empty($data['username_err'])) ? 'is-invalid' : ''; ?>" placeholder="Nhập tên người dùng" value="<?php echo $data['username']; ?>" required>
        <span class="invalid-feedback"><?php echo $data['username_err']; ?></span>
      </div>

      <div class="form-field">
        <label for="password" class="form-label">Mật khẩu</label>
        <input type="password" id="password" name="password" class="form-control <?php echo (!empty($data['password_err'])) ? 'is-invalid' : ''; ?>" placeholder="Nhập mật khẩu" value="<?php echo $data['password']; ?>" required minlength="6">
        <span class="invalid-feedback"><?php echo $data['password_err']; ?></span>
      </div>

      <div class="form-field">
        <label for="confirm_password" class="form-label">Xác nhận mật khẩu</label>
        <input type="password" id="confirm_password" name="confirm_password" class="form-control <?php echo (!empty($data['confirm_password_err'])) ? 'is-invalid' : ''; ?>" placeholder="Nhập lại mật khẩu" value="<?php echo $data['confirm_password']; ?>" required>
        <span class="invalid-feedback"><?php echo $data['confirm_password_err']; ?></span>
      </div>

      <div class="form-field">
        <label for="birthdate" class="form-label">Ngày sinh</label>
        <input type="date" id="birthdate" name="birthdate" class="form-control" value="<?php echo $data['dob']; ?>" required>
      </div>

      <div class="form-field">
        <span class="form-label d-block">Giới tính</span>
        <div class="gender-options" role="radiogroup" aria-labelledby="genderLabel">
          <input type="radio" id="genderFemale" name="gender" value="female" class="gender-input" checked>
          <label for="genderFemale" class="gender-pill">Nữ</label>

          <input type="radio" id="genderMale" name="gender" value="male" class="gender-input">
          <label for="genderMale" class="gender-pill">Nam</label>

          <input type="radio" id="genderOther" name="gender" value="other" class="gender-input">
          <label for="genderOther" class="gender-pill">Khác</label>
        </div>
      </div>

      <div class="form-field form-check">
        <input class="form-check-input" type="checkbox" value="1" id="terms" required>
        <label class="form-check-label" for="terms">
          Tôi đồng ý với tất cả điều khoản và điều kiện của NextPlay
        </label>
      </div>

      <button type="submit" class="btn btn-primary register-submit">Đăng ký</button>
      <div class="mt-3 text-center">
        <a href="<?php echo URLROOT; ?>/auth/login" class="text-white">Đã có tài khoản? Đăng nhập ngay</a>
      </div>
    </form>
  </section>
</main>

<?php require APPROOT . '/views/layouts/footer.php'; ?>
