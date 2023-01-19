import Lexer from './lexer';
import * as tok from './token';
import * as ast from './ast';
import { Token } from './token';

declare type PrefixParseFn = () => ast.ExpressionNode;
declare type InfixParseFn = (exp: ast.ExpressionNode) => ast.ExpressionNode;

enum Precendence {
  LOWEST = 1,
  EQUALS, // ==
  LESSGREATER, // < or >
  SUM, // +
  PRODUCT, // *
  PREFIX, // !X
  CALL, // func(x)
}

const precendences: { [key: TokenType]: Precendence } = {
  [tok.EQL]: Precendence.EQUALS,
  [tok.NOT_EQL]: Precendence.EQUALS,
  [tok.LT]: Precendence.LESSGREATER,
  [tok.GT]: Precendence.LESSGREATER,
  [tok.PLUS]: Precendence.SUM,
  [tok.MINUS]: Precendence.SUM,
  [tok.SLASH]: Precendence.PRODUCT,
  [tok.ASTERISK]: Precendence.PRODUCT,
  [tok.LPAREN]: Precendence.CALL,
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

    // Register prefix parse tokens
    this.registerPrefix(tok.IDENT, () => new ast.Identifier(this.curToken.literal));
    this.registerPrefix(tok.INT, this.parseIntegerLiteral);
    this.registerPrefix(tok.BANG, this.parseBangExpression);
    this.registerPrefix(tok.TRUE, this.parseBoolean);
    this.registerPrefix(tok.FALSE, this.parseBoolean);
    this.registerPrefix(tok.LPAREN, this.parseGroupedExpression);
    this.registerPrefix(tok.IF, this.parseIfExpression);
    this.registerPrefix(tok.FUNCTION, this.parseFunctionLiteral);

    // Register infix parse tokens
    this.registerInfix(tok.PLUS, this.parseInfixExpression);
    this.registerInfix(tok.MINUS, this.parseInfixExpression);
    this.registerInfix(tok.SLASH, this.parseInfixExpression);
    this.registerInfix(tok.ASTERISK, this.parseInfixExpression);
    this.registerInfix(tok.EQL, this.parseInfixExpression);
    this.registerInfix(tok.NOT_EQL, this.parseInfixExpression);
    this.registerInfix(tok.LT, this.parseInfixExpression);
    this.registerInfix(tok.GT, this.parseInfixExpression);
    this.registerInfix(tok.LPAREN, this.parseCallExpression);

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
    } else if (this.curToken.type === tok.ITER) {
      return this.parseIterStatement();
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

    this.nextToken();
    stmt.value = this.parseExpression(Precendence.LOWEST);
    while (!this.curTokenIs(tok.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  parseIterStatement() {
    const stmt = new ast.IterStatement();
    if (!this.expectPeek(tok.LPAREN)) {
      return null;
    }
    stmt.limit = this.parseExpression(Precendence.LOWEST);
    while (!this.curTokenIs(tok.RPAREN)) {
      this.nextToken();
    }

    if (!this.expectPeek(tok.LBRACE)) {
      return null;
    }

    stmt.block = this.parseBlockStatement();
    return stmt;
  }

  parseReturnStatement() {
    const stmt = new ast.ReturnStatement();
    this.nextToken();

    stmt.returnValue = this.parseExpression(Precendence.LOWEST);
    while (!this.curTokenIs(tok.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  parseIntegerLiteral() {
    return new ast.IntegerLiteral(this.curToken.literal);
  }

  parseBangExpression() {
    this.nextToken(); // have to bind this to the  class
    const right = this.parseExpression(Precendence.PREFIX); // Prefix.PRECEDENCE
    return new ast.BangExpression(right);
  }

  parseBoolean() {
    return new ast.Boolean(this.curTokenIs(tok.TRUE));
  }

  parseGroupedExpression() {
    this.nextToken();
    const exp = this.parseExpression(Precendence.LOWEST);
    if (!this.expectPeek(tok.RPAREN)) {
      return null;
    }

    return exp;
  }

  parseIfExpression() {
    let expr = new ast.IfExpression();
    if (!this.expectPeek(tok.LPAREN)) {
      return null;
    }

    this.nextToken();
    expr.condition = this.parseExpression(Precendence.LOWEST);
    if (!this.expectPeek(tok.RPAREN)) {
      return null;
    }
    if (!this.expectPeek(tok.LBRACE)) {
      return null;
    }

    expr.consequence = this.parseBlockStatement();
    if (this.peekTokenIs(tok.ELSE)) {
      this.nextToken();
      if (!this.expectPeek(tok.LBRACE)) {
        return null;
      }
      expr.alternative = this.parseBlockStatement();
    }
    return expr;
  }

  parseBlockStatement() {
    let block = new ast.BlockStatement();
    this.nextToken();

    while (!this.curTokenIs(tok.RBRACE) && !this.curTokenIs(tok.EOF)) {
      let stmt = this.parseStatement();
      if (stmt !== undefined) {
        block.statements.push(stmt);
      }
      this.nextToken();
    }
    return block;
  }

  parseFunctionLiteral() {
    let lit = new ast.FunctionLiteral(this.curToken.literal);
    if (!this.expectPeek(tok.LPAREN)) {
      return null;
    }

    lit.params = this.parseFunctionParameters();

    if (!this.expectPeek(tok.LBRACE)) {
      return null;
    }

    lit.body = this.parseBlockStatement();
    return lit;
  }

  parseFunctionParameters() {
    let idents: ast.Identifier[] = [];
    if (this.peekTokenIs(tok.RPAREN)) {
      this.nextToken();
      return idents;
    }

    this.nextToken();
    let ident = new ast.Identifier(this.curToken.literal);
    idents.push(ident);

    while (this.peekTokenIs(tok.COMMA)) {
      this.nextToken();
      this.nextToken();
      let ident = new ast.Identifier(this.curToken.literal);
      idents.push(ident);
    }

    if (!this.expectPeek(tok.RPAREN)) {
      return null;
    }
    return idents;
  }

  parseCallExpression(func: ast.ExpressionNode) {
    let exp = new ast.CallExpression(func);
    exp.args = this.parseCallArguments();
    return exp;
  }

  parseCallArguments() {
    let args: ast.ExpressionNode[] = [];
    if (this.peekTokenIs(tok.RPAREN)) {
      this.nextToken();
      return args;
    }

    this.nextToken();
    args.push(this.parseExpression(Precendence.LOWEST));
    while (this.peekTokenIs(tok.COMMA)) {
      this.nextToken();
      this.nextToken();
      args.push(this.parseExpression(Precendence.LOWEST));
    }

    if (!this.expectPeek(tok.RPAREN)) {
      return null;
    }
    return args;
  }

  parseExpression(precedence: Precendence) {
    const prefix = this.prefixParseFns[this.curToken.type];
    if (prefix === undefined) {
      return null;
    }

    let leftExp = prefix();
    while (!this.peekTokenIs(tok.SEMICOLON) && precedence < this.peekPrecedence()) {
      const infix = this.infixParseFns[this.peekToken.type];
      if (infix === undefined) {
        return leftExp;
      }

      this.nextToken();
      leftExp = infix(leftExp);
    }
    return leftExp;
  }

  parseExpressionStatement() {
    const stmt = new ast.ExpressionStatement(this.curToken);
    stmt.expression = this.parseExpression(Precendence.LOWEST);

    if (this.peekTokenIs(tok.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  registerPrefix(tokenType: TokenType, fn: PrefixParseFn) {
    this.prefixParseFns[tokenType] = fn.bind(this);
  }

  parseInfixExpression(left: ast.ExpressionNode) {
    let expr = new ast.InfixExpression(left, this.curToken.literal);

    let prec = this.curPrecedence();
    this.nextToken();
    expr.right = this.parseExpression(prec);
    return expr;
  }

  registerInfix(tokenType: TokenType, fn: InfixParseFn) {
    this.infixParseFns[tokenType] = fn.bind(this);
  }

  curTokenIs(tokenType: TokenType) {
    return this.curToken.type === tokenType;
  }

  peekTokenIs(tokenType: TokenType) {
    return this.peekToken.type === tokenType;
  }

  peekPrecedence() {
    return precendences[this.peekToken.type] || Precendence.LOWEST;
  }

  curPrecedence() {
    return precendences[this.curToken.type] || Precendence.LOWEST;
  }

  errors() {
    return this.errs;
  }

  peekError(tokenType: TokenType) {
    this.errs.push(`expected next token to be ${this.peekToken.type}, got ${tokenType}`);
  }
}
