function initHexBackground() {
    const container = document.getElementById('hexBackground');
    const isMobile = window.innerWidth <= 768;
    
    function createHexagons() {
        container.innerHTML = '';
        
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        
        // Responsive hexagon sizing with increased density for mobile
        let hexWidth, hexHeight, opacityMultiplier;
        if (containerWidth <= 768) {
            hexWidth = 30;
            hexHeight = 17.32;
            opacityMultiplier = 0.8;
        } else {
            hexWidth = 60;
            hexHeight = 34.64;
            opacityMultiplier = 0.47;
        }

        const horizontalSpacing = hexWidth * 0.75;
        const verticalSpacing = hexHeight;
        const columns = Math.ceil(containerWidth / horizontalSpacing) + 2;
        const rows = Math.ceil(containerHeight / verticalSpacing) + 2;

        // Calculate oval parameters
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const horizontalRadius = containerWidth * 0.75; // Oval width
        const verticalRadius = containerHeight * 0.6;   // Oval height

        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < columns; col++) {
                const hexagon = document.createElement('div');
                hexagon.className = 'hexagon';
                
                const x = col * horizontalSpacing;
                const y = row * verticalSpacing + (col % 2) * (hexHeight / 2);
                
                hexagon.style.left = `${x}px`;
                hexagon.style.top = `${y}px`;
                hexagon.style.width = `${hexWidth}px`;
                hexagon.style.height = `${hexHeight}px`;

                // Calculate distance using oval formula
                const dx = (x - centerX) / horizontalRadius;
                const dy = (y - centerY) / verticalRadius;
                const ovalDistance = Math.sqrt(dx * dx + dy * dy);
                
                // Adjusted opacity calculation for oval pattern
                let opacity;
                if (isMobile) {
                    opacity = Math.max(0.15, 1 - Math.pow(ovalDistance, 1.5));
                    opacity *= opacityMultiplier;
                } else {
                    opacity = Math.max(0.1, 1 - Math.pow(ovalDistance, 1.3)) * opacityMultiplier;
                }

                // Ensure opacity is within bounds
                opacity = Math.min(Math.max(opacity, 0), 1);

                // Apply color with calculated opacity
                hexagon.style.backgroundColor = `rgba(0, 0, 120, ${opacity})`;
                hexagon.style.borderColor = `rgba(0, 0, 150, ${opacity * 0.15})`;
                
                container.appendChild(hexagon);
            }
        }
    }

    // Initial creation
    createHexagons();

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
            createHexagons();
        }, 250);
    });
}

// Export the initialization function
window.initHexBackground = initHexBackground;
