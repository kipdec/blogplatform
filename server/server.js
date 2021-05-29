// entry point for the server
global.__baseDir = __dirname;
const fs = require('fs').promises;
const PageModel = require('./models/PageModel');
const { fileLoader, writeOutputFile, getTemplate } = require('./utils');
const {tester, generateTestContent} = require('./MarkdownUtils');
// Generates the html boilerplate or skeleton of the doc

const outputCSS = async() => {
  const css = await fileLoader('./css/style.css');
  await writeOutputFile('./output/style.css', css);
}

const main = async () => {
  const sitename = "Kip's Watch Blog";
  var homepage = new PageModel({
    baseURL: 'http://localhost:5000',
    boilerplateTemplate: await getTemplate('boilerplate'),
    sitename: sitename,
    titlebarTemplate: await getTemplate('titlebar'),
    navbarTemplate: await getTemplate('navbar'),
    contentTemplate: await getTemplate('content')
  });

  homepage.setLocation('index');

  homepage.setPageTitle('Home');

  homepage.addNavItem({
    displayName: 'Home',
    location: '/',
    id: 'home'
  });

  homepage.selectNavItem('home');
  homepage.addPageContent(generateTestContent());
  homepage.writeOutput();
  outputCSS();
  console.log("Generated!");
}

main();

