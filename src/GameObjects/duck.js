import Phaser from 'phaser';
// Importa las armas concretas
import Arco     from './Weapons/Distance/arco.js';
import Mcuaktro from './Weapons/Distance/mcuaktro.js';
import Cuchillo from './Weapons/Melee/cuchillo.js';
import Mazo     from './Weapons/Melee/mazo.js';
import Ramita   from './Weapons/Melee/ramita.js';

const WEAPON_MAP = {
    arco:     Arco,
    mcuaktro: Mcuaktro,
    cuchillo: Cuchillo,
    mazo:     Mazo,
    ramita:   Ramita
};

const DUCK_STATE = Object.freeze({
    IDLE:     0,
    WALKING:  1,
    DASHING:  2,
    QUACKING: 3
});

export default class Duck extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, weaponKey = 'mcuaktro') {
        super(scene, x, y, 'idle_duck', 0);
        this.scene = scene;
        scene.add.existing(this);

        this._speed       = 160;
        this._maxSpeed    = 180;
        this.dashSpeed    = 600;
        this.dashDuration = 200;
        this.lastDashTime = 0;
        this.state        = DUCK_STATE.IDLE;
        this.facingX      = 1;
        this.facingY      = 0;
        this.scale        = 3;

        // ── Arma ──
        this.weapon = null;

        // ── Input ──
        this.cursors  = scene.input.keyboard.createCursorKeys();
        this.keyW     = scene.input.keyboard.addKey('W');
        this.keyA     = scene.input.keyboard.addKey('A');
        this.keyS     = scene.input.keyboard.addKey('S');
        this.keyD     = scene.input.keyboard.addKey('D');
        this.keySpace = scene.input.keyboard.addKey('SPACE');
        this.keyC     = scene.input.keyboard.addKey('C');
        this.keyE     = scene.input.keyboard.addKey('E');

        this.quackDuration = 600;
        this.quackEndTime  = 0;

        this.keySpace.on('down', () => this.startDash());
        this.keyC.on('down',     () => this.quack());

        // ── Equipar arma inicial ──
        this.equipWeapon(weaponKey);
    }

    // ─────────────────────────────────────────
    //  GESTIÓN DE ARMA
    // ─────────────────────────────────────────

    /**
     * Equipa un arma a partir de su clave (string) o clase directa.
     * Crea la instancia usando la nueva API: new WeaponClass(scene, owner).
     */
    equipWeapon(weaponKeyOrClass) {
        const WeaponClass = typeof weaponKeyOrClass === 'string'
            ? WEAPON_MAP[weaponKeyOrClass]
            : weaponKeyOrClass;

        if (!WeaponClass) {
            console.warn(`Duck: arma desconocida "${weaponKeyOrClass}"`);
            return;
        }

        const newWeapon = new WeaponClass(this.scene, this);
        this.setWeapon(newWeapon);
    }

    /**
     * Asigna directamente una instancia de Weapon ya creada.
     * Destruye el arma anterior si existía.
     *
     * @param {Weapon} newWeapon
     */
    setWeapon(newWeapon) {
        if (this.weapon) {
            this.weapon.destroy();
        }
        this.weapon = newWeapon;
    }

    // ─────────────────────────────────────────
    //  ESTADOS
    // ─────────────────────────────────────────

    setState(newState) {
        if (this.state === newState) return;
        this.state = newState;

        switch (newState) {
            case DUCK_STATE.IDLE:     this.play('duck-idle',  true); break;
            case DUCK_STATE.WALKING:  this.play('duck-walk',  true); break;
            case DUCK_STATE.QUACKING: this.play('duck-cuack', true); break;
            case DUCK_STATE.DASHING:  this.play('duck-dash',  true); break;
        }
    }

    quack() {
        this.setState(DUCK_STATE.QUACKING);
        this.quackEndTime = this.scene.time.now + this.quackDuration;
        this.scene.sound?.play('cuack');
    }

    startDash() {
        const now = this.scene.time.now;
        if (now < this.lastDashTime + 800) return;
        this.lastDashTime = now;
        this.setState(DUCK_STATE.DASHING);

        this.scene.time.delayedCall(this.dashDuration, () => {
            if (this.state === DUCK_STATE.DASHING) this.setState(DUCK_STATE.IDLE);
        });
    }

    // ─────────────────────────────────────────
    //  PREUPDATE — movimiento + arma + detección drops
    // ─────────────────────────────────────────

    preUpdate(time, dt) {
        super.preUpdate(time, dt);
        const delta = dt / 1000;

        // Fin de quack
        if (this.state === DUCK_STATE.QUACKING && time >= this.quackEndTime) {
            this.setState(DUCK_STATE.IDLE);
        }

        // ── Movimiento ──
        let vx = 0, vy = 0;

        if (this.state !== DUCK_STATE.DASHING) {
            if (this.cursors.left.isDown  || this.keyA.isDown) vx -= 1;
            if (this.cursors.right.isDown || this.keyD.isDown) vx += 1;
            if (this.cursors.up.isDown    || this.keyW.isDown) vy -= 1;
            if (this.cursors.down.isDown  || this.keyS.isDown) vy += 1;
        }

        const isDashing = this.state === DUCK_STATE.DASHING;
        const speed     = isDashing ? this.dashSpeed : this._speed;

        if (vx !== 0 || vy !== 0 || isDashing) {
            const len   = Math.hypot(vx, vy) || 1;
            const moveX = (vx !== 0 ? vx : this.facingX) / len * speed;
            const moveY = (vy !== 0 ? vy : this.facingY) / len * speed;

            this.x += moveX * delta;
            this.y += moveY * delta;

            if (!isDashing) {
                this.facingX = vx;
                this.facingY = vy;
                this.setState(DUCK_STATE.WALKING);
            }
        } else if (this.state !== DUCK_STATE.QUACKING) {
            this.setState(DUCK_STATE.IDLE);
        }

        // Flip del sprite del pato
        if (vx > 0) this.setFlipX(true);
        if (vx < 0) this.setFlipX(false);

        // ── Actualizar arma (posición + rotación + debug) ──
        if (this.weapon) {
            this.weapon.update();
        }

        // ── Detección de drops cercanos (tecla E) ──
        this._checkDropPickup();
    }

    /**
     * Comprueba si hay un DropItem cerca y el jugador pulsa E.
     * Usa checkDown con cooldown de 250ms para evitar recogidas múltiples.
     */
    _checkDropPickup() {
        if (!this.scene.dropItems) return;

        const drops = this.scene.dropItems.getChildren();
        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];
            if (!drop.active) continue;

            if (drop.isNear(this, 40) &&
                this.scene.input.keyboard.checkDown(this.keyE, 250)) {
                drop.interact(this);
                break; // solo un drop por pulsación
            }
        }
    }
}