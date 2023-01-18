import { useState } from 'react';

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
        <button className="btn-submit-code" onClick={resetCode}>
          Submit Code
        </button>
      </div>

      <div className="spec-container">
        <div className="spec-wrapper">
          <h4>LANGUAGE SPEC</h4>
          <p>Types: - ints - ents - bools</p>
          <p>Arithmic Ops: +, -, *, /</p>
          <p>Equality: ==, !=, !</p>
          <p>Unary ops: --, ++</p>
          <p>Assignment: let</p>
          <p>Looping: loop</p>
          <p>Functions: func, first class citizens</p>
          <p>Built-in functions: print, casting</p>
        </div>
        <hr className="hr-divider" />
        <h4>OUTPUT</h4>
        <div className="output-container">
          <h5>Hello world!</h5>
        </div>
      </div>
    </div>
  );
};

export default Code;
