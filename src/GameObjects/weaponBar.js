import Phaser from 'phaser';

export default class WeaponBar {

    static MAX_CHARGE = 100;
    static OFFSETY = 60;

    constructor(scene, player, isEnemy = false) {
        this.scene = scene;
        this.player = player;
        this.isEnemy = isEnemy;

        this.currentCharge = 0;
        this.cooldownTime = 0; // tiempo hasta el que está en cooldown
        this.timerActive = false;
        this.timerMode = 'countdown'; // countdown | recharge
        this.timerStartTime = 0;
        this.timerEndTime = 0;
        this.timerDuration = 0;

        // Solo crear sprites si no es un enemigo (enemigos tienen barra invisible)
        if (!isEnemy) {
            this.border = scene.add.sprite(0, 0, 'weapon_bar_border')
                .setOrigin(0.5)
                .setDepth(8)
                .setScale(3);

            this.fill = scene.add.sprite(0, 0, 'weapon_bar_fill')
                .setOrigin(0, 0.5)
                .setDepth(9)
                .setScale(3);

            // Mantener cursor ancho total para crop en lugar de cambiar el displayWidth
            this.fillWidth = this.fill.displayWidth;
            this.fillHeight = this.fill.displayHeight;
        } else {
            this.border = null;
            this.fill = null;
            this.fillWidth = 0;
        }

        this.updatePosition();
        this.updateFill();
    }

    updatePosition() {
        if (!this.border) return;

        this.border.x = this.player.x;
        this.border.y = this.player.y + WeaponBar.OFFSETY;

        // Fijar el extremo izquierdo de fill al borde izquierdo para evitar desplazamientos (No funciona)
        const halfBorder = this.border.displayWidth / 2;
        this.fill.x = this.border.x - halfBorder;
        this.fill.y = this.border.y;
    }

    updateFill() {
        if (!this.border) return;

        const ratio = Phaser.Math.Clamp(
            this.currentCharge / WeaponBar.MAX_CHARGE,
            0,
            1
        );

        this.fill.displayWidth = this.fillWidth * ratio;
    }

    setFull() {
        this.currentCharge = Phaser.Math.Clamp(
            WeaponBar.MAX_CHARGE,
            0,
            WeaponBar.MAX_CHARGE
        );
        this.updateFill();
    }

    setEmpty() {
        this.currentCharge = Phaser.Math.Clamp(
            0,
            0,
            WeaponBar.MAX_CHARGE
        );
        this.updateFill();
    }

    addCharge(amount) {
        this.currentCharge = Phaser.Math.Clamp(
            this.currentCharge + amount,
            0,
            WeaponBar.MAX_CHARGE
        );
        this.updateFill();
    }

    removeCharge(amount) {
        this.currentCharge = Phaser.Math.Clamp(
            this.currentCharge - amount,
            0,
            WeaponBar.MAX_CHARGE
        );
        this.updateFill();
    }

    isEmpty() {
        return this.currentCharge === 0;
    }

    isFull() {
        return this.currentCharge === WeaponBar.MAX_CHARGE;
    }

    update() {
        if (this.timerActive) {
            const now = this.scene.time.now;
            const remaining = this.timerEndTime - now;

            if (remaining > 0 && this.timerDuration > 0) {
                const progress = Phaser.Math.Clamp(
                    (now - this.timerStartTime) / this.timerDuration,
                    0,
                    1
                );

                this.currentCharge = this.timerMode === 'recharge'
                    ? Phaser.Math.Clamp(progress * WeaponBar.MAX_CHARGE, 0, WeaponBar.MAX_CHARGE)
                    : Phaser.Math.Clamp((1 - progress) * WeaponBar.MAX_CHARGE, 0, WeaponBar.MAX_CHARGE);
                this.updateFill();
            } else {
                this.timerActive = false;
                this.timerStartTime = 0;
                this.timerEndTime = 0;
                this.timerDuration = 0;
                if (this.timerMode === 'recharge') {
                    this.setFull();
                } else {
                    this.setEmpty();
                }
                this.timerMode = 'countdown';
            }
        }

        // Manejar cooldown de recarga
        if (this.cooldownTime > 0 && this.scene.time.now >= this.cooldownTime) {
            this.setFull();
            this.cooldownTime = 0;
        }

        // Solo actualizar posición y profundidad si hay sprites visibles
        if (this.border) {
            this.updatePosition();
            // mantener la barra siempre por encima del jugador/enemigo
            if (this.player && this.border) {
                const baseDepth = typeof this.player.depth === 'number' ? this.player.depth : 0;
                this.border.setDepth(baseDepth + 10);
                this.fill.setDepth(baseDepth + 11);
            }
        }
    }
    //el cooldown para los enemigos
    startCooldown(ms = 5000) {
        this.currentCharge = 0;
        this.updateFill();
        this.cooldownTime = this.scene.time.now + ms;
    }

    startTimedEffect(duration = 0) {
        if (duration <= 0) return;

        this.timerActive = true;
        this.timerMode = 'countdown';
        this.timerStartTime = this.scene.time.now;
        this.timerDuration = duration;
        this.timerEndTime = this.timerStartTime + duration;
        this.currentCharge = WeaponBar.MAX_CHARGE;
        this.updateFill();
    }

    startCountdown(duration = 0) {
        this.startTimedEffect(duration);
    }

    startRecharge(duration = 0) {
        if (duration <= 0) return;

        this.timerActive = true;
        this.timerMode = 'recharge';
        this.timerStartTime = this.scene.time.now;
        this.timerDuration = duration;
        this.timerEndTime = this.timerStartTime + duration;
        this.currentCharge = 0;
        this.updateFill();
    }

    clearTimedEffect() {
        this.timerActive = false;
        this.timerMode = 'countdown';
        this.timerStartTime = 0;
        this.timerEndTime = 0;
        this.timerDuration = 0;
    }

    destroy() {
        if (this.border) this.border.destroy();  
        if (this.fill) this.fill.destroy();
    }
}