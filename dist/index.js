import {controllerConnected, controllerDisconnected} from "./gamepad.js";
window.addEventListener("gamepadconnected", controllerConnected);
window.addEventListener("gamepaddisconnected", controllerDisconnected);
