const path = require('path');
const fs = require('fs').promises;

const getComponent = async (name) => {
  var componentPath = path.join(__baseDir, 'components', `${name}.html`);
  return fileLoader(componentPath);
}

const getTemplate = async (name) => {
  var templatePath = path.join(__baseDir, 'templates', `${name}.html`);
  return fileLoader(templatePath);
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
  getTemplate,
  fileLoader,
  writeOutputFile
}