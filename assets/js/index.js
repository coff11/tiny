const {
  ipcRenderer
} = require('electron')
const minBtn = document.querySelector('.min-btn')
const maxBtn = document.querySelector('.max-btn')
const shutBtn = document.querySelector('.shut-btn')

const imgListEle = document.querySelector('.img-list')
let imgList = []
let totalSizeStart = 0
const fileInputEle = document.getElementById('file-input')
let imgTpl = []
let pressNum = 0

minBtn.addEventListener('click', () => {
  ipcRenderer.send('min')
})
maxBtn.addEventListener('click', () => {
  ipcRenderer.send('max')
})
shutBtn.addEventListener('click', () => {
  ipcRenderer.send('shut')
})

fileInputEle.onchange = () => {
  pressNum = 0
  imgListEle.innerHTML = ''
  totalSizeStart = 0
  imgList = []
  for(let i = 0; i < fileInputEle.files.length; i ++) {
    document.getElementById('total').innerText = fileInputEle.files.length
    document.getElementById('now').innerText = 0
    document.querySelector('.loading-wrapper').classList.remove('hide')
    document.querySelector('.cover').classList.remove('hide')
    totalSizeStart += parseInt(fileInputEle.files[i].size / 1024)
    document.getElementById('num-start').innerText = totalSizeStart
    document.getElementById('num-end').innerText = '?'
    imgTpl.push({
      id: fileInputEle.files[i].name,
      tpl: `
        <li>
          <span class="show-name">${fileInputEle.files[i].name}</span>&nbsp;&nbsp;&nbsp;
        </li>
      `,
      size: fileInputEle.files[i].size,
      class: ''
    })
    imgList.push({
      path: fileInputEle.files[i].path,
      name: fileInputEle.files[i].name,
      size: fileInputEle.files[i].size,
      dirname: fileInputEle.files[i].path.replace(fileInputEle.files[i].name, '')
    })
  }
  ipcRenderer.send('imgList', imgList)
}

ipcRenderer.on('totalEnd', (e, data) => {
  document.getElementById('num-end').innerText = data
})

ipcRenderer.on('complete', (e, data) => {
  imgListEle.innerHTML += data
  pressNum += 1
  document.getElementById('now').innerText = pressNum
  if(pressNum == fileInputEle.files.length) {
    document.querySelector('.loading-wrapper').classList.add('hide')
    document.querySelector('.cover').classList.add('hide')
  }
})

document.querySelector('.key-text').value = localStorage.getItem('key')

document.querySelector('.setting').addEventListener('click', () => {
  document.querySelector('.key-wrapper').classList.remove('hide')
  document.querySelector('.key-text').value = window.localStorage.getItem('key')
})
document.querySelector('.confirm-btn').addEventListener('click', () => {
  const keyValue = document.querySelector('.key-text').value
  window.localStorage.setItem('key', keyValue)
  ipcRenderer.send('key', keyValue)
  document.querySelector('.loading-wrapper').classList.remove('hide')
  document.querySelector('.cover').classList.remove('hide')
})

document.querySelector('.cancel-btn').addEventListener('click', () => {
  document.querySelector('.key-wrapper').classList.add('hide')
})

ipcRenderer.on('keyIsOk', () => {
  document.querySelector('.key-wrapper').classList.add('hide')
  document.querySelector('.loading-wrapper').classList.add('hide')
  document.querySelector('.cover').classList.add('hide')
})
ipcRenderer.on('keyIsErr', () => {
  document.querySelector('.loading-wrapper').classList.add('hide')
  document.querySelector('.cover').classList.add('hide')
})
ipcRenderer.on('errHandler', (e, data) => {
  document.querySelector('.loading-wrapper').classList.add('hide')
  document.querySelector('.cover').classList.add('hide')
  alert(data)
  pressNum = 0
  imgListEle.innerHTML = ''
  totalSizeStart = 0
  imgList = []
  fileInputEle.value = ''
  document.getElementById('total').innerText = fileInputEle.files.length
  document.getElementById('now').innerText = 0
  document.getElementById('num-start').innerText = totalSizeStart
  document.getElementById('num-end').innerText = '?'
})

