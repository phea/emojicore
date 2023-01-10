import * as readline from 'readline';
import { sprintf } from 'sprintf-js';
import * as Token from '../token.js';
import { Lexer } from '../lexer.js';

const printf = function (...args: any[]): number {
  var o = sprintf.apply(sprintf, arguments);
  console.log(o);
  return o.length;
};

const PROMPT = '🤘> ';

const HELP = 'LOL';

printf('Welcome to EmojiCore v0.0.1\nType ".help" for more information.');
process.stdout.write(PROMPT);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  if (line === '.help') {
    printf('%s', HELP);
  } else {
    let lex = new Lexer(line);
    let tok = lex.nextToken();
    while (tok.type != Token.EOF) {
      printf('%s', tok);
      tok = lex.nextToken();
    }
  }
  // console.log(line);
  process.stdout.write(PROMPT);
});

rl.once('close', () => {
  // end of input
});
