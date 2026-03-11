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

// Drops
import DropWeapon from '../GameObjects/Weapons/drops/dropWeapon.js';
import Bread from '../GameObjects/consumables/bread.js';

import Enemy from '../GameObjects/enemy.js';
import player_sprite from '../../assets/sprites/duck/idle_duck.png';
import sprint_sprite from '../../assets/sprites/duck/sprint_duck.png';
import cuack_sprite from '../../assets/sprites/duck/Cuack_duck.png';
import enemy_sprite from '../../assets/sprites/player.png';
import cuackSound from '../../assets/sounds/cuack.mp3';

// Weapon bar
import bar from '../../assets/sprites/Weapons/weaponBar/weapon_bar_border.png';
import bar_fill from '../../assets/sprites/Weapons/weaponBar/weapon_bar_fill.png';
import up_bar from '../../assets/sprites/UI/up_bar.png';
import Puddle from '../GameObjects/puddle.js';
import ConsumableBar from '../GameObjects/consumables/ConsumableBar.js';

// Enemigos
import Zorro from '../GameObjects/Enemies/zorro.js';
import Mapache from '../GameObjects/Enemies/mapache.js';

// Tilesets
import mapaJson from '../../assets/maps/level1_entrada_al_parque_mapa.json';
import darkGrassMiddleMiddle from '../../assets/tilesets/dark-grass-middle-middle.png';
import sidewalk1 from '../../assets/tilesets/sidewalk-1.png';
import asphaltRoad1 from '../../assets/tilesets/asphalt-road-1.png';
import asphaltRoad3 from '../../assets/tilesets/asphalt-road-3.png';
import asphaltRoad2 from '../../assets/tilesets/asphalt-road-2.png';
import sidewalk5 from '../../assets/tilesets/sidewalk-5.png';
import dirtpath1 from '../../assets/tilesets/dirtpath-1.png';
import dirtpath8 from '../../assets/tilesets/dirtpath-8.png';
import dirtpath9 from '../../assets/tilesets/dirtpath-9.png';
import dirtpath10 from '../../assets/tilesets/dirtpath-10.png';
import dirtpath11 from '../../assets/tilesets/dirtpath-11.png';
import dirtpath15 from '../../assets/tilesets/dirtpath-15.png';
import dirtpath12 from '../../assets/tilesets/dirtpath-12.png';
import dirtpath13 from '../../assets/tilesets/dirtpath-13.png';
import dirtpath14 from '../../assets/tilesets/dirtpath-14.png';
import dirtpath2 from '../../assets/tilesets/dirtpath-2.png';
import dirtpath5 from '../../assets/tilesets/dirtpath-5.png';
import dirtpath4 from '../../assets/tilesets/dirtpath-4.png';
import dirtpath6 from '../../assets/tilesets/dirtpath-6.png';
import house2 from '../../assets/tilesets/house-2.png';
import woodFenceLeftMiddle from '../../assets/tilesets/wood-fence-left-middle.png';
import woodFenceRightMiddle from '../../assets/tilesets/wood-fence-right-middle.png';
import woodFenceInteriorCorner1 from '../../assets/tilesets/wood-fence-interior-corner-1.png';
import woodFenceBottomMiddle from '../../assets/tilesets/wood-fence-bottom-middle.png';
import woodFenceInteriorCorner2 from '../../assets/tilesets/wood-fence-interior-corner-2.png';
import woodFenceInteriorCorner3 from '../../assets/tilesets/wood-fence-interior-corner-3.png';
import woodFenceTopLeftCorner from '../../assets/tilesets/wood-fence-top-left-corner.png';
import apartmentBuilding from '../../assets/tilesets/apartment-building.png';
import groceryStore from '../../assets/tilesets/grocery-store.png';
import tree1 from '../../assets/tilesets/tree-1.png';
import smallBushesBlueBerries from '../../assets/tilesets/small-bushes-blue-berries.png';
import waterFountain from '../../assets/tilesets/water-fountain.png';
import woodFenceInteriorCorner4 from '../../assets/tilesets/wood-fence-interior-corner-4.png';
import tallGrassMiddle from '../../assets/tilesets/tall-grass-middle.png';
import bush from '../../assets/tilesets/bush.png';


