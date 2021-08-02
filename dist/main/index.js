var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/electron-snowpack/index.js
var require_electron_snowpack = __commonJS({
  "node_modules/electron-snowpack/index.js"(exports2) {
    var path2 = require("path");
    exports2.getAssetURL = (asset) => {
      return true ? new URL(asset, `http://localhost:${"61016"}/`).toString() : new URL(`file:///${path2.join(__dirname, asset)}`).href;
    };
  }
});

// src/main/index.ts
var import_electron = __toModule(require("electron"));
var import_electron_snowpack = __toModule(require_electron_snowpack());
var path = require("path");
var mainWindow;
function createMainWindow() {
  const window = new import_electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  if (true) {
    window.webContents.openDevTools();
  }
  window.loadURL((0, import_electron_snowpack.getAssetURL)("index.html"));
  window.on("closed", () => {
    mainWindow = null;
  });
  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });
  return window;
}
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});
import_electron.app.on("ready", () => {
  mainWindow = createMainWindow();
});
