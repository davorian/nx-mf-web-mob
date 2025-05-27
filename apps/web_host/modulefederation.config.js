const path = require('path');
const sharedDeps = require(path.resolve(__dirname, '../../shared-deps.json'));
const sharedWebDeps = require(path.resolve(__dirname, '../../shared-deps-web.json'));
const { dependencies } = require('./package.json');

module.exports = {
  name: 'web_host',
  remotes: {
      web_remote1: 'web_remote1@http://localhost:4201/remoteEntry.js',
  web_remote2: 'web_remote2@http://localhost:4202/remoteEntry.js',
  web_remote3: 'web_remote3@http://localhost:4203/remoteEntry.js',
  web_remote4: 'web_remote4@http://localhost:4204/remoteEntry.js',
  },
  exposes: {
    
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