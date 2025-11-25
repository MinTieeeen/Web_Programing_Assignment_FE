<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo SITENAME; ?></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="<?php echo URLROOT; ?>/assets/css/style.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="<?php echo URLROOT; ?>/assets/css/header.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="<?php echo URLROOT; ?>/assets/css/footer.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="<?php echo URLROOT; ?>/assets/css/register.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="<?php echo URLROOT; ?>/assets/css/profile.css?v=<?php echo time(); ?>">
</head>
<body>
  <nav class="np-navbar">
    <div class="np-container">
      <a href="<?php echo URLROOT; ?>" class="np-brand">
        <img src="<?php echo URLROOT; ?>/assets/images/logo.png" alt="NextPlay logo" class="np-logo">
        <span class="np-brand-text">NextPlay</span>
      </a>

      <ul class="np-nav">
        <li><a href="<?php echo URLROOT; ?>">Trang chủ</a></li>
        <li><a href="<?php echo URLROOT; ?>/products">Khám phá</a></li>
        <li><a href="<?php echo URLROOT; ?>/news">Tin tức</a></li>
        <li><a href="<?php echo URLROOT; ?>/pages/about">Về chúng tôi</a></li>
      </ul>

      <div class="np-right">
        <div class="np-actions">
          <?php if(isset($_SESSION['user_id'])) : ?>
            <div class="dropdown">
              <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <?php 
                  $avatar = isset($_SESSION['user_avatar']) && !empty($_SESSION['user_avatar']) ? URLROOT . '/assets/uploads/' . $_SESSION['user_avatar'] : URLROOT . '/assets/images/default-avatar.png'; 
                ?>
                <img src="<?php echo $avatar; ?>" alt="mdo" width="32" height="32" class="rounded-circle me-2" style="object-fit: cover; border: 2px solid #fff;">
                <strong><?php echo $_SESSION['user_name']; ?></strong>
              </a>
              <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li><a class="dropdown-item" href="<?php echo URLROOT; ?>/users/profile">Hồ sơ cá nhân</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="<?php echo URLROOT; ?>/auth/logout">Đăng xuất</a></li>
              </ul>
            </div>
          <?php else : ?>
            <a href="<?php echo URLROOT; ?>/auth/register" class="np-btn np-btn-outline">Đăng ký</a>
            <a href="<?php echo URLROOT; ?>/auth/login" class="np-btn np-btn-primary">Đăng nhập</a>
          <?php endif; ?>
        </div>

        <button class="np-toggle" aria-label="Toggle navigation" data-toggle-target="#np-menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div id="np-menu" class="np-menu">
        <ul class="np-nav-mobile">
          <li><a href="<?php echo URLROOT; ?>">Trang chủ</a></li>
          <li><a href="<?php echo URLROOT; ?>/news">Tin tức</a></li>
          <li><a href="<?php echo URLROOT; ?>/products">Khám phá</a></li>
          <li><a href="<?php echo URLROOT; ?>/pages/about">Về chúng tôi</a></li>
        </ul>
      </div>
    </div>
  </nav>
