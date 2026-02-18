
export function handleMeleeAttack(weapon) {
    if (!weapon || !weapon.scene) return;
    if (weapon.isAttacking) return;

    weapon.isAttacking = true;

    weapon.scene.tweens.add({
        targets: weapon,
        angle: 60,
        duration: 100,
        yoyo: true,
        ease: 'Power1',
        onComplete: () => {
            weapon.angle = 0;
            weapon.isAttacking = false;
        }
    });
}

export default { handleMeleeAttack };
