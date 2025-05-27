const path = require('path');
const sharedDeps = require(path.resolve(__dirname, '../../shared-deps.json'));
const sharedMobDeps = require(path.resolve(__dirname, '../../shared-deps-mob.json'));
const { dependencies } = require('./package.json');

module.exports = {
  name: 'mob_host',
  remotes: {
    mob_remote1: 'mob_remote1@http://localhost:8082/remoteEntry.js',
    mob_remote2: 'mob_remote2@http://localhost:8083/remoteEntry.js',
    mob_remote3: 'mob_remote3@http://localhost:8084/remoteEntry.js',
    mob_remote4: 'mob_remote4@http://localhost:8085/remoteEntry.js',
  },
  exposes: {

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
