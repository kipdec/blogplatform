const MarkdownPreprocessor = (text) => {
  // returns chunks 
  const lines = text.split('\n');
  const chunks = [];
  var currentLine = '';
  for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    if(line.trim().length > 0){
      var matchFound = false;
      for(let j = 0; j < LeafRegex.length; j++){
        const regex = LeafRegex[j].regex;
        const type = LeafRegex[j].type;
        if(line.match(regex)){
          matchFound = true;
          if(currentLine.trim().length > 0) {
            chunks.push({line: currentLine, type: 'NA'});
            currentLine = '';
          }
          chunks.push({line, type});
          break;
        } 
      }

      if(!matchFound) currentLine += line;
    } else {
      if(currentLine.trim().length > 0) chunks.push({line: currentLine, type: 'NA'});
      currentLine = '';
    }
  }

  if(currentLine.trim().length >0 )  chunks.push({line: currentLine, type: 'NA'});

  const htmlList = chunks.map(c => generateHtmlFromChunk(c));
  return htmlList.join('\n');
}

const generateHtmlFromChunk = (chunk) => {
  switch(chunk.type){
    case 'HEADING':
      return generateHeading(chunk.line);
      break;
    case 'THEMATIC':
      return generateThematicBreak();
      break;
    default:
      return generateParagraph(chunk.line);
      break;
  }
}

const generateThematicBreak = () => {
  return "<hr>";
}

const generateHeading = (line) => {
  line = line.trim();
  let level = 0;
  for(level; level < 6; level++){
    if(line.charAt(level + 1) != '#') break;
  }

  level += 1;
  line = line.substring(level);
  line = line.trim();

  return `<h${level}>${line}</h${level}>`;
}

const generateParagraph = (line) => {
  return `<p>${line}</p>`;
}

const LeafRegex = [
  {
    regex: /^( {0,3}\-{3,}| {0,3}\*{3,}| {0,3}\_{3,})$/g,
    type: "THEMATIC"
  },
  {
    regex: /^\#{1,6} {1,}.{1,}$/g,
    type: "HEADING"
  },
]

const generateTestContent = () => {
  var text = "# This is some markdown\n***\nabc\n123\n\nShould be a new chunk \nShould not be a new chunk\n\nOnce more... \nJust to be sure\n## Here's a subheading for fun....\n#Not a vlida subheading";
  return MarkdownPreprocessor(text);
}

module.exports = {
  generateTestContent
}