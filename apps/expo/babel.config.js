module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "nativewind/babel",
      require.resolve("expo-router/babel"),
      "babel-plugin-transform-typescript-metadata"
    ],
    presets: ["babel-preset-expo"]
  };
};
