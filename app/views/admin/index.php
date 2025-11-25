<?php require APPROOT . '/views/layouts/header.php'; ?>

<div class="container mt-5 mb-5">
  <h1>Admin Dashboard</h1>
  <p>Welcome to the admin area.</p>
  
  <div class="row mt-4">
    <div class="col-md-3">
      <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action active">Dashboard</a>
        <a href="#" class="list-group-item list-group-item-action">Users</a>
        <a href="#" class="list-group-item list-group-item-action">Products</a>
        <a href="#" class="list-group-item list-group-item-action">Orders</a>
      </div>
    </div>
    <div class="col-md-9">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Overview</h5>
          <p class="card-text">Select an item from the sidebar to manage.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<?php require APPROOT . '/views/layouts/footer.php'; ?>
