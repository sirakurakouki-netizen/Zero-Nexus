/**
 * PROJECT ∞ - MODE HANDLER
 * モードの切り替えと、各モード固有のルール制御
 */
import { Engine3D } from './engine-3d.js';
import { SystemCore } from './system-core.js';

export const ModeHandler = {
    currentMode: 'LOBBY',

    // モード一覧 (仕様書に基づいて定義)
    modes: {
        LOBBY: { name: "ロビー", type: "3D", hasBuild: false },
        FPS_TDM: { name: "チームデスマッチ", type: "3D", hasBuild: false, weapon: "assault" },
        BUILD_WARS: { name: "建築戦", type: "3D", hasBuild: true, weapon: "pistol" },
        RHYTHM_BATTLE: { name: "音ゲー×戦闘", type: "2D_COMPOSITE", rhythm: true },
        EXIT_8_LIKE: { name: "異変探し", type: "3D_HORROR", anamoly: true }
    },

    // モード切り替え (仕様書0: 合体モードは「別モード」として存在)
    switchMode: function(modeKey) {
        const target = this.modes[modeKey];
        if (!target) return;

        console.log(`モード切り替え: ${target.name}`);
        this.currentMode = modeKey;

        // UI表示の更新
        const modeDisplay = document.getElementById('mode-display');
        if (modeDisplay) modeDisplay.innerText = `MODE: ${target.name}`;

        // モードごとの初期化処理
        if (target.type.includes("3D")) {
            // 3Dエンジンのリセットやステージの再生成
            Engine3D.init(); 
        }

        // 報酬倍率の設定 (難易度調整)
        SystemCore.difficulty.multiplier = (modeKey === 'LOBBY') ? 0 : 1.5;
    }
};