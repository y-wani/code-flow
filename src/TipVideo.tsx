import React from 'react';
import { 
  AbsoluteFill, 
  Sequence, 
  useCurrentFrame, 
  useVideoConfig, 
  Html5Audio, // 👈 FIX: Use Html5Audio instead of Audio
  interpolate, 
  Easing,
  staticFile // 👈 FIX: Wraps paths to work in production
} from 'remotion';
import { CodeBlock } from './components/CodeBlock';
import { IdeWindow } from './components/IdeWindow'; 
import './index.css'; 

// 👇 EXPORTED interface so Root.tsx can import it
export interface TipVideoProps {
  title: string;
  codeSnippet: string;
  productionSnippet: string;
  audioPath?: string;
}

export const TipVideo: React.FC<TipVideoProps> = ({ title, codeSnippet, productionSnippet, audioPath }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Define timing
    const part1Duration = fps * 4; 
    
    // --- ANIMATION 1: TYPING (Part 1) ---
    const charsShown = Math.floor(frame * 2.5); 
    const textToShow = codeSnippet.slice(0, charsShown);
    const isTyping = frame < (codeSnippet.length / 2) + 20; 
    const isBlinkOn = frame % 15 < 7;
    const cursor = (isTyping && isBlinkOn) ? '▍' : ''; 

    // --- ANIMATION 2: CAMERA ZOOM (Part 2) ---
    const zoomFrame = frame - part1Duration;
    const zoom = interpolate(
        zoomFrame,
        [0, durationInFrames - part1Duration], 
        [1, 1.15], 
        { extrapolateLeft: 'clamp', easing: Easing.out(Easing.quad) }
    );

    // --- AUDIO PATH NORMALIZATION ---
    // This makes sure 'static/audio/file.mp3' and '/audio/file.mp3' both work
    const cleanAudioPath = audioPath 
        ? audioPath.replace(/^\//, '').replace(/^static\//, '') 
        : null;

    return (
        <AbsoluteFill style={{ backgroundColor: '#0D1117' }}>
            
            {/* 🎤 TTS AUDIO */}
            {cleanAudioPath && (
                <Html5Audio src={staticFile(cleanAudioPath)} />
            )}

            {/* === PART 1: THE HOOK (0s -> 4s) === */}
            <Sequence from={0} durationInFrames={part1Duration}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    
                    {/* 🔴 STAMP: BASIC */}
                    <div style={{
                        position: 'absolute', 
                        top: 150,
                        backgroundColor: 'rgba(255, 95, 86, 0.2)',
                        border: '3px solid #ff5f56',
                        color: '#ff5f56',
                        padding: '10px 30px', 
                        borderRadius: '10px',
                        fontSize: '40px', 
                        fontWeight: 'bold',
                        fontFamily: 'JetBrains Mono',
                        transform: 'rotate(-5deg)',
                        zIndex: 10,
                        boxShadow: '0 0 20px rgba(255, 95, 86, 0.3)'
                    }}>
                        ❌ BASIC
                    </div>

                    <h1 style={{ 
                        color: 'white', 
                        fontFamily: 'JetBrains Mono', 
                        fontSize: '50px', 
                        marginBottom: '40px',
                        textAlign: 'center',
                        padding: '0 20px',
                        marginTop: '120px'
                    }}>
                        {title}
                    </h1>
                    
                    <CodeBlock code={textToShow + cursor} />
                </AbsoluteFill>
            </Sequence>

            {/* === PART 2: THE PAYOFF (4s -> End) === */}
            <Sequence from={part1Duration}>
                 <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    
                    {/* 🟢 STAMP: PRODUCTION */}
                    <div style={{
                        position: 'absolute', 
                        top: 150, 
                        zIndex: 20,
                        backgroundColor: 'rgba(39, 201, 63, 0.2)',
                        border: '3px solid #27c93f',
                        color: '#27c93f',
                        padding: '10px 30px', 
                        borderRadius: '10px',
                        fontSize: '40px', 
                        fontWeight: 'bold',
                        fontFamily: 'JetBrains Mono',
                        transform: 'rotate(-5deg)',
                        boxShadow: '0 0 20px rgba(39, 201, 63, 0.3)'
                    }}>
                        ✅ PRODUCTION
                    </div>

                    <h2 style={{ 
                        color: '#58a6ff', 
                        fontFamily: 'JetBrains Mono', 
                        marginBottom: '30px',
                        fontSize: '40px',
                        marginTop: '120px'
                    }}>
                        Real World Impact 🚀
                    </h2>
                    
                    {/* 🎥 THE ZOOM CONTAINER */}
                    <div style={{ 
                        transform: `scale(${zoom})`, 
                        width: '100%', 
                        height: '100%',
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center' 
                    }}>
                        <IdeWindow 
                            code={productionSnippet} 
                            filename="data_service.py" 
                        />
                    </div>

                 </AbsoluteFill>
            </Sequence>

        </AbsoluteFill>
    );
};