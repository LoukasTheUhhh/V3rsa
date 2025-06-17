// Lexer/tokenizer function: input code string → array of tokens
function tokenize(code) {
  const tokenDefinitions = [
    // Order matters: match keywords before identifiers!
    ['KEYWORD', /^\b(?:vrb|rom|log|prompt|read|delete)\b/],
    ['BOOLEAN', /^\b(?:true|false|maybe)\b/],
    ['NUMBER', /^-?(?:\d*\.\d+|\d+)/],
    ['STRING', /^"([^"\\]*(\\.[^"\\]*)*)"|^'([^'\\]*(\\.[^'\\]*)*)'/],
    ['OPERATOR', /^(?:\+\+|\-\-|\+|\-|\*|\/|%|\^)/],
    ['IDENTIFIER', /^[a-zA-Z_$][a-zA-Z0-9_$]*/], // Not keywords, handled above
    ['PUNCTUATION', /^[=();]/],
    ['WHITESPACE', /^\s+/],
  ];

  const tokens = [];
  let remainingCode = code;

  while (remainingCode.length > 0) {
    let matchedToken = false;

    for (const [type, regex] of tokenDefinitions) {
      const match = remainingCode.match(regex);

      if (match) {
        matchedToken = true;

        if (type !== 'WHITESPACE') {
          tokens.push({ type, value: match[0] });
        }

        remainingCode = remainingCode.slice(match[0].length);
        break;
      }
    }

    if (!matchedToken) {
      throw new Error(
        `Unexpected token: '${remainingCode[0]}' — V3rsa is not amused. >:(`
      );
    }
  }

  return tokens;
}
function csshow(text) {
  document.getElementById('editor').innerHTML = text
}
// Export only the main function
export { tokenize, csshow };
