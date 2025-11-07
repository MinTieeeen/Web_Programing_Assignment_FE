// Check user login status and update header
window.updateHeaderLoginStatus = function() {
  console.log('updateHeaderLoginStatus called');
  const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  console.log('Current user:', currentUser);
  const guestActions = document.getElementById('guestActions');
  const userMenu = document.getElementById('userMenu');
  const mobileUserMenu = document.getElementById('mobileUserMenu');
  
  if (currentUser) {
    const userData = JSON.parse(currentUser);
    console.log('User data:', userData);
    
    // Hide guest actions, show user menu
    if (guestActions) {
      guestActions.classList.add('d-none');
      console.log('Guest actions hidden');
    }
    if (userMenu) {
      userMenu.classList.remove('d-none');
      console.log('User menu shown');
    }
    if (mobileUserMenu) mobileUserMenu.classList.remove('d-none');
    
    // Update user name
    const userName = document.getElementById('userName');
    const mobileUserName = document.getElementById('mobileUserName');
    if (userName) {
      userName.textContent = userData.name || userData.username;
      console.log('Username updated to:', userData.name || userData.username);
    }
    if (mobileUserName) mobileUserName.textContent = userData.name || userData.username;
    
  } else {
    console.log('No user logged in');
    // Show guest actions, hide user menu
    if (guestActions) guestActions.classList.remove('d-none');
    if (userMenu) userMenu.classList.add('d-none');
    if (mobileUserMenu) mobileUserMenu.classList.add('d-none');
  }
};

// Logout function
window.logout = function() {
  // Clear user data
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentUser');
  
  // Redirect to home page
  window.location.href = '/index.html';
};

// Toggle user dropdown
window.toggleUserDropdown = function() {
  const dropdownMenu = document.getElementById('userDropdownMenu');
  if (dropdownMenu) {
    dropdownMenu.classList.toggle('show');
  }
};

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const userDropdown = document.getElementById('userDropdownToggle');
  const dropdownMenu = document.getElementById('userDropdownMenu');
  
  if (userDropdown && dropdownMenu && !userDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove('show');
  }
});

// Initialize dropdown toggle and check login status
function initializeHeader() {
  const dropdownToggle = document.getElementById('userDropdownToggle');
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', window.toggleUserDropdown);
  }
  
  // Update header on page load
  window.updateHeaderLoginStatus();
}

// Initialize when DOM is loaded or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
  // DOM is already loaded, run immediately
  initializeHeader();
}

// Also run after a small delay to ensure everything is loaded
setTimeout(initializeHeader, 100);

// Listen for storage changes (when user logs in/out in another tab)
window.addEventListener('storage', window.updateHeaderLoginStatus);