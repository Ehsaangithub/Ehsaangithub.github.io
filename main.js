/* ============================================================
   M AHSAN ANSARI — WEBSITE JAVASCRIPT
   All interactive features in one clean, optimized file.
   Vanilla JS only — zero dependencies.
   ============================================================ */

'use strict';

/* ============================================================
   HELPER: Wait for DOM to be fully ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    /* Run all features */
    initLoader();
    initTheme();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initParticles();
    initFAQ();
    initPricingTabs();
    initPortfolioFilter();
    initBackToTop();
    initSmoothScroll();
    initContactForm();
    initFooterYear();

});


/* ============================================================
   1. LOADING SCREEN
   Animates a progress bar then fades out.
   ============================================================ */
function initLoader() {
    const loader   = document.getElementById('loader');
    const bar      = document.getElementById('loader-bar');

    if (!loader || !bar) return;

    let progress = 0;

    /* Simulate loading progress */
    const interval = setInterval(() => {
        progress += Math.random() * 18 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            bar.style.width = '100%';

            /* Fade out after a short pause */
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                    /* Trigger entrance animations */
                    document.body.classList.add('loaded');
                }, 600);
            }, 300);
        }
        bar.style.width = progress + '%';
    }, 60);
}


/* ============================================================
   2. DARK / LIGHT THEME TOGGLE
   Saves preference to localStorage.
   ============================================================ */
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const html   = document.documentElement;

    /* Load saved preference (default: dark) */
    const saved = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', saved);

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        /* Update aria-label */
        toggle.setAttribute('aria-label',
            next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    });
}


/* ============================================================
   3. STICKY NAVBAR
   Adds 'scrolled' class when page scrolls down.
   Highlights active nav link based on scroll position.
   ============================================================ */
function initNavbar() {
    const navbar  = document.getElementById('navbar');
    const links   = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    if (!navbar) return;

    /* Add scrolled class at 60px */
    function updateNavStyle() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /* Highlight the nav link whose section is in view */
    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            const section = link.getAttribute('data-section');
            if (section && section === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        updateNavStyle();
        updateActiveLink();
    }, { passive: true });

    updateNavStyle();
    updateActiveLink();
}


/* ============================================================
   4. MOBILE MENU
   Opens/closes full-screen overlay.
   Traps focus inside menu when open.
   ============================================================ */
function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const closeBtn   = document.getElementById('mobile-close');
    const menu       = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-cta');

    if (!hamburger || !menu) return;

    function openMenu() {
        menu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        closeBtn && closeBtn.focus();
    }

    function closeMenu() {
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
    }

    hamburger.addEventListener('click', openMenu);
    closeBtn && closeBtn.addEventListener('click', closeMenu);

    /* Close when a link is clicked */
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* Close on Escape key */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            closeMenu();
        }
    });

    /* Close on backdrop click */
    menu.addEventListener('click', e => {
        if (e.target === menu) closeMenu();
    });
}


/* ============================================================
   5. SCROLL ANIMATIONS
   Uses IntersectionObserver to add 'animated' class
   when elements enter the viewport.
   ============================================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                /* Stop observing after animation (performance) */
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}


/* ============================================================
   6. ANIMATED COUNTERS
   Counts up from 0 to target number when stats section
   enters the viewport.
   ============================================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 1800; /* ms */
    const start    = performance.now();

    function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);

        /* Ease-out cubic */
        const eased  = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target + suffix;
        }
    }

    requestAnimationFrame(step);
}


