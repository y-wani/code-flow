import { Highlight, themes } from 'prism-react-renderer';
import { useCurrentFrame } from 'remotion';

export const CodeBlock = ({ code, language = 'python' }) => {
  const frame = useCurrentFrame();
  
  // Typing effect: Shows 2 characters per frame.
  const charsToShow = Math.floor(frame * 2); 
  const currentCode = code.slice(0, charsToShow);

  return (
    <div style={{ fontSize: '36px', fontFamily: 'JetBrains Mono, monospace', textAlign: 'left' }}>
      <Highlight
        theme={themes.dracula}
        code={currentCode}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{ ...style, padding: '30px', borderRadius: '15px', overflow: 'hidden' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};