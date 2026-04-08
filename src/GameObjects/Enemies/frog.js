import Enemy, { StatusEnemy } from "../enemy";

export default class Frog extends Enemy {

    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 750, hp = 80, speed = 110, hasFeather) {
        // Pasamos null como weapon para que Enemy no intente equipar nada en super()
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, null, movementType, hasFeather);
        this.setScale(4);

        // Estado de activación: la rana no actúa como enemigo hasta recibir daño
        this.isActivated = false;

        // Guardamos el arma deseada para equiparla cuando se active
        this._pendingWeapon = weapon;

        // Al inicio, desactivar la visión para que no detecte al jugador pasivamente
        this._visionRadius = 0;
        this._originalVisionRadius = visionRadius;

        // Destruir cualquier arma que Enemy pudiera haber asignado (fallback defensivo)
        if (this.weapon) {
            this.weapon.destroy(undefined, { notifyOwner: false });
            this.weapon = null;
        }

        // La rana no suelta item especial por defecto
        this.specialDrop = null;
        this.hasFeather = hasFeather;

        // Arrancar animación idle inmediatamente para que se vea "viva" desde el inicio
        this._playIdleAnim();
    }

    // ─────────────────────────────────────────
    //  ACTIVACIÓN POR GOLPE
    // ─────────────────────────────────────────

    takeDamage(damage) {
        // Activar la rana al primer golpe recibido
        if (!this.isActivated) {
            this.isActivated = true;

            // Restaurar el radio de visión original al activarse
            this._visionRadius = this._originalVisionRadius;

            // Equipar el arma pendiente ahora que está activa
            if (this._pendingWeapon) {
                this.equipWeapon(this._pendingWeapon);
            }

            console.log(`${this._nombre} ha sido golpeada y se ha activado`);
        }

        // Delegar al comportamiento normal de Enemy
        super.takeDamage(damage);
    }

    // ─────────────────────────────────────────
    //  PRECARGA DEL OBJETO RANA
    // ─────────────────────────────────────────

    preUpdate(time, delta) {
        if (!this.isActivated) {
            // NO hacer nada (ni moverse, ni perseguir, ni atacar)
            // Solo reproducir animación idle para que se vea "viva"
            this._playIdleAnim();
            return;
        }

        // comportamiento normal de Enemy
        super.preUpdate(time, delta);
    }

    // ─────────────────────────────────────────
    //  ANIMACIÓN IDLE (siempre activa, incluso quieta)
    // ─────────────────────────────────────────

    _playIdleAnim() {
        if (!this.anims || !this.scene) return;

        const idleAnim = this._animKeyFor('idle');
        if (idleAnim && this.scene.anims.exists(idleAnim)) {
            if (!this.anims.isPlaying || this.anims.currentAnim?.key !== idleAnim) {
                this.play(idleAnim, true);
            }
        }
    }
}