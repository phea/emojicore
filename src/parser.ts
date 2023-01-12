import Lexer from './lexer';
import * as tok from './token';
import * as ast from './ast';
import { Token } from './token';

declare type PrefixParseFn = () => ast.ExpressionNode;
declare type InfixParseFn = (exp: ast.ExpressionNode) => ast.ExpressionNode;

// TODO: probably need ot fix this
const prefixParseFns = () => {
  return {
    [tok.IDENT]: () => new ast.Identifier('test'),
  };
};

export class Parser {
  lex: Lexer;
  curToken: Token;
  peekToken: Token;
  errs: string[];
  prefixParseFns: { [key: TokenType]: PrefixParseFn };
  infixParseFns: { [key: TokenType]: InfixParseFn };

  constructor(lex: Lexer) {
    this.lex = lex;
    this.curToken;
    this.peekToken;
    this.errs = [];
    this.prefixParseFns = {};
    this.infixParseFns = {};

    // Register prefix parse functions
    this.registerPrefix(tok.IDENT, () => new ast.Identifier(this.curToken.literal));
    this.registerPrefix(tok.INT, this.parseIntegerLiteral);
    this.registerPrefix(tok.BANG, this.parseBangExpression);

    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lex.nextToken();
  }

  parseStatement() {
    if (this.curToken.type === tok.LET) {
      return this.parseLetStatement();
    } else if (this.curToken.type === tok.RETURN) {
      return this.parseReturnStatement();
    } else {
      return this.parseExpressionStatement();
    }
  }

  parseProgram() {
    const program = new ast.Program();
    while (this.curToken.type !== tok.EOF) {
      const stmt = this.parseStatement();
      if (stmt !== undefined) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  expectPeek(tokenType: TokenType) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(tokenType);
      return false;
    }
  }

  parseLetStatement() {
    const stmt = new ast.LetStatement();
    if (!this.expectPeek(tok.IDENT)) {
      return null;
    }

    stmt.name = new ast.Identifier(this.curToken.literal);
    if (!this.expectPeek(tok.ASSIGN)) {
      return null;
    }

    // wait to handle expression.
    while (!this.curTokenIs(tok.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  parseReturnStatement() {
    const stmt = new ast.ReturnStatement();
    this.nextToken();

    // wait to handle expression.
    while (!this.curTokenIs(tok.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  parseIntegerLiteral() {
    return new ast.IntegerLiteral(this.curToken.literal);
  }

  parseBangExpression() {
    this.nextToken();
    const right = this.parseExpression(6); // Precendence.PREFIX
    return new ast.BangExpression(right);
  }

  parseExpression(precedence: Precendence) {
    const prefix = this.prefixParseFns[this.curToken.type];
    if (prefix !== null) {
      return null;
    }

    const leftExp = prefix();
    return leftExp;
  }

  parseExpressionStatement() {
    const stmt = new ast.ExpressionStatement(this.curToken);
    stmt.expression = this.parseExpression(1);

    if (this.peekTokenIs(tok.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  registerPrefix(tokenType: TokenType, fn: PrefixParseFn) {
    this.prefixParseFns[tokenType] = fn;
  }

  curTokenIs(tokenType: TokenType) {
    return this.curToken.type === tokenType;
  }

  peekTokenIs(tokenType: TokenType) {
    return this.peekToken.type === tokenType;
  }

  errors() {
    return this.errs;
  }

  peekError(tokenType: TokenType) {
    this.errs.push(`expected next token to be ${this.peekToken.type}, got ${tokenType}`);
  }
}
