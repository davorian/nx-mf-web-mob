const path = require('path');
const sharedDeps = require(path.resolve(__dirname, '../../shared-deps.json'));
const sharedMobDeps = require(path.resolve(__dirname, '../../shared-deps-mob.json'));
const { dependencies } = require('./package.json');

module.exports = {
  name: 'mob_remote2',
  remotes: {
    
  },
  exposes: {
      // TODO: Add exposes manually
  },
  filename: 'remoteEntry.js',
  shared: {
    ...Object.fromEntries(
      Object.entries({ ...sharedDeps, ...sharedMobDeps }).map(([dep, version]) => [
        dep,
        { singleton: true, requiredVersion: version || dependencies[dep] }
      ])
    )
    // You can add more custom shared config here if needed
  },
}; 