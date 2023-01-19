import { useState } from 'react';
import Lexer from '../../lexer';
import { Parser } from '../../parser';
import { Environment } from '../../env';
import { Eval } from '../../eval';

const languageSpec = `
Type
ints: non-negative integers
ents: non-negative integers in emoji form
bools: true / false

Arithmetic Operations
+ add                      - subtract
* multiply                 / division
++ add 1                   -- subtract 1

Equality
! bang                     == equality
!= not equals              < less than
> greater than

Assignment
let <identifier> = <expression>;

If-else
if(<condition>) { <blockstatement> };
if(<condition>) { <blockstatement> } else { <blockstatement> };

Loop
iter(<expression>) { <blockstatement> };

Functions
func(<params>) { <blockstatement> };

Builtins
print(): print
int(): cast to int type
ent(): cast to ent type
`;
const Code = () => {
  // const head = `<head>
  // <style type="text/css">
  //   body{
  //     width: 400px;
  //     height: 300px;
  //     overflow: hidden;
  //     margin: 0;
  //   }
  // </style>
  // </head>`;

  const resetCode = () => {
    setCode('');
  };

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const submitCode = () => {
    let stdLog: any = {};
    stdLog = console.log.bind(console);
    let logs: string[] = [];
    console.log = function () {
      // default &  console.log()
      stdLog.apply(console, arguments);
      // new & array data
      logs.push(Array.from(arguments).toString());
    };
    const lex = new Lexer(code);
    const p = new Parser(lex);
    const program = p.parseProgram();

    Eval(program, new Environment());

    setOutput(logs.join('\n'));
  };

  return (
    <div className="arena">
      <div className="editor-container">
        <textarea
          // disabled={!!isProcessing}
          id="editor"
          onChange={(e) => {
            setCode(e.target.value);
          }}
          value={code}
        ></textarea>
        <button className="btn-reset-code" onClick={resetCode}>
          Reset Code
        </button>
        <button className="btn-submit-code" onClick={submitCode}>
          Submit Code
        </button>
      </div>

      <div className="spec-container">
        <div className="spec-wrapper">
          <h4>LANGUAGE SPEC</h4>
          <pre>{languageSpec}</pre>
        </div>
        <hr className="hr-divider" />
        <h4>OUTPUT</h4>
        <div className="output-container">
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Code;
