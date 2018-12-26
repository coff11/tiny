const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = require('electron')
const tinify = require('tinify')
const fs = require('fs')

tinify.key = 'XfxTl3BjY0CVbplLwvBc455WnzJCDthb'

// tinify. = [
//   {key: 'XfxTl3BjY0CVbplLwvBc455WnzJCDthb'},
//   {key: '', useCount:0, fullMonth:[]},
//   {key: '', useCount:0, fullMonth:[]}
//   ]

tinify.validate(function(err) {
  if (err) throw err;
  // Validation of API key failed.
})

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
  function pressImg(list) {
    // console.log(list)
    fs.readFile(list[0].path, (err, data) => {
      if(err) {
        console.log(err)
      } else {
        const source = tinify.fromFile(list[0].path);
        const error = source.toFile(list[0].path);
        error.then(() => {
          console.log('111111111111111')
        })
        // ipcMain.send()
      }
    })
  }
  ipcMain.on('imgList', (e, imgList) => {
    // console.log(imgList)
    pressImg(imgList)
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