/* ============================================================
   7. PARTICLES CANVAS
   Lightweight floating particles with connecting lines.
   Mouse-interactive on desktop. Reduced on mobile.
   ============================================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const count  = isMobile ? 35 : 75;

    let W, H, particles, mouse;

    /* Set canvas size */
    function resize() {
        const hero = document.getElementById('hero');
        W = canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
        H = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
    }

    /* Particle factory */
    function makeParticle() {
        return {
            x:    Math.random() * W,
            y:    Math.random() * H,
            vx:   (Math.random() - 0.5) * 0.4,
            vy:   (Math.random() - 0.5) * 0.4,
            r:    Math.random() * 2 + 0.8,
            alpha: Math.random() * 0.5 + 0.15
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: count }, makeParticle);
        mouse     = { x: W / 2, y: H / 2 };
    }

    /* Draw one frame */
    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p, i) => {
            /* Move */
            p.x += p.vx;
            p.y += p.vy;

            /* Wrap at edges */
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            /* Gentle attraction to mouse (desktop only) */
            if (!isMobile) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    p.vx += dx / dist * 0.008;
                    p.vy += dy / dist * 0.008;
                    /* Speed limit */
                    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    if (speed > 1.2) { p.vx /= speed * 0.85; p.vy /= speed * 0.85; }
                }
            }

            /* Draw particle */
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
            ctx.fill();

            /* Draw lines to nearby particles */
            for (let j = i + 1; j < particles.length; j++) {
                const q  = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                const maxDist = isMobile ? 90 : 120;

                if (d < maxDist) {
                    const opacity = (1 - d / maxDist) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(draw);
    }

    /* Track mouse */
    document.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }, { passive: true });

    /* Handle resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(init, 200);
    }, { passive: true });

    init();
    draw();
}


/* ============================================================
   8. FAQ ACCORDION
   Opens one item at a time (can be configured for multiple).
   ============================================================ */
function initFAQ() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            /* Close all open items */
            items.forEach(other => {
                other.classList.remove('open');
                const otherBtn = other.querySelector('.faq-question');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });

            /* Toggle clicked item */
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}


/* ============================================================
   9. PRICING TABS
   Switches between SEO / WordPress / Plugin pricing panels.
   ============================================================ */
function initPricingTabs() {
    const tabs   = document.querySelectorAll('.pricing-tab');
    const panels = document.querySelectorAll('.pricing-panel');

    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            /* Update tab states */
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            /* Show matching panel */
            panels.forEach(panel => {
                panel.classList.remove('active');
            });
            const activePanel = document.getElementById('pricing-' + target);
            if (activePanel) {
                activePanel.classList.add('active');

                /* Re-trigger scroll animations in newly visible panel */
                const newEls = activePanel.querySelectorAll('.animate-on-scroll');
                newEls.forEach(el => {
                    el.classList.remove('animated');
                    setTimeout(() => el.classList.add('animated'), 50);
                });
            }
        });
    });
}


/* ============================================================
   10. PORTFOLIO FILTER
   Filters project cards by category tag (data-category).
   ============================================================ */
function initPortfolioFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards   = document.querySelectorAll('.portfolio-card');

    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            /* Update button states */
            buttons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            /* Show/hide cards */
            cards.forEach(card => {
                const cat = card.getAttribute('data-category');

                if (filter === 'all' || cat === filter) {
                    card.classList.remove('hidden');
                    /* Re-animate card on show */
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                    card.style.opacity = '';
                    card.style.transform = '';
                    card.style.transition = '';
                }
            });
        });
    });
}


/* ============================================================
   11. BACK TO TOP BUTTON
   Appears after scrolling 400px. Scrolls to top on click.
   ============================================================ */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ============================================================
   12. SMOOTH SCROLL
   Handles anchor links that scroll to sections.
   Accounts for sticky navbar height.
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = anchor.getAttribute('href');

            /* Skip empty or just '#' links */
            if (!target || target === '#') return;

            const el = document.querySelector(target);
            if (!el) return;

            e.preventDefault();

            const navHeight = parseInt(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-height'), 10
            ) || 72;

            const top = el.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}


/* ============================================================
   13. CONTACT FORM
   Handles Formspree AJAX submission.
   Shows success/error messages without page reload.
   ============================================================ */
