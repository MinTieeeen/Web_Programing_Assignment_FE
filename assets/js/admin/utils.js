// Admin Utilities
class AdminUtils {
    // Authentication
    static async checkAuthentication() {
        // Prioritize localStorage as it's explicitly updated by login.html
        let currentUser = localStorage.getItem('currentUser') || localStorage.getItem('user') || sessionStorage.getItem('currentUser') || sessionStorage.getItem('user');
        
        if (!currentUser) {
            console.warn('[AdminUtils] No user found in storage. Redirecting to login.');
            window.location.href = '../auth/login.html';
            return false;
        }

        try {
            const userData = JSON.parse(currentUser);
            console.log('[AdminUtils] Checking auth for:', userData.uname);
            console.log('[AdminUtils] Role/UserType:', userData.role || userData.userType);

            // Check role from local storage (verified at login)
            const role = userData.role || userData.userType;
            
            // Allow 'admin' (strict check)
            if (role !== 'admin') {
                console.error('[AdminUtils] Access denied. User role is:', role);
                alert('Truy cập bị từ chối. Yêu cầu quyền quản trị.\nVai trò hiện tại: ' + role);
                this.logout();
                return false;
            }

            this.updateUserDisplay(userData);
            return true;
        } catch (e) {
            console.error('[AdminUtils] Error parsing user data:', e);
            this.logout();
            return false;
        }
    }

    // Deprecated: Role is now checked locally based on userType from login
    static async checkIfUserIsAdmin(uid) {
        return true; 
    }

