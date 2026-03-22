import Phaser from 'phaser';
import { TEAM } from './team.js';
import WeaponBar from './weaponBar.js';

export default class BaseCharacter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, team = TEAM.NEUTRAL) {
        super(scene, x, y, texture, frame);

        this.scene = scene;
        scene.add.existing(this);

        this.weapon = null;
        this.weaponBar = new WeaponBar(scene, this);
        this._isSwitchingWeapon = false;

        this.team = team;

        // Debe ser sobreescrito en subclases con el mapa de armas disponible.
        this.weaponMap = {};
    }

    equipWeapon(weaponKeyOrClass) {
        const WeaponClass = typeof weaponKeyOrClass === 'string'
            ? this.weaponMap[weaponKeyOrClass]
            : weaponKeyOrClass;

        if (!WeaponClass) {
            console.warn(`
                ${this.constructor.name}: arma desconocida "${weaponKeyOrClass}"`);
            return;
        }

        const newWeapon = new WeaponClass(this.scene, this, this.weaponBar);
        this.setWeapon(newWeapon);
        if (this.weapon && typeof this.weapon.setBar === 'function') {
            this.weapon.setBar(this.weaponBar);
        }
    }

    setWeapon(newWeapon) {
        if (this.weapon) {
            const oldWeapon = this.weapon;
            this._isSwitchingWeapon = true;
            this.weapon = null;
            oldWeapon.destroy(undefined, { notifyOwner: false });
            this._isSwitchingWeapon = false;
        }

        if (!newWeapon) {
            this.equipWeapon('ramita');
            return;
        }

        this.weapon = newWeapon;
    }

    onWeaponDestroyed(weapon) {
        if (this._isSwitchingWeapon) return;
        if (this.weapon !== weapon) return;

        this.weapon = null;

        // Solo equipar la ramita automáticamente si es un jugador (no un enemigo)
        const isPlayer = this.team === TEAM.PLAYER || this.constructor.name === 'Duck';
        if (isPlayer) {
            if (this.scene && this.scene.time) {
                this.scene.time.delayedCall(1, () => {
                    if (!this.weapon && !this._isSwitchingWeapon) {
                        this._isSwitchingWeapon = true;
                        this.equipWeapon('ramita');
                        this._isSwitchingWeapon = false;
                    }
                });
            } else {
                this.equipWeapon('ramita');
            }
        }
    }
}
