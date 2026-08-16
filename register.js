document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-form');
    const fullname = document.getElementById('fullname');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const description = document.getElementById('description');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const termsCheck = document.querySelector('input[name="terms"]');
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

    const validateForm = () => {
        let isValid = true;

        // Check Fullname
        if (fullname.value.trim().length < 2) {
            showError(fullname, "Full name must be at least 2 characters.");
            isValid = false;
        } else clearError(fullname);

        // Check Username 
        if (!/^[A-Za-z0-9_]{3,20}$/.test(username.value)) {
            showError(username, "3-20 characters. Letters, numbers, and underscores only.");
            isValid = false;
        } else clearError(username);

        // Check Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showError(email, "Please enter a valid email address.");
            isValid = false;
        } else clearError(email);

        // Check Password 
        if (password.value.length < 8) {
            showError(password, "Password must be at least 8 characters.");
            isValid = false;
        } else clearError(password);

        // Check Confirm Password
        if (confirmPassword.value !== password.value || confirmPassword.value === "") {
            showError(confirmPassword, "Passwords do not match.");
            isValid = false;
        } else clearError(confirmPassword);

        // Check Terms
        if (!termsCheck.checked) {
            isValid = false;
        }

        submitBtn.disabled = !isValid;
        return isValid; 
    };

    // WEB STORAGE API: Auto-save Form
    const saveDraft = () => {
        const draftData = {
            fullname: fullname.value,
            username: username.value,
            email: email.value,
            description: description.value
        };
        localStorage.setItem('registerDraft', JSON.stringify(draftData));
    };

    const loadDraft = () => {
        const savedDraft = JSON.parse(localStorage.getItem('registerDraft'));
        if (savedDraft) {
            fullname.value = savedDraft.fullname || '';
            username.value = savedDraft.username || '';
            email.value = savedDraft.email || '';
            description.value = savedDraft.description || '';
            validateForm(); 
        }
    };

    loadDraft();
    const allInputs = [fullname, username, email, description, password, confirmPassword, termsCheck];
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            validateForm();
            if(input.id !== 'password' && input.id !== 'confirm-password') {
                saveDraft(); 
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        if (!validateForm()) return;

        const newUserData = {
            fullname: fullname.value,
            username: username.value,
            email: email.value,
            description: description.value,
            password: password.value 
        };

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully!");
                localStorage.removeItem('registerDraft'); 
                window.location.href = 'login.html';
            } else {
                alert("Registration failed: " + data.error);
            }
        } catch (error) {
            console.error("Error connecting to Server:", error);
            alert("Cannot connect to server. Please make sure the NodeJS server is running on port 3000.");
        }
    });
});