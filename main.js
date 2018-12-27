const {
  app,
  BrowserWindow,
  ipcMain,
  Menu
} = require('electron')
const tinify = require('tinify')
const fs = require('fs')

let win
const menu = new Menu()
let totalSizeEnd = 0

ipcMain.on('key', (e, data) => {
  tinify.key = data
  tinify.validate(function(err) {
    if (err) {
      throw err
    } else {
      win.webContents.send('keyIsOk')
    }
    // Validation of API key failed.
  })
})

function initApp() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    frame: false
  })
  win.loadFile('index.html')
  // win.webContents.openDevTools()
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
    for(let i = 0; i < list.length; i ++) {
      fs.readFile(list[i].path, (err, data) => {
        if(err) {
          console.log(err)
        } else {
          const source = tinify.fromFile(list[i].path)
          const result = source.toFile(list[i].path)
          result.then((x) => {
            fs.stat(list[i].path, (err, data) => {
              totalSizeEnd += parseInt(data.size / 1024)
              console.log(list[i].name)
              win.webContents.send('totalEnd', totalSizeEnd)
              win.webContents.send('complete', `
                <li class="success">
                  <span class="show-name">${list[i].name}</span>&nbsp;&nbsp;&nbsp;
                </li>
              `)
            })
          }).catch((err) => {
            if (err instanceof tinify.AccountError) {
              console.log("The error message is: " + err.message)
              // Verify your API key and account limit.
            } else if (err instanceof tinify.ClientError) {
              win.webContents.send('complete', `
                <li class="failed">
                  <span class="show-name">${list[i].name}</span>&nbsp;&nbsp;&nbsp;
                </li>
              `)
              // Check your source image and request options.
              console.log("The error message is: " + err.message)
            } else if (err instanceof tinify.ServerError) {
              console.log("The error message is: " + err.message)
              // Temporary issue with the Tinify API.
            } else if (err instanceof tinify.ConnectionError) {
              console.log("The error message is: " + err.message)
              // A network connection error occurred.
            } else {
              console.log("The error message is: " + err.message)
              // Something else went wrong, unrelated to the Tinify API.
            }
          })
        }
      })
    }
  }
  ipcMain.on('imgList', (e, imgList) => {
    totalSizeEnd = 0
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


