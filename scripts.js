/* ============================================================
   TAURUS — scripts.js  (GSAP 3.12 Edition — Full Rebuild)
   Plugins: ScrollTrigger, CustomEase, ScrollToPlugin
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, CustomEase, window.ScrollToPlugin);

/* ── Custom easing curves ── */
CustomEase.create("expo.out",  "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("soft.out",  "M0,0 C0.25,0.46 0.45,0.94 1,1");
CustomEase.create("snap.out",  "M0,0 C0.175,0.885 0.32,1.275 1,1");

/* Reduce motion respect */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   UTILITY — split text into word <span>s
   ============================================================ */
function splitWords(el) {
    if (!el) return [];
    const rawHTML = el.innerHTML;
    /* Preserve inner spans (e.g. coloured words) */
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHTML;
    const words = el.innerText.trim().split(/\s+/);
    el.innerHTML = words
        .map(w => `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;">
                     <span class="word" style="display:inline-block;">${w}&nbsp;</span>
                   </span>`)
        .join('');
    return Array.from(el.querySelectorAll('.word'));
}

/* ── Generic scroll-reveal factory ── */
function revealFrom(selector, opts = {}, st = {}) {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;
    gsap.from(els, {
        opacity: 0,
        y: opts.y ?? 40,
        x: opts.x ?? 0,
        scale: opts.scale ?? 1,
        duration: opts.duration ?? 0.8,
        stagger: opts.stagger ?? 0,
        ease: opts.ease ?? 'soft.out',
        scrollTrigger: {
            trigger: els[0],
            start: st.start ?? 'top 82%',
            once: true,
            ...st
        }
    });
}

/* ============================================================
   1. DYNAMIC YEAR
   ============================================================ */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   2. MAGNETIC BUTTONS (Desktop only, reduced motion aware)
   ============================================================ */
if (window.innerWidth > 768 && !prefersReducedMotion) {
    document.querySelectorAll('button:not(#mobile-menu-btn), .magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.3)' });
        });
    });
}

