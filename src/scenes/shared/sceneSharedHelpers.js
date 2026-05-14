const ALLOWED_RESPAWN_WEAPONS = new Set(['arco', 'mcuaktro', 'cuchillo', 'mazo', 'ramita', 'escoba']);

// Devuelve el modo de entrada activo, mando o teclado
// Se asume teclado como valor por defecto.
export function getActiveInputMode(scene) {
    return scene.registry?.get('activeInputMode') || 'keyboard';
}

// Sincroniza la UI y el cursor
// Esto te evita trabajo repetido si el modo no cambia desde la ultima comprobacion
export function syncActiveInputModeFeedback(scene) {
    const activeInputMode = getActiveInputMode(scene);

    if (activeInputMode === scene._lastActiveInputMode) return;

    scene._lastActiveInputMode = activeInputMode;

    if (scene.input?.setDefaultCursor) {
        scene.input.setDefaultCursor(activeInputMode === 'gamepad' ? 'none' : 'default');
    }

    if (scene.aimAssistCross) {
        scene.aimAssistCross.setVisible(activeInputMode === 'gamepad');
    }
}

// Dibuja o actualiza la mira de asistencia cuando se juega con mando
// Con teclado solo se oculta la ayuda visual
export function updateAimAssistCross(scene, pointer) {
    if (!scene.aimAssistCross) return;

    const activeInputMode = getActiveInputMode(scene);
    const isGamepadMode = activeInputMode === 'gamepad';

    scene.aimAssistCross.setVisible(isGamepadMode);
    if (!isGamepadMode || !pointer) return;

    scene.aimAssistCross.clear();
    scene.aimAssistCross.setPosition(pointer.x, pointer.y);

    // Dibujo de la mira
    scene.aimAssistCross.lineStyle(3, 0x5a0000, 0.22);
    scene.aimAssistCross.strokeCircle(0, 0, 8);
    scene.aimAssistCross.lineStyle(2, 0xff3b3b, 0.78);
    scene.aimAssistCross.strokeCircle(0, 0, 14);
    scene.aimAssistCross.lineStyle(10, 0x5a0000, 0.22);
    scene.aimAssistCross.beginPath();
    scene.aimAssistCross.moveTo(-25, 0);
    scene.aimAssistCross.lineTo(25, 0);
    scene.aimAssistCross.moveTo(0, -25);
    scene.aimAssistCross.lineTo(0, 25);
    scene.aimAssistCross.strokePath();
    scene.aimAssistCross.lineStyle(5, 0xff3b3b, 0.78);
    scene.aimAssistCross.beginPath();
    scene.aimAssistCross.moveTo(-23, 0);
    scene.aimAssistCross.lineTo(23, 0);
    scene.aimAssistCross.moveTo(0, -23);
    scene.aimAssistCross.lineTo(0, 23);
    scene.aimAssistCross.strokePath();
    scene.aimAssistCross.fillStyle(0xff5555, 0.85);
    scene.aimAssistCross.fillCircle(0, 0, 4);
}

// Primero intenta usar el checkpoint
// Si no hay, cae al spawn original del jugador
export function getCurrentCheckpointData(scene) {
    const checkpoint = scene.registry?.get('duckCheckpointSpawn');
    const checkpointX = Number(checkpoint?.x);
    const checkpointY = Number(checkpoint?.y);

    if (Number.isFinite(checkpointX) && Number.isFinite(checkpointY)) {
        return {
            x: checkpointX,
            y: checkpointY,
            puddleName: checkpoint?.puddleName || ''
        };
    }

    // Si no hay checkpoint, solo usamos el spawn base
    const spawnX = Number(scene.playerSpawn?.x);
    const spawnY = Number(scene.playerSpawn?.y);
    if (!Number.isFinite(spawnX) || !Number.isFinite(spawnY)) return null;

    return {
        x: spawnX,
        y: spawnY,
        puddleName: ''
    };
}

// Actualiza spawn, registro y estado del duck
export function restoreCheckpoint(scene, checkpointData) {
    if (!checkpointData) return;

    const checkpointX = Number(checkpointData.x);
    const checkpointY = Number(checkpointData.y);
    if (!Number.isFinite(checkpointX) || !Number.isFinite(checkpointY)) return;

    scene.playerSpawn = { x: checkpointX, y: checkpointY };

    scene.registry?.set('duckCheckpointSpawn', {
        x: checkpointX,
        y: checkpointY,
        puddleName: checkpointData.puddleName || ''
    });

    if (scene.duck?.setCheckpoint) {
        scene.duck.setCheckpoint({
            x: checkpointX,
            y: checkpointY,
            puddleName: checkpointData.puddleName || ''
        });
    }
}

