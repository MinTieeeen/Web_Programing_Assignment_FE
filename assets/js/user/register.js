
// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let text = '';
    let className = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
    case 0:
    case 1:
        text = 'Mật khẩu rất yếu';
        className = 'strength-weak';
        break;
    case 2:
        text = 'Mật khẩu yếu';
        className = 'strength-weak';
        break;
    case 3:
        text = 'Mật khẩu trung bình';
        className = 'strength-fair';
        break;
    case 4:
        text = 'Mật khẩu mạnh';
        className = 'strength-good';
        break;
    case 5:
        text = 'Mật khẩu rất mạnh';
        className = 'strength-strong';
        break;
    }
    
    return { strength, text, className };
}

// Password input handler
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (password.length === 0) {
    strengthFill.className = 'strength-fill';
    strengthText.textContent = 'Mật khẩu phải có ít nhất 8 ký tự';
    return;
    }
    
    const result = checkPasswordStrength(password);
    strengthFill.className = `strength-fill ${result.className}`;
    strengthText.textContent = result.text;
});

// Confirm password validation
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    
    if (confirmPassword && password !== confirmPassword) {
    this.setCustomValidity('Mật khẩu xác nhận không khớp');
    } else {
    this.setCustomValidity('');
    }
});

// Username validation
document.getElementById('username').addEventListener('input', function() {
    const username = this.value;
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    
    if (username && !regex.test(username)) {
    this.setCustomValidity('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (3-20 ký tự)');
    } else {
    this.setCustomValidity('');
    }
});

// Phone validation
document.getElementById('phone').addEventListener('input', function() {
    const phone = this.value;
    const regex = /^[\+]?[0-9\-\(\)\s]{10,15}$/;
    
    if (phone && !regex.test(phone)) {
    this.setCustomValidity('Số điện thoại không hợp lệ');
    } else {
    this.setCustomValidity('');
    }
});

// Age validation
document.getElementById('birthDate').addEventListener('change', function() {
    const birthDate = new Date(this.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
    }
    
    if (age < 13) {
    this.setCustomValidity('Bạn phải từ 13 tuổi trở lên');
    } else {
    this.setCustomValidity('');
    }
});

// Form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.checkValidity()) {
    const submitBtn = document.querySelector('.btn-register');
    const spinner = document.getElementById('loadingSpinner');
    
    // Show loading state
    submitBtn.disabled = true;
    spinner.classList.remove('d-none');
    
    // Simulate API call
    setTimeout(() => {
        alert('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        
        // Reset form
        this.reset();
        this.classList.remove('was-validated');
        
        // Reset password strength
        document.getElementById('strengthFill').className = 'strength-fill';
        document.getElementById('strengthText').textContent = 'Mật khẩu phải có ít nhất 8 ký tự';
        
        // Reset loading state
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
        
        // Redirect to login
        window.location.href = 'login.html';
    }, 2000);
    }
    
    this.classList.add('was-validated');
});

// Social login functions
function signInWithSocial(provider) {
    console.log(`Signing in with ${provider}`);
    alert(`Chức năng đăng nhập ${provider} sẽ được triển khai sau.`);
}

// Set max date for birth date (13 years ago)
const today = new Date();
const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
document.getElementById('birthDate').max = maxDate.toISOString().split('T')[0];