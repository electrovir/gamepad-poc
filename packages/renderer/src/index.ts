import Bowser from 'bowser';
import {controllerConnected, controllerDisconnected, startUpdating} from './gamepad-update';
import {queryDocument} from './query';

const browser = Bowser.getParser(navigator.userAgent).getBrowser();
queryDocument('#browser-version').innerText = `${browser.name} ${browser.version}`;

window.addEventListener('gamepadconnected', controllerConnected);
window.addEventListener('gamepaddisconnected', controllerDisconnected);

startUpdating();
