import * as ast from './ast';
import { Environment } from './env';
import * as obj from './object';

const NULL = new obj.Null();
const TRUE = new obj.Boolean(true);
const FALSE = new obj.Boolean(false);

const nativeBoolToBoolObject = (input: boolean) => {
  if (input) {
    return TRUE;
  }
  return FALSE;
};

export const Eval = (node: ast.INode, env: Environment): any => {
  let typ = node.constructor.name;
  // console.log(typ);
  if (typ === 'Program') {
    let n2 = node as ast.Program;
    return evalProgram(n2.statements, env);
  } else if (typ === 'ExpressionStatement') {
    let n2 = node as ast.ExpressionStatement;
    return Eval(n2.expression, env);
  } else if (typ === 'IntegerLiteral') {
    let n2 = node as ast.IntegerLiteral;
    return new obj.Integer(n2.tokenLiteral());
  } else if (typ === 'EntegerLiteral') {
    let n2 = node as ast.EntegerLiteral;
    return new obj.Enteger(n2.tokenLiteral());
  } else if (typ === 'Boolean') {
    let n2 = node as ast.Boolean;
    return new obj.Boolean(n2.value);
  } else if (typ === 'BangExpression') {
    let n2 = node as ast.BangExpression;
    return evalPrefixExpression('!', Eval(n2.right, env));
  } else if (typ === 'InfixExpression') {
    let n2 = node as ast.InfixExpression;
    return evalInfixExpression(n2.tokenLiteral(), Eval(n2.left, env), Eval(n2.right, env));
  } else if (typ === 'IfExpression') {
    let n2 = node as ast.IfExpression;
    return evalIfExpression(n2, env);
  } else if (typ === 'BlockStatement') {
    let n2 = node as ast.BlockStatement;
    return evalBlockStatement(n2.statements, env);
  } else if (typ === 'ReturnStatement') {
    let n2 = node as ast.ReturnStatement;
    return new obj.ReturnValue(Eval(n2.returnValue, env));
  } else if (typ === 'LetStatement') {
    let n2 = node as ast.LetStatement;
    let val = Eval(n2.value, env);
    env.set(n2.name.value, val);
  } else if (typ === 'Identifier') {
    let n2 = node as ast.Identifier;
    return evalIdentifier(n2, env);
  } else if (typ === 'FunctionLiteral') {
    let n2 = node as ast.FunctionLiteral;
    let params = n2.params;
    let body = n2.body;
    let o = new obj.Function();
    o.body = body;
    o.params = params;
    o.env = env;
    return o;
  } else if (typ === 'CallExpression') {
    let n2 = node as ast.CallExpression;
    let fn = Eval(n2.func, env);

    let args = evalExpressions(n2.args, env);
    return applyFunction(fn, args);
  } else if (typ === 'IterStatement') {
    let n2 = node as ast.IterStatement;
    let o = new obj.Iter();
    o.limit = n2.limit as ast.IntegerLiteral;
    o.body = n2.block;
    o.env = env;

    return evalIter(o.limit, o.body, env);
  }
};

const evalIter = (limit: ast.IntegerLiteral, block: ast.BlockStatement, env: Environment) => {
  let intObj = new obj.Integer(limit.tokenLiteral());
  let res: obj.Object;
  intObj.inspect();
  while (intObj.inspect() !== '0') {
    res = Eval(block, env);
    intObj.value = subtractArrays(intObj.value, [1]);
    intObj.inspect();
  }
  return res;
};

const evalProgram = (stmts: ast.StatementNode[], env: Environment) => {
  let res: obj.Object;
  for (let i = 0; i < stmts.length; i++) {
    res = Eval(stmts[i], env);
    if (res !== undefined && res.type() === obj.RETURN_VALUE_OBJ) {
      let r2 = res as obj.ReturnValue;
      return r2.value;
    }
  }
  return res;
};

const applyFunction = (fn: obj.Object, args: obj.Object[]) => {
  const typ = fn.type();
  if (typ === obj.FUNCTION_OBJ) {
    let f2 = fn as obj.Function;

    let extendedEnv = extendedFunctionEnv(f2, args);
    let res = Eval(f2.body, extendedEnv);
    return unwrapReturnValue(res);
  } else if (typ === obj.BUILTIN_OBJ) {
    let f2 = fn as obj.Builtin;
    return f2.fn(...args);
  }

  return NULL;
};

const extendedFunctionEnv = (fn: obj.Function, args: obj.Object[]) => {
  let env = new Environment(fn.env);
  for (let i = 0; i < fn.params.length; i++) {
    env.set(fn.params[i].value, args[i]);
  }
  return env;
};

