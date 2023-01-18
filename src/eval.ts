import * as ast from './ast';
import * as obj from './object';

const NULL = new obj.Null();

export const Eval = (node: ast.INode): any => {
  let typ = node.constructor.name;
  console.log(typ);
  if (typ === 'Program') {
    let n2 = node as ast.Program;
    return evalStatements(n2.statements);
  } else if (typ === 'ExpressionStatement') {
    let n2 = node as ast.ExpressionStatement;
    return Eval(n2.expression);
  } else if (typ === 'IntegerLiteral') {
    let n2 = node as ast.IntegerLiteral;
    return new obj.Integer(n2.tokenLiteral());
  } else if (typ === 'Boolean') {
    let n2 = node as ast.Boolean;
    return new obj.Boolean(n2.value);
  } else if (typ === 'BangExpression') {
    let n2 = node as ast.BangExpression;
    return evalPrefixExpression('!', Eval(n2.right));
  } else if (typ === 'InfixExpression') {
    let n2 = node as ast.InfixExpression;
    return evalInfixExpression(n2.tokenLiteral(), Eval(n2.left), Eval(n2.right));
  }
};

const evalStatements = (stmts: ast.StatementNode[]) => {
  let res: obj.Object;
  stmts.forEach((stmt) => (res = Eval(stmt)));
  return res;
};

const evalBangOperatorExpression = (right: obj.Object) => {
  if (right.type() === obj.BOOLEAN_OBJ && right.inspect() === 'false') {
    return new obj.Boolean(true);
  } else {
    return new obj.Boolean(false);
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
  } else {
    return NULL;
  }
};

const evalInfixExpression = (op: string, left: obj.Object, right: obj.Object): obj.Object => {
  const [lTyp, rTyp] = [left.type(), right.type()];
  if (lTyp === obj.INTEGER_OBJ && rTyp === obj.INTEGER_OBJ) {
    return evalIntegerInfix(op, left as obj.Integer, right as obj.Integer);
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
    while (isLarger(temp, divisor) || temp.length === divisor.length) {
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
