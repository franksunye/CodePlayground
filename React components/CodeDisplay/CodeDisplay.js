import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; // 使用 Prism.js 的 Okaidia 主题

const CodeDisplay = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  // 每当代码或语言变更时，重新应用高亮
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // 3秒后复位复制状态
    });
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span>{language.toUpperCase()}</span>
        <button onClick={handleCopy} className="copy-button">
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <pre><code className={`language-${language}`}>{code}</code></pre>
    </div>
  );
};

export default CodeDisplay;
