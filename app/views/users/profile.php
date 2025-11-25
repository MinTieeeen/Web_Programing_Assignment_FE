<?php require APPROOT . '/views/layouts/header.php'; ?>

<div class="profile-section">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="profile-card">
          <div class="profile-header">
            <h1 class="profile-title">Hồ sơ cá nhân</h1>
            <span class="badge bg-primary rounded-pill px-3 py-2">Thành viên</span>
          </div>
          
          <div class="profile-body">
            <div class="row align-items-center">
              <!-- Avatar Column -->
              <div class="col-md-4">
                <div class="profile-avatar-section">
                  <div class="avatar-wrapper">
                    <?php 
                      $avatar = !empty($data['user']->avatar) ? URLROOT . '/assets/uploads/' . $data['user']->avatar : URLROOT . '/assets/images/default-avatar.png'; 
                    ?>
                    <img src="<?php echo $avatar; ?>" alt="Avatar" class="profile-avatar">
                  </div>
                  
                  <form action="<?php echo URLROOT; ?>/users/upload_avatar" method="POST" enctype="multipart/form-data">
                    <label for="avatar" class="btn-upload">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      Đổi ảnh đại diện
                    </label>
                    <input type="file" name="avatar" id="avatar" class="d-none" onchange="this.form.submit()">
                  </form>
                </div>
              </div>
              
              <!-- Info Column -->
              <div class="col-md-8">
                <div class="profile-info-section">
                  <h2 class="user-name"><?php echo $data['user']->first_name . ' ' . $data['user']->last_name; ?></h2>
                  <div class="user-handle">@<?php echo $data['user']->username; ?></div>
                  
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Email</span>
                      <div class="info-value"><?php echo $data['user']->email; ?></div>
                    </div>
                    
                    <div class="info-item">
                      <span class="info-label">Ngày sinh</span>
                      <div class="info-value"><?php echo date('d/m/Y', strtotime($data['user']->dob)); ?></div>
                    </div>
                    
                    <div class="info-item">
                      <span class="info-label">Số dư</span>
                      <div class="info-value" style="color: #00ff88; font-weight: 700;"><?php echo number_format($data['user']->balance, 0, ',', '.'); ?> đ</div>
                    </div>

                    <div class="info-item">
                      <span class="info-label">Ngày tham gia</span>
                      <div class="info-value"><?php echo date('d/m/Y', strtotime($data['user']->created_at)); ?></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Purchased Games Section -->
            <div class="row mt-5">
              <div class="col-12">
                <h3 class="text-white mb-4 border-bottom border-secondary pb-2">Kho game của tôi</h3>
                <?php if(empty($data['games'])): ?>
                  <p class="text-white">Bạn chưa mua game nào.</p>
                <?php else: ?>
                  <div class="row">
                    <?php foreach($data['games'] as $game): ?>
                      <div class="col-md-3 mb-4">
                        <div class="card bg-dark text-white border-secondary h-100">
                          <!-- Placeholder for game image if not available -->
                          <div style="height: 150px; background: #2a3b4c; display: flex; align-items: center; justify-content: center; color: #8aa3b7;">
                            Game Image
                          </div>
                          <div class="card-body">
                            <h5 class="card-title text-truncate"><?php echo $game->name; ?></h5>
                            <a href="<?php echo URLROOT; ?>/products/detail/<?php echo $game->id; ?>" class="btn btn-sm btn-primary w-100 mt-2">Chơi ngay</a>
                          </div>
                        </div>
                      </div>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<?php require APPROOT . '/views/layouts/footer.php'; ?>
