document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            mirror: false,
            anchorPlacement: 'top-bottom',
            easing: 'ease-out'
        });
    }

    // Intersection Observer for .animate-on-scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback: show all
        animatedElements.forEach(el => {
            el.classList.remove('opacity-0', 'translate-y-4');
        });
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Auto-highlight active nav link across pages
    const navLinksAll = document.querySelectorAll('.nav-links a');
    if (navLinksAll && navLinksAll.length) {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        navLinksAll.forEach(a => {
            // Normalize href to filename
            try {
                const href = a.getAttribute('href') || '';
                const file = href.split('/').pop();
                const isHome = (path === '' || path === '/') && (file === 'index.html');
                const match = (file === path) || (isHome);
                a.classList.toggle('active', !!match);
            } catch (e) {}
        });
    }

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        const closeMenu = () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        };

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMenu());
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            const clickInsideMenu = navLinks.contains(e.target) || navToggle.contains(e.target);
            if (!clickInsideMenu && navLinks.classList.contains('open')) {
                closeMenu();
            }
        });

        // Resize handler: reset menu on desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
    }

    // Initialize project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // Mouse move effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Mouse leave effect
        card.addEventListener('mouseleave', () => {
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
        });

        // Overlay animation
        const overlay = card.querySelector('.project-overlay');
        if (overlay) {
            card.addEventListener('mouseenter', () => {
                overlay.style.transform = 'translateY(0)';
            });

            card.addEventListener('mouseleave', () => {
                overlay.style.transform = 'translateY(100%)';
            });
        }
    });

    // Testimonial slider
    const testimonials = document.querySelector('.testimonials-slider');
    if (testimonials) {
        let isDragging = false;
        let startX;
        let scrollLeft;

        const startDrag = (e) => {
            isDragging = true;
            startX = e.pageX - testimonials.offsetLeft;
            scrollLeft = testimonials.scrollLeft;
            testimonials.style.cursor = 'grabbing';
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - testimonials.offsetLeft;
            const walk = (x - startX) * 2;
            testimonials.scrollLeft = scrollLeft - walk;
        };

        const stopDrag = () => {
            isDragging = false;
            testimonials.style.cursor = 'grab';
        };

        testimonials.addEventListener('mousedown', startDrag);
        testimonials.addEventListener('mousemove', drag);
        testimonials.addEventListener('mouseup', stopDrag);
        testimonials.addEventListener('mouseleave', stopDrag);
        testimonials.style.cursor = 'grab';
    }

    // Check for resource loading errors
    function checkResourceErrors() {
        // Add resource checking logic here
        console.log('Checking for resource loading errors...');
    }
    checkResourceErrors();

    // Theme toggle
    const root = document.documentElement;
    const THEME_KEY = 'site-theme';
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const savedTheme = localStorage.getItem(THEME_KEY);
    const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');
    if (initialTheme === 'light') {
        root.setAttribute('data-theme', 'light');
    } else {
        root.removeAttribute('data-theme'); // dark default
    }

    const themeBtn = document.querySelector('.theme-toggle');
    const updateThemeBtn = () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        themeBtn.setAttribute('aria-pressed', String(isLight));
        const icon = themeBtn.querySelector('i');
        if (icon) {
            icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        }
        // Navbar link contrast if needed is driven by CSS vars
    };
    if (themeBtn) {
        updateThemeBtn();
        themeBtn.addEventListener('click', () => {
            const isLight = root.getAttribute('data-theme') === 'light';
            if (isLight) {
                root.removeAttribute('data-theme');
                localStorage.setItem(THEME_KEY, 'dark');
            } else {
                root.setAttribute('data-theme', 'light');
                localStorage.setItem(THEME_KEY, 'light');
            }
            updateThemeBtn();
        });
    }

    // ===== Quick Wins Enhancements =====
    (function enhanceSite() {
        // 1) Inject minimal CSS used by new widgets
        function injectStyles() {
            const id = 'enhancements-styles';
            if (document.getElementById(id)) return;
            const css = `
            /* Filters */
            .portfolio-filters { user-select: none; }
            .filter-btn { padding: .55rem .9rem; border-radius: 999px; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.06); color: inherit; cursor: pointer; transition: .2s ease; }
            [data-theme="light"] .filter-btn { border-color: rgba(0,0,0,.15); background: rgba(0,0,0,.04); }
            .filter-btn:hover, .filter-btn.active { background: var(--primary-color); border-color: var(--primary-color); color: #fff; }

            /* Lightbox */
            .lightbox-modal { position: fixed; inset: 0; background: rgba(0,0,0,.8); display: none; align-items: center; justify-content: center; z-index: 2000; }
            .lightbox-modal.open { display: flex; animation: lb-fade .18s ease-out; }
            .lightbox-content { max-width: 90vw; max-height: 80vh; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.5); overflow: hidden; }
            .lightbox-content img, .lightbox-content video { display:block; max-width:100%; max-height:80vh; }
            .lightbox-caption { color: #fff; text-align: center; margin-top: .5rem; opacity: .9; }
            @keyframes lb-fade { from { opacity: 0 } to { opacity: 1 } }

            /* Floating quick contact */
            .quick-contact { position: fixed; right: 18px; bottom: 18px; display: flex; flex-direction: column; gap: .5rem; z-index: 1800; }
            .quick-contact a { display: inline-flex; align-items: center; gap: .45rem; padding: .6rem .8rem; border-radius: 999px; color: #fff; text-decoration: none; box-shadow: 0 8px 24px rgba(0,0,0,.25); transition: transform .15s ease; }
            .quick-contact a:hover { transform: translateY(-2px); }
            .qc-call { background: #0ea5e9; }
            .qc-wa { background: #25D366; }
            .qc-mail { background: #9333ea; }

            /* FAQ Accordion */
            .faq-search { margin: 0 auto 1rem; max-width: 720px; }
            .faq-search input { width: 100%; padding: .75rem 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.06); color: inherit; }
            [data-theme="light"] .faq-search input { border-color: rgba(0,0,0,.12); background: rgba(0,0,0,.04); }
            .feature-card[hidden] { display: none !important; }
            .feature-card .answer { max-height: 0; overflow: hidden; transition: max-height .25s ease; }
            .feature-card[aria-expanded="true"] .answer { max-height: 300px; }
            .feature-card h3 { cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
            .feature-card h3 .chev { transition: transform .2s ease; }
            .feature-card[aria-expanded="true"] h3 .chev { transform: rotate(180deg); }

            /* Testimonials slider */
            .testimonials-slider { position: relative; overflow: hidden; }
            .testimonials-slider .testimonial-card { width: 100%; flex: 0 0 100%; }
            .testimonials-slider .track { display: flex; transition: transform .4s ease; will-change: transform; }
            .ts-controls { display:flex; align-items:center; justify-content:center; gap:.75rem; margin-top:.75rem; }
            .ts-controls button { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); color: inherit; padding: .45rem .6rem; border-radius: 10px; cursor: pointer; }
            [data-theme="light"] .ts-controls button { background: rgba(0,0,0,.05); border-color: rgba(0,0,0,.1); }
            .ts-dots { display: flex; gap: .35rem; }
            .ts-dots button { width: .55rem; height: .55rem; border-radius: 999px; border: 0; background: rgba(255,255,255,.3); cursor: pointer; }
            [data-theme="light"] .ts-dots button { background: rgba(0,0,0,.2); }
            .ts-dots button[aria-selected="true"] { background: var(--primary-color); }

            /* Logos carousel */
            .clients .logos-carousel { overflow: hidden; position: relative; }
            .clients .logos-track { display: flex; align-items: center; gap: 2.5rem; will-change: transform; }
            .clients .logo-item { min-width: 100px; height: 60px; border-radius: 12px; display:flex; align-items:center; justify-content:center; font-weight:700; letter-spacing:1px; color: var(--text-color); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); }
            [data-theme="light"] .clients .logo-item { background: rgba(0,0,0,.04); border-color: rgba(0,0,0,.08); }
            `;
            const style = document.createElement('style');
            style.id = id;
            style.textContent = css;
            document.head.appendChild(style);
        }

        // 2) Lazy-load images (skip if attribute already present)
        function lazyLoadImages() {
            document.querySelectorAll('img').forEach(img => {
                if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
                if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
            });
        }

        // 3) Portfolio filter logic
        function initPortfolioFilters() {
            const grid = document.getElementById('portfolioGrid');
            const buttons = document.querySelectorAll('.portfolio-filters .filter-btn');
            if (!grid || !buttons.length) return;

            const applyFilter = (cat) => {
                const cards = grid.querySelectorAll('.project-card');
                cards.forEach(card => {
                    const c = (card.getAttribute('data-category') || '').toLowerCase();
                    const show = (cat === 'all') || (c === cat);
                    card.style.display = show ? '' : 'none';
                });
                buttons.forEach(b => b.classList.toggle('active', b.dataset.filter === cat));
                if (cat && cat !== 'all') {
                    history.replaceState(null, '', `#${cat}`);
                } else {
                    history.replaceState(null, '', window.location.pathname);
                }
            };

            buttons.forEach(btn => {
                btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
            });

            // Read initial from hash
            const hash = (location.hash || '').replace('#','').toLowerCase();
            const valid = Array.from(buttons).some(b => b.dataset.filter === hash);
            applyFilter(valid ? hash : 'all');
        }

        // 4) Simple lightbox for anchors with .lightbox
        function initLightbox() {
            const links = document.querySelectorAll('a.lightbox');
            if (!links.length) return;

            const modal = document.createElement('div');
            modal.className = 'lightbox-modal';
            modal.innerHTML = `
                <div class="lightbox-body" role="dialog" aria-modal="true" aria-label="Image preview">
                    <div class="lightbox-content"></div>
                    <div class="lightbox-caption"></div>
                </div>
            `;
            document.body.appendChild(modal);
            const content = modal.querySelector('.lightbox-content');
            const caption = modal.querySelector('.lightbox-caption');

            function open(src, title) {
                content.innerHTML = '';
                const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
                const el = document.createElement(isVideo ? 'video' : 'img');
                if (isVideo) { el.controls = true; el.autoplay = true; }
                el.src = src;
                content.appendChild(el);
                caption.textContent = title || '';
                modal.classList.add('open');
                document.addEventListener('keydown', onKey);
            }
            function close() {
                modal.classList.remove('open');
                content.innerHTML = '';
                caption.textContent = '';
                document.removeEventListener('keydown', onKey);
            }
            function onKey(e) { if (e.key === 'Escape') close(); }
            modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

            links.forEach(a => {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    open(a.getAttribute('href'), a.getAttribute('data-title'));
                });
            });
        }

        // 5) Floating quick contact widget
        function initQuickContact() {
            if (document.querySelector('.quick-contact')) return;
            const wrap = document.createElement('div');
            wrap.className = 'quick-contact';
            const page = document.title || 'DCT Site';
            const waText = encodeURIComponent(`Hi DCT, I'm viewing: ${page}`);
            wrap.innerHTML = `
                <a class="qc-wa" href="https://wa.me/251911512425?text=${waText}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                <a class="qc-call" href="tel:+251911512425" aria-label="Call"><i class="fas fa-phone"></i> Call</a>
                <a class="qc-mail" href="mailto:muradkoket@gmail.com?subject=Inquiry" aria-label="Email"><i class="fas fa-envelope"></i> Email</a>
            `;
            document.body.appendChild(wrap);
        }

        // 6) FAQ accordion + search (Contact page)
        function initFaqEnhancements() {
            const isContact = /contact\.html$/.test(location.pathname) || document.querySelector('.contact-hero');
            if (!isContact) return;
            const section = Array.from(document.querySelectorAll('section.why-choose-us')).find(sec => {
                const title = sec.querySelector('.section-title');
                return title && /faq/i.test(title.textContent || '');
            });
            if (!section) return;
            const grid = section.querySelector('.features-grid');
            if (!grid) return;

            // Insert search
            const searchWrap = document.createElement('div');
            searchWrap.className = 'faq-search';
            searchWrap.innerHTML = `<input type="search" placeholder="Search FAQs..." aria-label="Search FAQs">`;
            section.querySelector('.section-header')?.after(searchWrap);
            const searchInput = searchWrap.querySelector('input');

            // Transform feature-cards into accordions
            const cards = grid.querySelectorAll('.feature-card');
            cards.forEach(card => {
                const h3 = card.querySelector('h3');
                const p = card.querySelector('p');
                if (!h3 || !p) return;
                card.setAttribute('role', 'group');
                card.setAttribute('aria-expanded', 'false');
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('aria-controls', '');
                btn.style.all = 'unset';
                btn.style.cursor = 'pointer';
                btn.style.display = 'block';
                const chev = '<span class="chev">⌄</span>';
                btn.innerHTML = `${h3.textContent} ${chev}`;
                h3.replaceWith(btn);
                const answer = document.createElement('div');
                answer.className = 'answer';
                answer.appendChild(p);
                card.appendChild(answer);
                btn.addEventListener('click', () => {
                    const open = card.getAttribute('aria-expanded') === 'true';
                    card.setAttribute('aria-expanded', String(!open));
                });
            });

            // Filter by search
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    const q = (searchInput.value || '').toLowerCase();
                    cards.forEach(card => {
                        const txt = card.textContent?.toLowerCase() || '';
                        const match = txt.includes(q);
                        card.hidden = !match;
                    });
                });
            }
        }

        // 7) Testimonials carousel
        function initTestimonialsSlider() {
            const slider = document.querySelector('.testimonials-slider');
            if (!slider) return;
            let cards = Array.from(slider.querySelectorAll('.testimonial-card'));
            if (!cards.length) return;

            // Wrap cards in a moving track
            let track = slider.querySelector('.track');
            if (!track) {
                track = document.createElement('div');
                track.className = 'track';
                cards.forEach(c => track.appendChild(c));
                slider.appendChild(track);
            }
            const prevBtn = document.querySelector('.ts-prev');
            const nextBtn = document.querySelector('.ts-next');
            const dotsWrap = document.querySelector('.ts-dots');

            let index = 0;
            const total = cards.length;
            const makeDot = (i) => {
                const b = document.createElement('button');
                b.setAttribute('role','tab');
                b.setAttribute('aria-label', `Slide ${i+1}`);
                b.addEventListener('click', () => go(i, true));
                return b;
            };
            const dots = Array.from({length: total}, (_,i)=>makeDot(i));
            if (dotsWrap) {
                dots.forEach(d => dotsWrap.appendChild(d));
            }

            function render() {
                track.style.transform = `translateX(${-index * 100}%)`;
                if (dotsWrap) dots.forEach((d,i)=> d.setAttribute('aria-selected', String(i===index)));
            }
            function go(i, user=false) {
                index = (i + total) % total;
                render();
                if (user) restartAuto();
            }
            function prev(){ go(index - 1, true); }
            function next(){ go(index + 1, true); }
            prevBtn && prevBtn.addEventListener('click', prev);
            nextBtn && nextBtn.addEventListener('click', next);

            // autoplay
            let timer = null;
            function startAuto(){ timer = setInterval(()=> go(index+1), 5000); }
            function stopAuto(){ if (timer) clearInterval(timer); timer = null; }
            function restartAuto(){ stopAuto(); startAuto(); }
            slider.addEventListener('mouseenter', stopAuto);
            slider.addEventListener('mouseleave', startAuto);

            render();
            startAuto();
        }

        // 8) Client logos carousel (auto-scrolling)
        function initLogosCarousel() {
            const carousel = document.querySelector('.clients .logos-carousel');
            const track = carousel?.querySelector('.logos-track');
            if (!carousel || !track) return;

            // Duplicate children to create an infinite loop
            const items = Array.from(track.children);
            if (items.length) {
                items.forEach(el => track.appendChild(el.cloneNode(true)));
            }

            let x = 0;
            const speed = 0.4; // px per frame
            function step(){
                x -= speed;
                const first = track.firstElementChild;
                if (first) {
                    const firstWidth = first.getBoundingClientRect().width + 40; // gap approx
                    if (-x >= firstWidth) {
                        // move first to end and adjust offset
                        track.appendChild(first);
                        x += firstWidth;
                    }
                }
                track.style.transform = `translateX(${x}px)`;
                requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        // 9) Chatwoot live chat (lazy load when token provided)
        function initChatwoot() {
            const token = document.querySelector('meta[name="chatwoot-token"]')?.getAttribute('content');
            const base = document.querySelector('meta[name="chatwoot-base"]')?.getAttribute('content') || 'https://app.chatwoot.com';
            if (!token) return; // do nothing until configured
            if (window.chatwootSDK) return; // already loaded

            (function(d, t) {
                const g = d.createElement(t);
                const s = d.getElementsByTagName(t)[0];
                g.src = base.replace(/\/$/, '') + '/packs/js/sdk.js';
                g.defer = true; g.async = true;
                s.parentNode.insertBefore(g, s);
                g.onload = function() {
                    try {
                        window.chatwootSDK.run({ websiteToken: token, baseUrl: base });
                    } catch (e) { console.error('Chatwoot init failed', e); }
                };
            })(document, 'script');
        }

        // 10) Contact form: validation + submission (FormSubmit default or custom endpoint)
        function initContactForm() {
            const form = document.getElementById('contactForm');
            if (!form) return;
            const statusEl = document.getElementById('formStatus');
            const toastEl = (function(){
                let t = document.getElementById('toast');
                if (!t) {
                    t = document.createElement('div');
                    t.id = 'toast'; t.className = 'toast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite');
                    document.body.appendChild(t);
                }
                return t;
            })();

            const showToast = (msg) => {
                if (!toastEl) return;
                toastEl.textContent = msg;
                toastEl.classList.add('show');
                setTimeout(() => toastEl.classList.remove('show'), 2200);
            };
            const setError = (input, msg, errId) => {
                input?.setAttribute('aria-invalid','true');
                const el = document.getElementById(errId); if (el) { el.textContent = msg; el.style.display = 'block'; }
            };
            const clearError = (input, errId) => {
                input?.setAttribute('aria-invalid','false');
                const el = document.getElementById(errId); if (el) { el.textContent = ''; el.style.display = 'none'; }
            };

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\+?\d[\d\s-]{6,}$/;

            ['name','email','phone','subject','message'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', () => clearError(el, `err-${id}`));
            });

            const getMeta = (name) => document.querySelector(`meta[name="${name}"]`)?.getAttribute('content')?.trim() || '';

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (statusEl) statusEl.textContent = '';

                // Honeypot
                const hp = document.getElementById('company');
                if (hp && hp.value.trim() !== '') { showToast('Spam detected.'); return; }

                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const phone = document.getElementById('phone');
                const subject = document.getElementById('subject');
                const message = document.getElementById('message');

                let valid = true;
                if (!name.value.trim()) { setError(name, 'Please enter your name', 'err-name'); valid = false; }
                if (!email.value.trim() || !emailRegex.test(email.value)) { setError(email, 'Enter a valid email', 'err-email'); valid = false; }
                if (phone.value.trim() && !phoneRegex.test(phone.value)) { setError(phone, 'Enter a valid phone (optional)', 'err-phone'); valid = false; }
                if (!subject.value.trim()) { setError(subject, 'Please add a subject', 'err-subject'); valid = false; }
                if (!message.value.trim() || message.value.trim().length < 10) { setError(message, 'Message must be at least 10 characters', 'err-message'); valid = false; }

                if (!valid) { showToast('Please fix the highlighted fields'); return; }

                const contactEmail = getMeta('contact-email');
                const customEndpoint = getMeta('form-endpoint');
                let endpoint = '';
                let payload = {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    subject: subject.value.trim(),
                    message: message.value.trim(),
                    website: window.location.origin
                };

                if (customEndpoint) {
                    endpoint = customEndpoint;
                } else if (contactEmail) {
                    // FormSubmit Ajax endpoint
                    endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(contactEmail)}`;
                    payload._subject = `New message from DCT website: ${payload.subject}`;
                } else {
                    showToast('Form endpoint not configured');
                    return;
                }

                try {
                    if (statusEl) statusEl.textContent = 'Sending...';
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!res.ok) throw new Error('Network error');
                    // Attempt to parse JSON but don't fail if not JSON
                    try { await res.json(); } catch(_) {}
                    if (statusEl) statusEl.textContent = 'Thank you! Your message has been sent.';
                    showToast('Message sent successfully');
                    form.reset();
                } catch (err) {
                    console.error('Form submit failed', err);
                    if (statusEl) statusEl.textContent = 'Something went wrong. Please try again later.';
                    showToast('Send failed. Try again.');
                }
            });
        }

        // Run all
        injectStyles();
        lazyLoadImages();
        initPortfolioFilters();
        initLightbox();
        initQuickContact();
        initFaqEnhancements();
        initTestimonialsSlider();
        initLogosCarousel();
        initChatwoot();
        initContactForm();
        initPWA();
    })();

    // Initialize PWA install prompt
    function initPWA() {
        let deferredPrompt;
        const installButton = document.getElementById('install-button');
        
        // Only show install button if not running in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            if (installButton) installButton.style.display = 'none';
            return;
        }

        // Show install button if available
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installButton) {
                installButton.style.display = 'block';
                
                installButton.addEventListener('click', () => {
                    installButton.style.display = 'none';
                    deferredPrompt.prompt();
                    
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the install prompt');
                        }
                        deferredPrompt = null;
                    });
                });
            }
        });

        // Hide install button after installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            if (installButton) installButton.style.display = 'none';
            deferredPrompt = null;
        });
    }
})
;
