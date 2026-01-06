import { Composition } from 'remotion';
import { TipVideo, TipVideoProps } from './TipVideo'; // 👈 Import Props
import './index.css';

// Use require() to avoid build errors if file is missing initially
const tipsData = require('./data/tips.json');

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {tipsData.map((tip: any) => {
        return (
          // 👇 FIX: Pass the generic type here to satisfy TypeScript
          <Composition<TipVideoProps>
            key={tip.id}
            id={tip.id.replace(/_/g, '-')}
            component={TipVideo}
            durationInFrames={30 * 20}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              title: tip.title,
              codeSnippet: tip.code_snippet,
              productionSnippet: tip.production_snippet || tip.code_snippet, 
              audioPath: tip.audio_path,
            }}  
          />
        );
      })}
    </>
  );
};