    static logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('token');
        window.location.href = '../auth/login.html';
    }

    static updateUserDisplay(userData) {
        // Update user name
        const displayName = userData.fullname || userData.uname || 'Admin';
        const nameElements = document.querySelectorAll('.admin-user-name');
        nameElements.forEach(el => el.textContent = displayName);

        // Update avatar
        const avatarElements = document.querySelectorAll('.admin-user-avatar');
        avatarElements.forEach(avatarEl => {
            const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
            
            if (userData.avatar) {
                 // Create a temp image to test loading
                 const img = new Image();
                 img.onload = () => {
                      if (avatarEl.tagName === 'IMG') {
                         avatarEl.src = userData.avatar;
                     } else {
                         avatarEl.style.backgroundImage = `url(${userData.avatar})`;
                     }
                 };
                 img.onerror = () => {
                     // Fallback to ui-avatars
                     if (avatarEl.tagName === 'IMG') {
                         avatarEl.src = fallbackUrl;
                     } else {
                         avatarEl.style.backgroundImage = `url(${fallbackUrl})`;
                     }
                 };
                 img.src = userData.avatar;
            } else {
                 if (avatarEl.tagName === 'IMG') {
                     avatarEl.src = fallbackUrl;
                 } else {
                     avatarEl.style.backgroundImage = `url(${fallbackUrl})`;
                 }
            }
        });
    }

    // Data Management
    static getStorageData(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Error getting storage data for ${key}:`, error);
            return defaultValue;
        }
    }

    static setStorageData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error setting storage data for ${key}:`, error);
            return false;
        }
    }

    // CRUD Operations
    static addRecord(storageKey, record) {
        const data = this.getStorageData(storageKey);
        const id = Date.now().toString();
        record.id = id;
        record.created_at = new Date().toISOString();
        record.updated_at = new Date().toISOString();
        
        data.push(record);
        this.setStorageData(storageKey, data);
        return record;
    }

    static updateRecord(storageKey, id, updates) {
        const data = this.getStorageData(storageKey);
        const index = data.findIndex(item => item.id === id);
        
        if (index !== -1) {
            data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() };
            this.setStorageData(storageKey, data);
            return data[index];
        }
        return null;
    }

    static deleteRecord(storageKey, id) {
        const data = this.getStorageData(storageKey);
        const filteredData = data.filter(item => item.id !== id);
        
        if (filteredData.length !== data.length) {
            this.setStorageData(storageKey, filteredData);
            return true;
        }
        return false;
    }

    static getRecord(storageKey, id) {
        const data = this.getStorageData(storageKey);
        return data.find(item => item.id === id) || null;
    }

    // Search and Filter
    static searchRecords(storageKey, searchTerm, searchFields) {
        const data = this.getStorageData(storageKey);
        if (!searchTerm) return data;

        return data.filter(item => {
            return searchFields.some(field => {
                const fieldValue = this.getNestedValue(item, field);
                return fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }

    static filterRecords(data, filters) {
        return data.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === '' || value === null || value === undefined) return true;
                
                const itemValue = this.getNestedValue(item, key);
                if (Array.isArray(value)) {
                    return value.includes(itemValue);
                }
                return itemValue === value;
            });
        });
    }

    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    // Pagination
    static paginateData(data, page, itemsPerPage) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        return {
            data: data.slice(start, end),
            totalPages: Math.ceil(data.length / itemsPerPage),
            currentPage: page,
            totalItems: data.length,
            itemsPerPage: itemsPerPage
        };
    }

    // Form Validation
    static validateForm(formElement) {
        const errors = {};
        const inputs = formElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const fieldName = input.name || input.id;
            
            // Required field validation
            if (input.hasAttribute('required') && !value) {
                errors[fieldName] = 'Trường này là bắt buộc';
            }
            
            // Email validation
            if (input.type === 'email' && value && !this.isValidEmail(value)) {
                errors[fieldName] = 'Vui lòng nhập địa chỉ email hợp lệ';
            }
            
            // Number validation
            if (input.type === 'number' && value) {
                const min = parseFloat(input.min);
                const max = parseFloat(input.max);
                const numValue = parseFloat(value);
                
                if (!isNaN(min) && numValue < min) {
                    errors[fieldName] = `Giá trị phải ít nhất là ${min}`;
                }
                if (!isNaN(max) && numValue > max) {
                    errors[fieldName] = `Giá trị phải tối đa là ${max}`;
                }
            }
        });
        
        return errors;
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static displayFormErrors(errors, formElement) {
        // Clear previous errors
        formElement.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        formElement.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        
        // Display new errors
        Object.entries(errors).forEach(([fieldName, message]) => {
            const input = formElement.querySelector(`[name="${fieldName}"], #${fieldName}`);
            if (input) {
                input.classList.add('is-invalid');
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = message;
                input.parentNode.appendChild(feedback);
            }
        });
    }

    // Notifications
    static loadNotifications() {
        const notifications = this.getStorageData('admin_notifications', []);
        const notificationList = document.getElementById('notificationList');
        const notificationCount = document.getElementById('notificationCount');
        
        if (!notificationList) return;
        
        const unreadCount = notifications.filter(n => !n.read).length;
        
        if (notificationCount) {
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = unreadCount > 0 ? 'inline' : 'none';
        }
        
        const listHTML = notifications.length > 0 
            ? notifications.slice(0, 5).map(notification => `
                <li>
                    <a class="dropdown-item ${notification.read ? '' : 'fw-bold'}" href="#" onclick="AdminUtils.markNotificationRead('${notification.id}')">
                        <i class="bi ${notification.icon} ${notification.color}"></i> 
                        ${notification.message}
                        <small class="text-muted d-block">${this.formatDate(notification.created_at)}</small>
                    </a>
                </li>
            `).join('')
            : '<li><span class="dropdown-item text-muted">Không có thông báo nào</span></li>';
            
        notificationList.innerHTML = `
            <li><h6 class="dropdown-header">Thông báo</h6></li>
            ${listHTML}
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-center" href="#" onclick="AdminUtils.markAllNotificationsRead()">Đánh dấu tất cả là đã đọc</a></li>
        `;
    }

    static addNotification(message, type = 'info', icon = 'bi-info-circle') {
        const notifications = this.getStorageData('admin_notifications', []);
        const notification = {
            id: Date.now().toString(),
            message,
            type,
            icon,
            color: this.getNotificationColor(type),
            read: false,
            created_at: new Date().toISOString()
        };
        
        notifications.unshift(notification);
        // Keep only last 50 notifications
        if (notifications.length > 50) {
            notifications.splice(50);
        }
        
        this.setStorageData('admin_notifications', notifications);
        this.loadNotifications();
    }

    static getNotificationColor(type) {
        const colors = {
            'success': 'text-success',
            'error': 'text-danger',
            'warning': 'text-warning',
            'info': 'text-info'
        };
        return colors[type] || 'text-info';
    }

    static markNotificationRead(id) {
        const notifications = this.getStorageData('admin_notifications', []);
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.setStorageData('admin_notifications', notifications);
            this.loadNotifications();
        }
    }

    static markAllNotificationsRead() {
        const notifications = this.getStorageData('admin_notifications', []);
        notifications.forEach(n => n.read = true);
        this.setStorageData('admin_notifications', notifications);
        this.loadNotifications();
    }

    // Date and Time utilities
    static formatDate(dateString, format = 'short') {
        const date = new Date(dateString);
        
        if (format === 'short') {
            return date.toLocaleDateString();
        } else if (format === 'long') {
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } else if (format === 'relative') {
            return this.getRelativeTime(date);
        }
        
        return date.toString();
    }

    // Currency formatting (VND)
    static formatCurrency(amount) {
        const num = parseFloat(amount) || 0;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    }

    static getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (seconds < 60) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        
        return date.toLocaleDateString();
    }

    // Export/Import utilities
    static exportToCSV(data, filename) {
        if (!data.length) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                let cell = row[header];
                if (typeof cell === 'string' && cell.includes(',')) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Toast notifications
    static showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const toastHTML = `
            <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement);
        
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    static createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
        return container;
    }

}

// Export for use in other files
window.AdminUtils = AdminUtils;