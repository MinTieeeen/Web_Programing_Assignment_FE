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

// Check if user is admin by querying backend
async function checkUserRole(uid) {
    try {
        // Check if user is in Admin table
        const adminResponse = await fetch(`/nextplay/index.php/admin/check/${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            if (adminData.status === 'success' && adminData.isAdmin) {
                return 'admin';
            }
        }
        
        // Check if user is in Publisher table
        const publisherResponse = await fetch(`/nextplay/index.php/publisher/check/${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (publisherResponse.ok) {
            const publisherData = await publisherResponse.json();
            if (publisherData.status === 'success' && publisherData.isPublisher) {
                return 'publisher';
            }
        }
        
        // Check if user is in Customer table
        const customerResponse = await fetch(`/nextplay/index.php/customer/check/${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            if (customerData.status === 'success' && customerData.isCustomer) {
                return 'customer';
            }
        }
        
        return 'user';
    } catch (error) {
        console.error('Role check error:', error);
        return 'user';
    }
}

// Login function using backend API
async function login(identifier, password, rememberMe) {
    try {
        const response = await fetch('/Assignment/NextPlay/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uname: identifier,
                password: password
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            // Check user role by querying backend tables
            const userRole = await checkUserRole(data.user.uid);
            
            const userData = {
                uid: data.user.uid,
                username: data.user.uname,
                email: data.user.email,
                name: `${data.user.fname} ${data.user.lname}`,
                fname: data.user.fname,
                lname: data.user.lname,
                avatar: data.user.avatar,
                DOB: data.user.DOB,
                role: userRole, // Role determined by table membership check
                loginTime: new Date().toISOString()
            };

            // Store user data based on remember me preference
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(userData));
            }

            return { success: true, user: userData };
        } else {
            return { success: false, message: data.message || 'Đăng nhập thất bại' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.' };
    }
}

// Form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
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
    
    // Call async login function
    const result = await login(identifier, password, rememberMe);
        
        if (result.success) {
        // Check if user is admin and show appropriate message
        if (result.user.role === 'admin') {
            // Show admin access granted message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.innerHTML = '<i class="bi bi-check-circle"></i> Admin access granted! Redirecting...';
            
            // Find the correct container and insert the message
            const loginForm = document.getElementById('loginForm');
            const container = document.querySelector('.login-form');
            if (container && loginForm) {
                container.insertBefore(successMessage, loginForm);
            }
        }
        
        // Success - redirect to home page
        setTimeout(() => {
            window.location.href = '../index.html';
        }, result.user.role === 'admin' ? 1000 : 100);
        } else {
        // Show error
        showError(result.message);
        }
        
        // Reset loading state
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
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