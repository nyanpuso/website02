import { appState } from './state.js';
import { loadSlidesData } from './data.js';
import { TypewriterAnimator } from './utils/typewriter.js';

let currentSlideIndex = 0;
let currentPageIndex = 0;
const SHOW_WELCOME = !sessionStorage.getItem('welcomed');

export const slider = {
    render(): void {
        // HTML already exists in toppage.html, just initialize
        this.init();
    },

    init(): void {
        // Load data first
        loadSlidesData().then(() => this.setup());
    },

    setup(): void {
        // Sort slides by priority (welcome should be first with priority 1)
        appState.slidesData.sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));

        // Setup page buttons (left navigation)
        this.setupPageButtons();

        // Render event list (exclude first slide - the welcome entry)
        this.renderEventList();

        // Show welcome on first load, otherwise show first event
        if (SHOW_WELCOME) {
            this.showWelcome();
        } else {
            // Hide welcome and show first event
            const welcomeBlock = document.getElementById('welcome-block');
            if (welcomeBlock) {
                welcomeBlock.classList.add('hidden');
            }
            this.showSlide(1); // Show second slide (first event)
        }
    },

    showWelcome(): void {
        const welcomeBlock = document.getElementById('welcome-block');
        if (!welcomeBlock || appState.slidesData.length === 0) return;

        welcomeBlock.classList.remove('hidden');

        const welcomeImage = document.getElementById('welcome-image') as HTMLImageElement;
        if (welcomeImage) {
            const welcomeSlide = appState.slidesData[0];
            welcomeImage.src = welcomeSlide.image;
            welcomeImage.onload = () => {
                this.startTypewriter();
            };
        }
    },

    startTypewriter(): void {
        const typewriterContainer = document.getElementById('typewriter-text');
        if (!typewriterContainer || appState.slidesData.length === 0) return;

        const welcomeText = appState.slidesData[0].title || 'ようこそ、大潟ショッピングセンターへ';

        const animator = new TypewriterAnimator(
            typewriterContainer,
            welcomeText,
            80,
            () => {
                // Preload next slides during animation
                this.preloadNextSlides();

                // Transition to first event after animation completes
                setTimeout(() => {
                    sessionStorage.setItem('welcomed', '1');
                    const welcomeBlock = document.getElementById('welcome-block');
                    if (welcomeBlock) {
                        welcomeBlock.classList.add('hidden');
                    }
                    this.showSlide(1); // Show first event (second slide)
                }, 500);
            }
        );

        animator.start();
    },

    showSlide(index: number): void {
        currentSlideIndex = index;
        const slide = appState.slidesData[index];
        if (!slide) return;

        const sliderImage = document.getElementById('slider-image') as HTMLImageElement;
        const sliderTitle = document.getElementById('slider-title');
        const sliderSubtitle = document.getElementById('slider-subtitle');
        const sliderDescription = document.getElementById('slider-description');

        if (sliderImage) sliderImage.src = slide.image;
        if (sliderTitle) sliderTitle.textContent = slide.title || '';
        if (sliderSubtitle) sliderSubtitle.textContent = slide.subtitle || '';
        if (sliderDescription) sliderDescription.innerHTML = slide.description || '';

        // Update active state in event list
        this.updateEventListActive(index);

        // Preload next image
        this.preloadImageAt((index + 1) % appState.slidesData.length);
    },

    renderEventList(): void {
        const eventList = document.getElementById('event-list');
        if (!eventList) return;

        eventList.innerHTML = '';

        // Skip first slide (index 0 - the welcome entry), display from index 1 onwards
        appState.slidesData.forEach((slide: any, index: number) => {
            if (index === 0) return; // Skip welcome slide from event list

            const li = document.createElement('li');
            li.className = `event-item ${index === 1 ? 'active' : ''}`;
            
            li.innerHTML = `
                <img class="event-thumbnail" src="${slide.image}" alt="${slide.title}">
                <div class="event-info">
                    <div class="event-title">${slide.title}</div>
                    <div class="event-subtitle">${slide.subtitle || slide.description?.substring(0, 40) || ''}</div>
                </div>
            `;

            li.addEventListener('click', () => this.showSlide(index));
            eventList.appendChild(li);
        });
    },

    setupPageButtons(): void {
        const pageButtons = document.querySelectorAll('.page-button');
        pageButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.switchPage(index);
            });
        });
    },

    switchPage(index: number): void {
        currentPageIndex = index;

        // Update active state for page buttons
        const pageButtons = document.querySelectorAll('.page-button');
        pageButtons.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        // Scroll to top of slider section (for now, only one page "home" shows slider content)
        const sliderSection = document.querySelector('.slider-section') as HTMLElement;
        if (sliderSection) {
            sliderSection.scrollTop = 0;
        }

        console.log('Switched to page:', index);
    },

    updateEventListActive(slideIndex: number): void {
        const eventItems = document.querySelectorAll('.event-item');
        eventItems.forEach((item, i) => {
            // Map event item index to slide index (accounting for skipped first slide)
            // Event item 0 corresponds to slide index 1, etc.
            const actualSlideIndex = i + 1;
            item.classList.toggle('active', actualSlideIndex === slideIndex);
        });
    },

    preloadNextSlides(): void {
        // Preload next 3 slides
        for (let i = 1; i <= 3 && i < appState.slidesData.length; i++) {
            this.preloadImageAt((currentSlideIndex + i) % appState.slidesData.length);
        }
    },

    preloadImageAt(index: number): void {
        const slide = appState.slidesData[index];
        if (slide && slide.image) {
            const img = new Image();
            img.src = slide.image;
        }
    },

    next(): void {
        const len = appState.slidesData.length;
        this.showSlide((currentSlideIndex + 1) % len);
    },

    prev(): void {
        const len = appState.slidesData.length;
        this.showSlide((currentSlideIndex - 1 + len) % len);
    }
};
