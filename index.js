document.addEventListener('DOMContentLoaded', () => {
    const currentUserStr = localStorage.getItem('currentUser');
    const heroTitle = document.getElementById('hero-title');

    if (currentUserStr && heroTitle) {
        const currentUser = JSON.parse(currentUserStr);
        heroTitle.textContent = `Welcome back, Commander ${currentUser.username || 'Gamer'}!`;
    }
});