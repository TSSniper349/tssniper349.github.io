// Custom Cursor
const customCursor = document.getElementById("customCursor");
document.addEventListener("mousemove", (e) => {
    customCursor.style.left = e.clientX + "px";
    customCursor.style.top = e.clientY + "px";
});

// Scale custom cursor on hover over clickable elements
const clickableElements = document.querySelectorAll("a, button, .portfolio-card, .ripple, .magnetic, .back-to-top");
clickableElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
        customCursor.style.transform = "translate(-50%, -50%) scale(0.5)";
        customCursor.style.backgroundColor = "rgba(43, 60, 254, 0.8)"; // Brand color
    });
    el.addEventListener("mouseleave", () => {
        customCursor.style.transform = "translate(-50%, -50%) scale(1)";
        const isDark = document.body.classList.contains("dark-mode");
        customCursor.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)";
    });
});

// Magnetic Effect for Buttons
const magneticElements = document.querySelectorAll(".magnetic");
magneticElements.forEach(el => {
    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move the element slightly towards the cursor
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });

    el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0) scale(1)";
    });
});

// Typing Effect
const typingText = document.getElementById("typingText");
const words = ["technology.", "innovation.", "coding.", "design.", "solving problems."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
}

// Start typing effect when page loads
document.addEventListener("DOMContentLoaded", type);

// Dark/Light Mode Toggle with Sun/Moon Icon
const modeToggle = document.getElementById("modeToggle");
const toggleIcon = document.getElementById("toggleIcon");
modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    modeToggle.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark-mode");

    if (isDark) {
        toggleIcon.innerText = "🌙";
        customCursor.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    } else {
        toggleIcon.innerText = "☀️";
        customCursor.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    }
});

// Scroll Progress Bar
const scrollProgress = document.getElementById("scrollProgress");
const scrollContainer = document.querySelector('.scroll-container');

scrollContainer.addEventListener("scroll", () => {
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + "%";
});

// Sticky Navbar Animation on Scroll
scrollContainer.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (scrollContainer.scrollTop > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Scroll Reveal Animation using Intersection Observer
const observerOptions = {
    threshold: 0.15,
    root: scrollContainer
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Trigger Hacker Text Effect if it's a section header
            const header = entry.target.querySelector('h2');
            if (header) {
                hackTextEffect(header);
            }
        }
    });
}, observerOptions);

document.querySelectorAll(".section, .timeline-item").forEach(section => {
    observer.observe(section);
});


// Ripple Effect for Buttons
document.querySelectorAll(".ripple").forEach(button => {
    button.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        this.appendChild(ripple);
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});

// Particle Animation with Constellation Effect
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const isDark = document.body.classList.contains("dark-mode");
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";
        ctx.fill();
    }
}

function initParticles(num) {
    particles = [];
    for (let i = 0; i < num; i++) {
        particles.push(new Particle());
    }
}
initParticles(80);

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = document.body.classList.contains("dark-mode");

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Constellation effect: draw lines between nearby particles
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${1 - distance / 100})` : `rgba(0, 0, 0, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- Refactored Scroll Snap and Active Nav Logic ---
const sections = [...document.querySelectorAll('section')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
let currentSectionIndex = 0;
const OBSERVER_OPTIONS = { root: scrollContainer, rootMargin: '0px', threshold: 0.3 };

// IntersectionObserver to update active nav link and current section index
function initNavObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSectionIndex = sections.indexOf(entry.target);
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, OBSERVER_OPTIONS);
    sections.forEach(section => observer.observe(section));
}

// Revised snap logic
function handleSnap() {
    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return;

    const sectionTop = currentSection.offsetTop;
    const sectionHeight = currentSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const currentScroll = scrollContainer.scrollTop;
    const relativeScroll = currentScroll - sectionTop;

    // If section fits within viewport, always snap to top
    if (sectionHeight <= viewportHeight) {
        scrollContainer.scrollTo({ top: sectionTop, behavior: 'smooth' });
        return;
    }

    const scrollRange = sectionHeight - viewportHeight;
    const topThreshold = 50;
    const bottomThreshold = 50;
    const minScrollToLeaveTop = scrollRange * 0.2;

    if (relativeScroll < topThreshold || relativeScroll < minScrollToLeaveTop) {
        scrollContainer.scrollTo({ top: sectionTop, behavior: 'smooth' });
    } else if (relativeScroll > scrollRange - bottomThreshold) {
        scrollContainer.scrollTo({ top: sectionTop + scrollRange, behavior: 'smooth' });
    }
}

// Debounce scroll events to trigger snap when scrolling stops
let scrollEndTimeout;
scrollContainer.addEventListener('scroll', () => {
    clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(handleSnap, 500);
});

// Set up click events on nav links to scroll to the target section's top
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = sections.find(section => section.id === targetId);
        if (targetSection) {
            scrollContainer.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
        }
    });
});

// --- Advanced Features ---

// Spotlight Hover Effect
const glassCards = document.querySelectorAll('.glass');
glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

// 3D Tilt Effect
const tiltCards = document.querySelectorAll('.portfolio-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation based on mouse position
        const xPct = x / rect.width;
        const yPct = y / rect.height;

        const xRot = (yPct - 0.5) * 20; // -10 to 10 deg
        const yRot = (xPct - 0.5) * -20; // -10 to 10 deg

        card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Hacker Text Effect
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function hackTextEffect(element) {
    let iteration = 0;
    const originalText = element.dataset.value || element.innerText;
    element.dataset.value = originalText; // Store original text

    let interval = setInterval(() => {
        element.innerText = originalText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return originalText[index];
                }
                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        if (iteration >= originalText.length) {
            clearInterval(interval);
        }

        iteration += 1 / 3;
    }, 30);
}

// Trigger hacker text on hover for headers
document.querySelectorAll('h2').forEach(header => {
    header.addEventListener('mouseenter', () => hackTextEffect(header));
});

// Back to Top Button Logic
const backToTopBtn = document.getElementById('backToTop');
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
}

scrollContainer.addEventListener('scroll', () => {
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    setProgress(scrollPercent);

    if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
});


// Initialize features
function init() {
    initNavObserver();
}
init();
