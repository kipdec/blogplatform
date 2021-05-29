// entry point for the server
global.__baseDir = __dirname;
const fs = require('fs').promises;
const PageModel = require('./models/PageModel');
const { fileLoader, writeOutputFile } = require('./utils');
// Generates the html boilerplate or skeleton of the doc

const outputCSS = async() => {
  const css = await fileLoader('./css/style.css');
  await writeOutputFile('./output/style.css', css);
}

const main = async () => {
  const sitename = "Kip's Watch Blog";
  var boilerplateTemplate = await fileLoader('./templates/boilerplate.html');
  var titlebarTemplate = await fileLoader('./templates/titlebar.html');
  var homepage = new PageModel({
    location: 'index',
    baseURL: 'http://localhost:5000',
    boilerplateTemplate: boilerplateTemplate,
    sitename: sitename,
    titlebarTemplate: titlebarTemplate,
    navbarTemplate: await fileLoader('./templates/navbar.html')
  });

  homepage.addNavItem({
    displayName: 'Home',
    location: '/',
    id: 'home'
  });

  homepage.selectNavItem('home');
  homepage.writeOutput();
  outputCSS();
  console.log("Generated!");
}

main();

