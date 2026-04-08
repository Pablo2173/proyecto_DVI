import Phaser from 'phaser';
import AttackPotion from './Consumables/attackPotion.js';
import SpeedPotion from './Consumables/SpeedPotion.js';
import SpeedAttackPotion from './Consumables/SpeedAttackPotion.js';

/**
 * Store
 * Sistema de tienda en el mapa.
 * Genera 3 pociones en el suelo con precio visible.
 * El jugador puede comprarlas con panes (moneda) pulsando E.
 *
 * RESPONSABILIDADES:
 *  - Generar las pociones en el suelo
 *  - Asignar qué pociones aparecen (aleatorio)
 *  - Mostrar precios
 *  - Gestionar interacción (E)
 *  - Gestionar compra
 */
export default class Store {

    /**
     * Configuración de tipos disponibles con sus precios fijos.
     * AttackPotion → 1
     * SpeedPotion → 2
     * SpeedAttackPotion → 3
     */
    static POTION_CATALOG = [
        { type: 'attack_potion',       PotionClass: AttackPotion,       price: 1 },
        { type: 'speed_potion',        PotionClass: SpeedPotion,        price: 2 },
        { type: 'speed_attack_potion', PotionClass: SpeedAttackPotion,  price: 3 },
    ];

    // Separación horizontal entre cada slot de la tienda (px)
    static SLOT_SPACING = 120;

    // Distancia máxima (px) a la que el jugador puede interactuar con una poción
    static INTERACT_RADIUS = 60;

    /**
     * @param {Phaser.Scene} scene         - Escena principal
     * @param {number}       x             - Posición X central de la tienda
     * @param {number}       y             - Posición Y de la tienda
     * @param {object}       duck          - Referencia al jugador (Duck)
     * @param {object}       consumableBar - Referencia a la barra de consumibles
     */
    constructor(scene, x, y, duck, consumableBar) {
        this.scene        = scene;
        this.x            = x;
        this.y            = y;
        this.duck         = duck;
        this.consumableBar = consumableBar;

        // Slots activos: cada elemento es { sprite, priceText, priceLabel, type, price } o null si ya fue comprado
        this.slots = [];

        // Índice del slot más cercano al jugador (-1 = ninguno)
        this._nearestSlotIndex = -1;

        // FIX: Store ya NO registra su propia tecla E para evitar conflicto con MainScene.
        // En su lugar, recibe eJustDown como parámetro en update().

        this._spawnPotions();
    }

    // ─────────────────────────────────────────
    // SPAWN DE POCIONES
    // 5 pociones en línea horizontal, separadas uniformemente.
    // Ejemplo visual:
    //   [Poción]   [Poción]   [Poción]   [Poción]   [Poción]
    //     1           2          2          3          1
    // ─────────────────────────────────────────

    /**
     * Genera 5 pociones aleatorias del catálogo y las posiciona en el suelo.
     * Cada poción tiene un sprite estático (NO usa DropItem).
     * @private
     */
    _spawnPotions() {
        // Definir 5 slots con posición horizontal equidistante
        const totalSlots = 5;
        const halfSpan   = ((totalSlots - 1) / 2) * Store.SLOT_SPACING;

        for (let i = 0; i < totalSlots; i++) {
            // Selección aleatoria del catálogo (pueden repetirse)
            const catalogEntry = Phaser.Utils.Array.GetRandom(Store.POTION_CATALOG);

            const slotX = this.x - halfSpan + i * Store.SLOT_SPACING;
            const slotY = this.y;

            // ── Sprite estático de la poción ──
            const sprite = this.scene.add.image(slotX, slotY, catalogEntry.type);
            sprite.setScale(3);
            sprite.setDepth(100);

            // Efecto flotante suave para que se vea viva
            this.scene.tweens.add({
                targets:  sprite,
                y:        slotY - 5,
                duration: 900,
                ease:     'Sine.easeInOut',
                yoyo:     true,
                repeat:   -1
            });

            // ── Texto de precio debajo del icono ──
            // Alineado con la poción
            const priceLabel = this.scene.add.text(slotX, slotY + 22, `${catalogEntry.price}`, {
                fontSize:        '20px',
                fill:            '#FFD700',
                fontStyle:       'bold',
                stroke:          '#000000',
                strokeThickness: 3,
                align:           'center',
            });
            priceLabel.setOrigin(0.5, 0);
            priceLabel.setDepth(101);

            // ── Indicador de interacción (oculto por defecto) ──
            // Se muestra cuando el jugador está en rango
            const hint = this.scene.add.text(slotX, slotY - 28, '[E] Comprar', {
                fontSize:        '20px',
                fill:            '#FFFFFF',
                stroke:          '#000000',
                strokeThickness: 2,
                align:           'center',
            });
            hint.setOrigin(0.5, 1);
            hint.setDepth(102);
            hint.setVisible(false);

            this.slots.push({
                sprite,
                priceLabel,
                hint,
                type:  catalogEntry.type,
                price: catalogEntry.price,
                slotX,
                slotY,
            });
        }
    }

