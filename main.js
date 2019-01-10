/*
 * 主进程
 */

const {
  app,
  BrowserWindow,
  ipcMain,
} = require('electron')
const tinify = require('tinify')
const fs = require('fs')

let win
let totalSizeEnd = 0

/*
 * key值校验 
 */
ipcMain.on('key', (e, data) => {
  tinify.key = data
  tinify.validate(function(err) {
    if (err) {
      win.webContents.send('keyIsErr')
      throw err
    } else {
      win.webContents.send('keyIsOk')
    }
  })
})

/*
 * 初始化app
 */
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
  ipcMain.on('min', () => {
    win.minimize()
  })
  ipcMain.on('max', () => {
    win.maximize()
  })
  ipcMain.on('shut', () => {
    app.quit()
  })
  /*
   * 压缩图片
   */
  function pressImg(list) {
    for(let i = 0; i < list.length; i ++) {
      fs.readFile(list[i].path, (err, data) => {
        if(err) {
          console.log(err)
        } else {
          /*
           * 调用tinyPNG的压缩方法，每一步返回的都是一个promise对象
           */
          const source = tinify.fromFile(list[i].path)
          const result = source.toFile(list[i].path)
          /*
           * 获取压缩之后的图片信息 
           */
          result.then((x) => {
            fs.stat(list[i].path, (err, data) => {
              totalSizeEnd += parseInt(data.size / 1024)
              win.webContents.send('totalEnd', totalSizeEnd, i)
              win.webContents.send('complete', `
                <li class="success">
                  <span class="show-name">${list[i].name}</span>&nbsp;&nbsp;&nbsp;
                </li>
              `)
            })
          }).catch((err) => {
            /*
             * 错误处理 
             */
            if (err instanceof tinify.AccountError) {
              // Verify your API key and account limit.
              win.webContents.send('errHandler', 'Verify your API key and account limit.')
              throw err
            } else if (err instanceof tinify.ClientError) {
              // Check your source image and request options.
              win.webContents.send('complete', `
                <li class="failed">
                  <span class="show-name">${list[i].name}</span>&nbsp;&nbsp;&nbsp;
                </li>
              `)
            } else if (err instanceof tinify.ServerError) {
              win.webContents.send('errHandler', 'Temporary issue with the Tinify API.')
              throw err
              // Temporary issue with the Tinify API.
            } else if (err instanceof tinify.ConnectionError) {
              // A network connection error occurred.
              win.webContents.send('errHandler', 'A network connection error occurred.')
              throw err
            } else {
              // Something else went wrong, unrelated to the Tinify API.
              win.webContents.send('errHandler', 'Something else went wrong, unrelated to the Tinify API.')
              throw err
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
