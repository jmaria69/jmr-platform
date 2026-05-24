import React from "react";
import { Composition, registerRoot } from "remotion";
import { AdminAppVideo } from "./scenes/AdminAppVideo";
import { CoreOpsVideo } from "./scenes/CoreOpsVideo";
import { OlgaAiVideo } from "./scenes/OlgaAiVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AdminApp"
        component={AdminAppVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CoreOps"
        component={CoreOpsVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="OlgaAi"
        component={OlgaAiVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
