import { inspect } from 'util';
import * as ast from './ast';
import { Environment } from './env';

export interface Object {
  type(): ObjectType;
  inspect(): string;
}

export const INTEGER_OBJ: ObjectType = 'INTEGER';
export const ENTEGER_OBJ: ObjectType = 'ENTEGER';
export const BOOLEAN_OBJ: ObjectType = 'BOOLEAN';
export const RETURN_VALUE_OBJ: ObjectType = 'RETURN_VALUE';
export const FUNCTION_OBJ: ObjectType = 'FUNCTION';
export const ITER_OBJ: ObjectType = 'ITER';
export const BUILTIN_OBJ: ObjectType = 'BUILTIN';
export const NULL_OBJ: ObjectType = 'NULL';

export class Integer implements Object {
  value: number[];
  constructor(literal: string) {
    this.value = [];
    literal.split('').forEach((n) => this.value.push(Number(n)));
    this.value = this.value.reverse();
  }

  inspect(): string {
    return this.value.reverse().join('').toString();
  }

  type(): string {
    return INTEGER_OBJ;
  }
}

export class Enteger implements Object {
  value: number[];
  constructor(literal: string) {
    this.value = [];
    literal.split('').forEach((n) => this.value.push(Number(n)));
    this.value = this.value.reverse();
  }

  inspect(): string {
    var ents: string[] = [];
    this.value.forEach((n) => ents.push(`${n}\uFE0F\u20E3`));
    return ents.reverse().join('').toString();
  }

  type(): string {
    return ENTEGER_OBJ;
  }
}

export class Boolean implements Object {
  value: boolean;
  constructor(value: boolean) {
    this.value = value;
  }

  inspect(): string {
    return this.value.toString();
  }

  type(): string {
    return BOOLEAN_OBJ;
  }
}

export class ReturnValue implements Object {
  value: Object;
  constructor(value: Object) {
    this.value = value;
  }

  type(): string {
    return RETURN_VALUE_OBJ;
  }

  inspect(): string {
    return this.value.inspect();
  }
}

export class Function implements Object {
  params: ast.Identifier[];
  body: ast.BlockStatement;
  env: Environment;

  type(): string {
    return FUNCTION_OBJ;
  }

  inspect(): string {
    var buf = 'func(';
    buf += this.params.join(', ');
    buf += ') {\n';
    buf += this.body.toString();
    buf += '\n}';
    return buf;
  }
}

export class Iter implements Object {
  limit: ast.IntegerLiteral;
  body: ast.BlockStatement;
  env: Environment;

  type(): string {
    return FUNCTION_OBJ;
  }

  inspect(): string {
    var buf = 'iter(';
    buf += this.limit.toString();
    buf += ') {\n';
    buf += this.body.toString();
    buf += '\n}';
    return buf;
  }
}

export type BuiltinFunction = (...args: Object[]) => Object;

export class Builtin implements Object {
  fn: BuiltinFunction;
  constructor(fn: BuiltinFunction) {
    this.fn = fn;
  }

  type(): string {
    return BUILTIN_OBJ;
  }

  inspect(): string {
    return 'builtin function';
  }
}

export class Null implements Object {
  inspect(): string {
    return 'null';
  }
  type(): string {
    return NULL_OBJ;
  }
}
