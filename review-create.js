console.log("review-create.js đang chạy");
const titleInput = document.querySelector("#review-title");
const descriptionInput = document.querySelector("#review-description");
const titleError = document.querySelector("#title-error");
const descriptionError = document.querySelector("#description-error");

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