import { Composition } from 'remotion';
import { TipVideo } from './TipVideo';
// We use require here so the app doesn't crash if the file is missing initially
const tipsData = require('./data/tips.json'); 

import './style.css'; 

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {tipsData.map((tip: any) => {
        return (
            <Composition
            key={tip.id}
            id={tip.id}
            component={TipVideo}
            durationInFrames={30 * 20} // Default 20 seconds, adjust if audio is longer
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
                title: tip.title,
                codeSnippet: tip.code_snippet,
                audioPath: tip.audio_path,
            }}
            />
        );
      })}
    </>
  );
};