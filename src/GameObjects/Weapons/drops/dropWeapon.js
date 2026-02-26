import DropItem from '../../dropItem.js';
import Weapon   from '../weapon.js';

/**
 * DropWeapon — arma que yace en el suelo esperando ser recogida.
 *
 * @param {Phaser.Scene} scene
 * @param {number}       x
 * @param {number}       y
 * @param {object}       weaponConfig  — misma config que acepta Weapon (texture, isRanged, damage…)
 */
export default class DropWeapon extends DropItem {

    constructor(scene, x, y, weaponConfig) {
        // El sprite en el suelo usa la misma textura que el arma
        super(scene, x, y, weaponConfig.texture);

        this.weaponConfig = weaponConfig;

        // Escala ligeramente reducida para que se vea como ítem suelto
        this.setScale(1);
        this.setDepth(1);

        // Añadir al grupo de drops de la escena si existe
        if (scene.dropItems) {
            scene.dropItems.add(this);
        }
    }

    /**
     * Intercambia el arma del jugador con esta.
     * - El jugador obtiene el arma de este DropWeapon.
     * - El arma anterior del jugador queda como nuevo DropWeapon en esta posición.
     * - Este DropWeapon se destruye.
     *
     * @param {Duck} player
     */
    interact(player) {
        this.swapWeapon(player);
    }

    swapWeapon(player) {
        const scene = this.scene;
        const dropX = this.x;
        const dropY = this.y;

        // 1. Guardar config del arma actual del jugador (si tiene)
        const previousWeapon = player.weapon;
        let   previousConfig = null;

        if (previousWeapon) {
            // Extraer config del arma que lleva el jugador para recrearla en el suelo
            previousConfig = this._extractConfig(previousWeapon);
        }

        // 2. Crear la nueva arma y equiparla al jugador
        const newWeapon = new Weapon(scene, player, this.weaponConfig);
        player.setWeapon(newWeapon);

        // 3. Si el jugador tenía arma, dejarla en el suelo
        if (previousConfig) {
            new DropWeapon(scene, dropX, dropY, previousConfig);
        }

        // 4. Destruir este DropWeapon (ya fue recogido)
        this.destroy();
    }

    /**
     * Extrae un weaponConfig a partir de una instancia de Weapon existente,
     * para poder recrearla después como DropWeapon.
     *
     * @param {Weapon} weapon
     * @returns {object}
     */
    _extractConfig(weapon) {
        return {
            texture:           weapon.texture?.key   ?? weapon.frame?.texture?.key,
            isRanged:          weapon.isRanged,
            projectileClass:   weapon.projectileClass,
            projectileSpeed:   weapon.projectileSpeed,
            damage:            weapon.damage,
            attackSpeed:       weapon.attackSpeed,
            range:             weapon.range,
            optimalDistance:   weapon.optimalDistance,
            swingAngle:        weapon.swingAngle,
            swingDuration:     weapon.swingDuration,
            scale:             weapon.scaleX,         // scaleX = scaleY normalmente
            spriteAngleOffset: weapon.spriteAngleOffset,
            debug:             weapon.debugMode
        };
    }
}