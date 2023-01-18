import { Eval } from './eval';
import Lexer from './lexer';
import { Parser } from './parser';
import * as obj from './object';

describe('should evaluate basic types', () => {
  const tests = [
    ['5', '5'],
    ['101', '101'],
  ];

  test.each(tests)('%#: basic eval test:', (input, expected) => {
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program) as obj.Integer;
    expect(res.inspect()).toBe(expected);
  });
});
