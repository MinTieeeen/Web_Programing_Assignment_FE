/**
 * Reviews & Comments Management Logic
 */

// Mock Data for Reviews
let reviews = [
    {
        id: 101,
        customerName: 'Nguyễn Văn A',
        customerAvatar: '',
        gameName: 'Elden Ring',
        gameImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg',
        rating: 5,
        comment: 'Game tuyệt vời nhất tôi từng chơi! Đồ họa đẹp, cốt truyện hấp dẫn.',
        date: '2023-05-20',
        status: 'approved'
    },
    {
        id: 102,
        customerName: 'Trần Thị B',
        customerAvatar: '',
        gameName: 'FIFA 23',
        gameImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1811260/header.jpg',
        rating: 3,
        comment: 'Gameplay ổn nhưng server hay bị lag. Cần cải thiện thêm.',
        date: '2023-05-21',
        status: 'pending'
    },
    {
        id: 103,
        customerName: 'Lê Văn C',
        customerAvatar: '',
        gameName: 'God of War Ragnarök',
        gameImage: 'https://image.api.playstation.com/vulcan/ap/disc/2560/4E/4E19717D1674482590462701198516109968819545.png',
        rating: 5,
        comment: 'Kratos quá ngầu. 10/10 không có nhưng.',
        date: '2023-05-22',
        status: 'approved'
    },
    {
        id: 104,
        customerName: 'Phạm Thị D',
        customerAvatar: '',
        gameName: 'Cyberpunk 2077',
        gameImage: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
        rating: 1,
        comment: 'Spam comment to test filter. Spam spam spam.',
        date: '2023-05-23',
        status: 'flagged'
    },
    {
        id: 105,
        customerName: 'Hoàng Văn E',
        customerAvatar: '',
        gameName: 'The Witcher 3',
        gameImage: 'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg',
        rating: 4,
        comment: 'Cốt truyện hay nhưng combat hơi chán.',
        date: '2023-05-24',
        status: 'approved'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadGamesFilter();
    renderReviews();
    renderStats();
    initializeEventListeners();
});

function initializeEventListeners() {
    document.getElementById('searchReviews').addEventListener('input', renderReviews);
    document.getElementById('ratingFilter').addEventListener('change', renderReviews);
    document.getElementById('gameFilter').addEventListener('change', renderReviews);
    document.getElementById('statusFilter').addEventListener('change', renderReviews);
    document.getElementById('dateFilter').addEventListener('change', renderReviews);
    
    // Select All functionality
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.review-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
    });
}

// Mock Load Games Filter
function loadGamesFilter() {
    const gameFilter = document.getElementById('gameFilter');
    const uniqueGames = [...new Set(reviews.map(r => r.gameName))];
    
    uniqueGames.forEach(game => {
        const option = document.createElement('option');
        option.value = game;
        option.textContent = game;
        gameFilter.appendChild(option);
    });
}

// Render Stats
function renderStats() {
    document.getElementById('totalReviews').textContent = reviews.length;
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    document.getElementById('averageRating').textContent = reviews.length ? avgRating.toFixed(1) + '/5.0' : '0.0/5.0';
    
    document.getElementById('flaggedReviews').textContent = reviews.filter(r => r.status === 'flagged').length;
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('todayReviews').textContent = reviews.filter(r => r.date === today).length;
}

// Render Reviews Table
function renderReviews() {
    const tbody = document.querySelector('#reviewsTable tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('searchReviews').value.toLowerCase();
    const ratingFilter = document.getElementById('ratingFilter').value;
    const gameFilter = document.getElementById('gameFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.customerName.toLowerCase().includes(searchTerm) || 
                            review.comment.toLowerCase().includes(searchTerm);
        const matchesRating = !ratingFilter || review.rating.toString() === ratingFilter;
        const matchesGame = !gameFilter || review.gameName === gameFilter;
        const matchesStatus = !statusFilter || review.status === statusFilter;
        const matchesDate = !dateFilter || review.date === dateFilter;

        return matchesSearch && matchesRating && matchesGame && matchesStatus && matchesDate;
    });

    tbody.innerHTML = filteredReviews.map(review => `
        <tr>
            <td>
                <input type="checkbox" class="form-check-input review-checkbox" value="${review.id}">
            </td>
            <td><span class="text-muted">#${review.id}</span></td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="avatar me-2 rounded-circle" style="background-image: url(${review.customerAvatar || '../assets/img/default-avatar.png'})">
                        ${!review.customerAvatar ? review.customerName.charAt(0) : ''}
                    </span>
                    <div class="flex-fill">
                        <div class="font-weight-medium">${review.customerName}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="avatar me-2 rounded" style="background-image: url(${review.gameImage})"></span>
                    <div>${review.gameName}</div>
                </div>
            </td>
            <td>
                ${renderStars(review.rating)}
            </td>
            <td class="text-muted text-truncate" style="max-width: 200px;">
                ${review.comment}
            </td>
            <td>${AdminUtils.formatDate(review.date)}</td>
            <td>
                ${renderStatusBadge(review.status)}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewReviewDetails(${review.id})">
                    Chi tiết
                </button>
            </td>
        </tr>
    `).join('');
    
    if (filteredReviews.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    <div class="empty">
                        <div class="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /><path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" /></svg>
                        </div>
                        <p class="empty-title">Không tìm thấy đánh giá nào</p>
                        <p class="empty-subtitle text-muted">
                            Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn để tìm những gì bạn đang tìm kiếm.
                        </p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    // Setup pagination (mock)
    setupPagination(filteredReviews.length);
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<svg xmlns="http://www.w3.org/2000/svg" class="icon text-warning" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>';
        } else {
            stars += '<svg xmlns="http://www.w3.org/2000/svg" class="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>';
        }
    }
    return `<div>${stars}</div>`;
}

