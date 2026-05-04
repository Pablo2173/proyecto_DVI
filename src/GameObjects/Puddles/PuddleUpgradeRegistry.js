// Busca esta función y actualiza los objetos
export function createDefaultPuddleUpgrades() {
    return [
        {
            id: 'puddle_speed_10',
            label: 'CONTRAMUSLO AGIL',
            description: 'Aumenta permanentemente tu velocidad de movimiento en un 10%. !Corre Sal de Aqui!',
            costFeathers: 1,
            effect: { type: 'move_speed_percent', value: 0.1 },
            purchased: false
        },
        {
            id: 'puddle_attack_10',
            label: 'ALITAS PODEROSAS',
            description: 'Tus ataques hacen un 10% más de daño. ¡Derrumba a los enemigos con menos golpes!',
            costFeathers: 1,
            effect: { type: 'base_attack_percent', value: 0.1 },
            purchased: false
        },
        {
            id: 'puddle_weapon_duration_50',
            label: 'GRACIA PATUNA',
            description: 'Tus armas (como el arco o maza) duran un 50% más antes de romperse.',
            costFeathers: 3, // Este es más caro porque es muy potente
            effect: { type: 'weapon_duration_percent', value: 0.5 },
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
