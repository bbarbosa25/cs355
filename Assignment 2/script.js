const toggleBtn = document.querySelector("#toggle");

// Function to toggle dark mode
function toggleDarkMode() {
    if (document.documentElement.hasAttribute("theme")) {
        document.documentElement.removeAttribute("theme");
        localStorage.setItem("darkMode", "false");
    } else {
        document.documentElement.setAttribute("theme", "dark");
        localStorage.setItem("darkMode", "true");
    }
}

// Event listener for dark mode toggle
toggleBtn.addEventListener("click", toggleDarkMode);

// Load dark mode setting from LocalStorage
window.onload = function() {
    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.setAttribute("theme", "dark");
    }
};
