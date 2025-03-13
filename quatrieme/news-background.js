class NewsBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.grid = null;
        this.time = 0;
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000);
        document.body.appendChild(this.renderer.domElement);

        // Position camera
        this.camera.position.z = 50;
        this.camera.position.y = 30;
        this.camera.lookAt(0, 0, 0);

        // Create grid
        this.createGrid();

        // Add event listener for window resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        // Start animation
        this.animate();
    }

    createGrid() {
        const size = 100;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x303030);
        
        // Convert GridHelper to LineSegments for custom manipulation
        const geometry = new THREE.BufferGeometry();
        const positions = gridHelper.geometry.attributes.position.array;
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            opacity: 0.3,
            transparent: true
        });

        this.grid = new THREE.LineSegments(geometry, material);
        this.scene.add(this.grid);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.time += 0.002;
        
        // Animate grid
        if (this.grid) {
            const positions = this.grid.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i + 2];
                
                // Create wave effect
                positions[i + 1] = Math.sin(x * 0.05 + this.time) * Math.cos(z * 0.05 + this.time) * 5;
            }
            
            this.grid.geometry.attributes.position.needsUpdate = true;
            this.grid.rotation.y = this.time * 0.1;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
