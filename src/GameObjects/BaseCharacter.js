import Phaser from 'phaser';
import { TEAM } from './team.js';
import WeaponBar from './weaponBar.js';

export default class BaseCharacter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, team = TEAM.NEUTRAL) {
        super(scene, x, y, texture, frame);

        this.scene = scene;
        scene.add.existing(this);

        this.weapon = null;
        this.weaponBar = new WeaponBar(scene, this, team === TEAM.ENEMY);
        this._isSwitchingWeapon = false;
        this._isBeingDestroyed = false;

        this.team = team;

        // Debe ser sobreescrito en subclases con el mapa de armas disponible.
        this.weaponMap = {};
    }

    _canCreateWeapon() {
        if (this._isBeingDestroyed) return false;
        if (!this.scene || !this.scene.sys) return false;
        if (!this.scene.add) return false;
        return true;
    }

    _canScheduleFallbackEquip() {
        if (!this._canCreateWeapon()) return false;
        if (!this.scene.time) return false;
        if (typeof this.scene.sys.isActive === 'function' && !this.scene.sys.isActive()) return false;
        return true;
    }

    equipWeapon(weaponKeyOrClass) {
        if (!this._canCreateWeapon()) return;

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
            if (this._canCreateWeapon()) {
                this.equipWeapon('ramita');
            }
            return;
        }

        this.weapon = newWeapon;
    }

    onWeaponDestroyed(weapon) {
        if (this._isSwitchingWeapon) return;
        if (this._isBeingDestroyed) return;
        if (this.weapon !== weapon) return;

        this.weapon = null;

        if (this._canScheduleFallbackEquip()) {
            this.scene.time.delayedCall(1, () => {
                if (!this._canScheduleFallbackEquip()) return;
                if (!this.weapon && !this._isSwitchingWeapon && !this._isBeingDestroyed) {
                    this._isSwitchingWeapon = true;
                    this.equipWeapon('ramita');
                    this._isSwitchingWeapon = false;
                }
            });
        }
    }

    destroy(fromScene) {
        this._isBeingDestroyed = true;

        if (this.weapon) {
            const weapon = this.weapon;
            this.weapon = null;
            weapon.destroy(undefined, { notifyOwner: false });
        }

        if (this.weaponBar) {
            this.weaponBar.destroy();
            this.weaponBar = null;
        }

        super.destroy(fromScene);
    }
}
