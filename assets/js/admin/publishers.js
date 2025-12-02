// Publishers Management JavaScript

// Ensure ENV is loaded before using API
if (!window.ENV || !window.ENV.API_URL) {
    throw new Error('[publishers.js] ENV not loaded! Include env.js before this script.');
}

// State management
let publishers = [];
let filteredPublishers = [];
let currentPage = 1;
const itemsPerPage = 10;

// API Endpoints
const API_BASE = window.ENV.API_URL;

/**
 * Initialize the publishers page
 */
async function initPublishersPage() {
    console.log('Initializing publishers page...');
    await loadPublishers();
    setupEventListeners();
}

/**
 * Load publishers from API
 */
async function loadPublishers() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/admin/publishers`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            publishers = result.data || [];
            filteredPublishers = [...publishers];
            updateStats();
            renderPublishers();
        } else {
            console.error('Failed to load publishers:', result.message);
            showError('Failed to load publishers: ' + result.message);
        }
    } catch (error) {
        console.error('Error loading publishers:', error);
        showError('Error loading publishers: ' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Update statistics cards
 */
function updateStats() {
    const totalPublishers = publishers.length;
    const totalGames = publishers.reduce((sum, pub) => sum + (parseInt(pub.games_count) || 0), 0);
    
    document.getElementById('totalPublishers').textContent = totalPublishers;
    document.getElementById('activePublishers').textContent = totalPublishers; // All are active
    document.getElementById('totalPublishedGames').textContent = totalGames;
    document.getElementById('pendingPublishers').textContent = '0';
}

/**
 * Render publishers table
 */
function renderPublishers() {
    const tbody = document.querySelector('#publishersTable tbody');
    if (!tbody) return;
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPublishers = filteredPublishers.slice(startIndex, endIndex);
    
    if (paginatedPublishers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="bi bi-inbox text-muted fs-1"></i>
                    <p class="text-muted mt-2">No publishers found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = paginatedPublishers.map(publisher => `
        <tr data-id="${publisher.uid}">
            <td>${publisher.uid}</td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${publisher.avatar || '../assets/images/default-avatar.png'}" 
                         class="rounded-circle me-2" width="32" height="32" 
                         alt="${publisher.uname}" onerror="this.src='../assets/images/default-avatar.png'">
                    <div>
                        <div class="fw-bold">${escapeHtml(publisher.uname || '')}</div>
                        <small class="text-muted">${escapeHtml(publisher.email || '')}</small>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(publisher.location || 'N/A')}</td>
            <td><code>${escapeHtml(publisher.taxcode || 'N/A')}</code></td>
            <td>
                <span class="badge bg-primary">${publisher.games_count || 0} games</span>
            </td>
            <td><span class="badge bg-success">Active</span></td>
            <td>${formatDate(publisher.DOB)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewPublisher(${publisher.uid})" title="View">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editPublisher(${publisher.uid})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDeletePublisher(${publisher.uid})" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    renderPagination();
}

/**
 * Render pagination
 */
function renderPagination() {
    const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);
    const pagination = document.getElementById('publishersPagination');
    
    if (!pagination || totalPages <= 1) {
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage - 1}); return false;">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage + 1}); return false;">Next</a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

/**
 * Go to specific page
 */
function goToPage(page) {
    const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPublishers();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchPublisher');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => filterPublishers(), 300));
    }
    
    // Location filter
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('change', filterPublishers);
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterPublishers);
    }
}

/**
 * Filter publishers based on search and filters
 */
function filterPublishers() {
    const searchTerm = (document.getElementById('searchPublisher')?.value || '').toLowerCase();
    const locationFilter = document.getElementById('locationFilter')?.value || '';
    
    filteredPublishers = publishers.filter(publisher => {
        // Search filter
        const matchesSearch = !searchTerm || 
            (publisher.uname || '').toLowerCase().includes(searchTerm) ||
            (publisher.email || '').toLowerCase().includes(searchTerm) ||
            (publisher.description || '').toLowerCase().includes(searchTerm) ||
            (publisher.location || '').toLowerCase().includes(searchTerm);
        
        // Location filter
        const matchesLocation = !locationFilter || 
            (publisher.location || '').toLowerCase().includes(locationFilter.toLowerCase());
        
        return matchesSearch && matchesLocation;
    });
    
    currentPage = 1;
    renderPublishers();
}

