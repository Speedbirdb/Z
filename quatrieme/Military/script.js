class MilitaryGlobe {
    constructor() {
        this.init();
        this.createScene();
        this.createLights();
        this.createGlobe();
        this.createGrid();
        this.createRadar();
        this.createAltitudeRings();
        this.addEventListeners();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('globeCanvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.camera.position.set(0, 10, 15);
        this.camera.lookAt(0, 0, 0);
        
        this.clock = new THREE.Clock();
        this.radius = 5;
    }

    createScene() {
        this.scene.fog = new THREE.FogExp2(0x000000, 0.00025);
        this.renderer.setClearColor(0x000000, 0);
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x222222);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(ambientLight, directionalLight);
    }

    createGlobe() {
        const globeGeometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const globeMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a1a1a,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
        this.scene.add(this.globe);

        // Add latitude/longitude lines
        this.createLatLongLines();
    }

    createLatLongLines() {
        const material = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
        });

        // Create latitude lines
        for (let lat = -90; lat <= 90; lat += 15) {
            const points = [];
            for (let lon = 0; lon <= 360; lon += 5) {
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = lon * (Math.PI / 180);
                const x = this.radius * Math.sin(phi) * Math.cos(theta);
                const y = this.radius * Math.cos(phi);
                const z = this.radius * Math.sin(phi) * Math.sin(theta);
                points.push(new THREE.Vector3(x, y, z));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }
    }

    createGrid() {
        const gridHelper = new THREE.GridHelper(30, 30, 0x00ff00, 0x003300);
        gridHelper.position.y = -7;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.2;
        this.scene.add(gridHelper);
    }

    createRadar() {
        const radarGeometry = new THREE.RingGeometry(0, this.radius + 2, 32, 1, 0, Math.PI / 4);
        const radarMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        this.radarSweep = new THREE.Mesh(radarGeometry, radarMaterial);
        this.radarSweep.rotation.x = Math.PI / 2;
        this.scene.add(this.radarSweep);
    }

    createAltitudeRings() {
        for (let i = 1; i <= 3; i++) {
            const ringGeometry = new THREE.RingGeometry(
                this.radius + (i * 0.5),
                this.radius + (i * 0.5) + 0.1,
                64
            );
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            this.scene.add(ring);
        }
    }

    addFlightPath(coordinates) {
        const points = coordinates.map(coord => new THREE.Vector3(coord.x, coord.y, coord.z));
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.6
        });
        const flightPath = new THREE.Mesh(geometry, material);
        this.scene.add(flightPath);
    }

    updateHUDInfo() {
        const altitude = document.querySelector('.altitude');
        const heading = document.querySelector('.heading');
        const coordinates = document.querySelector('.coordinates');
        
        altitude.textContent = `ALT: ${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
        heading.textContent = `HDG: ${Math.floor(Math.random() * 360).toString().padStart(3, '0')}`;
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Rotate globe
        this.globe.rotation.y += 0.1 * delta;
        
        // Rotate radar sweep
        if (this.radarSweep) {
            this.radarSweep.rotation.y -= 0.5 * delta;
        }
        
        // Update HUD information
        if (Math.random() < 0.05) {
            this.updateHUDInfo();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const militaryGlobe = new MilitaryGlobe();
});
