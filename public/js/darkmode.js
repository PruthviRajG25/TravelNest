const toggle = document.querySelector("#darkModeToggle");
const html = document.querySelector("html");

// 1. Check for saved preference on load
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-bs-theme", savedTheme);
toggle.checked = savedTheme === "dark";

// 2. Listen for toggle changes
toggle.addEventListener("change", () => {
    if (toggle.checked) {
        html.setAttribute("data-bs-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        html.setAttribute("data-bs-theme", "light");
        localStorage.setItem("theme", "light");
    }
});