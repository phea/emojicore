import { Eval } from './eval';
import Lexer from './lexer';
import { Parser } from './parser';
import * as obj from './object';

describe('should evaluate integer literals', () => {
  const tests = [
    ['5', '5'],
    ['101', '101'],
  ];

  test.each(tests)('%#: basic integer literal test:', (input, expected) => {
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program) as obj.Integer;
    expect(res.inspect()).toBe(expected);
  });
});

describe('should evaluate boolean', () => {
  const tests = [
    ['true', true],
    ['false', false],
  ];

  test.each(tests)('%#: bool eval test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program) as obj.Boolean;
    console.log('what is res:', res);
    expect(res.value).toBe(expected);
  });
});
