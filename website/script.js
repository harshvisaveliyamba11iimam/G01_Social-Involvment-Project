/* ============================================ */
/* THREADS, HANDS & HERITAGE OF AMRITSAR        */
/* Main JavaScript — Animations & Interactions  */
/* ============================================ */

(function () {
    'use strict';

    // ============================================
    // 1. GOLD DUST PARTICLES — Hero Section
    // ============================================
    function createParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const count = window.innerWidth < 600 ? 20 : 40;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';
            particle.style.width = particle.style.height = (1 + Math.random() * 3) + 'px';
            particle.style.opacity = 0.3 + Math.random() * 0.5;
            container.appendChild(particle);
        }
    }

    // ============================================
    // 2. SCROLL REVEAL — Intersection Observer
    // ============================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.15,
                    rootMargin: '0px 0px -60px 0px',
                }
            );

            revealElements.forEach((el) => observer.observe(el));
        } else {
            // Fallback: reveal everything immediately
            revealElements.forEach((el) => el.classList.add('revealed'));
        }
    }

    // ============================================
    // 3. GOLDEN THREAD — SVG Path Animation
    // ============================================
    function initGoldenThread() {
        const svg = document.getElementById('goldenThread');
        const path = document.getElementById('threadPath');
        if (!svg || !path) return;

        // We need to match the SVG dimensions to the document
        function updateThread() {
            const docHeight = document.documentElement.scrollHeight;
            const docWidth = document.documentElement.clientWidth;

            svg.setAttribute('width', docWidth);
            svg.setAttribute('height', docHeight);
            svg.setAttribute('viewBox', `0 0 ${docWidth} ${docHeight}`);

            // Collect thread node positions
            const nodes = document.querySelectorAll('.artisan-thread-node');
            const points = [];

            // Start from hero center bottom
            const hero = document.getElementById('hero');
            if (hero) {
                points.push({
                    x: docWidth / 2,
                    y: hero.offsetHeight,
                });
            }

            // Through each artisan node
            nodes.forEach((node) => {
                const rect = node.getBoundingClientRect();
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                points.push({
                    x: docWidth / 2,
                    y: rect.top + scrollY + rect.height / 2,
                });
            });

            // End at epilogue
            const epilogue = document.getElementById('epilogue');
            if (epilogue) {
                const rect = epilogue.getBoundingClientRect();
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                points.push({
                    x: docWidth / 2,
                    y: rect.top + scrollY,
                });
            }

            if (points.length < 2) return;

            // Build an organic-looking path with gentle waves
            let d = `M ${points[0].x} ${points[0].y}`;

            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const midY = (prev.y + curr.y) / 2;

                // Add gentle horizontal wave
                const wave = (i % 2 === 0 ? 1 : -1) * Math.min(80, docWidth * 0.06);

                d += ` C ${prev.x + wave} ${midY}, ${curr.x - wave} ${midY}, ${curr.x} ${curr.y}`;
            }

            path.setAttribute('d', d);

            // Animate the thread drawing based on scroll
            const pathLength = path.getTotalLength();
            path.style.strokeDasharray = pathLength;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollFraction = scrollTop / (docHeight - window.innerHeight);
            const drawLength = pathLength * Math.min(1, scrollFraction * 1.1);

            path.style.strokeDashoffset = pathLength - drawLength;
        }

        // Use requestAnimationFrame for smooth scroll tracking
        let ticking = false;

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateThread();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            updateThread();
        });

        // Initial draw
        setTimeout(updateThread, 100);
        setTimeout(updateThread, 500);
    }

    // ============================================
    // 4. PARALLAX — Subtle photo parallax
    // ============================================
    function initParallax() {
        const photos = document.querySelectorAll('.photo-frame');
        if (window.innerWidth < 768) return; // Skip on mobile

        let ticking = false;

        function updateParallax() {
            const scrollY = window.pageYOffset;

            photos.forEach((photo) => {
                const rect = photo.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distance = (centerY - viewportCenter) / window.innerHeight;

                // Very subtle parallax
                const translateY = distance * -15;
                photo.style.transform = `translateY(${translateY}px)`;
            });
        }

        window.addEventListener(
            'scroll',
            () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        updateParallax();
                        ticking = false;
                    });
                    ticking = true;
                }
            },
            { passive: true }
        );
    }

    // ============================================
    // 5. HERO TITLE ANIMATION — Staggered entrance
    // ============================================
    function initHeroAnimation() {
        const heroElements = document.querySelectorAll('.hero .reveal-up');

        // Animate hero elements with stagger
        setTimeout(() => {
            heroElements.forEach((el) => {
                el.classList.add('revealed');
            });
        }, 300);
    }

    // ============================================
    // 6. SMOOTH ANCHOR SCROLLING
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================
    // 7. DETAIL CARDS — Staggered reveal
    // ============================================
    function initDetailCards() {
        const cardGroups = document.querySelectorAll('.craft-details');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const cards = entry.target.querySelectorAll('.detail-card');
                            cards.forEach((card, index) => {
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, index * 150);
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.3 }
            );

            cardGroups.forEach((group) => {
                const cards = group.querySelectorAll('.detail-card');
                cards.forEach((card) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                });
                observer.observe(group);
            });
        }
    }

    // ============================================
    // 8. THREAD ORNAMENT GLOW on scroll
    // ============================================
    function initOrnamentGlow() {
        const ornaments = document.querySelectorAll('.thread-ornament');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.style.boxShadow = '0 0 30px rgba(197, 161, 78, 0.6), 0 0 60px rgba(197, 161, 78, 0.3)';
                            entry.target.style.transform = 'scale(1.2) rotate(180deg)';
                            entry.target.style.transition = 'all 0.8s ease';
                        } else {
                            entry.target.style.boxShadow = '0 0 15px rgba(197, 161, 78, 0.3)';
                            entry.target.style.transform = 'scale(1) rotate(0deg)';
                        }
                    });
                },
                { threshold: 0.5 }
            );

            ornaments.forEach((el) => observer.observe(el));
        }
    }

    // ============================================
    // 9. QUOTE BLOCK ANIMATION
    // ============================================
    function initQuoteAnimation() {
        const quotes = document.querySelectorAll('.artisan-quote');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.3 }
            );

            quotes.forEach((quote) => {
                quote.style.opacity = '0';
                quote.style.transform = 'translateY(30px) scale(0.98)';
                quote.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(quote);
            });
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        createParticles();
        initHeroAnimation();
        initScrollReveal();
        initGoldenThread();
        initParallax();
        initSmoothScroll();
        initDetailCards();
        initOrnamentGlow();
        initQuoteAnimation();
    });

    // Recalculate thread on full load (images etc.)
    window.addEventListener('load', () => {
        setTimeout(() => {
            const event = new Event('scroll');
            window.dispatchEvent(event);
        }, 200);
    });
})();
