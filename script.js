document.addEventListener("DOMContentLoaded", () => {

    // ======================================================================
    // 1. GESTION DE LA TOP BAR (SCROLL EFFECT) - NOUVEAU
    // ======================================================================
    const navbar = document.querySelector('.top-bar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ======================================================================
    // 2. CHARGEMENT DIFFÉRÉ YOUTUBE
    // ======================================================================
    const lazyVideos = document.querySelectorAll('.youtube-lazy');

    lazyVideos.forEach(container => {
        const videoId = container.dataset.videoid;
        
        // Création de l'élément Image (la miniature)
        const img = document.createElement('img');
        
        // On utilise 'maxresdefault.jpg' pour la meilleure qualité
        img.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`; 
        img.alt = "Cliquer pour lire la vidéo YouTube"; 
        
        // Système de secours (fallback) si la HD n'existe pas
        img.onerror = () => {
            img.src = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`; 
        }
        
        // Création de l'élément Icône (le bouton Play)
        const playIcon = document.createElement('i');
        playIcon.className = "fas fa-play play-button-overlay"; 
        
        container.appendChild(img);
        container.appendChild(playIcon);

        // Écoute du clic de l'utilisateur
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

    // ======================================================================
    // 3. SLIDER TÉMOIGNAGES (CLIENTS)
    // ======================================================================
    const slides = document.querySelectorAll('.client-slide');
    const prev = document.querySelector('.client-prev');
    const next = document.querySelector('.client-next');
    let index = 0;

    if (slides.length && prev && next) {
        const showSlide = i => {
            slides.forEach(slide => {
                slide.classList.remove('active', 'fade-in');
            });
            slides[i].classList.add('active', 'fade-in');

            // animation photo client
            const photo = slides[i].querySelector('img');
            if (photo) {
                photo.classList.remove('photo-anim');
                void photo.offsetWidth; // force le reflow
                photo.classList.add('photo-anim');
            }
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
    }

    // ======================================================================
    // 4. ANIMATION SCROLL (APPARITION DES ÉLÉMENTS)
    // ======================================================================
    const scrollItems = document.querySelectorAll('.vibe-row, .vibe-item, .temoignage-item, .client-slide');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    scrollItems.forEach(item => observer.observe(item));

    // ======================================================================
    // 5. HOVER TITRES H3
    // ======================================================================
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

});


// ======================================================================
// 1. GESTION DU PRELOADER (Synchronisé avec l'animation)
// ======================================================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // ON CHANGE ICI : 2500ms = 2.5 secondes
        // Le script attendra forcément que le logo soit rempli avant de disparaître
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // On supprime l'élément une fois la transition de sortie finie
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000); 
        }, 2500); // <--- C'est ce chiffre qui contrôle la durée minimale
    }
});