export class CombatUI {
    constructor(engine) {
        this.engine = engine;
        this.buttons = {
            atk: document.getElementById('atk-btn'),
            skl: document.getElementById('skl-btn'),
            jmp: document.getElementById('jmp-btn'),
            dsh: document.getElementById('dsh-btn')
        };
    }

    init() {
        // iOSの連打や同時押しに対応するため、touchstartを直接フックする
        Object.entries(this.buttons).forEach(([key, btn]) => {
            if (!btn) return;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // ブラウザのズーム等を防ぐ

                // ボタンごとのアクション実行
                switch(key) {
                    case 'atk': this.engine.performAction('attack'); break;
                    case 'skl': this.engine.performAction('skill'); break;
                    case 'jmp': this.engine.performAction('jump'); break;
                    case 'dsh': this.engine.performAction('dash'); break;
                }
            }, { passive: false });
        });

        console.log("CombatUI: Multi-touch ready.");
    }
}