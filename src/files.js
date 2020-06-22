const path = require('path');
const fs = require('fs');
const { windowsStore } = require('process');

const { argv } = window.process;


const contentFolder = argv[argv.length - 1] + '/jk_src';

if (!fs.existsSync(contentFolder)){
  fs.mkdirSync(contentFolder);
}

const filesList = document.getElementById('files')


const setFiles = async () => {
  removeAllChildNodes(filesList)
  await fs.readdirSync(contentFolder).forEach(file => {
    if (file !== '.gitignore'){
      const node = document.createElement("div");
      node.addEventListener('click', deleteFile, false)
      node.id = file;
      node.innerHTML = `${file}`
      filesList.appendChild(node)
    }
  });
}

const deleteFile = (file) => {
  try {
    fs.unlinkSync(contentFolder + '/' + file.target.id)
    setFiles()
  } catch(err){
    console.log(err)
  }
}


const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

setFiles()





