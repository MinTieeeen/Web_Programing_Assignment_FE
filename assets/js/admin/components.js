// Admin Components Manager
class AdminComponents {
    static async init(currentPage = '') {
        try {
            await this.loadSidebar();
            await this.loadNavbar();
            this.setActivePage(currentPage);
            this.initializeSidebar();
            this.initializeEventListeners();
            await AdminUtils.checkAuthentication();
            
            // Force update user display again to ensure elements in loaded components are updated
            const currentUser = localStorage.getItem('currentUser') || localStorage.getItem('user');
            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    AdminUtils.updateUserDisplay(userData);
                } catch (e) {
                    console.error('Error updating user display after init:', e);
                }
            }
        } catch (error) {
            console.error('Error initializing admin components:', error);
        }
    }

    static async loadSidebar() {
        try {
            const response = await fetch('../components/admin-sidebar.html?v=' + new Date().getTime());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sidebarHTML = await response.text();
            const container = document.getElementById('sidebarContainer');
            if (container) {
                // Parse HTML to get the element
                const temp = document.createElement('div');
                temp.innerHTML = sidebarHTML;
                const sidebarElement = temp.firstElementChild;

                if (sidebarElement) {
                    // Start: Fix for Tabler Layout
                    // Replace the wrapper container with the sidebar element itself
                    // to ensure it's a direct child of .page for proper flex behavior
                    sidebarElement.id = 'sidebar'; // Ensure ID for listeners
                    
                    // Add 'sidebar' class if missing, for setActivePage compatibility
                    if (!sidebarElement.classList.contains('sidebar')) {
                        sidebarElement.classList.add('sidebar');
                    }

                    container.replaceWith(sidebarElement);
                } else {
                    container.innerHTML = sidebarHTML; // Fallback if parsing fails
                }
            }
        } catch (error) {
            console.error('Error loading sidebar:', error);
            // Fallback: create sidebar inline if component fails to load
            this.createFallbackSidebar();
        }
    }

    static async loadNavbar() {
        try {
            const response = await fetch('../components/admin-navbar.html?v=' + new Date().getTime());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const navbarHTML = await response.text();
            const container = document.getElementById('navbarContainer');
            if (container) {
                const temp = document.createElement('div');
                temp.innerHTML = navbarHTML;
                const navbarElement = temp.firstElementChild;

                if (navbarElement) {
                    // Unwrap navbar for cleaner DOM
                    navbarElement.id = 'navbar'; // Tag it for reference
                    container.replaceWith(navbarElement);
                } else {
                    container.innerHTML = navbarHTML;
                }
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
                        <a class="nav-link" href="index.html" data-page="dashboard">
                            <i class="bi bi-speedometer2"></i> Bảng điều khiển
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="users.html" data-page="users">
                            <i class="bi bi-people"></i> Người dùng
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="admin-users.html" data-page="admin-users">
                            <i class="bi bi-shield-check"></i> Quản trị viên
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="products.html" data-page="products">
                            <i class="bi bi-joystick"></i> Trò chơi
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="orders.html" data-page="orders">
                            <i class="bi bi-cart3"></i> Đơn hàng
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="comments.html" data-page="comments">
                            <i class="bi bi-chat-square-text"></i> Đánh giá
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contacts.html" data-page="contacts">
                            <i class="bi bi-building"></i> Nhà phát hành
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="posts.html" data-page="posts">
                            <i class="bi bi-tags"></i> Danh mục
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="settings.html" data-page="settings">
                            <i class="bi bi-gear"></i> Cài đặt
                        </a>
                    </li>
                </ul>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <i class="bi bi-person-circle"></i>
                        <span id="adminUserName">Admin User</span>
                    </div>
                    <button class="btn btn-outline-light btn-sm" onclick="AdminUtils.logout()">
                        <i class="bi bi-box-arrow-right"></i> Đăng xuất
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
                                <li><h6 class="dropdown-header">Thông báo</h6></li>
                                <li><a class="dropdown-item" href="#"><i class="bi bi-person-plus text-primary"></i> 5 đăng ký mới</a></li>
                                <li><a class="dropdown-item" href="#"><i class="bi bi-check-circle text-success"></i> 3 game chờ duyệt</a></li>
                                <li><a class="dropdown-item" href="#"><i class="bi bi-chat text-info"></i> 12 đánh giá mới</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-center" href="#" onclick="AdminUtils.markAllNotificationsRead()">Đánh dấu tất cả là đã đọc</a></li>
                            </ul>
                        </div>
                        <button class="btn btn-outline-light" onclick="AdminUtils.logout()" title="Đăng xuất">
                            <i class="bi bi-box-arrow-right"></i> Đăng xuất
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
            'dashboard': 'Bảng điều khiển',
            'users': 'Quản lý người dùng',
            'admin-users': 'Quản lý quản trị viên',
            'products': 'Quản lý trò chơi',
            'orders': 'Quản lý đơn hàng',
            'comments': 'Quản lý đánh giá',
            'contacts': 'Quản lý nhà phát hành',
            'posts': 'Quản lý danh mục',
            'settings': 'Cài đặt hệ thống'
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
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-danger" id="confirmBtn">Xác nhận</button>
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