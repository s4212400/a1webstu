const titleInput = document.querySelector("#thread-title");
const contentInput = document.querySelector("#thread-content");
const titleError = document.querySelector("#title-error");
const contentError = document.querySelector("#content-error");
const form = document.querySelector("form");

// Live validation - title
titleInput.addEventListener("input", () => {
    if (titleInput.value.trim() === "") {
        titleError.textContent = "Thread title is required.";
    } else {
        titleError.textContent = "";
    }
});

// Live validation - content
contentInput.addEventListener("input", () => {
    if (contentInput.value.trim().length < 10) {
        contentError.textContent = "Content must be at least 10 characters.";
    } else {
        contentError.textContent = "";
    }
});

// Check everything again on submit, block if invalid
form.addEventListener("submit", (event) => {
    let hasError = false;

    if (titleInput.value.trim() === "") {
        titleError.textContent = "Thread title is required.";
        hasError = true;
    }

    if (contentInput.value.trim().length < 10) {
        contentError.textContent = "Content must be at least 10 characters.";
        hasError = true;
    }

    if (hasError) {
        event.preventDefault();
    }
});
