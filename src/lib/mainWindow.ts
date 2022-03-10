export let mwindow:Electron.CrossProcessExports.BrowserWindow;
import { app, BrowserWindow } from 'electron';

export function setupMwindow(){
    mwindow = new BrowserWindow({
        width: 800,
        height: 450,
        minWidth: 800,
        minHeight: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        icon: globalThis.iconPath
        
    });
}