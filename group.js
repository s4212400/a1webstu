document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const loginBtn = document.querySelector('a[href="login.html"]');
    const registerBtn = document.querySelector('a[href="register.html"]');
    const logoutBtn = document.querySelector('a[href="logout.html"]');
    const profileBtn = document.querySelector('a[href="profile.html"]');

    if (currentUser) {
        // --- Logged in ---
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';

        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.textContent = `Logout (${currentUser.username || currentUser.email})`;
            
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                alert("Logged out successfully!");
                window.location.href = 'index.html';
            });
        }
    } else {
        // --- Logged out ---
        if (logoutBtn) logoutBtn.style.display = 'none'; 
        
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert("Please log in first to view your profile!");
                window.location.href = 'login.html';
            });
        }
    }
});