const unwrapReturnValue = (o: obj.Object) => {
  if (o.type() === obj.RETURN_VALUE_OBJ) {
    let o2 = o as obj.ReturnValue;
    return o2.value;
  }
  return o;
};

const evalExpressions = (exps: ast.ExpressionNode[], env: Environment) => {
  let res: obj.Object[] = [];
  for (let i = 0; i < exps.length; i++) {
    res.push(Eval(exps[i], env));
  }
  return res;
};

const evalBlockStatement = (stmts: ast.StatementNode[], env: Environment) => {
  let res: obj.Object;
  for (let i = 0; i < stmts.length; i++) {
    res = Eval(stmts[i], env);
    if (res !== undefined && res.type() === obj.RETURN_VALUE_OBJ) {
      return res;
    }
  }
  return res;
};

const evalBangOperatorExpression = (right: obj.Object) => {
  if (right.type() === obj.BOOLEAN_OBJ && right.inspect() === 'false') {
    return TRUE;
  } else {
    return FALSE;
  }
};

const evalIntegerInfix = (op: string, left: obj.Integer, right: obj.Integer): obj.Object => {
  const [lVal, rVal] = [left.value, right.value];
  if (op === '+') {
    let res = addArrays(lVal, rVal);
    return new obj.Integer(res.reverse().join(''));
  } else if (op === '-') {
    let res = subtractArrays(lVal, rVal);
    return new obj.Integer(res.reverse().join(''));
  } else if (op === '*') {
    let res = multiplyArrays(lVal.reverse(), rVal.reverse());
    return new obj.Integer(res.join(''));
  } else if (op === '/') {
    let res = divideArrays(lVal, rVal);
    return new obj.Integer(res.join(''));
  } else if (op === '<') {
    return nativeBoolToBoolObject(!isLarger(lVal, rVal) && !isEqual(lVal, rVal));
  } else if (op === '>') {
    return nativeBoolToBoolObject(isLarger(lVal, rVal));
  } else if (op === '==') {
    return nativeBoolToBoolObject(isEqual(lVal, rVal));
  } else if (op === '!=') {
    return nativeBoolToBoolObject(!isEqual(lVal, rVal));
  } else {
    return NULL;
  }
};

const evalEntegerInfix = (op: string, left: obj.Integer, right: obj.Integer): obj.Object => {
  const [lVal, rVal] = [left.value, right.value];
  if (op === '+') {
    let res = addArrays(lVal, rVal);
    return new obj.Enteger(res.reverse().join(''));
  } else if (op === '-') {
    let res = subtractArrays(lVal, rVal);
    return new obj.Enteger(res.reverse().join(''));
  } else if (op === '*') {
    let res = multiplyArrays(lVal.reverse(), rVal.reverse());
    return new obj.Enteger(res.join(''));
  } else if (op === '/') {
    let res = divideArrays(lVal, rVal);
    return new obj.Enteger(res.join(''));
  } else if (op === '<') {
    return nativeBoolToBoolObject(!isLarger(lVal, rVal) && !isEqual(lVal, rVal));
  } else if (op === '>') {
    return nativeBoolToBoolObject(isLarger(lVal, rVal));
  } else if (op === '==') {
    return nativeBoolToBoolObject(isEqual(lVal, rVal));
  } else if (op === '!=') {
    return nativeBoolToBoolObject(!isEqual(lVal, rVal));
  } else {
    return NULL;
  }
};

const evalInfixExpression = (op: string, left: obj.Object, right: obj.Object): obj.Object => {
  const [lTyp, rTyp] = [left.type(), right.type()];
  if (lTyp === obj.INTEGER_OBJ && rTyp === obj.INTEGER_OBJ) {
    return evalIntegerInfix(op, left as obj.Integer, right as obj.Integer);
  } else if (lTyp === obj.ENTEGER_OBJ && rTyp === obj.ENTEGER_OBJ) {
    return evalEntegerInfix(op, left as obj.Enteger, right as obj.Enteger);
  } else if (op === '==') {
    return nativeBoolToBoolObject(left.inspect() === right.inspect());
  } else if (op === '!=') {
    return nativeBoolToBoolObject(left.inspect() !== right.inspect());
  } else {
    return NULL;
  }
};

const evalIdentifier = (node: ast.Identifier, env: Environment) => {
  const val = env.get(node.value);
  if (val !== undefined) {
    return val;
  }

  if (builtins[node.value] !== undefined) {
    return builtins[node.value];
  }
  return NULL;
};

