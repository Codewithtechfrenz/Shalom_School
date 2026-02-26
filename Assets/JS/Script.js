// ========== PARTICLES.JS CONFIGURATION ==========
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#4f46e5'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#7c3aed',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });
}

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle?.addEventListener('click', function() {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update particles color based on theme
    updateParticlesTheme(newTheme);
});

function updateParticlesTheme(theme) {
    if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
        const particleColor = theme === 'dark' ? '#60a5fa' : '#4f46e5';
        const lineColor = theme === 'dark' ? '#a78bfa' : '#7c3aed';
        
        pJSDom[0].pJS.particles.color.value = particleColor;
        pJSDom[0].pJS.particles.line_linked.color = lineColor;
        pJSDom[0].pJS.fn.particlesRefresh();
    }
}



// ========== HERO SLIDER ==========
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let slideTimer;

function showSlide(n) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));

    currentSlide = (n + slides.length) % slides.length;
    const activeSlide = slides[currentSlide];

    activeSlide?.classList.add('active');

    // Clear previous timer
    clearTimeout(slideTimer);

    // Check if slide contains video
    const video = activeSlide.querySelector('video');

    if (video) {
        video.currentTime = 0;
        video.play();
        slideTimer = setTimeout(nextSlide, 10000); // 12 seconds for video
    } else {
        slideTimer = setTimeout(nextSlide, 5000); // 5 seconds for image
    }
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Start slider
if (slides.length > 0) {
    showSlide(0);
}



// ========== SCROLL ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 1s ease, transform 1s ease';
    observer.observe(el);
});

// ========== SCROLL TO TOP BUTTON ==========
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn?.classList.add('visible');
    } else {
        scrollTopBtn?.classList.remove('visible');
    }
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== CHAT WIDGET ==========
const chatWidget = document.getElementById('chatWidget');
const chatPopup = document.getElementById('chatPopup');
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

chatWidget?.addEventListener('click', (e) => {
    if (!isDragging) {
        chatPopup?.classList.toggle('active');
    }
});

// Make chat widget draggable
chatWidget?.addEventListener('mousedown', dragStart);
chatWidget?.addEventListener('touchstart', dragStart);

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);

document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchend', dragEnd);

function dragStart(e) {
    if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.target === chatWidget || chatWidget?.contains(e.target)) {
        isDragging = true;
        // Close popup when starting to drag
        chatPopup?.classList.remove('active');
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, chatWidget);
        
        // Keep popup positioned relative to widget
        if (chatPopup) {
            chatPopup.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    
    setTimeout(() => {
        isDragging = false;
    }, 100);
}

function setTranslate(xPos, yPos, el) {
    if (el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
}

// Close chat popup when clicking outside
document.addEventListener('click', (e) => {
    if (!chatWidget?.contains(e.target) && !chatPopup?.contains(e.target)) {
        chatPopup?.classList.remove('active');
    }
});

// ========== ENQUIRY FORM SUBMISSION ==========
const enquiryForm = document.querySelector('.enquiry-form');

enquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    
    // Show success message
    alert('Thank you for your enquiry! We will get back to you soon.');
    
    // Reset form
    e.target.reset();
});

// ========== SMOOTH SCROLL FOR NAVIGATION ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for anchor links
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});















// ========== ACADEMICS PAGE - SIDE MENU TABS ==========
document.addEventListener("DOMContentLoaded", function () {

    function showSection(id, card){
        document.querySelectorAll('.program-body').forEach(s => 
            s.classList.remove('active')
        );

        document.querySelectorAll('.service-card').forEach(c => 
            c.classList.remove('active')
        );

        const section = document.getElementById(id);
        if(section){
            section.classList.add('active');
        }

        if(card){
            card.classList.add('active');
        }
    }

    const animatedElements = document.querySelectorAll("[data-animate]");

    function animateOnScroll() {
        const triggerBottom = window.innerHeight - 100;

        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const animationClass = el.getAttribute("data-animate");

            if (rect.top < triggerBottom && rect.bottom > 0) {
                el.classList.add(animationClass);
            } else {
                el.classList.remove(animationClass);
            }
        });
    }

    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll();

    function showProgram(id) {

        document.querySelectorAll(".program-body").forEach(section => {
            section.classList.remove("active");
        });

        const selected = document.getElementById(id);
        if (selected) {
            selected.classList.add("active");
        }
    }

    // Make functions global (important for onclick in HTML)
    window.showSection = showSection;
    window.showProgram = showProgram;

    // Safe tsParticles load (prevents JS crash)
    if (typeof tsParticles !== "undefined") {
        tsParticles.load("particles-bg", {
            background: {
                color: "transparent"
            },
            particles: {
                number: { value: 85 },
                color: { value: "#4f46e5" },
                shape: { type: "circle" },
                opacity: { value: 0.4 },
                size: { value: 2 },
                links: {
                    enable: true,
                    distance: 100,
                    color: "#4f46e5",
                    opacity: 0.25,
                    width: 2
                },
                move: {
                    enable: true,
                    speed: 1.2
                }
            }
        });
    }

});

















// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question?.addEventListener('click', () => {
        // Close all other FAQs
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current FAQ
        item.classList.toggle('active');
    });
});




// ========== GALLERY TABS ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
 
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
       
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
       
        // Add active class to clicked
        btn.classList.add('active');
        document.getElementById(target)?.classList.add('active');
    });
});
 




// ========== HOVER EFFECTS FOR CARDS ==========
const cards = document.querySelectorAll('.glass-card, .academic-card, .step-card, .facility-card, .blog-card, .process-card, .vision-card, .mission-card, .management-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========== ACTIVE NAVIGATION HIGHLIGHT ==========
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== DYNAMIC YEAR IN FOOTER ==========
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.textContent = footerYear.textContent.replace('2024', currentYear);
}

// ========== LAZY LOADING IMAGES ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== HEADER BACKGROUND ON SCROLL ==========
const header = document.querySelector('.glass-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header?.style.setProperty('background', 'rgba(255, 255, 255, 0.95)');
        header?.style.setProperty('box-shadow', '0 10px 40px rgba(0, 0, 0, 0.15)');
    } else {
        header?.style.setProperty('background', 'var(--header-bg)');
        header?.style.setProperty('box-shadow', '0 8px 32px 0 rgba(31, 38, 135, 0.1)');
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 500) {
        header?.style.setProperty('transform', 'translateY(-100%)');
    } else {
        header?.style.setProperty('transform', 'translateY(0)');
    }
    
    lastScroll = currentScroll;
});

// ========== ANIMATION ON PAGE LOAD ==========
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger animations
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animationDelay = `${index * 0.1}s`;
        }, 100);
    });
});

// ========== PREVENT FORM RESUBMISSION ==========
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ========== MOBILE MENU TOGGLE (if needed in future) ==========
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-container');

mobileMenuBtn?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
});

// ========== CUSTOM CURSOR EFFECT (Optional Enhancement) ==========
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const speed = 0.2;
    
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Enlarge cursor on hover over clickable elements
const clickables = document.querySelectorAll('a, button, .card, input, textarea');
clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});



// ========== NUMBER COUNTER ANIMATION ==========
const counters = document.querySelectorAll('.counter');

const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            el.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            el.textContent = target;
        }
    };
    
    updateCounter();
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// ========== CONSOLE EASTER EGG ==========
console.log('%c🎓 Shalom Matriculation Higher Secondary School', 'font-size: 20px; color: #4f46e5; font-weight: bold;');
console.log('%cWelcome to our website! We are committed to providing quality education since 1984.', 'font-size: 14px; color: #7c3aed;');
console.log('%c📞 Contact us: +91 98765 43210', 'font-size: 12px; color: #f59e0b;');

// ========== PERFORMANCE OPTIMIZATION ==========
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Scroll-dependent operations here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ========== SERVICE WORKER (PWA Support - Optional) ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// ========== ACCESSIBILITY ENHANCEMENTS ==========
// Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ========== END OF SCRIPT ==========
console.log('%c✨ Website loaded successfully!', 'font-size: 16px; color: #10b981; font-weight: bold;');












/* ============================= */
/* SAFE HAMBURGER FIX */
/* ============================= */

document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileClose = document.getElementById("mobileClose");
    const overlay = document.getElementById("overlay");

    if (hamburger && mobileMenu && overlay) {

        /* OPEN MENU */
        hamburger.addEventListener("click", function () {
            hamburger.classList.toggle("active");   // ✅ FIXED
            mobileMenu.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        if (mobileClose) {
            mobileClose.addEventListener("click", function () {
                hamburger.classList.remove("active");  // ✅ FIXED
                mobileMenu.classList.remove("active");
                overlay.classList.remove("active");
            });
        }

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                hamburger.classList.remove("active");  // ✅ FIXED
                mobileMenu.classList.remove("active");
                overlay.classList.remove("active");
            }
        });

        const menuLinks = mobileMenu.querySelectorAll("a");

        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");  // ✅ FIXED
                mobileMenu.classList.remove("active");
                overlay.classList.remove("active");
            });
        });
    }
});