/* ============================================================
   3. PAGE LOAD & HERO ANIMATION
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {

    /* ── Scroll progress bar ── */
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:2px;background:linear-gradient(90deg,#00F5D4,#006b5b);z-index:9999;pointer-events:none;';
    document.body.appendChild(progressBar);

    gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });

    if (prefersReducedMotion) {
        /* skip animations; just ensure everything visible */
        gsap.set('[data-gsap="nav"]', { clearProps: 'all' });
        setupMobileMenu();
        setupModalAndForms();
        setupBeforeAfterSlider();
        setupSmoothScroll();
        return;
    }

    /* ── Initial hidden states ── */
    gsap.set('[data-gsap="nav"]',              { yPercent: -100, opacity: 0 });
    gsap.set('.hero-tagline',                  { opacity: 0, y: 30 });
    gsap.set('.hero-sub',                      { opacity: 0, y: 40 });
    gsap.set('.hero-ctas',                     { opacity: 0, y: 20 });
    gsap.set('.hero-blob-1, .hero-blob-2',     { scale: 0, opacity: 0 });
    gsap.set('.hero-img-container',            { opacity: 0, x: 50, scale: 0.95 });

    /* ── Word-split hero headline (desktop only) ── */
    const heroH1 = document.querySelector('.hero-h1');
    let allWords = [];

    if (heroH1 && window.innerWidth > 768) {
        allWords = splitWords(heroH1);
        heroH1.querySelectorAll('.word').forEach(w => {
            if (w.textContent.trim().startsWith('Enterprise')) {
                w.classList.add('text-primary', 'italic');
            }
        });
        gsap.set(allWords, { yPercent: 110, rotateZ: 4 });
    } else if (heroH1) {
        /* Mobile: treat headline as a single block to animate */
        gsap.set(heroH1, { opacity: 0, y: 30 });
    }

    /* ── Intro timeline ── */
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
        .to('.hero-blob-1, .hero-blob-2', { scale: 1, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'elastic.out(1,0.7)' })
        .to('[data-gsap="nav"]',          { yPercent: 0, opacity: 1, duration: 0.8 }, '-=1')
        .to('.hero-tagline',              { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');

    if (allWords.length) {
        /* Desktop: wave each word in */
        intro
            .to(allWords,     { yPercent: 0, rotateZ: 0, duration: 1, stagger: 0.07 }, '-=0.5')
            .to('.hero-sub',  { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
            .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
            .to('.hero-img-container', { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'expo.out' }, '-=0.6');
    } else {
        /* Mobile: simple fade-in block */
        intro
            .to(heroH1,       { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
            .to('.hero-sub',  { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
            .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');
    }

    /* ── Continuous blob floats ── */
    gsap.to('.hero-blob-1', { y: 30, x: 20, rotation: 10,  duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-blob-2', { y: -40, x: -30, rotation: -15, scale: 1.1, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });

    /* Arrow bounce */
    const arrow = document.querySelector('#hero-contact-btn .material-symbols-outlined');
    if (arrow) gsap.to(arrow, { x: 5, duration: 0.8, repeat: -1, yoyo: true, ease: 'power1.inOut' });

    /* ── Parallax mouse on hero (desktop) ── */
    const heroSection = document.getElementById('hero');
    if (heroSection && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            gsap.to('.hero-blob-1', { x, y, duration: 1, ease: 'power2.out', overwrite: 'auto' });
            gsap.to('.hero-blob-2', { x: -x, y: -y, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
        });
        heroSection.addEventListener('mouseleave', () => {
            gsap.to('.hero-blob-1', { y: 30, x: 20,   rotation: 10,  duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', overwrite: 'auto' });
            gsap.to('.hero-blob-2', { y: -40, x: -30, rotation: -15, scale: 1.1, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1, overwrite: 'auto' });
        });
    }

    /* ── Infinite marquee pause-on-hover ── */
    const strip = document.querySelector('.animate-slide-infinite');
    if (strip) {
        strip.parentElement.addEventListener('mouseenter', () => strip.style.animationPlayState = 'paused');
        strip.parentElement.addEventListener('mouseleave', () => strip.style.animationPlayState = 'running');
    }

    /* ============================================================
       4. METRICS STRIP — counter roll-up
       ============================================================ */
    document.querySelectorAll('.metric-value').forEach(el => {
        const raw    = el.dataset.value || el.textContent.trim();
        const suffix = raw.replace(/[\d.]/g, '');
        const num    = parseFloat(raw);
        if (isNaN(num)) return;
        ScrollTrigger.create({
            trigger: el, start: 'top 90%', once: true,
            onEnter: () => {
                gsap.fromTo({ val: 0 }, { val: num }, {
                    duration: 2, ease: 'power3.out',
                    onUpdate() {
                        const v = this.targets()[0].val;
                        el.textContent = (Number.isInteger(num) ? Math.round(v) : v.toFixed(2)) + suffix;
                    }
                });
            }
        });
    });

    /* ============================================================
       5. OUR STORY SECTION
       ============================================================ */
    gsap.timeline({ scrollTrigger: { trigger: '#story', start: 'top 78%', once: true } })
        .from('.story-eyebrow', { opacity: 0, y: 16, duration: 0.5, ease: 'soft.out' })
        .from('.story-h2',      { opacity: 0, y: 40, rotationX: 40, transformOrigin: '0% 50% -50', duration: 0.8, ease: 'back.out(1.7)' }, '-=0.25')
        .from('.story-sub',     { opacity: 0, y: 30, duration: 0.6, ease: 'soft.out' }, '-=0.3');

    /* Story body paragraphs */
    revealFrom('#story .max-w-4xl p', { y: 30, stagger: 0.15 }, { start: 'top 80%' });

    /* Story pillars (Innovation / Clean Code / Scalability / Partnership) */
    revealFrom('#story .grid > div', { y: 40, stagger: 0.1, scale: 0.95 }, { start: 'top 85%' });

    /* Founder Quote — image + blockquote */
    gsap.timeline({ scrollTrigger: { trigger: '.story-quote', start: 'top 80%', once: true } })
        .from('.story-quote img',        { opacity: 0, x: -50, duration: 0.9, ease: 'expo.out' })
        .from('.story-quote blockquote', { opacity: 0, x: 50,  duration: 0.9, ease: 'expo.out' }, '-=0.6')
        .from('.story-quote .pt-4',      { opacity: 0, y: 20, duration: 0.6, ease: 'soft.out' }, '-=0.4');

    /* ============================================================
       6. TRANSFORMATION SECTION
       ============================================================ */
    gsap.timeline({ scrollTrigger: { trigger: '#about', start: 'top 78%', once: true } })
        .from('#about .section-eyebrow', { opacity: 0, y: 20, duration: 0.6, ease: 'soft.out' })
        .from('#about h2',               { opacity: 0, y: 40, duration: 0.7, ease: 'snap.out' }, '-=0.3')
        .from('#about p.leading-relaxed',{ opacity: 0, y: 30, duration: 0.6, ease: 'soft.out' }, '-=0.3')
        .from('#viz-container',          { opacity: 0, y: 60, scale: 0.96, rotationX: 8, transformOrigin: '50% 100%', duration: 1, ease: 'expo.out' }, '-=0.2');

    /* ============================================================
       7. SERVICES / HOW IT WORKS SECTION
       ============================================================ */
    gsap.timeline({ scrollTrigger: { trigger: '#services', start: 'top 72%', once: true } })
        .from('.sticky-sidebar', { opacity: 0, x: -40, duration: 0.9, ease: 'expo.out' })
        .from('.service-item',   { opacity: 0, x: 50, duration: 0.65, stagger: 0.14, ease: 'expo.out' }, '-=0.5');

    /* Service item hover interactions */
    document.querySelectorAll('.service-item').forEach(item => {
        const num  = item.querySelector('span:first-child');
        const icon = item.querySelector('.material-symbols-outlined');
        item.addEventListener('mouseenter', () => {
            gsap.to(num,  { color: '#00F5D4', scale: 1.2, x: 4, duration: 0.3, ease: 'back.out(2)' });
            if (icon) gsap.to(icon, { x: 5, duration: 0.3 });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(num,  { color: '', scale: 1, x: 0, duration: 0.3 });
            if (icon) gsap.to(icon, { x: 0, duration: 0.3 });
        });
    });

    /* ============================================================
       8. PROJECTS SECTION
       ============================================================ */
    gsap.timeline({ scrollTrigger: { trigger: '#projects', start: 'top 78%', once: true } })
        .from('#projects .section-eyebrow', { opacity: 0, y: 20, duration: 0.5, ease: 'soft.out' })
        .from('#projects h2',               { opacity: 0, y: 36, duration: 0.7, ease: 'snap.out' }, '-=0.25')
        .from('#projects p.leading-relaxed',{ opacity: 0, y: 24, duration: 0.6, ease: 'soft.out' }, '-=0.3');

    gsap.from('.project-card-anim', {
        opacity: 0, y: 60, scale: 0.96,
        duration: 0.9, stagger: 0.15, ease: 'expo.out',
        scrollTrigger: { trigger: '.project-card-anim', start: 'top 82%', once: true }
    });

    /* Project card hover lift */
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => gsap.to(card, { y: -8, boxShadow: '0 24px 48px rgba(0,0,0,0.12)', duration: 0.35, ease: 'power2.out' }));
        card.addEventListener('mouseleave', () => gsap.to(card, { y:  0, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', duration: 0.35, ease: 'power2.out' }));
    });

    /* ============================================================
       9. ARCHITECTURAL INTEGRITY — text wave + stats
       ============================================================ */
    const archHeading = document.querySelector('.arch-heading');
    if (archHeading) {
        if (window.innerWidth > 768) {
            /* Desktop: dramatic word-by-word wave reveal */
            const archWords = splitWords(archHeading);
            archHeading.querySelectorAll('.word').forEach(w => {
                if (w.textContent.trim().startsWith('Integrity')) {
                    w.style.color = '#00F5D4';
                }
            });
            gsap.set(archWords, { yPercent: 110, rotateZ: 8 });
            gsap.to(archWords, {
                yPercent: 0, rotateZ: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out',
                scrollTrigger: { trigger: archHeading, start: 'top 82%', once: true }
            });
        } else {
            /* Mobile: simple fade-up (preserves block stacking of "Integrity.") */
            gsap.from(archHeading, {
                opacity: 0, y: 40, duration: 0.9, ease: 'expo.out',
                scrollTrigger: { trigger: archHeading, start: 'top 85%', once: true }
            });
        }
    }

    revealFrom('.arch-desc', { y: 40 }, { start: 'top 82%' });

    gsap.from('.arch-stat', {
        opacity: 0, y: 50, duration: 0.7, stagger: 0.18, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.arch-stat', start: 'top 85%', once: true }
    });

    document.querySelectorAll('.arch-stat').forEach(stat => {
        stat.addEventListener('mouseenter', () => gsap.to(stat, { y: -8, duration: 0.25, ease: 'power2.out' }));
        stat.addEventListener('mouseleave', () => gsap.to(stat, { y:  0, duration: 0.25, ease: 'power2.out' }));
    });

    /* ============================================================
       10. CONTACT SECTION
       ============================================================ */
    gsap.timeline({ scrollTrigger: { trigger: '#contact-section', start: 'top 72%', once: true } })
        .from('#contact-section .contact-info', { opacity: 0, x: -60, duration: 1,   ease: 'expo.out' })
        .from('#contact-form',                  { opacity: 0, x: 60,  scale: 0.95, duration: 1, ease: 'expo.out' }, '-=0.75');

    /* Contact info items stagger */
    revealFrom('#contact-section .contact-info .flex', { y: 20, stagger: 0.12 }, { trigger: '#contact-section', start: 'top 70%' });

    /* ============================================================
       11. FOOTER REVEAL
       ============================================================ */
    gsap.from('footer', {
        opacity: 0, y: 30, duration: 0.9, ease: 'soft.out',
        scrollTrigger: { trigger: 'footer', start: 'top 92%', once: true }
    });

    /* ============================================================
       12. ACTIVE NAV HIGHLIGHT
       ============================================================ */
    const navLinkMap = {
        services: document.querySelector('a[href="#services"]'),
        about:    document.querySelector('a[href="#about"]'),
        projects: document.querySelector('a[href="#projects"]'),
    };
    ['services', 'about', 'projects'].forEach(id => {
        ScrollTrigger.create({
            trigger: `#${id}`,
            start: 'top 40%',
            end:   'bottom 40%',
            toggleClass: { targets: navLinkMap[id], className: 'nav-active' }
        });
    });

    /* ============================================================
       13. BEFORE / AFTER INTERACTIVE SLIDER
       ============================================================ */
    setupBeforeAfterSlider();

    /* ============================================================
       14. SMOOTH SCROLL
       ============================================================ */
    setupSmoothScroll();

    /* ============================================================
       15. MOBILE HAMBURGER MENU
       ============================================================ */
    setupMobileMenu();

    /* ============================================================
       16. MODALS & FORMS
       ============================================================ */
    setupModalAndForms();

    /* ============================================================
       17. BUTTON MICRO-INTERACTIONS
       ============================================================ */
    document.querySelectorAll('button[type="button"], button[type="submit"], a.btn-like').forEach(btn => {
        btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.93, duration: 0.1 }));
        btn.addEventListener('mouseup',   () => gsap.to(btn, { scale: 1, duration: 0.4, ease: 'elastic.out(1.5,0.5)' }));
        btn.addEventListener('mouseleave',() => gsap.to(btn, { scale: 1, duration: 0.3 }));
    });

    document.getElementById('view-all-projects-btn')?.addEventListener('click', () => {
        gsap.to(window, { scrollTo: { y: '#contact-section', offsetY: 80 }, duration: 1.2, ease: 'expo.inOut' });
    });

}); /* end DOMContentLoaded */

/* ============================================================
   BEFORE / AFTER SLIDER (extracted for reuse)
   ============================================================ */
function setupBeforeAfterSlider() {
    const vizContainer = document.getElementById('viz-container');
    const vizSlider    = document.getElementById('viz-slider');
    const afterPanel   = document.getElementById('after-panel');
    if (!vizContainer || !vizSlider || !afterPanel) return;

    let isDragging = false;

    const setPosition = clientX => {
        const rect = vizContainer.getBoundingClientRect();
        let pos = ((clientX - rect.left) / rect.width) * 100;
        pos = Math.max(0, Math.min(100, pos));
        gsap.set(vizSlider,  { left: `${pos}%` });
        gsap.set(afterPanel, { clipPath: `inset(0 0 0 ${pos}%)` });
    };

    const handleDown = e => { isDragging = true;  setPosition(e.clientX || e.touches?.[0]?.clientX); gsap.to(vizSlider, { scale: 1.2, duration: 0.2 }); };
    const handleUp   = () => { isDragging = false; gsap.to(vizSlider, { scale: 1, duration: 0.2 }); };
    const handleMove = e => { if (isDragging) setPosition(e.clientX || e.touches?.[0]?.clientX); };

    vizContainer.addEventListener('mousedown',  handleDown);
    window.addEventListener('mouseup',   handleUp);
    window.addEventListener('mousemove', handleMove);
    vizContainer.addEventListener('touchstart', handleDown, { passive: true });
    window.addEventListener('touchend',   handleUp);
    window.addEventListener('touchmove',  handleMove, { passive: true });

    ScrollTrigger.create({
        trigger: '#viz-container', start: 'top 60%', once: true,
        onEnter: () => {
            const icon = vizSlider.querySelector('.material-symbols-outlined');
            gsap.timeline()
                .to({}, { duration: 0.5 })
                .to(vizSlider, {
                    left: '20%', duration: 1, ease: 'power3.inOut',
                    onUpdate() { gsap.set(afterPanel, { clipPath: `inset(0 0 0 ${vizSlider.style.left})` }); }
                })
                .to(icon, { rotation: 180, duration: 0.5 }, '-=0.5')
                .to(vizSlider, {
                    left: '50%', duration: 1, ease: 'elastic.out(1,0.8)',
                    onUpdate() { gsap.set(afterPanel, { clipPath: `inset(0 0 0 ${vizSlider.style.left})` }); }
                })
                .to(icon, { rotation: 0, duration: 0.5 }, '-=0.5');
        }
    });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href').slice(1);
            if (!id) return;
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1.2, ease: 'expo.inOut' });
        });
    });
}

/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu    = document.getElementById('mobile-menu');
    const lines         = document.querySelectorAll('.hamburger-line');
    if (!mobileMenuBtn || !mobileMenu) return;

    let menuOpen = false;

    const openMenu = () => {
        menuOpen = true;
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        gsap.set(mobileMenu, { display: 'flex', height: 0, opacity: 0 });
        gsap.to(mobileMenu, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power3.out' });
        gsap.fromTo(mobileMenu.querySelectorAll('a'),
            { y: -16, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.07, duration: 0.4, delay: 0.15, ease: 'back.out(1.5)' }
        );
        gsap.to(lines[0], { y: 8,  rotation:  45, duration: 0.3, ease: 'power2.out' });
        gsap.to(lines[1], { scaleX: 0,            duration: 0.2 });
        gsap.to(lines[2], { y: -8, rotation: -45, duration: 0.3, ease: 'power2.out' });
    };

    const closeMenu = () => {
        menuOpen = false;
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        gsap.to(mobileMenu, {
            height: 0, opacity: 0, duration: 0.35, ease: 'power2.in',
            onComplete: () => gsap.set(mobileMenu, { display: 'none' })
        });
        gsap.to(lines[0], { y: 0, rotation: 0, duration: 0.3 });
        gsap.to(lines[1], { scaleX: 1,         duration: 0.2, delay: 0.1 });
        gsap.to(lines[2], { y: 0, rotation: 0, duration: 0.3 });
    };

    mobileMenuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
    document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));
}

