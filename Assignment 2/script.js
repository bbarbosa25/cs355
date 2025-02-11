const $ = document.querySelector.bind(document);

const toggleBtn = $('#toggle'); // Ensure correct selection using #

toggleBtn.addEventListener('click', e => {
    if (toggleBtn.innerText === 'DARK') {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
        localStorage.setItem('darkMode', 'true'); // Save dark mode state
    } else {
        document.documentElement.removeAttribute('theme');
        toggleBtn.innerText = 'DARK';
        localStorage.setItem('darkMode', 'false'); // Save light mode state
    }
});

// Load dark mode setting from LocalStorage when the page loads
window.onload = function () {
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
    } else {
        toggleBtn.innerText = 'DARK';
    }
};
