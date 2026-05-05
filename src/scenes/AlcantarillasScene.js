import Phaser from 'phaser';
import Duck from '../GameObjects/duck.js';

// Armas
import Arco from '../GameObjects/Weapons/Distance/arco.js';
import Mcuaktro from '../GameObjects/Weapons/Distance/mcuaktro.js';
import Cuchillo from '../GameObjects/Weapons/Melee/cuchillo.js';
import Mazo from '../GameObjects/Weapons/Melee/mazo.js';
import Ramita from '../GameObjects/Weapons/Melee/ramita.js';
import Escoba from '../GameObjects/Weapons/Melee/escoba.js';

// Proyectiles
import Flecha from '../GameObjects/Projectiles/flecha.js';
import Bala from '../GameObjects/Projectiles/bala.js';
import BubblesCroco from '../GameObjects/Projectiles/bubblesCroco.js';

// Drops
import DropWeapon from '../GameObjects/Consumables/Drops/dropWeapon.js';
import Bread from '../GameObjects/Consumables/bread.js';

import AttackPotion from '../GameObjects/Consumables/attackPotion.js';

import SpeedPotion from '../GameObjects/Consumables/SpeedPotion.js';
import SpeedAttackPotion from '../GameObjects/Consumables/SpeedAttackPotion.js';
import Key from '../GameObjects/Consumables/key.js';

import DropBread from '../GameObjects/Consumables/Drops/dropBread.js';
import DropFeather from '../GameObjects/Consumables/Drops/dropFeather.js';

import Crocodile from '../GameObjects/crocodile.js';

import Enemy from '../GameObjects/enemy.js';
import Store from '../GameObjects/store.js';
import Frog from '../GameObjects/Enemies/frog.js';
import Car from '../GameObjects/Enemies/car.js';
import { DUCK_STATE } from '../GameObjects/duck.js';
import player_sprite from '../../assets/sprites/duck/idle_duck.png';
import sprint_sprite from '../../assets/sprites/duck/sprint_duck.png';
import dash_duck_sprite from '../../assets/sprites/duck/dash_duck.png';
import cuack_sprite from '../../assets/sprites/duck/Cuack_duck.png';
import duck_swimming_sprite from '../../assets/sprites/duck/swimming_duck.png';
import enemy_sprite from '../../assets/sprites/player.png';
import coche_enemy from '../../assets/sprites/coche_enemy.png';

// Sprites de enemigos específicos
import crocoSpritePath from '../../assets/sprites/croco/croco_idle.png';
import crocoAttackPath from '../../assets/sprites/croco/croco_attack.png';
import crocoSubmergePath from '../../assets/sprites/croco/croco_submerge.png';
import crocoBubblePath from '../../assets/sprites/croco/croco_bubble.png';

import zorro_idle from '../../assets/sprites/Zorro/zorro_idle.png';
import zorro_run from '../../assets/sprites/Zorro/zorro_run.png';
import zorro_hit from '../../assets/sprites/Zorro/zorro_hit.png';
import zorro_ded from '../../assets/sprites/Zorro/zorro_ded.png';

import mapache_idle from '../../assets/sprites/Mapache/mapache_idle.png';
import mapache_run from '../../assets/sprites/Mapache/mapache_run.png';
import mapache_hit from '../../assets/sprites/Mapache/mapache_hit.png';
import mapache_ded from '../../assets/sprites/Mapache/mapache_ded.png';

import cuervo_idle from '../../assets/sprites/Cuervo/cuervo_idle.png';
import cuervo_run from '../../assets/sprites/Cuervo/cuervo_run.png';
import cuervo_hit from '../../assets/sprites/Cuervo/cuervo_hit.png';
import cuervo_ded from '../../assets/sprites/Cuervo/cuervo_ded.png';

import rana_idle from '../../assets/sprites/Rana/rana_idle.png';

//Sounds
import cuackSound from '../../assets/sounds/cuack.mp3';
import deathSound from '../../assets/sounds/YouDied.mp3';
// Weapon bar
import bar from '../../assets/sprites/Weapons/weaponBar/weapon_bar_border.png';
import bar_fill from '../../assets/sprites/Weapons/weaponBar/weapon_bar_fill.png';
import up_bar from '../../assets/sprites/UI/up_bar.png';
import dash_charge_sprite from '../../assets/sprites/UI/dash_charge.png';
import rerollIcon from '../../assets/sprites/UI/reroll.png';
import Puddle from '../GameObjects/puddle.js';
import PuddleUpgradePanel from '../GameObjects/Puddles/PuddleUpgradePanel.js';
import ConsumableBar from '../GameObjects/Consumables/ConsumableBar.js';

// Enemigos
import Zorro from '../GameObjects/Enemies/zorro.js';
import Mapache from '../GameObjects/Enemies/mapache.js';
import Cuervo from '../GameObjects/Enemies/cuervo.js';

// Drops de enemigos
import mask_icon from '../../assets/sprites/consumables/Mask.png';
import fox_tail from '../../assets/sprites/consumables/fox_tail.png';

// Tilesets
import mapaAlcantarillas from '../../assets/maps/level2_alcantarillas.json';
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
import Overworld from '../../assets/tilesets/Overworld.png';
import objects from '../../assets/tilesets/objects.png';
import carGreenBack from '../../assets/tilesets/car-green-back.png';
import carBlueBack from '../../assets/tilesets/car-blue-back.png';
import truckRedFront from '../../assets/tilesets/truck-red-front.png';
import wallsFloor from '../../assets/tilesets/walls_floor.png';
import waterCoastsAnimation from '../../assets/tilesets/Water_coasts_animation.png';
import doorsLevelChest from '../../assets/tilesets/doors_lever_chest_animation.png';

// Hints
import actionSign from '../../assets/hints/action_sign.png';
import itemSign from '../../assets/hints/item_sign.png';
import jumpSign from '../../assets/hints/jump_sign.png';
import mouseSign from '../../assets/hints/mouse_sign.png';
import movementSign from '../../assets/hints/movement_sign.png';

//Plumas
import feather_icon from '../../assets/sprites/UI/pluma.png';

// InputManager
import InputManager from '../managers/InputManager.js';

