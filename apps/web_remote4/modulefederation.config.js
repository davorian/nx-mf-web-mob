const path = require('path');
const sharedDeps = require(path.resolve(__dirname, '../../shared-deps.json'));
const sharedWebDeps = require(path.resolve(__dirname, '../../shared-deps-web.json'));
const { dependencies } = require('./package.json');

module.exports = {
  name: 'web_remote4',
  remotes: {
    
  },
  exposes: {
      './App': './src/app/app'
  },
  filename: 'remoteEntry.js',
  shared: {
    ...Object.fromEntries(
      Object.entries({ ...sharedDeps, ...sharedWebDeps }).map(([dep, version]) => [
        dep,
        { singleton: true, requiredVersion: version || dependencies[dep] }
      ])
    )
    // You can add more custom shared config here if needed
  },
}; 