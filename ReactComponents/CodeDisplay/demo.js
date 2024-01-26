import React from 'react';
import CodeDisplay from './CodeDisplay';
import './CodeDisplay.css'; // 导入 CSS 样式

function App() {
  const sampleCode = `function helloWorld() {
    console.log("Hello, world!");
  }`;

  return (
    <div>
      <CodeDisplay language="javascript" code={sampleCode} />
    </div>
  );
}

export default App;
