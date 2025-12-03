// Auth Logic
(function() {
  // Ensure ENV is loaded
  if (!window.ENV || !window.ENV.API_URL) {
    console.error('[auth.js] ENV not loaded! Include env.js before this script.');
    return;
  }
  const API_URL = window.ENV.API_URL;

  // Calculate APP_ROOT if not set
  if (!window.APP_ROOT) {
    var scripts = document.getElementsByTagName('script');
    var scriptPath = '';
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf('auth.js') !== -1) {
        scriptPath = scripts[i].src;
        break;
      }
    }
    if (scriptPath) {
      window.APP_ROOT = scriptPath.replace(/\/assets\/js\/auth\.js.*/, '/');
    }
  }

  function updateHeaderLoginStatus() {
    const authActions = document.getElementById('auth-actions');
    if (!authActions) return;

    // Cart Icon HTML
    const cartHtml = `
      <a href="${(window.APP_ROOT || '/') + 'cart/index.html'}" class="np-cart-btn me-3">
        <i class="bi bi-bag-fill"></i>
        <span class="cart-badge" id="cart-count" style="display: none;">0</span>
      </a>
    `;

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Show Avatar and Dropdown
      // const avatarUrl = user.avatar ? (window.APP_ROOT || '/') + 'assets/uploads/' + user.avatar : (window.APP_ROOT || '/') + 'assets/images/default-avatar.svg';
      const avatarUrl = (window.ENV && window.ENV.getAvatarUrl) ? window.ENV.getAvatarUrl(user.avatar) : ((window.APP_ROOT || '/') + 'assets/uploads/' + user.avatar);
      authActions.innerHTML = `
        <div class="d-flex align-items-center">
          ${cartHtml}
          <div class="dropdown">
            <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="${avatarUrl}" alt="${user.uname}" width="32" height="32" class="rounded-circle me-2" style="object-fit: cover; border: 2px solid #fff;">
              <strong>${user.uname}</strong>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
              <li><a class="dropdown-item" href="${window.APP_ROOT || '/'}users/profile.html">Hồ sơ cá nhân</a></li>
              <li><a class="dropdown-item" href="#" id="logout-btn">Đăng xuất</a></li>
            </ul>
          </div>
        </div>
      `;
    }
    else {
      // Show Login/Register
      authActions.innerHTML = `
        <div class="d-flex align-items-center">
          <a href="${window.APP_ROOT || '/'}auth/register.html" class="np-btn np-btn-outline me-2">Đăng ký</a>
          <a href="${window.APP_ROOT || '/'}auth/login.html" class="np-btn np-btn-primary">Đăng nhập</a>
        </div>
      `;
    }

    // Update cart count if Cart object is available
    if (window.Cart && window.Cart.updateCartCount) {
      window.Cart.updateCartCount();
    }
  }

  function logout() {
    console.log('Executing logout...');
    localStorage.removeItem('user');
    window.location.href = (window.APP_ROOT || '/') + 'auth/login.html';
  }

  // Expose function globally
  window.updateHeaderLoginStatus = updateHeaderLoginStatus;
  window.API_URL = API_URL;

  // Run on load if header is already present
  document.addEventListener('DOMContentLoaded', function () {
    updateHeaderLoginStatus();
  });

  // Event Delegation for Logout
  document.addEventListener('click', function (e) {
    const logoutBtn = e.target.closest('#logout-btn');
    if (logoutBtn) {
      console.log('Logout button clicked');
      e.preventDefault();
      logout();
    }
  });

})();
