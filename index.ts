import { app, BrowserWindow } from 'electron';
import * as openFiles from './src/lib/openfiles'
import { mwindow, setupMwindow } from './src/lib/mainWindow'
import { isPackaged } from './lib/packed'
import path from 'path'
// require('electron-reload')(__dirname);
globalThis.iconPath = path.join(__dirname, 'res', 'icon.png')

const createWindow = () => {
    setupMwindow()
    mwindow.loadFile('public/index.html');
};

function oPath(){
    if(isPackaged()){
      globalThis.oPath = process.resourcesPath
    }
    else{
      globalThis.oPath = __dirname
    }
}
oPath()  
openFiles.main()
app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit());