// Check if user is admin by querying backend
async function checkIfUserIsAdmin(uid) {
  try {
    const response = await fetch(`/nextplay/index.php/admin/check/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.status === 'success' && data.isAdmin;
    }
    return false;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

// Check user login status and update header
window.updateHeaderLoginStatus = async function() {
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
    
    // Check admin status by querying backend
    const isAdmin = await checkIfUserIsAdmin(userData.uid);
    
    // Show/hide admin panel links based on backend check
    const adminPanelLink = document.getElementById('adminPanelLink');
    const mobileAdminPanelLink = document.getElementById('mobileAdminPanelLink');
    if (isAdmin) {
      if (adminPanelLink) adminPanelLink.classList.remove('d-none');
      if (mobileAdminPanelLink) mobileAdminPanelLink.classList.remove('d-none');
      console.log('Admin panel links shown for admin user');
    } else {
      if (adminPanelLink) adminPanelLink.classList.add('d-none');
      if (mobileAdminPanelLink) mobileAdminPanelLink.classList.add('d-none');
    }
    
    // Re-initialize event listeners after showing user menu
    setTimeout(function() {
      const userInfo = document.querySelector('.np-user-info');
      const dropdownToggle = document.getElementById('userDropdownToggle');
      
      if (userInfo) {
        userInfo.style.cursor = 'pointer';
        userInfo.removeEventListener('click', window.toggleUserDropdown);
        userInfo.addEventListener('click', window.toggleUserDropdown);
        console.log('User info event listener re-attached after login');
      }
      
      if (dropdownToggle) {
        dropdownToggle.removeEventListener('click', window.toggleUserDropdown);
        dropdownToggle.addEventListener('click', window.toggleUserDropdown);
        console.log('Dropdown toggle event listener re-attached after login');
      }
    }, 100);
    
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
window.toggleUserDropdown = function(event) {
  console.log('toggleUserDropdown called');
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const dropdownMenu = document.getElementById('userDropdownMenu');
  console.log('dropdownMenu element:', dropdownMenu);
  
  if (dropdownMenu) {
    const isVisible = dropdownMenu.classList.contains('show');
    console.log('Current dropdown state - has show class:', isVisible);
    
    // Close all other dropdowns first
    document.querySelectorAll('.np-dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
    
    // Toggle current dropdown
    if (!isVisible) {
      dropdownMenu.classList.add('show');
      console.log('Dropdown opened - added show class');
    } else {
      dropdownMenu.classList.remove('show');
      console.log('Dropdown closed - removed show class');
    }
    console.log('Final dropdown classes:', dropdownMenu.className);
  } else {
    console.error('userDropdownMenu element not found');
  }
};

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const userInfo = document.querySelector('.np-user-info');
  const dropdownMenu = document.getElementById('userDropdownMenu');
  
  if (userInfo && dropdownMenu && !userInfo.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove('show');
  }
});

// Handle dropdown item clicks
function handleDropdownItemClick(event) {
  // Don't prevent default for links
  if (event.target.tagName === 'A') {
    return;
  }
  
  // For buttons, prevent event bubbling
  event.stopPropagation();
}

// Initialize dropdown toggle and check login status
function initializeHeader() {
  console.log('initializeHeader called');
  const dropdownToggle = document.getElementById('userDropdownToggle');
  const userInfo = document.querySelector('.np-user-info');
  console.log('dropdownToggle element:', dropdownToggle);
  console.log('userInfo element:', userInfo);
  
  // Add click event to dropdown toggle button
  if (dropdownToggle) {
    // Remove any existing event listeners to avoid duplicates
    dropdownToggle.removeEventListener('click', window.toggleUserDropdown);
    dropdownToggle.addEventListener('click', window.toggleUserDropdown);
    console.log('Dropdown toggle event listener added');
  }
  
  // Also make the entire user info area clickable
  if (userInfo) {
    userInfo.style.cursor = 'pointer';
    userInfo.removeEventListener('click', window.toggleUserDropdown);
    userInfo.addEventListener('click', window.toggleUserDropdown);
    console.log('User info click event listener added');
  }
  
  // Add event listeners to dropdown items
  const dropdownItems = document.querySelectorAll('.np-dropdown-item');
  dropdownItems.forEach(item => {
    item.removeEventListener('click', handleDropdownItemClick);
    item.addEventListener('click', handleDropdownItemClick);
  });
  console.log('Dropdown item event listeners added:', dropdownItems.length);
  
  // Update header on page load
  window.updateHeaderLoginStatus();
}

// Make initializeHeader globally accessible
window.initializeHeader = initializeHeader;

// Initialize with multiple strategies to ensure it works
function ensureHeaderInitialization() {
  // Try immediately
  initializeHeader();
  
  // Try after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeader);
  }
  
  // Try with delays to ensure DOM is ready
  setTimeout(initializeHeader, 50);
  setTimeout(initializeHeader, 100);
  setTimeout(initializeHeader, 250);
}

// Run initialization
ensureHeaderInitialization();

// Listen for storage changes (when user logs in/out in another tab)
window.addEventListener('storage', window.updateHeaderLoginStatus);