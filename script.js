// Navigation Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gallery functionality
let currentPhotos = [];
let filteredPhotos = [];
let currentLightboxIndex = 0;

// Sample photos (will be replaced by Lightroom API data)
const samplePhotos = [
    {
        id: 1,
        title: 'Mountain Sunset',
        category: 'landscape',
        url: 'https://picsum.photos/800/800?random=1',
        thumbnail: 'https://picsum.photos/400/400?random=1'
    },
    {
        id: 2,
        title: 'City Lights',
        category: 'street',
        url: 'https://picsum.photos/800/800?random=2',
        thumbnail: 'https://picsum.photos/400/400?random=2'
    },
    {
        id: 3,
        title: 'Portrait Study',
        category: 'portrait',
        url: 'https://picsum.photos/800/800?random=3',
        thumbnail: 'https://picsum.photos/400/400?random=3'
    },
    {
        id: 4,
        title: 'Forest Path',
        category: 'nature',
        url: 'https://picsum.photos/800/800?random=4',
        thumbnail: 'https://picsum.photos/400/400?random=4'
    },
    {
        id: 5,
        title: 'Urban Architecture',
        category: 'street',
        url: 'https://picsum.photos/800/800?random=5',
        thumbnail: 'https://picsum.photos/400/400?random=5'
    },
    {
        id: 6,
        title: 'Golden Hour',
        category: 'landscape',
        url: 'https://picsum.photos/800/800?random=6',
        thumbnail: 'https://picsum.photos/400/400?random=6'
    },
    {
        id: 7,
        title: 'Candid Moment',
        category: 'portrait',
        url: 'https://picsum.photos/800/800?random=7',
        thumbnail: 'https://picsum.photos/400/400?random=7'
    },
    {
        id: 8,
        title: 'Wildflowers',
        category: 'nature',
        url: 'https://picsum.photos/800/800?random=8',
        thumbnail: 'https://picsum.photos/400/400?random=8'
    },
    {
        id: 9,
        title: 'Downtown',
        category: 'street',
        url: 'https://picsum.photos/800/800?random=9',
        thumbnail: 'https://picsum.photos/400/400?random=9'
    }
];

// Load photos from localStorage or use sample photos
function loadPhotos() {
    const storedPhotos = localStorage.getItem('portfolioPhotos');
    if (storedPhotos) {
        try {
            currentPhotos = JSON.parse(storedPhotos);
        } catch (e) {
            console.error('Error loading photos from storage:', e);
            currentPhotos = samplePhotos;
        }
    } else {
        currentPhotos = samplePhotos;
    }
    filteredPhotos = [...currentPhotos];
    renderGallery(filteredPhotos);
}

// Render gallery
function renderGallery(photos) {
    const galleryGrid = document.getElementById('galleryGrid');

    if (photos.length === 0) {
        galleryGrid.innerHTML = '<div class="loading">No photos found</div>';
        return;
    }

    galleryGrid.innerHTML = photos.map((photo, index) => `
        <div class="gallery-item" data-category="${photo.category}" data-index="${index}">
            <img src="${photo.thumbnail || photo.url}" alt="${photo.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="gallery-item-title">${photo.title}</div>
                <div class="gallery-item-category">${photo.category}</div>
            </div>
        </div>
    `).join('');

    // Add click events to gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
            openLightbox(index);
        });
    });
}

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter photos
        const filter = button.getAttribute('data-filter');
        if (filter === 'all') {
            filteredPhotos = [...currentPhotos];
        } else {
            filteredPhotos = currentPhotos.filter(photo => photo.category === filter);
        }

        renderGallery(filteredPhotos);
    });
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeLightbox = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
    const photo = filteredPhotos[currentLightboxIndex];
    lightboxImg.src = photo.url;
    lightboxCaption.textContent = photo.title;
}

closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightboxImage();
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredPhotos.length;
    updateLightboxImage();
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentLightboxIndex = (currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
            updateLightboxImage();
        } else if (e.key === 'ArrowRight') {
            currentLightboxIndex = (currentLightboxIndex + 1) % filteredPhotos.length;
            updateLightboxImage();
        }
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);

    // Here you would typically send the data to a backend
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    }

    lastScroll = currentScroll;
});

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos();
});

// Export function to add photos (for use with Lightroom API)
window.addPhoto = function(photo) {
    currentPhotos.push(photo);
    localStorage.setItem('portfolioPhotos', JSON.stringify(currentPhotos));
    filteredPhotos = [...currentPhotos];
    renderGallery(filteredPhotos);
};

// Export function to update all photos
window.updatePhotos = function(photos) {
    currentPhotos = photos;
    localStorage.setItem('portfolioPhotos', JSON.stringify(currentPhotos));
    filteredPhotos = [...currentPhotos];
    renderGallery(filteredPhotos);
};