/* ============================================================
   MODALS & FORMS
   ============================================================ */
function setupModalAndForms() {
    const modal          = document.getElementById('contact-modal');
    const modalBackdrop  = document.getElementById('modal-backdrop');
    const modalCloseBtn  = document.getElementById('modal-close');
    const modalInner     = modal?.querySelector('.modal-inner');

    const openModal = () => {
        if (!modal) return;
        gsap.set(modal, { display: 'flex' });
        gsap.fromTo(modalBackdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'none' });
        gsap.fromTo(modalInner,
            { opacity: 0, y: 50, scale: 0.92, rotationX: 8 },
            { opacity: 1, y: 0,  scale: 1,    rotationX: 0, duration: 0.55, ease: 'back.out(1.2)' }
        );
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.querySelector('input')?.focus(), 200);
    };

    const closeModal = () => {
        if (!modal) return;
        gsap.to(modalInner,    { opacity: 0, y: -30, scale: 0.95, duration: 0.35, ease: 'power3.in' });
        gsap.to(modalBackdrop, {
            opacity: 0, duration: 0.35, delay: 0.1, ease: 'none',
            onComplete: () => { gsap.set(modal, { display: 'none' }); document.body.style.overflow = ''; }
        });
    };

    ['contact-btn', 'hero-contact-btn', 'architect-btn'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', openModal);
    });
    modalCloseBtn?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal?.style.display !== 'none') closeModal();
    });

    /* ── Form submit handler ── */
    const handleFormSubmit = (formId, btnId, errId, succId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const btn  = document.getElementById(btnId);
            const err  = document.getElementById(errId);
            const succ = document.getElementById(succId);

            err.classList.add('hidden');
            succ.classList.add('hidden');
            btn.disabled = true;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined text-sm" style="animation:spin 0.8s linear infinite;display:inline-block;">progress_activity</span> Sending…';

            const data = {
                name:    form.querySelector('[name="name"]')?.value    || '',
                email:   form.querySelector('[name="email"]')?.value   || '',
                company: form.querySelector('[name="company"]')?.value || '',
                message: form.querySelector('[name="message"]')?.value || '',
            };

            try {
                const res    = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                const result = await res.json();

                if (res.ok && result.success) {
                    succ.classList.remove('hidden');
                    gsap.from(succ, { opacity: 0, y: -10, duration: 0.5, ease: 'back.out(2)' });
                    btn.innerHTML = '✓ Message Sent!';
                    form.reset();
                    setTimeout(() => {
                        btn.disabled   = false;
                        btn.innerHTML  = originalHTML;
                        succ.classList.add('hidden');
                        if (formId === 'modal-form') closeModal();
                    }, 3000);
                } else {
                    err.textContent = result.error || 'Something went wrong. Please try again.';
                    err.classList.remove('hidden');
                    btn.disabled  = false;
                    btn.innerHTML = originalHTML;
                }
            } catch {
                err.textContent = 'Network error. Please check your connection and try again.';
                err.classList.remove('hidden');
                btn.disabled  = false;
                btn.innerHTML = originalHTML;
            }
        });
    };

    handleFormSubmit('modal-form',    'modal-submit',    'modal-error',  'modal-success');
    handleFormSubmit('contact-form',  'form-submit-btn', 'form-error',   'form-success');
}
