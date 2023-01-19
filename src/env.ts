import * as obj from './object';

export class Environment {
  store: { [k: string]: obj.Object };
  constructor() {
    this.store = {};
  }

  get(name: string): obj.Object {
    return this.store[name];
  }

  set(name: string, val: obj.Object) {
    this.store[name] = val;
    return val;
  }
}
