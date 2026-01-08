import { Composition } from 'remotion';
import { TipVideo, TipVideoProps } from './TipVideo';
import './index.css';

// Use require() to avoid build errors if file is missing initially
const tipsData = require('./data/tips.json');

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {tipsData.map((tip: any) => {
        
        // ⏱️ DYNAMIC DURATION LOGIC
        // If audio_duration exists, use it. Default to 20s if missing.
        const audioDurationInSeconds = tip.audio_duration || 20;
        
        // 👇 FIX: Add +90 frames (3 seconds) of padding
        // This ensures the video lingers after the voice finishes so the music can swell/fade.
        const durationInFrames = Math.ceil(audioDurationInSeconds * 30) + 90;

        return (
          <Composition<TipVideoProps>
            key={tip.id}
            id={tip.id.replace(/_/g, '-')}
            component={TipVideo}
            durationInFrames={durationInFrames}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              title: tip.title,
              codeSnippet: tip.code_snippet,
              productionSnippet: tip.production_snippet || tip.code_snippet, 
              audioPath: tip.audio_path,
              audioDuration: audioDurationInSeconds,
            }}  
          />
        );
      })}
    </>
  );
};