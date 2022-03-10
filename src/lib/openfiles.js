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
exports.main = void 0;
const electron_1 = require("electron");
const mainWindow_1 = require("./mainWindow");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const projectBuilder_1 = require("./projectBuilder");
const open_1 = __importDefault(require("open"));
const saver = __importStar(require("./projectSaver"));
function getPixelGame() {
    const d = electron_1.dialog.showOpenDialogSync(mainWindow_1.mwindow, { properties: ['openFile'], filters: [
            { name: 'Pixel MV Game', extensions: ['exe'] }
        ] });
    if (d === undefined) {
        return null;
    }
    const dir = path_1.default.dirname(d[0]);
    if ((0, fs_1.existsSync)(path_1.default.join(dir, 'Resources', 'data')) && path_1.default.join(dir, 'Resources', 'img')) {
        return { dir: dir, d: d };
    }
    else {
        return null;
    }
}
function main() {
    electron_1.ipcMain.on("newProj", () => {
        const d2 = getPixelGame();
        if (d2 !== null) {
            const { dir, d } = d2;
            console.log(dir);
            mainWindow_1.mwindow.webContents.send('cProject');
            (0, projectBuilder_1.initProject)(dir, d[0]);
        }
        else {
            mainWindow_1.mwindow.webContents.send('warn', 'PIXEL MV 게임 파일이 아닙니다');
        }
    });
    electron_1.ipcMain.on("openFindKeyPage", (ev, arg) => {
        (0, open_1.default)("https://github.com/gramedcart/pixelmvtrans/wiki/%EB%B3%B5%ED%98%B8%ED%99%94-%ED%82%A4%EA%B0%92-%EC%96%BB%EA%B8%B0");
    });
    electron_1.ipcMain.on("dotnet", async () => {
        (0, open_1.default)(`https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-desktop-6.0.1-windows-x86-installer`);
    });
    saver.init();
    electron_1.ipcMain.on("setImportIt", (ev, arg) => {
    });
}
exports.main = main;
