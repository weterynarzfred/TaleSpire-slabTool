module.exports = function override(config) {
  // disable manifest
  config.plugins = config.plugins.filter(
    plugin => plugin?.options?.fileName !== 'asset-manifest.json'
  );
  return config;
};
