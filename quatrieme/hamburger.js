document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('hamburger');
    const navbar = document.querySelector('.navbar');
    let isNavbarOpen = false;

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navbar.classList.toggle('active');
        isNavbarOpen = !isNavbarOpen;

        // Toggle navbar visibility
        if (isNavbarOpen) {
            navbar.style.visibility = 'visible';
        } else {
            navbar.style.visibility = 'hidden';
        }
    });

    // Add this event listener to close the navbar when clicking outside
    document.addEventListener('click', function(event) {
        const target = event.target;
        const isClickInsideNavbar = navbar.contains(target) || menuToggle.contains(target);

        if (!isClickInsideNavbar && isNavbarOpen) {
            menuToggle.classList.remove('active');
            navbar.classList.remove('active');
            isNavbarOpen = false;
            navbar.style.visibility = 'hidden';
        }
    });
});
