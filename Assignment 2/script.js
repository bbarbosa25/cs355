const $ = document.querySelector.bind(document);

<<<<<<< HEAD
const toggleBtn = $('#toggle'); // Ensure correct selection using #
=======
const toggleBtn = $('#toggle'); 
>>>>>>> 6e78fa8981d784f61e884459e2cd9bc74c17d53b

toggleBtn.addEventListener('click', e => {
    if (toggleBtn.innerText === 'DARK') {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
<<<<<<< HEAD
        localStorage.setItem('darkMode', 'true'); // Save dark mode state
    } else {
        document.documentElement.removeAttribute('theme');
        toggleBtn.innerText = 'DARK';
        localStorage.setItem('darkMode', 'false'); // Save light mode state
    }
});

// Load dark mode setting from LocalStorage when the page loads
=======
        localStorage.setItem('darkMode', 'true');
    } else {
        document.documentElement.removeAttribute('theme');
        toggleBtn.innerText = 'DARK';
        localStorage.setItem('darkMode', 'false'); 
    }
});

>>>>>>> 6e78fa8981d784f61e884459e2cd9bc74c17d53b
window.onload = function () {
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
    } else {
        toggleBtn.innerText = 'DARK';
    }
};
