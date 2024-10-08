// landing.js
document.addEventListener('DOMContentLoaded', function() {
    // Short delay for the main heading
    setTimeout(() => {
        document.getElementById('main-heading').classList.add('visible');
    }, 100); // Delay of 100ms before starting the animation for main heading

    // Longer delay for the sub-heading
    setTimeout(() => {
        document.getElementById('sub-heading').classList.add('visible');
    }, 600); // Delay of 600ms before starting the animation for sub-heading
});
