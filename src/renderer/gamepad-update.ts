import {ChromeNavigator, OldChromeNavigator} from './chrome-gamepad';
import {createGamepadView, notSupportedView, removeGamepadView, updateView} from './gamepad-view';

const globalGamepads: Record<number, Gamepad> = {};

export function controllerConnected(gamepadEvent: GamepadEvent) {
    initGamepad(gamepadEvent.gamepad);
}

function initGamepad(gamepad: Gamepad) {
    console.info(`adding gamepad ${gamepad.index}`, gamepad);
    globalGamepads[gamepad.index] = gamepad;

    createGamepadView(gamepad);
}

function updateGamepad(gamepad: Gamepad) {
    // only need to update if the references are different
    if (globalGamepads[gamepad.index] !== gamepad) {
        // this line will be called in Chrome whenever a gamepad is updated but never in Safari
        globalGamepads[gamepad.index] = gamepad;
    }
}

export function controllerDisconnected(gamepadEvent: GamepadEvent) {
    removeGamepad(gamepadEvent.gamepad);
}

function removeGamepad(gamepad: Gamepad) {
    delete globalGamepads[gamepad.index];
    removeGamepadView(gamepad);
}

export function startUpdating() {
    const internalNavigator = getNavigator();
    if ('webkitGamepads' in internalNavigator || 'getGamepads' in internalNavigator) {
        updateStatus();
    } else {
        notSupportedView();
    }
}

function updateStatus() {
    updateGamepadObjects();

    Object.values(globalGamepads).forEach((gamepad) => {
        updateView(gamepad);
    });

    requestAnimationFrame(updateStatus);
}

/** Different navigator types to support different browsers */
function getNavigator(): OldChromeNavigator | ChromeNavigator | Navigator {
    return navigator;
}

function getGamepads(): Gamepad[] {
    const internalNavigator = getNavigator();

    const gamepads = Array.from(
        'webkitGetGamepads' in internalNavigator
            ? internalNavigator.webkitGetGamepads()
            : internalNavigator.getGamepads(),
    );

    return gamepads.filter((gamepad): gamepad is Gamepad => !!gamepad);
}

/**
 * Some browsers (Chrome) do not add updated data inside the same gamepad instance that we initially
 * get in the connection events. (Essentially the gamepad instances are immutable so they construct
 * new ones for every update.) Safari, on the other hand, will keep the same object references (it
 * never needs to update globalGamepads) but it won't update those references until
 * navigator.getGamepads is called.
 */
function updateGamepadObjects() {
    const currentGamepads: Gamepad[] = getGamepads();
    currentGamepads.forEach((gamepad) => {
        if (gamepad) {
            if (gamepad.index in globalGamepads) {
                updateGamepad(gamepad);
            } else {
                initGamepad(gamepad);
            }
        }
    });
}
