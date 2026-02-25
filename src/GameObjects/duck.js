import Phaser from 'phaser';
import mcuaktro from './Weapons/Distance/mcuaktro.js';

const DUCK_STATE = Object.freeze({
    IDLE: 0,
    WALKING: 1,
    DASHING: 2,
    QUACKING: 3
});

export default class Duck extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, weapon_data) {
        super(scene, x, y, mcuaktro, 0);
        this.scene = scene;
        scene.add.existing(this);

        const WeaponClass = WEAPON_MAP[weapon_data];
        this.weapon = WeaponClass ? new WeaponClass(scene, x, y) : null;
        if (this.weapon) this.weapon.owner = this;

        this._speed = 160;
        this._acc = 1;
        this._maxSpeed = 180;
        this.dashSpeed = 600;
        this.dashDuration = 200;
        this.lastDashTime = 0;
        this.state = DUCK_STATE.IDLE;
        this.facingX = 1;
        this.facingY = 0;
        this.scale = 3

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyW = scene.input.keyboard.addKey('W');
        this.keyA = scene.input.keyboard.addKey('A');
        this.keyS = scene.input.keyboard.addKey('S');
        this.keyD = scene.input.keyboard.addKey('D');
        this.keySpace = scene.input.keyboard.addKey('SPACE');
        this.keyC = scene.input.keyboard.addKey('C');

        this.quackDuration = 600;
        this.quackEndTime = 0;

        this.keySpace.on('down', () => this.startDash());
        this.keyC.on('down', () => this.quack());
    }

    setState(newState) {
        if (this.state === newState) return;
        this.state = newState;

        switch (newState) {
            case DUCK_STATE.IDLE:
                this.play('duck-idle', true);
                break;
            case DUCK_STATE.WALKING:
                this.play('duck-walk', true);
                break;
            case DUCK_STATE.QUACKING:
                this.play('duck-cuack', true);
                break;
            case DUCK_STATE.DASHING:
                this.play('duck-dash', true);
                break;
        }
    }

    quack() {
        this.setState(DUCK_STATE.QUACKING);
        this.quackEndTime = this.scene.time.now + this.quackDuration;
        this.scene.sound?.play('cuack');
    }

    startDash() {
        const now = this.scene.time.now;
        if (now < this.lastDashTime + 800) return;
        this.lastDashTime = now;
        this.setState(DUCK_STATE.DASHING);

        this.scene.time.delayedCall(this.dashDuration, () => {
            if (this.state === DUCK_STATE.DASHING) this.setState(DUCK_STATE.IDLE);
        });
    }

    preUpdate(time, dt) {
        super.preUpdate(time, dt);
        const delta = dt / 1000;

        if (this.state === DUCK_STATE.QUACKING && time >= this.quackEndTime) {
            this.setState(DUCK_STATE.IDLE);
        }

        let vx = 0;
        let vy = 0;

        if (this.state !== DUCK_STATE.DASHING) {
            if (this.cursors.left.isDown || this.keyA.isDown) vx -= 1;
            if (this.cursors.right.isDown || this.keyD.isDown) vx += 1;
            if (this.cursors.up.isDown || this.keyW.isDown) vy -= 1;
            if (this.cursors.down.isDown || this.keyS.isDown) vy += 1;
        }

        const isDashing = this.state === DUCK_STATE.DASHING;
        const speed = isDashing ? this.dashSpeed : this._speed;

        if (vx !== 0 || vy !== 0 || isDashing) {
            const len = Math.hypot(vx, vy) || 1;
            const moveX = (vx !== 0 ? vx : this.facingX) / len * speed;
            const moveY = (vy !== 0 ? vy : this.facingY) / len * speed;

            this.x += moveX * delta;
            this.y += moveY * delta;

            if (!isDashing) {
                this.facingX = vx;
                this.facingY = vy;
                this.setState(DUCK_STATE.WALKING);
            }
        } else if (this.state !== DUCK_STATE.QUACKING) {
            this.setState(DUCK_STATE.IDLE);
        }

        if (vx > 0) this.setFlipX(true);
        if (vx < 0) this.setFlipX(false);

        if (this.weapon) {
            this.weapon.setPosition(this.x, this.y);
            this.weapon.update?.();
        }
    }
}