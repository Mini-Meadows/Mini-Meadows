document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple scroll animation for reveal effects
    const revealElements = document.querySelectorAll('.category-card, .step, .promise-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(el);
    });

    // Intersection observer callback modification to handle reveal
    document.body.addEventListener('reveal', (e) => {
        // Handle reveal class logic if needed
    });

    // Listen for scroll to toggle header background
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.padding = '0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
    });
});

// Add revealed class style via JS to keep CSS clean for skeleton
const style = document.createElement('style');
style.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

const packagesData = {
    'wonder': {
        name: "Wonder Play Pack",
        price: "₹9,999",
        desc: "Designed for intimate celebrations like birthdays, family gatherings, or small events, the Wonder Play Pack creates a vibrant mini–play zone that keeps kids happily engaged throughout the occasion. This curated setup blends active play, sensory fun, and social interaction, ensuring children stay entertained while parents enjoy the event stress-free",
        capacity: "8-10 Kids",
        images: ["assets/images/cat-active.jpg", "assets/images/cat-wooden.jpg", "assets/images/cat-vehicles.jpg"],
        items: ["Roller coaster with car", "Slide with swing", "Ball pool", "Junior see saw", "Jumbo cuckoo ride on", "Play gym", "Magic car Medium", "Basketball", "Caterpillar"]
    },
    'mega': {
        name: "Mega Fun Pack",
        price: "₹14,999",
        desc: "Ideal for medium-sized gatherings like engagement, reception, haldi celebration.",
        capacity: "12-15 Kids",
        images: ["assets/images/cat-wooden.jpg", "assets/images/cat-vehicles.jpg", "assets/images/cat-premium.jpg"],
        items: ["Roller coaster with car", "Slide with swing", "Slide", "Ball pool", "Junior see saw", "Senior see saw", "Elephant 3 way rocker", "Jumbo cuckoo ride on", "Jumbo stallion ride on", "Play gym", "Cozy Coupe car", "Magic car Medium", "Basketball"]
    },
    'royal': {
        name: "Royal Carnival Pack",
        price: "₹17,999",
        desc: "Best for grand celebrations such as birthdays, weddings, corporate events.",
        capacity: "20-25 Kids",
        images: ["assets/images/cat-premium.jpg", "assets/images/cat-active.jpg", "assets/images/cat-wooden.jpg"],
        items: ["Large 8ft Trampoline (age 7-14)", "Roller coaster with car", "Slide with swing", "Slide", "Ball pool", "Junior see saw", "Senior see saw", "Elephant 3 way rocker", "Jumbo cuckoo ride on", "Jumbo stallion ride on", "Play gym (2 nos)", "Cozy Coupe car", "Magic car Medium", "Magic car large", "Basketball"]
    }
};

let currentSlide = 0;

function displayPackageDetails(id) {
    const pkg = packagesData[id];
    if (!pkg) return;

    document.getElementById('pkg-name').textContent = pkg.name;
    document.getElementById('pkg-price').textContent = pkg.price;
    document.getElementById('pkg-desc').textContent = pkg.desc;
    document.getElementById('pkg-capacity').innerHTML = `<span class="highlight-icon">👥</span> Accommodates ${pkg.capacity}`;

    // Setup Carousel
    const track = document.getElementById('pkg-carousel-track');
    if (track) {
        track.innerHTML = pkg.images.map(imgSrc => `<img src="${imgSrc}" alt="${pkg.name}" class="carousel-slide">`).join('');

        const dots = document.getElementById('carousel-dots');
        if (dots) {
            dots.innerHTML = pkg.images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>`).join('');
        }

        currentSlide = 0;
        updateCarousel();
    }

    const list = document.getElementById('pkg-inventory');
    list.innerHTML = pkg.items.map(item => `<li>${item}</li>`).join('');
}

function updateCarousel() {
    const track = document.getElementById('pkg-carousel-track');
    if (!track) return;

    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function moveSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}