const evalIfExpression = (expr: ast.IfExpression, env: Environment) => {
  let condition = Eval(expr.condition, env) as obj.Boolean;
  if (condition.value) {
    return Eval(expr.consequence, env);
  } else if (expr.alternative !== undefined) {
    return Eval(expr.alternative, env);
  } else {
    return NULL;
  }
};

const evalPrefixExpression = (op: string, right: obj.Object) => {
  if (op === '!') {
    return evalBangOperatorExpression(right);
  } else {
    return NULL;
  }
};

const addArrays = (arr1: number[], arr2: number[]) => {
  let res = [];
  let carry = 0;
  let len = Math.max(arr1.length, arr2.length);
  for (let i = 0; i < len; i++) {
    let a = arr1[i] || 0;
    let b = arr2[i] || 0;
    let sum = a + b + carry;

    if (sum > 9) {
      carry = 1;
      sum = sum % 10;
    } else {
      carry = 0;
    }

    res.push(sum);
  }

  if (carry) {
    res.push(carry);
  }

  return res;
};

const isLarger = (arr1: number[], arr2: number[]) => {
  if (arr1.length > arr2.length) {
    return true;
  } else if (arr1.length < arr2.length) {
    return false;
  } else {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] > arr2[i]) {
        return true;
      } else if (arr1[i] < arr2[i]) {
        return false;
      }
    }
    return false;
  }
};

const isEqual = (arr1: number[], arr2: number[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

function subtractArrays(arr1: number[], arr2: number[]) {
  if (isLarger(arr2, arr1)) {
    return [0];
  }

  var res = [];
  var borrow = 0;
  var len = Math.max(arr1.length, arr2.length);
  for (var i = 0; i < len; i++) {
    var a = arr1[i] || 0;
    var b = arr2[i] || 0;
    var diff = a - b - borrow;

    if (diff < 0) {
      borrow = 1;
      diff = diff + 10;
    } else {
      borrow = 0;
    }

    res.push(diff);
  }

  while (res.length > 1 && res[res.length - 1] === 0) {
    res.pop();
  }

  return res;
}

function multiplyArrays(arr1: number[], arr2: number[]) {
  let res = new Array(arr1.length + arr2.length).fill(0);
  let carry = 0;
  let len1 = arr1.length;
  let len2 = arr2.length;
  for (let i = len1 - 1; i >= 0; i--) {
    carry = 0;
    for (let j = len2 - 1; j >= 0; j--) {
      let product = arr1[i] * arr2[j] + res[i + j + 1] + carry;
      carry = Math.floor(product / 10);
      res[i + j + 1] = product % 10;
    }
    res[i] = res[i] + carry;
  }
  while (res.length > 1 && res[0] === 0) {
    res.shift();
  }
  return res;
}

function divideArrays(dividend: number[], divisor: number[]) {
  if ((divisor.length === 1 && divisor[0] === 0) || isLarger(divisor, dividend)) {
    return [0];
  }

  var quotient = [],
    remainder = [],
    temp: number[] = [],
    quotientDigit;

  for (var i = 0; i < dividend.length; i++) {
    temp.push(dividend[i]);
    quotientDigit = 0;
    while (isLarger(temp, divisor) || isEqual(temp, divisor)) {
      temp = subtractArrays(temp, divisor);
      quotientDigit++;
    }
    quotient.push(quotientDigit);
  }

  while (quotient.length > 1 && quotient[0] === 0) {
    quotient.shift();
  }

  while (temp.length > 1 && temp[0] === 0) {
    temp.shift();
  }
  remainder = temp;

  return quotient;
}

const printFn: obj.BuiltinFunction = (...args: obj.Object[]): obj.Object => {
  args.forEach((arg) => console.log(arg.inspect()));
  return NULL;
};

const castInt: obj.BuiltinFunction = (...args: obj.Object[]): obj.Object => {
  if (args.length === 0) {
    return NULL;
  } else if (args[0].type() === obj.INTEGER_OBJ) {
    return args[0];
  } else if (args[0].type() === obj.ENTEGER_OBJ) {
    return new obj.Integer(args[0].inspect());
  } else {
    return NULL;
  }
};

const castEnt: obj.BuiltinFunction = (...args: obj.Object[]): obj.Object => {
  if (args.length === 0) {
    return NULL;
  } else if (args[0].type() === obj.ENTEGER_OBJ) {
    return args[0];
  } else if (args[0].type() === obj.INTEGER_OBJ) {
    return new obj.Enteger(args[0].inspect());
  } else {
    return NULL;
  }
};

const builtins: { [k: string]: obj.Builtin } = {
  print: new obj.Builtin(printFn),
  int: new obj.Builtin(castInt),
  ent: new obj.Builtin(castEnt),
};