export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {

        // ── Mapa ──
        this.load.tilemapTiledJSON('level1', mapaJson);

        this.load.image('dark-grass-middle-middle', darkGrassMiddleMiddle);
        this.load.image('sidewalk-1', sidewalk1);
        this.load.image('asphalt-road-1', asphaltRoad1);
        this.load.image('asphalt-road-3', asphaltRoad3);
        this.load.image('asphalt-road-2', asphaltRoad2);
        this.load.image('sidewalk-5', sidewalk5);
        this.load.image('dirtpath-1', dirtpath1);
        this.load.image('dirtpath-8', dirtpath8);
        this.load.image('dirtpath-9', dirtpath9);
        this.load.image('dirtpath-10', dirtpath10);
        this.load.image('dirtpath-11', dirtpath11);
        this.load.image('dirtpath-15', dirtpath15);
        this.load.image('dirtpath-12', dirtpath12);
        this.load.image('dirtpath-13', dirtpath13);
        this.load.image('dirtpath-14', dirtpath14);
        this.load.image('dirtpath-2', dirtpath2);
        this.load.image('dirtpath-5', dirtpath5);
        this.load.image('dirtpath-4', dirtpath4);
        this.load.image('dirtpath-6', dirtpath6);
        this.load.image('house-2', house2);
        this.load.image('wood-fence-left-middle', woodFenceLeftMiddle);
        this.load.image('wood-fence-right-middle', woodFenceRightMiddle);
        this.load.image('wood-fence-interior-corner-1', woodFenceInteriorCorner1);
        this.load.image('wood-fence-bottom-middle', woodFenceBottomMiddle);
        this.load.image('wood-fence-interior-corner-2', woodFenceInteriorCorner2);
        this.load.image('wood-fence-interior-corner-3', woodFenceInteriorCorner3);
        this.load.image('wood-fence-top-left-corner', woodFenceTopLeftCorner);
        this.load.image('apartment-building', apartmentBuilding);
        this.load.image('grocery-store', groceryStore);
        this.load.image('tree-1', tree1);
        this.load.image('small-bushes-blue-berries', smallBushesBlueBerries);
        this.load.image('water-fountain', waterFountain);
        this.load.image('wood-fence-interior-corner-4', woodFenceInteriorCorner4);
        this.load.image('tall-grass-middle', tallGrassMiddle);
        this.load.image('bush', bush);

        this.load.spritesheet('idle_duck', player_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('duck_walk', sprint_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('duck-cuack', cuack_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('duck-dash', sprint_sprite, { // Cambiar a sprite de bolita
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.image('enemy', enemy_sprite);
        this.load.audio('cuack', cuackSound);

        // Preload de todas las armas (cambiar)
        Arco.preload(this);
        Mcuaktro.preload(this);
        Cuchillo.preload(this);
        Mazo.preload(this);
        Ramita.preload(this);
        Flecha.preload(this);
        Bala.preload(this);

        // Preload de consumibles
        Bread.preload(this);

        // Preload de la barra de arma del jugador
        this.load.image('weapon_bar_border', bar);
        this.load.image('weapon_bar_fill', bar_fill);
        
        // Preload de UI
        this.load.image('up_bar', up_bar);
    }

    create() {

        const SCALE = 3;
        
        const map = this.make.tilemap({ 
        key: 'level1',
        tileWidth: 16 * SCALE,  
        tileHeight: 16 * SCALE
        });

        const tilesetNames = [
            'dark-grass-middle-middle', 'sidewalk-1', 'asphalt-road-1', 'asphalt-road-3',
            'asphalt-road-2', 'sidewalk-5', 'dirtpath-1', 'dirtpath-8', 'dirtpath-9',
            'dirtpath-10', 'dirtpath-11', 'dirtpath-15', 'dirtpath-12', 'dirtpath-13',
            'dirtpath-14', 'dirtpath-2', 'dirtpath-5', 'dirtpath-4', 'dirtpath-6',
            'house-2', 'wood-fence-left-middle', 'wood-fence-right-middle',
            'wood-fence-interior-corner-1', 'wood-fence-bottom-middle',
            'wood-fence-interior-corner-2', 'wood-fence-interior-corner-3',
            'wood-fence-top-left-corner', 'apartment-building', 'grocery-store',
            'tree-1', 'small-bushes-blue-berries', 'water-fountain',
            'wood-fence-interior-corner-4', 'tall-grass-middle', 'bush'
        ];

        const tilesets = tilesetNames.map(name => map.addTilesetImage(name, name));

        const baseLayer = map.createLayer('base', tilesets, 0, 0);
        baseLayer.setScale(SCALE);

        const patronesLayer = map.createLayer('Capa de patrones 1', tilesets, 0, 0);
        patronesLayer.setScale(SCALE);

        const colisionLayer = map.createLayer('Zonas con colision', tilesets, 0, 0);
        colisionLayer.setScale(SCALE);

        const esteticaLayer = map.createLayer('Objetos estéticos sin colision', tilesets, 0, 0);
        esteticaLayer.setScale(SCALE);

        colisionLayer.setCollisionByProperty({ collides: true });

        this.physics.world.setBounds(0, 0, map.widthInPixels * SCALE, map.heightInPixels * SCALE);
        this.cameras.main.setBounds(0, 0, map.widthInPixels * SCALE, map.heightInPixels * SCALE);

        this.anims.create({
            key: 'duck-idle',
            frames: this.anims.generateFrameNumbers('idle_duck', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'duck-walk',
            frames: this.anims.generateFrameNumbers('duck_walk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'duck-cuack',
            frames: this.anims.generateFrameNumbers('duck-cuack', { start: 0, end: 0 }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'duck-dash',
            frames: this.anims.generateFrameNumbers('duck-dash', { start: 0, end: 3 }),
            frameRate: 16,
            repeat: 0
        });

        this.anims.create({
            key: 'duck-swimming',
            frames: this.anims.generateFrameNumbers('duck-swimming', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // ── Fondo ──
        //const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB);
        //bg.setOrigin(0);

        // ── Sonido ──
        this.cuackSound = this.sound.add('cuack', { volume: 1 });

        // ── Grupo de drops — debe crearse ANTES que el pato y los drops ──
        this.dropItems = this.add.group();
        
        // ── Grupo de consumables ──
        this.consumableItems = this.add.group();

        // ── Grupo de proyectiles ──
        this.projectiles = this.add.group();

        // ── Pato ──
        this.duck = new Duck(this, 1700, 9500, 'mcuaktro');
        
        // ── Barra de consumibles ──
        this.consumableBar = new ConsumableBar(this, this.duck);

        // ── Atacar con click izquierdo (puntual o mantenido) ──
        this.input.on('pointerdown', () => {
            if (this.duck && this.duck.weapon) this.duck.weapon.attack();
        });

        // ── Soltar click: necesario para armas con carga (arco) ──
        this.input.on('pointerup', () => {
            if (this.duck && this.duck.weapon && this.duck.weapon.releaseAttack) {
                this.duck.weapon.releaseAttack();
            }
        });

        // ── Enemigo ──
        this.enemy = new Mapache(this, 'Mapache', 2000, 9500, 'enemy', null, 'mcuaktro'); //de momento el weapon se lo pongo a null hasta que este implementado
        this.enemy.setFlipX(true);

        // ── Colisiones: Proyectiles -> Enemigos ──
        this.physics.add.overlap(this.projectiles, this.enemy, (projectile, enemy) => {
            this._onProjectileHitEnemy(projectile, enemy);
        });

        // ── Eventos de audio para el enemigo ──
        this.events.on('audio:event', (audioEvent) => {
            if (this.enemy) this.enemy.onAudioEvent(audioEvent);
        });

        // ── Graphics para radio de visión ──
        this.visionGraphics = this.add.graphics();
        this.enemyAlertTime = null;

        // ── Spawn de drops de ejemplo ──
        // Múltiples panes en posiciones estratégicas para testing
        new Bread(this, 50, 50);      // Cerca del spawn del pato
        new Bread(this, 200, 100);    // Arriba a la derecha
        new Bread(this, 400, 200);    // Centro-derecha
        new Bread(this, 100, 300);    // Abajo a la izquierda
        new Bread(this, 350, 400);    // Centro-abajo
        new Bread(this, 600, 150);    // Derecha-arriba
        new Bread(this, 250, 500);    // Abajo-centro
        
        // Mazo en posición fija
        new DropWeapon(this, 450, 450, Mazo, 'mazo');

        // Arco en posición aleatoria
        new DropWeapon(
            this,
            Phaser.Math.Between(0, 1000),
            Phaser.Math.Between(0, 1000),
            Arco,
            'arco'
        );

        // ── Spawn de charco de agua visible temporal ──   
        const puddle = new Puddle(this, 300, 300, 100);
        const g = this.add.graphics();
        g.lineStyle(2, 0x0000ff, 1);
        g.strokeCircle(puddle.x, puddle.y, puddle.radius);



        // ── Barra superior UI (x3) ──
        const upBar = this.add.image(960, 0, 'up_bar');
        upBar.setOrigin(0.5, 0);
        upBar.setScale(3);
        upBar.setScrollFactor(0);

        // ── HUD ──
        this.add.text(10, 10,
            'Mover: WASD / Flechas | Dash: Espacio | Recoger arma: E | Atacar: Click | Cuack: C',
            { fontSize: '14px', fill: '#FFFFFF' }
        );

        this.physics.add.collider(this.duck, colisionLayer); //colisiones del mapa
        this.physics.add.collider(this.enemy, colisionLayer);

        // Cámara
        // No usar startFollow, lo haremos manualmente en update()
    }

    update(time, delta) {
        // ── Actualizar barra de consumibles ──
        if (this.consumableBar) {
            this.consumableBar.update();
        }

        // ── Cámara entre pato y ratón ──
        if (this.duck) {
            const mouseX = this.input.activePointer.worldX;
            const mouseY = this.input.activePointer.worldY;
            
            // 70% hacia el pato, 30% hacia el ratón
            const camX = this.duck.x * 0.7 + mouseX * 0.3;
            const camY = this.duck.y * 0.7 + mouseY * 0.3;
            
            this.cameras.main.centerOn(camX, camY, 1, 1); // suavizado
        }

        // ── Ataque continuo mientras se mantiene el botón izquierdo ──
        // Para armas con carga (arco), attack() solo inicia la carga una vez
        if (this.input.activePointer.isDown && this.duck && this.duck.weapon) {
            this.duck.weapon.attack();
        }

        if (this.enemy) {
            this.enemy.detectAndAlert(this.duck);

            // Parpadeo amarillo 0.5s al alertarse
            if (this.enemy.isAlerted()) {
                if (this.enemyAlertTime === null) {
                    this.enemyAlertTime = time;
                    this.enemy.setTint(0xFFFF01);
                }
                if (time - this.enemyAlertTime > 500) {
                    // only clear if not currently flashing red
                    if (this.enemy.tintTopLeft !== 0xFF0000) {
                        this.enemy.clearTint();
                    }
                }
            } else {
                this.enemyAlertTime = null;
                // clear only if not flashing damage
                if (this.enemy.tintTopLeft !== 0xFF0000) {
                    this.enemy.clearTint();
                }
            }

            // Radio de visión debug
            this.visionGraphics.clear();
            this.enemy.drawVision(this.visionGraphics, { color: 0xff0000, fillAlpha: 0.08 });
        }
    }

    /**
     * Maneja la colisión entre un proyectil y un enemigo
     * @param {Projectile} projectile - El proyectil que colisionó
     * @param {Enemy} enemy - El enemigo que fue golpeado
     */
    _onProjectileHitEnemy(projectile, enemy) {
        if (!projectile || !enemy) return;

        // evitar daño repetido al mismo enemigo
        if (projectile.hitEnemies) {
            if (projectile.hitEnemies.has(enemy)) return;
            projectile.hitEnemies.add(enemy);
        }

        // El enemigo recibe daño
        enemy.takeDamage(projectile.damage);

        // Solo destruir proyectiles no-piercing
        if (!projectile.piercing) {
            projectile.destroy();
        }

        console.log(`¡Proyectil impactó! Daño: ${projectile.damage}, HP enemigo: ${enemy.getHP()}`);
    }

}