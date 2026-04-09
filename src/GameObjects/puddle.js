import Phaser from 'phaser';

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
    }

    containsPoint(x, y) {
        if (!this.polygon || !this.bounds) return false;
        if (!this.bounds.contains(x, y)) return false;

        return this.polygon.contains(x, y);
    }

    containsDuck(duck) {
        if (!duck || !duck.active) return false;

        return this.containsPoint(duck.x, duck.y);
    }

    getSpawnPoint() {
        if (!this.spawnPoint) return null;

        return {
            x: this.spawnPoint.x,
            y: this.spawnPoint.y
        };
    }

    destroy(fromScene) {
        this.scene = null;
        this.points = null;
        this.polygon = null;
        this.bounds = null;
        this.spawnPoint = null;
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