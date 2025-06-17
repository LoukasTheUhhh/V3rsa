function tokenize(code) {
  const tokenDefinitions = [
    ['KEYWORD', /^\b(?:vrb|log|prompt|read|delete)\b/], // functions and variablee declaration recognition
    ['BOOLEAN', /^\b(?:true|false|maybe)\b/], // true,false,and maybe booleans
    ['NULL', /^\b(?:null|nil|none|undefined|empty)\b/], // null,nil,none,undefined & empty all being null
    ['NUMBER', /^-?(?:\d*\.\d+|\d+)/], // any sort of number
    ['STRING', /^"([^"\\]*(\\.[^"\\]*)*)"|^'([^'\\]*(\\.[^'\\]*)*)'/], //double quote and single quote strings
    ['OPERATOR', /^(?:\+\+|\-\-|=|\+|\-|\*|\/|%|\^)/], //++,--,+,-,*,/,% & ^ operators
    ['IDENTIFIER', /^[a-zA-Z_$][a-zA-Z0-9_$]*/], // literally anything that doesnt fit here
    ['PUNCTUATION', /^[(){}]/], // brackets punctuation
    ['WHITESPACE', /^\s+/], // whitespace like this -->   <--
    ['COMMENT_SINGLE', /^\$\$[^\n]*/], // singleline comments with $$...
    ['COMMENT_MULTILINE', /^><[\s\S]*?></] // multiline comments with ><...><
  ];
  const tokens = [];
  let remainingCode = code;
  let line = 1, col = 1;
  while (remainingCode.length > 0) {
    let matchedToken = false;
    for (const [type, regex] of tokenDefinitions) {
      const match = remainingCode.match(regex);
      if (match) {
        matchedToken = true;
        const value = match[0];
        if (type !== 'WHITESPACE' && !type.startsWith('COMMENT')) {
          tokens.push({ type, value, line, col });
        }
        const lines = value.split('\n');
        if (lines.length > 1) {
          line += lines.length - 1;
          col = lines[lines.length - 1].length + 1;
        } else {
          col += value.length;
        }
        remainingCode = remainingCode.slice(value.length);
        break;
      }
    }
    if (!matchedToken) {
      throw new Error(
        `Unexpected token: '${remainingCode[0]}' at line ${line}, col ${col} — V3rsa is not amused. >:(`
      );
    }
  }
  return tokens;
}
function csshow(text) {
  document.getElementById('output').innerHTML = text;
}
export { tokenize, csshow };
