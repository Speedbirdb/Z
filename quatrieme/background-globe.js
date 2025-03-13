// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
window.backgroundGlobeCamera = camera;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('globeCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create the globe
const radius = 5;
const globeGeometry = new THREE.SphereGeometry(radius, 32, 32);
const globeMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
globe.position.set(0, 0, 0);
scene.add(globe);

// This is the place where latitude lines been created
function createLatitudeLines() {
    const latitudeMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.8, side: THREE.FrontSide });
    for (let lat = -90; lat <= 90; lat += 2) {
        const points = [];
        for (let lon = 0; lon <= 360; lon += 2) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = lon * (Math.PI / 180);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);
            points.push(new THREE.Vector3(x, y, z));
        }
        const latGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const latLine = new THREE.Line(latGeometry, latitudeMaterial);
        scene.add(latLine);
    }
}

// Function to create longitude lines
function createLongitudeLines() {
    const longitudeMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.8, side: THREE.FrontSide });
    for (let lon = 0; lon < 360; lon += 2) {
        const points = [];
        for (let lat = -90; lat <= 90; lat += 2) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = lon * (Math.PI / 180);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);
            points.push(new THREE.Vector3(x, y, z));
        }
        const lonGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lonLine = new THREE.Line(lonGeometry, longitudeMaterial);
        scene.add(lonLine);
    }
}

// Create the gridlines
createLatitudeLines();
createLongitudeLines();

// Set up camera position and orientation
const cameraDistance = 12;
const tiltAngle = Math.PI / 4.5;
camera.position.set(
    0,
    Math.sin(tiltAngle) * cameraDistance,
    Math.cos(tiltAngle) * cameraDistance
);
camera.lookAt(new THREE.Vector3(0, 2, 0));
camera.fov = 21;
camera.updateProjectionMatrix();
window.backgroundGlobeCamera = camera; // Add this line



// Add ambient and directional light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Render function
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
