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
import waterCoastsAnimation from '../../assets/tilesets/water_coasts_animation.png';
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
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
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
        if (!this.duck || !this.duck.active || !this.zonasAcuaticasLayer) return;

        const tileSize = 16 * 4;
        const tileX = Math.floor(this.duck.x / tileSize);
        const tileY = Math.floor(this.duck.y / tileSize);

        const waterTile = this.zonasAcuaticasLayer.getTileAt(tileX, tileY);
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

        return null;
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

        const purchase = puddle.purchaseUpgrade?.(upgradeId, this.duck);
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
        // Pausa desactivada temporalmente en AlcantarillasScene para probar la fase 2.
    }

    createPauseMenuUI() {
        this.pauseOverlay = this.pauseOverlay ?? { visible: false };
    }

    createGuideUI() {
        this.guideOverlay = this.guideOverlay ?? { visible: false };
    }

    createExitConfirmUI() {
        this.exitConfirmOverlay = this.exitConfirmOverlay ?? { visible: false };
    }

    openPauseMenu() {
        this.isPaused = true;
        if (this.pauseOverlay) this.pauseOverlay.visible = true;
    }

    closePauseMenu() {
        this.isPaused = false;
        if (this.pauseOverlay) this.pauseOverlay.visible = false;
    }

    closeGuide() {
        if (this.guideOverlay) this.guideOverlay.visible = false;
    }

    closeExitConfirm() {
        if (this.exitConfirmOverlay) this.exitConfirmOverlay.visible = false;
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
    }

}
