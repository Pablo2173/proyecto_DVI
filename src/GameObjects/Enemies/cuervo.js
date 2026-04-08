import Enemy, { StatusEnemy } from '../enemy.js';

export default class Cuervo extends Enemy {
    constructor(scene, name, x, y, texture, frame, weapon, movementType, visionRadius = 900, hp = 60, speed = 110, hasFeather = false) {
        super(scene, name, x, y, texture, frame, visionRadius, hp, speed, weapon, movementType, hasFeather);
        this.setScale(4);

        // El cuervo puede volar sobre obstáculos del mapa (árboles, vallas, etc.).
        this.ignoresObstacleHitbox = true;

        // Ventana breve para evitar que aparezca ya alertado en el mismo frame de spawn.
        this._spawnGraceUntil = (scene?.time?.now ?? 0) + 1200;

        // El cuervo nace agresivo.
        this.setState(StatusEnemy.ALERTED);

        // El cuervo nace sin arma y debe intentar robar la del pato.
        if (this.weapon) {
            this.weapon.destroy(undefined, { notifyOwner: false });
            this.weapon = null;
        }
        this._stealRange = 56;
        this._stealCooldown = 1200;
        this._nextStealAt = 0;

        // Nace mirando hacia el jugador para poder entrar en persecución al terminar la gracia de spawn.
        if (scene?.duck) {
            const angleToDuck = Math.atan2(scene.duck.y - this.y, scene.duck.x - this.x);
            this._facingAngle = angleToDuck;
        }

        this._enforceAlertedOnlyState();
    }

    _enforceAlertedOnlyState() {
        if (this._state === StatusEnemy.IDLE || this._state === StatusEnemy.SEARCH) {
            this._state = StatusEnemy.ALERTED;
            this._searchStartTime = 0;
        }
    }

    setState(state) {
        if (state === StatusEnemy.IDLE || state === StatusEnemy.SEARCH) {
            super.setState(StatusEnemy.ALERTED);
            return;
        }

        super.setState(state);
    }

    detectAndAlert(player, time = this.scene?.time?.now ?? 0) {
        if (time < this._spawnGraceUntil) {
            this._enforceAlertedOnlyState();
            return false;
        }

        const detected = super.detectAndAlert(player, time);
        this._enforceAlertedOnlyState();
        return detected;
    }

    onAudioEvent(audioEvent) {
        const eventTime = audioEvent?.time ?? (this.scene?.time?.now ?? 0);
        if (eventTime < this._spawnGraceUntil) return;
        super.onAudioEvent(audioEvent);
        this._enforceAlertedOnlyState();
    }

    preUpdate(time, delta) {
        this._enforceAlertedOnlyState();
        super.preUpdate(time, delta);
        this._enforceAlertedOnlyState();
    }

    movementAlerted(target) {
        const now = this.scene?.time?.now ?? 0;
        if (now < this._spawnGraceUntil) {
            this.stop();
            return;
        }

        if (!target) return;

        // Si no tiene arma, su prioridad es alcanzar al pato para robársela.
        if (!this.weapon) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist <= this._stealRange && now >= this._nextStealAt) {
                this._tryStealDuckWeapon(target, now);
            }

            if (!this.weapon) {
                this.moveTowards(target);
                return;
            }
        }

        super.movementAlerted(target);
    }

    _tryStealDuckWeapon(duck, now) {
        if (!duck?.weapon) return;

        const stolenWeaponClass = duck.weapon.constructor;

        duck.equipWeapon('ramita');
        this.equipWeapon(stolenWeaponClass);

        this._visionAlertFlashUntil = now + 500;
        this._nextStealAt = now + this._stealCooldown;
    }
}