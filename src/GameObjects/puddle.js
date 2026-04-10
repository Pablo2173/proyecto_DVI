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

    purchaseUpgrade(upgradeId, duck) {
        if (this.isRemoved) {
            return { success: false, reason: 'removed', message: 'Puddle no longer available.' };
        }
        if (this.hasPurchasedUpgrade) {
            return { success: false, reason: 'already_purchased', message: 'Only one upgrade can be purchased.' };
        }
        if (!duck || !duck.active) {
            return { success: false, reason: 'invalid_duck', message: 'Duck is not available.' };
        }

        const upgrade = (this.upgrades || []).find(item => item?.id === upgradeId && item.purchased !== true);
        if (!upgrade) {
            return { success: false, reason: 'not_found', message: 'Upgrade not found.' };
        }

        const cost = Math.max(0, Number(upgrade.costFeathers) || 0);
        if (!duck.hasFeathers?.(cost)) {
            return { success: false, reason: 'not_enough_feathers', message: 'Not enough feathers.' };
        }

        const feathersBeforePurchase = Number(duck.feathers) || 0;
        const spent = duck.spendFeathers?.(cost);
        if (!spent) {
            return { success: false, reason: 'payment_failed', message: 'Could not spend feathers.' };
        }

        const applyResult = applyPuddleUpgradeToDuck(upgrade, duck);
        if (!applyResult?.success) {
            duck.setFeathers?.(feathersBeforePurchase);
            return {
                success: false,
                reason: applyResult?.reason || 'apply_failed',
                message: applyResult?.message || 'Upgrade could not be applied.'
            };
        }

        upgrade.purchased = true;
        this.hasPurchasedUpgrade = true;
        this.isRemoved = true;
        this.upgrades.forEach(item => {
            if (item?.id !== upgrade.id) {
                item.purchased = true;
            }
        });

        return {
            success: true,
            reason: 'ok',
            message: applyResult?.message || 'Upgrade purchased.',
            removePuddle: true,
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