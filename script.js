// ===== Mobile Navigation Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for navbar links that include a hash (e.g. index.html#contact)
// This keeps the site behaving like a single-page scroll experience on index.html.
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href') || '';
        if (!href.includes('#')) return;

        function isHomePagePath(pathname) {
            // Supports:
            // - /judy-portfolio/
            // - /judy-portfolio/index.html
            // - / (local)
            // - /index.html
            const clean = (pathname || '').replace(/\/+/g, '/');
            if (clean === '/' || clean === '') return true;
            if (clean.endsWith('/')) {
                const parts = clean.split('/').filter(Boolean);
                return parts.length === 0 || (parts.length === 1 && parts[0] === 'judy-portfolio');
            }
            return clean.endsWith('/index.html') || clean.endsWith('index.html');
        }

        // Only intercept hash navigation when we're already on the home page
        if (!isHomePagePath(window.location.pathname)) return;

        const hashPart = href.slice(href.indexOf('#'));
        if (!hashPart || hashPart === '#') return;

        const target = document.querySelector(hashPart);
        if (!target) return;

        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });

        // Immediately reflect active state on click
        try {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        } catch (err) {
            // ignore
        }
    });
});

// ===== Smooth Scrolling for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Immediately set the nav link active when an in-page anchor is clicked
        try {
            const href = this.getAttribute('href');
            const navToActivate = Array.from(document.querySelectorAll('.nav-link')).find(l => {
                return normalizeToHash(l.getAttribute('href')) === href;
            });
            if (navToActivate) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                navToActivate.classList.add('active');
            }
        } catch (err) {
            // ignore selector errors
        }
    });
});

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 30px rgba(177, 156, 217, 0.3)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(177, 156, 217, 0.2)';
    }
});

// ===== Portfolio Filter Functionality =====
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

function updatePortfolioGridColumns() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid || !portfolioItems.length) return;

    // Count currently visible items (works with filtering via display: none)
    const visibleCount = Array.from(portfolioItems).filter(item => {
        return item.style.display !== 'none';
    }).length;

    // Requirement: fewer than 3 cards => 2 columns; 3+ cards => 3 columns
    portfolioGrid.classList.toggle('cols-2', visibleCount < 3);
    portfolioGrid.classList.toggle('cols-3', visibleCount >= 3);
}

function applyPortfolioFilter(filterValue) {
    if (!filterButtons.length || !portfolioItems.length) return;

    filterButtons.forEach(btn => {
        const btnFilter = btn.getAttribute('data-filter');
        btn.classList.toggle('active', btnFilter === filterValue);
    });

    portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease';
        } else {
            item.style.display = 'none';
        }
    });

    updatePortfolioGridColumns();
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');

        applyPortfolioFilter(filterValue);
    });
});

// ===== Skill Progress Bars Animation =====
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
};

// Trigger skill bar animation when skills section is visible
const skillsSection = document.querySelector('.skills');
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ===== Scroll Animations =====
const fadeElements = document.querySelectorAll('.about-content, .portfolio-item, .skill-category, .contact-item');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    element.classList.add('fade-in');
    fadeObserver.observe(element);
});

// ===== Contact Form Handling =====
const contactForm = document.querySelector('.contact-form');

if (contactForm && contactForm.id !== 'contact-form-emailjs') {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name && email && message) {
            // Create mailto link (you can replace this with actual form submission)
            const mailtoLink = `mailto:your.email@example.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(email)}`;
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Thank you! Your message has been sent.', 'success');
            
            // Reset form
            contactForm.reset();
        } else {
            showNotification('Please fill in all fields.', 'error');
        }
    });
}

// ===== Notification System =====
const showNotification = (message, type = 'success') => {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#B19CD9' : '#e74c3c'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
};

// Add animation keyframes for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Active Navigation Link Highlighting =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function normalizeToHash(href) {
    if (!href) return '';
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return '';
    return href.slice(hashIndex);
}

