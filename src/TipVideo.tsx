import React from 'react';
import { 
  AbsoluteFill, 
  Sequence, 
  useCurrentFrame, 
  useVideoConfig, 
  Html5Audio, 
  interpolate, 
  Easing,
  staticFile 
} from 'remotion';
import { CodeBlock } from './components/CodeBlock';
import { IdeWindow } from './components/IdeWindow'; 
import './index.css'; 

export interface TipVideoProps {
  title: string;
  codeSnippet: string;
  productionSnippet: string;
  audioPath?: string;
  audioDuration?: number;
}

export const TipVideo: React.FC<TipVideoProps> = ({ 
  title, 
  codeSnippet, 
  productionSnippet, 
  audioPath, 
  audioDuration = 0 
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // --- TIMING CONFIGURATION ---
    const part1Duration = fps * 4; 
    const typingDuration = part1Duration - 30; 

    // --- ANIMATION 1: SMART TYPEWRITER ---
    const typingSpeed = Math.max(1, codeSnippet.length / typingDuration);
    const charsShown = Math.floor(frame * typingSpeed); 
    const textToShow = codeSnippet.slice(0, charsShown);
    
    const isTyping = frame < typingDuration; 
    const isTypingPhase = frame < typingDuration + 15; 
    const isBlinkOn = frame % 15 < 7;
    const cursor = (isTypingPhase && isBlinkOn) ? '▍' : ''; 

    // --- ANIMATION 2: ZOOM ---
    const zoomFrame = frame - part1Duration;
    const zoom = interpolate(
        zoomFrame,
        [0, durationInFrames - part1Duration], 
        [1, 1.15], 
        { extrapolateLeft: 'clamp', easing: Easing.out(Easing.quad) }
    );

    // --- FOCUS MODE ---
    const totalLines = productionSnippet.split('\n').length;
    const highlightProgress = interpolate(
        frame,
        [part1Duration + 30, durationInFrames - 30], 
        [0, totalLines - 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const activeLine = frame > part1Duration ? Math.floor(highlightProgress) : null;

    // --- AUDIO LOGIC ---
    const cleanAudioPath = audioPath ? audioPath.replace(/^\//, '').replace(/^static\//, '') : null;
    const ttsEndFrame = (audioDuration || 0) * fps;
    const musicVolume = interpolate(
        frame,
        [0, 10, ttsEndFrame, ttsEndFrame + 20, durationInFrames - 40, durationInFrames],
        [0.1, 0.1, 0.1, 0.5, 0.5, 0], 
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const keyboardVolume = isTyping ? 0.25 : 0;

    return (
        <AbsoluteFill style={{ backgroundColor: '#0D1117' }}>
            
            {/* 🛑 THE VISUAL HOOK OVERLAY (First 1.5 Seconds) */}
            <Sequence from={0} durationInFrames={45}>
                 <AbsoluteFill style={{ 
                     justifyContent: 'center', 
                     alignItems: 'center', 
                     zIndex: 100, // Top layer
                     backgroundColor: 'rgba(0,0,0,0.85)' // Dim the background
                 }}>
                     <h1 style={{
                         fontFamily: 'JetBrains Mono',
                         fontSize: '120px',
                         color: 'white',
                         textAlign: 'center',
                         lineHeight: '1.1',
                         transform: `scale(${interpolate(frame, [0, 5, 40, 45], [0.8, 1, 1, 1.2], { extrapolateLeft: 'clamp' })})`,
                         opacity: interpolate(frame, [35, 45], [1, 0]) // Fade out quickly at end
                     }}>
                         <span style={{ color: '#ff5f56' }}>JUNIOR</span>
                         <br />
                         VS
                         <br />
                         <span style={{ color: '#27c93f' }}>SENIOR</span>
                     </h1>
                 </AbsoluteFill>
            </Sequence>

            {/* 🎧 AUDIO LAYERS */}
            {cleanAudioPath && <Html5Audio src={staticFile(cleanAudioPath)} />}
            <Html5Audio src={staticFile("audio/beat.mp3")} volume={musicVolume} loop />
            <Html5Audio src={staticFile("audio/keyboard.mp3")} volume={keyboardVolume} loop />

            {/* === VISUALS: PART 1 (THE HOOK) === */}
            <Sequence from={0} durationInFrames={part1Duration}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{
                        position: 'absolute', top: 150, zIndex: 10,
                        backgroundColor: 'rgba(255, 95, 86, 0.2)', border: '3px solid #ff5f56', color: '#ff5f56',
                        padding: '10px 30px', borderRadius: '10px', fontSize: '40px', fontWeight: 'bold',
                        fontFamily: 'JetBrains Mono', transform: 'rotate(-5deg)', boxShadow: '0 0 20px rgba(255, 95, 86, 0.3)'
                    }}>❌ BASIC</div>
                    
                    <h1 style={{ color: 'white', fontFamily: 'JetBrains Mono', fontSize: '50px', marginBottom: '40px', textAlign: 'center', padding: '0 20px', marginTop: '120px' }}>
                        {title}
                    </h1>
                    
                    <CodeBlock code={textToShow + cursor} />
                </AbsoluteFill>
            </Sequence>

            {/* === VISUALS: PART 2 (THE PAYOFF) === */}
            <Sequence from={part1Duration}>
                 <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute', top: 150, zIndex: 20,
                        backgroundColor: 'rgba(39, 201, 63, 0.2)', border: '3px solid #27c93f', color: '#27c93f',
                        padding: '10px 30px', borderRadius: '10px', fontSize: '40px', fontWeight: 'bold',
                        fontFamily: 'JetBrains Mono', transform: 'rotate(-5deg)', boxShadow: '0 0 20px rgba(39, 201, 63, 0.3)'
                    }}>✅ PRODUCTION</div>

                    <h2 style={{ color: '#58a6ff', fontFamily: 'JetBrains Mono', marginBottom: '30px', fontSize: '40px', marginTop: '120px' }}>
                        Real World Impact 🚀
                    </h2>
                    
                    <div style={{ transform: `scale(${zoom})`, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <IdeWindow 
                            code={productionSnippet} 
                            filename="data_service.py" 
                            activeLine={activeLine} 
                        />
                    </div>
                 </AbsoluteFill>
            </Sequence>

        </AbsoluteFill>
    );
};