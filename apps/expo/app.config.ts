import { ConfigContext, ExpoConfig } from "@expo/config";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "HappyKids",
  slug: "mamnon",
  scheme: "expo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/app-icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/happy-kids-logo.png",
    resizeMode: "contain"
  },
  updates: {
    fallbackToCacheTimeout: 0
    // url: "https://u.expo.dev/86937d69-86ef-4543-b67f-31a8cfbd0c71"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/app-icon.png",
      backgroundColor: "#1750c9"
    },
    package: "com.hcmut.happykids",
    softwareKeyboardLayoutMode: "resize",
    googleServicesFile: "./google-services.json"
    // runtimeVersion: {
    //   "policy": "sdkVersion"
    // }
  },
  extra: {
    eas: {
      projectId: "86937d69-86ef-4543-b67f-31a8cfbd0c71"
    },
    expo: {
      plugins: [
        [
          "expo-notifications",
          {
            color: "#ffffff"
          }
        ]
      ]
    }
  },
  plugins: ["./expo-plugins/with-modify-gradle.js", "expo-build-properties"]
});

export default defineConfig;
