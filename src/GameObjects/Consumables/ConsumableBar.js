import Phaser from 'phaser';
// Importar consumibles directamente
import AttackPotion from './attackPotion.js';
import SpeedPotion from './SpeedPotion.js';

export default class ConsumableBar {

    constructor(scene, duck) {
        this.scene = scene;
        this.duck = duck;

        // Posiciones y dimensiones de los slots
        this.slotWidth = 80;
        this.slotHeight = 80;
        this.slotSpacing = 10;
        this.startX = 100; // Posición inicial en X
        this.startY = 30;  // Posición inicial en Y (dentro de up_bar)

        this.slots = []; // Array de objetos gráficos para cada slot

        // Índice del slot actualmente seleccionado (0-8). -1 = ninguno seleccionado
        this.selectedSlotIndex = -1;

        this.createSlots();
        this.createBreadSlot();
        this.setupKeyboardInput();
    }

    /**
     * Configura los controles de teclado para usar consumibles
     */
    setupKeyboardInput() {
        // Crear teclas para los números 1-9
        this.key1 = this.scene.input.keyboard.addKey('ONE');
        this.key2 = this.scene.input.keyboard.addKey('TWO');
        this.key3 = this.scene.input.keyboard.addKey('THREE');
        this.key4 = this.scene.input.keyboard.addKey('FOUR');
        this.key5 = this.scene.input.keyboard.addKey('FIVE');
        this.key6 = this.scene.input.keyboard.addKey('SIX');
        this.key7 = this.scene.input.keyboard.addKey('SEVEN');
        this.key8 = this.scene.input.keyboard.addKey('EIGHT');
        this.key9 = this.scene.input.keyboard.addKey('NINE');

        // Tecla F: usar el item del slot seleccionado
        this.keyF = this.scene.input.keyboard.addKey('F');
    }

    /**
     * Crea los 9 slots visuales para los consumibles
     */
    createSlots() {
        for (let i = 0; i < 9; i++) {
            const x = this.startX + (i * (this.slotWidth + this.slotSpacing));
            const y = this.startY;
            const slot = {
                index: i + 1,
                x: x,
                y: y,
                background: null,
                text: null,
                itemText: null,
                itemSprite: null
            };
            slot.background = this.scene.add.rectangle(x, y, this.slotWidth, this.slotHeight, 0x333333, 0.7);
            slot.background.setOrigin(0);
            slot.background.setScrollFactor(0);
            slot.background.setStrokeStyle(2, 0xffffff, 0.5);
            slot.background.setDepth(9100);
            slot.background.setInteractive();
            slot.background.on('pointerdown', () => {
                this.onSlotClick(i);
            });
            slot.text = this.scene.add.text(x + 5, y + 5, String(slot.index), {
                fontSize: '16px',
                fill: '#FFFFFF',
                fontStyle: 'bold'
            });
            slot.text.setOrigin(0);
            slot.text.setScrollFactor(0);
            slot.text.setDepth(9102);
            slot.itemSprite = null;
            this.slots.push(slot);
        }
    }