// Aplica al spawn de la escena el checkpoint almacenado en el registro, si existe
export function applyStoredCheckpointSpawn(scene) {
    const checkpoint = scene.registry?.get('duckCheckpointSpawn');
    if (!checkpoint) return;

    const checkpointX = Number(checkpoint.x);
    const checkpointY = Number(checkpoint.y);
    if (!Number.isFinite(checkpointX) || !Number.isFinite(checkpointY)) return;

    scene.playerSpawn = { x: checkpointX, y: checkpointY };
}

// Recupera el arma que tenías anted de morir y la aplica si está en la pool de armas validas de respawn (Me rompe un poco la inmersión pero bueno...)
export function applyStoredRespawnWeapon(scene) {
    const storedWeapon = scene.registry?.get('duckRespawnWeapon');
    if (typeof storedWeapon !== 'string') return;

    const normalizedWeapon = storedWeapon.trim().toLowerCase();
    if (!normalizedWeapon) return;
    if (!ALLOWED_RESPAWN_WEAPONS.has(normalizedWeapon)) return;

    scene.playerWeapon = normalizedWeapon;
}

// Resuelve que arma debe usarse al reaparecer
export function resolveRespawnWeaponKey(scene, options = {}) {
    const weapon = scene.duck?.weapon;
    if (!weapon) return 'ramita';

    const allowTextureContainsMatch = !!options.allowTextureContainsMatch;

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

    // Algunos objetos igual no conservan el nombre de clase esperado
    // Para evitar que pete, se usa la textura como respaldo para reconstruir el arma correcta
    const textureKey = String(weapon?.texture?.key || '').trim().toLowerCase();
    if (byConstructorName[textureKey]) return byConstructorName[textureKey];

    if (allowTextureContainsMatch) {
        if (textureKey.includes('arco')) return 'arco';
        if (textureKey.includes('mcuaktro')) return 'mcuaktro';
        if (textureKey.includes('cuchillo')) return 'cuchillo';
        if (textureKey.includes('mazo')) return 'mazo';
        if (textureKey.includes('escoba')) return 'escoba';
        if (textureKey.includes('ramita')) return 'ramita';
    }

    return 'ramita';
}

// Crea los charcos definidos en la capa de objetos "charquito" del mapa
// Convierte cada poligono del editor en un PuddleClass
export function setupPuddlesFromLayer(scene, scale, sceneName, PuddleClass) {
    const puddleLayer = scene.map.getObjectLayer('charquito');

    scene.puddles = [];

    if (!puddleLayer || !Array.isArray(puddleLayer.objects) || puddleLayer.objects.length === 0) {
        console.log(`[${sceneName}] No se encontro la capa "charquito" o esta vacia.`);
        return;
    }

    puddleLayer.objects.forEach((obj, index) => {
        // Cada charco DEBE venir como un poligonom, si no se ignora para no romper la carga
        if (!Array.isArray(obj.polygon) || obj.polygon.length < 3) {
            return;
        }

        const points = obj.polygon.map(point => ({
            x: (obj.x + point.x) * scale,
            y: (obj.y + point.y) * scale
        }));

        const puddle = new PuddleClass(scene, points, obj.name || `charco_${index + 1}`);
        scene.puddles.push(puddle);
    });

    console.log(`[${sceneName}] Capa charquito encontrada con ${scene.puddles.length} charco(s).`);
}

// Devuelve el primer gamepad conectado, o el primero disponible si aún no marca conectado
export function getPrimaryGamepad(scene) {
    if (!scene.input?.gamepad) return null;

    const gamepads = scene.input.gamepad.getAll();
    if (!gamepads || gamepads.length === 0) return null;

    return gamepads.find((pad) => pad && pad.connected) || gamepads[0];
}

// Lee el valor de un eje del gamepad con compatibilidad para distintas APIs de Phaser
export function getPadAxis(pad, axisIndex) {
    if (!pad || !Array.isArray(pad.axes) || !pad.axes[axisIndex]) return 0;

    const axis = pad.axes[axisIndex];
    if (typeof axis.getValue === 'function') return axis.getValue();
    if (typeof axis.value === 'number') return axis.value;
    return 0;
}

// Comprueba si un boton del mando esta pulsado, aceptando tanto pressed como value
export function isPadButtonDown(pad, buttonIndex) {
    if (!pad || !pad.buttons || !pad.buttons[buttonIndex]) return false;

    const button = pad.buttons[buttonIndex];
    return !!(button.pressed || (typeof button.value === 'number' && button.value > 0.5));
}

