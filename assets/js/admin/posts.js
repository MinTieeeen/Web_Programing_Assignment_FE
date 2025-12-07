/**
 * Categories Management Logic
 */

// Mock Data for Categories
let categories = [
    {
        id: 1,
        name: 'Hành động',
        description: 'Các trò chơi có nhịp độ nhanh, tập trung vào thử thách thể chất.',
        gamesCount: 156,
        status: 'active',
        createdDate: '2023-01-15',
        icon: 'bi-lightning-charge',
        color: '#d63939'
    },
    {
        id: 2,
        name: 'Nhập vai (RPG)',
        description: 'Các trò chơi mà người chơi điều khiển nhân vật trong một bối cảnh hư cấu.',
        gamesCount: 98,
        status: 'active',
        createdDate: '2023-02-20',
        icon: 'bi-person-badge',
        color: '#206bc4'
    },
    {
        id: 3,
        name: 'Chiến thuật',
        description: 'Các trò chơi tập trung vào kỹ năng tư duy và lập kế hoạch để giành chiến thắng.',
        gamesCount: 45,
        status: 'active',
        createdDate: '2023-03-10',
        icon: 'bi-graph-up-arrow',
        color: '#4299e1'
    },
    {
        id: 4,
        name: 'Thể thao',
        description: 'Mô phỏng các môn thể thao thực tế hoặc hư cấu.',
        gamesCount: 72,
        status: 'active',
        createdDate: '2023-04-05',
        icon: 'bi-trophy',
        color: '#fd7e14'
    },
    {
        id: 5,
        name: 'Phiêu lưu',
        description: 'Các trò chơi tập trung vào cốt truyện và khám phá.',
        gamesCount: 112,
        status: 'active',
        createdDate: '2023-05-12',
        icon: 'bi-compass',
        color: '#12a454'
    },
    {
        id: 6,
        name: 'Giải đố',
        description: 'Các trò chơi yêu cầu người chơi giải các câu đố logic.',
        gamesCount: 34,
        status: 'inactive',
        createdDate: '2023-06-25',
        icon: 'bi-puzzle',
        color: '#656d76'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderCategories();
    renderStats();
    initializeEventListeners();
});

function initializeEventListeners() {
    document.getElementById('searchCategory').addEventListener('input', renderCategories);
    document.getElementById('statusFilter').addEventListener('change', renderCategories);
}

// Render Stats
function renderStats() {
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('activeCategories').textContent = categories.filter(c => c.status === 'active').length;
    
    const totalGames = categories.reduce((sum, cat) => sum + cat.gamesCount, 0);
    document.getElementById('gamesInCategories').textContent = totalGames;
    
    const topCategory = categories.reduce((prev, current) => (prev.gamesCount > current.gamesCount) ? prev : current);
    document.getElementById('topCategory').textContent = topCategory ? topCategory.name : 'N/A';
}

// Render Categories Table
function renderCategories() {
    const tbody = document.querySelector('#categoriesTable tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('searchCategory').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm) || 
                            category.description.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || category.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    tbody.innerHTML = filteredCategories.map(category => `
        <tr>
            <td><span class="text-muted">#${category.id}</span></td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="avatar me-2" style="background-color: ${category.color}20; color: ${category.color}">
                        <i class="bi ${category.icon || 'bi-folder'}"></i>
                    </span>
                    <div class="flex-fill">
                        <div class="font-weight-medium">${category.name}</div>
                    </div>
                </div>
            </td>
            <td class="text-muted text-truncate" style="max-width: 200px;">
                ${category.description}
            </td>
            <td>
                ${category.gamesCount} trò chơi
            </td>
            <td>
                <span class="badge ${category.status === 'active' ? 'bg-success' : 'bg-secondary'} me-1"></span> 
                ${category.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
            </td>
            <td>${AdminUtils.formatDate(category.createdDate)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewCategory(${category.id})">
                    Chỉnh sửa
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(${category.id})">
                    Xóa
                </button>
            </td>
        </tr>
    `).join('');
    
    if (filteredCategories.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="empty">
                        <div class="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /><path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" /></svg>
                        </div>
                        <p class="empty-title">Không tìm thấy danh mục nào</p>
                        <p class="empty-subtitle text-muted">
                            Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn để tìm những gì bạn đang tìm kiếm.
                        </p>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Reset Filters
function resetFilters() {
    document.getElementById('searchCategory').value = '';
    document.getElementById('statusFilter').value = '';
    renderCategories();
}

// Save New Category
function saveCategory() {
    const name = document.getElementById('categoryName').value;
    const description = document.getElementById('categoryDescription').value;
    const icon = document.getElementById('categoryIcon').value;
    const color = document.getElementById('categoryColor').value;
    
    if (!name || !description) {
        alert('Vui lòng điền đầy đủ tên và mô tả danh mục.');
        return;
    }
    
    // Create new category
    const newCategory = {
        id: categories.length + 1,
        name: name,
        description: description,
        gamesCount: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        icon: icon || 'bi-folder',
        color: color
    };
    
    categories.unshift(newCategory);
    renderCategories();
    renderStats();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('addCategoryForm').reset();
    
    AdminUtils.showToast('Đã thêm danh mục mới thành công', 'success');
}

// View Category Details
function viewCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    document.getElementById('editCategoryId').value = category.id;
    document.getElementById('editCategoryName').value = category.name;
    document.getElementById('editCategoryDescription').value = category.description;
    document.getElementById('editCategoryIcon').value = category.icon;
    document.getElementById('editCategoryColor').value = category.color;
    document.getElementById('editCategoryStatus').value = category.status;
    
    const modal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
    modal.show();
}

// Update Category
function updateCategory() {
    const id = parseInt(document.getElementById('editCategoryId').value);
    const category = categories.find(c => c.id === id);
    
    if (!category) return;
    
    category.name = document.getElementById('editCategoryName').value;
    category.description = document.getElementById('editCategoryDescription').value;
    category.icon = document.getElementById('editCategoryIcon').value;
    category.color = document.getElementById('editCategoryColor').value;
    category.status = document.getElementById('editCategoryStatus').value;
    
    renderCategories();
    renderStats();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
    modal.hide();
    
    AdminUtils.showToast('Đã cập nhật danh mục thành công', 'success');
}

// Delete Category
function deleteCategory(id) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.')) {
        categories = categories.filter(c => c.id !== id);
        renderCategories();
        renderStats();
        AdminUtils.showToast('Đã xóa danh mục thành công', 'success');
    }
}