function initContactForm() {
    const form       = document.getElementById('contact-form');
    const submitBtn  = document.getElementById('form-submit');
    const successMsg = document.getElementById('form-success');
    const errorMsg   = document.getElementById('form-error');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        /* Basic validation */
        const name    = form.querySelector('#name').value.trim();
        const email   = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            shakeForm(form);
            return;
        }

        /* Update button state */
        const btnText    = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        submitBtn.disabled = true;
        if (btnText)    btnText.hidden    = true;
        if (btnLoading) btnLoading.hidden = false;
        if (successMsg) successMsg.hidden = true;
        if (errorMsg)   errorMsg.hidden   = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                /* Success */
                form.reset();
                if (successMsg) successMsg.hidden = false;
                successMsg && successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error('Server error');
            }
        } catch (err) {
            if (errorMsg) errorMsg.hidden = false;
        } finally {
            submitBtn.disabled = false;
            if (btnText)    btnText.hidden    = false;
            if (btnLoading) btnLoading.hidden = true;
        }
    });

    /* Visual shake on invalid submit */
    function shakeForm(el) {
        el.style.animation = 'none';
        el.offsetHeight; /* reflow */
        el.style.animation = 'formShake 0.4s ease';
        setTimeout(() => el.style.animation = '', 400);
    }

    /* Add shake keyframe dynamically */
    if (!document.getElementById('shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.textContent = `
            @keyframes formShake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-6px); }
                40%, 80% { transform: translateX(6px); }
            }
        `;
        document.head.appendChild(style);
    }
}


/* ============================================================
   14. FOOTER YEAR
   Keeps copyright year current automatically.
   ============================================================ */
function initFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
}


/* ============================================================
   15. PERFORMANCE: Lazy-load images (future-proofing)
   Any img with loading="lazy" is handled by browser natively.
   This adds a fade-in once they load.
   ============================================================ */
(function lazyImageFade() {
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    imgs.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.4s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        if (img.complete) img.style.opacity = '1';
    });
})();


/* ============================================================
   16. MICRO-INTERACTIONS: Button ripple effect
   Adds a spreading ripple on button click.
   ============================================================ */
(function initRipples() {
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';

        btn.addEventListener('click', function(e) {
            const rect   = btn.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const ripple = document.createElement('span');

            ripple.style.cssText = `
                position: absolute;
                width: 0; height: 0;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                left: ${x}px; top: ${y}px;
                animation: rippleAnim 0.6s ease-out forwards;
                pointer-events: none;
            `;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    /* Inject ripple keyframe once */
    if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = `
            @keyframes rippleAnim {
                to { width: 300px; height: 300px; opacity: 0; }
            }
        `;
        document.head.appendChild(s);
    }
})();


/* ============================================================
   17. PARALLAX: Subtle background blob movement on scroll
   Very gentle — won't cause motion sickness.
   Disabled if user prefers reduced motion.
   ============================================================ */
(function initParallax() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');

    if (!blob1 && !blob2) return;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const factor = 0.08;

        if (blob1) blob1.style.transform = `translateY(${y * factor}px)`;
        if (blob2) blob2.style.transform = `translateY(${-y * factor * 0.6}px)`;
    }, { passive: true });
})();


/* ============================================================
   18. SERVICE CARDS: Subtle 3D tilt on mouse hover
   Desktop only. Very subtle for premium feel.
   ============================================================ */
(function initCardTilt() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.service-card, .why-card, .pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x    = e.clientX - rect.left;
            const y    = e.clientY - rect.top;
            const cx   = rect.width / 2;
            const cy   = rect.height / 2;

            const tiltX = ((y - cy) / cy) * -4;
            const tiltY = ((x - cx) / cx) *  4;

            card.style.transform = `
                translateY(-4px)
                rotateX(${tiltX}deg)
                rotateY(${tiltY}deg)
            `;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s ease';
        });
    });
})();


/* ============================================================
   19. ACTIVE SECTION INDICATOR
   Adds a gradient progress bar to the top of the page
   showing how far down the user has scrolled.
   ============================================================ */
(function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        height: 2px;
        width: 0%;
        background: linear-gradient(90deg, #7C3AED, #8B5CF6, #EC4899);
        transition: width 0.1s linear;
        pointer-events: none;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width  = Math.min(progress, 100) + '%';
    }, { passive: true });
})();


/* ============================================================
   20. TESTIMONIAL HOVER: Lift effect already covered by CSS.
   Add a glow color on hover based on avatar color.
   ============================================================ */
(function initTestiGlow() {
    document.querySelectorAll('.testi-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.15)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
})();
