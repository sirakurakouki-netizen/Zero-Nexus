/**
 * PROJECT ∞ - WEAPON SYSTEM
 * 武器の性能、レアリティ、カスタマイズ設定
 */
export const WeaponSystem = {
    // 武器ランクの定義 (仕様書1-1)
    ranks: {
        COMMON: { color: '#ffffff', power: 1.0 },
        RARE: { color: '#0070dd', power: 1.2 },
        EPIC: { color: '#a335ee', power: 1.5 },
        LEGENDARY: { color: '#ff8000', power: 2.0 }
    },

    // 武器データベース
    list: {
        pistol: { name: "ハンドガン", type: "gun", fireRate: 300, damage: 10 },
        assault: { name: "アサルトライフル", type: "gun", fireRate: 100, damage: 15 },
        katana: { name: "名刀・無限", type: "melee", combo: true, damage: 40 },
        launcher: { name: "ロケラン", type: "heavy", fireRate: 1000, damage: 100 }
    },

    // 武器の生成（レアリティ付与）
    generateWeapon: function(weaponId, rankKey = 'COMMON') {
        const base = this.list[weaponId];
        const rank = this.ranks[rankKey];
        return {
            ...base,
            rank: rankKey,
            currentDamage: base.damage * rank.power,
            color: rank.color
        };
    }
};