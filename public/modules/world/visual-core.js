export class VisualCore {
    constructor(config) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // 背景色
        this.scene.background = new THREE.Color(this.config.WORLD.BG_COLOR);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(5, 10, 7);
        this.scene.add(sun, new THREE.AmbientLight(0xffffff, 0.4));

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createGrid() {
        const grid = new THREE.GridHelper(
            this.config.WORLD.GRID_SIZE, 
            this.config.WORLD.GRID_DIVISIONS, 
            0x00ffff, 0x002222
        );
        this.scene.add(grid);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}