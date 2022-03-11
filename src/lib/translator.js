"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translator = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const detect_port_1 = __importDefault(require("detect-port"));
const axios_1 = __importDefault(require("axios"));
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const reg = /\\.\[.+\]|\\.\[\]/g;
class Translator {
    constructor() {
        this.process = (0, child_process_1.spawn)(path_1.default.join(oPath, "ext", "eztrans", "EztransServer.exe"));
    }
    async init() {
        console.log("translator init");
        await sleep(2000);
        if (await (0, detect_port_1.default)(8000) !== 8000) {
            return false;
        }
        return true;
    }
    async translate(text) {
        function checker(str) {
            const qstr = (str.normalize());
            return (str.includes('\\') ||
                str.includes('?'));
        }
        try {
            text = text.replaceAll('？', '■');
            // text = text.replaceAll('?', '■')
            if (checker(text)) {
                console.log('skip regex');
                return text;
            }
            const a = await axios_1.default.get('http://localhost:8000/', {
                params: {
                    text: text
                },
                timeout: 1000
            });
            const c = a.data;
            // if(c.includes('?')){
            //     console.log('includes unknown')
            //     return text
            // }
            return c.replaceAll('■', '？');
        }
        catch (error) {
            console.log(text);
            console.log(text.length);
            try {
                console.log(await (0, detect_port_1.default)(8000));
                try {
                    this.process.kill();
                }
                catch (error) {
                    console.log('error when killing');
                }
                this.process = (0, child_process_1.spawn)(path_1.default.join(oPath, "ext", "eztrans", "EztransServer.exe"));
                console.log('new pro');
                await sleep(3000);
            }
            catch (error) { }
            return text;
        }
    }
}
exports.Translator = Translator;
