import { ipcMain, dialog } from "electron"
import { mwindow } from "./mainWindow"
import path from "path"
import fs, { existsSync } from "fs"
import { initProject } from "./projectBuilder"
import open from "open"
import * as saver from "./projectSaver"

function getPixelGame(){
    const d = dialog.showOpenDialogSync(mwindow, {properties: ['openFile'], filters:[
        { name:'Pixel MV Game', extensions:['exe']}
    ]})
    if(d === undefined){
        return null
    }
    const dir = path.dirname(d[0]);
    if(existsSync(path.join(dir, 'Resources', 'data')) && path.join(dir, 'Resources', 'img')){
        return {dir: dir, d: d}
    }
    else{
        return null
    }
}



export function main(){
    ipcMain.on("newProj", () => {
        const d2 = getPixelGame()
        if(d2 !== null){
            const {dir, d} = d2
            console.log(dir)
            mwindow.webContents.send('cProject')
            initProject(dir, d[0])
        }
        else{
            mwindow.webContents.send('warn', 'PIXEL MV 게임 파일이 아닙니다')
        }
    })

    ipcMain.on("openFindKeyPage", (ev, arg) => {
        open("https://github.com/gramedcart/pixelmvtrans/wiki/%EB%B3%B5%ED%98%B8%ED%99%94-%ED%82%A4%EA%B0%92-%EC%96%BB%EA%B8%B0")
    })

    saver.init()

    ipcMain.on("setImportIt", (ev, arg) => {
        
    })
}