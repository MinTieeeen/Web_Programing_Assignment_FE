// Admin Users Management JavaScript
// Ensure ENV is loaded before using API
if (!window.ENV || !window.ENV.API_URL) {
    throw new Error('[users.js] ENV not loaded! Include env.js before this script.');
}
const API_BASE_URL = window.ENV.API_URL;

class AdminUsers {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalUsers = 0;
        this.users = [];
        this.initializeEventListeners();
        this.loadUsers();
    }

    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchUser');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(() => {
                this.filterUsers();
            }, 300));
        }

        // Filter functionality
        const filters = ['statusFilter', 'dateFilter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.filterUsers();
                });
            }
        });


    }

    async loadUsers() {
        try {
            // Use admin endpoint to get users with balance
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });
            const result = await response.json();
            
            if (result.status === 'success' && result.data) {
                // Map backend user data to frontend format
                this.users = result.data.map(user => ({
                    id: user.uid,
                    username: user.uname,
                    firstName: user.fname || '',
                    lastName: user.lname || '',
                    email: user.email,
                    dateOfBirth: user.DOB || '',
                    balance: parseFloat(user.balance) || 0.00,
                    status: 'active', // Default status since backend doesn't have this field
                    avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((user.fname || '') + '+' + (user.lname || ''))}&background=007bff&color=fff`,
                    createdAt: user.created_at || new Date().toISOString().split('T')[0]
                }));
                
                this.totalUsers = this.users.length;
            } else {
                throw new Error(result.message || 'Không thể tải danh sách người dùng');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            // Fallback to empty array if API fails
            this.users = [];
            this.totalUsers = 0;
            Toast.error('Lỗi tải người dùng: ' + error.message);
        }
        
        this.renderUsers();
        this.renderPagination();
    }

    renderUsers() {
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;

        const filteredUsers = this.getFilteredUsers();
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const usersToShow = filteredUsers.slice(startIndex, endIndex);

        tbody.innerHTML = usersToShow.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>
                    <img src="${user.avatar}" 
                         onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=random'" 
                         alt="${user.firstName} ${user.lastName}" 
                         class="avatar me-2">
                </td>
                <td><strong>${user.username}</strong></td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${this.formatDate(user.dateOfBirth)}</td>
                <td>${AdminUtils.formatCurrency(user.balance)}</td>
                <td>
                    <span class="badge status-${user.status}">${this.translateStatus(user.status)}</span>
                </td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-secondary btn-sm dropdown-toggle align-text-top" data-bs-boundary="viewport" data-bs-toggle="dropdown">
                            Thao tác
                        </button>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="#" onclick="adminUsers.viewUser(${user.id})">
                                <i class="bi bi-eye me-2"></i>
                                Xem chi tiết
                            </a>
                            <a class="dropdown-item" href="#" onclick="adminUsers.initResetPassword(${user.id}, '${user.username}')">
                                <i class="bi bi-key me-2"></i>
                                Đặt lại mật khẩu
                            </a>
                            <a class="dropdown-item" href="#" onclick="adminUsers.initToggleLock(${user.id}, ${user.status !== 'suspended'}, '${user.username}')">
                                <i class="bi ${user.status === 'suspended' ? 'bi-unlock' : 'bi-lock'} me-2"></i>
                                ${user.status === 'suspended' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            </a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item text-danger" href="#" onclick="adminUsers.deleteUser(${user.id})">
                                <i class="bi bi-trash me-2"></i>
                                Xóa người dùng
                            </a>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');

        // Reinitialize tooltips
        this.initializeTooltips();
    }

    // ... (renderUsers implementation)

    getFilteredUsers() {
        const searchTerm = document.getElementById('searchUser')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const dateFilter = document.getElementById('dateFilter')?.value || '';

        return this.users.filter(user => {
            const matchesSearch = !searchTerm || 
                user.username.toLowerCase().includes(searchTerm) ||
                user.firstName.toLowerCase().includes(searchTerm) ||
                user.lastName.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm);

            const matchesStatus = !statusFilter || user.status === statusFilter;

            const matchesDate = !dateFilter || user.createdAt.startsWith(dateFilter);

            return matchesSearch && matchesStatus && matchesDate;
        });
    }

    filterUsers() {
        this.currentPage = 1;
        this.renderUsers();
        this.renderPagination();
    }

    renderPagination() {
        const pagination = document.getElementById('usersPagination');
        if (!pagination) return;

        const filteredUsers = this.getFilteredUsers();
        const totalPages = Math.ceil(filteredUsers.length / this.pageSize);

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="adminUsers.changePage(${this.currentPage - 1})">Trước</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="adminUsers.changePage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="adminUsers.changePage(${this.currentPage + 1})">Sau</a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;
    }

    changePage(page) {
        const filteredUsers = this.getFilteredUsers();
        const totalPages = Math.ceil(filteredUsers.length / this.pageSize);

        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderUsers();
            this.renderPagination();
        }
    }


    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`Bạn có chắc muốn xóa người dùng "${user.username}"?`)) {
            this.performDeleteUser(userId, user.username);
        }
    }

    async performDeleteUser(userId, username) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                Toast.success(`Đã xóa người dùng "${username}"`);
                await this.loadUsers(); // Reload from database
            } else {
                throw new Error(result.message || 'Không thể xóa người dùng');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            Toast.error('Lỗi xóa người dùng: ' + error.message);
        }
    }



    validateAndUpdateUser() {
        const formData = this.getFormData('editUserForm');
        const userId = parseInt(formData.userid);
        
        // Validation
        if (!this.validateUserForm(formData, userId)) {
            return;
        }

        this.updateUser(formData);
    }

    validateUserForm(formData, excludeUserId = null) {
        // Basic validation
        if (!formData.username || !formData.email || !formData.firstname || !formData.lastname) {
            Toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Toast.error('Vui lòng nhập địa chỉ email hợp lệ');
            return false;
        }

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(formData.username)) {
            Toast.error('Tài khoản phải từ 3-20 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới');
            return false;
        }

        // Check for duplicate username/email (excluding current user if editing)
        const existingUser = this.users.find(u => 
            (u.username === formData.username || u.email === formData.email) && 
            u.id !== excludeUserId
        );

        if (existingUser) {
            Toast.error('Tài khoản hoặc email đã tồn tại');
            return false;
        }

        return true;
    }

    getFormData(formId) {
        const form = document.getElementById(formId);
        const data = {};

        // Get all form fields
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const fieldName = input.id.replace('edit', '').toLowerCase();
            if (input.type === 'checkbox') {
                data[fieldName] = input.checked;
            } else {
                data[fieldName] = input.value;
            }
        });

        return data;
    }



    updateUser(userData) {
        this.performUpdateUser(userData);
    }

    async performUpdateUser(userData) {
        const userId = parseInt(userData.userid);
        
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    uname: userData.username,
                    email: userData.email,
                    fname: userData.firstname,
                    lname: userData.lastname,
                    DOB: userData.dateofbirth,
                    balance: parseFloat(userData.balance) || 0
                })
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                Toast.success(`Đã cập nhật người dùng "${userData.username}" thành công`);
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                modal.hide();
                
                await this.loadUsers(); // Reload from database
            } else {
                throw new Error(result.message || 'Không thể cập nhật người dùng');
            }
        } catch (error) {
            console.error('Update user error:', error);
            Toast.error('Lỗi cập nhật người dùng: ' + error.message);
        }
    }

    resetFilters() {
        document.getElementById('searchUser').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('dateFilter').value = '';
        this.filterUsers();
    }

    initializeTooltips() {
        // Dispose existing tooltips first
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(t => t.remove());

        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    translateStatus(status) {
        const map = {
            'active': 'Hoạt động',
            'inactive': 'Không hoạt động',
            'suspended': 'Bị đình chỉ'
        };
        return map[status] || status;
    }

    initToggleLock(userId, shouldLock, username) {
        if (!shouldLock) {
             // If unlocking, just confirm
             if (confirm(`Bạn có chắc muốn mở khóa tài khoản "${username}"?`)) {
                 this.performToggleLock(userId, false, null);
             }
             return;
        }

        // If locking, show modal
        document.getElementById('lockUserId').value = userId;
        document.getElementById('lockTargetUsername').textContent = username;
        document.getElementById('confirmLock').checked = false;
        document.getElementById('lockDuration').value = 'permanent';
        
        const modal = new bootstrap.Modal(document.getElementById('lockUserModal'));
        modal.show();
    }

    async submitLockUser() {
        const userId = document.getElementById('lockUserId').value;
        const duration = document.getElementById('lockDuration').value;
        const isConfirmed = document.getElementById('confirmLock').checked;

        if (!isConfirmed) {
            Toast.warning('Vui lòng xác nhận khoá tài khoản');
            return;
        }

        await this.performToggleLock(userId, true, duration);
        bootstrap.Modal.getInstance(document.getElementById('lockUserModal')).hide();
    }

    async performToggleLock(userId, shouldLock, duration) {
        try {
            const user = this.users.find(u => u.id == userId);
            
            const response = await fetch(`${API_BASE_URL}/admin/users/toggle-lock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    uid: userId,
                    lock: shouldLock,
                    duration: duration
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                const action = shouldLock ? 'khóa' : 'mở khóa';
                Toast.success(`Đã ${action} tài khoản thành công`);
                // Update local state and re-render
                if (user) {
                    user.status = shouldLock ? 'suspended' : 'active';
                }
                this.renderUsers();
            } else {
                throw new Error(result.message || 'Thao tác thất bại');
            }
        } catch (error) {
            console.error('Toggle lock error:', error);
            Toast.error('Lỗi: ' + error.message);
        }
    }

    async viewUser(userId) {
        try {
            // Show loading state or clear previous data
            document.getElementById('viewUserUsername').textContent = 'Loading...';
            
            // Fetch detailed user info
            const response = await fetch(`${API_BASE_URL}/admin/users/detail?uid=${userId}`, {
                 headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                 },
                 credentials: 'include'
            });
            const result = await response.json();

            if (result.status !== 'success') {
                throw new Error(result.message || 'Không thể tải chi tiết người dùng');
            }

            const data = result.data;
            const user = data.user;
            const games = data.games || [];
            const feedbacks = data.feedbacks || [];
            const comments = data.comments || [];

            // 1. Populate Overview Tab (and Header)
            document.getElementById('viewUserAvatar').src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fname + ' ' + user.lname)}&background=random`;
            document.getElementById('viewUserAvatar').onerror = function() {
                this.onerror = null;
                this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fname + ' ' + user.lname)}&background=random`;
            };
            document.getElementById('viewUserFullName').textContent = `${user.fname} ${user.lname}`;
            document.getElementById('viewUserUsername').textContent = `@${user.uname}`;
            
            const statusBadge = document.getElementById('viewUserStatus');
            // Assuming status might be missing in getOne result if not joined, but loadUsers had it. 
            // In getOne, backend returns raw columns. Schema has 'status'? 
            // If not, we infer or use what we have. Let's use user.status if exists, else active.
            const status = user.status || 'active'; 
            statusBadge.textContent = this.translateStatus(status);
            statusBadge.className = `badge bg-${status === 'active' ? 'green' : (status === 'suspended' ? 'red' : 'secondary')} text-${status === 'active' ? 'green' : (status === 'suspended' ? 'red' : 'secondary')}-fg`;
            
            document.getElementById('viewUserId').textContent = user.uid;
            document.getElementById('viewUserEmail').textContent = user.email;
            document.getElementById('viewUserDob').textContent = this.formatDate(user.DOB);
            document.getElementById('viewUserBalance').textContent = AdminUtils.formatCurrency(user.balance);
            document.getElementById('viewUserJoined').textContent = this.formatDate(user.created_at);
            document.getElementById('viewUserLastLogin').textContent = user.last_login ? this.formatDate(user.last_login, 'long') : 'Chưa đăng nhập';

            // 2. Populate Games Tab
            const gamesTableBody = document.querySelector('#viewUserGamesTable tbody');
            const gamesEmpty = document.getElementById('viewUserGamesEmpty');
            gamesTableBody.innerHTML = '';
            
            if (games.length > 0) {
                gamesTableBody.innerHTML = games.map(game => `
                    <tr>
                        <td>
                            <div class="d-flex py-1 align-items-center">
                                <span class="avatar me-2" style="background-image: url(${game.header_image || ''})"></span>
                                <div class="flex-fill">
                                    <div class="font-weight-medium">${game.name}</div>
                                </div>
                            </div>
                        </td>
                        <td>${game.price > 0 ? AdminUtils.formatCurrency(game.price) : 'Miễn phí'}</td>
                        <td>${this.formatDate(game.purchase_date || new Date())}</td>
                    </tr>
                `).join('');
                gamesEmpty.classList.add('d-none');
            } else {
                gamesEmpty.classList.remove('d-none');
            }

            // 3. Populate Activity Tab
            
            // Feedbacks
            const feedbacksTableBody = document.querySelector('#viewUserFeedbacksTable tbody');
            const feedbacksEmpty = document.getElementById('viewUserFeedbacksEmpty');
            feedbacksTableBody.innerHTML = '';

            if (feedbacks.length > 0) {
                feedbacksTableBody.innerHTML = feedbacks.map(fb => `
                    <tr>
                        <td class="text-truncate" style="max-width: 150px;" title="${fb.game_name}">${fb.game_name}</td>
                        <td>
                             <span class="text-warning">
                                ${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}
                            </span>
                        </td>
                        <td class="text-truncate" style="max-width: 200px;" title="${fb.content}">${fb.content}</td>
                        <td>${this.formatDate(fb.feedback_time)}</td>
                    </tr>
                `).join('');
                feedbacksEmpty.classList.add('d-none');
            } else {
                feedbacksEmpty.classList.remove('d-none');
            }

            // Comments
            const commentsTableBody = document.querySelector('#viewUserCommentsTable tbody');
            const commentsEmpty = document.getElementById('viewUserCommentsEmpty');
            commentsTableBody.innerHTML = '';

            if (comments.length > 0) {
                commentsTableBody.innerHTML = comments.map(cmt => `
                    <tr>
                        <td>#${cmt.news_id}</td>
                        <td class="text-truncate" style="max-width: 300px;" title="${cmt.content}">${cmt.content}</td>
                        <td>${this.formatDate(cmt.created_at || new Date())}</td> 
                    </tr>
                `).join('');
                commentsEmpty.classList.add('d-none');
            } else {
                commentsEmpty.classList.remove('d-none');
            }

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('viewUserModal'));
            modal.show();

        } catch (error) {
            console.error('View user details error:', error);
            Toast.error('Lỗi tải thông tin chi tiết: ' + error.message);
        }
    }

    initResetPassword(userId, username) {
        document.getElementById('resetUserId').value = userId;
        document.getElementById('resetTargetUsername').textContent = username;
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
        modal.show();
    }

    async submitResetPassword() {
        const userId = document.getElementById('resetUserId').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            Toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        if (newPassword.length < 8) {
             Toast.error('Mật khẩu phải có ít nhất 8 ký tự');
             return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    uid: userId,
                    newPassword: newPassword
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                Toast.success('Đã đặt lại mật khẩu thành công');
                bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal')).hide();
            } else {
                throw new Error(result.message || 'Không thể đặt lại mật khẩu');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            Toast.error('Lỗi: ' + error.message);
        }
    }


}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}



// Utility Functions

function resetFilters() {
    adminUsers.resetFilters();
}

// Initialize when DOM is loaded
let adminUsers;
document.addEventListener('DOMContentLoaded', () => {
    adminUsers = new AdminUsers();
});