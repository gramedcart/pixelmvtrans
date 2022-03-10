import { ipcMain, ipcRenderer } from "electron"
import { mwindow } from "./mainWindow"
import path from "path"
import fs from "fs"
import { Translator } from "./translator"

function fontApply(dir:string){
    const FontDir = path.join(dir, "fonts")
    const d = fs.readdirSync(FontDir)
    if(!d.includes("HangulHelper.dat")){
        const ttf = fs.readFileSync(path.join(globalThis.oPath, 'ext', 'font', 'font.ttf'))
        const otf = fs.readFileSync(path.join(globalThis.oPath, 'ext', 'font', 'font.otf'))

        for(const i in d){
            const da = path.parse(d[i])
            if(da.ext === '.ttf'){
                fs.writeFileSync(path.join(FontDir, d[i]), ttf)
            }
            if(da.ext === '.otf'){
                fs.writeFileSync(path.join(FontDir, d[i]), otf)
            }
        }
        fs.writeFileSync(path.join(FontDir, "HangulHelper.dat"), Buffer.from("HangulHelper from PixelMVTrans"))
    }
}


export function init(){
    ipcMain.on("saver", async (ev, arg) => {
        console.log("saving")
        const dir = path.join(sourceDir, 'Resources')
        const projectDir = path.join(dir, "data", "project.json")
        const a = JSON.stringify(arg.project, null, 1)
        fs.writeFileSync(projectDir, a, 'utf-8')
        fontApply(dir)


        console.log("saved")
        mwindow.webContents.send('alert', '저장되었습니다')
    })

    
    ipcMain.on("translator", async(ev, arg:string[][]) => {

        let trans = new Translator()
        const c = await trans.init()
        if(!c){
            mwindow.webContents.send("error", "Eztrans 실행 도중 오류가 발생했습니다.<br>보안프로그램등을 확인해 주세요")
        }
        let Translated = arg
        for(let i =0;i<arg.length;i++){
            Translated[i][0] = await trans.translate(arg[i][0])
            if(i % 10 == 0){
                console.log(i)
                mwindow.webContents.send("transper", `${Math.round(i/arg.length*10000)/100}%`)
            }
        }
        mwindow.webContents.send("transData", arg)
    })
}