import * as ast from './ast';
import * as obj from './object';
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

const evalPrefixExpression = (op: string, right: obj.Object) => {
  if (op === '!') {
    return evalBangOperatorExpression(right);
  } else {
    return null;
  }
};
