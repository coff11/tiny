
const {
  ipcRenderer
} = require('electron')
const minBtn = document.querySelector('.min-btn')
const maxBtn = document.querySelector('.max-btn')
const shutBtn = document.querySelector('.shut-btn')

const fileListEle = document.querySelector('.file-list')
let imgList = []
let totalSizeStart = 0
const fileInputEle = document.getElementById('file-input')

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
  totalSizeStart = 0
  imgList = []
  console.log(12313123)
  console.log(fileInputEle.files)
  for(let i = 0; i < fileInputEle.files.length; i ++) {
    totalSizeStart += parseInt(fileInputEle.files[i].size / 1024)
    // fileListEle.innerHTML += '<li>' + fileInputEle.files[i].name + '</li>'
    document.getElementById('num-start').innerText = totalSizeStart
    console.log('1111', fileInputEle.files[i].path)
    imgList.push({
      path: fileInputEle.files[i].path,
      name: fileInputEle.files[i].name,
      size: fileInputEle.files[i].size,
      dirname: fileInputEle.files[i].path.replace(fileInputEle.files[i].name, '')
    })
  }
  ipcRenderer.send('imgList', imgList)
}

document.getElementsByClassName('clear')[0].addEventListener('click', function (e) {
  // e.preventDefault();
  // e.stopPropagation();

  // const fileListEle = document.querySelector('.file-list')
  // for (let f of e.dataTransfer.files) {
  //   fileListEle.innerHTML += '<li>' + f.path + '</li>'
  //   fileList.push('<li>' + f.path + '</li>')
  //   console.log('File(s) you dragged here: ', f.path)
  // }
  // fileInputEle.outerHTML = fileInputEle.outerHTML
  document.getElementById('file-input').value = ''
  totalSizeStart = 0
  console.log(fileInputEle.files)
  document.getElementById('num-start').innerText = totalSizeStart
  // fileListEle.innerHTML = fileList
});
document.addEventListener('dragover', function (e) {
  e.preventDefault();
  e.stopPropagation();
});
