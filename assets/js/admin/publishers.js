/**
 * Publishers Management Logic
 */

// Mock Data for Publishers
let publishers = [
    {
        id: 1,
        name: 'Electronic Arts (EA)',
        location: 'usa',
        taxCode: 'US-987654321',
        website: 'https://www.ea.com',
        description: 'Một trong những công ty game lớn nhất thế giới.',
        gamesCount: 42,
        status: 'active',
        joinedDate: '2020-01-15',
        contactEmail: 'contact@ea.com',
        contactPhone: '+1 650-628-1500'
    },
    {
        id: 2,
        name: 'Ubisoft',
        location: 'france', // Will map to text
        taxCode: 'FR-123456789',
        website: 'https://www.ubisoft.com',
        description: 'Nổi tiếng với Assassin\'s Creed và Far Cry.',
        gamesCount: 35,
        status: 'active',
        joinedDate: '2020-03-20',
        contactEmail: 'partners@ubisoft.com',
        contactPhone: '+33 1 48 18 50 00'
    },
    {
        id: 3,
        name: 'Nintendo',
        location: 'japan',
        taxCode: 'JP-456789123',
        website: 'https://www.nintendo.com',
        description: 'Huyền thoại của ngành công nghiệp game.',
        gamesCount: 28,
        status: 'active',
        joinedDate: '2019-11-10',
        contactEmail: 'business@nintendo.co.jp',
        contactPhone: '+81 75-662-9600'
    },
    {
        id: 4,
        name: 'VNG Corporation',
        location: 'vietnam',
        taxCode: 'VN-0102030405',
        website: 'https://www.vng.com.vn',
        description: 'Kỳ lân công nghệ của Việt Nam.',
        gamesCount: 15,
        status: 'active',
        joinedDate: '2021-05-05',
        contactEmail: 'publishing@vng.com.vn',
        contactPhone: '+84 28 3962 3888'
    },
    {
        id: 5,
        name: 'Indie Game Studio X',
        location: 'germany',
        taxCode: 'DE-555666777',
        website: 'https://indiestudiox.com',
        description: 'Studio game độc lập mới nổi.',
        gamesCount: 2,
        status: 'pending',
        joinedDate: '2023-06-01',
        contactEmail: 'hello@indiestudiox.com',
        contactPhone: '+49 30 1234567'
    },
    {
        id: 6,
        name: 'Old Games Ltd',
        location: 'uk',
        taxCode: 'UK-999888777',
        website: 'https://oldgames.uk',
        description: 'Chuyên phát hành lại các game cổ điển.',
        gamesCount: 10,
        status: 'inactive',
        joinedDate: '2018-08-15',
        contactEmail: 'info@oldgames.uk',
        contactPhone: '+44 20 7123 4567'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderPublishers();
    renderStats();
    initializeEventListeners();
});

function initializeEventListeners() {
    document.getElementById('searchPublisher').addEventListener('input', renderPublishers);
    document.getElementById('locationFilter').addEventListener('change', renderPublishers);
    document.getElementById('statusFilter').addEventListener('change', renderPublishers);
}

// Render Stats
function renderStats() {
    document.getElementById('totalPublishers').textContent = publishers.length;
    document.getElementById('activePublishers').textContent = publishers.filter(p => p.status === 'active').length;
    
    const totalGames = publishers.reduce((sum, p) => sum + p.gamesCount, 0);
    document.getElementById('totalPublishedGames').textContent = totalGames;
    
    document.getElementById('pendingPublishers').textContent = publishers.filter(p => p.status === 'pending').length;
}

