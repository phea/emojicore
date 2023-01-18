export interface Object {
  type(): ObjectType;
  inspect(): string;
}

export const INTEGER_OBJ: ObjectType = 'INTEGER';
export const ENTEGER_OBJ: ObjectType = 'ENTEGER';
export const BOOLEAN_OBJ: ObjectType = 'BOOLEAN';

export class Integer implements Object {
  value: number[];
  constructor(literal: string) {
    this.value = [];
    literal.split('').forEach((n) => this.value.push(Number(n)));
  }

  inspect(): string {
    return this.value.join('').toString();
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
  }

  inspect(): string {
    var buf = '';
    this.value.forEach((n) => (buf += `${n}\uFE0F\u20E3`));
    return buf;
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
