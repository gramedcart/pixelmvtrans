"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const electron_1 = require("electron");
const mainWindow_1 = require("./mainWindow");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const translator_1 = require("./translator");
function fontApply(dir) {
    const FontDir = path_1.default.join(dir, "fonts");
    const d = fs_1.default.readdirSync(FontDir);
    if (!d.includes("HangulHelper.dat")) {
        const ttf = fs_1.default.readFileSync(path_1.default.join(globalThis.oPath, 'ext', 'font', 'font.ttf'));
        const otf = fs_1.default.readFileSync(path_1.default.join(globalThis.oPath, 'ext', 'font', 'font.otf'));
        for (const i in d) {
            const da = path_1.default.parse(d[i]);
            if (da.ext === '.ttf') {
                fs_1.default.writeFileSync(path_1.default.join(FontDir, d[i]), ttf);
            }
            if (da.ext === '.otf') {
                fs_1.default.writeFileSync(path_1.default.join(FontDir, d[i]), otf);
            }
        }
        fs_1.default.writeFileSync(path_1.default.join(FontDir, 'hangul.ttf'), ttf);
        fs_1.default.writeFileSync(path_1.default.join(FontDir, "HangulHelper.dat"), Buffer.from("HangulHelper from PixelMVTrans"));
    }
}
function init() {
    electron_1.ipcMain.on("saver", async (ev, arg) => {
        console.log("saving");
        const dir = path_1.default.join(sourceDir, 'Resources');
        const projectDir = path_1.default.join(dir, "data", "project.json");
        const a = JSON.stringify(arg.project, null, 1);
        fs_1.default.writeFileSync(projectDir, a, 'utf-8');
        fontApply(dir);
        console.log("saved");
        mainWindow_1.mwindow.webContents.send('alert', '저장되었습니다');
    });
    electron_1.ipcMain.on("translator", async (ev, arg) => {
        let trans = new translator_1.Translator();
        const c = await trans.init();
        if (!c) {
            mainWindow_1.mwindow.webContents.send("error", "Eztrans 실행 도중 오류가 발생했습니다.<br>보안프로그램등을 확인해 주세요");
        }
        let Translated = arg;
        for (let i = 0; i < arg.length; i++) {
            if (Translated[i][0] === 'undefined' || Translated[i][0] === undefined) {
                console.log('undefined');
                continue;
            }
            Translated[i][0] = await trans.translate(arg[i][0]);
            if (i % 10 == 0) {
                console.log(i);
                mainWindow_1.mwindow.webContents.send("transper", `${Math.round(i / arg.length * 10000) / 100}%`);
            }
            if (Translated[i][0].length === 0) {
                console.log('replacer');
                Translated[i][0] = arg[i][0];
            }
        }
        mainWindow_1.mwindow.webContents.send("transData", arg);
    });
}
exports.init = init;
