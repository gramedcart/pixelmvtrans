"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const electron_1 = require("electron");
const perf_hooks_1 = require("perf_hooks");
const mainWindow_1 = require("./mainWindow");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function findKey(dir) {
    const infoJson = path_1.default.join(dir, 'data', 'info.json');
    const d = JSON.parse(fs_1.default.readFileSync(infoJson, 'utf-8')).key;
    return new Uint8Array(Buffer.from(d, 'base64'));
}
async function initProject(sourceDir, gameDir) {
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
                resolve(b64a);
            });
        });
    }
    const nau = perf_hooks_1.performance.now();
    const tempStorage = (path_1.default.join(electron_1.app.getPath("appData"), electron_1.app.getName()));
    const dir = path_1.default.join(sourceDir, 'Resources');
    console.log('init');
    const projectDir = path_1.default.join(dir, "data", "project.json");
    const tempProject = path_1.default.join(tempStorage, 'prj.json');
    const Unkey = JSON.parse(fs_1.default.readFileSync(path_1.default.join(dir, "data", "info.json"), 'utf-8')).key;
    const key = iconv_lite_1.default.encode(await getKey(Unkey), "utf-8").toString('base64');
    await decrypt(tempStorage);
    globalThis.sourceDir = sourceDir;
    const dat = JSON.parse((fs_1.default.readFileSync(tempProject, 'utf-8')).replaceAll('\u0000', ''));
    globalThis.project = dat;
    console.log('Decrypt Success');
    if (perf_hooks_1.performance.now() - nau < 1000) {
        console.log('waiting..');
        await sleep(1000);
    }
    mainWindow_1.mwindow.webContents.send("open", { project: globalThis.project });
    console.log('open');
}
exports.initProject = initProject;
