import Phaser from 'phaser';

export default class ConsumableBar {
    constructor(scene, duck, inputManager = null) {
        this.scene = scene;
        this.duck = duck;
        this.inputManager = inputManager;

        const screenWidth = this.scene.scale.width;

        // Layout general
        this.panelX = 28;
        this.panelY = 14;
        this.panelWidth = screenWidth - 56;   // casi todo el ancho
        this.panelHeight = 150;

        // Inventario
        this.slotWidth = 74;
        this.slotHeight = 74;
        this.slotSpacing = 14;
        this.slotCount = 6;
        this.slotsStartX = this.panelX + 26;
        this.slotsY = this.panelY + 18;

        // Recursos derecha (en horizontal, no apilados)
        this.resourcesBlockWidth = 600;
        this.resourcesStartX = this.panelX + this.panelWidth - this.resourcesBlockWidth;
        this.resourceCenterY = this.panelY + this.panelHeight / 2;

        this.selectedSlotIndex = -1;
        this.controlMode = 'keyboard';
        this.slots = [];
        this._previousGamepadButtons = {
            left: false,
            right: false,
            use: false
        };

        this.buildHUD();
        this.setupKeyboardInput();
        this.update();
    }

    // ─────────────────────────────────────────
    // BUILD
    // ─────────────────────────────────────────

    buildHUD() {
        // Sin fondo marrón/negro sólido: solo marco decorativo
        this.topLine = this.scene.add.rectangle(
            this.panelX,
            this.panelY,
            this.panelWidth,
            3,
            0xe4c46a,
            0.95
        );
        this.topLine.setOrigin(0, 0);
        this.topLine.setScrollFactor(0);
        this.topLine.setDepth(9090);

        this.bottomLine = this.scene.add.rectangle(
            this.panelX,
            this.panelY + this.panelHeight - 3,
            this.panelWidth,
            3,
            0xe4c46a,
            0.95
        );
        this.bottomLine.setOrigin(0, 0);
        this.bottomLine.setScrollFactor(0);
        this.bottomLine.setDepth(9090);

        this.leftLine = this.scene.add.rectangle(
            this.panelX,
            this.panelY,
            3,
            this.panelHeight,
            0x8f6a22,
            0.85
        );
        this.leftLine.setOrigin(0, 0);
        this.leftLine.setScrollFactor(0);
        this.leftLine.setDepth(9090);

        this.rightLine = this.scene.add.rectangle(
            this.panelX + this.panelWidth - 3,
            this.panelY,
            3,
            this.panelHeight,
            0x8f6a22,
            0.85
        );
        this.rightLine.setOrigin(0, 0);
        this.rightLine.setScrollFactor(0);
        this.rightLine.setDepth(9090);

        // Esquinas decorativas
        this.cornerTL = this.createCorner(this.panelX, this.panelY, true, true);
        this.cornerTR = this.createCorner(this.panelX + this.panelWidth, this.panelY, false, true);
        this.cornerBL = this.createCorner(this.panelX, this.panelY + this.panelHeight, true, false);
        this.cornerBR = this.createCorner(this.panelX + this.panelWidth, this.panelY + this.panelHeight, false, false);

        // Separador vertical elegante
        this.divider = this.scene.add.rectangle(
            this.resourcesStartX - 30,
            this.panelY + 14,
            3,
            this.panelHeight - 28,
            0xd4af37,
            0.75
        );
        this.divider.setOrigin(0, 0);
        this.divider.setScrollFactor(0);
        this.divider.setDepth(9091);

        // Línea interior pequeña al lado del separador
        this.dividerGlow = this.scene.add.rectangle(
            this.resourcesStartX - 26,
            this.panelY + 20,
            1,
            this.panelHeight - 40,
            0xfff2b3,
            0.65
        );
        this.dividerGlow.setOrigin(0, 0);
        this.dividerGlow.setScrollFactor(0);
        this.dividerGlow.setDepth(9091);

        this.createSlots();
        this.createResourceArea();
        this.createControlsHint();
    }

