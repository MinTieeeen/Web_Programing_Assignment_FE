// Admin Users Management JavaScript
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

    loadUsers() {
        // Simulate API call to load users
        const mockUsers = [
            {
                id: 1,
                username: 'john_doe',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                dateOfBirth: '1990-05-15',
                balance: 125.50,
                status: 'active',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=007bff&color=fff',
                createdAt: '2024-01-15'
            },
            {
                id: 2,
                username: 'jane_smith',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                dateOfBirth: '1988-08-22',
                balance: 89.75,
                status: 'active',
                avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=28a745&color=fff',
                createdAt: '2024-02-10'
            },
            {
                id: 3,
                username: 'mike_johnson',
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike@example.com',
                dateOfBirth: '1992-12-03',
                balance: 0.00,
                status: 'inactive',
                avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=ffc107&color=000',
                createdAt: '2024-03-05'
            },
            {
                id: 4,
                username: 'sarah_wilson',
                firstName: 'Sarah',
                lastName: 'Wilson',
                email: 'sarah@example.com',
                dateOfBirth: '1995-07-18',
                balance: 245.30,
                status: 'active',
                avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=17a2b8&color=fff',
                createdAt: '2024-04-12'
            },
            {
                id: 5,
                username: 'banned_user',
                firstName: 'Banned',
                lastName: 'User',
                email: 'banned@example.com',
                dateOfBirth: '1985-03-10',
                balance: 15.25,
                status: 'suspended',
                avatar: 'https://ui-avatars.com/api/?name=Banned+User&background=dc3545&color=fff',
                createdAt: '2024-01-20'
            }
        ];

        this.users = mockUsers;
        this.totalUsers = mockUsers.length;
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

        if (confirm(`Are you sure you want to delete user \"${user.username}\"?`)) {
            this.users = this.users.filter(u => u.id !== userId);
            this.totalUsers = this.users.length;
            showToast(`User \"${user.username}\" has been deleted`, 'success');
            this.renderUsers();
            this.renderPagination();
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
        const newUser = {
            id: this.users.length + 1,
            username: userData.username,
            firstName: userData.firstname,
            lastName: userData.lastname,
            email: userData.email,
            dateOfBirth: userData.dateofbirth,
            balance: parseFloat(userData.initialbalance) || 0.00,
            status: 'active',
            avatar: `https://ui-avatars.com/api/?name=${userData.firstname}+${userData.lastname}&background=007bff&color=fff`,
            createdAt: new Date().toISOString().split('T')[0]
        };

        this.users.unshift(newUser);
        this.totalUsers = this.users.length;

        showToast(`User \"${newUser.username}\" has been created successfully`, 'success');
        
        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        document.getElementById('addUserForm').reset();

        this.renderUsers();
        this.renderPagination();
    }

    updateUser(userData) {
        const userId = parseInt(userData.userid);
        const userIndex = this.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return;

        // Update user data
        this.users[userIndex] = {
            ...this.users[userIndex],
            username: userData.username,
            firstName: userData.firstname,
            lastName: userData.lastname,
            email: userData.email,
            dateOfBirth: userData.dateofbirth,
            balance: parseFloat(userData.balance),
            status: userData.status
        };

        showToast(`User \"${userData.username}\" has been updated successfully`, 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();

        this.renderUsers();
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