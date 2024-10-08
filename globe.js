// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('globeCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the globe
const radius = 5;
const geometry = new THREE.SphereGeometry(radius, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Create latitude and longitude lines
function createLatitudeLines() {
    const latitudeMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc });
    for (let lat = -90; lat <= 90; lat += 2) {
        const points = [];
        for (let lon = 0; lon <= 360; lon += 2) {
            const latRad = THREE.MathUtils.degToRad(lat);
            const lonRad = THREE.MathUtils.degToRad(lon);
            points.push(new THREE.Vector3(
                radius * Math.cos(latRad) * Math.cos(lonRad),
                radius * Math.sin(latRad),
                radius * Math.cos(latRad) * Math.sin(lonRad)
            ));
        }
        const latLineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const latLine = new THREE.Line(latLineGeometry, latitudeMaterial);
        scene.add(latLine);
    }
}

function createLongitudeLines() {
    const longitudeMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc });
    for (let lon = 0; lon < 360; lon += 2) {
        const points = [];
        for (let lat = -90; lat <= 90; lat += 2) {
            const latRad = THREE.MathUtils.degToRad(lat);
            const lonRad = THREE.MathUtils.degToRad(lon);
            points.push(new THREE.Vector3(
                radius * Math.cos(latRad) * Math.cos(lonRad),
                radius * Math.sin(latRad),
                radius * Math.cos(latRad) * Math.sin(lonRad)
            ));
        }
        const lonLineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lonLine = new THREE.Line(lonLineGeometry, longitudeMaterial);
        scene.add(lonLine);
    }
}

createLatitudeLines();
createLongitudeLines();

// Set initial camera position for close-up view
camera.position.z = radius + 2;

// Rendering flag
let isRendering = true;

// Render the scene
function render() {
    if (isRendering) {
        requestAnimationFrame(render);
        globe.rotation.y += 0.01; // Rotate globe
        renderer.render(scene, camera);
    }
}

render();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start with overlay covering the screen
setTimeout(() => {
    document.getElementById('overlay').style.top = '-100%'; // Move overlay out of view
    setTimeout(() => {
        isRendering = true; // Start rendering after overlay disappears
        animateZoomOut(); // Start zooming out animation
    }, 500); // Delay to allow overlay transition to complete
}, 200); // Initial delay before starting overlay transition

function animateZoomOut() {
    let zoomOutInterval = setInterval(() => {
        if (camera.position.z > radius + 10) { // Stop zooming out after reaching desired distance
            camera.position.z -= 0.1; // Zoom out slowly
        } else {
            clearInterval(zoomOutInterval); // Stop zooming out when done
        }
    }, 16); // Approximately every frame (60 FPS)
}
