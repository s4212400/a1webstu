document.addEventListener('DOMContentLoaded', () => {
    // Check loggin status
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("You must be logged in to create a post.");
        window.location.href = 'login.html';
        return; 
    }

    const form = document.querySelector('.blog-form');
    const authorInput = document.getElementById('post-author');
    const dateInput = document.getElementById('post-date');
    const titleInput = document.getElementById('post-title');
    const categoryInput = document.getElementById('post-category');
    const tagsInput = document.getElementById('post-tags');
    const imageInput = document.getElementById('post-image');
    const imageAltInput = document.getElementById('post-image-alt');
    const summaryInput = document.getElementById('post-summary');
    const contentInput = document.getElementById('post-content');
    const resetBtn = document.querySelector('button[type="reset"]');

    // Dynamic data
    authorInput.value = currentUser.username; 

    // Auto-save draft
    const saveDraft = () => {
        const draftData = {
            title: titleInput.value,
            category: categoryInput.value,
            tags: tagsInput.value,
            image: imageInput.value,
            imageAlt: imageAltInput.value,
            summary: summaryInput.value,
            content: contentInput.value
        };
        localStorage.setItem('blogDraft', JSON.stringify(draftData));
    };

    const loadDraft = () => {
        const savedDraft = JSON.parse(localStorage.getItem('blogDraft'));
        if (savedDraft) {
            titleInput.value = savedDraft.title || '';
            categoryInput.value = savedDraft.category || '';
            tagsInput.value = savedDraft.tags || '';
            imageInput.value = savedDraft.image || '';
            imageAltInput.value = savedDraft.imageAlt || '';
            summaryInput.value = savedDraft.summary || '';
            contentInput.value = savedDraft.content || '';
        }
    };

    // Auto-load draft on page load
    loadDraft();

    // Save draft continuously
    const allInputs = [titleInput, categoryInput, tagsInput, imageInput, imageAltInput, summaryInput, contentInput];
    allInputs.forEach(input => {
        input.addEventListener('input', saveDraft);
    });

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('blogDraft');
    });

    // Submit form 
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        // New post
        const newPost = {
            id: Date.now(), 
            title: titleInput.value.trim(),
            authorId: currentUser.id,
            authorName: currentUser.username,
            date: dateInput.value,
            category: categoryInput.value,
            tags: tagsInput.value,
            image: imageInput.value,
            summary: summaryInput.value,
            content: contentInput.value,
            status: document.querySelector('input[name="status"]:checked').value,
            allowComments: document.querySelector('input[name="comments"]').checked
        };

        // localStorage
        let allPosts = JSON.parse(localStorage.getItem('allPosts')) || [];
        allPosts.push(newPost);
        localStorage.setItem('allPosts', JSON.stringify(allPosts));

        alert("Post successfully created!");
        
        localStorage.removeItem('blogDraft'); 
        
        window.location.href = 'blog.html';
    });
});