const searchInput = document.querySelector('.search-input');
const starFilter = document.querySelector('#star-filter');
const sortSelect = document.querySelector('#review-sort');
const cards = document.querySelectorAll('.review-card');

console.log("Search input:", searchInput);
console.log("Number of review cards:" , cards.length);

searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    cards.forEach((card) => {
        const title = card.querySelector(".review-card__title").innerText.toLowerCase();

        if (title.includes(keyword)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});

starFilter.addEventListener("change", () => {
    const selectedRating = starFilter.value;

    cards.forEach((card) => {
        const starText = card.querySelector(".review-card__stars span").innerText;
        const rating = parseFloat(starText.split(" ")[0]);

        if (selectedRating === "all" || rating >= parseFloat(selectedRating)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});

sortSelect.addEventListener("change", () => {
    const sortValue = sortSelect.value;
    const cardArray = Array.from(cards);
    cardArray.sort((a, b) => {
        if (sortValue === "title-asc") {
            const titleA = a.querySelector(".review-card__title").innerText.toLowerCase();
            const titleB = b.querySelector(".review-card__title").innerText.toLowerCase();
            return titleA.localeCompare(titleB);
        }
        if (sortValue === "title-desc") {
            const nameA = a.querySelector(".reviewer-name").innerText.toLowerCase();
            const nameB = b.querySelector(".reviewer-name").innerText.toLowerCase();
            return nameB.localeCompare(nameA);
        }
        if (sortValue === "starts-desc") {
            const starA = parseFloat(a.querySelector(".review-card__stars span").innerText.split(" ")[0]);
            const starB = parseFloat(b.querySelector(".review-card__stars span").innerText.split(" ")[0]);
            return starB - starA;
        }

        if (sortValue === "newest") {
            const dateA = new Date(a.querySelector(".review-card__meta span:last-child").innerText);
            const dateB = new Date(b.querySelector(".review-card__meta span:last-child").innerText);
            return dateB - dateA
        }

        if (sortValue === "oldest") {
            const dateA = new Date(a.querySelector(".review-card__meta span:last-child").innerText);
            const dateB = new Date(b.querySelector(".review-card__meta span:last-child").innerText);
            return dateA - dateB
        }
        
        return 0;
    });

    const grid = document.querySelector(".review-grid");
    cardArray.forEach((card) => {
        grid.appendChild(card);
    }); 
});