const highlightActiveSection = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHash = normalizeToHash(link.getAttribute('href'));
                if (linkHash === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

// Update active nav link based on the section currently in view (scrollspy)
if (sections.length && navLinks.length) {
    window.addEventListener('scroll', highlightActiveSection);
}

// Set active nav item on initial load based on current page or hash
function setActiveNavOnLoad() {
    const currentPath = window.location.pathname || '/';

    function getPageKeyFromPath(pathname) {
        // Returns: 'home', 'about', 'portfolio', 'skills', etc.
        const clean = (pathname || '').replace(/\/+/g, '/');
        const parts = clean.split('/').filter(Boolean);

        // GitHub Pages project site: /judy-portfolio/<page>/
        const startIndex = (parts[0] === 'judy-portfolio') ? 1 : 0;
        const page = parts[startIndex] || '';

        if (!page || page === 'index.html') return 'home';
        if (page.endsWith('.html')) return page.replace(/\.html$/i, '');
        return page;
    }

    function getPageKeyFromHref(href) {
        if (!href) return '';
        if (href.startsWith('#')) return 'home';
        const withoutHash = href.split('#')[0];
        // allow absolute and relative hrefs
        const fakeBase = window.location.origin + (window.location.pathname.startsWith('/judy-portfolio') ? '/judy-portfolio/' : '/');
        let url;
        try {
            url = new URL(withoutHash, fakeBase);
        } catch (e) {
            return '';
        }
        return getPageKeyFromPath(url.pathname);
    }

    const currentKey = getPageKeyFromPath(currentPath);
    // First, try to activate by hash if present
    if (window.location.hash) {
        const byHash = Array.from(document.querySelectorAll('.nav-link')).find(l => {
            return normalizeToHash(l.getAttribute('href')) === window.location.hash;
        });
        if (byHash) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            byHash.classList.add('active');
            return;
        }
    }

    // Otherwise, match by filename
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (!href) return;
        // skip anchors (handled above)
        if (href.startsWith('#')) return;

        const linkKey = getPageKeyFromHref(href);
        if (linkKey && linkKey === currentKey) link.classList.add('active');
    });
}

// Run on load so the correct menu item is highlighted immediately
setActiveNavOnLoad();

// Also run once after initial paint so the correct section is highlighted if the page loads mid-scroll
if ((window.location.pathname || '').endsWith('/index.html') || (window.location.pathname || '').endsWith('index.html') || (window.location.pathname || '').endsWith('/judy-portfolio/') || (window.location.pathname || '') === '/' || (window.location.pathname || '') === '') {
    window.addEventListener('load', () => {
        try { highlightActiveSection(); } catch (e) { /* ignore */ }
    });
}

// If we land on a deep-link anchor in the Portfolio page, ensure the correct filter is applied
// and scroll smoothly with navbar offset.
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) return;

    const rawHash = window.location.hash;
    const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;

    if (hash === 'content-creation') {
        applyPortfolioFilter('content');
    }

    const target = document.getElementById(hash);
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
});

// ===== Add active state styles for nav links =====
const navLinkStyle = document.createElement('style');
navLinkStyle.textContent = `
    .nav-link.active {
        color: var(--purple-primary);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(navLinkStyle);


// ===== Parallax Effect for Hero Section =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== Typing Effect for Hero Title (Optional Enhancement) =====
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Uncomment below to enable typing effect (optional)
// const heroTitle = document.querySelector('.hero-title');
// if (heroTitle) {
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 50);
// }

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    // Global bubble background layer (applies to all pages)
    if (!document.querySelector('.global-bubbles')) {
        const bubbles = document.createElement('div');
        bubbles.className = 'global-bubbles';
        bubbles.setAttribute('aria-hidden', 'true');

        for (let i = 1; i <= 4; i++) {
            const bubble = document.createElement('div');
            bubble.className = `global-bubble bubble-${i}`;
            bubbles.appendChild(bubble);
        }

        document.body.insertBefore(bubbles, document.body.firstChild);
    }

    updatePortfolioGridColumns();

    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Smooth scroll to top on logo click
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ===== Add Loading Animation (Optional) =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

