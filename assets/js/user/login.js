// Demo users for testing
const demoUsers = [
    { username: 'admin', email: 'admin@nextplay.com', password: 'admin123', name: 'Administrator' },
    { username: 'gamer1', email: 'gamer1@nextplay.com', password: 'gamer123', name: 'Pro Gamer' },
    { username: 'test', email: 'test@nextplay.com', password: 'test123', name: 'Test User' }
];

// Password toggle function
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.className = 'bi bi-eye-slash';
    } else {
    passwordInput.type = 'password';
    toggleIcon.className = 'bi bi-eye';
    }
}

// Show error alert
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
    errorAlert.classList.add('d-none');
    }, 5000);
}

// Hide error alert
function hideError() {
    document.getElementById('errorAlert').classList.add('d-none');
}

// Check if user is already logged in
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
    // User is already logged in, redirect to home
    window.location.href = '../index.html';
    }
}

// Login function
function login(identifier, password, rememberMe) {
    // Find user by username or email
    const user = demoUsers.find(u => 
    (u.username === identifier || u.email === identifier) && u.password === password
    );

    if (user) {
    // Login successful
    const userData = {
        username: user.username,
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString()
    };

    // Store user data
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
    }

    return { success: true, user: userData };
    } else {
    return { success: false, message: 'Email/tên đăng nhập hoặc mật khẩu không chính xác' };
    }
}

// Form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    hideError();
    
    if (this.checkValidity()) {
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    const submitBtn = document.querySelector('.btn-login');
    const spinner = document.getElementById('loadingSpinner');
    
    // Show loading state
    submitBtn.disabled = true;
    spinner.classList.remove('d-none');
    
    // Simulate API call delay
    setTimeout(() => {
        const result = login(identifier, password, rememberMe);
        
        if (result.success) {
        // Success - redirect to home page
        window.location.href = '../index.html';
        } else {
        // Show error
        showError(result.message);
        
        // Reset loading state
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
        }
    }, 1500);
    }
    
    this.classList.add('was-validated');
});

// Social login functions
function signInWithSocial(provider) {
    console.log(`Signing in with ${provider}`);
    alert(`Chức năng đăng nhập ${provider} sẽ được triển khai sau.`);
}

// Clear any existing validation on input
document.getElementById('loginIdentifier').addEventListener('input', hideError);
document.getElementById('password').addEventListener('input', hideError);

// Check login status on page load
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Demo login info
console.log('Demo login accounts:');
console.log('1. Username: admin, Password: admin123');
console.log('2. Username: gamer1, Password: gamer123');
console.log('3. Username: test, Password: test123');