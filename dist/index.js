import Bowser from "../_snowpack/pkg/bowser.js";
import {controllerConnected, controllerDisconnected, startUpdating} from "./gamepad-update.js";
import {queryDocument} from "./query.js";
const browser = Bowser.getParser(navigator.userAgent).getBrowser();
queryDocument("#browser-version").innerText = `${browser.name} ${browser.version}`;
window.addEventListener("gamepadconnected", controllerConnected);
window.addEventListener("gamepaddisconnected", controllerDisconnected);
startUpdating();
