import { Composition } from 'remotion';
import { TipVideo } from './TipVideo';
import './index.css';

// Use require() to avoid build errors if file is missing initially
const tipsData = require('./data/tips.json');

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {tipsData.map((tip: any) => {
        return (
          <Composition
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
              // 👇 ADD THIS LINE
              productionSnippet: tip.production_snippet || tip.code_snippet, // Fallback to basic if production is missing
              audioPath: tip.audio_path,
            }}  
          />
        );
      })}
    </>
  );
};