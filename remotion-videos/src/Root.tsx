import React from "react";
import { Composition, registerRoot } from "remotion";
import { AdminAppVideo } from "./scenes/AdminAppVideo";
import { CoreOpsVideo } from "./scenes/CoreOpsVideo";
import { OlgaAiVideo } from "./scenes/OlgaAiVideo";
import { ViralFacebookVideo } from "./scenes/ViralFacebookVideo";
import { ViralFacturas2026 } from "./scenes/ViralFacturas2026";
import { ViralSiamNis2 } from "./scenes/ViralSiamNis2";
import { ViralAdminAppVera } from "./scenes/ViralAdminAppVera";
import { ViralPraxiaLabsBrand } from "./scenes/ViralPraxiaLabsBrand";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Nuevos Vídeos Virales 2026 Cinemáticos (9:16 vertical) */}
      <Composition
        id="ViralFacturas2026"
        component={ViralFacturas2026}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ViralSiamNis2"
        component={ViralSiamNis2}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ViralAdminAppVera"
        component={ViralAdminAppVera}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ViralPraxiaLabsBrand"
        component={ViralPraxiaLabsBrand}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Vídeo Viral para Reels / TikTok / YouTube Shorts (9:16 vertical) */}
      <Composition
        id="ViralFacebookVideo"
        component={ViralFacebookVideo}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Adaptador para Feed de Facebook / Instagram (4:5) */}
      <Composition
        id="ViralFacebookFeed"
        component={ViralFacebookVideo}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1350}
      />
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
