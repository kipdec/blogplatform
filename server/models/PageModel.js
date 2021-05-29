const { getComponent, writeOutputFile } = require('../utils');
const path = require('path');

class PageModel {
  constructor(pageTemplate){
    this.location = pageTemplate.location;
    this.baseURL = pageTemplate.baseURL;
    this.boilerplateTemplate = pageTemplate.boilerplateTemplate;
    this.sitename = pageTemplate.sitename;
    this.titlebarTemplate = pageTemplate.titlebarTemplate;
    this.navbarTemplate = pageTemplate.navbarTemplate; 
    (pageTemplate.navItems) ? this.navItems = pageTemplate.navItems : this.navItems = [];
    console.log(this)
  }

  addNavItem = ({displayName, id, location}) => {
    this.navItems.push({displayName, id, location, isSelected: false});
  }

  selectNavItem = (id) => {
    this.navItems.filter(n => n.id == id)[0].isSelected = true;
  }
  
  async generateOutput(){
    var output = this.boilerplateTemplate;
    if(this.titlebarTemplate) output = output.replace('{TITLEBAR}', this.titlebarTemplate);
    if(this.sitename) output = output.replaceAll('{SITENAME}', this.sitename);
    if(this.navbarTemplate) output = output.replace('{NAVBAR}', this.navbarTemplate);
    output = output.replace('{NAVITEMS}', await generateNavItemsHTML(this.navItems, this.baseURL));



    return output;
  }

  async writeOutput(){
    console.log(__dirname);
    const outputFile = path.join(__baseDir, 'output', `${this.location}.html`);
    await writeOutputFile(outputFile, await this.generateOutput());
  }
}

const generateNavItemsHTML = async(navItems, baseURL) => {
  var navItemList = [];
  for(let i = 0; i < navItems.length; i++){
    navItemList.push(await generateNavItemHTML(navItems[i], baseURL));
  }
  navItemsString = navItemList.join('\n');
  console.log({navItemsString});
  return navItemsString;
}
const generateNavItemHTML = async (navItem, baseURL) => {
  var componentTemplate = await getComponent('MenuItem');
  componentTemplate = componentTemplate
    .replace('{LOCATION}', baseURL + navItem.location)
    .replace('{ID}', navItem.id)
    .replace('{DISPLAYNAME}', navItem.displayName)
    .replace('{SELECTED}', (navItem.isSelected) ? ' selected' : '');
  
  console.log({componentTemplate});

  return componentTemplate;
}

module.exports = PageModel;