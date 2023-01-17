import Lexer from './lexer';
import { Parser } from './parser';
import * as ast from './ast';
import * as tok from './token';
import { Token } from './token';

describe('parser should parse LET Statements', () => {
  test('parser should contain three statements and zero errors', () => {
    const input = `
  let x = 5;
  let y = 12;
  let foobar = 242424;
  `;

    const lex = new Lexer(input);
    const p = new Parser(lex);

    const program = p.parseProgram();
    expect(program).not.toBeNull();
    expect(program.statements).toHaveLength(3);
    expect(p.errors()).toHaveLength(0);
  });

  test('it should catch parsing errors', () => {
    const input = `let = 5;`;

    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();
    expect(program).not.toBeNull();
    expect(p.errors().length).toBeGreaterThan(0);
  });
});

describe('parser should parse RETURN Statements', () => {
  test('parser should contain three statements and zero errors', () => {
    const input = `
  return 5;
  return 12;
  return 242424;
  `;

    const lex = new Lexer(input);
    const p = new Parser(lex);

    const program = p.parseProgram();
    expect(program).not.toBeNull();
    expect(program.statements).toHaveLength(3);
    expect(p.errors()).toHaveLength(0);
  });
});

describe('parser should handle expression statements', () => {
  test('identifier expressions', () => {
    const input = 'foobar;';

    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    expect(p.errors()).toHaveLength(0);
    expect(program.statements.length).toEqual(1);
    expect(program.statements[0]).toBeInstanceOf(ast.ExpressionStatement);
    const token = new Token(tok.IDENT, 'foobar');
    const stmt = Object.assign(new ast.ExpressionStatement(token), program.statements[0]);
    expect(stmt.token.literal).toBe('foobar');
  });
});

describe('parser should handle integer literals', () => {
  test('integer literals', () => {
    const input = '5';
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    expect(program.statements.length).toEqual(1);
    expect(program.statements[0]).toBeInstanceOf(ast.ExpressionStatement);
    const token = new Token(tok.INT, '5');
    const stmt = Object.assign(new ast.ExpressionStatement(token), program.statements[0]);
    expect(stmt.token.literal).toBe('5');
  });
});

describe('parser should handle bang operator', () => {
  let tests = [['!5;', '5']];

  test.each(tests)('expected proper BANG parsing', (input, rightLiteral) => {
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    expect(program.statements.length).toEqual(1);
    expect(program.statements[0]).toBeInstanceOf(ast.ExpressionStatement);
    // TODO: test out expression literal string
  });
});

describe('parser should handle parsing infix operator', () => {
  const tests = [
    ['3 + 5;', '+'],
    ['3 - 5;', '-'],
    ['3 * 5;', '*'],
    ['3 / 5;', '/'],
    ['3 > 5;', '>'],
    ['3 < 5;', '<'],
    ['3 == 5;', '=='],
    ['3 != 5;', '!='],
  ];

  test.each(tests)('infix operator test:', (input, op) => {
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    expect(program.statements.length).toEqual(1);
    expect(program.statements[0]).toBeInstanceOf(ast.ExpressionStatement);

    let stmt = program.statements[0] as ast.ExpressionStatement;
    let expr = stmt.expression as ast.InfixExpression;
    expect(expr.left.tokenLiteral()).toEqual('3');
    expect(expr.tokenLiteral()).toEqual(op);
    expect(expr.right.tokenLiteral()).toEqual('5');
  });
});

describe('test order of operations', () => {
  const tests = [
    ['a * b', '(a * b)'],
    ['!a', '(!a)'],
    ['a + b + c', '((a + b) + c)'],
    ['a + b - c', '((a + b) - c)'],
    ['a * b * c', '((a * b) * c)'],
    ['a * b / c', '((a * b) / c)'],
    ['a + b * c', '(a + (b * c))'],
    ['a + b * c + d / e - f', '(((a + (b * c)) + (d / e)) - f)'],
    ['5 > 4 == 3 < 4', '((5 > 4) == (3 < 4))'],
    ['5 < 4 != 3 > 4', '((5 < 4) != (3 > 4))'],
    ['3 + 4 * 5 == 3 * 1 + 4 * 5', '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))'],
    ['true', 'true'],
    ['false', 'false'],
    ['3 > 5 == false', '((3 > 5) == false)'],
    ['3 < 5 == true', '((3 < 5) == true)'],
    ['1 + (2 +3) + 4', '((1 + (2 + 3)) + 4)'],
    ['(5 + 5) * 2', '((5 + 5) * 2)'],
    ['2 / (5 + 5)', '(2 / (5 + 5))'],
    // ['!(true == true)', '(!(true == true))'],
  ];

  test.each(tests)('%#: order of operations precendence testing: "%s"', (input, expected) => {
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    expect(program.statements[0]).toBeInstanceOf(ast.ExpressionStatement);
    let stmt = program.statements[0] as ast.ExpressionStatement;
    expect(stmt.toString()).toEqual(expected);
  });
});

describe('parser should handle booleans', () => {
  test('test true boolean', () => {
    const input = 'true';
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    expect(program.statements.length).toEqual(1);
    expect(program.statements[0]).toBeInstanceOf(ast.ExpressionStatement);
    const token = new Token(tok.TRUE, 'true');
    const stmt = Object.assign(new ast.ExpressionStatement(token), program.statements[0]);
    expect(stmt.token.literal).toBe('true');
  });

  test('test false boolean', () => {
    const input = 'false';
    const lex = new Lexer(input);
    const p = new Parser(lex);
    const program = p.parseProgram();

    expect(program.statements.length).toEqual(1);
    expect(program.statements[0]).toBeInstanceOf(ast.ExpressionStatement);
    const token = new Token(tok.FALSE, 'false');
    const stmt = Object.assign(new ast.ExpressionStatement(token), program.statements[0]);
    expect(stmt.token.literal).toBe('false');
  });
});
