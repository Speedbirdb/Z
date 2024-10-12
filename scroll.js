document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const globeContainer = document.getElementById('globe-container');
    let isScrolling = false;
    let currentSection = 0;

    function smoothScrollTo(element, duration) {
        const start = window.pageYOffset;
        const target = element.offsetTop;
        const distance = target - start;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
            else isScrolling = false;
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    function moveGlobe() {
        if (currentSection === 2) { // Third section (index 2)
            globeContainer.style.transform = 'translateY(-50vh)';
        } else {
            globeContainer.style.transform = 'translateY(0)';
        }
    }

    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        isScrolling = true;

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (e.deltaY < 0 && currentSection > 0) {
            currentSection--;
        }

        smoothScrollTo(sections[currentSection], 1000);
        moveGlobe();
    });

    // Handle initial page load
    moveGlobe();
});
