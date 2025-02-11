const $ = document.querySelector.bind(document);

const toggleBtn = $('#toggle'); 

toggleBtn.addEventListener('click', e => {
    if (toggleBtn.innerText === 'DARK') {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
        localStorage.setItem('darkMode', 'true');
    } else {
        document.documentElement.removeAttribute('theme');
        toggleBtn.innerText = 'DARK';
        localStorage.setItem('darkMode', 'false'); 
    }
});

window.onload = function () {
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
    } else {
        toggleBtn.innerText = 'DARK';
    }
};
