import * as Token from './token';

export class Lexer {
  input: Array<string>;
  pos: number;
  readPos: number;
  ch: null | string;

  constructor(input: string) {
    this.input = Array.from(input);
    this.pos = 0;
    this.readPos = 0;
    this.ch = '';
    this.readChar();
  }

  readChar() {
    if (this.readPos >= this.input.length) {
      this.ch = null;
    } else {
      this.ch = this.input[this.readPos];
    }
    this.pos = this.readPos;
    this.readPos++;
  }

  peekChar(n = 1) {
    if (this.readPos >= this.input.length) {
      return null;
    } else {
      return this.input[this.readPos + (n - 1)];
    }
  }

  readIndentifier() {
    let start = this.pos;
    while (isLetter(this.ch)) {
      this.readChar();
    }
    this.readPos--;
    return this.input.slice(start, this.pos).join('');
  }

  readNum() {
    let start = this.pos;
    while (isDigit(this.ch)) {
      this.readChar();
    }
    this.readPos--;
    return this.input.slice(start, this.pos).join('');
  }
  skipWhiteSpace() {
    while (this.ch === ' ' || this.ch === '\t' || this.ch === '\n' || this.ch === '\r') {
      this.readChar();
    }
  }

  nextToken() {
    var tok: Token.Token;
    this.skipWhiteSpace();

    if (this.ch === '=') {
      tok = new Token.Token(Token.ASSIGN);
    } else if (this.ch === ';') {
      tok = new Token.Token(Token.SEMICOLON);
    } else if (this.ch === '(') {
      tok = new Token.Token(Token.LPAREN);
    } else if (this.ch === ')') {
      tok = new Token.Token(Token.RPAREN);
    } else if (this.ch === '{') {
      tok = new Token.Token(Token.LBRACE);
    } else if (this.ch === '}') {
      tok = new Token.Token(Token.RBRACE);
    } else if (this.ch === ',') {
      tok = new Token.Token(Token.COMMA);
    } else if (this.ch === '+') {
      if (this.peekChar() === '+') {
        this.readChar();
        tok = new Token.Token(Token.UNARY_ADD);
      } else {
        tok = new Token.Token(Token.PLUS);
      }
    } else if (this.ch === '-') {
      if (this.peekChar() === '-') {
        this.readChar();
        tok = new Token.Token(Token.UNARY_MINUS);
      } else {
        tok = new Token.Token(Token.MINUS);
      }
    } else if (this.ch === '*') {
      tok = new Token.Token(Token.ASTERIK);
    } else if (this.ch === '/') {
      if (this.peekChar() === '/') {
        this.readChar();
        tok = new Token.Token(Token.COMMENT);
      } else {
        tok = new Token.Token(Token.SLASH);
      }
    } else if (this.ch === null) {
      tok = new Token.Token(Token.EOF);
    } else {
      if (isLetter(this.ch)) {
        let ident = this.readIndentifier();
        if (Token.keywords[ident] !== undefined) {
          tok = Token.keywords[ident];
        } else {
          tok = new Token.Token(Token.IDENT, ident);
        }
      } else if (isDigit(this.ch)) {
        let num = this.readNum();
        if (this.peekChar(2) === '⃣') {
          this.readChar();
          this.readChar();
          // tok = entTokens[num];
          // have to read the ents
        } else {
          tok = new Token.Token(Token.INT, num);
        }
      } else {
        tok = new Token.Token(Token.ILLEGAL);
      }
    }
    this.readChar();
    return tok;
  }
}

const isLetter = (ch: string) => {
  if (ch === null) {
    return false;
  }

  let code = ch.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

const isDigit = (ch: string) => {
  return parseInt(ch) >= 0 && parseInt(ch) <= 9;
};
export default Lexer;
