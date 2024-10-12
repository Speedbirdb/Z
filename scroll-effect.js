document.addEventListener('DOMContentLoaded', () => {
    const mainHeading = document.getElementById('main-heading');
    const subHeading = document.getElementById('sub-heading');
    const newSubHeading1 = document.getElementById('new-sub-heading-1');
    const newSubHeading2 = document.getElementById('new-sub-heading-2');
    const globeContainer = document.getElementById('globe-container');
    let currentSection = 0;
    let isTransitioning = false;
    const transitionDuration = 400;
    let normalScrollEnabled = false;

    function fadeOut(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
    }

    function fadeIn(element) {
        element.style.display = 'block';
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    }

    function moveGlobe() {
        if (currentSection >= 3) { // Fourth section (index 3) or later
            const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            globeContainer.style.transform = `translateY(${-scrollPercentage}vh)`;
        } else {
            globeContainer.style.transform = 'translateY(0)';
        }
    }    

    function switchContent(newElements) {
        if (isTransitioning) return;
        isTransitioning = true;

        [mainHeading, subHeading, newSubHeading1, newSubHeading2].forEach(el => {
            if (el.style.display !== 'none') {
                fadeOut(el);
            }
        });

        setTimeout(() => {
            [mainHeading, subHeading, newSubHeading1, newSubHeading2].forEach(el => el.style.display = 'none');
            newElements.forEach(fadeIn);
            
            moveGlobe(); // Move the globe after content switch

            setTimeout(() => {
                isTransitioning = false;
            }, transitionDuration);
        }, transitionDuration);
    }

    function scrollToSection(index) {
        if (index === currentSection || isTransitioning) return;

        if (index < 3 && normalScrollEnabled) {
            disableNormalScroll();
        }

        switch(index) {
            case 0:
                switchContent([mainHeading, subHeading]);
                break;
            case 1:
                switchContent([newSubHeading1]);
                break;
            case 2:
                switchContent([newSubHeading2]);
                break;
            case 3:
                enableNormalScroll(); // Enable normal scroll after the third subtext
                break;
        }
        currentSection = index;
        moveGlobe(); // Move the globe after updating the current section
    }

    function handleScroll(delta) {
        if (delta > 0) {
            // Scroll down
            if (currentSection < 3) {
                scrollToSection(currentSection + 1);
            }
        } else {
            // Scroll up
            if (currentSection > 0) {
                if (normalScrollEnabled && window.scrollY === 0) {
                    scrollToSection(currentSection - 1);
                } else if (!normalScrollEnabled) {
                    scrollToSection(currentSection - 1);
                }
            }
        }
    }

    function enableNormalScroll() {
        normalScrollEnabled = true;
        document.body.style.overflow = 'auto';
        document.body.style.height = '300vh'; // Increase the scrollable height
    }

    function disableNormalScroll() {
        normalScrollEnabled = false;
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        window.scrollTo(0, 0);
        globeContainer.style.transform = 'translateY(0)';
    }

    let lastWheelTime = 0;
    const wheelCooldown = 800;
    const wheelThreshold = 50;

    window.addEventListener('wheel', (event) => {
        const now = performance.now();
        if (now - lastWheelTime > wheelCooldown && Math.abs(event.deltaY) > wheelThreshold) {
            if (!normalScrollEnabled || (normalScrollEnabled && event.deltaY < 0 && window.scrollY === 0)) {
                event.preventDefault();
                handleScroll(event.deltaY);
            }
            lastWheelTime = now;
        }
    }, { passive: false });

    // Touch support for mobile devices
    let startY;
    let touchStartTime;
    const touchThreshold = 100;
    const touchTimeThreshold = 500;

    window.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
        touchStartTime = performance.now();
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const touchEndTime = performance.now();
        const touchDuration = touchEndTime - touchStartTime;

        if (touchDuration <= touchTimeThreshold) {
            const endY = e.changedTouches[0].pageY;
            const deltaY = startY - endY;

            if (Math.abs(deltaY) > touchThreshold) {
                if (!normalScrollEnabled || (normalScrollEnabled && deltaY < 0 && window.scrollY === 0)) {
                    e.preventDefault();
                    handleScroll(deltaY);
                }
            }
        }
    }, { passive: false });

    // Add this event listener for normal scrolling
    window.addEventListener('scroll', () => {
        if (normalScrollEnabled) {
            moveGlobe();
        }
    });

    // Initially disable normal scrolling
    disableNormalScroll();

    // Set initial state
    mainHeading.style.display = 'block';
    subHeading.style.display = 'block';
    setTimeout(() => {
        mainHeading.style.opacity = '1';
        mainHeading.style.transform = 'translateY(0)';
        setTimeout(() => {
            subHeading.style.opacity = '1';
            subHeading.style.transform = 'translateY(0)';
        }, 200);
    }, 100);
});
