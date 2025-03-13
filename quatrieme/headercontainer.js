document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    let scrollThreshold = 50; // Adjust this value to change sensitivity

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up or near the top
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
});
