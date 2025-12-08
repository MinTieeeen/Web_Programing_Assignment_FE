/**
 * News & Comments Management Logic
 * v5: Added Lock User Modal and improved Toasts
 */

const API_BASE_URL = 'http://localhost/BTL_LTW/BTL_LTW_BE';
let newsList = [];
let commentsList = [];

document.addEventListener('DOMContentLoaded', function() {
    renderNews();
    renderComments();
    initializeEventListeners();
});

function initializeEventListeners() {
    const searchNews = document.getElementById('searchNews');
    if(searchNews) searchNews.addEventListener('input', renderNewsTable);

    const searchComments = document.getElementById('searchComments');
    if(searchComments) searchComments.addEventListener('input', renderCommentsTable);
}

// ================= NEWS LOGIC =================

async function renderNews() {
    try {
        const res = await fetch(`${API_BASE_URL}/news`);
        const result = await res.json();
        
        if (result.status === 'success') {
            newsList = result.data;
            renderStats();
            renderNewsTable();
        } else {
            Toast.error('Không thể tải danh sách tin tức');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function renderStats() {
    const el = document.getElementById('totalNews');
    if(el) el.textContent = newsList.length;
}

function renderNewsTable() {
    const tbody = document.querySelector('#newsTable tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('searchNews').value.toLowerCase();

    const filteredNews = newsList.filter(item => {
        return item.title.toLowerCase().includes(searchTerm) || 
               item.category.toLowerCase().includes(searchTerm) ||
               item.source.toLowerCase().includes(searchTerm);
    });

    tbody.innerHTML = filteredNews.map(item => `
        <tr>
            <td><span class="text-muted">#${item.id}</span></td>
            <td>
                <span class="avatar" style="background-image: url(${item.thumbnail || '../assets/images/default-news.jpg'})"></span>
            </td>
            <td>
                <div class="font-weight-medium text-wrap" style="max-width: 300px;">${item.title}</div>
            </td>
            <td>${item.category}</td>
            <td>${item.source}</td>
            <td>
                <span class="badge bg-blue-lt">${item.views} views</span>
            </td>
            <td>${AdminUtils.formatDate(item.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewNews(${item.id})">Sửa</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteNews(${item.id})">Xóa</button>
            </td>
        </tr>
    `).join('');

    if (filteredNews.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Không tìm thấy bài viết nào</td></tr>`;
    }
}

window.saveNews = async function() {
    const title = document.getElementById('newsTitle').value;
    const category = document.getElementById('newsCategory').value;
    const source = document.getElementById('newsSource').value;
    const thumbnail = document.getElementById('newsThumbnail').value;
    const content = document.getElementById('newsContent').value;

    if (!title || !content) {
        Toast.warning('Vui lòng điền tiêu đề và nội dung');
        return;
    }

    const payload = {
        title, category, source, thumbnail, content,
        author_id: 1 // TODO: Get actual admin ID
    };

    try {
        const response = await fetch(`${API_BASE_URL}/news`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === 'success') {
            Toast.success('Thêm tin tức thành công');
            bootstrap.Modal.getInstance(document.getElementById('addNewsModal')).hide();
            document.getElementById('addNewsForm').reset();
            renderNews();
        } else {
            Toast.error('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        Toast.error('Có lỗi xảy ra');
    }
}

window.viewNews = function(id) {
    const item = newsList.find(n => n.id == id);
    if (!item) return;

    document.getElementById('editNewsId').value = item.id;
    document.getElementById('editNewsTitle').value = item.title;
    document.getElementById('editNewsCategory').value = item.category;
    document.getElementById('editNewsSource').value = item.source;
    document.getElementById('editNewsThumbnail').value = item.thumbnail;
    document.getElementById('editNewsContent').value = item.content;

    new bootstrap.Modal(document.getElementById('editNewsModal')).show();
}

window.updateNews = async function() {
    const id = document.getElementById('editNewsId').value;
    const payload = {
        title: document.getElementById('editNewsTitle').value,
        category: document.getElementById('editNewsCategory').value,
        source: document.getElementById('editNewsSource').value,
        thumbnail: document.getElementById('editNewsThumbnail').value,
        content: document.getElementById('editNewsContent').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === 'success') {
            Toast.success('Cập nhật tin tức thành công');
            bootstrap.Modal.getInstance(document.getElementById('editNewsModal')).hide();
            renderNews();
        } else {
            Toast.error('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        Toast.error('Có lỗi xảy ra');
    }
}

window.deleteNews = async function(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa tin tức này?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.status === 'success') {
            Toast.success('Xóa tin tức thành công');
            renderNews();
        } else {
            Toast.error('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        Toast.error('Có lỗi xảy ra');
    }
}

// ================= COMMENTS & LOCK USER LOGIC =================

async function renderComments() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/reviews`);
        const result = await response.json();
        
        if (result.status === 'success') {
            commentsList = result.data;
            renderCommentsTable();
        } else {
            Toast.error('Không thể tải danh sách đánh giá');
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

function renderCommentsTable() {
    const tbody = document.querySelector('#commentsTable tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('searchComments').value.toLowerCase();

    const filtered = commentsList.filter(item => {
        return (item.content && item.content.toLowerCase().includes(searchTerm)) || 
               (item.uname && item.uname.toLowerCase().includes(searchTerm)) ||
               (item.news_title && item.news_title.toLowerCase().includes(searchTerm));
    });

    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <span class="avatar avatar-xs me-2" style="background-image: url(${item.avatar || '../assets/images/default-avatar.png'})"></span>
                    <div class="d-flex flex-column">
                        <div>${item.uname || 'Unknown'}</div>
                        <div class="text-muted small">ID: ${item.customerid}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="text-truncate" style="max-width: 200px;" title="${item.news_title}">
                    ${item.news_title || 'Unknown Post'}
                </div>
            </td>
            <td>
                ${renderStars(item.rating)}
            </td>
            <td>
                <div class="text-wrap" style="max-width: 300px;">${item.content}</div>
                ${item.is_locked == 1 ? '<span class="badge bg-danger-lt mt-1">Tài khoản bị khóa</span>' : ''}
            </td>
            <td>${AdminUtils.formatDate(item.review_time)}</td>
            <td>
                <div class="btn-list flex-nowrap">
                    <button class="btn btn-sm ${item.is_locked == 1 ? 'btn-warning' : 'btn-outline-warning'}" 
                            onclick="initToggleLock(${item.customerid}, ${!(item.is_locked == 1)}, '${item.uname ? item.uname.replace(/'/g, "\\'") : ""}')" 
                            title="${item.is_locked == 1 ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-lock" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /></svg>
                        ${item.is_locked == 1 ? 'Mở khóa' : 'Khóa'}
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteComment(${item.customerid}, ${item.news_id})">
                        Xóa
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Không tìm thấy đánh giá nào</td></tr>`;
    }
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="bi bi-star-fill text-warning"></i>';
        } else {
            stars += '<i class="bi bi-star text-muted"></i>';
        }
    }
    return stars;
}

window.deleteComment = async function(customerid, news_id) {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/reviews?customerid=${customerid}&news_id=${news_id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.status === 'success') {
            Toast.success('Xóa đánh giá thành công');
            renderComments();
        } else {
            Toast.error('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        Toast.error('Có lỗi xảy ra');
    }
}

// Lock User Logic (Match users.js)
window.initToggleLock = function(userId, shouldLock, username) {
    if (!shouldLock) {
         // If unlocking, just confirm
         if (confirm(`Bạn có chắc muốn mở khóa tài khoản "${username}"?`)) {
             performToggleLock(userId, false, null);
         }
         return;
    }

    // If locking, show modal
    document.getElementById('lockUserId').value = userId;
    document.getElementById('lockTargetUsername').textContent = username;
    document.getElementById('confirmLock').checked = false;
    document.getElementById('lockDuration').value = 'permanent';
    
    new bootstrap.Modal(document.getElementById('lockUserModal')).show();
}

window.submitLockUser = function() {
    const userId = document.getElementById('lockUserId').value;
    const duration = document.getElementById('lockDuration').value;
    const isConfirmed = document.getElementById('confirmLock').checked;

    if (!isConfirmed) {
        Toast.warning('Vui lòng xác nhận khoá tài khoản');
        return;
    }

    performToggleLock(userId, true, duration);
    bootstrap.Modal.getInstance(document.getElementById('lockUserModal')).hide();
}

async function performToggleLock(userId, shouldLock, duration) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/toggle-lock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization header if needed, assuming cookie-based or handled
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
            renderComments(); // Refresh table to update status
        } else {
            Toast.error('Thao tác thất bại: ' + result.message);
        }
    } catch (error) {
        console.error('Toggle lock error:', error);
        Toast.error('Lỗi: ' + error.message);
    }
}
