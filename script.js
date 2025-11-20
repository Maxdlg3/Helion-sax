// ======================================================================
// 1. GESTION DU HERO FLUIDE (PARALLAX + ZOOM LENT) 
// Utilise requestAnimationFrame et LERP pour la fluidité GPU
// ======================================================================
const initHeroAnimation = () => {
    const heroSection = document.querySelector('.hero-luxe');
    const heroImage = document.querySelector('.hero-image img');

    if (!heroSection || !heroImage) return;

    // --- CONFIGURATION ---
    const intensity = 25; // Force du mouvement de la souris (en px)
    const speed = 0.05;   // "Lourdeur" du mouvement (Plus petit = plus smooth)
    
    // --- VARIABLES D'ÉTAT ---
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let time = 0; // Pour le zoom automatique

    // Capter la position de la souris
    heroSection.addEventListener('mousemove', (e) => {
        // Normaliser les coordonnées par rapport au centre de l'écran
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // La boucle d'animation fluide (Lerp + Zoom)
    const animateHero = () => {
        // A. Calcul du mouvement fluide (Inertie/LERP)
        currentX += (mouseX * intensity - currentX) * speed;
        currentY += (mouseY * intensity - currentY) * speed;

        // B. Calcul du Zoom automatique (Effet "Respiration")
        time += 0.0005; // Vitesse de l'oscillation
        const autoZoom = 1.15 + Math.sin(time) * 0.05; // Oscille entre 1.10 et 1.20

        // C. APPLICATION DU TRANSFORM (Tout en un)
        // Utilisation de translate3d pour la fluidité GPU
        heroImage.style.transform = `scale(${autoZoom}) translate3d(${-currentX}px, ${-currentY}px, 0)`;

        requestAnimationFrame(animateHero);
    };

    // Démarrage de la boucle d'animation
    animateHero();
};

// ======================================================================
// 2. GESTION DE LA TOP BAR (SCROLL EFFECT)
// ======================================================================
const initNavbar = () => {
    const navbar = document.querySelector('.top-bar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
};

// ======================================================================
// 3. CHARGEMENT DIFFÉRÉ YOUTUBE (Performance)
// ======================================================================
const initLazyYoutube = () => {
    const lazyVideos = document.querySelectorAll('.youtube-lazy');

    lazyVideos.forEach(container => {
        const videoId = container.dataset.videoid;
        
        const img = document.createElement('img');
        img.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`; 
        img.alt = "Cliquer pour lire la vidéo YouTube"; 
        
        // Fallback si la version HD n'existe pas
        img.onerror = () => { img.src = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`; }
        
        const playIcon = document.createElement('i');
        playIcon.className = "fas fa-play play-button-overlay"; 
        
        container.appendChild(img);
        container.appendChild(playIcon);

        // Au clic, remplace la miniature par l'iframe
        container.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`; 
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', '');
            iframe.className = "absolute top-0 left-0 w-full h-full";

            container.innerHTML = '';
            container.appendChild(iframe);
        });
    });
};

// ======================================================================
// 4. SLIDER TÉMOIGNAGES (CLIENTS)
// ======================================================================
const initClientSlider = () => {
    const slides = document.querySelectorAll('.client-slide');
    const prev = document.querySelector('.client-prev');
    const next = document.querySelector('.client-next');
    let index = 0;

    if (!slides.length || !prev || !next) return;

    const showSlide = i => {
        slides.forEach(slide => {
            slide.classList.remove('active', 'fade-in');
        });
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
// 5. ANIMATION SCROLL ET HOVERS (UX/UI)
// ======================================================================
const initScrollAnimationsAndHovers = () => {
    // Animation d'apparition au scroll
    const scrollItems = document.querySelectorAll('.vibe-row, .vibe-item, .temoignage-item, .client-slide');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 }); // Déclenche l'animation quand 30% de l'élément est visible

    scrollItems.forEach(item => observer.observe(item));

    // Effet de survol sur les titres (Couleur)
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
// 6. GESTION DU PRELOADER (Timing et Disparition)
// ======================================================================
const handlePreloader = () => {
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    // Délai calé sur l'animation de remplissage du logo (2500ms)
    setTimeout(() => {
        preloader.classList.add('fade-out');
        
        // Délai pour laisser la transition CSS (1000ms) se terminer
        setTimeout(() => {
            preloader.style.display = 'none';
            preloader.remove(); 
        }, 1000); 
    }, 2500); 
};


// ======================================================================
// EXECUTION PRINCIPALE (DOM Content Loaded)
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialise la fonctionnalité la plus sensible : le Hero fluide
    initHeroAnimation(); 
    
    // 2. Le reste des initialisations
    initNavbar();
    initLazyYoutube();
    initClientSlider();
    initScrollAnimationsAndHovers();

    // 3. Déclenche la disparition du préchargeur dès que le DOM est prêt
    handlePreloader();
});