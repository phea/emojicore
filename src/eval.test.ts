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

describe('should evaluate bang operator', () => {
  const tests = [
    ['!true', false],
    ['!false', true],
    ['!!true', true],
    ['!!false', false],
  ];

  test.each(tests)('%#: bang eval test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program) as obj.Boolean;
    expect(res.value).toBe(expected);
  });
});

describe('should evaluate integer expression', () => {
  const tests = [
    ['5', '5'],
    ['101', '101'],
    ['5 + 5', '10'],
    ['75 + 125 + 1000', '1200'],
    ['21 - 7', '14'],
    ['3 - 12', '0'],
    ['2 * 4', '8'],
    ['123 * 456', '56088'],
    ['2 * 2 * 2 * 2 * 2', '32'],
    ['2 * (5 + 10)', '30'],
    // ['3 / 0', '0'],
    // ['3 / 5', '0'],
    // ['81 / 9', '6'],
    // ['50 / 2 * 2 + 10', '60'],
  ];

  test.each(tests)('%#: integer expression eval test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program) as obj.Integer;
    expect(res.inspect()).toBe(expected);
  });
});

describe('should evaluate boolean expression', () => {
  const tests = [
    ['true', true],
    ['false', false],
    ['1 < 2', true],
    ['1 > 2', false],
    ['1 < 1', false],
    ['1 > 1', false],
    ['2 > 1', true],
    ['1 == 1', true],
    ['1 != 1', false],
    ['true == true', true],
    ['false == false', true],
    ['true == false', false],
    ['true != false', true],
    ['false != true', true],
    ['(1 < 2) == true', true],
    ['(1 < 2) == false', false],
    ['(1 > 2) == true', false],
    ['(1 > 2) == false', true],
  ];

  test.each(tests)('%#: boolean expression eval test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program) as obj.Boolean;
    expect(res.value).toBe(expected);
  });
});
