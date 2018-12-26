
const {
  ipcRenderer
} = require('electron')
const minBtn = document.querySelector('.min-btn')
const maxBtn = document.querySelector('.max-btn')
const shutBtn = document.querySelector('.shut-btn')
const fileList = []

minBtn.addEventListener('click', () => {
  ipcRenderer.send('min')
})
maxBtn.addEventListener('click', () => {
  ipcRenderer.send('max')
})
shutBtn.addEventListener('click', () => {
  ipcRenderer.send('shut')
})

document.addEventListener('drop', function (e) {
  e.preventDefault();
  e.stopPropagation();

  const fileListEle = document.querySelector('.file-list')
  for (let f of e.dataTransfer.files) {
    fileListEle.innerHTML += '<li>' + f.path + '</li>'
    fileList.push('<li>' + f.path + '</li>')
    console.log('File(s) you dragged here: ', f.path)
  }
  console.log(fileList)
  // fileListEle.innerHTML = fileList
});
document.addEventListener('dragover', function (e) {
  e.preventDefault();
  e.stopPropagation();
});
