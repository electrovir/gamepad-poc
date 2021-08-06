import {createGamepadView, notSupportedView, removeGamepadView, updateView} from "./gamepad-view.js";
const globalGamepads = {};
export function controllerConnected(gamepadEvent) {
  initGamepad(gamepadEvent.gamepad);
}
function initGamepad(gamepad) {
  console.info(`adding gamepad ${gamepad.index}`, gamepad);
  globalGamepads[gamepad.index] = gamepad;
  createGamepadView(gamepad);
}
function updateGamepad(gamepad) {
  if (globalGamepads[gamepad.index] !== gamepad) {
    globalGamepads[gamepad.index] = gamepad;
  }
}
export function controllerDisconnected(gamepadEvent) {
  removeGamepad(gamepadEvent.gamepad);
}
function removeGamepad(gamepad) {
  delete globalGamepads[gamepad.index];
  removeGamepadView(gamepad);
}
export function startUpdating() {
  const internalNavigator = getNavigator();
  if ("webkitGamepads" in internalNavigator || "getGamepads" in internalNavigator) {
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
function getNavigator() {
  return navigator;
}
function getGamepads() {
  const internalNavigator = getNavigator();
  const gamepads = Array.from("webkitGetGamepads" in internalNavigator ? internalNavigator.webkitGetGamepads() : internalNavigator.getGamepads());
  return gamepads.filter((gamepad) => !!gamepad);
}
function updateGamepadObjects() {
  const currentGamepads = getGamepads();
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
