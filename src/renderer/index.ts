import {controllerConnected, controllerDisconnected, startUpdating} from './gamepad-update';

window.addEventListener('gamepadconnected', controllerConnected);
window.addEventListener('gamepaddisconnected', controllerDisconnected);

startUpdating();
