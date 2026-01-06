import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { CodeBlock } from './CodeBlock';
import { loadFont } from "@remotion/google-fonts/jetbrains-mono";

const { fontFamily } = loadFont();

export const TipVideo: React.FC<{ title: string; codeSnippet: string; audioPath: string }> = ({ title, codeSnippet, audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Fade in title
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', fontFamily }}>
      
      {/* 1. Audio */}
      {audioPath && <Audio src={audioPath} />}

      {/* 2. Title */}
      <Sequence from={0}>
        <AbsoluteFill style={{ justifyContent: 'start', alignItems: 'center', paddingTop: 180 }}>
            <h1 style={{ 
                color: '#38bdf8', 
                fontSize: 80, 
                lineHeight: 1.1,
                textAlign: 'center', 
                margin: '0 50px',
                opacity 
            }}>
            {title}
            </h1>
        </AbsoluteFill>
      </Sequence>

      {/* 3. Code Block (Starts at 1 second mark) */}
      <Sequence from={30}> 
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 150 }}>
            <div style={{ width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
                <CodeBlock code={codeSnippet} language="python" />
            </div>
        </AbsoluteFill>
      </Sequence>

       {/* 4. Footer */}
       <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60 }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 35, fontWeight: 'bold' }}>
                @CodeFlow
            </div>
       </AbsoluteFill>

    </AbsoluteFill>
  );
};