export function saveDuckState(scene) {
    if (!scene.duck) return;
    scene.registry?.set('duckFeathers', scene.duck.feathers ?? scene.duck.health ?? null);
    scene.registry?.set('duckBreadCount', scene.breadCount ?? 0);
}

export function restoreDuckState(scene) {
    const feathers = scene.registry?.get('duckFeathers');
    if (feathers !== null && feathers !== undefined && Number.isFinite(Number(feathers))) {
        if (scene.duck?.setFeathers) {
            scene.duck.setFeathers(Number(feathers));
        } else if (scene.duck) {
            scene.duck.feathers = Number(feathers);
            scene.duck.health = Number(feathers);
        }
    }

    const breadCount = scene.registry?.get('duckBreadCount');
    if (breadCount !== null && breadCount !== undefined && Number.isFinite(Number(breadCount))) {
        scene.breadCount = Number(breadCount);
    }
}

// Gestiona la navegación del menu de pausa con mando
export function updatePauseGamepadMenu(scene) {
    const pad = getPrimaryGamepad(scene);
    if (!pad) {
        // Sin mando, se limpian los estados de pulsacion
        scene._pauseMenuActionHeld = false;
        scene._pauseMenuBackHeld = false;
        scene._lastPauseMenuNavAt = -Infinity;
        return;
    }

    const now = scene.time.now;
    const deadzone = 0.35;
    const leftY = getPadAxis(pad, 1);
    const dpadUp = isPadButtonDown(pad, 12);
    const dpadDown = isPadButtonDown(pad, 13);
    const confirmPressed = isPadButtonDown(pad, 0);
    const backPressed = isPadButtonDown(pad, 1);
    const navUp = leftY < -deadzone || dpadUp;
    const navDown = leftY > deadzone || dpadDown;
    const buttons = scene._getPauseMenuButtonsForCurrentContext();

    // La navegación vertical usa un "throttle" para evitar saltos multiples cuando mantienes el stick o la cruceta
    if (buttons.length && now - scene._lastPauseMenuNavAt >= scene._pauseMenuNavRepeatMs) {
        if (navUp && !navDown) {
            scene._movePauseMenuSelection(-1);
            scene._lastPauseMenuNavAt = now;
        } else if (navDown && !navUp) {
            scene._movePauseMenuSelection(1);
            scene._lastPauseMenuNavAt = now;
        }
    }

    // En la pantalla de guia, el boton de volver cierra la guia y regresa al menú.
    if (scene._pauseMenuContext === 'guide') {
        if (backPressed && !scene._pauseMenuBackHeld) {
            scene.closeGuide();
            scene.openPauseMenu();
        }
        scene._pauseMenuBackHeld = backPressed;
        scene._pauseMenuActionHeld = confirmPressed;
        return;
    }

    // En el submenu de salida, izquierda/derecha cambian la opcion activa
    if (scene._pauseMenuContext === 'exit') {
        const navLeft = isPadButtonDown(pad, 14);
        const navRight = isPadButtonDown(pad, 15);

        if (now - scene._lastPauseMenuNavAt >= scene._pauseMenuNavRepeatMs) {
            if (navLeft && !navRight) {
                scene._movePauseMenuSelection(-1);
                scene._lastPauseMenuNavAt = now;
            } else if (navRight && !navLeft) {
                scene._movePauseMenuSelection(1);
                scene._lastPauseMenuNavAt = now;
            }
        }

        if (backPressed && !scene._pauseMenuBackHeld) {
            scene.closeExitConfirm();
            scene.openPauseMenu();
            scene._pauseMenuBackHeld = backPressed;
            scene._pauseMenuActionHeld = confirmPressed;
            return;
        }

        if (confirmPressed && !scene._pauseMenuActionHeld) {
            const button = buttons[scene._pauseMenuSelectedIndex] ?? buttons[0];
            button?.onClick?.();
        }

        scene._pauseMenuActionHeld = confirmPressed;
        scene._pauseMenuBackHeld = backPressed;
        return;
    }

    // En el menu principal de pausa, volver cierra el menu y confirmar ejecuta la opcion seleccionada en ese momento
    if (backPressed && !scene._pauseMenuBackHeld) {
        scene.closePauseMenu();
        scene._pauseMenuBackHeld = backPressed;
        scene._pauseMenuActionHeld = confirmPressed;
        return;
    }

    if (confirmPressed && !scene._pauseMenuActionHeld) {
        const button = buttons[scene._pauseMenuSelectedIndex] ?? buttons[0];
        button?.onClick?.();
    }

    scene._pauseMenuActionHeld = confirmPressed;
    scene._pauseMenuBackHeld = backPressed;
}