// Render Publishers Table
function renderPublishers() {
    const tbody = document.querySelector('#publishersTable tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('searchPublisher').value.toLowerCase();
    const locationFilter = document.getElementById('locationFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredPublishers = publishers.filter(publisher => {
        const matchesSearch = publisher.name.toLowerCase().includes(searchTerm) || 
                            publisher.taxCode.toLowerCase().includes(searchTerm);
        const matchesLocation = !locationFilter || publisher.location === locationFilter;
        const matchesStatus = !statusFilter || publisher.status === statusFilter;
        return matchesSearch && matchesLocation && matchesStatus;
    });

    tbody.innerHTML = filteredPublishers.map(publisher => `
        <tr>
            <td><span class="text-muted">#${publisher.id}</span></td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="avatar me-2 rounded-circle bg-blue-lt">
                        ${getInitials(publisher.name)}
                    </span>
                    <div class="flex-fill">
                        <div class="font-weight-medium">${publisher.name}</div>
                        <div class="text-muted"><a href="mailto:${publisher.contactEmail}" class="text-reset">${publisher.contactEmail}</a></div>
                    </div>
                </div>
            </td>
            <td>
                ${getLocationLabel(publisher.location)}
            </td>
            <td>${publisher.taxCode}</td>
            <td>
                ${publisher.gamesCount}
            </td>
            <td>
                ${renderStatusBadge(publisher.status)}
            </td>
            <td>${AdminUtils.formatDate(publisher.joinedDate)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewPublisher(${publisher.id})">
                    Chỉnh sửa
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePublisher(${publisher.id})">
                    Xóa
                </button>
            </td>
        </tr>
    `).join('');
    
    if (filteredPublishers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="empty">
                        <div class="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /><path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" /></svg>
                        </div>
                        <p class="empty-title">Không tìm thấy nhà phát hành nào</p>
                        <p class="empty-subtitle text-muted">
                            Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn để tìm những gì bạn đang tìm kiếm.
                        </p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    setupPagination(filteredPublishers.length);
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getLocationLabel(location) {
    const locations = {
        'usa': 'Hoa Kỳ 🇺🇸',
        'canada': 'Canada 🇨y',
        'uk': 'Anh 🇬🇧',
        'japan': 'Nhật Bản 🇯🇵',
        'germany': 'Đức 🇩🇪',
        'vietnam': 'Việt Nam 🇻🇳',
        'france': 'Pháp 🇫🇷'
    };
    return locations[location] || location;
}

function renderStatusBadge(status) {
    const statusMap = {
        'active': { class: 'bg-success', label: 'Hoạt động' },
        'inactive': { class: 'bg-secondary', label: 'Ngừng hoạt động' },
        'pending': { class: 'bg-warning', label: 'Chờ duyệt' }
    };
    const s = statusMap[status] || { class: 'bg-secondary', label: status };
    return `<span class="badge ${s.class} me-1"></span> ${s.label}`;
}

function setupPagination(totalItems) {
    // Mock pagination similar to other pages
    const pagination = document.getElementById('publishersPagination');
    if (!pagination) return;
    
    pagination.innerHTML = `
        <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
                trước
            </a>
        </li>
        <li class="page-item active"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
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
    document.getElementById('searchPublisher').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('statusFilter').value = '';
    renderPublishers();
}

// Save New Publisher
function savePublisher() {
    const name = document.getElementById('publisherName').value;
    const taxCode = document.getElementById('taxCode').value;
    const location = document.getElementById('location').value;
    const email = document.getElementById('contactEmail').value;
    
    if (!name || !taxCode || !location || !email) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc.');
        return;
    }
    
    // Create new publisher
    const newPublisher = {
        id: publishers.length + 1,
        name: name,
        location: location.toLowerCase(),
        taxCode: taxCode,
        website: document.getElementById('website').value,
        description: document.getElementById('description').value,
        gamesCount: 0,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        contactEmail: email,
        contactPhone: document.getElementById('contactPhone').value
    };
    
    publishers.unshift(newPublisher);
    renderPublishers();
    renderStats();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPublisherModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('addPublisherForm').reset();
    
    AdminUtils.showToast('Đã thêm nhà phát hành mới thành công', 'success');
}

// View Publisher (Edit)
function viewPublisher(id) {
    const publisher = publishers.find(p => p.id === id);
    if (!publisher) return;
    
    document.getElementById('editPublisherId').value = publisher.id;
    document.getElementById('editPublisherName').value = publisher.name;
    document.getElementById('editTaxCode').value = publisher.taxCode;
    document.getElementById('editLocation').value = publisher.location;
    document.getElementById('editWebsite').value = publisher.website;
    document.getElementById('editDescription').value = publisher.description;
    document.getElementById('editContactEmail').value = publisher.contactEmail;
    document.getElementById('editContactPhone').value = publisher.contactPhone;
    document.getElementById('editStatus').value = publisher.status;
    
    const modal = new bootstrap.Modal(document.getElementById('editPublisherModal'));
    modal.show();
}

// Update Publisher
function updatePublisher() {
    const id = parseInt(document.getElementById('editPublisherId').value);
    const publisher = publishers.find(p => p.id === id);
    
    if (!publisher) return;
    
    publisher.name = document.getElementById('editPublisherName').value;
    publisher.taxCode = document.getElementById('editTaxCode').value;
    publisher.location = document.getElementById('editLocation').value;
    publisher.website = document.getElementById('editWebsite').value;
    publisher.description = document.getElementById('editDescription').value;
    publisher.contactEmail = document.getElementById('editContactEmail').value;
    publisher.contactPhone = document.getElementById('editContactPhone').value;
    publisher.status = document.getElementById('editStatus').value;
    
    renderPublishers();
    renderStats();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editPublisherModal'));
    modal.hide();
    
    AdminUtils.showToast('Đã cập nhật nhà phát hành thành công', 'success');
}

// Delete Publisher
function deletePublisher(id) {
    if (confirm('Bạn có chắc chắn muốn xóa nhà phát hành này? Hành động này không thể hoàn tác.')) {
        publishers = publishers.filter(p => p.id !== id);
        renderPublishers();
        renderStats();
        AdminUtils.showToast('Đã xóa nhà phát hành thành công', 'success');
    }
}
