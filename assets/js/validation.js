document.addEventListener('DOMContentLoaded', function() {
    // Register Form Validation
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Password Match Check
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm_password');
            
            if (confirmPassword && password) {
                if (password.value !== confirmPassword.value) {
                    e.preventDefault();
                    isValid = false;
                    confirmPassword.classList.add('is-invalid');
                    
                    // Create or update error message
                    let errorSpan = confirmPassword.nextElementSibling;
                    if (!errorSpan || !errorSpan.classList.contains('invalid-feedback')) {
                        errorSpan = document.createElement('span');
                        errorSpan.className = 'invalid-feedback';
                        confirmPassword.parentNode.appendChild(errorSpan);
                    }
                    errorSpan.textContent = 'Mật khẩu xác nhận không khớp';
                } else {
                    confirmPassword.classList.remove('is-invalid');
                }
            }
            
            // Basic HTML5 validation will handle required fields, 
            // but we can add custom logic here if needed.
        });
    }
});
