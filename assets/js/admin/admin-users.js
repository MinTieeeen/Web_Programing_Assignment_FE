/**
 * Admin User Management Logic
 */

// Ensure ENV is loaded
if (!window.ENV || !window.ENV.API_URL) {
    document.body.innerHTML = '<div class="alert alert-danger m-5"><h4>Lỗi cấu hình</h4><p>ENV chưa được tải! Hãy chắc chắn rằng env.js đã được bao gồm và API_URL đã được cấu hình.</p></div>';
    throw new Error('[admin/admin-users.html] ENV not loaded!');
}
const API_BASE_URL = window.ENV.API_URL;

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication first using consistent method
    const authResult = await AdminUtils.checkAuthentication();
    if (authResult) {
        // Initialize admin components (sidebar, navbar)
        // Note: We use 'admin-users' as the page id to highlight the correct sidebar item
        await AdminComponents.init('admin-users');
        
        loadUsers();
        setupSearchAndFilters();
    }
});

// Load all users with admin status
async function loadUsers() {
    showLoading(true);
    hideMessages();

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('API Response:', data);  // Debug log
        
        if (data.status === 'success') {
            // API returns users in 'data' property, not 'users'
            const users = data.data || data.users || [];
            displayUsers(users);
            updateStatistics(users);
        } else {
            showError(data.message || 'Không thể tải danh sách người dùng');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showError('Không thể kết nối đến máy chủ');
    } finally {
        showLoading(false);
    }
}

// Display users in the UI as table rows
function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    
    if (!users || users.length === 0) {
        usersList.innerHTML = '<tr><td colspan="8" class="text-center py-4">Không tìm thấy người dùng nào.</td></tr>';
        return;
    }

    const filteredUsers = applyFilters(users);
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<tr><td colspan="8" class="text-center py-4">Không có người dùng nào phù hợp với tiêu chí tìm kiếm của bạn.</td></tr>';
        return;
    }
    
    usersList.innerHTML = filteredUsers.map(user => {
        const initials = getInitials(user.fname, user.lname, user.uname);
        const fullName = [user.fname, user.lname].filter(Boolean).join(' ') || '-';
        const dob = user.DOB ? new Date(user.DOB).toLocaleDateString('vi-VN') : '-';
        const isSelf = user.uid == localStorage.getItem('uid');
        
        return `
        <tr>
            <td><span class="text-muted">${user.uid}</span></td>
            <td>
                ${user.avatar 
                    ? `<span class="avatar" style="background-image: url(${user.avatar})"></span>` 
                    : `<span class="avatar">${initials}</span>`
                }
            </td>
            <td><div class="font-weight-medium">${user.uname || user.username}</div></td>
            <td>${fullName}</td>
            <td>${user.email}</td>
            <td>${dob}</td>
            <td>
                <span class="badge bg-${user.isAdmin ? 'red' : 'secondary'} text-${user.isAdmin ? 'white' : 'white'}">
                    ${user.isAdmin ? 'Quản trị viên' : 'Người dùng'}
                </span>
            </td>
            <td>
                <button 
                    onclick="toggleAdminStatus(${user.uid}, '${user.isAdmin ? 'false' : 'true'}', '${user.uname || user.username}')"
                    class="btn btn-sm ${user.isAdmin ? 'btn-warning' : 'btn-success'}"
                    ${isSelf ? 'disabled title="Không thể thay đổi trạng thái quản trị viên của chính bạn"' : ''}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        ${user.isAdmin 
                            ? '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/><line x1="16" y1="11" x2="22" y2="11" />'
                            : '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/><path d="M16 11l2 2l4 -4" />'
                        }
                    </svg>
                    ${user.isAdmin ? 'Hủy quyền Admin' : 'Cấp quyền Admin'}
                </button>
            </td>
        </tr>
    `}).join('');
}

// Get initials from name
function getInitials(fname, lname, uname) {
    if (fname && lname) {
        return (fname.charAt(0) + lname.charAt(0)).toUpperCase();
    } else if (fname) {
        return fname.charAt(0).toUpperCase();
    } else if (uname) {
        return uname.charAt(0).toUpperCase();
    }
    return '?';
}

// Reset filters
function resetFilters() {
    document.getElementById('userSearch').value = '';
    document.getElementById('adminFilter').value = 'all';
    const currentData = window.currentUsers || [];
    displayUsers(currentData);
}

// Apply search and filter
function applyFilters(users) {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const adminFilter = document.getElementById('adminFilter').value;
    
    return users.filter(user => {
        // Search filter
        const matchesSearch = !searchTerm || 
            user.uname.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.uid.toString().includes(searchTerm);
        
        // Admin filter
        const matchesAdminFilter = adminFilter === 'all' ||
            (adminFilter === 'admin' && user.isAdmin) ||
            (adminFilter === 'user' && !user.isAdmin);
        
        return matchesSearch && matchesAdminFilter;
    });
}

// Setup search and filter event listeners
function setupSearchAndFilters() {
    const userSearch = document.getElementById('userSearch');
    const adminFilter = document.getElementById('adminFilter');
    
    userSearch.addEventListener('input', () => {
        // Re-apply filters to current data
        const currentData = window.currentUsers || [];
        displayUsers(currentData);
    });
    
    adminFilter.addEventListener('change', () => {
        const currentData = window.currentUsers || [];
        displayUsers(currentData);
    });
}

// Toggle admin status
async function toggleAdminStatus(uid, makeAdmin, username) {
    const action = makeAdmin === 'true' ? 'grant' : 'remove';
    const actionText = makeAdmin === 'true' ? 'cấp quyền quản trị cho' : 'hủy quyền quản trị của';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} ${username}?`;
    
    if (!confirm(confirmMessage)) {
        return;
    }

    hideMessages();

    try {
        const url = makeAdmin === 'true' ? 
            `${API_BASE_URL}/admin/add` : 
            `${API_BASE_URL}/admin/remove/${uid}`;
        
        const options = {
            method: makeAdmin === 'true' ? 'POST' : 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        if (makeAdmin === 'true') {
            options.body = JSON.stringify({ uid: uid });
        }

        const response = await fetch(url, options);
        const data = await response.json();
        
        if (data.status === 'success') {
            showSuccess(`Đã ${actionText} ${username} thành công`);
            await loadUsers(); // Reload to show updated status
        } else {
            showError(data.message || `Thất bại khi ${actionText} ${username}`);
        }
    } catch (error) {
        console.error('Error toggling admin status:', error);
        showError(`Thất bại khi ${actionText} ${username}`);
    }
}

// Update statistics
function updateStatistics(users) {
    window.currentUsers = users; // Store for filtering
    
    const totalUsers = users.length;
    const totalAdmins = users.filter(user => user.isAdmin).length;
    const totalRegularUsers = totalUsers - totalAdmins;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalAdmins').textContent = totalAdmins;
    document.getElementById('totalRegularUsers').textContent = totalRegularUsers;
    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString('vi-VN');
}

// Utility functions
function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}
