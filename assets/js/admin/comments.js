/**
 * Comments Management Logic
 */

const API_BASE_URL = 'http://localhost/BTL_LTW/BTL_LTW_BE';
let commentsList = [];

document.addEventListener('DOMContentLoaded', function() {
    renderComments();
    initializeEventListeners();
});

function initializeEventListeners() {
    document.getElementById('searchComments').addEventListener('input', renderCommentsTable);
}

async function renderComments() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/reviews`);
        const result = await response.json();
        
        if (result.status === 'success') {
            commentsList = result.data;
            renderCommentsTable();
        } else {
            Toast.error('Không thể tải danh sách bình luận');
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        Toast.error('Lỗi kết nối đến máy chủ');
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
                    ${item.uname || 'Unknown'}
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
            </td>
            <td>${AdminUtils.formatDate(item.review_time)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteComment(${item.customerid}, ${item.news_id})">
                    Xóa
                </button>
            </td>
        </tr>
    `).join('');

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Không tìm thấy bình luận nào</td></tr>`;
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
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    // Need a way to delete review via API
    // Endpoint: DELETE /admin/reviews?customerid=X&news_id=Y
    // Or POST body
    
    // I need to update index.php to handle DELETE /admin/reviews with params or body
    // Using body for delete is rare but possible. Query params usually better.
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/reviews?customerid=${customerid}&news_id=${news_id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.status === 'success') {
            Toast.success('Xóa bình luận thành công');
            renderComments();
        } else {
            Toast.error('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        Toast.error('Có lỗi xảy ra');
    }
}
