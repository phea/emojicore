import readline = require('readline/promises');
import sprintf = require('sprintf-js');
import Token = require('../token');
import pkg = require('../lexer');
import { Parser } from '../parser';
import { Eval } from '../eval';
const { Lexer } = pkg;

const printf = function (...args: any[]): number {
  var o = sprintf.sprintf.apply(sprintf, arguments);
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
    const p = new Parser(lex);
    const program = p.parseProgram();

    // TODO: handle errors;
    let res = Eval(program);
    if (res !== undefined) {
      printf('%s\n', res.inspect());
    }
  }
  // console.log(line);
  process.stdout.write(PROMPT);
});

rl.once('close', () => {
  // end of input
});
