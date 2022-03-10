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

export async function initProject(sourceDir:string, gameDir:string){
    try {
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
    
                    de.stdout.on('data', (d:Buffer) => {
                        console.log(d.toString('ascii'))
                    })
                    de.on("exit", (msg) => {
                        resolve()
                    })
                }
            })
        }
        function getKey(Unkey: string){
            return new Promise<Buffer>((resolve) => {
                const pypy = `${path.join(globalThis.oPath, 'ext', 'python', 'pypy', 'pypy.exe')}`
                const de = spawn(pypy, [
                    path.join(globalThis.oPath, 'ext', 'python', 'unpack.py'), `${Unkey}`
                ])
                de.stdout.on("data", (str:Buffer) => {
                    str = str.subarray(0, str.indexOf(0))
                    const b64a = str.toString('ascii')
                    console.log(b64a)
                    resolve(Buffer.from(b64a, 'base64'))
                })
            })
        }
        const nau = performance.now()
        const tempStorage = (path.join(app.getPath("appData"), app.getName()))
        const dir = path.join(sourceDir, 'Resources')
        console.log('init')
        const projectDir = path.join(dir, "data", "project.json")
        const tempProject = path.join(tempStorage, 'prj.json')
        if(fs.existsSync(tempProject)){
            fs.rmSync(tempProject)
        }
        const Unkey:string = JSON.parse(fs.readFileSync(path.join(dir, "data", "info.json"), 'utf-8')).key
        const key2 = await getKey(Unkey)
        console.log(`|${key2.toString('ascii')}|`)
        const key = key2.toString('base64')
        console.log(key)
    
        console.log(tempProject)
        console.log(projectDir)
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
    } catch (error) {
        console.log(error)
        mwindow.webContents.send("warn", "오류가 발생했습니다")
    }
}