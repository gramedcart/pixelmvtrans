"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const electron_1 = require("electron");
const perf_hooks_1 = require("perf_hooks");
const mainWindow_1 = require("./mainWindow");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function initProject(sourceDir, gameDir) {
    try {
        function decrypt(tempStorage) {
            return new Promise((resolve) => {
                try {
                    const d = (fs_1.default.readFileSync(projectDir, 'utf-8')).replaceAll('\u0000', '');
                    JSON.parse(d);
                    console.log('already decrypted');
                    fs_1.default.writeFileSync(tempProject, d);
                    resolve();
                }
                catch (error) {
                    const pypy = `${path_1.default.join(globalThis.oPath, 'ext', 'python', 'pypy', 'pypy.exe')}`;
                    const de = (0, child_process_1.spawn)(pypy, [
                        path_1.default.join(globalThis.oPath, 'ext', 'python', 'unpack2.py'), `${projectDir}`, `${tempProject}`, `${key}`
                    ]);
                    de.stdout.on('data', (d) => {
                        console.log(d.toString('ascii'));
                    });
                    de.on("exit", (msg) => {
                        resolve();
                    });
                }
            });
        }
        function getKey(Unkey) {
            return new Promise((resolve) => {
                const pypy = `${path_1.default.join(globalThis.oPath, 'ext', 'python', 'pypy', 'pypy.exe')}`;
                const de = (0, child_process_1.spawn)(pypy, [
                    path_1.default.join(globalThis.oPath, 'ext', 'python', 'unpack.py'), `${Unkey}`
                ]);
                de.stdout.on("data", (str) => {
                    str = str.subarray(0, str.indexOf(0));
                    const b64a = str.toString('ascii');
                    console.log(b64a);
                    resolve(Buffer.from(b64a, 'base64'));
                });
            });
        }
        const nau = perf_hooks_1.performance.now();
        const tempStorage = (path_1.default.join(electron_1.app.getPath("appData"), electron_1.app.getName()));
        const dir = path_1.default.join(sourceDir, 'Resources');
        console.log('init');
        const projectDir = path_1.default.join(dir, "data", "project.json");
        const tempProject = path_1.default.join(tempStorage, 'prj.json');
        if (fs_1.default.existsSync(tempProject)) {
            fs_1.default.rmSync(tempProject);
        }
        const Unkey = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dir, "data", "info.json"), 'utf-8')).key;
        const key2 = await getKey(Unkey);
        console.log(`|${key2.toString('ascii')}|`);
        const key = key2.toString('base64');
        console.log(key);
        console.log(tempProject);
        console.log(projectDir);
        await decrypt(tempStorage);
        globalThis.sourceDir = sourceDir;
        const dat = JSON.parse((fs_1.default.readFileSync(tempProject, 'utf-8')).replaceAll('\u0000', ''));
        globalThis.project = dat;
        console.log('Decrypt Success');
        if (perf_hooks_1.performance.now() - nau < 1000) {
            console.log('waiting..');
            await sleep(1000);
        }
        const q = dat.fontList;
        for (const i in q) {
            function changer(d) {
                d.fontName = 'hangul';
                d.imageFontFlag = false;
                d.imageId = -1;
                d.letterLayout = '';
                d.ttfName = 'hangul';
                d.antialiasDisabled = false;
                if (d.localeSettings !== undefined) {
                    if (d.localeSettings.en_US !== undefined) {
                        d.localeSettings.en_US = changer(d.localeSettings.en_US);
                    }
                    if (d.localeSettings.ja_JP !== undefined) {
                        d.localeSettings.ja_JP = changer(d.localeSettings.ja_JP);
                    }
                }
                return d;
            }
            q[i] = changer(q[i]);
        }
        mainWindow_1.mwindow.webContents.send("open", { project: globalThis.project });
        console.log('open');
    }
    catch (error) {
        console.log(error);
        mainWindow_1.mwindow.webContents.send("warn", "오류가 발생했습니다");
    }
}
exports.initProject = initProject;
