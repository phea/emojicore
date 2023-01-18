import * as tok from './token';
import { Token } from './token';

interface INode {
  tokenLiteral(): string;
  toString(): string;
}

export interface StatementNode extends INode {
  statementNode(): void;
}

export interface ExpressionNode extends INode {
  expressionNode(): void;
}

class Node implements INode {
  token: Token;
  constructor(token: Token) {
    this.token = token;
  }

  tokenLiteral() {
    return this.token.toString();
  }

  toString() {
    return 'node';
  }
}

export class LetStatement extends Node implements StatementNode {
  name: Identifier;
  value: Node;

  constructor() {
    super(new Token(tok.LET));
    this.name;
    this.value;
  }

  statementNode(): void {
    //
  }

  toString() {
    return `let ${this.name.toString()} = ${this.value};`;
  }
}

export class ReturnStatement extends Node implements StatementNode {
  returnValue: ExpressionNode;

  constructor() {
    super(new Token(tok.RETURN));
  }

  statementNode(): void {
    //
  }

  toString() {
    return this.token.literal;
  }
}

export class Identifier extends Node implements ExpressionNode {
  value: string;

  constructor(value: string) {
    super(new Token(tok.IDENT, value));
    this.value = value;
  }

  expressionNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString() {
    return this.value;
  }
}

export class IntegerLiteral extends Node implements ExpressionNode {
  value: string;
  constructor(value: string) {
    super(new Token(tok.INT, value));
    this.value = value;
  }

  expressionNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return this.token.literal;
  }
}

export class Boolean extends Node implements ExpressionNode {
  value: boolean;
  constructor(val: boolean) {
    if (val) {
      super(new Token(tok.TRUE, 'true'));
    } else {
      super(new Token(tok.FALSE, 'false'));
    }
    this.value = val;
  }

  expressionNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return this.token.literal;
  }
}

export class BangExpression extends Node implements ExpressionNode {
  right: ExpressionNode;
  constructor(right: ExpressionNode) {
    super(new Token(tok.BANG));
    this.right = right;
  }

  expressionNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString() {
    return `(!${this.right.tokenLiteral()})`;
  }
}

export class InfixExpression extends Node implements ExpressionNode {
  left: ExpressionNode;
  right: ExpressionNode;

  constructor(left: ExpressionNode, op: TokenType) {
    super(new Token(op));
    this.left = left;
  }

  expressionNode(): void {
    //
  }
  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `(${this.left} ${this.token} ${this.right})`;
  }
}

export class IfExpression extends Node implements ExpressionNode {
  condition: ExpressionNode;
  consequence: BlockStatement;
  alternative: BlockStatement;

  constructor() {
    super(new Token(tok.IF));
  }

  expressionNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    let buf = '';
    buf += `if${this.condition.toString()} ${this.consequence.toString()}`;

    if (this.alternative !== undefined) {
      buf += `else ${this.alternative.toString()}`;
    }
    return buf;
  }
}

export class BlockStatement extends Node implements StatementNode {
  statements: StatementNode[];
  constructor() {
    super(new Token(tok.LBRACE));
    this.statements = [];
  }

  statementNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString() {
    let buf = '';
    this.statements.forEach((stmt) => {
      buf += stmt.toString();
    });
    return buf;
  }
}

export class FunctionLiteral extends Node implements ExpressionNode {
  params: Identifier[];
  body: BlockStatement;
  constructor(literal: string) {
    super(new Token(tok.FUNCTION, literal));
  }

  expressionNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString() {
    let buf = '';
    let p: string[];
    this.params.forEach((param) => {
      p.push(param.toString());
    });
    buf += `${this.tokenLiteral()}(${p.join(', ')}) ${this.body.toString()}\n`;
    return buf;
  }
}

export class CallExpression extends Node implements ExpressionNode {
  func: ExpressionNode;
  args: ExpressionNode[];
  constructor(func: ExpressionNode) {
    super(new Token(tok.LPAREN, func.tokenLiteral()));
    this.func = func;
    this.args = [];
  }

  expressionNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString() {
    let a: string[] = [];
    this.args.forEach((arg) => {
      a.push(arg.toString());
    });

    return `${this.func.toString()}(${a.join(', ')})`;
  }
}

export class ExpressionStatement extends Node implements StatementNode {
  expression: ExpressionNode;
  constructor(token: Token) {
    super(token);
  }

  statementNode(): void {
    //
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    if (this.expression !== null) {
      return this.expression.toString();
    }
    return '';
  }
}

export class Program {
  statements: StatementNode[];
  constructor() {
    this.statements = [];
  }

  toString() {
    let buf = '';
    this.statements.forEach((stmt) => {
      buf += stmt.toString();
    });

    if (buf[buf.length - 1] !== ';') {
      buf += ';';
    }
    return buf;
  }
}
