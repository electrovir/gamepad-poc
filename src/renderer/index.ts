import {controllerConnected, controllerDisconnected} from './gamepad';

window.addEventListener('gamepadconnected', controllerConnected);
window.addEventListener('gamepaddisconnected', controllerDisconnected);
