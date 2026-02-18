
export function handleDistanceAttack(weapon) {
    if (!weapon || !weapon.scene) return;
    if (weapon.isAttacking) return;

    const scene = weapon.scene;
    weapon.isAttacking = true;

    const startX = weapon.x;
    const startY = weapon.y;

    const PROY_CONFIG = {
        mcuaktro: { key: 'bala_mcuaktro', scale: 0.02, offsetX: 5, offsetY: 5, distance: 500, duration: 600 },
        arco: { key: 'flecha_arco', scale: 0.1, offsetX: 8, offsetY: 4, distance: 400, duration: 500 }
    };

    const cfg = PROY_CONFIG[weapon.weaponType] || PROY_CONFIG.mcuaktro;

    const dir = (weapon.facing === 'left') ? -1 : 1;
    const proyStartX = startX + (cfg.offsetX * dir);
    const proyStartY = startY + cfg.offsetY;

    const proy = scene.add.image(proyStartX, proyStartY, cfg.key);
    proy.setScale(cfg.scale);

    scene.tweens.add({
        targets: proy,
        x: proyStartX + (cfg.distance * dir),
        ease: 'Linear',
        duration: cfg.duration,
        onComplete: () => {
            proy.destroy();
            weapon.isAttacking = false;
        }
    });
}

export default { handleDistanceAttack };
