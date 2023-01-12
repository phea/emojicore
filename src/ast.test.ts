import { Identifier, LetStatement, Program } from './ast';

describe('ast properly builds program', () => {
  test('builds LET statement', () => {
    let program = new Program();
    let letStmt = new LetStatement();
    letStmt.name = new Identifier('myVar');
    letStmt.value = new Identifier('anotherVar');

    program.statements.push(letStmt);
    expect(program.toString()).toEqual('let myVar = anotherVar;');
  });
});