function renderStatusBadge(status) {
    const statusMap = {
        'approved': { class: 'bg-success', label: 'Đã duyệt' },
        'pending': { class: 'bg-warning', label: 'Chờ duyệt' },
        'flagged': { class: 'bg-danger', label: 'Bị báo cáo' }
    };
    const s = statusMap[status] || { class: 'bg-secondary', label: status };
    return `<span class="badge ${s.class} me-1"></span> ${s.label}`;
}

function setupPagination(totalItems) {
    const pagination = document.getElementById('reviewsPagination');
    pagination.innerHTML = `
        <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
                trước
            </a>
        </li>
        <li class="page-item active"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
            <a class="page-link" href="#">
                sau
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
            </a>
        </li>
    `;
}

// Reset Filters
function resetFilters() {
    document.getElementById('searchReviews').value = '';
    document.getElementById('ratingFilter').value = '';
    document.getElementById('gameFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFilter').value = '';
    renderReviews();
}

// View Review Details
let currentReviewId = null;

function viewReviewDetails(id) {
    currentReviewId = id;
    const review = reviews.find(r => r.id === id);
    if (!review) return;
    
    const content = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Khách hàng</label>
                <div class="d-flex align-items-center">
                    <span class="avatar me-2 rounded-circle" style="background-image: url(${review.customerAvatar || '../assets/img/default-avatar.png'})">
                        ${!review.customerAvatar ? review.customerName.charAt(0) : ''}
                    </span>
                    <div>
                        <div class="font-weight-medium">${review.customerName}</div>
                        <div class="text-muted small">ID: #${review.id}</div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Trò chơi được đánh giá</label>
                <div class="d-flex align-items-center">
                    <span class="avatar me-2 rounded" style="background-image: url(${review.gameImage})"></span>
                    <div class="font-weight-medium">${review.gameName}</div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Xếp hạng</label>
                ${renderStars(review.rating)}
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label text-muted">Ngày đánh giá</label>
                <div>${AdminUtils.formatDate(review.date)}</div>
            </div>
            <div class="col-12 mb-3">
                <label class="form-label text-muted">Nội dung đánh giá</label>
                <div class="p-3 bg-light rounded text-dark">
                    ${review.comment}
                </div>
            </div>
            <div class="col-12">
                <label class="form-label text-muted">Trạng thái hiện tại</label>
                ${renderStatusBadge(review.status)}
            </div>
        </div>
    `;
    
    document.getElementById('reviewDetailsContent').innerHTML = content;
    
    // Update buttons based on status
    const approveBtn = document.getElementById('approveReviewBtn');
    const flagBtn = document.getElementById('flagReviewBtn');
    
    if (review.status === 'approved') {
        approveBtn.style.display = 'none';
        flagBtn.style.display = 'inline-block';
    } else if (review.status === 'flagged') {
        approveBtn.style.display = 'inline-block';
        flagBtn.style.display = 'none';
    } else {
        approveBtn.style.display = 'inline-block';
        flagBtn.style.display = 'inline-block';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('reviewDetailsModal'));
    modal.show();
}

// Approve Review
function approveReview() {
    if (!currentReviewId) return;
    
    const review = reviews.find(r => r.id === currentReviewId);
    if (review) {
        review.status = 'approved';
        renderReviews();
        renderStats();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('reviewDetailsModal'));
        modal.hide();
        
        AdminUtils.showToast('Đã duyệt đánh giá thành công', 'success');
    }
}

// Flag Review
function flagReview() {
    if (!currentReviewId) return;
    
    const review = reviews.find(r => r.id === currentReviewId);
    if (review) {
        review.status = 'flagged';
        renderReviews();
        renderStats();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('reviewDetailsModal'));
        modal.hide();
        
        AdminUtils.showToast('Đã báo cáo đánh giá thành công', 'warning');
    }
}

// Delete Review (Single)
function deleteReview() {
    if (!currentReviewId) return;
    
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.')) {
        reviews = reviews.filter(r => r.id !== currentReviewId);
        renderReviews();
        renderStats();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('reviewDetailsModal'));
        modal.hide();
        
        AdminUtils.showToast('Đã xóa đánh giá thành công', 'success');
    }
}

// Bulk Delete
function bulkDelete() {
    const selectedIds = Array.from(document.querySelectorAll('.review-checkbox:checked')).map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) {
        AdminUtils.showToast('Vui lòng chọn ít nhất một đánh giá để xóa', 'warning');
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} đánh giá đã chọn?`)) {
        reviews = reviews.filter(r => !selectedIds.includes(r.id));
        renderReviews();
        renderStats();
        document.getElementById('selectAll').checked = false;
        AdminUtils.showToast(`Đã xóa ${selectedIds.length} đánh giá thành công`, 'success');
    }
}

// Export Reviews
function exportReviews() {
    AdminUtils.showToast('Đang tạo báo cáo đánh giá...', 'info');
    setTimeout(() => {
        AdminUtils.showToast('Đã xuất dữ liệu đánh giá thành công (CSV)', 'success');
    }, 1500);
}
