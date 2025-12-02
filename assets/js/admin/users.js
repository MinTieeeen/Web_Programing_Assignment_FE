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

        // Form submissions
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateAndSaveUser();
            });
        }

        const editUserForm = document.getElementById('editUserForm');
        if (editUserForm) {
            editUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateAndUpdateUser();
            });
        }
    }

    async loadUsers() {
        try {
            // Use admin endpoint to get users with balance
            const response = await fetch(`${API_BASE_URL}/admin/users/all`, {
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
                throw new Error(result.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            // Fallback to empty array if API fails
            this.users = [];
            this.totalUsers = 0;
            showToast('Failed to load users: ' + error.message, 'error');
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
                    <img src=\"${user.avatar}\" alt=\"${user.firstName} ${user.lastName}\" class=\"avatar me-2\">
                </td>
                <td><strong>${user.username}</strong></td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${this.formatDate(user.dateOfBirth)}</td>
                <td>$${user.balance.toFixed(2)}</td>
                <td>
                    <span class=\"badge status-${user.status}\">${this.capitalizeFirst(user.status)}</span>
                </td>
                <td>
                    <div class=\"btn-group\" role=\"group\">
                        <button class=\"btn btn-primary btn-sm\" onclick=\"adminUsers.editUser(${user.id})\" data-bs-toggle=\"tooltip\" title=\"Edit User\">
                            <i class=\"bi bi-pencil\"></i>
                        </button>
                        <button class=\"btn btn-info btn-sm\" onclick=\"adminUsers.viewUser(${user.id})\" data-bs-toggle=\"tooltip\" title=\"View Details\">
                            <i class=\"bi bi-eye\"></i>
                        </button>
                        <button class=\"btn btn-danger btn-sm\" onclick=\"adminUsers.deleteUser(${user.id})\" data-bs-toggle=\"tooltip\" title=\"Delete User\">
                            <i class=\"bi bi-trash\"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Reinitialize tooltips
        this.initializeTooltips();
    }

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
            <li class=\"page-item ${this.currentPage === 1 ? 'disabled' : ''}\">
                <a class=\"page-link\" href=\"#\" onclick=\"adminUsers.changePage(${this.currentPage - 1})\">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <li class=\"page-item ${this.currentPage === i ? 'active' : ''}\">
                        <a class=\"page-link\" href=\"#\" onclick=\"adminUsers.changePage(${i})\">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<li class=\"page-item disabled\"><span class=\"page-link\">...</span></li>`;
            }
        }

        // Next button
        paginationHTML += `
            <li class=\"page-item ${this.currentPage === totalPages ? 'disabled' : ''}\">
                <a class=\"page-link\" href=\"#\" onclick=\"adminUsers.changePage(${this.currentPage + 1})\">Next</a>
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

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        // Populate edit form
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editDateOfBirth').value = user.dateOfBirth;
        document.getElementById('editBalance').value = user.balance;
        document.getElementById('editStatus').value = user.status;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
        modal.show();
    }

    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        alert(`User Details:\nID: ${user.id}\nName: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nStatus: ${user.status}\nBalance: $${user.balance.toFixed(2)}`);
    }

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
            this.performDeleteUser(userId, user.username);
        }
    }

    async performDeleteUser(userId, username) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                showToast(`User "${username}" has been deleted`, 'success');
                await this.loadUsers(); // Reload from database
            } else {
                throw new Error(result.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            showToast('Failed to delete user: ' + error.message, 'error');
        }
    }

    validateAndSaveUser() {
        const formData = this.getFormData('addUserForm');
        
        // Validation
        if (!this.validateUserForm(formData)) {
            return;
        }

        // Check if username or email already exists
        const existingUser = this.users.find(u => 
            u.username === formData.username || u.email === formData.email
        );

        if (existingUser) {
            showToast('Username or email already exists', 'error');
            return;
        }

        this.saveUser(formData);
    }

    validateAndUpdateUser() {
        const formData = this.getFormData('editUserForm');
        const userId = parseInt(formData.userId);
        
        // Validation
        if (!this.validateUserForm(formData, userId)) {
            return;
        }

        this.updateUser(formData);
    }

    validateUserForm(formData, excludeUserId = null) {
        // Basic validation
        if (!formData.username || !formData.email || !formData.firstName || !formData.lastName) {
            showToast('Please fill in all required fields', 'error');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast('Please enter a valid email address', 'error');
            return false;
        }

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(formData.username)) {
            showToast('Username must be 3-20 characters long and contain only letters, numbers, and underscores', 'error');
            return false;
        }

        // Check for duplicate username/email (excluding current user if editing)
        const existingUser = this.users.find(u => 
            (u.username === formData.username || u.email === formData.email) && 
            u.id !== excludeUserId
        );

        if (existingUser) {
            showToast('Username or email already exists', 'error');
            return false;
        }

        return true;
    }

    getFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};

        // Get all form fields
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                data[input.id.replace('edit', '').toLowerCase()] = input.checked;
            } else {
                const fieldName = input.id.replace('edit', '').toLowerCase();
                data[fieldName] = input.value;
            }
        });

        return data;
    }

    saveUser(userData) {
        this.performCreateUser(userData);
    }

    async performCreateUser(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    uname: userData.username,
                    email: userData.email,
                    password: userData.password,
                    fname: userData.firstname,
                    lname: userData.lastname,
                    DOB: userData.dateofbirth,
                    balance: parseFloat(userData.initialbalance) || 0
                })
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                showToast(`User "${userData.username}" has been created successfully`, 'success');
                
                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                modal.hide();
                document.getElementById('addUserForm').reset();
                
                await this.loadUsers(); // Reload from database
            } else {
                throw new Error(result.message || 'Failed to create user');
            }
        } catch (error) {
            console.error('Create user error:', error);
            showToast('Failed to create user: ' + error.message, 'error');
        }
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
                    'Content-Type': 'application/json'
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
                showToast(`User "${userData.username}" has been updated successfully`, 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                modal.hide();
                
                await this.loadUsers(); // Reload from database
            } else {
                throw new Error(result.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Update user error:', error);
            showToast('Failed to update user: ' + error.message, 'error');
        }
    }

    resetFilters() {
        document.getElementById('searchUser').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('dateFilter').value = '';
        this.filterUsers();
    }

    initializeTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle=\"tooltip\"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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

function saveUser() {
    adminUsers.validateAndSaveUser();
}

function updateUser() {
    adminUsers.validateAndUpdateUser();
}

function resetFilters() {
    adminUsers.resetFilters();
}

// Initialize when DOM is loaded
let adminUsers;
document.addEventListener('DOMContentLoaded', () => {
    adminUsers = new AdminUsers();
});

// Initialize sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('show');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });
    }
});