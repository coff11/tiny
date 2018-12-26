const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = require('electron')

let win
const menu = new Menu()

function initApp() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false
  })
  win.loadFile('index.html')
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
  menu.closePopup(win)
  ipcMain.on('min', () => {
    win.minimize()
  })
  ipcMain.on('max', () => {
    win.maximize()
  })
  ipcMain.on('shut', () => {
    win.close()
  })
}

app.on('ready', initApp)

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', () => {
//   if(win === null) {
//     createWindow()
//   }
// })


