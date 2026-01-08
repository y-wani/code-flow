import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  customFontSize?: number;
  activeLine?: number | null; // 👈 NEW PROP
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, customFontSize, activeLine }) => {
  // Default font size if not provided
  const fontSize = customFontSize || 32;
  const lineHeight = fontSize * 1.5; 
  const verticalPadding = 40; // Matches the padding in the container style below

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
            padding: `${verticalPadding}px 40px`, // Enforce padding for calculation
            borderRadius: '15px',
            fontSize: `${fontSize}px`,
            fontFamily: '"JetBrains Mono", monospace',
            lineHeight: '1.5', // 👈 STRICT LINE HEIGHT
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            width: '90%',
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative', // Needed for absolute positioning of the box
            overflow: 'hidden' // Keeps the glowing box inside
          }}
        >
          {/* ✨ GLOWING HIGHLIGHT BOX */}
          {activeLine !== undefined && activeLine !== null && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: verticalPadding, // Start where text starts
                height: lineHeight,
                // 🚀 SLIDING ANIMATION
                transform: `translateY(${activeLine * lineHeight}px)`,
                backgroundColor: 'rgba(56, 139, 253, 0.15)', // GitHub Blue tint
                borderLeft: '4px solid #58a6ff',
                boxShadow: '0 0 40px rgba(88, 166, 255, 0.2)',
                transition: 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)', // Smooth CSS slide
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
          )}

          <pre className={className} style={{ margin: 0, whiteSpace: 'pre-wrap', position: 'relative', zIndex: 1 }}>
            {tokens.map((line, i) => (
              <div 
                key={i} 
                {...getLineProps({ line })}
                style={{
                  // 🌑 DIMMING LOGIC
                  // If activeLine is set, and this isn't it -> Dim to 50%
                  opacity: (activeLine !== undefined && activeLine !== null && activeLine !== i) ? 0.3 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <span style={{ 
                    opacity: 0.5, 
                    marginRight: '20px', 
                    userSelect: 'none',
                    fontSize: `${fontSize * 0.75}px` 
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