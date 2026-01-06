import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { CodeBlock } from './components/CodeBlock';
import { IdeWindow } from './components/IdeWindow'; 
import './index.css'; 

// Define the props interface to include the new productionSnippet
interface TipVideoProps {
  title: string;
  codeSnippet: string;
  productionSnippet: string;
  audioPath?: string;
}

export const TipVideo: React.FC<TipVideoProps> = ({ title, codeSnippet, productionSnippet }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Define timing
    const part1Duration = fps * 4; // First 4 seconds: Typing Animation
    
    // --- ANIMATION LOGIC FOR PART 1 ---
    // Calculate how many characters to show based on the current frame.
    // We stop the typing animation calculation once Part 1 is over to save resources.
    const charsShown = Math.floor(frame * 2);
    const textToShow = codeSnippet.slice(0, charsShown);
    
    // Blinking Cursor Logic:
    // Only show cursor while typing. It blinks every 15 frames.
    // logic: show if we haven't finished typing AND if we are in the "on" phase of the blink
    const isTyping = frame < (codeSnippet.length / 2) + 20; 
    const isBlinkOn = frame % 15 < 7;
    const cursor = (isTyping && isBlinkOn) ? '▍' : ''; 

    return (
        <AbsoluteFill style={{ backgroundColor: '#0D1117' }}>
            
            {/* PART 1: The "Hook" - Typing Animation (0s -> 4s) */}
            <Sequence from={0} durationInFrames={part1Duration}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ 
                        color: 'white', 
                        fontFamily: 'JetBrains Mono', 
                        fontSize: '50px', 
                        marginBottom: '40px',
                        textAlign: 'center',
                        padding: '0 20px'
                    }}>
                        {title}
                    </h1>
                    {/* We use the animated text here */}
                    <CodeBlock code={textToShow + cursor} />
                </AbsoluteFill>
            </Sequence>

            {/* PART 2: The "Production" - Full IDE View (4s -> End) */}
            <Sequence from={part1Duration}>
                 <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    
                    <h2 style={{ 
                        color: '#58a6ff', 
                        fontFamily: 'JetBrains Mono', 
                        marginBottom: '30px',
                        fontSize: '40px'
                    }}>
                        Real World Impact 🚀
                    </h2>
                    
                    {/* We use the COMPLEX production snippet here inside the IDE window */}
                    <IdeWindow 
                        code={productionSnippet} 
                        filename="data_service.py" 
                    />

                 </AbsoluteFill>
            </Sequence>

        </AbsoluteFill>
    );
};