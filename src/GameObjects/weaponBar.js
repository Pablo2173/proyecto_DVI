import Phaser from 'phaser';

export default class WeaponBar {

    static MAX_CHARGE = 100;
    static OFFSETY = 60;

    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.currentCharge = WeaponBar.MAX_CHARGE;

        // Contorno
        this.border = scene.add.sprite(0, 0, 'weapon_bar_border')
            .setOrigin(0.5)
            .setDepth(8)
            .setScale(3);

        // Relleno
        this.fill = scene.add.sprite(0, 0, 'weapon_bar_fill')
            .setOrigin(0.33, 0.5)
            .setDepth(9)
            .setScale(3);

        this.fill.setScale(3);   // o WeaponBar.SCALE
        this.fillWidth = this.fill.displayWidth;  // ancho real después de la escala

        this.updatePosition();
        this.updateFill();
    }

    updatePosition() {
        this.border.x = this.player.x;
        this.border.y = this.player.y + WeaponBar.OFFSETY;

        this.fill.x = this.border.x - this.border.width / 2;
        this.fill.y = this.border.y;
    }

    updateFill() {
        const ratio = Phaser.Math.Clamp(
            this.currentCharge / WeaponBar.MAX_CHARGE,
            0,
            1
        );

        this.fill.displayWidth = this.fillWidth * ratio;
    }

    setFull() {
        this.currentCharge = Phaser.Math.Clamp(
            MAX_CHARGE,
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
        this.updatePosition();
    }

    destroy() {
        this.border.destroy();
        this.fill.destroy();
    }
}