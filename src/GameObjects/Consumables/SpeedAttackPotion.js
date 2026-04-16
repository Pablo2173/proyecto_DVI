import ConsumableItem from './Drops/consumableDrop.js';
import speedAttackPotionSprite from '../../../assets/sprites/consumables/speed_attack_potion.png'; // Placeholder, usar icono real si está disponible

export default class SpeedAttackPotion extends ConsumableItem {

    static preload(scene) {
        scene.load.image('speed_attack_potion', speedAttackPotionSprite);
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'speed_attack_potion', 'speed_attack_potion', 1);
        this.scale = 3;
    }

    applyEffect(player) {
        console.log('Poción de velocidad de ataque consumida: cadencia de ataque duplicada por 20 segundos');
    }

    use_effect(player) {

        if (!player.weapon) {
            return;
        }

        // Guardar el attackSpeed base para restaurarlo después
        if (player.weapon._attackSpeedBase == null) {
            player.weapon._attackSpeedBase = player.weapon.attackSpeed;
        }

        // Aplicar buff (entre más bajo attackSpeed, más rápido dispara)
        player.weapon.attackSpeed = player.weapon._attackSpeedBase / 2;
        player.weapon._attackSpeedBuffActive = true;

        player.scene.time.delayedCall(20000, () => {
            if (player.weapon && player.weapon._attackSpeedBuffActive) {
                player.weapon.attackSpeed = player.weapon._attackSpeedBase;
                player.weapon._attackSpeedBuffActive = false;
            }
        });
    }
}
