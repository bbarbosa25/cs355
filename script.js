// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Feature Modal
function showFeatureDetails(title, details) {
  document.getElementById('featureDetails').innerHTML = details;
  const modal = document.getElementById('featureModal');
  modal.style.display = 'flex';
}
function closeModal() {
  const modal = document.getElementById('featureModal');
  modal.style.display = 'none';
}

// Contact Form Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;
    const errorMessage = document.getElementById('formError');

    if (!name || !email || !message) {
      errorMessage.style.display = 'block';
    } else {
      errorMessage.style.display = 'none';
      alert('Thank you for contacting us!');
    }
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load saved theme on page load
window.onload = () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
};