    // ─────────────────────────────────────────
    // UPDATE — llamar desde MainScene.update()
    // ─────────────────────────────────────────

    /**
     * Actualiza la tienda cada frame:
     *  - Detecta qué poción está más cerca del jugador
     *  - Muestra/oculta el indicador [E]
     *  - Gestiona la compra al pulsar E
     *
     * @param {boolean} eJustDown - true si E fue pulsada este frame (calculado en MainScene)
     */
    update(eJustDown = false) {
        if (!this.duck || !this.duck.active) return;

        this._nearestSlotIndex = -1;
        let nearestDist = Store.INTERACT_RADIUS;

        // ── Detectar la poción más cercana dentro del radio de interacción ──
        this.slots.forEach((slot, index) => {
            if (!slot) return; // slot ya fue comprado y limpiado

            const dist = Phaser.Math.Distance.Between(
                this.duck.x, this.duck.y,
                slot.slotX,  slot.slotY
            );

            if (dist < nearestDist) {
                nearestDist            = dist;
                this._nearestSlotIndex = index;
            }
        });

        // ── Actualizar visibilidad del hint en todos los slots ──
        this.slots.forEach((slot, index) => {
            if (!slot) return;
            slot.hint.setVisible(index === this._nearestSlotIndex);
        });

        // ── Gestionar compra al pulsar E ──
        if (eJustDown && this._nearestSlotIndex !== -1) {
            this._tryPurchase(this._nearestSlotIndex);
        }
    }

    // ─────────────────────────────────────────
    // COMPRA
    // ─────────────────────────────────────────

    /**
     * Intenta comprar la poción del slot indicado.
     *
     * AL PULSAR E:
     *   SI tiene dinero:
     *     1. Restar panes: scene.addBread(-precio)
     *     2. Eliminar poción del suelo
     *     3. Añadir a consumable bar: addItemByType(type)
     *   SI NO tiene dinero:
     *     - No hacer nada
     *
     * @param {number} slotIndex - Índice del slot a comprar
     * @private
     */
    _tryPurchase(slotIndex) {
        const slot = this.slots[slotIndex];
        if (!slot) return;

        const { type, price } = slot;

        // ── Condición: el jugador debe tener suficientes panes ──
        if (this.scene.breadCount < price) {
            // No hay dinero suficiente — no pasa nada
            console.log(`[Store] Sin panes suficientes. Necesitas ${price}, tienes ${this.scene.breadCount}`);
            this._flashNoBread(slot);
            return;
        }

        // Tiene dinero — proceder con la compra

        // 1. Restar panes
        this.scene.addBread(-price);

        // 2. Añadir al inventario (consumable bar) usando el tipo
        this._addToConsumableBar(type);

        // 3. Eliminar poción del suelo y limpiar slot
        this._destroySlot(slotIndex);

        console.log(`[Store] Comprado: ${type} por ${price} panes. Panes restantes: ${this.scene.breadCount}`);
    }

    /**
     * Añade una poción al inventario del jugador a través de la ConsumableBar.
     * Usa el sistema existente de consumables — NO crea lógica nueva de inventario.
     * Respeta los slots disponibles (máx 9).
     * @param {string} type - Tipo de consumible (ej: 'attack_potion')
     * @private
     */
    _addToConsumableBar(type) {
        if (!this.duck.consumables) {
            this.duck.consumables = [];
        }

        // Respetar slots disponibles (máx 9)
        if (this.duck.consumables.length >= 9) {
            console.log('[Store] Inventario lleno (máx 9). No se puede añadir la poción.');
            return;
        }

        // Usar el sistema existente de consumables
        this.duck.consumables.push({
            type:  type,
            value: 1,
        });
    }

    /**
     * Destruye todos los elementos visuales de un slot y lo marca como nulo.
     * @param {number} slotIndex
     * @private
     */
    _destroySlot(slotIndex) {
        const slot = this.slots[slotIndex];
        if (!slot) return;

        slot.sprite?.destroy();
        slot.priceLabel?.destroy();
        slot.hint?.destroy();

        // Marcar como comprado/vacío
        this.slots[slotIndex] = null;
    }

    /**
     * Feedback visual cuando no hay suficientes panes:
     * el precio parpadea en rojo brevemente.
     * @param {object} slot
     * @private
     */
    _flashNoBread(slot) {
        if (!slot?.priceLabel) return;

        const originalColor = '#FFD700';
        slot.priceLabel.setStyle({ fill: '#FF4444' });

        this.scene.time.delayedCall(400, () => {
            if (slot.priceLabel && slot.priceLabel.active) {
                slot.priceLabel.setStyle({ fill: originalColor });
            }
        });
    }

    /**
     * Destruye completamente la tienda (todos los slots, cartel y listeners).
     * Llamar si la tienda desaparece del mapa.
     */
    destroy() {
        this.slots.forEach((_, i) => this._destroySlot(i));
        this.slots = [];
        this._signText?.destroy();
    }
}