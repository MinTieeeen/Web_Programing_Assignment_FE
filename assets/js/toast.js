const Toast = {
    container: null,

    init() {
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    },

    show(message, type = 'info', title = '') {
        this.init();

        const iconMap = {
            success: 'bi-check-circle-fill',
            error: 'bi-exclamation-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };

        const titleMap = {
            success: 'Thành công',
            error: 'Lỗi',
            warning: 'Cảnh báo',
            info: 'Thông báo'
        };

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type}`;
        
        const duration = 5000; // 5 seconds

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="bi ${iconMap[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title || titleMap[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close"><i class="bi bi-x"></i></button>
            <div class="toast-progress">
                <div class="toast-progress-bar" style="animation-duration: ${duration}ms"></div>
            </div>
        `;

        // Close button event
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.dismiss(toast);
        });

        // Auto dismiss
        const timeout = setTimeout(() => {
            this.dismiss(toast);
        }, duration);

        // Pause on hover
        toast.addEventListener('mouseenter', () => clearTimeout(timeout));
        toast.addEventListener('mouseleave', () => {
            setTimeout(() => {
                this.dismiss(toast);
            }, 2000);
        });

        this.container.appendChild(toast);
    },

    dismiss(toast) {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => {
            if (toast.parentElement) {
                toast.remove();
            }
        });
    },

    success(message, title) {
        this.show(message, 'success', title);
    },

    error(message, title) {
        this.show(message, 'error', title);
    },

    warning(message, title) {
        this.show(message, 'warning', title);
    },

    info(message, title) {
        this.show(message, 'info', title);
    },

    confirm(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'toast-confirm-overlay';
        
        overlay.innerHTML = `
            <div class="toast-confirm-box">
                <div class="toast-confirm-title">Xác nhận</div>
                <div class="toast-confirm-message">${message}</div>
                <div class="toast-confirm-actions">
                    <button class="toast-btn toast-btn-cancel">Hủy</button>
                    <button class="toast-btn toast-btn-confirm">Đồng ý</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const btnConfirm = overlay.querySelector('.toast-btn-confirm');
        const btnCancel = overlay.querySelector('.toast-btn-cancel');

        const close = () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 200);
        };

        btnConfirm.addEventListener('click', () => {
            close();
            if (onConfirm) onConfirm();
        });

        btnCancel.addEventListener('click', () => {
            close();
            if (onCancel) onCancel();
        });

        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                close();
            }
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    Toast.init();
});
