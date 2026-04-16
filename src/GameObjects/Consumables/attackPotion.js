import ConsumableItem from './Drops/consumableDrop.js';
import attackPotionSprite from '../../../assets/sprites/consumables/attack_potion.png'; // Placeholder, usar bread_item por ahora

export default class AttackPotion extends ConsumableItem {

    static preload(scene) {
        scene.load.image('attack_potion', attackPotionSprite);
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'attack_potion', 'attack_potion', 1);
        this.scale = 3;
    }

    /**
     * Efecto de uso de la poción de ataque: duplica el daño del jugador por 30 segundos
     * @param {Duck} player - El pato que usa el consumible
     */
    use_effect(player) {
        console.log('Usando poción de ataque: duplicando daño por 30 segundos');

        // Duplicar el multiplicador de daño
        if (!player.damageMultiplier) {
            player.damageMultiplier = 1;
        }
        player.damageMultiplier *= 2;

        // Resetear después de 30 segundos
        player.scene.time.delayedCall(30000, () => {
            if (player.damageMultiplier) {
                player.damageMultiplier /= 2;
                console.log('Efecto de poción de ataque terminado: daño restaurado');
            }
        });
    }
}