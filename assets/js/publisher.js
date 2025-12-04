// Publisher Dashboard Logic

document.addEventListener('DOMContentLoaded', function () {
    // Mock Data
    const mockStats = {
        totalGames: 12,
        totalPurchases: 1543,
        totalRevenue: 45290,
        avgRating: 4.6
    };

    const mockFeedback = [
        { user: 'Gamer123', game: 'Cyber Adventure 2077', rating: 5, content: 'Amazing graphics and gameplay!', date: '2025-12-01' },
        { user: 'ProPlayer', game: 'Space Explorer', rating: 4, content: 'Good, but needs more levels.', date: '2025-11-30' },
        { user: 'NoobMaster', game: 'Cyber Adventure 2077', rating: 5, content: 'Best game ever!', date: '2025-11-28' }
    ];

    // Mock Games Data
    const mockGames = [
        { id: 101, name: 'Cyber Adventure 2077', version: '1.0', price: 29.99, category: 'Action', rating: 4.8, sales: 1200, status: 'active', thumbnail: 'https://via.placeholder.com/50' },
        { id: 102, name: 'Space Explorer', version: '1.2', price: 19.99, category: 'Adventure', rating: 4.2, sales: 850, status: 'active', thumbnail: 'https://via.placeholder.com/50' },
        { id: 103, name: 'Mystery Mansion', version: '2.0', price: 14.99, category: 'Puzzle', rating: 4.5, sales: 500, status: 'inactive', thumbnail: 'https://via.placeholder.com/50' }
    ];

    // Initialize Dashboard if on dashboard page
    if (document.querySelector('.stats-grid')) {
        initDashboard(mockStats, mockFeedback);
    }

    // Initialize Games Page
    if (document.getElementById('games-table-body')) {
        initGamesPage(mockGames);
    }

    // Initialize Reviews Page
    if (document.getElementById('reviews-container')) {
        initReviewsPage(mockFeedback);
    }

    // Initialize Revenue Page
    if (document.getElementById('revenueTrendChart')) {
        initRevenuePage();
    }
});

// ... (previous functions) ...

function initRevenuePage() {
    // Revenue Trend Chart
    const ctxTrend = document.getElementById('revenueTrendChart');
    new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [1200, 1900, 3000, 5000, 2300, 3400, 4500],
                borderColor: '#00b894',
                backgroundColor: 'rgba(0, 184, 148, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Revenue by Game Chart
    const ctxGame = document.getElementById('revenueByGameChart');
    new Chart(ctxGame, {
        type: 'doughnut',
        data: {
            labels: ['Cyber Adventure 2077', 'Space Explorer', 'Mystery Mansion', 'Others'],
            datasets: [{
                data: [55, 25, 15, 5],
                backgroundColor: [
                    '#6c5ce7',
                    '#a29bfe',
                    '#fdcb6e',
                    '#b2bec3'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#b2bec3' }
                }
            }
        }
    });
}

// ... (previous functions) ...

function initReviewsPage(feedback) {
    const container = document.getElementById('reviews-container');
    const filter = document.getElementById('gameFilter');

    window.renderReviews = function (type = 'reviews') {
        const selectedGame = filter.value;
        const filtered = feedback.filter(item =>
            (selectedGame === 'all' || item.game === selectedGame)
        );

        container.innerHTML = filtered.map(item => `
            <div class="review-card">
                <div class="review-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 30px; height: 30px; background: #a29bfe; border-radius: 50%;"></div>
                        <div>
                            <div style="font-weight: bold;">${item.user}</div>
                            <div style="font-size: 12px; color: #b2bec3;">${item.game}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="star-rating">
                            ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                        </div>
                        <div style="font-size: 12px; color: #b2bec3; margin-top: 5px;">${item.date}</div>
                    </div>
                </div>
                <p style="margin-top: 10px; color: #f5f6fa; line-height: 1.5;">
                    ${item.content}
                </p>
                ${type === 'feedback' ? '<button class="btn btn-sm btn-primary" style="margin-top: 10px;">Reply</button>' : ''}
            </div>
        `).join('');

        if (filtered.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #b2bec3; padding: 40px;">No reviews found.</div>';
        }
    };

    window.switchTab = function (tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        renderReviews(tab);
    };

    window.filterReviews = function () {
        // Determine active tab
        const activeTab = document.querySelector('.tab-btn.active').textContent.includes('Feedback') ? 'feedback' : 'reviews';
        renderReviews(activeTab);
    };

    renderReviews('reviews');
}

function initDashboard(stats, feedback) {
    // Update Stats
    document.getElementById('total-games').textContent = stats.totalGames;
    document.getElementById('total-purchases').textContent = stats.totalPurchases.toLocaleString();
    document.getElementById('total-revenue').textContent = '$' + stats.totalRevenue.toLocaleString();
    document.getElementById('avg-rating').textContent = stats.avgRating;

    // Render Recent Feedback
    const feedbackList = document.getElementById('recent-feedback-list');
    if (feedbackList) {
        feedbackList.innerHTML = feedback.map(item => `
            <div class="feedback-item">
                <div class="feedback-header">
                    <strong>${item.user}</strong>
                    <span class="text-muted" style="font-size: 12px;">${item.date}</span>
                </div>
                <div class="mb-2">
                    <span class="badge" style="background: rgba(108, 92, 231, 0.2); color: #a29bfe; padding: 2px 8px; border-radius: 4px; font-size: 11px;">${item.game}</span>
                </div>
                <div class="star-rating">
                    ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                </div>
                <p class="mt-2" style="margin-bottom: 0; color: #b2bec3;">${item.content}</p>
            </div>
        `).join('');
    }

    // Render Charts (Mocked with Chart.js)
    initCharts();
}

function initCharts() {
    const ctxRevenue = document.getElementById('revenueChart');
    if (ctxRevenue) {
        new Chart(ctxRevenue, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [1200, 1900, 3000, 5000, 2300, 3400, 4500],
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

function initGamesPage(games) {
    const tableBody = document.getElementById('games-table-body');

    function renderGames() {
        tableBody.innerHTML = games.map(game => `
            <tr>
                <td><img src="${game.thumbnail}" alt="${game.name}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;"></td>
                <td>
                    <div style="font-weight: bold;">${game.name}</div>
                    <div style="font-size: 12px; color: #b2bec3;">v${game.version}</div>
                </td>
                <td>${game.category}</td>
                <td>$${game.price}</td>
                <td>${game.sales}</td>
                <td><span class="status-badge ${game.status === 'active' ? 'status-active' : 'status-inactive'}">${game.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openGameModal(${game.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteGame(${game.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    renderGames();

    // Modal Logic
    window.openGameModal = function (gameId = null) {
        const modal = document.getElementById('gameModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('gameForm');

        if (gameId) {
            const game = games.find(g => g.id === gameId);
            modalTitle.textContent = 'Edit Game';
            // Populate form (simplified)
            form.name.value = game.name;
            form.price.value = game.price;
        } else {
            modalTitle.textContent = 'Upload New Game';
            form.reset();
        }

        modal.style.display = 'flex';
    };

    window.closeGameModal = function () {
        document.getElementById('gameModal').style.display = 'none';
    };

    window.deleteGame = function (id) {
        if (confirm('Are you sure you want to delete this game?')) {
            alert('Game deleted (mock)');
        }
    };
}
