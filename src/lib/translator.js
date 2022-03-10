"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translator = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class Translator {
    constructor() {
        this.process = (0, child_process_1.spawn)(path_1.default.join(oPath, "ext", "eztrans", "EztransServer.exe"));
    }
    async init() {
        console.log("translator init");
        await sleep(2000);
        return true;
    }
    async translate(text) {
        try {
            const a = await axios_1.default.get('http://localhost:8000/', {
                params: {
                    text: text
                },
                timeout: 10000
            });
            return a.data;
        }
        catch (error) {
            return text;
        }
    }
}
exports.Translator = Translator;
