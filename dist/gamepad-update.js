import {createGamepadView, removeGamepadView, updateView} from "./gamepad-view.js";
const haveEvents = "ongamepadconnected" in window;
const globalGamepads = {};
export function controllerConnected(gamepadEvent) {
  addGamepad(gamepadEvent.gamepad);
}
function addGamepad(gamepad) {
  console.info(`adding gamepad ${gamepad.index}`, gamepad);
  globalGamepads[gamepad.index] = gamepad;
  createGamepadView(gamepad);
  requestAnimationFrame(updateStatus);
}
export function controllerDisconnected(gamepadEvent) {
  removeGamepad(gamepadEvent.gamepad);
}
function removeGamepad(gamepad) {
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
  const currentGamepads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [];
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
