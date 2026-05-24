import { Config } from "@remotion/cli/config";

Config.setEntryPoint("./src/Root.tsx");
Config.setCodec("h264");
Config.setOutputLocation("out");
Config.setPixelFormat("yuv420p");
