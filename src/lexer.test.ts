import { Lexer } from './lexer';
import * as Token from './token';

describe('lexer should return right token (basic)', () => {
  const input = '=+(),;*/- ++ -- //';
  const tests = [
    [{ token: Token.ASSIGN, literal: '=' }],
    [{ token: Token.PLUS, literal: '+' }],
    [{ token: Token.LPAREN, literal: '(' }],
    [{ token: Token.RPAREN, literal: ')' }],
    [{ token: Token.COMMA, literal: ',' }],
    [{ token: Token.SEMICOLON, literal: ';' }],
    [{ token: Token.ASTERIK, literal: '*' }],
    [{ token: Token.SLASH, literal: '/' }],
    [{ token: Token.MINUS, literal: '-' }],
    [{ token: Token.UNARY_ADD, literal: '++' }],
    [{ token: Token.UNARY_MINUS, literal: '--' }],
    [{ token: Token.COMMENT, literal: '//' }],
    [{ token: Token.EOF, literal: 'eof' }],
  ];

  let lex = new Lexer(input);
  test.each(tests)('returns expected token: %s', (expected) => {
    let tok = lex.nextToken();
    expect(tok.type).toEqual(expected.token);
    expect(tok.literal).toEqual(expected.literal);
  });
});

describe('lexer should return right token (advance)', () => {
  const input = `let five = 5;
let ten = 10;

let add = func(x, y) {
  x + y;
};

let result = add(five, ten);`;

  let tests = [
    [Token.LET, 'let'],
    [Token.IDENT, 'five'],
    [Token.ASSIGN, '='],
    [Token.INT, '5'],
    [Token.SEMICOLON, ';'],
    [Token.LET, 'let'],
    [Token.IDENT, 'ten'],
    [Token.ASSIGN, '='],
    [Token.INT, '10'],
    [Token.SEMICOLON, ';'],
    [Token.LET, 'let'],
    [Token.IDENT, 'add'],
    [Token.ASSIGN, '='],
    [Token.FUNCTION, 'func'],
    [Token.LPAREN, '('],
    [Token.IDENT, 'x'],
    [Token.COMMA, ','],
    [Token.IDENT, 'y'],
    [Token.RPAREN, ')'],
    [Token.LBRACE, '{'],
    [Token.IDENT, 'x'],
    [Token.PLUS, '+'],
    [Token.IDENT, 'y'],
    [Token.SEMICOLON, ';'],
    [Token.RBRACE, '}'],
    [Token.SEMICOLON, ';'],
    [Token.LET, 'let'],
    [Token.IDENT, 'result'],
    [Token.ASSIGN, '='],
    [Token.IDENT, 'add'],
    [Token.LPAREN, '('],
    [Token.IDENT, 'five'],
    [Token.COMMA, ','],
    [Token.IDENT, 'ten'],
    [Token.RPAREN, ')'],
    [Token.SEMICOLON, ';'],
    [Token.EOF, 'eof'],
  ];

  let lex = new Lexer(input);
  test.each(tests)('expected token to be type %s with literal %s', (type, literal) => {
    let tok = lex.nextToken();
    expect(tok.type).toEqual(type);
    expect(tok.literal).toEqual(literal);
  });
});
