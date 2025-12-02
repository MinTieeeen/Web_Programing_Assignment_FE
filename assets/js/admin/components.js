// Admin Components Manager
class AdminComponents {
    static async init(currentPage = '') {
        try {
            await this.loadSidebar();
            await this.loadNavbar();
            this.setActivePage(currentPage);
            this.initializeSidebar();
            this.initializeEventListeners();
            AdminUtils.checkAuthentication();
        } catch (error) {
            console.error('Error initializing admin components:', error);
        }
    }

    static async loadSidebar() {
        try {
            const response = await fetch('../components/admin-sidebar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sidebarHTML = await response.text();
            const container = document.getElementById('sidebarContainer');
            if (container) {
                container.innerHTML = sidebarHTML;
            }
        } catch (error) {
            console.error('Error loading sidebar:', error);
            // Fallback: create sidebar inline if component fails to load
            this.createFallbackSidebar();
        }
    }

    static async loadNavbar() {
        try {
            const response = await fetch('../components/admin-navbar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const navbarHTML = await response.text();
            const container = document.getElementById('navbarContainer');
            if (container) {
                container.innerHTML = navbarHTML;
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
            // Fallback: create navbar inline if component fails to load
            this.createFallbackNavbar();
        }
    }

    static createFallbackSidebar() {
        const container = document.getElementById('sidebarContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h4><i class="bi bi-controller"></i> Game Admin</h4>
                </div>
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/index.html" data-page="dashboard">
                            <i class="bi bi-speedometer2"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/users.html" data-page="users">
                            <i class="bi bi-people"></i> Users
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/admin-users.html" data-page="admin-users">
                            <i class="bi bi-shield-check"></i> Admin Management
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/products.html" data-page="products">
                            <i class="bi bi-joystick"></i> Games
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/orders.html" data-page="orders">
                            <i class="bi bi-cart3"></i> Orders & Carts
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/comments.html" data-page="comments">
                            <i class="bi bi-chat-square-text"></i> Reviews
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/contacts.html" data-page="contacts">
                            <i class="bi bi-building"></i> Publishers
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/posts.html" data-page="posts">
                            <i class="bi bi-tags"></i> Categories
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/settings.html" data-page="settings">
                            <i class="bi bi-gear"></i> Settings
                        </a>
                    </li>
                </ul>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <i class="bi bi-person-circle"></i>
                        <span id="adminUserName">Admin User</span>
                    </div>
                    <button class="btn btn-outline-light btn-sm" onclick="AdminUtils.logout()">
                        <i class="bi bi-box-arrow-right"></i> Logout
                    </button>
                </div>
            </div>
        `;
    }

    static createFallbackNavbar() {
        const container = document.getElementById('navbarContainer');
        if (!container) return;

        container.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container-fluid">
                    <button class="btn btn-outline-light" id="sidebarToggle">
                        <i class="bi bi-list"></i>
                    </button>
                    <span class="navbar-brand mb-0 h1 ms-3" id="pageTitle">Admin Dashboard</span>
                    <div class="ms-auto d-flex align-items-center">
                        <div class="dropdown me-3">
                            <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" id="notificationDropdown">
                                <i class="bi bi-bell"></i> 
                                <span class="badge bg-danger" id="notificationCount">3</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" id="notificationList">
                                <li><h6 class="dropdown-header">Notifications</h6></li>
                                <li><a class="dropdown-item" href="#"><i class="bi bi-person-plus text-primary"></i> 5 new user registrations</a></li>
                                <li><a class="dropdown-item" href="#"><i class="bi bi-check-circle text-success"></i> 3 pending game approvals</a></li>
                                <li><a class="dropdown-item" href="#"><i class="bi bi-chat text-info"></i> 12 new reviews</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-center" href="#" onclick="AdminUtils.markAllNotificationsRead()">Mark all as read</a></li>
                            </ul>
                        </div>
                        <button class="btn btn-outline-light" onclick="AdminUtils.logout()" title="Logout">
                            <i class="bi bi-box-arrow-right"></i> Logout
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }

    static setActivePage(currentPage) {
        // Set active navigation item
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === currentPage || 
                (currentPage === 'dashboard' && link.href.includes('index.html')) ||
                link.href.includes(window.location.pathname.split('/').pop())) {
                link.classList.add('active');
            }
        });

        // Update page title
        const pageTitles = {
            'dashboard': 'Dashboard',
            'users': 'User Management',
            'products': 'Game Management',
            'orders': 'Orders & Carts Management',
            'comments': 'Reviews Management',
            'contacts': 'Publishers Management',
            'posts': 'Categories Management',
            'settings': 'System Settings'
        };

        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle && pageTitles[currentPage]) {
            pageTitle.textContent = pageTitles[currentPage];
        }
    }

    static initializeSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');

        if (sidebarToggle && sidebar && mainContent) {
            sidebarToggle.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('show');
                } else {
                    sidebar.classList.toggle('collapsed');
                    mainContent.classList.toggle('expanded');
                }
            });

            // Close sidebar on mobile when clicking outside
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(e.target) && 
                    !sidebarToggle.contains(e.target) &&
                    sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    sidebar.classList.remove('show');
                    if (sidebar.classList.contains('collapsed')) {
                        mainContent.classList.add('expanded');
                    } else {
                        mainContent.classList.remove('expanded');
                    }
                }
            });
        }
    }

    static initializeEventListeners() {
        // Initialize tooltips
        this.initializeTooltips();

        // Initialize notification handlers
        this.initializeNotifications();
    }

    static initializeTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    static initializeNotifications() {
        const notificationDropdown = document.getElementById('notificationDropdown');
        if (notificationDropdown) {
            notificationDropdown.addEventListener('click', () => {
                AdminUtils.loadNotifications();
            });
        }
    }

    // Common Modal Components
    static createConfirmModal(title, message, onConfirm) {
        const modalId = 'confirmModal' + Date.now();
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="confirmBtn">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        
        document.getElementById('confirmBtn').addEventListener('click', () => {
            onConfirm();
            modal.hide();
        });

        modal.show();

        // Clean up modal after it's hidden
        document.getElementById(modalId).addEventListener('hidden.bs.modal', () => {
            document.getElementById(modalId).remove();
        });
    }

    // Stats Card Component
    static createStatsCard(icon, title, value, colorClass = 'primary') {
        return `
            <div class="card bg-${colorClass} text-white">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="bi ${icon} fa-2x"></i>
                        <div class="ms-3">
                            <div class="small">${title}</div>
                            <div class="h4">${value}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Table Component with pagination
    static createDataTable(containerId, columns, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const tableHTML = `
            <div class="table-responsive">
                <table class="table table-striped" id="${containerId}Table">
                    <thead>
                        <tr>
                            ${columns.map(col => `<th>${col.title}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                ${columns.map(col => `<td>${this.formatCellData(row[col.field], col)}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = tableHTML;
    }

    static formatCellData(data, column) {
        if (column.formatter) {
            return column.formatter(data);
        }
        return data;
    }
}

// Export for use in other files
window.AdminComponents = AdminComponents;