const { app, BrowserWindow } = require('electron');
const path = require('path');

require('./server')

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile(path.join(__dirname, './quicksand-ui/build/index.html'))
}

app.whenReady().then(() => {
    createWindow()
})