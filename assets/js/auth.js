// Auth Logic
(function () {
  if (!window.ENV || !window.ENV.API_URL) {
    console.error('ENV or ENV.API_URL is not defined in auth.js');
    console.log('window.ENV:', window.ENV);
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

  async function updateHeaderLoginStatus(retryCount = 0) {
    // console.log('[Auth] Checking login status, attempt:', retryCount);
    
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.getElementById('userProfile');
    const headerCartBtn = document.getElementById('headerCartBtn');

    // If elements are missing, we might be on a page without the standard header or header not loaded yet
    if (!authButtons && !userProfile) {
        if (retryCount < 5) {
            // console.log('[Auth] Header elements not found, retrying in 500ms...');
            setTimeout(() => updateHeaderLoginStatus(retryCount + 1), 500);
        }
        return;
    }

    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      let user = JSON.parse(userStr);
      
      // Update UI immediately with local data
      updateUserUI(user);

      // Helper to update links based on role
      const updateLinks = (userRole) => {
          const adminLink = document.getElementById('adminPanelLink');
          const publisherLink = document.getElementById('publisherDashboardLink');
          
          if (adminLink) {
              if (userRole === 'admin') adminLink.classList.remove('d-none');
              else adminLink.classList.add('d-none');
          }
          
          if (publisherLink) {
              if (userRole === 'publisher') publisherLink.classList.remove('d-none');
              else publisherLink.classList.add('d-none');
          }
      };

      // Initial update from local storage
      if (user.userType || user.role) {
          updateLinks(user.userType || user.role);
      }

      // Fetch fresh data from backend
      try {
          const uid = user.uid || user.id;
          const response = await fetch(`${API_URL}/users/${uid}`);
          if (response.ok) {
              const data = await response.json();
              if (data.status === 'success') {
                  const newUser = { ...user, ...data.data };
                  
                  // userType is now included in data.data from backend
                  if (newUser.userType) {
                    newUser.role = newUser.userType; // Sync role
                  }
                  
                  localStorage.setItem('user', JSON.stringify(newUser));
                  updateUserUI(newUser);
                  updateLinks(newUser.userType || newUser.role);
              }
          }
      } catch (e) {
          console.error('[Auth] Error fetching fresh user data:', e);
      }

    } else {
      // Not logged in
      if (authButtons) authButtons.style.display = 'flex';
      if (userProfile) userProfile.parentElement.style.display = 'none'; // Hide wrapper
      if (headerCartBtn) headerCartBtn.style.display = 'none';
    }

    // Update cart
    if (window.Cart && window.Cart.updateCartCount) {
      window.Cart.updateCartCount();
    }
  }

  function updateUserUI(user) {
      const authButtons = document.querySelector('.auth-buttons');
      const userProfile = document.getElementById('userProfile');
      const headerCartBtn = document.getElementById('headerCartBtn');
      
      if (authButtons) authButtons.style.display = 'none';
      
      // Show Cart
      if (headerCartBtn) {
          headerCartBtn.style.display = 'inline-flex';
      }

      if (userProfile) {
          const wrapper = userProfile.parentElement; // .user-profile-wrapper
          if(wrapper) wrapper.style.display = 'block';
          
          userProfile.style.display = 'flex';
          
          // Construct Avatar URL
          const avatarUrl = user.avatar 
            ? (user.avatar.startsWith('http') ? user.avatar : (window.APP_ROOT || '/') + 'assets/uploads/' + user.avatar)
            : (window.APP_ROOT || '/') + 'assets/images/default-avatar.svg';

          const userAvatar = document.getElementById('userAvatar');
          if (userAvatar) {
              userAvatar.src = avatarUrl;
              // Add click event to toggle dropdown
              userAvatar.onclick = function(e) {
                  e.stopPropagation();
                  toggleProfileDropdown();
              };
          }
          
          // Populate Dropdown Data
          populateProfileDropdown(user, avatarUrl);
      }
  }

  function populateProfileDropdown(user, avatarUrl) {
      const els = {
          name: document.getElementById('dropdownName'),
          email: document.getElementById('dropdownEmail')
      };

      if (els.name) els.name.textContent = `${user.fname} ${user.lname}`.trim() || user.uname;
      if (els.email) els.email.textContent = user.email;
  }

  function toggleProfileDropdown() {
      const dropdown = document.getElementById('profileDropdown');
      if (dropdown) {
          dropdown.classList.toggle('show');
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
    // Support both ID formats just in case
    const logoutBtn = e.target.closest('#logoutBtnDropdown') || e.target.closest('#logoutBtn');
    if (logoutBtn) {
      console.log('Logout button clicked');
      e.preventDefault();
      logout();
    }
  });

  // Event Delegation for Profile Dropdown Closing
  document.addEventListener('click', function(e) {
      const dropdown = document.getElementById('profileDropdown');
      const userProfile = document.getElementById('userProfile');
      
      if (!dropdown || !dropdown.classList.contains('show')) return;

      // Close if clicking outside the dropdown AND outside the profile avatar
      if (!dropdown.contains(e.target) && (!userProfile || !userProfile.contains(e.target))) {
          dropdown.classList.remove('show');
      }
  });

})();
