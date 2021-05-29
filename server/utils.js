const path = require('path');
const fs = require('fs').promises;

const getComponent = async (name) => {
  var componentPath = path.join(__baseDir, 'components', `${name}.html`);
  console.log({componentPath});
  return fileLoader(componentPath);
}

const fileLoader = async (filepath) => {
  const data = await fs.readFile(filepath, 'binary');
  return new Buffer.from(data).toString();
}

const writeOutputFile = async (outputFilename, content) => {
  await fs.writeFile(outputFilename, content);
}

module.exports = {
  getComponent,
  fileLoader,
  writeOutputFile
}