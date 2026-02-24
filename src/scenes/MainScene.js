import Phaser from 'phaser';
import Duck from '../GameObjects/duck.js';
// Armas
import Arco from '../GameObjects/Weapons/Distance/arco.js';
import Mcuaktro from '../GameObjects/Weapons/Distance/mcuaktro.js';
import Cuchillo from '../GameObjects/Weapons/Melee/cuchillo.js';
import Mazo from '../GameObjects/Weapons/Melee/mazo.js';
import Ramita from '../GameObjects/Weapons/Melee/ramita.js';

// Proyectiles
import Flecha from '../GameObjects/Projectiles/flecha.js';
import Bala from '../GameObjects/Projectiles/bala.js';

import Enemy from '../GameObjects/enemy.js';
import player_sprite from '../../assets/sprites/player.png';
import enemy_sprite from '../../assets/sprites/player.png';
import cuackSound from '../../assets/sounds/cuack.mp3';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('pato', player_sprite);
        this.load.image('enemy', enemy_sprite);
        this.load.audio('cuack', cuackSound);
        // No se si esto hay que cargarlo aqui o cada arma se encarga de cargar su propia textura
        Arco.preload(this);
        Mcuaktro.preload(this);
        Cuchillo.preload(this);
        Mazo.preload(this);
        Ramita.preload(this);
        Flecha.preload(this);
        Bala.preload(this);
    }

    create() {
        // fondo simple
        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        bg.setOrigin(0);

        // Pre-cargar sonido de cuack para evitar input lag
        this.cuackSound = this.sound.add('cuack', { volume: 1 });

        // crear el pato con arma
        this.duck = new Duck(this, 200, 200, 'mcuaktro');

        // click para atacar con el arma del pato
        this.input.on('pointerdown', () => {
            if (this.duck && this.duck.weapon) this.duck.weapon.attack();
        });

        // crear enemigo como GameObject de Phaser (la clase Enemy ahora es un Sprite)
        this.enemy = new Enemy(this, 'Guard', 440, 200, 'enemy', null, 200);
        this.enemy.setFlipX(true);

        // Registra observador: el enemigo escucha los eventos de sonido
        // Esto permite que el enemigo reaccione a diferentes tipos de sonidos (cuac, dash, disparos, etc.)
        this.events.on('audio:event', (audioEvent) => {
            if (this.enemy) {
                this.enemy.onAudioEvent(audioEvent);
            }
        });

        // graphics para depurar radio de visión
        this.visionGraphics = this.add.graphics();

        // tracking del estado de alerta del enemigo para el parpadeo
        this.enemyAlertTime = null;

        // instrucciones en pantalla
        this.add.text(10, 10, 'Control: Flechas | Dash: Espacio | Pick: E | Drop: Q | Atacar: Click izquierdo | Cuack: C', {
            fontSize: '16px',
            fill: '#FFFFFF'
        });
    }

    update(time, delta) {
        // Duck.preUpdate se llama automáticamente
        // actualizar lógica del enemigo: sincronizar posición y detectar al jugador
        if (this.enemy) {
            // actualizar lógica: detectar al jugador
            this.enemy.detectAndAlert(this.duck);

            // Parpadeo amarillo claro de 0.5s cuando se alerta
            if (this.enemy.isAlerted()) {
                if (this.enemyAlertTime === null) {
                    this.enemyAlertTime = time;
                    this.enemy.setTint(0xFFFF01);
                }
                if (time - this.enemyAlertTime > 500) {
                    this.enemy.clearTint();
                }
            } else {
                this.enemyAlertTime = null;
                this.enemy.clearTint();
            }

            // Cuando el enemigo detecta al patete camina hacia él
            if (this.enemy.isAlerted()) {
                const pos = this.enemy.moveTowards(this.duck, 80, delta);
                this.enemy.setPosition(pos.x, pos.y);

                if (this.enemy.x < this.duck.x) {
                    this.enemy.setFlipX(false);
                } else {
                    this.enemy.setFlipX(true);
                }
            }

            // dibuja el radio de visión (para pruebas)
            this.visionGraphics.clear();
            this.enemy.drawVision(this.visionGraphics, { color: 0xff0000, fillAlpha: 0.08 });
        }
    }
}
