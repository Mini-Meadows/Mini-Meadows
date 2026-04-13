document.addEventListener('DOMContentLoaded', () => {
    // ==================== SMOOTH SCROLLING ==================== 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== SCROLL ANIMATIONS ==================== 
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.category-card, .step, .promise-item').forEach(el => {
        observer.observe(el);
    });

    // ==================== HEADER SCROLL + ACTIVE NAV (single throttled listener) ====================
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let scrollTicking = false;

    function onScroll() {
        const scrollY = window.scrollY;

        // Header shadow
        header.classList.toggle('scrolled', scrollY > 50);

        // Active nav link
        let currentSection = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').slice(1) === currentSection);
        });

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(onScroll);
            scrollTicking = true;
        }
    }, { passive: true });

    // ==================== MOBILE MENU TOGGLE ====================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ==================== PAGE LOAD ANIMATION ====================
    // Handled via CSS transitions to avoid JS-triggered opacity flash
    document.body.classList.add('loaded');
});

// ==================== PACKAGE DATA ==================== 
const packagesData = {
    'wonder': {
        name: "Wonder Play Pack",
        price: "₹9,999",
        desc: "Designed for intimate celebrations like birthdays, family gatherings, or small events, the Wonder Play Pack creates a vibrant mini–play zone that keeps kids happily engaged throughout the occasion. This curated setup blends active play, sensory fun, and social interaction, ensuring children stay entertained while parents enjoy the event stress-free",
        capacity: "8-10 Kids",
        duration: "5-6 Hours Duration",
        images: ["assets/images/1.jpg", "assets/images/2.jpg", "assets/images/3.jpg", "assets/images/4.jpg"],
        items: [
            "Roller coaster with car",
            "Slide with swing",
            "Ball pool",
            "Junior see saw",
            "Jumbo cuckoo ride on",
            "Play gym",
            "Magic car Medium",
            "Basketball",
            "Caterpillar"
        ]
    },
    'mega': {
        name: "Mega Fun Pack",
        price: "₹14,999",
        desc: "Ideal for medium-sized gatherings like engagement, reception, haldi celebration. This pack offers a diverse range of toys that keep kids of all ages entertained and engaged throughout your event.",
        capacity: "12-15 Kids",
        duration: "5-6 Hours Duration",
        images: ["assets/images/1.jpg", "assets/images/2.jpg", "assets/images/3.jpg", "assets/images/4.jpg"],
        items: [
            "Roller coaster with car",
            "Slide with swing",
            "Slide",
            "Ball pool",
            "Junior see saw",
            "Senior see saw",
            "Elephant 3 way rocker",
            "Jumbo cuckoo ride on",
            "Jumbo stallion ride on",
            "Play gym",
            "Cozy Coupe car",
            "Magic car Medium",
            "Basketball"
        ]
    },
    'royal': {
        name: "Royal Carnival Pack",
        price: "₹17,999",
        desc: "Best for grand celebrations such as birthdays, weddings, corporate events. The ultimate play experience with our most premium collection of toys suitable for large gatherings.",
        capacity: "20-25 Kids",
        duration: "5-6 Hours Duration",
        images: ["assets/images/1.jpg", "assets/images/2.jpg", "assets/images/3.jpg", "assets/images/4.jpg"],
        items: [
            "Large 8ft Trampoline (age 7-14)",
            "Roller coaster with car",
            "Slide with swing",
            "Slide",
            "Ball pool",
            "Junior see saw",
            "Senior see saw",
            "Elephant 3 way rocker",
            "Jumbo cuckoo ride on",
            "Jumbo stallion ride on",
            "Play gym (2 nos)",
            "Cozy Coupe car",
            "Magic car Medium",
            "Magic car large",
            "Basketball"
        ]
    },
    'daily_weekly': {
        name: "Daily/Weekly Rentals",
        price: "Ask for pricing",
        desc: "Flexible rental options for home use or longer duration needs. Choose from our wide selection of toys for daily or weekly enjoyment.",
        capacity: "Varies by toy",
        duration: "Flexible Duration",
        images: ["assets/images/4.jpg", "assets/images/1.jpg", "assets/images/2.jpg", "assets/images/3.jpg"], // Ensure this path is correct
        items: [
            "Individual toy rentals",
            "Weekly subscription packs",
            "Customized play area setup",
            "Doorstep delivery and pickup"
        ]
    }
};

