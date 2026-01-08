import React from 'react';
import { CodeBlock } from './CodeBlock';

// 👈 Update props to accept activeLine
export const IdeWindow: React.FC<{ code: string; filename: string; activeLine?: number | null }> = ({ code, filename, activeLine }) => {
  
  // 📏 Auto-Scaling Logic (Same as before)
  const longestLine = code.split('\n').reduce((a, b) => (a.length > b.length ? a : b), '').length;
  const calculatedFontSize = Math.max(16, Math.min(28, 800 / longestLine * 1.8));

  return (
    <div style={{
      width: '95%',
      height: '80%',
      backgroundColor: '#161b22',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #30363d',
      margin: 'auto'
    }}>
      
      {/* Header */}
      <div style={{
        height: '50px',
        backgroundColor: '#0d1117',
        borderBottom: '1px solid #30363d',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', gap: '8px', marginRight: '20px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
        </div>
        <div style={{
          padding: '8px 20px',
          backgroundColor: '#161b22',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          borderTop: '2px solid #58a6ff',
          borderRadius: '4px 4px 0 0'
        }}>
          {filename}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex' }}>
        
        {/* Sidebar */}
        <div style={{
          width: '200px',
          borderRight: '1px solid #30363d',
          padding: '20px',
          color: '#8b949e',
          fontFamily: 'sans-serif',
          fontSize: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>EXPLORER</div>
          <div>📂 src</div>
          <div>&nbsp; 📄 app.py</div>
          <div style={{ color: 'white', backgroundColor: '#30363d', padding: '2px 5px', borderRadius: '4px' }}>
             📄 {filename}
          </div>
        </div>

        {/* Code Area */}
        <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '100%' }}>
             {/* 👇 Pass activeLine down */}
             <CodeBlock 
                code={code} 
                customFontSize={calculatedFontSize} 
                activeLine={activeLine}
             />
          </div>
        </div>

      </div>
    </div>
  );
};