export default class AlcantarillasScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AlcantarillasScene' });
    }

    preload() {

        // ── Mapa ──
        this.load.tilemapTiledJSON('level2', mapaAlcantarillas);

        //this.load.image('dark-grass-middle-middle', darkGrassMiddleMiddle);
        this.load.image('walls_floor', wallsFloor);
        this.load.image('Overworld', Overworld);
        this.load.image('dirtpath-1', dirtpath1);
        this.load.image('Water_coasts_animation', waterCoastsAnimation);
        this.load.image('objects', objects);
        this.load.image('doors_lever_chest_animation', doorsLevelChest);
        this.load.image('coche_enemy', coche_enemy);

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

        this.load.spritesheet('duck-swimming', duck_swimming_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('duck-dash', dash_duck_sprite, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.image('enemy', enemy_sprite);

        // Sprites crocodile
        this.load.image('croco_idle', crocoSpritePath);
        this.load.image('croco_attack', crocoAttackPath);
        this.load.image('croco_submerge', crocoSubmergePath);
        this.load.image('croco_bubble', crocoBubblePath);

        // Cargar spritesheets de zorro (4 frames cada uno, 32x32)
        this.load.spritesheet('zorro_idle', zorro_idle, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('zorro_run', zorro_run, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('zorro_hit', zorro_hit);
        this.load.image('zorro_ded', zorro_ded);
        // Alias para el sprite muerto (usado en Enemy.die())
        this.load.image('zorro_idle_corpse', zorro_ded);

        // Cargar spritesheets de mapache (4 frames cada uno, 32x32)
        this.load.spritesheet('mapache_idle', mapache_idle, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('mapache_run', mapache_run, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('mapache_hit', mapache_hit);
        this.load.image('mapache_ded', mapache_ded);
        // Alias para el sprite muerto (usado en Enemy.die())
        this.load.image('mapache_idle_corpse', mapache_ded);

        this.load.spritesheet('cuervo_idle', cuervo_idle, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('cuervo_run', cuervo_run, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('cuervo_hit', cuervo_hit);
        this.load.image('cuervo_ded', cuervo_ded);
        this.load.image('cuervo_idle_corpse', cuervo_ded);

        this.load.spritesheet('rana_idle', rana_idle, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.audio('cuack', cuackSound);
        this.load.audio('death_sound', deathSound);

        // Preload de todas las armas (cambiar)
        Arco.preload(this);
        Mcuaktro.preload(this);
        Cuchillo.preload(this);
        Mazo.preload(this);
        Ramita.preload(this);
        Flecha.preload(this);
        Bala.preload(this);
        BubblesCroco.preload(this);
        Escoba.preload(this);

        Bread.preload(this);

        AttackPotion.preload(this);
        SpeedPotion.preload(this);
        SpeedAttackPotion.preload(this);
        Key.preload(this);

        DropBread.preload(this);

        // Preload de la barra de arma del jugador
        this.load.image('weapon_bar_border', bar);
        this.load.image('weapon_bar_fill', bar_fill);

        // Preload de UI
        this.load.image('up_bar', up_bar);
        this.load.image('dash_charge', dash_charge_sprite);
        this.load.image('feather_icon', feather_icon);

        // Preload de drops de enemigos
        this.load.image('mask_icon', mask_icon);
        this.load.image('fox_tail', fox_tail);

        // Preload de HINTS
        this.load.image('action_sign', actionSign);
        this.load.image('item_sign', itemSign);
        this.load.image('jump_sign', jumpSign);
        this.load.image('mouse_sign', mouseSign);
        this.load.image('movement_sign', movementSign);

        // Preload de reroll icon
        this.load.image('reroll_icon', rerollIcon);
    }

    create() {
        const SCALE = 4;
        try {
            //PARAR música del menú
            const menuMusic = this.sound.get("menu_music");

            if (menuMusic) {
                menuMusic.stop();
            }
            // ─────────────────────────────────────────
            // CONFIG GENERAL DE LA ESCENA
            // ─────────────────────────────────────────
            this.isPlayerDead = false;
            this.playerSpawn = null;
            this.playerWeapon = 'cuchillo';
            this.positionText = null;
            this.puddles = [];
            this.currentPuddle = null;
            this.previousCheckpointBeforePuddle = null;
            this.puddleUpgradePanel = null;
            this._previousPauseButtonDown = false;
            this._pauseMenuButtons = [];
            this._pauseMenuSelectedIndex = 0;
            this._pauseMenuContext = 'pause';
            this._pauseMenuNavRepeatMs = 170;
            this._lastPauseMenuNavAt = -Infinity;
            this._pauseMenuActionHeld = false;
            this._pauseMenuBackHeld = false;

            // Limpia listeners anteriores por seguridad al reiniciar la escena
            this.input.removeAllListeners();

            // ─────────────────────────────────────────
            // MAPA
            // ─────────────────────────────────────────
            this.map = this.make.tilemap({
                key: 'level2',
                tileWidth: 16,
                tileHeight: 16
            });

            const tilesetNames = [
                'walls_floor', 'Overworld', 'dirtpath-1', 'Water_coasts_animation',
                'objects', 'doors_lever_chest_animation'
            ];
            const tilesets = tilesetNames.map(name => this.map.addTilesetImage(name, name));

            // Crear layers explícitamente igual que en MainScene
            this.baseLayer = this.map.createLayer('base', tilesets, 0, 0);
            this.baseLayer.setScale(SCALE);

            this.patrones1Layer = this.map.createLayer('Capa de patrones 1', tilesets, 0, 0);
            this.patrones1Layer.setScale(SCALE);

            this.zonasAcuaticasLayer = this.map.createLayer('Zonas aquaticas', tilesets, 0, 0);
            this.zonasAcuaticasLayer.setScale(SCALE);

            this.patrones2Layer = this.map.createLayer('Capa de patrones 2', tilesets, 0, 0);
            this.patrones2Layer.setScale(SCALE);

            this.estetica1Layer = this.map.createLayer('Objetos estéticos sin colision', tilesets, 0, 0);
            this.estetica1Layer.setScale(SCALE);

            this.zonaAcuatica2Layer = this.map.createLayer('Zona acuatica 2', tilesets, 0, 0);
            this.zonaAcuatica2Layer.setScale(SCALE);

            this.faseSegundaJefeLayer = this.map.createLayer('Fase segunda jefe', tilesets, 0, 0);
            this.faseSegundaJefeLayer.setScale(SCALE);

            this.sombreado1Layer = this.map.createLayer('Sombreado1', tilesets, 0, 0);
            this.sombreado1Layer.setScale(SCALE);

            this.colisionLayer = this.map.createLayer('Zonas con colision', tilesets, 0, 0);
            this.colisionLayer.setScale(SCALE);
            this.colisionLayer.setPosition(-16 * SCALE, 160 * SCALE);

            this.vallaLayer = this.map.createLayer('Valla', tilesets, 0, 0);
            this.vallaLayer.setScale(SCALE);

            this.sombreado2Layer = this.map.createLayer('Sombreado2', tilesets, 0, 0);
            this.sombreado2Layer.setScale(SCALE);
            this.sombreado2Layer.setDepth(200);

            this.estetica2Layer = this.map.createLayer('Objetos estéticos sin colision 2', tilesets, 0, 0);
            this.estetica2Layer.setScale(SCALE);
            this.estetica2Layer.setDepth(201);

            this.techo1Layer = this.map.createLayer('Techo1', tilesets, 0, 0);
            this.techo1Layer.setScale(SCALE);
            this.techo1Layer.setDepth(202);

            // CAPA DE HINTS (PISTAS VISUALES)
            const hintsLayer = this.map.getObjectLayer('hints');
            if (hintsLayer && hintsLayer.objects) {
                hintsLayer.objects.forEach(obj => {
                    if (obj.visible !== false) {
                        // Leer atributo personalizado 'texture'
                        let textureName = null;
                        if (obj.properties) {
                            const textureProp = obj.properties.find(p => p.name === 'texture');
                            if (textureProp) textureName = textureProp.value;
                        }

                        if (textureName && this.textures.exists(textureName)) {
                            const hint = this.add.image(obj.x * SCALE, (obj.y - obj.height) * SCALE, textureName);
                            hint.setOrigin(0, 0);
                            hint.setDisplaySize(obj.width * SCALE, obj.height * SCALE);
                            hint.setAlpha(0.7);
                            //hint.setDepth(100);
                        }
                    }
                });
            }

            const duckLayer = this.map.getObjectLayer('duck');
            if (!duckLayer || duckLayer.objects.length === 0) {
                throw new Error('Falta la capa de objetos duck o esta vacia. Debes definir el jugador desde el mapa.');
            }

            const duckObj = duckLayer.objects.find(obj => (obj.name || '').trim().toLowerCase() === 'duck');
            if (!duckObj) {
                throw new Error('Falta un objeto llamado duck dentro de la capa duck.');
            }

            this.playerSpawn = {
                x: duckObj.x * SCALE,
                y: duckObj.y * SCALE
            };

            this._applyStoredCheckpointSpawn();

            if (duckObj.properties) {
                const duckProps = {};
                duckObj.properties.forEach(p => duckProps[p.name] = p.value);
                if (Object.prototype.hasOwnProperty.call(duckProps, 'weapon')) {
                    const weaponFromMap = duckProps.weapon;

                    if (weaponFromMap === null) {
                        this.playerWeapon = 'ramita';
                    } else if (typeof weaponFromMap === 'string') {
                        const normalizedWeapon = weaponFromMap.trim().toLowerCase();
                        this.playerWeapon = normalizedWeapon === '' || normalizedWeapon === 'null'
                            ? 'ramita'
                            : normalizedWeapon;
                    } else {
                        this.playerWeapon = weaponFromMap;
                    }
                }
            }

            this._applyStoredRespawnWeapon();

            // Si esta capa es solo para colisión, marcamos colisión en todo tile no vacío.
            // Esto evita depender de propiedades "collides" en cada tile del tileset.
            if (this.colisionLayer) this.colisionLayer.setCollisionByExclusion([-1], true);
            if (this.vallaLayer) this.vallaLayer.setCollisionByExclusion([-1], true);
            if (this.zonasAcuaticasLayer) this.zonasAcuaticasLayer.setCollisionByExclusion([-1], true);

            const worldWidth = this.map.widthInPixels * SCALE;
            const worldHeight = this.map.heightInPixels * SCALE;

            this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
            this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
            // Esto es para arreglar que el dash atraviesa paredes al ir muy rapido
            this.physics.world.setFPS(120);
            this.physics.world.TILE_BIAS = Math.max(this.physics.world.TILE_BIAS, 48);

            // ─────────────────────────────────────────
            // ANIMACIONES
            // ─────────────────────────────────────────
            if (!this.anims.exists('duck-idle')) {
                this.anims.create({
                    key: 'duck-idle',
                    frames: this.anims.generateFrameNumbers('idle_duck', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (!this.anims.exists('duck-walk')) {
                this.anims.create({
                    key: 'duck-walk',
                    frames: this.anims.generateFrameNumbers('duck_walk', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (!this.anims.exists('duck-cuack')) {
                this.anims.create({
                    key: 'duck-cuack',
                    frames: this.anims.generateFrameNumbers('duck-cuack', { start: 0, end: 0 }),
                    frameRate: 8,
                    repeat: 0
                });
            }

            if (!this.anims.exists('duck-dash')) {
                this.anims.create({
                    key: 'duck-dash',
                    frames: this.anims.generateFrameNumbers('duck-dash', { start: 0, end: 3 }),
                    frameRate: 16,
                    repeat: 0
                });
            }

            if (!this.anims.exists('duck-swimming')) {
                this.anims.create({
                    key: 'duck-swimming',
                    frames: this.anims.generateFrameNumbers('duck-swimming', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (!this.anims.exists('zorro-idle') && this.textures.exists('zorro_idle')) {
                this.anims.create({
                    key: 'zorro-idle',
                    frames: this.anims.generateFrameNumbers('zorro_idle', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (!this.anims.exists('zorro-run') && this.textures.exists('zorro_run')) {
                this.anims.create({
                    key: 'zorro-run',
                    frames: this.anims.generateFrameNumbers('zorro_run', { start: 0, end: 3 }),
                    frameRate: 12,
                    repeat: -1
                });
            }

            if (!this.anims.exists('mapache-idle') && this.textures.exists('mapache_idle')) {
                this.anims.create({
                    key: 'mapache-idle',
                    frames: this.anims.generateFrameNumbers('mapache_idle', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (!this.anims.exists('mapache-run') && this.textures.exists('mapache_run')) {
                this.anims.create({
                    key: 'mapache-run',
                    frames: this.anims.generateFrameNumbers('mapache_run', { start: 0, end: 3 }),
                    frameRate: 12,
                    repeat: -1
                });
            }

            if (!this.anims.exists('cuervo-idle') && this.textures.exists('cuervo_idle')) {
                this.anims.create({
                    key: 'cuervo-idle',
                    frames: this.anims.generateFrameNumbers('cuervo_idle', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            if (!this.anims.exists('cuervo-run') && this.textures.exists('cuervo_run')) {
                this.anims.create({
                    key: 'cuervo-run',
                    frames: this.anims.generateFrameNumbers('cuervo_run', { start: 0, end: 3 }),
                    frameRate: 12,
                    repeat: -1
                });
            }

            if (!this.anims.exists('rana-idle') && this.textures.exists('rana_idle')) {
                this.anims.create({
                    key: 'rana-idle',
                    frames: this.anims.generateFrameNumbers('rana_idle', { start: 0, end: 3 }),
                    frameRate: 8,
                    repeat: -1
                });
            }

            // ─────────────────────────────────────────
            // AUDIO
            // ─────────────────────────────────────────
            this.cuackSound = this.sound.add('cuack', { volume: 1 });
            this.deathSound = this.sound.add('death_sound', { volume: 1 });

            // ─────────────────────────────────────────
            // GRUPOS
            // ─────────────────────────────────────────
            this.dropItems = this.add.group();
            this.consumableItems = this.add.group();
            this.projectiles = this.add.group();

            // ─────────────────────────────────────────
            // INPUT MANAGER
            // ─────────────────────────────────────────
            this.inputManager = new InputManager(this);
            this.wasAttackHeld = false;

            // ─────────────────────────────────────────
            // PLAYER
            // ─────────────────────────────────────────

            this.duck = new Duck(this, this.playerSpawn.x, this.playerSpawn.y, this.playerWeapon, this.inputManager);

            this._applyStoredConsumables();

            //spawner del cuervo
            this.crowSpawner = {
                holdDurationMs: 40000,
                holdStartTime: null,
                lastWeaponKey: this._getCurrentDuckWeaponKey(),
                spawnedForCurrentWeapon: false
            };

            // ─────────────────────────────────────────
            // UI
            // ─────────────────────────────────────────
            this.breadCount = 0;
            this.consumableBar = new ConsumableBar(this, this.duck, this.inputManager);
            this.enemiesKilled = 0;

            // ─────────────────────────────────────────
            // OVERLAY DE MUERTE
            // ─────────────────────────────────────────
            this.deathOverlay = this.add.container(0, 0).setScrollFactor(0).setDepth(10000);
            this.deathOverlay.setVisible(false);

            const deathBg = this.add.rectangle(
                0,
                0,
                this.scale.width,
                this.scale.height,
                0x000000,
                0.82
            ).setOrigin(0, 0);

            const deathText = this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                'YOU DIED',
                {
                    fontFamily: 'Arial Black',
                    fontSize: '72px',
                    color: '#b30000',
                    stroke: '#000000',
                    strokeThickness: 8
                }
            ).setOrigin(0.5);

            this.deathOverlay.add([deathBg, deathText]);

            // Si la ventana cambia, reajustamos overlay
            if (this._onResize) {
                this.scale.off('resize', this._onResize, this);
            }
            this._onResize = (gameSize) => {
                deathBg.setSize(gameSize.width, gameSize.height);
                deathText.setPosition(gameSize.width / 2, gameSize.height / 2);
            };
            this.scale.on('resize', this._onResize, this);

            // Limpieza segura al reiniciar/destruir la escena
            this.events.once('shutdown', () => this._cleanupScene());
            this.events.once('destroy', () => this._cleanupScene());
        } catch (err) {
            console.error('[AlcantarillasScene] Error en create():', err);
            try {
                const msg = (err && err.stack) ? err.stack : String(err);
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.left = '0';
                overlay.style.top = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.background = 'rgba(0,0,0,0.95)';
                overlay.style.color = '#fff';
                overlay.style.zIndex = '99999';
                overlay.style.padding = '20px';
                overlay.style.overflow = 'auto';
                overlay.innerText = 'Error al cargar la escena de juego:\n\n' + msg;
                document.body.appendChild(overlay);
            } catch (inner) {
                console.error('[AlcantarillasScene] Error mostrando overlay de fallo', inner);
            }

            // Intentar volver al menú para que el jugador no quede atrapado
            try { this.scene.start('MenuScene'); } catch (e) { console.error(e); }
            return;
        }

        // ─────────────────────────────────────────
        // INPUTS
        // ─────────────────────────────────────────

        this.input.on('pointerdown', (pointer) => {
            if (this.isPlayerDead || this.isPaused) return;
            if (pointer?.button !== 0) return;
            console.log('[INPUT] pointerdown — weapon:', this.duck?.weapon?.constructor?.name, '| active:', this.duck?.weapon?.active);
            if (this.duck && this.duck.weapon && this.duck.weapon.attack) {
                this.duck.weapon.attack();
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (this.isPlayerDead || this.isPaused) return;
            if (pointer?.button !== 0) return;

            console.log('[INPUT] pointerup — arma actual:', this.duck?.weapon?.constructor?.name);

            if (this.duck && this.duck.weapon && this.duck.weapon.releaseAttack) {
                this.duck.weapon.releaseAttack();
            }
        });

        // Tecla E: usada exclusivamente para recoger items de tipo 'interact' (DropMask)
        // Ahora manejada por InputManager.isInteractPressed()

        // ─────────────────────────────────────────
        // ENEMIGOS Y SPAWNS OPCIONALES
        // ─────────────────────────────────────────
        this.enemies = this.physics.add.group();

        // Crear cocodrilo boss desde Tiled
        const crocoLayer = this.map.getObjectLayer('cocodrilo');
        if (crocoLayer && crocoLayer.objects.length > 0) {
            const crocoObj = crocoLayer.objects[0];
            const croco = new Crocodile(
                this,
                crocoObj.name || 'Cocodrilo_Boss',
                crocoObj.x * SCALE,
                crocoObj.y * SCALE,
                'croco_idle',
                null
            );
            this.enemies.add(croco);
            this._wireEnemyCollisions(croco);
        }

        if (this.map.getObjectLayer('routes')) {
            this.setupEnemiesFromRoutes(SCALE);
        }

        // Spawner de coches en la carretera
        this.carSpawner = {
            enabled: false,
            lastSpawn: 0,
            interval: 2000 // ms
        };

        // Ajustes: distancia a la izquierda desde el anchor para spawnear
        this.carSpawner.spawnOffset = 900;
        // Velocidad que tendrán los coches creados (anula BASE_STATS.speed)
        this.carSpawner.carSpeed = 2200;

        if (this.map.getObjectLayer('consumables') || this.map.getObjectLayer('consummable') || this.map.getObjectLayer('consumable')) {
            this.setupConsumablesFromLayer(SCALE);
        }
        if (this.map.getObjectLayer('store')) {
            this.setupStoreFromLayer(SCALE);
        }
        if (this.map.getObjectLayer('rana')) {
            this.setupFrogFromLayer(SCALE);
        }
        if (this.map.getObjectLayer('charquito')) {
            this.setupPuddlesFromLayer(SCALE);
        }

        this.puddleUpgradePanel = new PuddleUpgradePanel(this, (puddle, upgradeId) => {
            this._onPuddleUpgradePurchase(puddle, upgradeId);
        }, (puddle) => {
            this._onPuddleClaimReward(puddle);
        });

        this.events.on('audio:event', (audioEvent) => {
            if (this.isPlayerDead) return;
            this.enemies.forEach(enemy => {
                if (enemy && !enemy.isDead?.()) {
                    enemy.onAudioEvent(audioEvent);
                }
            });
        });

        if (this.colisionLayer) this.physics.add.collider(this.duck, this.colisionLayer);
        if (this.vallaLayer) {
            this.physics.add.collider(
                this.duck,
                this.vallaLayer,
                null,
                (duck) => duck?.state !== DUCK_STATE.DASHING,
                this
            );
        }

        this.enemies.getChildren().forEach(enemy => {
            this._wireEnemyCollisions(enemy);
        });

        this.physics.add.overlap(this.projectiles, this.duck, (projectile, duck) => {
            if (this.isPlayerDead) return;
            this._onProjectileHitDuck(projectile, duck);
        });

        if (this.colisionLayer) {
            this.physics.add.collider(this.projectiles, this.colisionLayer, (projectile) => {
                if (!projectile || !projectile.active) return;
                projectile.destroy();
            });
        }

        this.cameras.main.centerOn(this.playerSpawn.x, this.playerSpawn.y);
        this.input.activePointer.worldX = this.playerSpawn.x;
        this.input.activePointer.worldY = this.playerSpawn.y;
        this.virtualPointerX = this.scale.width * 0.5;
        this.virtualPointerY = this.scale.height * 0.5;

        this._lastActiveInputMode = null;
        this.aimAssistCross = this.add.graphics();
        this.aimAssistCross.setScrollFactor(0);
        this.aimAssistCross.setDepth(10001);
        this.aimAssistCross.setVisible(false);
        this._syncActiveInputModeFeedback();

        this.createPauseMenuUI();
        this.createGuideUI();
        this.createExitConfirmUI();

        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.setupPauseInput();
    }

    update(time, delta) {
        const primaryPad = this._getPrimaryGamepad();
        const pauseButtonDown = this._isPadButtonDown(primaryPad, 9);
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc) || (pauseButtonDown && !this._previousPauseButtonDown)) {
            this._previousPauseButtonDown = pauseButtonDown;
            if (this.scene.isActive('SettingsScene')) {
                return;
            }

            if (this.guideOverlay?.visible) {
                this.closeGuide();
                this.openPauseMenu();
                return;
            }

            if (this.exitConfirmOverlay?.visible) {
                this.closeExitConfirm();
                this.openPauseMenu();
                return;
            }

            if (this.pauseOverlay?.visible) {
                this.closePauseMenu();
                return;
            }

            this.openPauseMenu();
            return;
        }

        this._previousPauseButtonDown = pauseButtonDown;

        if (this.pauseOverlay?.visible || this.guideOverlay?.visible || this.exitConfirmOverlay?.visible) {
            this.updatePauseGamepadMenu();

            if (this.isPaused && this.duck?.body) {
                this.duck.body.setVelocity(0, 0);
            }

            return;
        }

        if (this.isPlayerDead || this.isPaused) {
            if (this.isPaused && this.duck?.body) {
                this.duck.body.setVelocity(0, 0);
            }
            return;
        }

        if (this.inputManager) {
            this.inputManager.update();
        }

        this._syncActiveInputModeFeedback();

        this._updateDuckSwimmingState();
        this._updateCharquitoState();

        if (this.duck && this.duck.active) {
            const eJustDown = this.inputManager ? this.inputManager.isInteractPressed() : false;

            this.consumableItems.getChildren().forEach(item => {
                if (!item || !item.active) return;
                if (!item.isNear(this.duck, 60)) return;

                if (item.pickupType === 'auto') {
                    item.interact(this.duck);
                } else if (item.pickupType === 'interact' && eJustDown) {
                    item.interact(this.duck);
                }
            });

            if (this.store) {
                this.store.update(eJustDown);
            }

            if ((this.duck.consumables || []).some(item => item?.type === 'key')) {
                this.tryOpenNearbyClosedDoor(this.duck, true);
            }
        }

        if (this.consumableBar) {
            this.consumableBar.update();
        }

        if (this.duck && this.duck.active) {
            const pointer = this.input.activePointer;
            const camera = this.cameras.main;
            const screenW = this.scale.width;
            const screenH = this.scale.height;

            if (this.inputManager) {
                const aimInput = this.inputManager.getAimInput();
                const hasAimInput = Math.abs(aimInput.x) > 0.001 || Math.abs(aimInput.y) > 0.001;

                if (hasAimInput) {
                    const baseVirtualPointerSpeed = 1500;
                    const dt = Math.max(0, delta) / 1000;

                    const aimMagnitude = Phaser.Math.Clamp(Math.hypot(aimInput.x, aimInput.y), 0, 1);
                    const responseCurve = 0.45 + Math.pow(aimMagnitude, 1.3);
                    const virtualPointerSpeed = baseVirtualPointerSpeed * responseCurve;

                    const centerX = screenW * 0.5;
                    const centerY = screenH * 0.5;

                    let newX = this.virtualPointerX + aimInput.x * virtualPointerSpeed * dt;
                    let newY = this.virtualPointerY + aimInput.y * virtualPointerSpeed * dt;

                    const currentWeapon = this.duck?.weapon;
                    const isMeleeWeapon = currentWeapon && !currentWeapon.isRanged;

                    if (isMeleeWeapon) {
                        const maxRadius = currentWeapon.range || 250;
                        const distance = Phaser.Math.Distance.Between(newX, newY, centerX, centerY);
                        if (distance > maxRadius) {
                            const angle = Math.atan2(newY - centerY, newX - centerX);
                            newX = centerX + Math.cos(angle) * maxRadius;
                            newY = centerY + Math.sin(angle) * maxRadius;
                        }
                    } else {
                        newX = Phaser.Math.Clamp(newX, 0, screenW);
                        newY = Phaser.Math.Clamp(newY, 0, screenH);
                    }

                    this.virtualPointerX = newX;
                    this.virtualPointerY = newY;

                    if (pointer?.position?.set) {
                        pointer.position.set(this.virtualPointerX, this.virtualPointerY);
                    } else {
                        pointer.x = this.virtualPointerX;
                        pointer.y = this.virtualPointerY;
                    }
                } else {
                    this.virtualPointerX = pointer.x;
                    this.virtualPointerY = pointer.y;
                }
            }

            this._updateAimAssistCross(pointer);
            pointer.updateWorldPoint(camera);

            try {
                if (!this._isSceneTransitioning && this.puertaAbiertaLayer && this.duck) {
                    const SCALE = 4;
                    const TILE_SIZE = 16;
                    const tileX = Math.floor(this.duck.x / SCALE / TILE_SIZE);
                    const tileY = Math.floor(this.duck.y / SCALE / TILE_SIZE);

                    const tiles = this.puertaAbiertaLayer.getTilesWithin(tileX - 1, tileY - 1, 3, 3)
                        .filter(t => t && t.index !== -1);
                    if (tiles.length > 0) {
                        this._isSceneTransitioning = true;
                        this.registry.set('duckConsumables', JSON.parse(JSON.stringify(this.duck.consumables || [])));
                        const respawnWeapon = this._resolveRespawnWeaponKey();
                        this.registry.set('duckRespawnWeapon', respawnWeapon);
                        this.scene.start('AlcantarillasScene');
                        return;
                    }
                }
            } catch (e) {
                console.warn('Error comprobando puerta abierta:', e);
            }

            const deadzoneCenterX = screenW * 0.5;
            const deadzoneCenterY = screenH * 0.5;
            const deadzoneRadius = Math.min(screenW, screenH) * 0.25;
            const pointerDistanceFromCenter = Phaser.Math.Distance.Between(
                pointer.x,
                pointer.y,
                deadzoneCenterX,
                deadzoneCenterY
            );

            const isPointerInsideDeadzone = pointerDistanceFromCenter <= deadzoneRadius;

            const isPuddleCameraLocked = !!(
                this.currentPuddle &&
                !this.currentPuddle.isRemoved &&
                this.currentPuddle.getPrimaryUpgrade?.()
            );

            let targetCamX = this.duck.x;
            let targetCamY = this.duck.y;

            if (isPuddleCameraLocked) {
                targetCamX = this.duck.x + camera.width * 0.3;
            } else if (!isPointerInsideDeadzone) {
                const mouseX = pointer.worldX;
                const mouseY = pointer.worldY;

                targetCamX = this.duck.x * 0.7 + mouseX * 0.3;
                targetCamY = this.duck.y * 0.7 + mouseY * 0.3;
            }

            const currentCenterX = camera.scrollX + camera.width * 0.5;
            const currentCenterY = camera.scrollY + camera.height * 0.5;
            const cameraLerp = 0.15;

            const smoothCamX = Phaser.Math.Linear(currentCenterX, targetCamX, cameraLerp);
            const smoothCamY = Phaser.Math.Linear(currentCenterY, targetCamY, cameraLerp);

            camera.centerOn(smoothCamX, smoothCamY);
        }

        const attackHeld = !!(
            this.inputManager &&
            this.inputManager.isAttackPressed() &&
            this.duck &&
            this.duck.active &&
            this.duck.weapon
        );

        if (
            attackHeld
        ) {
            this.duck.weapon.attack();
        }

        if (!attackHeld && this.wasAttackHeld && this.duck && this.duck.active && this.duck.weapon?.releaseAttack) {
            this.duck.weapon.releaseAttack();
        }

        this.wasAttackHeld = attackHeld;

        this._updateCrowSpawnTimer(time);

        if (this.carSpawner?.enabled) this._updateCarSpawner(time);

        if (this.duck && this.duck.active) {
            this.enemies.getChildren().forEach(enemy => {
                if (!enemy || !enemy.active || enemy.isDead?.()) return;

                if (typeof enemy.updateAwareness === 'function') {
                    enemy.updateAwareness(this.duck, time);
                }
            });
        }
    }

    _getActiveInputMode() {
        return this.registry?.get('activeInputMode') || 'keyboard';
    }

    _syncActiveInputModeFeedback() {
        const activeInputMode = this._getActiveInputMode();

        if (activeInputMode === this._lastActiveInputMode) return;

        this._lastActiveInputMode = activeInputMode;

        if (this.input?.setDefaultCursor) {
            this.input.setDefaultCursor(activeInputMode === 'gamepad' ? 'none' : 'default');
        }

        if (this.aimAssistCross) {
            this.aimAssistCross.setVisible(activeInputMode === 'gamepad');
        }
    }

    _updateAimAssistCross(pointer) {
        if (!this.aimAssistCross) return;

        const activeInputMode = this._getActiveInputMode();
        const isGamepadMode = activeInputMode === 'gamepad';

        this.aimAssistCross.setVisible(isGamepadMode);
        if (!isGamepadMode || !pointer) return;

        this.aimAssistCross.clear();
        this.aimAssistCross.setPosition(pointer.x, pointer.y);

        this.aimAssistCross.lineStyle(3, 0x5a0000, 0.22);
        this.aimAssistCross.strokeCircle(0, 0, 8);
        this.aimAssistCross.lineStyle(2, 0xff3b3b, 0.78);
        this.aimAssistCross.strokeCircle(0, 0, 14);
        this.aimAssistCross.lineStyle(10, 0x5a0000, 0.22);
        this.aimAssistCross.beginPath();
        this.aimAssistCross.moveTo(-25, 0);
        this.aimAssistCross.lineTo(25, 0);
        this.aimAssistCross.moveTo(0, -25);
        this.aimAssistCross.lineTo(0, 25);
        this.aimAssistCross.strokePath();
        this.aimAssistCross.lineStyle(5, 0xff3b3b, 0.78);
        this.aimAssistCross.beginPath();
        this.aimAssistCross.moveTo(-23, 0);
        this.aimAssistCross.lineTo(23, 0);
        this.aimAssistCross.moveTo(0, -23);
        this.aimAssistCross.lineTo(0, 23);
        this.aimAssistCross.strokePath();
        this.aimAssistCross.fillStyle(0xff5555, 0.85);
        this.aimAssistCross.fillCircle(0, 0, 4);
    }

    _updateDuckSwimmingState() {
        if (!this.duck || !this.duck.active) return;

        const tileSize = 16 * 4;
        const tileX = Math.floor(this.duck.x / tileSize);
        const tileY = Math.floor(this.duck.y / tileSize);

        // Verificar ambas capas de agua: Zonas acuaticas y Zona acuatica 2
        const waterTile = this.zonasAcuaticasLayer?.getTileAt(tileX, tileY) || this.zonaAcuatica2Layer?.getTileAt(tileX, tileY);
        const isInWater = !!waterTile;

        if (isInWater) {
            if (this.duck.state !== DUCK_STATE.SWIMMING && this.duck.state !== DUCK_STATE.DASHING) {
                this.duck.setState(DUCK_STATE.SWIMMING);
            }
            return;
        }

        if (this.duck.state === DUCK_STATE.SWIMMING) {
            this.duck.setState(DUCK_STATE.IDLE);
        }
    }

    _getCurrentCheckpointData() {
        const checkpoint = this.registry?.get('duckCheckpointSpawn');
        const checkpointX = Number(checkpoint?.x);
        const checkpointY = Number(checkpoint?.y);

        if (Number.isFinite(checkpointX) && Number.isFinite(checkpointY)) {
            return {
                x: checkpointX,
                y: checkpointY,
                puddleName: checkpoint?.puddleName || ''
            };
        }

        const spawnX = Number(this.playerSpawn?.x);
        const spawnY = Number(this.playerSpawn?.y);
        if (!Number.isFinite(spawnX) || !Number.isFinite(spawnY)) return null;

        return {
            x: spawnX,
            y: spawnY,
            puddleName: ''
        };
    }

    _restoreCheckpoint(checkpointData) {
        if (!checkpointData) return;

        const checkpointX = Number(checkpointData.x);
        const checkpointY = Number(checkpointData.y);
        if (!Number.isFinite(checkpointX) || !Number.isFinite(checkpointY)) return;

        this.playerSpawn = { x: checkpointX, y: checkpointY };

        this.registry?.set('duckCheckpointSpawn', {
            x: checkpointX,
            y: checkpointY,
            puddleName: checkpointData.puddleName || ''
        });

        if (this.duck?.setCheckpoint) {
            this.duck.setCheckpoint({
                x: checkpointX,
                y: checkpointY,
                puddleName: checkpointData.puddleName || ''
            });
        }
    }

    _applyStoredCheckpointSpawn() {
        const checkpoint = this.registry?.get('duckCheckpointSpawn');
        if (!checkpoint) return;

        const checkpointX = Number(checkpoint.x);
        const checkpointY = Number(checkpoint.y);
        if (!Number.isFinite(checkpointX) || !Number.isFinite(checkpointY)) return;

        this.playerSpawn = { x: checkpointX, y: checkpointY };
    }

    _applyStoredRespawnWeapon() {
        const storedWeapon = this.registry?.get('duckRespawnWeapon');
        if (typeof storedWeapon !== 'string') return;

        const normalizedWeapon = storedWeapon.trim().toLowerCase();
        if (!normalizedWeapon) return;

        const allowedWeapons = new Set(['arco', 'mcuaktro', 'cuchillo', 'mazo', 'ramita', 'escoba']);
        if (!allowedWeapons.has(normalizedWeapon)) return;

        this.playerWeapon = normalizedWeapon;
    }

    _applyStoredConsumables() {
        const storedConsumables = this.registry?.get('duckConsumables');
        if (!Array.isArray(storedConsumables)) return;

        this.duck.consumables = JSON.parse(JSON.stringify(storedConsumables));
    }

    _setCheckpointFromPuddle(puddle) {
        const spawnPoint = puddle?.getSpawnPoint?.();
        if (!spawnPoint) return;

        const spawnX = Number(spawnPoint.x);
        const spawnY = Number(spawnPoint.y);
        if (!Number.isFinite(spawnX) || !Number.isFinite(spawnY)) return;

        this.playerSpawn = { x: spawnX, y: spawnY };

        this.registry?.set('duckCheckpointSpawn', {
            x: spawnX,
            y: spawnY,
            puddleName: puddle?.name || ''
        });

        if (this.duck?.setCheckpoint) {
            this.duck.setCheckpoint({
                x: spawnX,
                y: spawnY,
                puddleName: puddle?.name || ''
            });
        }
    }

    _getCurrentDuckWeaponKey() {
        return this.duck?.weapon?.texture?.key ?? null;
    }

    _resolveRespawnWeaponKey() {
        const weapon = this.duck?.weapon;
        if (!weapon) return 'ramita';

        const byConstructorName = {
            arco: 'arco',
            mcuaktro: 'mcuaktro',
            cuchillo: 'cuchillo',
            mazo: 'mazo',
            ramita: 'ramita',
            escoba: 'escoba'
        };

        const constructorName = String(weapon.constructor?.name || '').trim().toLowerCase();
        if (byConstructorName[constructorName]) return byConstructorName[constructorName];

        const textureKey = String(weapon?.texture?.key || '').trim().toLowerCase();
        if (byConstructorName[textureKey]) return byConstructorName[textureKey];

        return 'ramita';
    }

    _updateCharquitoState() {
        if (!this.duck || !this.duck.active || !Array.isArray(this.puddles) || this.puddles.length === 0) return;

        const puddle = this.puddles.find(charco => charco?.containsDuck?.(this.duck)) || null;

        if (!puddle) {
            this.currentPuddle = null;
            this.puddleUpgradePanel?.hide();
            return;
        }

        if (this.currentPuddle !== puddle) {
            if (!puddle.getCheckpointBackup?.()) {
                puddle.setCheckpointBackup?.(this._getCurrentCheckpointData());
            }

            this.previousCheckpointBeforePuddle = puddle.getCheckpointBackup?.() || null;
            this.currentPuddle = puddle;
            this._setCheckpointFromPuddle(puddle);
            this.puddleUpgradePanel?.show(puddle, this.duck);
        } else {
            this.puddleUpgradePanel?.update(this.duck);
        }

        if (this.duck.state !== DUCK_STATE.SWIMMING && this.duck.state !== DUCK_STATE.DASHING) {
            this.duck.setState(DUCK_STATE.SWIMMING);
        }
    }

    setupPuddlesFromLayer(scale) {
        const puddleLayer = this.map.getObjectLayer('charquito');

        this.puddles = [];

        if (!puddleLayer || !Array.isArray(puddleLayer.objects) || puddleLayer.objects.length === 0) {
            console.log('[AlcantarillasScene] No se encontró la capa "charquito" o está vacía.');
            return;
        }

        puddleLayer.objects.forEach((obj, index) => {
            if (!Array.isArray(obj.polygon) || obj.polygon.length < 3) {
                return;
            }

            const points = obj.polygon.map(point => ({
                x: (obj.x + point.x) * scale,
                y: (obj.y + point.y) * scale
            }));

            const puddle = new Puddle(this, points, obj.name || `charco_${index + 1}`);
            this.puddles.push(puddle);
        });

        console.log(`[AlcantarillasScene] Capa charquito encontrada con ${this.puddles.length} charco(s).`);
    }

    _updateCrowSpawnTimer(time) {
        if (!this.carSpawner?.enabled || !this.carreteraLayer) return;
        const now = time ?? (this.time?.now ?? Date.now());
        if (now < (this.carSpawner.lastSpawn || 0) + (this.carSpawner.interval || 2000)) return;
        this.carSpawner.lastSpawn = now;
    }

    _removePuddle(puddle) {
        if (!Array.isArray(this.puddles)) return;
        this.puddles = this.puddles.filter(existing => existing && existing !== puddle);
        puddle?.destroy?.();
    }

    _onPuddleUpgradePurchase(puddle, upgradeId) {
        if (!puddle || !this.duck) return;

        const purchase = puddle.purchaseUpgrade?.(this.duck, upgradeId);
        const success = !!purchase?.success;
        let purchaseMessage = purchase?.message || '';
        if (success) {
            const spentFeathers = Number(purchase?.spentFeathers) || 0;
            const remainingFeathers = Number(purchase?.remainingFeathers);
            if (Number.isFinite(remainingFeathers)) {
                purchaseMessage = `${purchaseMessage} (-${spentFeathers} feather, left: ${remainingFeathers})`;
            }
        }

        this.puddleUpgradePanel?.showPurchaseResult(success, purchaseMessage);
    }

    _onPuddleClaimReward(puddle) {
        if (!puddle || !this.duck) return;

        const rewardFeathers = 2;
        this.duck.addFeather?.(rewardFeathers);

        const checkpointToRestore = puddle.getCheckpointBackup?.() || this.previousCheckpointBeforePuddle;
        this._restoreCheckpoint(checkpointToRestore);

        this._removePuddle(puddle);
        this.previousCheckpointBeforePuddle = null;
        if (this.currentPuddle === puddle) this.currentPuddle = null;

        this.puddleUpgradePanel?.hide();
        this.puddleUpgradePanel?.showPurchaseResult(true, `Reward claimed! (+${rewardFeathers} feathers)`);
    }

    _wireEnemyCollisions(enemy) {
        if (!enemy) return;

        this.physics.add.collider(
            this.duck,
            enemy,
            null,
            (duck) => duck?.state !== DUCK_STATE.DASHING,
            this
        );

        if (!enemy.ignoresObstacleHitbox) {
            if (this.colisionLayer) this.physics.add.collider(enemy, this.colisionLayer);
            if (this.vallaLayer) this.physics.add.collider(enemy, this.vallaLayer);
            if (this.zonasAcuaticasLayer) this.physics.add.collider(enemy, this.zonasAcuaticasLayer);
        }

        this.physics.add.overlap(this.projectiles, enemy, (projectile, en) => {
            if (this.isPlayerDead) return;
            this._onProjectileHitEnemy(projectile, en);
        });

        this.physics.add.overlap(this.duck, enemy, (duck, en) => {
            if (this.isPlayerDead) return;
            this._onEnemyHitDuck(duck, en);
        });
    }

    _onProjectileHitEnemy(projectile, enemy) {
        if (this.isPlayerDead) return;
        if (!projectile || !enemy) return;
        if (!projectile.active || !enemy.active) return;
        if (enemy.isDead && enemy.isDead()) return;

        if (projectile.team && enemy.team && projectile.team === enemy.team) return;

        if (projectile.hitEnemies) {
            if (projectile.hitEnemies.has(enemy)) return;
            projectile.hitEnemies.add(enemy);
        }

        const damage = projectile.damage ?? 1;
        enemy.takeDamage(damage);
        projectile.owner?.weapon?.onHitTarget?.(enemy);

        if (!projectile.piercing) {
            projectile.destroy();
        }
    }

    _onEnemyHitDuck(duck, enemy) {
        if (this.isPlayerDead) return;
        if (!duck || !enemy) return;
        if (!duck.active || !enemy.active) return;
        if (enemy.isDead && enemy.isDead()) return;
        if (duck.state === DUCK_STATE.DASHING) return;
        if (duck.isInvulnerable) return;
    }

    _onProjectileHitDuck(projectile, duck) {
        if (this.isPlayerDead) return;
        if (!projectile || !duck) return;
        if (!projectile.active || !duck.active) return;
        if (duck.state === DUCK_STATE.DASHING) return;
        if (projectile.team && duck.team && projectile.team === duck.team) return;
    }

    setupPauseInput() {
        if (this._guideWheelHandler) {
            this.input.off('wheel', this._guideWheelHandler, this);
        }

        this._guideWheelHandler = (pointer, gameObjects, deltaX, deltaY) => {
            if (!this.guideOverlay || !this.guideOverlay.visible || !this.guideContent) return;

            this.guideScrollY = Phaser.Math.Clamp(
                this.guideScrollY - deltaY * 0.6,
                this.guideMinScrollY,
                this.guideMaxScrollY
            );
            this.guideContent.y = this.guideScrollY;
        };

        this.input.on('wheel', this._guideWheelHandler, this);
    }

    createPauseMenuUI() {
        const W = this.scale.width;
        const H = this.scale.height;

        this._pauseObjects = [];

        const bg = this.add.rectangle(0, 0, W, H, 0x000000, 0.65)
            .setOrigin(0, 0).setScrollFactor(0).setDepth(20000);

        const panel = this.add.rectangle(W / 2, H / 2, 430, 340, 0x1e1b18, 0.96)
            .setStrokeStyle(4, 0xe6d3a3, 1).setScrollFactor(0).setDepth(20001);

        const title = this.add.text(W / 2, H / 2 - 110, 'PAUSA', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '42px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20002);

        const makeButton = (x, y, text, callback) => {
            const buttonBg = this.add.rectangle(x, y, 260, 58, 0x000000, 0.45)
                .setStrokeStyle(3, 0xffffff, 0.85)
                .setScrollFactor(0).setDepth(20002)
                .setInteractive({ useHandCursor: true });

            const buttonText = this.add.text(x, y, text, {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '28px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 5
            }).setOrigin(0.5).setScrollFactor(0).setDepth(20003)
                .setInteractive({ useHandCursor: true });

            const hoverOn = () => {
                buttonBg.setFillStyle(0x222222, 0.75);
                buttonBg.setScale(1.03);
                buttonText.setScale(1.03);
            };

            const hoverOff = () => {
                buttonBg.setFillStyle(0x000000, 0.45);
                buttonBg.setScale(1);
                buttonText.setScale(1);
            };

            buttonBg.on('pointerover', hoverOn);
            buttonText.on('pointerover', hoverOn);
            buttonBg.on('pointerout', hoverOff);
            buttonText.on('pointerout', hoverOff);
            buttonBg.on('pointerup', () => callback());
            buttonText.on('pointerup', () => callback());

            return [buttonBg, buttonText];
        };

        const settingsBtn = makeButton(W / 2, H / 2 - 20, 'AJUSTES', () => {
            this.openSettingsFromPause();
        });

        const guideBtn = makeButton(W / 2, H / 2 + 55, 'GUÍA', () => {
            this.openGuide();
        });

        const exitBtn = makeButton(W / 2, H / 2 + 130, 'SALIR', () => {
            this.openExitConfirm();
        });

        this._pauseObjects = [bg, panel, title, ...settingsBtn, ...guideBtn, ...exitBtn];
        this._pauseMenuButtons = [
            { bg: settingsBtn[0], text: settingsBtn[1], onClick: () => this.openSettingsFromPause() },
            { bg: guideBtn[0], text: guideBtn[1], onClick: () => this.openGuide() },
            { bg: exitBtn[0], text: exitBtn[1], onClick: () => this.openExitConfirm() }
        ];

        this.pauseOverlay = {
            setVisible: (v) => this._pauseObjects.forEach(o => o.setVisible(v)),
            get visible() { return bg.visible; }
        };

        this._pauseObjects.forEach(o => o.setVisible(false));
        this._pauseMenuSelectedIndex = 0;
        this._refreshPauseMenuSelection();

        this._pauseResizeHandler = (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;

            bg.setSize(w, h);
            panel.setPosition(w / 2, h / 2);
            title.setPosition(w / 2, h / 2 - 110);

            settingsBtn[0].setPosition(w / 2, h / 2 - 20);
            settingsBtn[1].setPosition(w / 2, h / 2 - 20);

            guideBtn[0].setPosition(w / 2, h / 2 + 55);
            guideBtn[1].setPosition(w / 2, h / 2 + 55);

            exitBtn[0].setPosition(w / 2, h / 2 + 130);
            exitBtn[1].setPosition(w / 2, h / 2 + 130);
        };

        this.scale.on('resize', this._pauseResizeHandler, this);
    }

    _getPrimaryGamepad() {
        if (!this.input?.gamepad) return null;

        const gamepads = this.input.gamepad.getAll();
        if (!gamepads || gamepads.length === 0) return null;

        return gamepads.find((pad) => pad && pad.connected) || gamepads[0];
    }

    _getPadAxis(pad, axisIndex) {
        if (!pad || !Array.isArray(pad.axes) || !pad.axes[axisIndex]) return 0;

        const axis = pad.axes[axisIndex];
        if (typeof axis.getValue === 'function') return axis.getValue();
        if (typeof axis.value === 'number') return axis.value;
        return 0;
    }

    _isPadButtonDown(pad, buttonIndex) {
        if (!pad || !pad.buttons || !pad.buttons[buttonIndex]) return false;

        const button = pad.buttons[buttonIndex];
        return !!(button.pressed || (typeof button.value === 'number' && button.value > 0.5));
    }

    _getPauseMenuButtonsForCurrentContext() {
        if (this._pauseMenuContext === 'exit') {
            return this._exitMenuButtons ?? [];
        }

        return this._pauseMenuButtons ?? [];
    }

    _refreshPauseMenuSelection() {
        const buttons = this._getPauseMenuButtonsForCurrentContext();

        buttons.forEach((button, index) => {
            if (!button?.bg || !button?.text) return;

            const selected = index === this._pauseMenuSelectedIndex;
            button.bg.setFillStyle(selected ? 0x222222 : 0x000000, selected ? 0.75 : 0.45);
            button.bg.setScale(selected ? 1.03 : 1);
            button.text.setScale(selected ? 1.03 : 1);
            button.text.setStroke('#000000', selected ? 7 : 5);
            button.text.setShadow(selected ? 3 : 2, selected ? 3 : 2, '#000000', selected ? 4 : 2, true, true);
        });
    }

    _movePauseMenuSelection(delta) {
        const buttons = this._getPauseMenuButtonsForCurrentContext();
        if (!buttons.length) return;

        this._pauseMenuSelectedIndex = (this._pauseMenuSelectedIndex + delta + buttons.length) % buttons.length;
        this._refreshPauseMenuSelection();
    }

    updatePauseGamepadMenu() {
        const pad = this._getPrimaryGamepad();
        if (!pad) {
            this._pauseMenuActionHeld = false;
            this._pauseMenuBackHeld = false;
            this._lastPauseMenuNavAt = -Infinity;
            return;
        }

        const now = this.time.now;
        const deadzone = 0.35;
        const leftY = this._getPadAxis(pad, 1);
        const dpadUp = this._isPadButtonDown(pad, 12);
        const dpadDown = this._isPadButtonDown(pad, 13);
        const confirmPressed = this._isPadButtonDown(pad, 0);
        const backPressed = this._isPadButtonDown(pad, 1);
        const navUp = leftY < -deadzone || dpadUp;
        const navDown = leftY > deadzone || dpadDown;
        const buttons = this._getPauseMenuButtonsForCurrentContext();

        if (buttons.length && now - this._lastPauseMenuNavAt >= this._pauseMenuNavRepeatMs) {
            if (navUp && !navDown) {
                this._movePauseMenuSelection(-1);
                this._lastPauseMenuNavAt = now;
            } else if (navDown && !navUp) {
                this._movePauseMenuSelection(1);
                this._lastPauseMenuNavAt = now;
            }
        }

        if (this._pauseMenuContext === 'guide') {
            if (backPressed && !this._pauseMenuBackHeld) {
                this.closeGuide();
                this.openPauseMenu();
            }
            this._pauseMenuBackHeld = backPressed;
            this._pauseMenuActionHeld = confirmPressed;
            return;
        }

        if (this._pauseMenuContext === 'exit') {
            const navLeft = this._isPadButtonDown(pad, 14);
            const navRight = this._isPadButtonDown(pad, 15);

            if (now - this._lastPauseMenuNavAt >= this._pauseMenuNavRepeatMs) {
                if (navLeft && !navRight) {
                    this._movePauseMenuSelection(-1);
                    this._lastPauseMenuNavAt = now;
                } else if (navRight && !navLeft) {
                    this._movePauseMenuSelection(1);
                    this._lastPauseMenuNavAt = now;
                }
            }

            if (backPressed && !this._pauseMenuBackHeld) {
                this.closeExitConfirm();
                this.openPauseMenu();
                this._pauseMenuBackHeld = backPressed;
                this._pauseMenuActionHeld = confirmPressed;
                return;
            }

            if (confirmPressed && !this._pauseMenuActionHeld) {
                const button = buttons[this._pauseMenuSelectedIndex] ?? buttons[0];
                button?.onClick?.();
            }

            this._pauseMenuActionHeld = confirmPressed;
            this._pauseMenuBackHeld = backPressed;
            return;
        }

        if (backPressed && !this._pauseMenuBackHeld) {
            this.closePauseMenu();
            this._pauseMenuBackHeld = backPressed;
            this._pauseMenuActionHeld = confirmPressed;
            return;
        }

        if (confirmPressed && !this._pauseMenuActionHeld) {
            const button = buttons[this._pauseMenuSelectedIndex] ?? buttons[0];
            button?.onClick?.();
        }

        this._pauseMenuActionHeld = confirmPressed;
        this._pauseMenuBackHeld = backPressed;
    }

    createGuideUI() {
        const W = this.scale.width;
        const H = this.scale.height;

        this._guideObjects = [];

        const bg = this.add.rectangle(0, 0, W, H, 0x000000, 0.78)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(20010);

        const parchment = this.add.rectangle(W / 2, H / 2, 820, 580, 0xf0dfa8, 0.98)
            .setStrokeStyle(6, 0x6a4b1f, 1)
            .setScrollFactor(0)
            .setDepth(20011);

        const title = this.add.text(W / 2, H / 2 - 268, 'GUÍA DEL DUCKLER', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '36px',
            color: '#3a2412',
            stroke: '#f5e6c8',
            strokeThickness: 2
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(20012);

        const closeButton = this.add.rectangle(W / 2, H / 2 + 255, 120, 42, 0x3a2412, 0.85)
            .setStrokeStyle(3, 0xe4c46a, 1)
            .setScrollFactor(0)
            .setDepth(20012)
            .setInteractive({ useHandCursor: true });

        const closeText = this.add.text(W / 2, H / 2 + 255, 'ATRÁS', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '22px',
            color: '#f4d97b',
            stroke: '#000000',
            strokeThickness: 4
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(20013)
            .setInteractive({ useHandCursor: true });

        const viewportW = 760;
        const viewportH = 460;
        const viewportX = W / 2 - viewportW / 2;
        const viewportY = H / 2 - 230;

        const maskShape = this.add.graphics().setScrollFactor(0).setVisible(false);
        maskShape.fillStyle(0xffffff, 1);
        maskShape.fillRect(viewportX, viewportY, viewportW, viewportH);

        this.guideContent = this.add.container(viewportX + 16, viewportY + 8)
            .setScrollFactor(0)
            .setDepth(20012);

        this.guideContent.setMask(maskShape.createGeometryMask());

        const guideItems = [];
        let currentY = 0;
        const CONTENT_W = viewportW - 32;
        const fontSize = this.currentFontSize ?? 22;

        const addToGuide = (obj) => {
            obj.setScrollFactor(0);
            guideItems.push(obj);
            return obj;
        };

        const addHeader = (text) => {
            const headerBg = addToGuide(this.add.rectangle(0, currentY, CONTENT_W, 36, 0x5a3a10, 0.85).setOrigin(0, 0));
            const headerText = addToGuide(this.add.text(10, currentY + 4, text, {
                fontFamily: 'ReturnOfTheBoss', fontSize: '22px', color: '#f4d97b', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0, 0));
            currentY += 44;
        };

        const addEntry = (name, description, textureKey = null, isSheet = false, imgScale = 3, offsetX = 0, offsetY = 0) => {
            const rowH = 90;
            const imgColW = 90;
            const textX = textureKey ? imgColW + 8 : 0;
            const textW = CONTENT_W - textX - 8;

            const rowBg = addToGuide(this.add.rectangle(0, currentY, CONTENT_W, rowH, 0x000000, 0.07).setOrigin(0, 0));

            if (textureKey && this.textures.exists(textureKey)) {
                const posX = (imgColW / 2) + offsetX;
                const posY = currentY + (rowH / 2) + offsetY;

                let img;
                if (isSheet) {
                    img = this.add.sprite(posX, posY, textureKey, 0).setOrigin(0.5).setScale(imgScale);
                } else {
                    img = this.add.image(posX, posY, textureKey).setOrigin(0.5).setScale(imgScale);
                }
                addToGuide(img);
            }

            const nameText = addToGuide(this.add.text(textX, currentY + 8, name, {
                fontFamily: 'Arial Black', fontSize: '17px', color: '#3a2412', stroke: '#f0dfa8', strokeThickness: 1, wordWrap: { width: textW }
            }).setOrigin(0, 0));

            const descText = addToGuide(this.add.text(textX, currentY + 30, description, {
                fontFamily: 'Arial', fontSize: `${fontSize}px`, color: '#2e1e10', wordWrap: { width: textW }, lineSpacing: 2
            }).setOrigin(0, 0));

            const actualH = Math.max(rowH, nameText.height + descText.height + 24);
            rowBg.setSize(CONTENT_W, actualH);
            currentY += actualH + 4;
        };

        const addTextEntry = (name, description) => addEntry(name, description, null);

        addHeader('❤️  RECURSOS — VIDA Y MONEDA');
        addEntry('Plumas — TUS VIDAS', 'Las plumas son la vida del pato. Cada golpe que recibes te quita plumas. Si se agotan, el pato muere. Recógelas del suelo (caen de enemigos derrotados) y gástalas en mejoras de los charcos.', 'feather_icon', false, 0.12, 0, 20);
        addEntry('Pan — LA MONEDA', 'El pan es la moneda del juego. Úsalo para comprar armas, pociones y objetos especiales en la tienda. Recoge todo el pan que veas por el escenario.', 'bread_item', false, 4, 0, 0);

        addHeader('⚔️  ARMAS DE MELÉ');
        addEntry('Ramita', 'El arma inicial. Daño muy bajo pero ataque rápido. Cámbiala en cuanto encuentres algo mejor.', null);
        addEntry('Cuchillo', 'Arma equilibrada. Buen daño y velocidad de ataque. Ideal para el combate cuerpo a cuerpo ágil.', null);
        addEntry('Escoba', 'Algo más de alcance que el cuchillo. Buena para mantener a los enemigos a distancia mientras atacas.', null);
        addEntry('Mazo', 'Daño alto pero golpe lento. Úsalo contra enemigos con mucha vida o cuando necesites un golpe contundente.', null);

        addHeader('🏹  ARMAS DE DISTANCIA');
        addEntry('Arco', 'Dispara flechas hacia el cursor. Mantén pulsado el botón para cargar un disparo más potente. Bueno contra enemigos rápidos.', null);
        addEntry('Mcuaktro', 'Metralleta de balas rápidas. Alta cadencia de fuego. Arrasa con grupos de enemigos pero gasta munición deprisa.', null);

        addHeader('🧪  CONSUMIBLES');
        addEntry('Poción de ataque', 'Duplica tu daño durante 30 segundos. Úsala justo antes de un jefe o una horda de enemigos.', 'attack_potion', false, 3.2, 0, 0);
        addEntry('Poción de velocidad', 'Duplica tu velocidad de movimiento durante 15 segundos. Perfecta para huir, reposicionarte o explorar rápido.', 'speed_potion', false, 3.2, 0, 0);
        addEntry('Poción velocidad de ataque', 'Reduce a la mitad el tiempo entre ataques durante 20 segundos. Letal combinada con el arco o la metralleta.', 'speed_attack_potion', false, 3.2, 0, 0);
        addEntry('Cola de zorro', 'Genera un aura invisible que destruye todos los proyectiles enemigos cercanos durante 8 segundos. Imprescindible contra el cocodrilo.', 'fox_tail', false, 0.12, 0, 0);
        addEntry('Máscara', 'Te vuelve invisible a los enemigos. Los que te perseguían perderán el rastro. Muy útil para escapar de situaciones complicadas.', 'mask_icon', false, 3, 0, 0);
        addEntry('Llave', 'Abre puertas cerradas. Acércate a una puerta con la llave en el inventario y se abrirá sola. Úsala para acceder a zonas secretas.', null);

        addHeader('👾  ENEMIGOS');
        addEntry('Zorro', 'Rápido y ágil. Persigue al pato en línea recta. Poco HP. Usa el dash para esquivarlo y atácalo por la espalda.', 'zorro_idle', true, 2.9, 0, 0);
        addEntry('Mapache', 'Más lento que el zorro pero más resistente. A veces se detiene y te tira objetos. Mantén la distancia.', 'mapache_idle', true, 2.9, 0, 0);
        addEntry('Cuervo', 'Aparece si llevas demasiado tiempo con la misma arma sin cambiarla. Vuela por encima de obstáculos. Cambia de arma para evitar que aparezca.', 'cuervo_idle', true, 2.9, 0, 10);
        addEntry('Rana', 'Se queda quieta y de repente da saltos enormes. Muy difícil de predecir. Atácala cuando esté posada en el suelo.', 'rana_idle', true, 2.5, 0, 0);
        addEntry('Cocodrilo — JEFE', 'El boss del nivel. Se sumerge en el agua y ataca desde debajo lanzando burbujas. Atácalo cuando emerja. La Cola de Zorro destruye sus proyectiles.', 'croco_idle', false, 1, 0, 10);

        addHeader('💧  CHARCOS Y AGUA');
        addTextEntry('Natación', 'Entrar en agua activa el modo natación: te mueves más lento pero puedes sumergirte para esquivar ataques. Útil contra el cocodrilo.');
        addTextEntry('Mejoras de charco', 'Algunos charcos tienen mejoras desbloqueables a cambio de plumas. Interactúa con ellos pulsando E para ver las opciones disponibles.');

        addHeader('🏪  TIENDA');
        addTextEntry('Cómo comprar', 'Acércate al tendero y pulsa E para abrir la tienda. Puedes comprar armas, pociones y objetos especiales a cambio de pan. Los objetos rotan, así que vuelve a visitarla.');

        this.guideContent.add(guideItems);
        const contentHeight = currentY + 30;
        this.guideMaxScrollY = viewportY + 8;
        this.guideMinScrollY = Math.min(this.guideMaxScrollY, viewportY + viewportH - contentHeight);
        this.guideScrollY = this.guideMaxScrollY;
        this.guideContent.y = this.guideScrollY;

        const scrollHint = this.add.text(W / 2, H / 2 + 310, '▲▼ Rueda del ratón para hacer scroll', {
            fontFamily: 'ReturnOfTheBoss', fontSize: '18px', color: '#f4d97b', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20012);

        const goBack = () => { this.closeGuide(); this.openPauseMenu(); };
        closeButton.on('pointerup', goBack);
        closeText.on('pointerup', goBack);

        this._guideObjects = [bg, parchment, title, closeButton, closeText, this.guideContent, scrollHint];

        this.guideOverlay = {
            setVisible: (v) => {
                this._guideObjects.forEach(o => o.setVisible(v));
                if (v) { this.guideScrollY = this.guideMaxScrollY; this.guideContent.y = this.guideScrollY; }
            },
            get visible() { return bg.visible; }
        };

        this._guideObjects.forEach(o => o.setVisible(false));

        if (this._guideWheelHandler) this.input.off('wheel', this._guideWheelHandler, this);
        this._guideWheelHandler = (pointer, gameObjects, deltaX, deltaY) => {
            if (!this.guideOverlay?.visible) return;
            this.guideScrollY = Phaser.Math.Clamp(this.guideScrollY - deltaY * 0.6, this.guideMinScrollY, this.guideMaxScrollY);
            this.guideContent.y = this.guideScrollY;
        };
        this.input.on('wheel', this._guideWheelHandler, this);

        this._guideResizeHandler = (gameSize) => {
            const { width: w, height: h } = gameSize;
            bg.setSize(w, h);
            parchment.setPosition(w / 2, h / 2);
            title.setPosition(w / 2, h / 2 - 268);
            closeButton.setPosition(w / 2, h / 2 + 255);
            closeText.setPosition(w / 2, h / 2 + 255);
            scrollHint.setPosition(w / 2, h / 2 + 310);
        };
        this.scale.on('resize', this._guideResizeHandler, this);
    }

    createExitConfirmUI() {
        const W = this.scale.width;
        const H = this.scale.height;

        this._exitObjects = [];

        const bg = this.add.rectangle(0, 0, W, H, 0x000000, 0.72)
            .setOrigin(0, 0).setScrollFactor(0).setDepth(20020);

        const panel = this.add.rectangle(W / 2, H / 2, 540, 260, 0x23170f, 0.98)
            .setStrokeStyle(4, 0xe6d3a3, 1).setScrollFactor(0).setDepth(20021);

        const title = this.add.text(W / 2, H / 2 - 60, '¿SEGURO QUE QUIERES SALIR?', {
            fontFamily: 'ReturnOfTheBoss',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center',
            wordWrap: { width: 460 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20022);

        const desc = this.add.text(W / 2, H / 2 - 5, 'Se perderán todos los avances no guardados.', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#f3e6d0',
            align: 'center',
            wordWrap: { width: 430 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20022);

        const makeButton = (x, y, text, callback) => {
            const buttonBg = this.add.rectangle(x, y, 180, 56, 0x000000, 0.45)
                .setStrokeStyle(3, 0xffffff, 0.85)
                .setScrollFactor(0).setDepth(20022)
                .setInteractive({ useHandCursor: true });

            const buttonText = this.add.text(x, y, text, {
                fontFamily: 'ReturnOfTheBoss',
                fontSize: '24px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setScrollFactor(0).setDepth(20023)
                .setInteractive({ useHandCursor: true });

            buttonBg.on('pointerup', callback);
            buttonText.on('pointerup', callback);

            return [buttonBg, buttonText];
        };

        const acceptBtn = makeButton(W / 2 - 110, H / 2 + 75, 'ACEPTAR', () => {
            this.confirmExitToMenu();
        });

        const backBtn = makeButton(W / 2 + 110, H / 2 + 75, 'ATRÁS', () => {
            this.closeExitConfirm();
            this.openPauseMenu();
        });

        this._exitObjects = [bg, panel, title, desc, ...acceptBtn, ...backBtn];
        this._exitMenuButtons = [
            { bg: acceptBtn[0], text: acceptBtn[1], onClick: () => this.confirmExitToMenu() },
            { bg: backBtn[0], text: backBtn[1], onClick: () => { this.closeExitConfirm(); this.openPauseMenu(); } }
        ];
        this.exitConfirmOverlay = {
            setVisible: (v) => this._exitObjects.forEach(o => o.setVisible(v)),
            get visible() { return bg.visible; }
        };
        this._exitObjects.forEach(o => o.setVisible(false));
        this._pauseMenuSelectedIndex = 0;
        this._refreshPauseMenuSelection();

        this._exitResizeHandler = (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;

            bg.setSize(w, h);
            panel.setPosition(w / 2, h / 2);
            title.setPosition(w / 2, h / 2 - 60);
            desc.setPosition(w / 2, h / 2 - 5);

            acceptBtn[0].setPosition(w / 2 - 110, h / 2 + 75);
            acceptBtn[1].setPosition(w / 2 - 110, h / 2 + 75);

            backBtn[0].setPosition(w / 2 + 110, h / 2 + 75);
            backBtn[1].setPosition(w / 2 + 110, h / 2 + 75);
        };

        this.scale.on('resize', this._exitResizeHandler, this);
    }

    openPauseMenu() {
        if (this.isPlayerDead) return;

        this.isPaused = true;
        this._pauseMenuContext = 'pause';
        this._pauseMenuSelectedIndex = 0;
        this.pauseOverlay?.setVisible(true);
        this.guideOverlay?.setVisible(false);
        this.exitConfirmOverlay?.setVisible(false);
        this._refreshPauseMenuSelection();

        if (this.duck?.body) {
            this.duck.body.setVelocity(0, 0);
        }
    }

    closePauseMenu() {
        this.isPaused = false;
        this.pauseOverlay?.setVisible(false);
        this.guideOverlay?.setVisible(false);
        this.exitConfirmOverlay?.setVisible(false);
    }

    openGuide() {
        this.isPaused = true;
        this._pauseMenuContext = 'guide';
        this.pauseOverlay?.setVisible(false);
        this.exitConfirmOverlay?.setVisible(false);
        this.guideOverlay?.setVisible(true);
    }

    closeGuide() {
        this.guideOverlay?.setVisible(false);
    }

    openExitConfirm() {
        this.isPaused = true;
        this._pauseMenuContext = 'exit';
        this._pauseMenuSelectedIndex = 0;
        this.pauseOverlay?.setVisible(false);
        this.guideOverlay?.setVisible(false);
        this.exitConfirmOverlay?.setVisible(true);
        this._refreshPauseMenuSelection();
    }

    closeExitConfirm() {
        this.exitConfirmOverlay?.setVisible(false);
    }

    openSettingsFromPause() {
        this.pauseOverlay?.setVisible(false);

        this.scene.launch('SettingsScene', {
            returnScene: 'AlcantarillasScene',
            pauseUnderlyingScene: true
        });

        this.scene.pause();
    }

    confirmExitToMenu() {
        this.isPaused = false;

        if (this.scene.isActive('SettingsScene')) {
            this.scene.stop('SettingsScene');
        }

        this.scene.start('MenuScene');
    }

    showDeathScreen() {
        if (!this.deathOverlay || this.deathOverlay.visible) return;

        this.deathOverlay.setVisible(true);
        this.deathOverlay.setAlpha(0);

        this.tweens.add({
            targets: this.deathOverlay,
            alpha: 1,
            duration: 400,
            ease: 'Power2'
        });
    }

    handlePlayerDeath() {
        if (this.isPlayerDead) return;

        this.isPlayerDead = true;

        const respawnWeaponKey = this._resolveRespawnWeaponKey();
        this.registry?.set('duckRespawnWeapon', respawnWeaponKey);

        // Restaurar el checkpoint a la entrada de la alcantarilla si el jugador muere
        // sin haber llegado a un checkpoint de charquito
        const checkpoint = this._getCurrentCheckpointData();
        if (!checkpoint) {
            // Si no hay checkpoint, guardar la entrada como spawn point
            this.registry?.set('duckCheckpointSpawn', {
                x: this.playerSpawn.x,
                y: this.playerSpawn.y,
                puddleName: ''
            });
        }

        if (this.duck?.body) {
            this.duck.body.setVelocity(0, 0);
            this.duck.body.enable = false;
        }

        if (this.duck?.weapon?.releaseAttack) {
            this.duck.weapon.releaseAttack();
        }

        this.showDeathScreen();
        this.deathSound?.play();

        this.time.delayedCall(2500, () => {
            this.scene.restart();
        });
    }

    _cleanupScene() {
        this.input.removeAllListeners();

        if (this._onResize) {
            this.scale.off('resize', this._onResize, this);
            this._onResize = null;
        }

        if (Array.isArray(this.puddles)) {
            this.puddles.forEach(puddle => puddle?.destroy?.());
            this.puddles = [];
        }
        this.currentPuddle = null;
        this.previousCheckpointBeforePuddle = null;

        if (this.puddleUpgradePanel) {
            this.puddleUpgradePanel.destroy();
            this.puddleUpgradePanel = null;
        }

        if (this.deathOverlay) {
            this.deathOverlay.destroy();
            this.deathOverlay = null;
        }

        if (this.consumableBar) {
            this.consumableBar.destroy();
            this.consumableBar = null;
        }

        if (this._onFontSizeChanged) {
            this.game.events.off('fontSizeChanged', this._onFontSizeChanged, this);
        }

        if (this._pauseResizeHandler) {
            this.scale.off('resize', this._pauseResizeHandler, this);
        }

        if (this._guideResizeHandler) {
            this.scale.off('resize', this._guideResizeHandler, this);
        }

        if (this._exitResizeHandler) {
            this.scale.off('resize', this._exitResizeHandler, this);
        }

        if (this._guideWheelHandler) {
            this.input.off('wheel', this._guideWheelHandler, this);
        }

        this.input?.off?.('wheel');
    }

}
