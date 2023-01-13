//////////////////////////////////////////////////////////
//
// **** LEXER ****
//
//////////////////////////////////////////////////////////
export const ILLEGAL: TokenType = 'ILLEGAL';
export const EOF: TokenType = 'eof';

// Identifiers and literals
export const IDENT: TokenType = 'IDENT';
export const INT: TokenType = 'INT';
export const ENT: TokenType = 'ENT';

// Operators
export const ASSIGN: TokenType = '=';
export const PLUS: TokenType = '+';
export const MINUS: TokenType = '-';
export const ASTERISK: TokenType = '*';
export const SLASH: TokenType = '/';
export const BANG: TokenType = '!';
export const LT: TokenType = '<';
export const GT: TokenType = '>';
export const EQL: TokenType = '==';
export const NOT_EQL: TokenType = '!=';
export const UNARY_ADD: TokenType = '++';
export const UNARY_MINUS: TokenType = '--';

// Delimiters
export const COMMA: TokenType = ',';
export const SEMICOLON: TokenType = ';';
export const COMMENT: TokenType = '//';
export const LPAREN: TokenType = '(';
export const RPAREN: TokenType = ')';
export const LBRACE: TokenType = '{';
export const RBRACE: TokenType = '}';

// Keywords
export const FUNCTION: TokenType = 'func';
export const LET: TokenType = 'let';
export const TRUE: TokenType = 'true';
export const FALSE: TokenType = 'false';
export const IF: TokenType = 'if';
export const ELSE: TokenType = 'else';
export const RETURN: TokenType = 'return';

export class Token {
  type: TokenType;
  literal: string;

  constructor(type: TokenType, literal?: string) {
    this.type = type;
    this.literal = literal || type;
  }

  toString() {
    return `[${this.type}]: ${this.literal}`;
  }
}

interface Keywords {
  [index: string]: Token;
}

export const keywords: Keywords = {
  let: new Token(LET),
  func: new Token(FUNCTION),
  true: new Token(TRUE),
  false: new Token(FALSE),
  if: new Token(IF),
  else: new Token(ELSE),
  return: new Token(RETURN),
};
