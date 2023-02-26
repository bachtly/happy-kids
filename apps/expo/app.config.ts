import { ConfigContext, ExpoConfig } from "@expo/config";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "expo",
  slug: "capstone-project",
  scheme: "expo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/happy-kids-logo.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/happy-kids-logo.png",
    resizeMode: "contain"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/happy-kids-logo.png",
      backgroundColor: "#1750c9"
    },
    package: "com.hcmut.happykids"
  },
  extra: {
    eas: {
      projectId: "0d2986ef-bcf9-4c5a-934c-b4debb530bfd"
    }
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"]
});

export default defineConfig;
