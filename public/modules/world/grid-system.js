import * as THREE from 'three';

export class GridSystem {
    constructor(visual) {
        this.visual = visual;
        this.gridSize = 2000;
        this.divisions = 80; // 分割数を調整して密度を上げる
    }

    init() {
        // ネオンブルーのグリッド（太い線に見せるためにMaterialを工夫）
        const gridHelper = new THREE.GridHelper(
            this.gridSize, 
            this.divisions, 
            0x00ffff, 
            0x00ffff 
        );

        // グリッド自体のマテリアルを少し明るく
        gridHelper.material.opacity = 0.8;
        gridHelper.material.transparent = true;

        // 床の反射を受け止める暗い平面
        const planeGeo = new THREE.PlaneGeometry(this.gridSize, this.gridSize);
        const planeMat = new THREE.MeshStandardMaterial({ 
            color: 0x000505, 
            roughness: 0.1, // 低いほど反射が強くなる
            metalness: 0.5 
        });
        const floor = new THREE.Mesh(planeGeo, planeMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;

        this.visual.add(gridHelper);
        this.visual.add(floor);

        console.log("Grid System: Neon Heavy Grid Generated");
    }
}