/**Chat Popup**/ 
document.addEventListener("DOMContentLoaded", function () {

    const chatWidget = document.querySelector(".chat-widget");
    const chatPopup = document.querySelector(".chat-popup");

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    function positionPopup() {
        const rect = chatWidget.getBoundingClientRect();
        chatPopup.style.left = rect.left + "px";
        chatPopup.style.top = (rect.top - chatPopup.offsetHeight - 15) + "px";
        chatPopup.style.right = "auto";
        chatPopup.style.bottom = "auto";
    }

    /* ======================
       CLICK (Single Click)
    ====================== */
    chatWidget.addEventListener("click", function (e) {
        if (!isDragging) {
            chatPopup.classList.toggle("active");

            if (chatPopup.classList.contains("active")) {
                positionPopup();
            }
        }
    });

    /* ======================
       DRAG START
    ====================== */
    chatWidget.addEventListener("mousedown", function (e) {
        startX = e.clientX;
        startY = e.clientY;

        const rect = chatWidget.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        isDragging = false;

        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);
    });

    function dragMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            isDragging = true;

            chatWidget.style.left = (e.clientX - offsetX) + "px";
            chatWidget.style.top = (e.clientY - offsetY) + "px";
            chatWidget.style.right = "auto";
            chatWidget.style.bottom = "auto";

            if (chatPopup.classList.contains("active")) {
                positionPopup();
            }
        }
    }

    function dragEnd() {
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("mouseup", dragEnd);

        setTimeout(() => {
            isDragging = false;
        }, 10);
    }

    /* ======================
       TOUCH SUPPORT (Mobile)
    ====================== */
    chatWidget.addEventListener("touchstart", function (e) {
        const touch = e.touches[0];

        startX = touch.clientX;
        startY = touch.clientY;

        const rect = chatWidget.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        isDragging = false;

        document.addEventListener("touchmove", touchMove);
        document.addEventListener("touchend", touchEnd);
    });

    function touchMove(e) {
        const touch = e.touches[0];

        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            isDragging = true;

            chatWidget.style.left = (touch.clientX - offsetX) + "px";
            chatWidget.style.top = (touch.clientY - offsetY) + "px";
            chatWidget.style.right = "auto";
            chatWidget.style.bottom = "auto";

            if (chatPopup.classList.contains("active")) {
                positionPopup();
            }
        }
    }

    function touchEnd() {
        document.removeEventListener("touchmove", touchMove);
        document.removeEventListener("touchend", touchEnd);

        setTimeout(() => {
            isDragging = false;
        }, 10);
    }

});


// Facilities//
    const bannerContent = document.querySelector(".banner-content");

const services = document.querySelectorAll(".service-card");

function animateOnScroll() {
  const triggerBottom = window.innerHeight - 100;

  services.forEach(card => {
    const rect = card.getBoundingClientRect();

    if (rect.top < triggerBottom && rect.bottom > 0) {
      card.classList.add("fade-in-down");
    } else {
      card.classList.remove("fade-in-down");
    }
  });
}

window.addEventListener("scroll", animateOnScroll);
animateOnScroll();
function animateOnScroll() {
  const triggerBottom = window.innerHeight - 100;

  /* ===== BANNER ===== */
  const bannerRect = bannerContent.getBoundingClientRect();
  if (bannerRect.top < triggerBottom) {
    bannerContent.classList.add("fade-in-left");
  } else {
    bannerContent.classList.remove("fade-in-left");
  }

  /* ===== SERVICES ===== */
  services.forEach(card => {
    const rect = card.getBoundingClientRect();

    if (rect.top < triggerBottom && rect.bottom > 0) {
      card.classList.add("fade-in-down");
    } else {
      card.classList.remove("fade-in-down");
    }
  });
}


tsParticles.load("particles-bg", {
    background: {
        color: "transparent"
    },
    particles: {
        number: { value: 105 },

        color: { value: "#4f46e5" },

        shape: { type: "circle" },

        opacity: { value: 0.4 },

        size: { 
            value: 2   // 👈 small dots
        },

        links: {
            enable: true,
            distance: 100,   // 👈 shorter lines
            color: "#4f46e5",
            opacity: 0.25,
            width: 2        // 👈 thin line
        },

        move: {
            enable: true,
            speed: 1.2
        }
    }
});


// Video Play Button//
document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.stopPropagation();

        const videoContainer = this.closest('.video-thumbnail');
        const video = videoContainer.querySelector('video');

        // Pause all other videos
        document.querySelectorAll('video').forEach(v => {
            if (v !== video) {
                v.pause();
                v.currentTime = 0;
                v.parentElement.querySelector('.play-btn').style.display = "flex";
            }
        });

        video.play();
        this.style.display = "none";

        video.controls = true;
        video.style.pointerEvents = "auto";
    });
});


/* ==========================================
   DARK MODE PARTICLES ONLY
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  function loadDarkParticles() {

    // Destroy existing particles if any
    if (window.pJSDom && window.pJSDom.length) {
      window.pJSDom[0].pJS.fn.vendors.destroypJS();
      window.pJSDom = [];
    }

    particlesJS("particles-js", {
      particles: {
        number: {
          value: 90,
          density: {
            enable: true,
            value_area: 1000
          }
        },
        color: {
          value: "#ffffff"   // Bright white for dark mode
        },
        shape: {
          type: "circle"
        },
        opacity: {
          value: 0.7,
          random: true
        },
        size: {
          value: 4,
          random: true
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.5,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.8,        // slower = premium look
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          repulse: {
            distance: 120,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  }

  // Run only if dark mode is active
  if (document.body.getAttribute("data-theme") === "dark") {
    loadDarkParticles();
  }

  // Reload when theme toggles
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      setTimeout(function () {
        if (document.body.getAttribute("data-theme") === "dark") {
          loadDarkParticles();
        }
      }, 100);
    });
  }

});

