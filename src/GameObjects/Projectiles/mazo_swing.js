import Projectile from './projectile.js';

/**
 * MazoSwing — proyectil melee que representa el golpe del mazo.
 *
 * No usa sprite independiente: el propio objeto sigue la rotación del arma
 * en arco durante su duración y luego se destruye solo.
 *
 * config heredado de Weapon.attack():
 *   damage, range (se ignora como distancia), direction (rotación actual del arma)
 *
 * config extra:
 *   owner         : referencia al portador del arma
 *   weaponRotation: ángulo actual del arma en radianes
 *   duration      : ms que dura el swing (default 220)
 *   swingAngle    : amplitud del arco en radianes (default π/2 = 90°)
 *   radius        : distancia del golpe al owner (default 45)
 */
export default class MazoSwing extends Projectile {

    constructor(scene, x, y, config = {}) {
        // Pasamos texture null → invisible, Projectile lo gestiona
        super(scene, x, y, null, { damage: config.damage ?? 10 });

        this.owner          = config.owner;
        this.duration       = config.duration      ?? 220;
        this.swingAmplitude = config.swingAngle    ?? Math.PI / 2;
        this.radius         = config.radius        ?? 45;
        this.baseRotation   = config.weaponRotation ?? 0;
        this.startTime      = scene.time.now;

        // Hacemos invisible el sprite (es solo un hitbox lógico)
        this.setVisible(false);

        // Sobrescribimos speedX/speedY para que el _update base no nos mueva
        this.speedX = 0;
        this.speedY = 0;
    }

    _update(time, delta) {
        if (!this.active) return;

        const elapsed  = time - this.startTime;
        if (elapsed >= this.duration) {
            this.destroy();
            return;
        }

        // Progreso 0→1 a lo largo del swing
        const progress    = elapsed / this.duration;
        // Arco de -amplitud/2 a +amplitud/2 relativo a la rotación base
        const angleOffset = -this.swingAmplitude / 2 + this.swingAmplitude * progress;
        const angle       = this.baseRotation + angleOffset;

        const ownerX = this.owner ? this.owner.x : this.x;
        const ownerY = this.owner ? this.owner.y : this.y;

        this.x = ownerX + Math.cos(angle) * this.radius;
        this.y = ownerY + Math.sin(angle) * this.radius;
    }
}