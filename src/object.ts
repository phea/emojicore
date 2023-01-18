export interface Object {
  type(): ObjectType;
  inspect(): string;
}

export const INTEGER_OBJ: ObjectType = 'INTEGER';
export const ENTEGER_OBJ: ObjectType = 'ENTEGER';
export const BOOLEAN_OBJ: ObjectType = 'BOOLEAN';
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

export class Null implements Object {
  inspect(): string {
    return 'null';
  }
  type(): string {
    return NULL_OBJ;
  }
}
