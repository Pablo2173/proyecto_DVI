import Phaser from 'phaser';
import {
    applyPuddleUpgradeToDuck,
    createDefaultPuddleUpgrades
} from './Puddles/PuddleUpgradeRegistry.js';

export default class Puddle {
    // ─────────────────────────────────────────
    // PUDDLE
    // Charco definido como polígono invisible.
    // ─────────────────────────────────────────

    constructor(scene, points = [], name = '') {
        this.scene = scene;
        this.name = name;

        const validPoints = Array.isArray(points)
            ? points.filter(point => Number.isFinite(point?.x) && Number.isFinite(point?.y))
            : [];

        this.points = validPoints;
        this.polygon = validPoints.length >= 3 ? new Phaser.Geom.Polygon(validPoints) : null;
        this.bounds = this.polygon ? this._createBounds(validPoints) : null;
        this.spawnPoint = this.bounds
            ? { x: this.bounds.centerX, y: this.bounds.centerY }
            : null;

        this.isRemoved = false;
        this.checkpointBackup = null;
        this.hasPurchasedUpgrade = false;
        this.upgrades = createDefaultPuddleUpgrades();
    }

    containsPoint(x, y) {
        if (!this.polygon || !this.bounds) return false;
        if (!this.bounds.contains(x, y)) return false;

        return this.polygon.contains(x, y);
    }

    containsDuck(duck) {
        if (this.isRemoved) return false;
        if (!duck || !duck.active) return false;

        return this.containsPoint(duck.x, duck.y);
    }

    getPrimaryUpgrade() {
        if (this.isRemoved || !Array.isArray(this.upgrades)) return null;

        const upgrade = this.upgrades.find(item => item && item.purchased !== true);
        return upgrade || null;
    }

    getAvailableUpgrades() {
        if (this.isRemoved || !Array.isArray(this.upgrades)) return [];
        return this.upgrades.filter(item => item && item.purchased !== true);
    }

    setCheckpointBackup(checkpointData) {
        if (!checkpointData) {
            this.checkpointBackup = null;
            return;
        }

        const backupX = Number(checkpointData.x);
        const backupY = Number(checkpointData.y);
        if (!Number.isFinite(backupX) || !Number.isFinite(backupY)) {
            this.checkpointBackup = null;
            return;
        }

        this.checkpointBackup = {
            x: backupX,
            y: backupY,
            puddleName: checkpointData.puddleName || ''
        };
    }

    getCheckpointBackup() {
        if (!this.checkpointBackup) return null;

        return {
            x: this.checkpointBackup.x,
            y: this.checkpointBackup.y,
            puddleName: this.checkpointBackup.puddleName || ''
        };
    }

    purchaseUpgrade(duck, upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        
        // 1. Verificar si existe o ya se compró
        if (!upgrade || upgrade.purchased) {
            return { success: false, reason: 'invalid_upgrade', message: 'Esta mejora ya no está disponible.' };
        }

        // 2. Comprobar si tiene suficientes plumas (Requisito: No dejar comprar si no tiene)
        const cost = upgrade.costFeathers;
        if (duck.feathers < cost) {
            return { 
                success: false, 
                reason: 'not_enough_feathers', 
                message: `¡Necesitas ${cost} plumas! Solo tienes ${duck.feathers}.` 
            };
        }

        // 3. Aplicar la mejora
        const applyResult = applyPuddleUpgradeToDuck(upgrade, duck);
        if (!applyResult.success) return applyResult;

        // 4. Cobrar las plumas y marcar como comprada
        duck.spendFeathers?.(cost);
        upgrade.purchased = true;
        this.hasPurchasedUpgrade = true;

        // 5. SUBIR DE PRECIO LAS DEMÁS (Lógica de inflación)
        // Cada vez que compras algo, las que quedan disponibles suben, por ejemplo, +2 plumas
        const inflacion = 2;
        this.upgrades.forEach(item => {
            if (!item.purchased) {
                item.costFeathers += inflacion;
            }
        });

        return {
            success: true,
            reason: 'ok',
            message: '¡Mejora obtenida! Las demás ahora son más caras.',
            removePuddle: false, // Cambiamos a false para que el charco no desaparezca y deje comprar más
            spentFeathers: cost,
            remainingFeathers: duck.feathers
        };
    }

    getSpawnPoint() {
        if (!this.spawnPoint) return null;

        return {
            x: this.spawnPoint.x,
            y: this.spawnPoint.y
        };
    }

    destroy(fromScene) {
        this.isRemoved = true;
        this.scene = null;
        this.points = null;
        this.polygon = null;
        this.bounds = null;
        this.spawnPoint = null;
        this.upgrades = null;
        this.checkpointBackup = null;
        this.hasPurchasedUpgrade = null;
        return fromScene;
    }

    _createBounds(points) {
        let minX = points[0].x;
        let minY = points[0].y;
        let maxX = points[0].x;
        let maxY = points[0].y;

        for (let index = 1; index < points.length; index++) {
            const point = points[index];
            if (point.x < minX) minX = point.x;
            if (point.y < minY) minY = point.y;
            if (point.x > maxX) maxX = point.x;
            if (point.y > maxY) maxY = point.y;
        }

        return new Phaser.Geom.Rectangle(minX, minY, maxX - minX, maxY - minY);
    }
}