    createCorner(x, y, isLeft, isTop) {
        const corner = this.scene.add.text(
            x,
            y,
            '◆',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#f4d97b',
                stroke: '#000000',
                strokeThickness: 3
            }
        );

        corner.setScrollFactor(0);
        corner.setDepth(9092);

        const offsetX = isLeft ? -1 : -11;
        const offsetY = isTop ? -9 : -11;
        corner.setPosition(x + offsetX, y + offsetY);

        return corner;
    }

    createSlots() {
        for (let i = 0; i < this.slotCount; i++) {
            const x = this.slotsStartX + i * (this.slotWidth + this.slotSpacing);
            const y = this.slotsY;

            const slot = {
                index: i,
                x,
                y,
                background: null,
                inner: null,
                numberText: null,
                itemSprite: null
            };

            slot.background = this.scene.add.rectangle(
                x,
                y,
                this.slotWidth,
                this.slotHeight,
                0x000000,
                0.22
            );
            slot.background.setOrigin(0, 0);
            slot.background.setScrollFactor(0);
            slot.background.setDepth(9100);
            slot.background.setStrokeStyle(3, 0xcda349, 0.95);
            slot.background.setInteractive({ useHandCursor: true });

            slot.inner = this.scene.add.rectangle(
                x + 5,
                y + 5,
                this.slotWidth - 10,
                this.slotHeight - 10,
                0x000000,
                0.14
            );
            slot.inner.setOrigin(0, 0);
            slot.inner.setScrollFactor(0);
            slot.inner.setDepth(9100);

            slot.background.on('pointerdown', () => {
                this.selectSlot(i);
                this.useSelectedItem();
            });

            slot.numberText = this.scene.add.text(
                x + 7,
                y + 53,
                String(i + 1),
                {
                    fontFamily: 'ReturnOfTheBoss',
                    fontSize: '14px',
                    color: '#f8e7b5',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            );
            slot.numberText.setScrollFactor(0);
            slot.numberText.setDepth(9103);

            this.slots.push(slot);
        }

        this.useHintText = this.scene.add.text(
            this.slotsStartX + this.slotCount * (this.slotWidth + this.slotSpacing) + 10,
            this.panelY + 41,
            'F = USAR',
            {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '22px',
                color: '#f8e7b5',
                stroke: '#000000',
                strokeThickness: 5
            }
        );
        this.useHintText.setScrollFactor(0);
        this.useHintText.setDepth(9102);
    }

    createResourceArea() {
        this.resourcesTitle = this.scene.add.text(
            this.resourcesStartX,
            this.panelY + 8,
            'RECURSOS',
            {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '25px',
                color: '#ffd977',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        this.resourcesTitle.setScrollFactor(0);
        this.resourcesTitle.setDepth(9102);

        // BLOQUE PLUMAS (izquierda del bloque de recursos)
        this.featherIcon = this.scene.add.image(
            this.resourcesStartX + 120,
            this.resourceCenterY + 10,
            'feather_icon'
        );
        this.featherIcon.setOrigin(0, 0.5);
        this.featherIcon.setScrollFactor(0);
        this.featherIcon.setDepth(9102);
        this.featherIcon.setScale(0.15);

        this.featherText = this.scene.add.text(
            this.resourcesStartX + 230,
            this.resourceCenterY - 8,
            '0 / 0',
            {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '30px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 5
            }
        );
        this.featherText.setScrollFactor(0);
        this.featherText.setDepth(9103);

        // BLOQUE PAN (a la derecha de plumas, horizontal)
        this.breadIcon = this.scene.add.image(
            this.resourcesStartX + 370,
            this.resourceCenterY + 10,
            'bread_item'
        );
        this.breadIcon.setOrigin(0, 0.5);
        this.breadIcon.setScrollFactor(0);
        this.breadIcon.setDepth(9102);
        this.breadIconBaseScale = 4;
        this.breadIcon.setScale(this.breadIconBaseScale);

        this.breadText = this.scene.add.text(
            this.resourcesStartX + 460,
            this.resourceCenterY - 8,
            'x 0',
            {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '30px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 5
            }
        );
        this.breadText.setScrollFactor(0);
        this.breadText.setDepth(9103);
    }

    createControlsHint() {
        this.controlsText = this.scene.add.text(
            this.panelX + 20,
            this.panelY + this.panelHeight - 18,
            'WASD MOVER · ESPACIO DASH · E INTERACTUAR · CLICK ATACAR · C CUACK · 1-6 USAR CONSUMIBLE',
            {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '20px',
                color: '#f8e7b5',
                stroke: '#000000',
                strokeThickness: 4
            }
        );

        this.controlsText.setOrigin(0, 1);
        this.controlsText.setScrollFactor(0);
        this.controlsText.setDepth(9102);
        this.controlsText.setAlpha(0.92);

        // ── Botón de ajustes (⚙) en la esquina superior derecha del HUD ──
        const btnX = this.divider.x - 50; // a la izquierda del separador
        const btnY = this.panelY + this.panelHeight / 2; // centrado vertical

        this.settingsBtnBg = this.scene.add.rectangle(btnX, btnY, 58, 58, 0x000000, 0.4)
            .setStrokeStyle(3, 0xe4c46a, 0.9)
            .setScrollFactor(0)
            .setDepth(9200)
            .setInteractive({ useHandCursor: true });

        this.settingsBtnText = this.scene.add.text(btnX, btnY, '⚙', {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#f4d97b',
            stroke: '#000000',
            strokeThickness: 3
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(9201)
            .setInteractive({ useHandCursor: true });

        const openPause = () => {
            if (this.scene?.openPauseMenu) {
                this.scene.openPauseMenu();
            }
        };

        this.settingsBtnBg.on('pointerup', openPause);
        this.settingsBtnText.on('pointerup', openPause);

        this.settingsBtnBg.on('pointerover', () => {
            this.settingsBtnBg.setFillStyle(0x333333, 0.7);
            this.settingsBtnText.setScale(1.1);
        });
        this.settingsBtnBg.on('pointerout', () => {
            this.settingsBtnBg.setFillStyle(0x000000, 0.4);
            this.settingsBtnText.setScale(1);
        });
    }
    // ─────────────────────────────────────────
    // INPUT
    // ─────────────────────────────────────────

    setupKeyboardInput() {
        this.key1 = this.scene.input.keyboard.addKey('ONE');
        this.key2 = this.scene.input.keyboard.addKey('TWO');
        this.key3 = this.scene.input.keyboard.addKey('THREE');
        this.key4 = this.scene.input.keyboard.addKey('FOUR');
        this.key5 = this.scene.input.keyboard.addKey('FIVE');
        this.key6 = this.scene.input.keyboard.addKey('SIX');
    }

    checkKeyboardInput() {
        let handled = false;

        if (this.scene.input.keyboard.checkDown(this.key1, 250)) {
            this.controlMode = 'keyboard';
            this.useSlot(0);
            handled = true;
        }
        if (this.scene.input.keyboard.checkDown(this.key2, 250)) {
            this.controlMode = 'keyboard';
            this.useSlot(1);
            handled = true;
        }
        if (this.scene.input.keyboard.checkDown(this.key3, 250)) {
            this.controlMode = 'keyboard';
            this.useSlot(2);
            handled = true;
        }
        if (this.scene.input.keyboard.checkDown(this.key4, 250)) {
            this.controlMode = 'keyboard';
            this.useSlot(3);
            handled = true;
        }
        if (this.scene.input.keyboard.checkDown(this.key5, 250)) {
            this.useSlot(4);
            handled = true;
        }
        if (this.scene.input.keyboard.checkDown(this.key6, 250)) {
            this.useSlot(5);
            handled = true;
        }

        return handled;
    }

    checkGamepadInput() {
        const pad = this.getPrimaryGamepad();
        if (!pad) {
            this._previousGamepadButtons.left = false;
            this._previousGamepadButtons.right = false;
            this._previousGamepadButtons.use = false;
            return;
        }

        const leftDown = this.isGamepadButtonDown(pad, 14);
        const rightDown = this.isGamepadButtonDown(pad, 15);
        const useDown = this.isGamepadButtonDown(pad, 2);
        let handled = false;

        if (leftDown && !this._previousGamepadButtons.left) {
            this.selectPreviousSlot();
            handled = true;
        }

        if (rightDown && !this._previousGamepadButtons.right) {
            this.selectNextSlot();
            handled = true;
        }

        if (useDown && !this._previousGamepadButtons.use) {
            this.useSelectedItem();
            handled = true;
        }

        this._previousGamepadButtons.left = leftDown;
        this._previousGamepadButtons.right = rightDown;
        this._previousGamepadButtons.use = useDown;

        return handled;
    }

    getPrimaryGamepad() {
        if (!this.scene?.input?.gamepad) return null;

        const gamepads = this.scene.input.gamepad.getAll();
        if (!gamepads || gamepads.length === 0) return null;

        return gamepads.find((pad) => pad && pad.connected) || gamepads[0];
    }

    isGamepadButtonDown(pad, buttonIndex) {
        if (!pad || !pad.buttons || !pad.buttons[buttonIndex]) return false;

        const button = pad.buttons[buttonIndex];
        return !!(button.pressed || (typeof button.value === 'number' && button.value > 0.5));
    }

    selectSlot(slotIndex) {
        if (slotIndex < -1 || slotIndex >= this.slotCount) return;
        this.selectedSlotIndex = slotIndex;
    }

    selectNextSlot() {
        const consumableCount = this.duck.consumables?.length ?? 0;
        const maxSelectableIndex = Math.min(this.slotCount, consumableCount) - 1;

        if (maxSelectableIndex < 0) {
            this.selectedSlotIndex = -1;
            return;
        }

        if (this.selectedSlotIndex < 0) {
            this.selectedSlotIndex = 0;
            return;
        }

        this.selectedSlotIndex = Math.min(this.selectedSlotIndex + 1, maxSelectableIndex);
    }

    selectPreviousSlot() {
        const consumableCount = this.duck.consumables?.length ?? 0;
        const maxSelectableIndex = Math.min(this.slotCount, consumableCount) - 1;

        if (maxSelectableIndex < 0) {
            this.selectedSlotIndex = -1;
            return;
        }

        if (this.selectedSlotIndex < 0) {
            this.selectedSlotIndex = 0;
            return;
        }

        this.selectedSlotIndex = Math.max(this.selectedSlotIndex - 1, 0);
    }

    useSlot(slotIndex) {
        this.selectSlot(slotIndex);
        this.onSlotClick(slotIndex);
    }

    useSelectedItem() {
        if (this.selectedSlotIndex < 0) return;
        if (!this.duck.consumables || this.selectedSlotIndex >= this.duck.consumables.length) return;

        const item = this.duck.consumables[this.selectedSlotIndex];

        if (item.type === 'mask') {
            this.duck.activateInvisibility();
            this.duck.consumables.splice(this.selectedSlotIndex, 1);
            this.pulseSlot(this.selectedSlotIndex);
            this.refreshSlots();
            this.refreshResources();
            return;
        }

        this.onSlotClick(this.selectedSlotIndex);
    }

    // ─────────────────────────────────────────
    // UPDATE HUD
    // ─────────────────────────────────────────

    update() {
        if (!this.duck) return;

        const keyboardHandled = this.checkKeyboardInput();
        const gamepadHandled = this.checkGamepadInput();

        this.controlMode = this.getActiveInputMode();

        if (this.controlMode === 'gamepad') {
            this.ensureGamepadSelection();
        }

        this.refreshSlots();
        this.refreshResources();
        this.refreshControlsHint();
    }

    getActiveInputMode() {
        return this.scene?.registry?.get('activeInputMode') || 'keyboard';
    }

    ensureGamepadSelection() {
        const consumableCount = this.duck.consumables?.length ?? 0;
        const maxSelectableIndex = Math.min(this.slotCount, consumableCount) - 1;

        if (maxSelectableIndex < 0) {
            this.selectedSlotIndex = -1;
            return;
        }

        if (this.selectedSlotIndex < 0) {
            this.selectedSlotIndex = 0;
            return;
        }

        if (this.selectedSlotIndex > maxSelectableIndex) {
            this.selectedSlotIndex = maxSelectableIndex;
        }
    }

    refreshSlots() {
        this.slots.forEach(slot => {
            if (slot.itemSprite) {
                slot.itemSprite.destroy();
                slot.itemSprite = null;
            }

            slot.background.setFillStyle(0x000000, 0.22);
            slot.background.setStrokeStyle(3, 0xcda349, 0.95);
            slot.inner.setFillStyle(0x000000, 0.14);
        });

        const consumables = this.duck.consumables ?? [];

        consumables.forEach((consumable, index) => {
            if (index >= this.slots.length) return;

            const slot = this.slots[index];
            const spriteKey = this.getSpriteKey(consumable.type);

            if (spriteKey) {
                slot.itemSprite = this.scene.add.image(
                    slot.x + this.slotWidth / 2,
                    slot.y + this.slotHeight / 2 - 2,
                    spriteKey
                );
                slot.itemSprite.setScale(this.getItemScale(consumable.type));
                slot.itemSprite.setScrollFactor(0);
                slot.itemSprite.setDepth(9101);
            }

            slot.background.setFillStyle(0x000000, 0.28);
            slot.background.setStrokeStyle(3, 0xf1d07a, 1);
            slot.inner.setFillStyle(0x000000, 0.18);
        });

        if (this.controlMode === 'gamepad' && this.selectedSlotIndex >= 0 && this.selectedSlotIndex < this.slots.length) {
            const selectedSlot = this.slots[this.selectedSlotIndex];
            selectedSlot.background.setStrokeStyle(4, 0xffe8a3, 1);
        }

        if (!this.extraItemsText) {
            this.extraItemsText = this.scene.add.text(
                this.useHintText.x + 8,
                this.useHintText.y + 28,
                '',
                {
                    fontFamily: 'ReturnOfTheBoss',
                    fontSize: '16px',
                    color: '#ffefad',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            );
            this.extraItemsText.setScrollFactor(0);
            this.extraItemsText.setDepth(9103);
        }

        const extra = Math.max(0, consumables.length - this.slotCount);
        this.extraItemsText.setText(extra > 0 ? `+${extra}` : '');
    }

    refreshResources() {
        const feathers = this.duck.feathers ?? 0;
        const breadCount = this.scene.breadCount ?? 0;

        this.featherText.setText(`${feathers}`);
        this.breadText.setText(`x ${breadCount}`);
        this.breadIcon?.setScale(this.breadIconBaseScale ?? 4);
    }

    refreshControlsHint() {
        if (!this.controlsText) return;

        if (this.controlMode === 'gamepad') {
            this.controlsText.setText('MODO MANDO : D-PAD IZQ/DER SELECCIONAR · CUADRADO USAR · CLICK ATACAR · C CUACK');
        } else {
            this.controlsText.setText('MODO TECLADO : WASD MOVER · ESPACIO DASH · E INTERACTUAR · CLICK ATACAR · C CUACK');
        }
    }

    // ─────────────────────────────────────────
    // CONSUMABLES
    // ─────────────────────────────────────────

    onSlotClick(slotIndex) {
        if (!this.duck.consumables || slotIndex >= this.duck.consumables.length) return;

        const consumable = this.duck.consumables[slotIndex];
        const wasConsumed = this.useConsumable(consumable);
        if (wasConsumed) {
            this.duck.consumables.splice(slotIndex, 1);
        }

        this.pulseSlot(slotIndex);
        this.refreshSlots();
        this.refreshResources();
    }

    useConsumable(consumable) {
        return this.executeUseEffect(consumable.type, this.duck);
    }

    executeUseEffect(type, duck) {
        switch (type) {
            case 'attack_potion':
                this.useAttackPotionEffect(duck);
                return true;
            case 'speed_potion':
                this.useSpeedPotionEffect(duck);
                return true;
            case 'speed_attack_potion':
                this.useSpeedAttackPotionEffect(duck);
                return true;
            case 'key':
                return this.useKeyEffect(duck);
            case 'fox_tail':
                this.useFoxTailEffect(duck);
                return true;
            case 'mask':
                duck.activateInvisibility();
                return true;
            default:
                console.log(`Efecto de uso no definido para: ${type}`);
                return true;
        }
    }

    getSpriteKey(type) {
        const spriteMap = {
            attack_potion: 'attack_potion',
            speed_potion: 'speed_potion',
            speed_attack_potion: 'speed_attack_potion',
            fox_tail: 'fox_tail',
            mask: 'mask_icon',
            key: 'key_item'
        };
        return spriteMap[type] || null;
    }

    getItemScale(type) {
        const scaleMap = {
            attack_potion: 3.2,
            speed_potion: 3.2,
            speed_attack_potion: 3.2,
            mask: 3.1,
            fox_tail: 0.1,
            key: 3
        };
        return scaleMap[type] ?? 3;
    }

    pulseSlot(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return;
        const slot = this.slots[slotIndex];

        this.scene.tweens.add({
            targets: [slot.background, slot.inner],
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 90,
            yoyo: true,
            ease: 'Sine.Out'
        });
    }

    pulseBread() {
        this.scene.tweens.add({
            targets: this.breadText,
            scaleX: 1.12,
            scaleY: 1.12,
            duration: 100,
            yoyo: true,
            ease: 'Sine.Out'
        });
    }

    pulseFeathers() {
        this.scene.tweens.add({
            targets: [this.featherIcon, this.featherText],
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 100,
            yoyo: true,
            ease: 'Sine.Out'
        });
    }

    useAttackPotionEffect(duck) {
        console.log('Usando poción de ataque: duplicando daño por 30 segundos');

        if (!duck.damageMultiplier) duck.damageMultiplier = 1;
        duck.damageMultiplier *= 2;

        duck.scene.time.delayedCall(30000, () => {
            if (duck.damageMultiplier) {
                duck.damageMultiplier /= 2;
                console.log('Efecto de poción de ataque terminado: daño restaurado');
            }
        });
    }

    useSpeedPotionEffect(duck) {
        console.log('Usando poción de velocidad: duplicando velocidad por 15 segundos');

        if (!duck.speedMultiplier) duck.speedMultiplier = 1;
        duck.speedMultiplier *= 2;

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

    useFoxTailEffect(duck) {
        const radius = 250;
        const duration = 8000;
        const interval = 100;

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

        duck.scene.time.delayedCall(duration, () => {
            aura.destroy();
            followEvent.remove();
            event.remove();
        });
    }

    useKeyEffect(duck) {
        if (!duck?.scene?.tryOpenNearbyClosedDoor) {
            return false;
        }

        const opened = duck.scene.tryOpenNearbyClosedDoor(duck, false);
        if (!opened) {
            console.log('No hay puerta cerrada cerca para usar la llave');
            return false;
        }

        return true;
    }

    // ─────────────────────────────────────────
    // DESTROY
    // ─────────────────────────────────────────

    destroy() {
        this.topLine?.destroy();
        this.bottomLine?.destroy();
        this.leftLine?.destroy();
        this.rightLine?.destroy();
        this.divider?.destroy();
        this.dividerGlow?.destroy();

        this.cornerTL?.destroy();
        this.cornerTR?.destroy();
        this.cornerBL?.destroy();
        this.cornerBR?.destroy();

        this.resourcesTitle?.destroy();
        this.featherIcon?.destroy();
        this.featherText?.destroy();
        this.breadIcon?.destroy();
        this.breadText?.destroy();
        this.useHintText?.destroy();
        this.extraItemsText?.destroy();
        this.controlsText?.destroy();
        this.settingsBtnBg?.destroy();
        this.settingsBtnText?.destroy();

        this.slots.forEach(slot => {
            slot.background?.destroy();
            slot.inner?.destroy();
            slot.numberText?.destroy();
            slot.itemSprite?.destroy();
        });

        this.slots = [];
    }
}