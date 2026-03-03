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

    constructor(scene, x, y, weaponClass, texture) {

        const textureKey = texture;

        super(scene, x, y, textureKey);

        this.weaponClass = weaponClass;

        this.setScale(1);
        this.setDepth(1);

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

        const previousWeapon = player.weapon;
        let previousClass = null;
        let previousTexture = null;

        if (previousWeapon) {
            previousClass = previousWeapon.constructor;
            previousTexture = previousWeapon.texture.key;  // Obtener la clave de textura del arma anterior
        }

        // Crear nueva arma con el bar del jugador
        const newWeapon = new this.weaponClass(scene, player, player.weaponBar);
        player.setWeapon(newWeapon);
        
        // Inicializar el bar en el arma nueva
        newWeapon.setBar(player.weaponBar);

        // Crear drop con el arma anterior si existía
        if (previousClass && previousTexture) {
            new DropWeapon(scene, dropX, dropY, previousClass, previousTexture);
        }

        this.destroy();
    }
}