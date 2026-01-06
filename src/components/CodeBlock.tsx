// src/components/CodeBlock.tsx
import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  customFontSize?: number; // Optional prop
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, customFontSize }) => {
  return (
    <Highlight
      theme={themes.vsDark}
      code={code}
      language="python"
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div
          style={{
            ...style,
            padding: '40px',
            borderRadius: '15px',
            // 👇 Use the custom size if provided, otherwise default to 32px
            fontSize: customFontSize ? `${customFontSize}px` : '32px', 
            fontFamily: '"JetBrains Mono", monospace',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            width: '90%',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <pre className={className} style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span style={{ 
                    opacity: 0.5, 
                    marginRight: '20px', 
                    userSelect: 'none',
                    // 👇 Scale line numbers slightly smaller than the code
                    fontSize: customFontSize ? `${customFontSize * 0.75}px` : '24px' 
                }}>
                  {i + 1}
                </span>
                
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  );
};