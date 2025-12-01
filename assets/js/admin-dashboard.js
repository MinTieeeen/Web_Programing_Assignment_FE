// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.initializeSidebar();
        this.initializeCharts();
        this.loadDashboardData();
        this.initializeEventListeners();
    }

    initializeSidebar() {
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

    initializeCharts() {
        this.initializeSalesChart();
        this.initializeCategoryChart();
    }

    initializeSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [12000, 15000, 18000, 14000, 22000, 25000, 28000, 24000, 26000, 30000, 32000, 35000],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    initializeCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Action', 'RPG', 'Strategy', 'Adventure', 'Simulation', 'Sports'],
                datasets: [{
                    data: [35, 25, 15, 12, 8, 5],
                    backgroundColor: [
                        '#007bff',
                        '#28a745',
                        '#ffc107',
                        '#17a2b8',
                        '#dc3545',
                        '#6f42c1'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    loadDashboardData() {
        // Simulate loading dashboard data
        this.updateStatsCards();
        this.loadRecentUsers();
        this.loadPendingGames();
    }

    updateStatsCards() {
        // Animate numbers
        this.animateNumber('totalUsers', 1245);
        this.animateNumber('totalGames', 456);
        this.animateNumber('activeOrders', 89);
        
        // Update revenue with currency formatting
        const revenueElement = document.getElementById('totalRevenue');
        if (revenueElement) {
            this.animateNumber('totalRevenue', 45678, '$');
        }
    }

    animateNumber(elementId, targetValue, prefix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        let currentValue = 0;
        const increment = targetValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = prefix + Math.floor(currentValue).toLocaleString();
        }, 30);
    }

    async loadRecentUsers() {
        const tableBody = document.querySelector('#recentUsersTable tbody');
        if (!tableBody) return;

        try {
            const response = await fetch('/Assignment/NextPlay/users');
            const result = await response.json();
            
            if (result.status === 'success' && result.data) {
                // Take the first 4 users for recent users display
                const users = result.data.slice(0, 4).map(user => ({
                    name: `${user.fname} ${user.lname}`,
                    email: user.email,
                    date: new Date(user.joinDate || Date.now()).toLocaleDateString('vi-VN'),
                    status: user.isActive ? 'Active' : 'Pending'
                }));

                tableBody.innerHTML = users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.date}</td>
                        <td><span class=\"badge status-${user.status.toLowerCase()}\">${user.status}</span></td>
                    </tr>
                `).join('');
            } else {
                throw new Error(result.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Error loading recent users:', error);
            // Fallback to empty state
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Không thể tải dữ liệu người dùng</td></tr>';
        }
    }

    async loadPendingGames() {
        const tableBody = document.querySelector('#pendingGamesTable tbody');
        if (!tableBody) return;

        try {
            const response = await fetch('/Assignment/NextPlay/games');
            const result = await response.json();
            
            if (result.status === 'success' && result.data) {
                // For demo purposes, show first 4 games as "pending"
                const games = result.data.slice(0, 4).map(game => ({
                    name: game.name || 'Unknown Game',
                    publisher: game.publisher || 'Unknown Publisher',
                    category: game.category || 'Uncategorized'
                }));

                tableBody.innerHTML = games.map(game => `
                    <tr>
                        <td>${game.name}</td>
                        <td>${game.publisher}</td>
                        <td>${game.category}</td>
                        <td>
                            <button class=\"btn btn-success btn-sm me-2\" onclick=\"approveGame('${game.name}')\">
                                <i class=\"bi bi-check\"></i>
                            </button>
                            <button class=\"btn btn-danger btn-sm\" onclick=\"rejectGame('${game.name}')\">
                                <i class=\"bi bi-x\"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } else {
                throw new Error(result.message || 'Failed to fetch games');
            }
        } catch (error) {
            console.error('Error loading pending games:', error);
            // Fallback to empty state
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Không thể tải dữ liệu game</td></tr>';
        }
    }

    initializeEventListeners() {
        // Add any additional event listeners here
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeTooltips();
        });
    }

    initializeTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle=\"tooltip\"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Utility Functions
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminAuth');
        sessionStorage.clear();
        window.location.href = '../user/login.html';
    }
}

function approveGame(gameName) {
    if (confirm(`Approve game: ${gameName}?`)) {
        // Simulate API call
        showToast(`Game \"${gameName}\" has been approved`, 'success');
        // Reload pending games
        dashboard.loadPendingGames();
    }
}

function rejectGame(gameName) {
    if (confirm(`Reject game: ${gameName}?`)) {
        // Simulate API call
        showToast(`Game \"${gameName}\" has been rejected`, 'warning');
        // Reload pending games
        dashboard.loadPendingGames();
    }
}

function showToast(message, type = 'info') {
    // Create toast notification
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class=\"d-flex\">
            <div class=\"toast-body\">${message}</div>
            <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

// Data formatting utilities
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatNumber(number) {
    return number.toLocaleString();
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new AdminDashboard();
});

// Export for other modules
window.AdminDashboard = AdminDashboard;
window.adminUtils = {
    logout,
    approveGame,
    rejectGame,
    showToast,
    formatCurrency,
    formatDate,
    formatNumber
};