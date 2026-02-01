import { SystemCore } from './system-core.js';

/**
 * PROJECT ∞ - MAIN CONTROLLER
 * セーブ・ロード・各エンジンの起動を統括
 */
const MainApp = {
    init: function() {
        console.log("PROJECT ∞: システム起動中...");
        this.loadGame(); // 起動時にセーブデータを読み込む
        this.updateUI();

        // モード選択画面の表示など、初期化処理をここに集約
        this.setupEventListeners();
    },

    // ID+パスワード方式を想定したセーブ機能 (仕様書9)
    saveGame: function() {
        const data = JSON.stringify(SystemCore.user);
        localStorage.setItem('project_infinity_save', data);
        console.log("セーブ完了");
    },

    loadGame: function() {
        const savedData = localStorage.getItem('project_infinity_save');
        if (savedData) {
            SystemCore.user = JSON.parse(savedData);
            console.log("セーブデータをロードしました");
        }
    },

    // UIの数値を最新の状態に更新
    updateUI: function() {
        const lvEl = document.getElementById('player-level');
        const curEl = document.getElementById('player-currency');
        if(lvEl) lvEl.innerText = `LV. ${SystemCore.user.level}`;
        if(curEl) curEl.innerText = `${SystemCore.user.currency} CORE`;
    },

    setupEventListeners: function() {
        // 10秒ごとに自動セーブ
        setInterval(() => this.saveGame(), 10000);

        // 隠しコマンド（仕様書6-2）の受付用リスナーなども後でここに追加
    }
};

// 起動
window.addEventListener('DOMContentLoaded', () => {
    MainApp.init();
    // 他のモジュールから参照できるようにグローバルに公開
    window.app = { core: SystemCore, main: MainApp };
});

export default MainApp;