// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active Link Highlighting & Sticky Navbar
const sections = document.querySelectorAll('section, header');
const navLi = document.querySelectorAll('.nav-links li a');
const scrollTopBtn = document.querySelector('.scroll-top');

window.onscroll = () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });

    // Scroll Top Button
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
};

// Typing Animation
const typeTextSpan = document.querySelector('.typewriter');
const textArray = ["Backend Engineer(with DB expertise)", "node.js Developer", "Tech Enthusiast"];
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typeTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typeTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, 1000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeTextSpan) setTimeout(type, 1000);

    // Scroll Reveal with Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    // Add hidden class to elements we want to animate
    // But in CSS I used direct animations for Hero.
    // Let's add simple reveal for other sections if needed.
    // For now, the CSS has animations on load for Hero. 
    // We can add a simple class 'reveal' to section contents later if desired.
});


// Contact Form Handling (Frontend Only)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            alert(`Thanks ${name}! Your message has been "sent" (Frontend Demo).`);
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}