/*
 * 渲染进程 
 */

const {
  ipcRenderer
} = require('electron')

const getIdEle = obj => document.getElementById(obj)
const getQueryEle = obj => document.querySelector(obj)

/*
 * 右上角菜单最小化，全屏，关闭
 */
const minBtn = getQueryEle('.min-btn')
const maxBtn = getQueryEle('.max-btn')
const shutBtn = getQueryEle('.shut-btn')
minBtn.addEventListener('click', () => {
  ipcRenderer.send('min')
})
maxBtn.addEventListener('click', () => {
  ipcRenderer.send('max')
})
shutBtn.addEventListener('click', () => {
  ipcRenderer.send('shut')
})

/*
 * imgListEle: 压缩结果的展示列表
 * fileInputEle: 上传控件
 * imgList: 用于保存图片的相关信息
 * totalSizeStart: 压缩之前图片的总体积
 * pressNum: 已经压缩的图片数量
 */
const imgListEle = getQueryEle('.img-list')
const fileInputEle = getIdEle('file-input')
let imgList = []
let totalSizeStart = 0
let pressNum = 0

fileInputEle.onchange = () => {
  /*
   * 清空数据，重置界面
   */
  pressNum = 0
  imgListEle.innerHTML = ''
  totalSizeStart = 0
  imgList = []

  
  for(let i = 0; i < fileInputEle.files.length; i ++) {
    getIdEle('total').innerText = fileInputEle.files.length
    getIdEle('now').innerText = 0
    getQueryEle('.loading-wrapper').classList.remove('hide')
    getQueryEle('.cover').classList.remove('hide')
    totalSizeStart += parseInt(fileInputEle.files[i].size / 1024)
    getIdEle('num-start').innerText = totalSizeStart
    getIdEle('num-end').innerText = '?'
    imgList.push({
      path: fileInputEle.files[i].path,
      name: fileInputEle.files[i].name,
      size: fileInputEle.files[i].size,
      dirname: fileInputEle.files[i].path.replace(fileInputEle.files[i].name, '')
    })
  }
  /*
   * 将保存了图片相关信息的数组传递给主进程
   */
  ipcRenderer.send('imgList', imgList)
}

/*
 * 接收压缩后的图片总体积
 */
ipcRenderer.on('totalEnd', (e, data) => {
  getIdEle('num-end').innerText = data
})

/*
 * 每一张图片压缩完成的响应事件
 */
ipcRenderer.on('complete', (e, data) => {
  imgListEle.innerHTML += data
  pressNum += 1
  getIdEle('now').innerText = pressNum
  if(pressNum == fileInputEle.files.length) {
    getQueryEle('.loading-wrapper').classList.add('hide')
    getQueryEle('.cover').classList.add('hide')
  }
})

/*
 * 从localStorage中读取key值，显示在输入框 
 */
getQueryEle('.key-text').value = localStorage.getItem('key')

getQueryEle('.setting').addEventListener('click', () => {
  getQueryEle('.key-wrapper').classList.remove('hide')
  getQueryEle('.key-text').value = window.localStorage.getItem('key')
})

/*
 * 用户输入key值后，保存到localStorage，并发给主进程校验 
 */
getQueryEle('.confirm-btn').addEventListener('click', () => {
  const keyValue = getQueryEle('.key-text').value
  window.localStorage.setItem('key', keyValue)
  ipcRenderer.send('key', keyValue)
  getQueryEle('.loading-wrapper').classList.remove('hide')
  getQueryEle('.cover').classList.remove('hide')
})

getQueryEle('.cancel-btn').addEventListener('click', () => {
  getQueryEle('.key-wrapper').classList.add('hide')
})

/*
 * key值校验结果由主进程判断是否抛错，渲染进程只管理loading和输入界面的显示与否 
 */
ipcRenderer.on('keyIsOk', () => {
  getQueryEle('.key-wrapper').classList.add('hide')
  getQueryEle('.loading-wrapper').classList.add('hide')
  getQueryEle('.cover').classList.add('hide')
})
ipcRenderer.on('keyIsErr', () => {
  getQueryEle('.loading-wrapper').classList.add('hide')
  getQueryEle('.cover').classList.add('hide')
})

/*
 * 错误处理
 */
ipcRenderer.on('errHandler', (e, data) => {
  getQueryEle('.loading-wrapper').classList.add('hide')
  getQueryEle('.cover').classList.add('hide')
  alert(data)
  pressNum = 0
  imgListEle.innerHTML = ''
  totalSizeStart = 0
  imgList = []
  fileInputEle.value = ''
  getIdEle('total').innerText = fileInputEle.files.length
  getIdEle('now').innerText = 0
  getIdEle('num-start').innerText = totalSizeStart
  getIdEle('num-end').innerText = '?'
})

