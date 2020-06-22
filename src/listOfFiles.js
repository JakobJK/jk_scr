const path = require('path');
const fs = require('fs');

const testFolder = path.resolve(__dirname, '../content/');
const filesList = document.getElementById('files')



const setFiles = async () => {
  removeAllChildNodes(filesList)
  await fs.readdirSync(testFolder).forEach(file => {
    if (file !== '.gitignore'){
      const node = document.createElement("div");
      node.addEventListener('click', fileClickHandler, false)
      node.id = file;
      node.innerHTML = `${file}`
      filesList.appendChild(node)
    }
  });
}

const fileClickHandler = (file) => {
  console.log(file.target.id)
}


const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

setFiles()





