import * as tok from './token';
import { Token } from './token';

interface INode {
  tokenLiteral(): string;
}

export interface StatementNode {
  statementNode(): void;
}

export interface ExpressionNode {
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
  name: string;
  value: string;

  constructor() {
    super(new Token(tok.LET));
    this.name;
    this.value;
  }

  statementNode(): void {
    //
  }

  toString() {
    return `LET ${this.name.toString()} = ${this.value}`;
  }
}

export class Identifier extends Node implements ExpressionNode {
  value: string;

  constructor(value: string) {
    super(new Token(tok.IDENT));
    this.value = value;
  }

  expressionNode(): void {}

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString() {
    return this.value;
  }
}

class Program {
  statements: StatementNode[];
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
