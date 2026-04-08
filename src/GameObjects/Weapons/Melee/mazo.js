import Phaser from 'phaser';
import Weapon from '../weapon.js';
import MazoImpact from '../../Projectiles/mazoImpact.js';
import WeaponBar from '../weaponBar.js';
import mazoSprite from '../../../../assets/sprites/Weapons/mazo.png';

export default class Mazo extends Weapon {

static CHARGE_DURATION = 3000;
static MIN_SPEED_FACTOR = 0.2;

constructor(scene, owner, bar = null) {
super(scene, owner, {
    texture: 'mazo',
    isRanged: false,
    damage: 55,
    attackSpeed: 500,
    durability: 10,
    range: 90,
    optimalDistance: 65,
    swingAngle: 70,
    swingDuration: 180,
    scale: 1.5,
    debug: true,
    bar: bar
});

this.isCharging = false;
this.isSlamming = false;
this.chargeStartTime = 0;
this.chargeLevel = 0;
this.originalDuckSpeed = null;
this.baseRange = this.range;

this.rangeCircleGfx = scene.add.graphics();
this.rangeCircleGfx.setDepth(2);
}

static preload(scene) {
    scene.load.image('mazo', mazoSprite);
}

on_equip() {
    if (this.bar) this.bar.setEmpty();
}

attack() {
    console.log('[MAZO] attack() llamado — isCharging:', this.isCharging, '| isSlamming:', this.isSlamming);

    if (this.isCharging || this.isSlamming) return;

    if (this.isEnemy) {
        super.attack();
        return;
    }

    console.log('[MAZO] Iniciando carga...');
    this.isCharging = true;
    this.isAttacking = true;
    this.chargeStartTime = this.scene.time.now;
    this.chargeLevel = 0;
    this.originalDuckSpeed = this.owner._speed;

    if (this.bar) this.bar.setEmpty();
}

releaseAttack() {
    console.log('[MAZO] releaseAttack() llamado — isCharging:', this.isCharging, '| isEnemy:', this.isEnemy);
    if (!this.isEnemy && this.isCharging) {
        this._releaseCharge();
    }
}

update() {
    if (!this.owner || !this.scene) return;

    if (this.isCharging && this.owner.state === 4) {
        this._cancelCharge();
    }

    if (this.isSlamming) {
        this.x = this.owner.x;
        this.y = this.owner.y;
        return;
    }

    super.update();

    if (this.isCharging && !this.isEnemy) {
        this._updateCharge();
    }
}

_updateCharge() {
    const elapsed = this.scene.time.now - this.chargeStartTime;
    const t = Math.min(elapsed / Mazo.CHARGE_DURATION, 1);

    this.chargeLevel = 1 - Math.pow(1 - t, 2);

    if (this.bar) {
        this.bar.currentCharge = this.chargeLevel * WeaponBar.MAX_CHARGE;
        this.bar.updateFill();
    }

    const speedFactor = 1 - (1 - Mazo.MIN_SPEED_FACTOR) * this.chargeLevel;
    this.owner._speed = this.originalDuckSpeed * speedFactor;

    this.range = this.baseRange * (1 + this.chargeLevel);

    this._drawRangeCircle();

    const cur = this.angle;
    let diff = -90 - cur;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    const elevated = cur + diff * this.chargeLevel;
    this.setAngle(elevated);

    const wrapped = Phaser.Math.Angle.WrapDegrees(elevated);
    this.setFlipY(wrapped > 90 || wrapped < -90);
}

_releaseCharge() {
    console.log('[MAZO] _releaseCharge() llamado — isCharging:', this.isCharging);
    if (!this.isCharging) return;
    this.isCharging = false;

    if (this.originalDuckSpeed !== null) {
        this.owner._speed = this.originalDuckSpeed;
        this.originalDuckSpeed = null;
    }

    const impactRadius = this.baseRange * (1 + this.chargeLevel);
    const impactDamage = this.getDamage() * (0.5 + this.chargeLevel * 1.5);

    // Diagnóstico del audio
    const audioExists = this.scene.cache.audio.exists('mazo_sound');
    const contextState = this.scene.sound.context?.state;
    console.log('[MAZO] mazo_sound en caché:', audioExists, '| AudioContext state:', contextState);

    if (!audioExists) {
        console.error('[MAZO] ❌ mazo_sound NO está en la caché de audio. Revisa boot.js.');
    } else if (contextState === 'suspended') {
        console.warn('[MAZO] ⚠️ AudioContext suspendido — el navegador bloqueó el audio.');
        this.scene.sound.context.resume();
    } else {
        console.log('[MAZO] ✅ Reproduciendo mazo_sound...');
    }

    this.scene.sound.play('mazo_sound', {
        volume: 1,
        rate: Phaser.Math.FloatBetween(0.92, 1.0)
    });

    new MazoImpact(this.scene, this.owner.x, this.owner.y, {
        radius: impactRadius,
        damage: impactDamage,
        owner: this.owner,
        team: this.owner?.team ?? 'neutral'
    });

    this.range = this.baseRange;
    this._clearRangeCircle();

    this.lastAttackTime = this.scene.time.now;
    this.chargeLevel = 0;
    if (this.bar) this.bar.setEmpty();

    this._slamAnimation();
}

_cancelCharge() {
    if (!this.isCharging) return;
    this.isCharging = false;
    this.isSlamming = false;
    this.isAttacking = false;
    this.chargeLevel = 0;

    if (this.originalDuckSpeed !== null) {
        this.owner._speed = this.originalDuckSpeed;
        this.originalDuckSpeed = null;
    }
    this.range = this.baseRange;
    this._clearRangeCircle();
    if (this.bar) this.bar.setEmpty();
}

_slamAnimation() {
    this.isSlamming = true;
    this.setAngle(90);

    this.scene.time.delayedCall(200, () => {
        if (!this.scene) return;
        this.isSlamming = false;
        this.isAttacking = false;
    });
}

on_shoot() {
    if (!this.bar || !this.isEnemy) return;
    this.bar.removeCharge(5);
    if (this.bar.isFull()) this.bar.startCooldown(5000);
    this.attackSpeed += 3;
    this.accuracy += 7;
}

barCanShoot() {
    if (!this.bar) return true;
    if (this.isEnemy) return !this.bar.isFull() && this.bar.cooldownTime === 0;
    return true;
}

on_wait() {
    if (!this.bar || !this.isEnemy) return;
    this.bar.addCharge(1);
}

_drawRangeCircle() {
    this.rangeCircleGfx.clear();
    this.rangeCircleGfx.lineStyle(2, 0xff0000, 0.5);
    this.rangeCircleGfx.strokeCircle(this.owner.x, this.owner.y, this.range);
    this.rangeCircleGfx.fillStyle(0xff0000, 0.08);
    this.rangeCircleGfx.fillCircle(this.owner.x, this.owner.y, this.range);
}

_clearRangeCircle() {
    if (this.rangeCircleGfx) this.rangeCircleGfx.clear();
}

destroy(fromScene) {
    this._clearRangeCircle();
    if (this.rangeCircleGfx) {
        this.rangeCircleGfx.destroy();
        this.rangeCircleGfx = null;
    }
    this._cancelCharge();
    super.destroy(fromScene);
}

}