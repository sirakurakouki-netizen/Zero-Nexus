/**
 * PROJECT ∞ - AI BRAIN
 * BOTの行動ロジックと練習モード設定
 */
export const AIBrain = {
    // BOTの行動タイプ (仕様書7-1)
    types: {
        IDLE: 'idle',
        STATIONARY_SHOOTER: 'shoot_only',
        CHASER: 'chase',
        DODGER: 'dodge_only'
    },

    // 思考ルーチン
    update: function(bot, playerPos, config) {
        if (!bot) return;

        const distance = bot.position.distanceTo(playerPos);

        switch (config.type) {
            case this.types.CHASER:
                // プレイヤーを追いかける (仕様書7-1)
                if (distance > 2) {
                    const dir = playerPos.clone().sub(bot.position).normalize();
                    bot.position.add(dir.multiplyScalar(0.05 * config.speed));
                }
                break;

            case this.types.STATIONARY_SHOOTER:
                // 向きだけ変えて撃つ
                bot.lookAt(playerPos);
                // 射撃ロジック（一定間隔で弾を生成）をここに呼ぶ
                break;

            case this.types.DODGER:
                // プレイヤーから逃げる・避ける
                const escapeDir = bot.position.clone().sub(playerPos).normalize();
                bot.position.add(escapeDir.multiplyScalar(0.07));
                break;
        }
    }
};