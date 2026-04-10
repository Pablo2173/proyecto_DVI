export function createDefaultPuddleUpgrades() {
    return [
        {
            id: 'puddle_speed_10',
            label: 'Move speed +10%',
            costFeathers: 1,
            effect: {
                type: 'move_speed_percent',
                value: 0.1
            },
            purchased: false
        }
    ];
}

export function applyPuddleUpgradeToDuck(upgrade, duck) {
    if (!upgrade || !duck || !duck.active) {
        return { success: false, reason: 'invalid_target', message: 'Duck is not available.' };
    }

    const effectType = upgrade.effect?.type;
    const effectValue = Number(upgrade.effect?.value);

    if (effectType === 'move_speed_percent') {
        if (!Number.isFinite(effectValue) || effectValue <= 0) {
            return { success: false, reason: 'invalid_effect', message: 'Invalid speed bonus.' };
        }

        duck.applyMovementSpeedBonus?.(effectValue);
        return {
            success: true,
            reason: 'ok',
            message: `Speed upgraded +${Math.round(effectValue * 100)}%.`
        };
    }

    return { success: false, reason: 'unsupported_effect', message: 'Unsupported upgrade effect.' };
}
