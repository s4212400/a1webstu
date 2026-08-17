document.addEventListener('DOMContentLoaded', () => {
    const currentUserStr = localStorage.getItem('currentUser');
    const heroTitle = document.getElementById('hero-title');

    if (currentUserStr && heroTitle) {
        const currentUser = JSON.parse(currentUserStr);
        heroTitle.textContent = `Welcome back, Commander ${currentUser.username || 'Gamer'}!`;
    }

    // MODULE BLOG
    const blogContainer = document.getElementById('dynamic-blog-container');
    
    if (blogContainer) {
        // Take all posts from localStorage
        const allPosts = JSON.parse(localStorage.getItem('allPosts')) || [];

        if (allPosts.length === 0) {
            blogContainer.innerHTML = `<p style="text-align: center; width: 100%; grid-column: 1 / -1; color: #888;">No recent news found. Head to the Blog to create one!</p>`;
        } else {
            // Take the latest 3 posts 
            const latestPosts = allPosts.reverse().slice(0, 3);
            
            // Remove loading line
            blogContainer.innerHTML = '';

            latestPosts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'card'; 

                // Structure of article 
                article.innerHTML = `
                    <div class="card__image-container" style="height: 200px;">
                        <img src="${post.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'}" alt="Blog Cover" class="card__image" style="object-fit: cover; height: 100%; width: 100%;">
                    </div>
                    <div class="card__content" style="display: flex; flex-direction: column; justify-content: space-between; height: calc(100% - 200px);">
                        <div>
                            <span style="color: var(--primary-color, #ff3333); font-size: 0.8rem; font-family: monospace;">[ ${post.date} ]</span>
                            <h3 class="card__title" style="margin-top: 10px; font-size: 1.2rem;"><a href="blog.html">${post.title}</a></h3>
                            <p style="font-size: 0.9rem; color: #aaa; margin-top: 10px; line-height: 1.4;">${post.summary || 'Click to read full databank log...'}</p>
                        </div>
                        <div class="card__footer" style="margin-top: 20px; border-top: 1px solid #333; padding-top: 10px;">
                            <span style="font-size: 0.8rem; color: #888;">By ${post.authorName}</span>
                            <a href="blog.html" class="btn btn--outline" style="padding: 5px 15px;">Read</a>
                        </div>
                    </div>
                `;
                blogContainer.appendChild(article);
            });
        }
    }
});