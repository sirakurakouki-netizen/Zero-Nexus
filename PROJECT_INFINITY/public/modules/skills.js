/**
 * PROJECT ∞ - SKILL SYSTEM
 * パリィ、グラップリング、時間停止などの特殊アクション
 */
import { SystemCore } from './system-core.js';

export const SkillSystem = {
    isTimeStopped: false,
    lastParryTime: 0,

    // --- 1. パリィ (仕様書1-2: タイミング成功でノーダメ) ---
    executeParry: function() {
        const now = Date.now();
        this.lastParryTime = now;
        console.log("パリィ体勢！");

        // 視覚エフェクト（青い閃光など）をここに追加予定
        // 成功判定は敵の攻撃タイミングと照合して行う
    },

    // --- 2. グラップリングフック (仕様書3-3: 移動系) ---
    useGrapple: function(player, targetPos) {
        if (!player) return;

        console.log("グラップリング発動！");
        // 指定座標へ急接近
        new TWEEN.Tween(player.position)
            .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 500)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    },

    // --- 3. 時間停止 (仕様書3-3: 強力だが制限あり) ---
    stopTime: function() {
        if (this.isTimeStopped) return;

        this.isTimeStopped = true;
        console.log("ザ・ワールド！");

        // 3秒後に解除（仕様に基づき制限時間を設ける）
        setTimeout(() => {
            this.isTimeStopped = false;
            console.log("時は動き出す。");
        }, 3000);
    },

    // --- 4. 回避 / スロー (仕様書1-2: ジャスト回避) ---
    justEvasion: function() {
        console.log("ジャスト回避成功！一時的なスロー効果");
        // 敵の速度を一時的に下げる等の処理をここに記述
        SystemCore.addReward('practice'); // テクニック成功による微量報酬
    }
};

// UIのボタンとの紐付け
document.getElementById('btn-skill').addEventListener('click', () => {
    // 現在装備しているスキルを発動
    const currentSkill = SystemCore.user.skills[0];
    if (currentSkill === "dash") {
        // ダッシュはengine-3d側で処理、またはここで拡張
        console.log("スキル発動: ダッシュ強化");
    }
});