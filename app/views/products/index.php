<?php require APPROOT . '/views/layouts/header.php'; ?>

<div class="container mt-5 mb-5">
  <h1 class="mb-4">Khám phá Game</h1>
  
  <div class="row">
    <!-- Sidebar Filter -->
    <div class="col-md-3">
      <div class="card mb-4">
        <div class="card-header">Bộ lọc</div>
        <div class="card-body">
          <h6 class="card-title">Thể loại</h6>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="cat1">
            <label class="form-check-label" for="cat1">Action</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="cat2">
            <label class="form-check-label" for="cat2">RPG</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="cat3">
            <label class="form-check-label" for="cat3">Strategy</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="col-md-9">
      <div class="featured-grid">
        <!-- Sample Product 1 -->
        <div class="card">
          <img src="<?php echo URLROOT; ?>/assets/images/dota2_background.jpg" class="card-img-top" alt="Dota 2">
          <div class="card-body">
            <h6 class="card-title">Dota 2</h6>
            <p class="card-text">Free to Play</p>
            <a href="#" class="btn btn-sm btn-primary w-100">Chi tiết</a>
          </div>
        </div>

        <!-- Sample Product 2 -->
        <div class="card">
          <img src="<?php echo URLROOT; ?>/assets/images/csgo.jpg" class="card-img-top" alt="CS:GO">
          <div class="card-body">
            <h6 class="card-title">CS:GO</h6>
            <p class="card-text">Free to Play</p>
            <a href="#" class="btn btn-sm btn-primary w-100">Chi tiết</a>
          </div>
        </div>

        <!-- Sample Product 3 -->
        <div class="card">
          <img src="<?php echo URLROOT; ?>/assets/images/valorant_background.jpg" class="card-img-top" alt="Valorant">
          <div class="card-body">
            <h6 class="card-title">Valorant</h6>
            <p class="card-text">Free to Play</p>
            <a href="#" class="btn btn-sm btn-primary w-100">Chi tiết</a>
          </div>
        </div>

        <!-- Sample Product 4 -->
        <div class="card">
          <img src="<?php echo URLROOT; ?>/assets/images/lol.jpg" class="card-img-top" alt="League of Legends">
          <div class="card-body">
            <h6 class="card-title">League of Legends</h6>
            <p class="card-text">Free to Play</p>
            <a href="#" class="btn btn-sm btn-primary w-100">Chi tiết</a>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <nav aria-label="Page navigation" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item"><a class="page-link" href="#">Next</a></li>
        </ul>
      </nav>
    </div>
  </div>
</div>

<?php require APPROOT . '/views/layouts/footer.php'; ?>
