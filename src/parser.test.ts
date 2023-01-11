import Lexer from './lexer';
import { Parser } from './parser';

describe('parser should parse LET Statements', () => {
  const input = `
  let x = 5;
  let y = 12;
  let foobar = 242424;
  `;

  let lex = new Lexer(input);
  let p = new Parser(lex);

  let program = p.parseProgram();
  test('parser should contain three statements', () => {
    expect(program).not.toBeNull();
    expect(program.statements).toHaveLength(3);
  });
});
