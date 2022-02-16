import { B as Bowser } from "./vendor.d5384fdf.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var GamepadHapticActuatorType = /* @__PURE__ */ ((GamepadHapticActuatorType2) => {
  GamepadHapticActuatorType2["dualRumble"] = "dual-rumble";
  return GamepadHapticActuatorType2;
})(GamepadHapticActuatorType || {});
function activateRumble(gamepad) {
  const rumble = { duration: 500, intensity: 1 };
  if ("hapticActuators" in gamepad) {
    gamepad.hapticActuators.forEach((actuator) => {
      actuator.pulse(rumble.intensity, rumble.duration);
    });
  } else if ("vibrationActuator" in gamepad) {
    gamepad.vibrationActuator.playEffect(GamepadHapticActuatorType.dualRumble, {
      duration: rumble.duration,
      weakMagnitude: rumble.intensity,
      strongMagnitude: rumble.intensity
    });
  }
}
function readButtonValue(button) {
  if (typeof button === "number") {
    return {
      pressed: button > 0,
      value: button
    };
  } else {
    return {
      pressed: button.pressed || button.touched,
      value: button.value
    };
  }
}
function queryDocument(query) {
  const queryResult = document.querySelector(query);
  if (!(queryResult instanceof HTMLElement)) {
    throw new Error(`No match for query "${query}"`);
  }
  return queryResult;
}
function queryDocumentAll(query) {
  const queryResults = document.querySelectorAll(query);
  const filteredQueries = Array.from(queryResults).filter((queryResult) => queryResult instanceof HTMLElement);
  const diff = queryResults.length - filteredQueries.length;
  if (diff) {
    throw new Error(`${diff} query matches were invalid "${query}"`);
  }
  return filteredQueries;
}
function getGamepadDisplayValue(rawValue) {
  if (Array.isArray(rawValue)) {
    return `Array(${rawValue.length})`;
  } else if (rawValue && typeof rawValue === "object") {
    return `${rawValue.constructor.name}`;
  } else if (typeof rawValue === "string") {
    return `"${rawValue}"`;
  } else {
    return rawValue;
  }
}
function getGamepadInfo(gamepad) {
  return Object.keys(gamepad.constructor.prototype).map((gamepadKey) => {
    return `<tr><th>${gamepadKey}:</th><td>${getGamepadDisplayValue(gamepad[gamepadKey])}</td></tr>`;
  }).join("");
}
function hasRumble(gamepad) {
  return "hapticActuators" in gamepad && !!gamepad.hapticActuators.length || "vibrationActuator" in gamepad && !!gamepad.vibrationActuator;
}
function removeGamepadView(gamepad) {
  const controllerDiv = document.getElementById("controller" + gamepad.index);
  controllerDiv && document.body.removeChild(controllerDiv);
  if (!queryDocumentAll(".controller").length) {
    const start = document.getElementById("start");
    if (start) {
      start.style.display = "";
    }
  }
}
function createGamepadView(gamepad) {
  const controllerDiv = document.createElement("div");
  controllerDiv.setAttribute("id", "controller" + gamepad.index);
  controllerDiv.classList.add("controller");
  const controllerTitle = document.createElement("table");
  controllerTitle.innerHTML = getGamepadInfo(gamepad);
  controllerDiv.appendChild(controllerTitle);
  const rumbleButton = document.createElement("button");
  if (!hasRumble(gamepad)) {
    rumbleButton.disabled = true;
    rumbleButton.title = "Not supported by this browser and/or controller.";
  }
  rumbleButton.classList.add("rumble-button");
  rumbleButton.onclick = () => activateRumble(gamepad);
  rumbleButton.innerText = "Rumble";
  controllerDiv.appendChild(rumbleButton);
  const allButtonsDiv = document.createElement("div");
  allButtonsDiv.className = "buttons";
  gamepad.buttons.forEach((button, index) => {
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "button";
    const backgroundSpan = document.createElement("span");
    backgroundSpan.classList.add("button-background");
    buttonDiv.appendChild(backgroundSpan);
    const buttonTextSpan = document.createElement("span");
    buttonTextSpan.classList.add("button-text");
    buttonTextSpan.innerHTML = String(index);
    buttonDiv.appendChild(buttonTextSpan);
    allButtonsDiv.appendChild(buttonDiv);
  });
  controllerDiv.appendChild(allButtonsDiv);
  const allAxesDiv = document.createElement("div");
  allAxesDiv.className = "axes";
  gamepad.axes.forEach((axis, index) => {
    const axisSlider = document.createElement("progress");
    axisSlider.className = "axis";
    axisSlider.setAttribute("max", "2");
    axisSlider.setAttribute("value", "1");
    axisSlider.innerHTML = String(index);
    allAxesDiv.appendChild(axisSlider);
  });
  controllerDiv.appendChild(allAxesDiv);
  const start = queryDocument("#start");
  start.style.display = "none";
  document.body.appendChild(controllerDiv);
}
function notSupportedView() {
  const start = queryDocument("#start");
  start.style.display = "none";
  const notSupportedHeader = document.createElement("h1");
  notSupportedHeader.innerHTML = "Your browser does not support gamepads.";
  notSupportedHeader.classList.add("error");
  document.body.appendChild(notSupportedHeader);
}
function updateView(gamepad) {
  const controllerId = `#controller${gamepad.index}`;
  gamepad.buttons.forEach((button, buttonIndex) => {
    const buttonSelector = `${controllerId} .button:nth-child(${buttonIndex + 1})`;
    const buttonDiv = queryDocument(buttonSelector);
    const buttonBackgroundSpan = queryDocument(`${buttonSelector} .button-background`);
    const { value, pressed } = readButtonValue(button);
    const pct = `${Math.round(value * 100)}%`;
    buttonBackgroundSpan.style.width = pct;
    buttonBackgroundSpan.style.height = pct;
    if (pressed) {
      buttonDiv.className = "button pressed";
    } else {
      buttonDiv.className = "button";
    }
  });
  gamepad.axes.forEach((axis, axisIndex) => {
    const axisSlider = queryDocument(`${controllerId} .axis:nth-child(${axisIndex + 1})`);
    const newHtml = `${axisIndex}:: ${axis.toFixed(4)}`;
    const oldHtml = axisSlider.innerHTML;
    if (newHtml !== oldHtml) {
      axisSlider.innerHTML = newHtml;
    }
    const newValue = String(axis + 1);
    const oldValue = axisSlider.getAttribute("value");
    if (oldValue !== newValue) {
      axisSlider.setAttribute("value", String(axis + 1));
    }
  });
}
const globalGamepads = {};
function controllerConnected(gamepadEvent) {
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
function controllerDisconnected(gamepadEvent) {
  removeGamepad(gamepadEvent.gamepad);
}
function removeGamepad(gamepad) {
  delete globalGamepads[gamepad.index];
  removeGamepadView(gamepad);
}
function startUpdating() {
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
const browser = Bowser.getParser(navigator.userAgent).getBrowser();
queryDocument("#browser-version").innerText = `${browser.name} ${browser.version}`;
window.addEventListener("gamepadconnected", controllerConnected);
window.addEventListener("gamepaddisconnected", controllerDisconnected);
startUpdating();
//# sourceMappingURL=index.c5d3fbe0.js.map
