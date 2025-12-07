/**
 * Settings Management Logic
 */

// Save all settings
function saveAllSettings() {
    // Collect settings data
    const settings = {
        general: {
            siteName: document.getElementById('siteName').value,
            siteUrl: document.getElementById('siteUrl').value,
            siteDescription: document.getElementById('siteDescription').value,
            timezone: document.getElementById('timezone').value,
            currency: document.getElementById('currency').value,
            maintenanceMode: document.getElementById('maintenanceMode').checked
        },
        payment: {
            paypal: {
                enabled: document.getElementById('paypalEnabled').checked,
                clientId: document.getElementById('paypalClientId').value
            },
            stripe: {
                enabled: document.getElementById('stripeEnabled').checked,
                publicKey: document.getElementById('stripePublicKey').value
            },
            taxRate: document.getElementById('taxRate').value,
            commissionRate: document.getElementById('commissionRate').value
        },
        email: {
            host: document.getElementById('smtpHost').value,
            port: document.getElementById('smtpPort').value,
            encryption: document.getElementById('smtpEncryption').value,
            username: document.getElementById('smtpUsername').value,
            fromEmail: document.getElementById('fromEmail').value,
            fromName: document.getElementById('fromName').value
        },
        security: {
            sessionTimeout: document.getElementById('sessionTimeout').value,
            maxLoginAttempts: document.getElementById('maxLoginAttempts').value,
            passwordMinLength: document.getElementById('passwordMinLength').value,
            lockoutDuration: document.getElementById('lockoutDuration').value,
            requireStrongPassword: document.getElementById('requireStrongPassword').checked,
            twoFactor: document.getElementById('enableTwoFactor').checked,
            recaptcha: document.getElementById('enableRecaptcha').checked
        }
    };

    console.log('Saving settings:', settings);
    
    // Simulate API call
    const btn = document.querySelector('button[onclick="saveAllSettings()"]');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Đang lưu...`;
    
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        AdminUtils.showToast('Đã lưu tất cả cài đặt thành công', 'success');
    }, 1000);
}

// Test Email
function testEmail() {
    const email = document.getElementById('fromEmail').value;
    if (!email) {
        AdminUtils.showToast('Vui lòng nhập email gửi để kiểm tra', 'error');
        return;
    }
    
    AdminUtils.showToast(`Đã gửi email kiểm tra đến ${email}`, 'success');
}

// System Maintenance Functions
function cleanDatabase() {
    if (confirm('Bạn có chắc chắn muốn dọn dẹp cơ sở dữ liệu? Hành động này sẽ xóa các nhật ký cũ và tối ưu hóa bảng.')) {
        AdminUtils.showToast('Đã bắt đầu dọn dẹp cơ sở dữ liệu...', 'info');
        setTimeout(() => {
            AdminUtils.showToast('Đã dọn dẹp cơ sở dữ liệu thành công', 'success');
        }, 2000);
    }
}

function clearCache() {
    AdminUtils.showToast('Đã xóa bộ nhớ đệm hệ thống', 'success');
}

function backupDatabase() {
    AdminUtils.showToast('Đang tạo bản sao lưu...', 'info');
    setTimeout(() => {
        AdminUtils.showToast('Đã tạo bản sao lưu cơ sở dữ liệu thành công', 'success');
    }, 1500);
}

function systemReset() {
    if (confirm('CẢNH BÁO NGUY HIỂM: Bạn có chắc chắn muốn đặt lại hệ thống về mặc định không? Hành động này không thể hoàn tác!')) {
        const userInput = prompt('Vui lòng nhập "RESET" để xác nhận:');
        if (userInput === 'RESET') {
            AdminUtils.showToast('Hệ thống đang được đặt lại...', 'warning');
            setTimeout(() => {
                AdminUtils.showToast('Hệ thống đã được đặt lại về mặc định', 'success');
                location.reload();
            }, 3000);
        } else {
            alert('Mã xác nhận không đúng. Đã hủy bỏ thao tác.');
        }
    }
}
