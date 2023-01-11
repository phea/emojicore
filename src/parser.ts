import Lexer from './lexer';
import * as tok from './token';
import * as ast from './ast';
import { Token } from './token';

export class Parser {
  lex: Lexer;
  curToken: Token;
  peekToken: Token;

  constructor(lex: Lexer) {
    this.lex = lex;
    this.curToken;
    this.peekToken;

    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lex.nextToken();
  }

  parseStatement() {
    if (this.curToken.type === tok.LET) {
      console.log('found a LET statement');
      return this.parseLetStatement();
    } else {
      return null;
    }
  }

  parseProgram() {
    let program = new Program();
    while (this.curToken.type !== tok.EOF) {
      let stmt = this.parseStatement();
      if (stmt !== undefined) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  expectPeek(token: Token) {
    console.log('what is the peekToken', this.peekToken);
    if (this.peekTokenIs(token)) {
      this.nextToken();
      return true;
    } else {
      return false;
    }
  }

  parseLetStatement() {
    let stmt = new ast.LetStatement();
    if (!this.expectPeek(new Token(tok.IDENT))) {
      console.log('did I get an IDENT???');
      return null;
    }

    stmt.name = new ast.Identifier(this.curToken.literal).toString();
    if (!this.expectPeek(new Token(tok.ASSIGN))) {
      return null;
    }

    // wait to handle expression.
    while (!this.curTokenIs(new Token(tok.SEMICOLON))) {
      console.log('is this an infinite loop?');
      this.nextToken();
    }
    return stmt;
  }

  curTokenIs(token: Token) {
    return this.curToken.type === token.type;
  }

  peekTokenIs(token: Token) {
    console.log('peekToken', token.type, this.peekToken.type);
    return this.peekToken.type === token.type;
  }
}

class Program {
  statements: ast.StatementNode[];
  constructor() {
    this.statements = [];
  }

  toString() {
    let buf = '';
    this.statements.forEach((stmt) => {
      buf += stmt.toString();
    });
    return buf;
  }
}
