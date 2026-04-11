export function createDefaultPuddleUpgrades() {
    return [
        {
            id: 'puddle_speed_10',
            label: 'contramuslo',
            description: '¡muévete más rápido!',
            costFeathers: 1,
            effect: {
                type: 'move_speed_percent',
                value: 0.1
            },
            purchased: false
        },
        {
            id: 'puddle_attack_10',
            label: 'alitas',
            description: '¡pega más fuerte!',
            costFeathers: 1,
            effect: {
                type: 'base_attack_percent',
                value: 0.1
            },
            purchased: false
        },
        {
            id: 'puddle_weapon_duration_50',
            label: 'gracia patuna',
            description: '¡aumenta la duración\nde tus armas!',
            costFeathers: 3,
            effect: {
                type: 'weapon_duration_percent',
                value: 0.5
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

    if (effectType === 'base_attack_percent') {
        if (!Number.isFinite(effectValue) || effectValue <= 0) {
            return { success: false, reason: 'invalid_effect', message: 'Invalid attack bonus.' };
        }

        duck.applyBaseAttackBonus?.(effectValue);
        return {
            success: true,
            reason: 'ok',
            message: `Attack upgraded +${Math.round(effectValue * 100)}%.`
        };
    }

    if (effectType === 'weapon_duration_percent') {
        if (!Number.isFinite(effectValue) || effectValue <= 0) {
            return { success: false, reason: 'invalid_effect', message: 'Invalid weapon duration bonus.' };
        }

        duck.applyWeaponDurationBonus?.(effectValue);
        return {
            success: true,
            reason: 'ok',
            message: `Weapon duration upgraded +${Math.round(effectValue * 100)}%.`
        };
    }

    return { success: false, reason: 'unsupported_effect', message: 'Unsupported upgrade effect.' };
}
