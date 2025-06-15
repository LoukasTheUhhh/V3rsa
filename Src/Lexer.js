// TogetherFastLexer.js

// Helper: Get code string from various sources on the page or variables
function getCode({
  fromId = null,           // e.g. <pre id="code">
  fromClass = null,        // e.g. <pre class="code-block">
  fromVar = null,          // e.g. window.myCodeString
  fromScriptType = 'text/together' // e.g. <script type="text/together">
} = {}) {
  if (fromId) {
    const el = document.getElementById(fromId);
    if (el) return el.textContent.trim();
  }

  if (fromClass) {
    const el = document.querySelector(`.${fromClass}`);
    if (el) return el.textContent.trim();
  }

  if (fromVar && typeof window[fromVar] === 'string') {
    return window[fromVar];
  }

  const scriptEl = document.querySelector(`script[type="${fromScriptType}"]`);
  if (scriptEl) return scriptEl.textContent.trim();

  return '';
}

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


// Public API: Manual trigger to get code and tokenize it
function runV3rsa(sourceOptions = {}) {
  const code = getCode(sourceOptions);

  if (!code) {
    console.warn('Wait,', sourceOptions, 'has no V3rsa code!What a tragedy...');
    return [];
  }

  try {
    const tokens = tokenize(code);
    console.log('Just so you know,the tokens are:\n', tokens);
    return tokens;
  } catch (error) {
    console.error('Oops,we got a tokenizing error: ', error.message, ' :(');
    return [];
  }
}

// Export only the main function
export { runV3rsa };
