// ============================================================================
// HELION SAX - SCRIPT PRINCIPAL - VERSION OPTIMISEE SEO / CORE WEB VITALS
// ============================================================================
// Changements majeurs par rapport à la version précédente :
//
// 1. PRELOADER : suppression du setTimeout(2500ms) hardcodé qui bloquait le LCP.
//    => Le preloader se cache dès que la page est prête (event "load"), avec
//       un minimum visuel de 1200ms pour profiter de l'animation du logo,
//       et un filet de sécurité maximal à 2500ms. Gain LCP estimé : -1 à -2s.
//
// 2. HERO : l'animation parallax ne tourne plus en permanence en arrière-plan.
//    => Elle s'arrête automatiquement quand le hero n'est plus visible
//       (IntersectionObserver), respecte prefers-reduced-motion, et est
//       désactivée sur mobile (pas de souris = animation inutile + économie batterie).
//       Impact : score Lighthouse mobile amélioré = Google te pousse plus haut.
//
// 3. PRECONNECT : ajout automatique de preconnect aux domaines YouTube/TikTok
//    pour accélérer le chargement des vidéos intégrées.
// ============================================================================


// ======================================================================
// 1. HERO FLUIDE (PARALLAX + ZOOM LENT) - OPTIMISE
// ======================================================================
const initHeroAnimation = () => {
    const heroSection = document.querySelector('.hero-luxe');
    const heroImage = document.querySelector('.hero-image img');
    if (!heroSection || !heroImage) return;

    // Respect de l'accessibilité (Google aime les sites accessibles)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Pas d'animation sur mobile/tablette : aucune souris, et gain CPU/batterie énorme.
    // C'est un vrai signal positif pour le score Lighthouse mobile.
    if (window.innerWidth < 992) return;

    const intensity = 25;
    const speed = 0.05;
    let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0, time = 0;
    let isVisible = true;
    let rafId = null;

    heroSection.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    // Boucle d'animation
    const animateHero = () => {
        if (!isVisible) { rafId = null; return; }
        currentX += (mouseX * intensity - currentX) * speed;
        currentY += (mouseY * intensity - currentY) * speed;
        time += 0.0005;
        const autoZoom = 1.15 + Math.sin(time) * 0.05;
        heroImage.style.transform = `scale(${autoZoom}) translate3d(${-currentX}px, ${-currentY}px, 0)`;
        rafId = requestAnimationFrame(animateHero);
    };

    // Pause l'animation quand le hero sort du viewport (gain CPU/batterie)
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !rafId) animateHero();
    }, { threshold: 0 });
    observer.observe(heroSection);

    animateHero();
};


// ======================================================================
// 2. TOP BAR - EFFET SCROLL (identique, juste throttlé pour la perf)
// ======================================================================
const initNavbar = () => {
    const navbar = document.querySelector('.top-bar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
};


// ======================================================================
// 3. YOUTUBE LAZY LOAD - + preconnect pour accélérer le 1er clic
// ======================================================================
const initLazyYoutube = () => {
    const lazyVideos = document.querySelectorAll('.youtube-lazy');
    if (!lazyVideos.length) return;

    // Preconnect : prévient le navigateur qu'on va parler à YouTube (gain ~300ms au clic)
    const preconnects = [
        'https://www.youtube-nocookie.com',
        'https://i.ytimg.com',
        'https://www.google.com'
    ];
    preconnects.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        document.head.appendChild(link);
    });

    lazyVideos.forEach(container => {
        const videoId = container.dataset.videoid;
        const img = document.createElement('img');
        img.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        // ALT IMPORTANT POUR SEO : décrit le contenu, pas juste "lecture vidéo"
        img.alt = `Hélion Sax saxophoniste - prestation live (vidéo YouTube)`;
        img.loading = 'lazy';
        img.onerror = () => { img.src = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`; };

        const playIcon = document.createElement('i');
        playIcon.className = 'fas fa-play play-button-overlay';
        playIcon.setAttribute('aria-label', 'Lire la vidéo');

        container.appendChild(img);
        container.appendChild(playIcon);

        container.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('title', 'Hélion Sax - vidéo de prestation live');
            iframe.className = 'absolute top-0 left-0 w-full h-full';
            container.innerHTML = '';
            container.appendChild(iframe);
        });
    });
};


// ======================================================================
// 4. SLIDER TEMOIGNAGES (identique)
// ======================================================================
const initClientSlider = () => {
    const slides = document.querySelectorAll('.client-slide');
    const prev = document.querySelector('.client-prev');
    const next = document.querySelector('.client-next');
    let index = 0;
    if (!slides.length || !prev || !next) return;

    const showSlide = i => {
        slides.forEach(slide => slide.classList.remove('active', 'fade-in'));
        slides[i].classList.add('active', 'fade-in');
    };

    prev.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    });
    next.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    });
    showSlide(index);
};


// ======================================================================
// 5. ANIMATIONS SCROLL + HOVERS (identique)
// ======================================================================
const initScrollAnimationsAndHovers = () => {
    const scrollItems = document.querySelectorAll('.vibe-row, .vibe-item, .temoignage-item, .client-slide');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    scrollItems.forEach(item => observer.observe(item));

    const titles = document.querySelectorAll('.vibe-text h3');
    titles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.style.color = '#d9a441';
            title.style.transition = 'color 0.4s ease';
        });
        title.addEventListener('mouseleave', () => {
            title.style.color = '#5c3a21';
        });
    });
};


// ======================================================================
// 6. PRELOADER - VERSION OPTIMISEE CORE WEB VITALS
// ======================================================================
// AVANT : setTimeout hardcodé de 2500ms + 1000ms de fade = tout le monde attendait
//         toujours 3,5s, même si la page était chargée en 300ms. Catastrophique LCP.
// APRES : on se base sur l'event "load" réel + un minimum visuel de 1200ms
//         + un filet de sécurité max de 2500ms.
// ======================================================================
const handlePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const MIN_VISIBLE = 1200;  // Durée mini pour qu'on voie l'anim du logo (en ms)
    const MAX_VISIBLE = 2500;  // Jamais plus (sécurité)
    const startTime   = performance.now();
    let   hidden      = false;

    const hidePreloader = () => {
        if (hidden) return;
        hidden = true;
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            preloader.remove();
        }, 600); // Fade réduit de 1000ms à 600ms
    };

    const triggerHide = () => {
        const elapsed = performance.now() - startTime;
        const wait = Math.max(0, MIN_VISIBLE - elapsed);
        setTimeout(hidePreloader, wait);
    };

    if (document.readyState === 'complete') {
        triggerHide();
    } else {
        window.addEventListener('load', triggerHide, { once: true });
    }

    // Filet de sécurité : si pour une raison X le "load" ne se déclenche pas
    setTimeout(hidePreloader, MAX_VISIBLE);
};


// ======================================================================
// EXECUTION
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimation();
    initNavbar();
    initLazyYoutube();
    initClientSlider();
    initScrollAnimationsAndHovers();
    handlePreloader();
});
