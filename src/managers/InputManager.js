import Phaser from 'phaser';

const XBOX_BUTTONS = Object.freeze({
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    BACK: 8,
    START: 9,
    L3: 10,
    R3: 11,
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15
});

/**
 * InputManager centraliza la entrada de teclado y gamepad (Xbox).
 * Proporciona métodos unificados para consultar el estado de controles.
 */
export default class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.input = scene.input;
d        this.activeInputMode = 'keyboard';

        this.scene?.registry?.set('activeInputMode', this.activeInputMode);

        if (this.input.keyboard) {
            this.input.keyboard.on('keydown', this._onKeyboardInput, this);
        }

        this.input.on('pointerdown', this._onPointerInput, this);
        this.input.on('pointermove', this._onPointerInput, this);

        // ─── TECLADO ───
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey('W');
        this.keyA = this.input.keyboard.addKey('A');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyD = this.input.keyboard.addKey('D');
        this.keySpace = this.input.keyboard.addKey('SPACE');
        this.keyC = this.input.keyboard.addKey('C');
        this.keyE = this.input.keyboard.addKey('E');
        this.keyQ = this.input.keyboard.addKey('Q');
        this.keyR = this.input.keyboard.addKey('R');

        // Números para seleccionar items (legado)
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key3 = this.input.keyboard.addKey('THREE');
        this.key4 = this.input.keyboard.addKey('FOUR');
        this.key5 = this.input.keyboard.addKey('FIVE');
        this.key6 = this.input.keyboard.addKey('SIX');

        // ─── GAMEPAD ───
        this.gamepadConnected = false;
        this.lastGamepadConnected = false;
        this.primaryPad = null;
        this.primaryPadId = null;

        this._gamepadButtonDown = {};
        this._gamepadButtonJustDown = {};
        this._gamepadButtonJustUp = {};
        this._previousGamepadButtonDown = {};

        // Event listeners para gamepad (solo si está disponible)
        if (this.input.gamepad) {
            this.input.gamepad.on('down', (pad, button, index) => {
                this.onGamepadButtonDown(pad, button, index);
            });

            this.input.gamepad.on('up', (pad, button, index) => {
                this.onGamepadButtonUp(pad, button, index);
            });
        }

        // Estados de botones del gamepad (para detectar cambios)
        this.gamepadButtonStates = {};
        this.gamepadAxisStates = {};

        // Estados para debounce de ejes (fallback para D-pad en algunos pads)
        this._axisLeftHeld = false;
        this._axisRightHeld = false;

        // Callbacks registrados
        this.callbacks = {
            moveStart: null,
            moveStop: null,
            dash: null,
            quack: null,
            attack: null,
            attackRelease: null,
            interact: null,
            itemSelectLeft: null,
            itemSelectRight: null,
            itemUse: null,
        };
    }

    /**
     * Registra un callback para un evento de entrada
     */
    on(eventName, callback) {
        if (this.callbacks.hasOwnProperty(eventName)) {
            this.callbacks[eventName] = callback;
        }
    }

    _setActiveInputMode(mode) {
        if (mode !== 'keyboard' && mode !== 'gamepad') return;

        if (this.activeInputMode === mode) return;

        this.activeInputMode = mode;
        this.scene?.registry?.set('activeInputMode', mode);
    }

    _onKeyboardInput() {
        this._setActiveInputMode('keyboard');
    }

    _onPointerInput() {
        this._setActiveInputMode('keyboard');
    }

    /**
     * Obtiene el vector de movimiento normalizado
     * @returns {{x: number, y: number}}
     */
    getMovementInput() {
        let x = 0, y = 0;

        // Teclado
        if (this.cursors.left.isDown || this.keyA.isDown) x -= 1;
        if (this.cursors.right.isDown || this.keyD.isDown) x += 1;
        if (this.cursors.up.isDown || this.keyW.isDown) y -= 1;
        if (this.cursors.down.isDown || this.keyS.isDown) y += 1;

        // Gamepad - Joystick izquierdo
        const pad = this.getPrimaryGamepad();
        if (pad) {
            const leftStickX = this.getAxisValue(pad, 0);
            const leftStickY = this.getAxisValue(pad, 1);

            const threshold = 0.3;

            if (Math.abs(leftStickX) > threshold) {
                this._setActiveInputMode('gamepad');
                x = leftStickX;
            }
            if (Math.abs(leftStickY) > threshold) {
                this._setActiveInputMode('gamepad');
                y = leftStickY;
            }
        }

        // Normalizar
        const len = Math.hypot(x, y);
        if (len > 0) {
            return { x: x / len, y: y / len };
        }

        return { x: 0, y: 0 };
    }

    /**
     * Obtiene el vector del joystick derecho (para apuntar)
     * @returns {{x: number, y: number}}
     */
    getAimInput() {
        const pad = this.getPrimaryGamepad();
        if (!pad) return { x: 0, y: 0 };

        const rightStickX = this.getAxisValue(pad, 2);
        const rightStickY = this.getAxisValue(pad, 3);

        const threshold = 0.3;
        let x = 0, y = 0;

        if (Math.abs(rightStickX) > threshold) {
            x = rightStickX;
        }
        if (Math.abs(rightStickY) > threshold) {
            y = rightStickY;
        }

        return { x, y };
    }

    /**
     * Verifica si se presionó el botón de dash
     */
    isDashPressed() {
        // Teclado: SPACE
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)) return true;

        // Gamepad: LB (botón 4) o LT (gatillo izquierdo)
        const pad = this.getPrimaryGamepad();
        if (pad) {
            if (this.isGamepadButtonJustDown(pad, XBOX_BUTTONS.LB)) return true;
            if (this.isGamepadButtonJustDown(pad, XBOX_BUTTONS.LT)) return true;
        }

        return false;
    }

    /**
     * Verifica si se presionó el botón de quack
     */
    isQuackPressed() {
        // Teclado: C
        if (Phaser.Input.Keyboard.JustDown(this.keyC)) return true;

        // Gamepad: B
        const pad = this.getPrimaryGamepad();
        if (pad && this.isGamepadButtonJustDown(pad, XBOX_BUTTONS.B)) return true;

        return false;
    }

    /**
     * Verifica si se presionó el botón de ataque
     */
    isAttackPressed() {
        // Teclado: click izquierdo
        if (this.input.activePointer.isDown && this.input.activePointer.button === 0) return true;

        // Gamepad: RB o RT (gatillo derecho)
        const pad = this.getPrimaryGamepad();
        if (pad) {
            if (this.isGamepadButtonDown(pad, XBOX_BUTTONS.RB)) return true;
            if (this.isGamepadButtonDown(pad, XBOX_BUTTONS.RT)) return true;
        }

        return false;
    }

    /**
     * Verifica si se liberó el botón de ataque
     */
    isAttackReleased() {
        // Teclado: click izquierdo liberado
        if (!this.input.activePointer.isDown) return true;

        // Gamepad: RB o RT liberados
        const pad = this.getPrimaryGamepad();
        if (pad) {
            if (this.isGamepadButtonJustUp(pad, XBOX_BUTTONS.RB)) return true;
            if (this.isGamepadButtonJustUp(pad, XBOX_BUTTONS.RT)) return true;
        }

        return false;
    }

    /**
     * Verifica si se presionó el botón de interacción
     */
    isInteractPressed() {
        // Teclado: E
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) return true;

        // Gamepad: A
        const pad = this.getPrimaryGamepad();
        if (pad && this._gamepadButtonJustDown[XBOX_BUTTONS.A]) return true;

        return false;
    }

    /**
     * Verifica si se presionó navegar items a la izquierda (D-pad left o Q)
     */
    isItemNavigateLeft() {
        // Teclado: Q (alternativa)
        if (Phaser.Input.Keyboard.JustDown(this.keyQ)) return true;

        // Gamepad: D-pad left
        const pad = this.getPrimaryGamepad();
        if (pad && this._gamepadButtonJustDown[XBOX_BUTTONS.DPAD_LEFT]) {
            this._setActiveInputMode('gamepad');
            console.log('[INPUT] D-pad LEFT detectado');
            return true;
        }

        return false;
    }

    /**
     * Verifica si se presionó navegar items a la derecha (D-pad right o R)
     */
    isItemNavigateRight() {
        // Teclado: R (alternativa)
        if (Phaser.Input.Keyboard.JustDown(this.keyR)) return true;

        // Gamepad: D-pad right
        const pad = this.getPrimaryGamepad();
        if (pad && this._gamepadButtonJustDown[XBOX_BUTTONS.DPAD_RIGHT]) {
            this._setActiveInputMode('gamepad');
            return true;
        }

        return false;
    }

    /**
     * Verifica si se presionó usar item (botón X o números 1-6)
     */
    isItemUsePressed() {
        // Teclado: números 1-6 (legado)
        if (this.input.keyboard.checkDown(this.key1, 250)) return 0;
        if (this.input.keyboard.checkDown(this.key2, 250)) return 1;
        if (this.input.keyboard.checkDown(this.key3, 250)) return 2;
        if (this.input.keyboard.checkDown(this.key4, 250)) return 3;
        if (this.input.keyboard.checkDown(this.key5, 250)) return 4;
        if (this.input.keyboard.checkDown(this.key6, 250)) return 5;

        // Gamepad: X
        const pad = this.getPrimaryGamepad();
        if (pad) {
            const xPressed = this._gamepadButtonJustDown[XBOX_BUTTONS.X];
            if (xPressed) {
                this._setActiveInputMode('gamepad');
                console.log('[INPUT] Bot\u00f3n X detectado - usar item seleccionado');
                return 'use_selected'; // Se\u00f1al especial para usar el item seleccionado
            }
        }

        return null;
    }

    /**
     * Obtiene el gamepad primario conectado
     */
    getPrimaryGamepad() {
        if (!this.primaryPad && this.input.gamepad) {
            const gamepads = this.input.gamepad.getAll();
            if (gamepads.length > 0) {
                this.primaryPad = gamepads.find((pad) => pad && pad.connected) || gamepads[0];
                this.primaryPadId = `${this.primaryPad?.id || 'pad'}:${this.primaryPad?.index || 0}`;
            }
        }
        return this.primaryPad;
    }

    getAxisValue(pad, axisIndex) {
        if (!pad || !Array.isArray(pad.axes) || !pad.axes[axisIndex]) return 0;
        const axis = pad.axes[axisIndex];
        if (typeof axis.getValue === 'function') return axis.getValue();
        if (typeof axis.value === 'number') return axis.value;
        return 0;
    }

    /**
     * Ayudante para detectar botón del gamepad presionado
     */
    isGamepadButtonDown(pad, buttonIndex) {
        if (!pad) return false;
        return !!this._gamepadButtonDown[buttonIndex];
    }

    /**
     * Ayudante para detectar botón del gamepad acabado de presionar
     */
    isGamepadButtonJustDown(pad, buttonIndex) {
        if (!pad) return false;
        return !!this._gamepadButtonJustDown[buttonIndex];
    }

    /**
     * Ayudante para detectar botón del gamepad liberado
     */
    isGamepadButtonJustUp(pad, buttonIndex) {
        if (!pad) return false;
        return !!this._gamepadButtonJustUp[buttonIndex];
    }

    /**
     * Manejador de conexión del gamepad
     */
    onGamepadButtonDown(pad, button, index) {
        // Aquí se pueden agregar efectos de vibración u otros
    }

    /**
     * Manejador de desconexión del gamepad
     */
    onGamepadButtonUp(pad, button, index) {
        // Aquí se pueden agregar efectos visuales
    }

    /**
     * Actualiza el estado del input manager (llamado en cada update)
     */
    update() {
        // Verificar si hay un gamepad conectado
        if (this.input.gamepad) {
            const gamepads = this.input.gamepad.getAll();
            if (gamepads.length > 0) {
                this.gamepadConnected = true;
                this.primaryPad = gamepads.find((pad) => pad && pad.connected) || gamepads[0];
                this.primaryPadId = `${this.primaryPad?.id || 'pad'}:${this.primaryPad?.index || 0}`;
            } else {
                this.gamepadConnected = false;
                this.primaryPad = null;
                this.primaryPadId = null;
            }

            if (this.gamepadConnected !== this.lastGamepadConnected) {
                if (this.gamepadConnected) {
                    console.log('[INPUT] Gamepad conectado:', this.primaryPad?.id || 'desconocido');
                } else {
                    console.log('[INPUT] Gamepad desconectado');
                }
                this.lastGamepadConnected = this.gamepadConnected;
            }

            this._pollPrimaryGamepadButtons();
            this._updateActiveInputModeFromGamepad();
        }
    }

    _updateActiveInputModeFromGamepad() {
        const pad = this.getPrimaryGamepad();
        if (!pad) return;

        const anyButtonPressed = Object.values(this._gamepadButtonDown).some(Boolean);
        const leftStickX = this.getAxisValue(pad, 0);
        const leftStickY = this.getAxisValue(pad, 1);
        const rightStickX = this.getAxisValue(pad, 2);
        const rightStickY = this.getAxisValue(pad, 3);
        const axisActive = Math.abs(leftStickX) > 0.3 || Math.abs(leftStickY) > 0.3 || Math.abs(rightStickX) > 0.3 || Math.abs(rightStickY) > 0.3;

        if (anyButtonPressed || axisActive) {
            this._setActiveInputMode('gamepad');
        }
    }

    _pollPrimaryGamepadButtons() {
        const pad = this.getPrimaryGamepad();
        const buttonIndexes = [
            XBOX_BUTTONS.A,
            XBOX_BUTTONS.B,
            XBOX_BUTTONS.X,
            XBOX_BUTTONS.Y,
            XBOX_BUTTONS.LB,
            XBOX_BUTTONS.RB,
            XBOX_BUTTONS.LT,
            XBOX_BUTTONS.RT,
            XBOX_BUTTONS.DPAD_UP,
            XBOX_BUTTONS.DPAD_DOWN,
            XBOX_BUTTONS.DPAD_LEFT,
            XBOX_BUTTONS.DPAD_RIGHT,
        ];

        const nextDown = {};
        const nextJustDown = {};
        const nextJustUp = {};

        for (const buttonIndex of buttonIndexes) {
            const isDown = this._readGamepadButtonDown(pad, buttonIndex);
            const wasDown = !!this._previousGamepadButtonDown[buttonIndex];

            nextDown[buttonIndex] = isDown;
            nextJustDown[buttonIndex] = isDown && !wasDown;
            nextJustUp[buttonIndex] = !isDown && wasDown;

            // Debug logging para D-pad y botón X
            if (buttonIndex >= 12) { // D-pad (12-15)
                if (nextJustDown[buttonIndex]) {
                    console.log(`[GAMEPAD POLL] D-pad button ${buttonIndex} JustDown detected`);
                }
            }
            if (buttonIndex === XBOX_BUTTONS.X && nextJustDown[buttonIndex]) {
                console.log(`[GAMEPAD POLL] Botón X JustDown detected`);
            }
        }

        this._gamepadButtonDown = nextDown;
        this._gamepadButtonJustDown = nextJustDown;
        this._gamepadButtonJustUp = nextJustUp;
        this._previousGamepadButtonDown = nextDown;
    }

    _readGamepadButtonDown(pad, buttonIndex) {
        if (!pad || !pad.buttons || !pad.buttons[buttonIndex]) return false;
        const button = pad.buttons[buttonIndex];
        return !!(button.pressed || (typeof button.value === 'number' && button.value > 0.5));
    }

    /**
     * Obtiene información de depuración
     */
    getDebugInfo() {
        const pad = this.getPrimaryGamepad();
        let info = 'INPUT: ';

        if (pad) {
            info += `[GAMEPAD] LStick(${pad.axes[0].getValue().toFixed(2)}, ${pad.axes[1].getValue().toFixed(2)}) `;
            info += `RStick(${pad.axes[2].getValue().toFixed(2)}, ${pad.axes[3].getValue().toFixed(2)})`;
        } else {
            info += '[KEYBOARD]';
        }

        return info;
    }
}
