"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMwindow = exports.mwindow = void 0;
const electron_1 = require("electron");
function setupMwindow() {
    exports.mwindow = new electron_1.BrowserWindow({
        width: 800,
        height: 450,
        minWidth: 800,
        minHeight: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        icon: globalThis.iconPath
    });
}
exports.setupMwindow = setupMwindow;
