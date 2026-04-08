import DropItem from '../../dropItem.js';
//import Weapon   from '../../Weapons/weapon.js';

/**
 * DropWeapon — arma que yace en el suelo esperando ser recogida.
 *
 * @param {Phaser.Scene} scene
 * @param {number}       x
 * @param {number}       y
 * @param {object}       weaponConfig  — misma config que acepta Weapon (texture, isRanged, damage…)
 */
export default class DropWeapon extends DropItem {

    static SCALE_BY_TEXTURE = {
        arco: 1.5,
        mazo: 1.5,
        cuchillo: 1.5
    };

    constructor(scene, x, y, weaponClass, texture, scale = null) {

        const textureKey = texture;
        const dropScale = scale ?? DropWeapon.SCALE_BY_TEXTURE[textureKey] ?? 1;

        super(scene, x, y, textureKey);

        this.weaponClass = weaponClass;

        this.setScale(dropScale);
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

        // Crear nueva arma con el bar del jugador
        const newWeapon = new this.weaponClass(scene, player, player.weaponBar);
        player.setWeapon(newWeapon);
        newWeapon.setBar(player.weaponBar);

        // Crear drop solo si el arma anterior no es la ramita por defecto
        if (
            previousWeapon &&
            previousWeapon.constructor &&
            previousWeapon.texture &&
            previousWeapon.texture.key &&
            previousWeapon.texture.key !== 'ramita'
        ) {
            new DropWeapon(
                scene,
                dropX,
                dropY,
                previousWeapon.constructor,
                previousWeapon.texture.key,
                previousWeapon.scaleX ?? null
            );
        }

        // Destruir el drop actual para que desaparezca del suelo
        this.destroy();
    }
}