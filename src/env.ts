import * as obj from './object';

export class Environment {
  store: { [k: string]: obj.Object };
  outer: Environment;

  constructor(outer?: Environment) {
    this.store = {};
    this.outer = outer;
  }

  get(name: string): obj.Object {
    let val = this.store[name];
    if (val === undefined && this.outer !== undefined) {
      val = this.outer.get(name);
    }
    return val;
  }

  set(name: string, val: obj.Object) {
    this.store[name] = val;
    return val;
  }
}
