import { Eval } from './eval';
import Lexer from './lexer';
import { Parser } from './parser';
import * as obj from './object';
import { Environment } from './env';

describe('should evaluate integer literals', () => {
  const tests = [
    ['5', '5'],
    ['101', '101'],
  ];

  test.each(tests)('%#: basic integer literal test:', (input, expected) => {
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program, new Environment()) as obj.Integer;
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

    let res = Eval(program, new Environment()) as obj.Boolean;
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

    let res = Eval(program, new Environment()) as obj.Boolean;
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

    let res = Eval(program, new Environment()) as obj.Integer;
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

    let res = Eval(program, new Environment()) as obj.Boolean;
    expect(res.value).toBe(expected);
  });
});

describe('should evaluate if-else expression', () => {
  const tests = [
    ['if (true) { 10 }', '10'],
    ['if (false) { 10 }', 'null'],
    ['if (1 < 2) { 10 }', '10'],
    ['if (1 > 2) { 10 }', 'null'],
    ['if (1 > 2) { 10 } else { 20 }', '20'],
    ['if (1 < 2) { 10 } else { 20 }', '10'],
  ];

  test.each(tests)('%#: if-else expression eval test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program, new Environment()) as obj.Object;
    expect(res.inspect()).toBe(expected);
  });
});

describe('should evaluate return statement', () => {
  const tests = [
    ['return 10;', '10'],
    ['return 10; 9;', '10'],
    ['return 2 * 5; 9;', '10'],
    ['9; return 2 * 5; 9;', '10'],
  ];

  test.each(tests)('%#: return value eval test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program, new Environment()) as obj.Object;
    expect(res.inspect()).toBe(expected);
  });

  test('should evaluate nested return statements', () => {
    const input = `
    if (10 > 1) {
      if (10 > 1) {
        return 10;
      }
      return 1;
    }
    `;

    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program, new Environment()) as obj.Object;
    expect(res.inspect()).toBe('10');
  });
});

describe('should evaluate let statements', () => {
  const tests = [
    ['let a = 5; a;', '5'],
    ['let a = 5 * 5; a;', '25'],
    ['let a = 5; let b = a; b;', '5'],
    ['let a = 5; let b = a; let c = a + b + 5; c;', '15'],
  ];

  test.each(tests)('%#: let statement eval test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program, new Environment()) as obj.Integer;
    expect(res.inspect()).toBe(expected);
  });
});

describe('test function evaluation', () => {
  test('should parse basic function', () => {
    let input = 'func(x) { x + 2; };';
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program, new Environment()) as obj.Function;
    expect(res.params.length).toBe(1);
    expect(res.params[0].toString()).toEqual('x');
    expect(res.body.toString()).toEqual('(x + 2)');
  });

  let tests = [
    ['let identity = func(x) { x; }; identity(5);', '5'],
    ['let identity = func(x) { return x; }; identity(5);', '5'],
    ['let add = func(x, y) { x + y; }; add(5, 5);', '10'],
    ['let double = func(x) { x * 2; }; double(5);', '10'],
    ['let add = func(x, y) { x + y; }; add(5 + 5, add(5, 5));', '20'],
    ['func(x) { x; }(5)', '5'],
  ];

  test.each(tests)('%#: function eval test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();

    let res = Eval(program, new Environment()) as obj.Integer;
    expect(res.inspect()).toEqual(expected);
  });
});

describe('test iter loop evaluation', () => {
  test('should parse basic iter loop', () => {
    let input = 'iter(5) { 5 };';
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();
    let res = Eval(program, new Environment());
    // expect(res.params[0].toString()).toEqual('x');
    // expect(res.body.toString()).toEqual('(x + 2)');
  });

  let tests = [
    ['let x = 5; iter(5) { let x = x + 5; }; x;', '30'],
    ['let x = 1; iter(8) { let x = x * 2; }; x;', '256'],
  ];

  test.each(tests)('%#: iter test test:', (input, expected) => {
    const lex = new Lexer(String(input));
    const p = new Parser(lex);
    const program = p.parseProgram();
    let res = Eval(program, new Environment()) as obj.Integer;
    expect(res.inspect()).toEqual(expected);
  });
});
