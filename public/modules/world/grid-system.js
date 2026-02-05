import * as THREE from 'three';

export class GridSystem {
    constructor() {
        this.gridSize = 100;
        this.divisions = 50;
        this.gridHelper = null;
    }

    addToScene(scene) {
        // ネオンブルーのワイヤーフレーム
        const color1 = 0x00ffff; // 中心線
        const color2 = 0x0055ff; // 格子線

        this.gridHelper = new THREE.GridHelper(this.gridSize, this.divisions, color1, color2);

        // 思想：ワイヤーフレーム寄りのビジュアル
        this.gridHelper.material.transparent = true;
        this.gridHelper.material.opacity = 0.5;

        scene.add(this.gridHelper);

        // 霧（フォグ）を追加して無限感とネオンの質感を出す
        scene.fog = new THREE.Fog(0x000000, 1, 50);
    }

    update() {
        // ここに床がスクロールするアニメーションなどを後で追加可能
    }
}