/**
 * Reset all filters
 */
function resetFilters() {
    document.getElementById('searchPublisher').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('statusFilter').value = '';
    filteredPublishers = [...publishers];
    currentPage = 1;
    renderPublishers();
}

/**
 * View publisher details
 */
function viewPublisher(uid) {
    const publisher = publishers.find(p => p.uid == uid);
    if (!publisher) return;
    
    alert(`Publisher Details:\n\nName: ${publisher.uname}\nEmail: ${publisher.email}\nLocation: ${publisher.location}\nTax Code: ${publisher.taxcode}\nGames: ${publisher.games_count}\nDescription: ${publisher.description || 'N/A'}`);
}

/**
 * Edit publisher - populate and show modal
 */
function editPublisher(uid) {
    const publisher = publishers.find(p => p.uid == uid);
    if (!publisher) return;
    
    // Populate form fields
    document.getElementById('editPublisherId').value = publisher.uid;
    document.getElementById('editPublisherName').value = publisher.uname || '';
    document.getElementById('editTaxCode').value = publisher.taxcode || '';
    document.getElementById('editLocation').value = publisher.location || '';
    document.getElementById('editDescription').value = publisher.description || '';
    document.getElementById('editContactEmail').value = publisher.email || '';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editPublisherModal'));
    modal.show();
}

/**
 * Update publisher via API
 */
async function updatePublisher() {
    const uid = document.getElementById('editPublisherId').value;
    
    const data = {
        uname: document.getElementById('editPublisherName').value,
        taxcode: document.getElementById('editTaxCode').value,
        location: document.getElementById('editLocation').value,
        description: document.getElementById('editDescription').value,
        email: document.getElementById('editContactEmail').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/admin/publishers/${uid}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('editPublisherModal')).hide();
            
            // Reload publishers
            await loadPublishers();
            
            showSuccess('Publisher updated successfully!');
        } else {
            showError('Failed to update publisher: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating publisher:', error);
        showError('Error updating publisher: ' + error.message);
    }
}

/**
 * Confirm delete publisher
 */
function confirmDeletePublisher(uid) {
    const publisher = publishers.find(p => p.uid == uid);
    if (!publisher) return;
    
    if (confirm(`Are you sure you want to delete publisher "${publisher.uname}"?\n\nThis action cannot be undone and will also delete all associated games.`)) {
        deletePublisher(uid);
    }
}

/**
 * Delete publisher via API
 */
async function deletePublisher(uid) {
    try {
        const response = await fetch(`${API_BASE}/admin/publishers/${uid}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Reload publishers
            await loadPublishers();
            showSuccess('Publisher deleted successfully!');
        } else {
            showError('Failed to delete publisher: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting publisher:', error);
        showError('Error deleting publisher: ' + error.message);
    }
}

/**
 * Save new publisher
 */
async function savePublisher() {
    const data = {
        uname: document.getElementById('publisherName').value,
        taxcode: document.getElementById('taxCode').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        email: document.getElementById('contactEmail').value,
        password: 'password123', // Default password for new publishers
        DOB: '1990-01-01',
        fname: document.getElementById('publisherName').value.split(' ')[0] || 'Publisher',
        lname: document.getElementById('publisherName').value.split(' ').slice(1).join(' ') || 'Account'
    };
    
    try {
        const response = await fetch(`${API_BASE}/publishers/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('addPublisherModal')).hide();
            
            // Clear form
            document.getElementById('addPublisherForm').reset();
            
            // Reload publishers
            await loadPublishers();
            
            showSuccess('Publisher created successfully!');
        } else {
            showError('Failed to create publisher: ' + result.message);
        }
    } catch (error) {
        console.error('Error creating publisher:', error);
        showError('Error creating publisher: ' + error.message);
    }
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        return new Date(dateStr).toLocaleDateString();
    } catch (e) {
        return dateStr;
    }
}

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

function showLoading(show) {
    // Could add a loading spinner overlay
    const table = document.querySelector('#publishersTable tbody');
    if (show && table) {
        table.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted mt-2">Loading publishers...</p>
                </td>
            </tr>
        `;
    }
}

function showSuccess(message) {
    // Simple alert for now - could be replaced with toast
    alert(message);
}

function showError(message) {
    alert('Error: ' + message);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for components to load
    setTimeout(initPublishersPage, 500);
});
