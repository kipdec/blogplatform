const { getComponent, writeOutputFile } = require('../utils');
const path = require('path');

class PageModel {
  constructor(pageTemplate){
    this.baseURL = pageTemplate.baseURL;
    this.boilerplateTemplate = pageTemplate.boilerplateTemplate;
    this.sitename = pageTemplate.sitename;
    this.titlebarTemplate = pageTemplate.titlebarTemplate;
    this.navbarTemplate = pageTemplate.navbarTemplate; 
    this.contentTemplate = pageTemplate.contentTemplate;
    (pageTemplate.navItems) ? this.navItems = pageTemplate.navItems : this.navItems = [];
  }

  addNavItem = ({displayName, id, location}) => {
    this.navItems.push({displayName, id, location, isSelected: false});
  }

  selectNavItem = (id) => {
    this.navItems.filter(n => n.id == id)[0].isSelected = true;
  }

  addPageContent = (pageContent) => {
    this.pageContent = pageContent;
  }
  
  setPageTitle = (pageTitle) => {
    this.pageTitle = pageTitle;
  }

  setLocation = (location) => {
    this.location = location;
  }
  
  async generateOutput(){
    var output = this.boilerplateTemplate
      .replace('{TITLEBAR}', this.titlebarTemplate)
      .replaceAll('{SITENAME}', this.sitename)
      .replace('{NAVBAR}', this.navbarTemplate)
      .replace('{CONTENT}', this.contentTemplate);
    output = output.replaceAll('{PAGETITLE}', this.pageTitle);

    
    output = output.replace('{NAVITEMS}', await generateNavItemsHTML(this.navItems, this.baseURL));

    output = output.replace('{PAGECONTENT}', this.pageContent);



    return output;
  }

  async writeOutput(){
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
  return navItemsString;
}
const generateNavItemHTML = async (navItem, baseURL) => {
  var componentTemplate = await getComponent('MenuItem');
  componentTemplate = componentTemplate
    .replace('{LOCATION}', baseURL + navItem.location)
    .replace('{ID}', navItem.id)
    .replace('{DISPLAYNAME}', navItem.displayName)
    .replace('{SELECTED}', (navItem.isSelected) ? ' selected' : '');
  

  return componentTemplate;
}

module.exports = PageModel;