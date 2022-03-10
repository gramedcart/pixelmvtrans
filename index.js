"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const openFiles = __importStar(require("./src/lib/openfiles"));
const mainWindow_1 = require("./src/lib/mainWindow");
const packed_1 = require("./lib/packed");
const path_1 = __importDefault(require("path"));
// require('electron-reload')(__dirname);
globalThis.iconPath = path_1.default.join(__dirname, 'res', 'icon.png');
const createWindow = () => {
    (0, mainWindow_1.setupMwindow)();
    mainWindow_1.mwindow.loadFile('public/index.html');
};
function oPath() {
    if ((0, packed_1.isPackaged)()) {
        globalThis.oPath = process.resourcesPath;
    }
    else {
        globalThis.oPath = __dirname;
    }
}
oPath();
openFiles.main();
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => electron_1.app.quit());
