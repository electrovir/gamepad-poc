import {createGamepadView, removeGamepadView, updateView} from './gamepad-view';

const haveEvents = 'ongamepadconnected' in window;
const globalGamepads: Record<number, Gamepad> = {};

export function controllerConnected(gamepadEvent: GamepadEvent) {
    addGamepad(gamepadEvent.gamepad);
}

function addGamepad(gamepad: Gamepad) {
    console.info(`adding gamepad ${gamepad.index}`, gamepad);
    globalGamepads[gamepad.index] = gamepad;

    createGamepadView(gamepad);

    requestAnimationFrame(updateStatus);
}

export function controllerDisconnected(gamepadEvent: GamepadEvent) {
    removeGamepad(gamepadEvent.gamepad);
}

function removeGamepad(gamepad: Gamepad) {
    delete globalGamepads[gamepad.index];
    removeGamepadView(gamepad);
}

function updateStatus() {
    if (!haveEvents) {
        scanGamepads();
    }

    Object.values(globalGamepads).forEach((gamepad) => {
        updateView(gamepad);
    });

    requestAnimationFrame(updateStatus);
}

function scanGamepads() {
    const currentGamepads: Gamepad[] = navigator.getGamepads
        ? // array from needed for Chrome which does not give us an actual array here
          Array.from(navigator.getGamepads())
        : (navigator as any).webkitGetGamepads
        ? (navigator as any).webkitGetGamepads()
        : [];
    currentGamepads.forEach((gamepad) => {
        if (gamepad) {
            if (gamepad.index in globalGamepads) {
                globalGamepads[gamepad.index] = gamepad;
            } else {
                addGamepad(gamepad);
            }
        }
    });
}

if (!haveEvents) {
    setInterval(scanGamepads, 500);
}
