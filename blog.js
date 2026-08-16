document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-bar');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const createPostBtn = document.querySelector('.btn--create');

    const filterBlogs = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeCategoryBtn = document.querySelector('.category-btn.active');
        const activeCategory = activeCategoryBtn ? activeCategoryBtn.textContent.trim() : 'ALL';

        blogCards.forEach(card => {
            const titleElement = card.querySelector('.blog-card__title');
            const excerptElement = card.querySelector('.blog-card__excerpt');
            
            const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';
            const excerptText = excerptElement ? excerptElement.textContent.toLowerCase() : '';
            const combinedText = titleText + ' ' + excerptText;

            // Search term matching
            const matchesSearch = combinedText.includes(searchTerm);

            // Category matching
            let matchesCategory = true;
            if (activeCategory !== 'ALL') {
                if (activeCategory === 'HARDWARE') {
                    matchesCategory = combinedText.includes('vr') || combinedText.includes('keyboard') || combinedText.includes('hardware') || combinedText.includes('mechanical');
                } else if (activeCategory === 'RETRO') {
                    matchesCategory = combinedText.includes('8-bit') || combinedText.includes('retro') || combinedText.includes('pixel') || combinedText.includes('gaming');
                } else if (activeCategory === 'ESPORTS') {
                    matchesCategory = combinedText.includes('e-sports') || combinedText.includes('competitive') || combinedText.includes('switches') || combinedText.includes('matches');
                }
            }

            // Display results
            if (matchesSearch && matchesCategory) {
                card.style.display = ''; 
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            filterBlogs();      
        });
    }

    // ALL, HARDWARE, RETRO, ESPORTS
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBlogs(); 
        });
    });

    // Authorization for creating new post
    if (createPostBtn) {
        createPostBtn.addEventListener('click', (e) => {
            if (!currentUser) {
                e.preventDefault();
                alert("Access Denied! You must log in first to create a new post.");
                window.location.href = 'login.html';
            }
        });
    }
});