let currentSlide = 0;

// ==================== DISPLAY PACKAGE DETAILS ==================== 
function displayPackageDetails(id) {
    const pkg = packagesData[id];
    if (!pkg) return;

    const pkgName = document.getElementById('pkg-name');
    const pkgPrice = document.getElementById('pkg-price');
    const pkgDesc = document.getElementById('pkg-desc');
    const pkgCapacity = document.getElementById('pkg-capacity');

    if (pkgName) pkgName.textContent = pkg.name;
    if (pkgPrice) pkgPrice.textContent = pkg.price;
    if (pkgDesc) pkgDesc.textContent = pkg.desc;
    if (pkgCapacity) pkgCapacity.innerHTML = `<span class="highlight-icon">👥</span> Accommodates ${pkg.capacity}`;
    // Add this line to update the duration dynamically
    document.getElementById('pkg-duration').textContent = pkg.duration || "5-6 Hours Duration";
    // Setup Carousel — first image eager, rest lazy
    const track = document.getElementById('pkg-carousel-track');
    if (track) {
        track.innerHTML = pkg.images.map((imgSrc, i) =>
            `<img src="${imgSrc}" alt="${pkg.name}" class="carousel-slide"${i > 0 ? ' loading="lazy"' : ''}>`
        ).join('');

        const dots = document.getElementById('carousel-dots');
        if (dots) {
            dots.innerHTML = pkg.images.map((_, i) =>
                `<span class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>`
            ).join('');
        }

        currentSlide = 0;
        updateCarousel();
    }

    // Setup Inventory
    const list = document.getElementById('pkg-inventory');
    if (list) {
        list.innerHTML = pkg.items.map(item => `<li>${item}</li>`).join('');
    }
}

// ==================== CAROUSEL FUNCTIONS ==================== 
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
    if (slides.length === 0) return;

    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// ==================== KEYBOARD NAVIGATION ==================== 
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveSlide(-1);
    if (e.key === 'ArrowRight') moveSlide(1);
});

// ==================== TOUCH SUPPORT FOR CAROUSEL ==================== 
let touchStartX = 0;
let touchEndX = 0;

const carousel = document.getElementById('pkg-carousel-track');
if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            moveSlide(1); // Swiped left
        } else {
            moveSlide(-1); // Swiped right
        }
    }
}

// ==================== DYNAMIC GALLERY LOGIC ====================

const photoNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];
const videoNames = ['1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4', '6.mp4', '7.mp4', '8.mp4', '9.mp4', '10.mp4'];

const basePhotoUrl = "https://filedn.eu/lbu0dswNxxUBjQKg0kNdmLu/PlaySphere/Event%20photos/";
const baseVideoUrl = "https://filedn.eu/lbu0dswNxxUBjQKg0kNdmLu/PlaySphere/Event%20videos/";

function loadRandomGallery() {
    const photoContainer = document.getElementById('photo-gallery');
    const videoContainer = document.getElementById('video-gallery');

    if (!photoContainer && !videoContainer) return;

    const randomPhotos = [...photoNames].sort(() => 0.5 - Math.random()).slice(0, 4);
    const randomVideos = [...videoNames].sort(() => 0.5 - Math.random()).slice(0, 4);

    // Photos — all lazy loaded
    if (photoContainer) {
        photoContainer.innerHTML = randomPhotos.map(name => `
            <img src="${basePhotoUrl}${name}" class="media-item" alt="Play Sphere Event" loading="lazy" width="220" height="250">
        `).join('');
    }

    // Videos — use IntersectionObserver to only load when scrolled into view
    if (videoContainer) {
        videoContainer.innerHTML = randomVideos.map(name => `
            <video
                class="media-item"
                data-src="${baseVideoUrl}${name}"
                preload="none"
                playsinline
                muted
                loop
                poster="assets/images/PlaySphere.png"
            ></video>
        `).join('');

        // Lazy-load and autoplay videos only when visible
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    if (!video.src && video.dataset.src) {
                        video.src = video.dataset.src;
                        video.load();
                    }
                    video.play().catch(() => { }); // catch autoplay block silently
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        videoContainer.querySelectorAll('video').forEach(v => videoObserver.observe(v));
    }
}

loadRandomGallery();