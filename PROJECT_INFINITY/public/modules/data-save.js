/**
 * PROJECT ∞ - DATA & SAVE MANAGER
 * ID/PASS保存、全解放隠しコマンドの管理
 */
import { SystemCore } from './system-core.js';

export const DataSave = {
    // 隠しコマンド (仕様書6-2)
    checkSecretCommand: function(input) {
        const MASTER_COMMAND = "INFINITY_ALL_UNLOCK";

        if (input === MASTER_COMMAND) {
            this.unlockAll();
            return true;
        }
        return false;
    },

    // 全解放処理
    unlockAll: function() {
        console.warn("管理者コマンド：全要素を解放します。");
        SystemCore.user.level = 999;
        SystemCore.user.currency += 9999999;
        SystemCore.user.unlockedItems = ["ALL_WEAPONS", "ALL_SKILLS", "ALL_MODES"];
        // UI更新
        window.app.main.updateUI();
    },

    // サーバーへのデータ送信 (Node.js連携用)
    syncWithServer: async function() {
        console.log("サーバーと同期中...");
        // ここにfetch関数などでindex.jsへデータを送る処理を記述
        // 例: await fetch('/save', { method: 'POST', body: JSON.stringify(SystemCore.user) });
    }
};