    // Slot especial para el pan (no seleccionable)
    createBreadSlot() {
        const i = 9; // slot 10
        const x = this.startX + (i * (this.slotWidth + this.slotSpacing));
        const y = this.startY;
        this.breadSlot = {
            x: x,
            y: y,
            background: this.scene.add.rectangle(x, y, this.slotWidth, this.slotHeight, 0x333333, 0.7),
            icon: null,
            text: null
        };
        this.breadSlot.background.setOrigin(0);
        this.breadSlot.background.setScrollFactor(0);
        this.breadSlot.background.setStrokeStyle(2, 0xffffff, 0.5);
        this.breadSlot.background.setDepth(9100);
        // No interactivo, no seleccionable
        // Icono de pan
        // Icono más arriba
        this.breadSlot.icon = this.scene.add.image(x + this.slotWidth / 2, y + this.slotHeight / 2 - 12, 'bread_item');
        this.breadSlot.icon.setScale(2);
        this.breadSlot.icon.setScrollFactor(0);
        this.breadSlot.icon.setDepth(9101);
        // Texto más abajo
        this.breadSlot.text = this.scene.add.text(x + this.slotWidth / 2, y + this.slotHeight / 2 + 22, '', {
            fontSize: '20px',
            fill: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.breadSlot.text.setOrigin(0.5);
        this.breadSlot.text.setScrollFactor(0);
        this.breadSlot.text.setDepth(9102);
        this.updateBreadSlot();
    }

    updateBreadSlot() {
        if (this.breadSlot && this.scene.breadCount !== undefined) {
            let count = Math.min(999, this.scene.breadCount);
            this.breadSlot.text.setText('x ' + count);
        }
    }

    /**
     * Actualiza la visualización de los consumibles
     */
    update() {
        // Actualizar slot de pan
        this.updateBreadSlot();
        if (!this.duck.consumables) return;

        // Verificar input de teclado para consumir items
        this.checkKeyboardInput();

        // Limpiar todos los slots
        this.slots.forEach(slot => {
            if (slot.itemSprite) {
                slot.itemSprite.destroy();
                slot.itemSprite = null;
            }
            slot.background.setStrokeStyle(2, 0xffffff, 0.5);
        });

        // Llenar los slots con los consumibles actuales
        // El pan (bread) ya NO aparece como consumible en la barra: es moneda
        this.duck.consumables.forEach((consumable, index) => {
            if (index < this.slots.length) {
                const slot = this.slots[index];

                // Crear imagen del consumible
                const spriteKey = this.getSpriteKey(consumable.type);
                if (spriteKey) {
                    slot.itemSprite = this.scene.add.image(
                        slot.x + this.slotWidth / 2,
                        slot.y + this.slotHeight / 2,
                        spriteKey
                    );
                    slot.itemSprite.setScale(this.getItemScale(consumable.type));
                    slot.itemSprite.setScrollFactor(0);
                    slot.itemSprite.setDepth(9101);
                }

                // Cambiar color del borde si hay item
                slot.background.setStrokeStyle(2, 0x00FF00, 1);
            }
        });

        // Resaltar el slot seleccionado con borde dorado
        if (this.selectedSlotIndex >= 0 && this.selectedSlotIndex < this.slots.length) {
            this.slots[this.selectedSlotIndex].background.setStrokeStyle(3, 0xFFD700, 1);
        }
    }

    getItemScale(type) {
        const scaleMap = {
            bread: 3,
            attack_potion: 3,
            speed_potion: 3,
            speed_attack_potion: 3,
            mask: 3,
            fox_tail: 0.1
        };

        return scaleMap[type] ?? 3;
    }
    /**
     * Verifica el input de teclado para consumir items
     */
    checkKeyboardInput() {
        // Usar checkDown con cooldown para evitar consumos múltiples
        if (this.scene.input.keyboard.checkDown(this.key1, 250)) {
            this.selectSlot(0); // Slot 1 (índice 0)
        }
        if (this.scene.input.keyboard.checkDown(this.key2, 250)) {
            this.selectSlot(1); // Slot 2 (índice 1)
        }
        if (this.scene.input.keyboard.checkDown(this.key3, 250)) {
            this.selectSlot(2); // Slot 3 (índice 2)
        }
        if (this.scene.input.keyboard.checkDown(this.key4, 250)) {
            this.selectSlot(3); // Slot 4 (índice 3)
        }
        if (this.scene.input.keyboard.checkDown(this.key5, 250)) {
            this.selectSlot(4); // Slot 5 (índice 4)
        }
        if (this.scene.input.keyboard.checkDown(this.key6, 250)) {
            this.selectSlot(5); // Slot 6 (índice 5)
        }
        if (this.scene.input.keyboard.checkDown(this.key7, 250)) {
            this.selectSlot(6); // Slot 7 (índice 6)
        }
        if (this.scene.input.keyboard.checkDown(this.key8, 250)) {
            this.selectSlot(7); // Slot 8 (índice 7)
        }
        if (this.scene.input.keyboard.checkDown(this.key9, 250)) {
            this.selectSlot(8); // Slot 9 (índice 8)
        }

        // Tecla F: usar el item del slot seleccionado (NO mezclar con E)
        if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
            this.useSelectedItem();
        }
    }

    /**
     * Selecciona un slot sin consumir el item
     * @param {number} slotIndex - Índice del slot a seleccionar (0-8)
     */
    selectSlot(slotIndex) {
        this.selectedSlotIndex = slotIndex;
    }

    /**
     * Usa el item del slot actualmente seleccionado.
     * Solo se ejecuta si hay un item en el slot seleccionado.
     */
    useSelectedItem() {
        if (this.selectedSlotIndex < 0) return;
        if (!this.duck.consumables || this.selectedSlotIndex >= this.duck.consumables.length) {
            return; // Slot vacío o fuera de rango
        }

        const item = this.duck.consumables[this.selectedSlotIndex];

        // Ejecutar efecto específico según el tipo de item
        if (item.type === 'mask') {
            this.duck.activateInvisibility();
            // Eliminar la máscara del slot tras el uso
            this.duck.consumables.splice(this.selectedSlotIndex, 1);
            // Actualizar la visualización
            this.update();
            return;
        }

        // Para el resto de tipos se reutiliza el flujo existente
        this.onSlotClick(this.selectedSlotIndex);
    }

    /**
     * Obtiene la clave del sprite basado en el tipo de consumible
     * @param {string} type - Tipo del consumible
     * @returns {string|null} - Clave del sprite o null si no existe
     */
    getSpriteKey(type) {
        const spriteMap = {
            // 'bread' eliminado: el pan es moneda, no un consumible equipable

            'attack_potion': 'attack_potion',
            'speed_potion': 'speed_potion',
            'speed_attack_potion': 'speed_attack_potion',
            'fox_tail': 'fox_tail',
            // Agregar más tipos aquí cuando se necesite

            'mask': 'mask_icon'
            // Agregar más tipos aquí: 'health': 'health_potion', etc.

        };
        return spriteMap[type] || null;
    }

    /**
     * Maneja el click en un slot
     * @param {number} slotIndex - Índice del slot clickeado (0-8)
     */
    onSlotClick(slotIndex) {
        if (!this.duck.consumables || slotIndex >= this.duck.consumables.length) {
            return; // Slot vacío
        }

        const consumable = this.duck.consumables[slotIndex];

        // Llamar al efecto de uso del consumable
        this.useConsumable(consumable);

        // Remover del inventario
        this.duck.consumables.splice(slotIndex, 1);

        // Actualizar la visualización
        this.update();
    }

    /**
     * Usa un consumible llamando a su función use_effect
     * @param {Object} consumable - El objeto consumible con type y value
     */
    useConsumable(consumable) {
        // Ejecutar el efecto directamente basado en el tipo
        this.executeUseEffect(consumable.type, this.duck);
    }

    /**
     * Ejecuta el efecto de uso basado en el tipo de consumible
     * @param {string} type - Tipo del consumible
     * @param {Duck} duck - El pato que usa el consumible
     */
    executeUseEffect(type, duck) {
        switch (type) {
            case 'attack_potion':
                this.useAttackPotionEffect(duck);
                break;
            case 'speed_potion':
                this.useSpeedPotionEffect(duck);
                break;
            case 'speed_attack_potion':
                this.useSpeedAttackPotionEffect(duck);
                break;
            case 'fox_tail':
                this.useFoxTailEffect(duck);
                break;    
            // Agregar más casos aquí para otros consumibles
            default:
                console.log(`Efecto de uso no definido para: ${type}`);
        }
    }

    /**
     * Efecto específico del bread: crea otro pan cerca del pato
     * @param {Duck} duck - El pato que usa el consumible
     */
    useBreadEffect(duck) {
        console.log('Usando pan: creando nuevo pan cerca del pato');

        // Generar posición aleatoria cerca del pato (radio de 100-200 píxeles)
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100; // Entre 100 y 200 píxeles

        const x = duck.x + Math.cos(angle) * distance;
        const y = duck.y + Math.sin(angle) * distance;

        // Crear nuevo pan directamente
        // Nota: useBreadEffect ya no se invoca desde executeUseEffect (bread es moneda)
    }

    /**
     * Efecto específico de la poción de ataque: duplica el daño por 30 segundos
     * @param {Duck} duck - El pato que usa el consumible
     */
    useAttackPotionEffect(duck) {
        console.log('Usando poción de ataque: duplicando daño por 30 segundos');

        // Duplicar el multiplicador de daño
        if (!duck.damageMultiplier) {
            duck.damageMultiplier = 1;
        }
        duck.damageMultiplier *= 2;

        // Resetear después de 30 segundos
        duck.scene.time.delayedCall(30000, () => {
            if (duck.damageMultiplier) {
                duck.damageMultiplier /= 2;
                console.log('Efecto de poción de ataque terminado: daño restaurado');
            }
        });
    }

    /**
     * Efecto específico de la poción de velocidad: duplica la velocidad por 15 segundos
     * @param {Duck} duck - El pato que usa el consumible
     */
    useSpeedPotionEffect(duck) {
        console.log('Usando poción de velocidad: duplicando velocidad por 15 segundos');

        // Duplicar el multiplicador de velocidad
        if (!duck.speedMultiplier) {
            duck.speedMultiplier = 1;
        }
        duck.speedMultiplier *= 2;

        // Resetear después de 15 segundos
        duck.scene.time.delayedCall(15000, () => {
            if (duck.speedMultiplier) {
                duck.speedMultiplier /= 2;
                console.log('Efecto de poción de velocidad terminado: velocidad restaurada');
            }
        });
    }

    useSpeedAttackPotionEffect(duck) {
        console.log('Usando poción de velocidad de ataque: duplicando cadencia de ataque por 20 segundos');

        if (!duck.weapon) {
            console.warn('No hay arma equipada para aplicar el efecto de velocidad de ataque');
            return;
        }

        if (duck.weapon._attackSpeedBase == null) {
            duck.weapon._attackSpeedBase = duck.weapon.attackSpeed;
        }

        // El attackSpeed es el tiempo entre ataques, así que reducirlo acelera la cadencia
        duck.weapon.attackSpeed = duck.weapon._attackSpeedBase / 2;
        duck.weapon._attackSpeedBuffActive = true;

        duck.scene.time.delayedCall(20000, () => {
            if (duck.weapon && duck.weapon._attackSpeedBuffActive) {
                duck.weapon.attackSpeed = duck.weapon._attackSpeedBase;
                duck.weapon._attackSpeedBuffActive = false;
                console.log('Efecto de poción de velocidad de ataque terminado: velocidad de ataque restaurada');
            }
        });
    }

    /*Invencivilidad Drop Cola del Zorro*/
    useFoxTailEffect(duck) {
        const radius = 250;
        const duration = 8000; // 8 segundos
        const interval = 100;  // cada 100ms limpia proyectiles

        if (!duck?.scene) return;

        console.log('Fox tail activa durante 8 segundos');

        const event = duck.scene.time.addEvent({
            delay: interval,
            repeat: duration / interval,
            callback: () => {

                if (!duck.active) return;

                duck.scene.projectiles.getChildren().forEach(projectile => {
                    if (!projectile || !projectile.active) return;

                    const dx = projectile.x - duck.x;
                    const dy = projectile.y - duck.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist <= radius) {
                        projectile.destroy();
                    }
                });
            }
        });

        // OPCIONAL: efecto visual mientras dura
        const aura = duck.scene.add.circle(duck.x, duck.y, radius, 0xffffff, 0.1);
        aura.setDepth(9998);

        const followEvent = duck.scene.time.addEvent({
            delay: 16,
            callback: () => {
                if (!duck.active) {
                    aura.destroy();
                    return;
                }
                aura.setPosition(duck.x, duck.y);
            },
            loop: true
        });

        // destruir aura al acabar
        duck.scene.time.delayedCall(duration, () => {
            aura.destroy();
            followEvent.remove();
            event.remove();
        });
    }


    /**
     * Destruye la barra de consumibles
     */
    destroy() {
        this.slots.forEach(slot => {
            slot.background?.destroy();
            slot.text?.destroy();
            slot.itemSprite?.destroy();
        });
        this.slots = [];
    }
}