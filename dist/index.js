import {controllerConnected, controllerDisconnected} from "./gamepad-update.js";
window.addEventListener("gamepadconnected", controllerConnected);
window.addEventListener("gamepaddisconnected", controllerDisconnected);
