document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-form');
    const emailUsernameInput = document.getElementById('email-username');
    const passwordInput = document.getElementById('password');
    const rememberCheck = document.querySelector('input[name="remember"]');
    const submitBtn = document.querySelector('button[type="submit"]');

    submitBtn.disabled = true;

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        let errorEl = formGroup.querySelector('.error-msg');
        
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-msg';
            errorEl.style.color = '#ff4d4d';
            errorEl.style.fontSize = '0.85rem';
            errorEl.style.marginTop = '5px';
            formGroup.appendChild(errorEl);
        }
        errorEl.textContent = message;
        input.style.borderColor = '#ff4d4d';
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup.querySelector('.error-msg');
        if (errorEl) errorEl.remove();
        
        if (input.value.trim() !== '') {
            input.style.borderColor = '#28a745'; 
        } else {
            input.style.borderColor = '';
        }
    };

    // Live validation
    const validateForm = () => {
        let isValid = true;

        if (emailUsernameInput.value.trim().length === 0) {
            showError(emailUsernameInput, "Please enter your email or username.");
            isValid = false;
        } else {
            clearError(emailUsernameInput);
        }

        if (passwordInput.value.length === 0) {
            showError(passwordInput, "Please enter your password.");
            isValid = false;
        } else {
            clearError(passwordInput);
        }
        submitBtn.disabled = !isValid;
        return isValid;
    };

    // 4. WEB STORAGE API: remember me
    const rememberedAccount = localStorage.getItem('rememberedAccount');
    if (rememberedAccount) {
        emailUsernameInput.value = rememberedAccount;
        rememberCheck.checked = true;
        validateForm(); 
    }
    const handleRememberMe = () => {
        if (rememberCheck.checked && emailUsernameInput.value.trim() !== '') {
            localStorage.setItem('rememberedAccount', emailUsernameInput.value.trim());
        } else {
            localStorage.removeItem('rememberedAccount');
        }
    };
    emailUsernameInput.addEventListener('input', () => {
        validateForm();
        handleRememberMe(); 
    });
    passwordInput.addEventListener('input', validateForm);
    rememberCheck.addEventListener('change', handleRememberMe);

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        if (!validateForm()) return;

        const loginData = {
            emailUsername: emailUsernameInput.value.trim(),
            password: passwordInput.value
        };

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));

                alert("Welcome back, " + data.user.username + "!");
                window.location.href = 'index.html'; 
                
            } else {
                showError(emailUsernameInput, data.error);
                showError(passwordInput, data.error);
                alert("Login failed: " + data.error);
            }
        } catch (error) {
            console.error("Lỗi kết nối Server:", error);
            alert("Cannot connect to server. Ensure NodeJS is running on port 3000.");
        }
    });
});