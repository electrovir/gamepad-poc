import {controllerConnected, controllerDisconnected} from './gamepad-update';

window.addEventListener('gamepadconnected', controllerConnected);
window.addEventListener('gamepaddisconnected', controllerDisconnected);
