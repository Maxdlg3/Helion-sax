document.addEventListener("DOMContentLoaded", () => {

    // ===== Slider Témoignages (CLIENTS) =====
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
                void photo.offsetWidth; // force le reflow pour rejouer l’animation
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

    // ===== Ancien Slider Témoignages (optionnel) =====
    const cards = document.querySelectorAll('.temoignage-card');
    const prevCard = document.querySelector('.prev');
    const nextCard = document.querySelector('.next');
    let cardIndex = 0;

    if(cards.length && prevCard && nextCard){
        const showCard = i => {
            cards.forEach(c => c.classList.remove('active'));
            cards[i].classList.add('active');
        };
        prevCard.addEventListener('click', () => {
            cardIndex = (cardIndex - 1 + cards.length) % cards.length;
            showCard(cardIndex);
        });
        nextCard.addEventListener('click', () => {
            cardIndex = (cardIndex + 1) % cards.length;
            showCard(cardIndex);
        });
        showCard(cardIndex);
    }

    // ===== Animation scroll =====
    const scrollItems = document.querySelectorAll('.vibe-row, .vibe-item, .temoignage-item, .client-slide');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');

                const video = entry.target.querySelector('video');
                if(video){
                    video.style.transform = 'scale(1.02) translateY(-5px)';
                    video.style.transition = 'transform 1s ease-out';
                    setTimeout(() => { 
                        video.style.transform = 'scale(1) translateY(0)'; 
                    }, 800);
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    scrollItems.forEach(item => observer.observe(item));

    // ===== Hover titres h3 =====
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
