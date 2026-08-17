const titleInput = document.querySelector("#review-title");
const descriptionInput = document.querySelector("#review-description");
const titleError = document.querySelector("#title-error");
const descriptionError = document.querySelector("#description-error");
const form = document.querySelector("form");
const productSelect = document.querySelector("#product-select");
const productError = document.querySelector("#product-error");
const ratingError = document.querySelector("#rating-error");
const ratingInputs = document.querySelectorAll('input[name="rating"]');

titleInput.addEventListener("input", () => {
    if (titleInput.value.trim() === "") {
        titleError.textContent = "Review title is required.";
    } else {
        titleError.textContent = "";
    }
});

descriptionInput.addEventListener("input", () => {
    if (descriptionInput.value.trim().length < 10) {
        descriptionError.textContent = "Description must be at least 10 characters.";
    } else {
        descriptionError.textContent = "";
    }
});

form.addEventListener("submit", (event) => {
    let hasError = false;

    if (titleInput.value.trim() === "") {
        titleError.textContent = "Review title is required.";
        hasError = true;
    }

    if (descriptionInput.value.trim().length < 10) {
        descriptionError.textContent = "Description must be at least 10 characters.";
        hasError = true;
    }

    if (productSelect.value === "") {
        productError.textContent = "Please select a product.";
        hasError = true;
    }

    const ratingChecked = document.querySelector('input[name="rating"]:checked');
    if (!ratingChecked) {
        ratingError.textContent = "Please select a rating.";
        hasError = true;
    }

     if (hasError) {
        event.preventDefault();
    }
});

productSelect.addEventListener("change", () => {
    if (productSelect.value !== "") {
        productError.textContent = "";
    }
});

ratingInputs.forEach((star) => {
    star.addEventListener("change", () => {
        ratingError.textContent = "";
    });
});

