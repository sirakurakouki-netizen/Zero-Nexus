export class CombatUI {
    constructor(nexus) { this.nexus = nexus; }

    init() {
        const ui = document.createElement('div');
        ui.style.cssText = `position:fixed; bottom:30px; right:30px; display:grid; grid-template-columns:repeat(2,1fr); z-index:5000; gap:10px;`;

        this.btn(ui, '⚔️', 'ATTACK', '攻撃', () => this.nexus.attack && this.nexus.attack());

        const guard = this.btn(ui, '🛡️', 'GUARD', '防御', () => {});
        guard.ontouchstart = (e) => { e.preventDefault(); this.nexus.guard && this.nexus.guard(true); };
        guard.ontouchend = () => { this.nexus.guard && this.nexus.guard(false); };
        guard.onmousedown = () => { this.nexus.guard && this.nexus.guard(true); };
        guard.onmouseup = () => { this.nexus.guard && this.nexus.guard(false); };

        this.btn(ui, '🚀', 'JUMP', '跳躍', () => this.nexus.jump && this.nexus.jump());
        this.btn(ui, '🛹', 'SLIDE', '滑走', () => this.nexus.slide && this.nexus.slide());

        document.body.appendChild(ui);
    }

    btn(parent, icon, en, jp, action) {
        const b = document.createElement('button');
        b.className = 'combat-btn';
        b.innerHTML = `<span style="font-size:20px">${icon}</span><br>${en}<br><span style="font-size:8px">${jp}</span>`;
        b.onclick = action;
        parent.appendChild(b);
        return b;
    }
}