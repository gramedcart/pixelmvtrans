import path, { resolve } from "path"
import fs from "fs"
import { spawn } from "child_process"
import iconv from "iconv-lite"
import { app } from "electron"
import { performance } from 'perf_hooks'
import { mwindow } from "./mainWindow"

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function findKey(dir:string){
    const infoJson = path.join(dir, 'data', 'info.json')
    const d:string = JSON.parse(fs.readFileSync(infoJson, 'utf-8')).key
    return new Uint8Array(Buffer.from(d, 'base64'))
}

export async function initProject(sourceDir:string, gameDir:string){
    function decrypt(tempStorage:string){
        return new Promise<void>((resolve) => {
            try {
                const d = (fs.readFileSync(projectDir, 'utf-8')).replaceAll('\u0000', '')
                JSON.parse(d)
                console.log('already decrypted')
                fs.writeFileSync(tempProject, d)
                resolve()
            } catch (error) {
                const pypy = `${path.join(globalThis.oPath, 'ext', 'python', 'pypy', 'pypy.exe')}`
                const de = spawn(pypy, [
                    path.join(globalThis.oPath, 'ext', 'python', 'unpack2.py'), `${projectDir}`, `${tempProject}`, `${key}`
                ])
                de.on("exit", (msg) => {
                    resolve()
                })
            }
        })
    }
    function getKey(Unkey: string){
        return new Promise<string>((resolve) => {
            const pypy = `${path.join(globalThis.oPath, 'ext', 'python', 'pypy', 'pypy.exe')}`
            const de = spawn(pypy, [
                path.join(globalThis.oPath, 'ext', 'python', 'unpack.py'), `${Unkey}`
            ])
            de.stdout.on("data", (str:Buffer) => {
                str = str.subarray(0, str.indexOf(0))
                const b64a = str.toString('ascii')
                resolve(b64a)
            })
        })
    }
    const nau = performance.now()
    const tempStorage = (path.join(app.getPath("appData"), app.getName()))
    const dir = path.join(sourceDir, 'Resources')
    console.log('init')
    const projectDir = path.join(dir, "data", "project.json")
    const tempProject = path.join(tempStorage, 'prj.json')
    const Unkey:string = JSON.parse(fs.readFileSync(path.join(dir, "data", "info.json"), 'utf-8')).key
    const key = iconv.encode(await getKey(Unkey), "utf-8").toString('base64')
    await decrypt(tempStorage)
    globalThis.sourceDir = sourceDir
    const dat:ProjectJSON = JSON.parse((fs.readFileSync(tempProject, 'utf-8')).replaceAll('\u0000', ''))
    globalThis.project = dat
    console.log('Decrypt Success')
    if(performance.now() - nau < 1000){
        console.log('waiting..')
        await sleep(1000)
    }
    mwindow.webContents.send("open", {project: globalThis.project})
    console.log('open');
}