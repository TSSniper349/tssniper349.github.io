// Custom Cursor
const customCursor = document.getElementById("customCursor");
document.addEventListener("mousemove", (e) => {
  customCursor.style.left = e.clientX + "px";
  customCursor.style.top = e.clientY + "px";
});

// Scale custom cursor on hover over clickable elements
const clickableElements = document.querySelectorAll("a, button, .portfolio-card, .ripple");
clickableElements.forEach(el => {
  el.addEventListener("mouseenter", () => {
    customCursor.style.transform = "translate(-50%, -50%) scale(0.5)";
  });
  el.addEventListener("mouseleave", () => {
    customCursor.style.transform = "translate(-50%, -50%) scale(1)";
  });
});

// Dark/Light Mode Toggle with Sun/Moon Icon
const modeToggle = document.getElementById("modeToggle");
const toggleIcon = document.getElementById("toggleIcon");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  modeToggle.classList.toggle("dark");
  if(document.body.classList.contains("dark-mode")){
    toggleIcon.innerText = "🌙";
  } else {
    toggleIcon.innerText = "☀️";
  }
});

// Sticky Navbar Animation on Scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
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

// Tilt Effect on Elements with Class "tilt"
document.querySelectorAll(".tilt").forEach(el => {
  el.addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotY = ((x - rect.width / 2) / rect.width) * 10;
    const rotX = ((y - rect.height / 2) / rect.height) * -10;
    this.style.transform = `perspective(500px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;
  });
  el.addEventListener("mouseleave", function () {
    this.style.transform = "perspective(500px) rotateX(0deg) rotateY(0deg)";
  });
});

// Particle Animation with Adaptive Color
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.radius = Math.random() * 2 + 1;
  this.speedX = Math.random() * 0.5 - 0.25;
  this.speedY = Math.random() * 0.5 - 0.25;
}
Particle.prototype.update = function() {
  this.x += this.speedX;
  this.y += this.speedY;
  if(this.x < 0 || this.x > canvas.width) this.speedX *= -1;
  if(this.y < 0 || this.y > canvas.height) this.speedY *= -1;
};
Particle.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  const isDark = document.body.classList.contains("dark-mode");
  ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";
  ctx.fill();
};
function initParticles(num) {
  particles = [];
  for(let i = 0; i < num; i++){
    particles.push(new Particle());
  }
}
initParticles(100);
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// --- Refactored Scroll Snap and Active Nav Logic ---
const scrollContainer = document.querySelector('.scroll-container');
const sections = [...document.querySelectorAll('section')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
let currentSectionIndex = 0;
const OBSERVER_OPTIONS = { root: null, rootMargin: '0px', threshold: 0.3 };

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

// Revised snap logic: only snap if near top or if scrolled beyond minimum threshold
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
  const topThreshold = 50;         // within 50px of top → snap to top
  const bottomThreshold = 50;      // within 50px of bottom → snap to bottom
  const minScrollToLeaveTop = scrollRange * 0.2; // must scroll at least 20% down to allow leaving top
  
  if (relativeScroll < topThreshold || relativeScroll < minScrollToLeaveTop) {
    // Not scrolled far enough from the top: snap back to top of section
    scrollContainer.scrollTo({ top: sectionTop, behavior: 'smooth' });
  } else if (relativeScroll > scrollRange - bottomThreshold) {
    // If near bottom, snap so the bottom aligns with viewport bottom
    scrollContainer.scrollTo({ top: sectionTop + scrollRange, behavior: 'smooth' });
  }
  // Otherwise, let the user scroll freely within the section.
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

// Initialize features
function init() {
  initNavObserver();
}
init();