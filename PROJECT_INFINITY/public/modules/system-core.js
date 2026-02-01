/**
 * PROJECT ∞ - SYSTEM CORE
 * 全モード共通の経済・レベル・難易度ロジック
 */
export const SystemCore = {
    // プレイヤーの動的データ
    user: {
        name: "GUEST",
        level: 1,
        exp: 0,
        currency: 0,
        unlockedItems: [],
        skills: ["dash"], // 初期装備スキル
    },

    // 難易度設定 (仕様書3-3に基づきカスタム可能に)
    difficulty: {
        multiplier: 1.0, // 報酬倍率
        enemyStrength: 1.0,
        speed: 1.0
    },

    // 報酬計算ロジック (仕様書1-3-3: 何をしても必ず報酬がある)
    addReward: function(type) {
        let baseAmount = 0;
        switch(type) {
            case 'win': baseAmount = 100; break;
            case 'lose': baseAmount = 10; break; // 失敗しても0ではない
            case 'practice': baseAmount = 2; break; // 練習用
            case 'time': baseAmount = 1; break; // 放置・生存
        }

        const earned = Math.floor(baseAmount * this.difficulty.multiplier);
        this.user.currency += earned;
        this.addExp(earned); // 稼いだ分だけ経験値も入る仕組み
        return earned;
    },

    addExp: function(amount) {
        this.user.exp += amount;
        const nextLevelExp = this.user.level * 500;
        if (this.user.exp >= nextLevelExp) {
            this.user.level++;
            this.user.exp = 0;
            return true; // レベルアップ！
        }
        return false;
    }
};