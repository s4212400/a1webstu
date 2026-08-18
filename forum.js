const searchInput = document.querySelector(".search-input");
const sortSelect = document.querySelector("#sort-by");
const cards = document.querySelectorAll(".thread-card");

// Live search - filter threads by title as the user types
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    cards.forEach((card) => {
        const title = card.querySelector(".thread-card__title").innerText.toLowerCase();

        if (title.includes(keyword)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});

// Sort threads when the dropdown changes
sortSelect.addEventListener("change", () => {
    const sortValue = sortSelect.value;
    const cardArray = Array.from(cards);

    cardArray.sort((a, b) => {
        if (sortValue === "title-asc") {
            const titleA = a.querySelector(".thread-card__title").innerText.toLowerCase();
            const titleB = b.querySelector(".thread-card__title").innerText.toLowerCase();
            return titleA.localeCompare(titleB);
        }
        if (sortValue === "title-desc") {
            const titleA = a.querySelector(".thread-card__title").innerText.toLowerCase();
            const titleB = b.querySelector(".thread-card__title").innerText.toLowerCase();
            return titleB.localeCompare(titleA);
        }
        return 0;
    });

    const list = document.querySelector(".thread-list");
    cardArray.forEach((card) => {
        list.appendChild(card);
    });
});
